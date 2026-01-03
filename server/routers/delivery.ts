import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { deliveryConfig } from "../../drizzle/schema";
import { eq, and, isNull } from "drizzle-orm";

/**
 * 配送方式配置路由
 * 支持全局配置和门店级配置
 */
export const deliveryRouter = router({
  /**
   * 获取配送配置（公开接口，前端结算页使用）
   * 优先返回门店配置，如果没有则返回全局配置
   */
  getConfig: publicProcedure
    .input(
      z.object({
        storeId: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        let config;

        // 如果指定了门店ID，先查询门店配置
        if (input.storeId) {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          config = await db
            .select()
            .from(deliveryConfig)
            .where(eq(deliveryConfig.storeId, input.storeId))
            .limit(1);

          if (config.length > 0) {
            return config[0];
          }
        }

        // 查询全局配置
        const db2 = await getDb();
        if (!db2) throw new Error("Database not available");
        config = await db2
          .select()
          .from(deliveryConfig)
          .where(isNull(deliveryConfig.storeId))
          .limit(1);

        if (config.length > 0) {
          return config[0];
        }

        // 如果没有任何配置，返回默认值
        return {
          id: 0,
          storeId: null,
          deliveryEnabled: true,
          pickupEnabled: true,
          deliveryFee: "0.00",
          freeDeliveryThreshold: null,
          minOrderAmount: "0.00",
          deliveryRadius: 5000,
          estimatedDeliveryTime: 30,
          estimatedPickupTime: 15,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } catch (error) {
        console.error("[Delivery Config] Error getting config:", error);
        throw new Error("Failed to get delivery config");
      }
    }),

  /**
   * 获取所有配送配置（管理后台使用）
   */
  list: protectedProcedure.query(async () => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const configs = await db.select().from(deliveryConfig);
      return configs;
    } catch (error) {
      console.error("[Delivery Config] Error listing configs:", error);
      throw new Error("Failed to list delivery configs");
    }
  }),

  /**
   * 创建或更新配送配置
   */
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        storeId: z.number().nullable().optional(),
        deliveryEnabled: z.boolean(),
        pickupEnabled: z.boolean(),
        deliveryFee: z.string().regex(/^\d+(\.\d{1,2})?$/),
        freeDeliveryThreshold: z.string().regex(/^\d+(\.\d{1,2})?$/).nullable().optional(),
        minOrderAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
        deliveryRadius: z.number().int().min(0),
        estimatedDeliveryTime: z.number().int().min(0),
        estimatedPickupTime: z.number().int().min(0),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        if (id) {
          // 更新现有配置
          await db
            .update(deliveryConfig)
            .set({
              ...data,
              updatedAt: new Date(),
            })
            .where(eq(deliveryConfig.id, id));

          return { success: true, id };
        } else {
          // 检查是否已存在相同的配置
          const existing = await db
            .select()
            .from(deliveryConfig)
            .where(
              data.storeId
                ? eq(deliveryConfig.storeId, data.storeId)
                : isNull(deliveryConfig.storeId)
            )
            .limit(1);

          if (existing.length > 0) {
            // 更新现有配置
            await db
              .update(deliveryConfig)
              .set({
                ...data,
                updatedAt: new Date(),
              })
              .where(eq(deliveryConfig.id, existing[0].id));

            return { success: true, id: existing[0].id };
          } else {
            // 创建新配置
            const result = await db.insert(deliveryConfig).values(data);
            return { success: true, id: Number(result.insertId) };
          }
        }
      } catch (error) {
        console.error("[Delivery Config] Error upserting config:", error);
        throw new Error("Failed to upsert delivery config");
      }
    }),

  /**
   * 删除配送配置
   */
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(deliveryConfig).where(eq(deliveryConfig.id, input.id));
        return { success: true };
      } catch (error) {
        console.error("[Delivery Config] Error deleting config:", error);
        throw new Error("Failed to delete delivery config");
      }
    }),

  /**
   * 检查配送是否可用
   * 用于前端下单前验证
   */
  checkAvailability: publicProcedure
    .input(
      z.object({
        storeId: z.number().optional(),
        deliveryType: z.enum(["delivery", "pickup"]),
        orderAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
        distance: z.number().optional(), // 配送距离（米）
      })
    )
    .query(async ({ input }) => {
      try {
        // 获取配置
        let config;

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        if (input.storeId) {
          const storeConfig = await db
            .select()
            .from(deliveryConfig)
            .where(eq(deliveryConfig.storeId, input.storeId))
            .limit(1);

          if (storeConfig.length > 0) {
            config = storeConfig[0];
          }
        }

        if (!config) {
          const globalConfig = await db
            .select()
            .from(deliveryConfig)
            .where(isNull(deliveryConfig.storeId))
            .limit(1);

          if (globalConfig.length > 0) {
            config = globalConfig[0];
          }
        }

        // 如果没有配置，默认都可用
        if (!config) {
          return {
            available: true,
            reason: null,
            deliveryFee: "0.00",
            minOrderAmount: "0.00",
            estimatedTime: input.deliveryType === "delivery" ? 30 : 15,
          };
        }

        // 检查配送方式是否开启
        if (input.deliveryType === "delivery" && !config.deliveryEnabled) {
          return {
            available: false,
            reason: "delivery_disabled",
            deliveryFee: config.deliveryFee,
            minOrderAmount: config.minOrderAmount,
            estimatedTime: config.estimatedDeliveryTime,
          };
        }

        if (input.deliveryType === "pickup" && !config.pickupEnabled) {
          return {
            available: false,
            reason: "pickup_disabled",
            deliveryFee: "0.00",
            minOrderAmount: config.minOrderAmount,
            estimatedTime: config.estimatedPickupTime,
          };
        }

        // 检查起送金额
        const orderAmount = parseFloat(input.orderAmount);
        const minAmount = parseFloat(config.minOrderAmount);

        if (orderAmount < minAmount) {
          return {
            available: false,
            reason: "below_minimum",
            deliveryFee: config.deliveryFee,
            minOrderAmount: config.minOrderAmount,
            estimatedTime:
              input.deliveryType === "delivery"
                ? config.estimatedDeliveryTime
                : config.estimatedPickupTime,
          };
        }

        // 检查配送距离
        if (input.deliveryType === "delivery" && input.distance) {
          if (input.distance > config.deliveryRadius) {
            return {
              available: false,
              reason: "out_of_range",
              deliveryFee: config.deliveryFee,
              minOrderAmount: config.minOrderAmount,
              estimatedTime: config.estimatedDeliveryTime,
            };
          }
        }

        // 计算配送费
        let deliveryFee = "0.00";
        if (input.deliveryType === "delivery") {
          deliveryFee = config.deliveryFee;

          // 检查是否满足免配送费条件
          if (
            config.freeDeliveryThreshold &&
            orderAmount >= parseFloat(config.freeDeliveryThreshold)
          ) {
            deliveryFee = "0.00";
          }
        }

        return {
          available: true,
          reason: null,
          deliveryFee,
          minOrderAmount: config.minOrderAmount,
          estimatedTime:
            input.deliveryType === "delivery"
              ? config.estimatedDeliveryTime
              : config.estimatedPickupTime,
        };
      } catch (error) {
        console.error("[Delivery Config] Error checking availability:", error);
        throw new Error("Failed to check delivery availability");
      }
    }),
});
