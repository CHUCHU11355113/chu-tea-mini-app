/**
 * 初始化配送方式配置
 * 创建默认的配送方式：外卖和自提
 */
import { getDb } from '../db';
import { systemConfigs, configItems } from '../../drizzle/schema';

export async function initDeliveryConfig() {
  console.log('开始初始化配送方式配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 1. 创建外卖配送方式配置
  const deliveryResult = await db.insert(systemConfigs).values({
    code: 'delivery_method_delivery',
    category: 'delivery_method',
    nameRu: 'Доставка',
    nameEn: 'Delivery',
    nameZh: '外卖配送',
    descriptionRu: 'Доставка курьером',
    descriptionEn: 'Courier delivery',
    descriptionZh: '快递员配送到家',
    config: {
      type: 'delivery',
      icon: '🚚',
      feeCalculation: {
        type: 'distance', // fixed, distance, weight, formula
        baseFee: 100, // 基础配送费（卢布）
        perKm: 20, // 每公里费用
        freeThreshold: 1000, // 满额免配送费
      },
      timeCalculation: {
        type: 'fixed',
        estimatedMinutes: 30,
      },
      rangeLimit: {
        type: 'radius',
        maxDistance: 5000, // 最大配送距离（米）
      },
    },
    isEnabled: true,
    sortOrder: 1,
  });

  console.log('✓ 外卖配送方式配置已创建');

  // 2. 创建自提配送方式配置
  const pickupResult = await db.insert(systemConfigs).values({
    code: 'delivery_method_pickup',
    category: 'delivery_method',
    nameRu: 'Самовывоз',
    nameEn: 'Pickup',
    nameZh: '到店自提',
    descriptionRu: 'Забрать заказ в магазине',
    descriptionEn: 'Pick up order at store',
    descriptionZh: '到店自取订单',
    config: {
      type: 'pickup',
      icon: '🏪',
      feeCalculation: {
        type: 'fixed',
        baseFee: 0, // 自提免费
      },
      timeCalculation: {
        type: 'fixed',
        estimatedMinutes: 15,
      },
    },
    isEnabled: true,
    sortOrder: 2,
  });

  console.log('✓ 自提配送方式配置已创建');

  // 3. 创建预约配送方式配置（可选）
  const scheduledResult = await db.insert(systemConfigs).values({
    code: 'delivery_method_scheduled',
    category: 'delivery_method',
    nameRu: 'Запланированная доставка',
    nameEn: 'Scheduled Delivery',
    nameZh: '预约配送',
    descriptionRu: 'Доставка в выбранное время',
    descriptionEn: 'Delivery at selected time',
    descriptionZh: '在指定时间配送',
    config: {
      type: 'scheduled',
      icon: '📅',
      feeCalculation: {
        type: 'distance',
        baseFee: 150,
        perKm: 25,
        freeThreshold: 1500,
      },
      timeCalculation: {
        type: 'dynamic',
        minAdvanceMinutes: 60, // 最少提前1小时预约
        maxAdvanceDays: 7, // 最多提前7天预约
      },
      rangeLimit: {
        type: 'radius',
        maxDistance: 10000,
      },
    },
    isEnabled: false, // 默认禁用，后台可以启用
    sortOrder: 3,
  });

  console.log('✓ 预约配送方式配置已创建（默认禁用）');

  console.log('配送方式配置初始化完成！');
}

// 如果直接运行此脚本
initDeliveryConfig()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
