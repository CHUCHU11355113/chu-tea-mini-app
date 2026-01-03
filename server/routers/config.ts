import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { db } from "../db";
import { systemConfigs, configItems, businessRules } from "../../drizzle/schema";
import { eq, and, isNull, or, lte, gte, desc } from "drizzle-orm";
import { ruleEngine } from "../lib/rule-engine";

/**
 * 配置管理路由
 */
export const configRouter = router({
  /**
   * 获取系统配置（公开接口）
   */
  getConfig: publicProcedure
    .input(
      z.object({
        category: z.string(),
        code: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const configs = await ruleEngine.getActiveConfig(input.category, input.code);
      return configs;
    }),

  /**
   * 获取配置项（公开接口）
   */
  getConfigItems: publicProcedure
    .input(
      z.object({
        configId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const items = await db
        .select()
        .from(configItems)
        .where(
          and(
            eq(configItems.configId, input.configId),
            eq(configItems.isEnabled, true)
          )
        )
        .orderBy(configItems.sortOrder);

      return items;
    }),

  /**
   * 列出所有配置（管理员）
   */
  listConfigs: adminProcedure
    .input(
      z.object({
        category: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const conditions = [];
      
      if (input?.category) {
        conditions.push(eq(systemConfigs.category, input.category));
      }

      const configs = await db
        .select()
        .from(systemConfigs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(systemConfigs.category, systemConfigs.sortOrder);

      return configs;
    }),

  /**
   * 创建配置（管理员）
   */
  createConfig: adminProcedure
    .input(
      z.object({
        code: z.string(),
        category: z.string(),
        nameRu: z.string(),
        nameEn: z.string(),
        nameZh: z.string().optional(),
        descriptionRu: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionZh: z.string().optional(),
        config: z.any(),
        isEnabled: z.boolean().default(true),
        sortOrder: z.number().default(0),
        validFrom: z.date().optional(),
        validTo: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(systemConfigs).values(input);
      return { success: true, id: Number(result.insertId) };
    }),

  /**
   * 更新配置（管理员）
   */
  updateConfig: adminProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        category: z.string().optional(),
        nameRu: z.string().optional(),
        nameEn: z.string().optional(),
        nameZh: z.string().optional(),
        descriptionRu: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionZh: z.string().optional(),
        config: z.any().optional(),
        isEnabled: z.boolean().optional(),
        sortOrder: z.number().optional(),
        validFrom: z.date().optional(),
        validTo: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db
        .update(systemConfigs)
        .set(data)
        .where(eq(systemConfigs.id, id));
      return { success: true };
    }),

  /**
   * 删除配置（管理员）
   */
  deleteConfig: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(systemConfigs).where(eq(systemConfigs.id, input.id));
      return { success: true };
    }),

  /**
   * 创建配置项（管理员）
   */
  createConfigItem: adminProcedure
    .input(
      z.object({
        configId: z.number(),
        parentId: z.number().optional(),
        code: z.string(),
        nameRu: z.string(),
        nameEn: z.string(),
        nameZh: z.string().optional(),
        icon: z.string().optional(),
        config: z.any().optional(),
        isEnabled: z.boolean().default(true),
        isDefault: z.boolean().default(false),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(configItems).values(input);
      return { success: true, id: Number(result.insertId) };
    }),

  /**
   * 更新配置项（管理员）
   */
  updateConfigItem: adminProcedure
    .input(
      z.object({
        id: z.number(),
        configId: z.number().optional(),
        parentId: z.number().optional(),
        code: z.string().optional(),
        nameRu: z.string().optional(),
        nameEn: z.string().optional(),
        nameZh: z.string().optional(),
        icon: z.string().optional(),
        config: z.any().optional(),
        isEnabled: z.boolean().optional(),
        isDefault: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db
        .update(configItems)
        .set(data)
        .where(eq(configItems.id, id));
      return { success: true };
    }),

  /**
   * 删除配置项（管理员）
   */
  deleteConfigItem: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(configItems).where(eq(configItems.id, input.id));
      return { success: true };
    }),

  /**
   * 列出所有规则（管理员）
   */
  listRules: adminProcedure
    .input(
      z.object({
        ruleType: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const conditions = [];
      
      if (input?.ruleType) {
        conditions.push(eq(businessRules.ruleType, input.ruleType));
      }

      const rules = await db
        .select()
        .from(businessRules)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(businessRules.priority));

      return rules;
    }),

  /**
   * 创建规则（管理员）
   */
  createRule: adminProcedure
    .input(
      z.object({
        code: z.string(),
        nameRu: z.string(),
        nameEn: z.string(),
        nameZh: z.string().optional(),
        descriptionRu: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionZh: z.string().optional(),
        ruleType: z.string(),
        conditions: z.any(),
        actions: z.any(),
        priority: z.number().default(0),
        mutexGroup: z.string().optional(),
        isEnabled: z.boolean().default(true),
        validFrom: z.date().optional(),
        validTo: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db.insert(businessRules).values(input);
      return { success: true, id: Number(result.insertId) };
    }),

  /**
   * 更新规则（管理员）
   */
  updateRule: adminProcedure
    .input(
      z.object({
        id: z.number(),
        code: z.string().optional(),
        nameRu: z.string().optional(),
        nameEn: z.string().optional(),
        nameZh: z.string().optional(),
        descriptionRu: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionZh: z.string().optional(),
        ruleType: z.string().optional(),
        conditions: z.any().optional(),
        actions: z.any().optional(),
        priority: z.number().optional(),
        mutexGroup: z.string().optional(),
        isEnabled: z.boolean().optional(),
        validFrom: z.date().optional(),
        validTo: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db
        .update(businessRules)
        .set(data)
        .where(eq(businessRules.id, id));
      return { success: true };
    }),

  /**
   * 删除规则（管理员）
   */
  deleteRule: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(businessRules).where(eq(businessRules.id, input.id));
      return { success: true };
    }),

  /**
   * 测试规则（管理员）
   */
  testRule: adminProcedure
    .input(
      z.object({
        ruleId: z.number(),
        context: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const rule = await db
        .select()
        .from(businessRules)
        .where(eq(businessRules.id, input.ruleId))
        .limit(1);

      if (rule.length === 0) {
        throw new Error('Rule not found');
      }

      const isMatched = await ruleEngine.evaluateConditions(
        rule[0].conditions as any,
        input.context
      );

      if (!isMatched) {
        return {
          matched: false,
          executed: false,
          result: null,
        };
      }

      const executionResult = await ruleEngine.executeActions(
        rule[0].actions as any,
        input.context
      );

      return {
        matched: true,
        executed: executionResult.success,
        result: executionResult,
      };
    }),
});
