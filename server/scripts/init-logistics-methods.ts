/**
 * 初始化物流配送方式配置
 * 创建示例物流方式：自营配送、第三方配送、快递配送等
 */
import { getDb } from '../db';
import { systemConfigs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initLogisticsMethods() {
  console.log('开始初始化物流配送方式配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在物流方式配置
  const existing = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'logistics_self_delivery'));
  
  if (existing.length > 0) {
    console.log('物流配送方式配置已存在，跳过');
    return;
  }

  // 1. 自营配送
  await db.insert(systemConfigs).values({
    code: 'logistics_self_delivery',
    category: 'logistics_method',
    nameRu: 'Собственная доставка',
    nameEn: 'Self Delivery',
    nameZh: '自营配送',
    descriptionRu: 'Доставка собственными курьерами',
    descriptionEn: 'Delivery by own couriers',
    descriptionZh: '门店自己的配送员配送',
    config: {
      provider: 'self',
      icon: '🚴',
      deliveryType: 'instant', // instant, scheduled
      coverageType: 'radius', // radius, polygon, zones
      coverageRadius: 5000, // 5km
      estimatedTime: {
        min: 30,
        max: 60,
        unit: 'minutes',
      },
      feeCalculation: {
        type: 'tiered', // fixed, distance, weight, tiered
        tiers: [
          { maxDistance: 2000, fee: 100 },
          { maxDistance: 3000, fee: 150 },
          { maxDistance: 5000, fee: 200 },
        ],
        freeThreshold: 1000, // 满1000免配送费
      },
      workingHours: {
        monday: { start: '10:00', end: '22:00' },
        tuesday: { start: '10:00', end: '22:00' },
        wednesday: { start: '10:00', end: '22:00' },
        thursday: { start: '10:00', end: '22:00' },
        friday: { start: '10:00', end: '22:00' },
        saturday: { start: '10:00', end: '23:00' },
        sunday: { start: '10:00', end: '23:00' },
      },
      tracking: {
        enabled: true,
        realTimeLocation: true,
        smsNotification: true,
      },
      restrictions: {
        minOrderAmount: 200,
        maxOrderWeight: 10, // kg
        weatherRestrictions: false,
      },
    },
    isEnabled: true,
    sortOrder: 1,
  });

  console.log('✓ 自营配送已创建');

  // 2. Yandex配送
  await db.insert(systemConfigs).values({
    code: 'logistics_yandex_delivery',
    category: 'logistics_method',
    nameRu: 'Яндекс.Доставка',
    nameEn: 'Yandex Delivery',
    nameZh: 'Yandex配送',
    descriptionRu: 'Доставка через Яндекс',
    descriptionEn: 'Delivery via Yandex',
    descriptionZh: '通过Yandex配送',
    config: {
      provider: 'yandex',
      icon: '🚗',
      deliveryType: 'instant',
      apiConfig: {
        apiKey: '', // 需要配置
        clientId: '',
        tariff: 'express',
      },
      coverageType: 'api', // 由API决定覆盖范围
      estimatedTime: {
        min: 40,
        max: 90,
        unit: 'minutes',
      },
      feeCalculation: {
        type: 'api', // 由API计算费用
        markup: 10, // 加价10%
      },
      tracking: {
        enabled: true,
        realTimeLocation: true,
        smsNotification: true,
        trackingUrl: 'https://taxi.yandex.ru/track/{orderId}',
      },
      restrictions: {
        minOrderAmount: 300,
        maxOrderWeight: 20,
        weatherRestrictions: true,
      },
    },
    isEnabled: false, // 默认禁用，需要配置API后启用
    sortOrder: 2,
  });

  console.log('✓ Yandex配送已创建（默认禁用）');

  // 3. CDEK快递
  await db.insert(systemConfigs).values({
    code: 'logistics_cdek_express',
    category: 'logistics_method',
    nameRu: 'CDEK экспресс',
    nameEn: 'CDEK Express',
    nameZh: 'CDEK快递',
    descriptionRu: 'Экспресс-доставка CDEK',
    descriptionEn: 'CDEK Express Delivery',
    descriptionZh: 'CDEK快递配送',
    config: {
      provider: 'cdek',
      icon: '📦',
      deliveryType: 'scheduled',
      apiConfig: {
        apiKey: '',
        account: '',
        tariffCode: '136', // Экспресс дверь-дверь
      },
      coverageType: 'api',
      estimatedTime: {
        min: 1,
        max: 3,
        unit: 'days',
      },
      feeCalculation: {
        type: 'api',
        markup: 15,
      },
      tracking: {
        enabled: true,
        realTimeLocation: false,
        smsNotification: true,
        trackingUrl: 'https://www.cdek.ru/track.html?order_id={orderId}',
      },
      restrictions: {
        minOrderAmount: 500,
        maxOrderWeight: 30,
        weatherRestrictions: false,
      },
      pickupPoints: {
        enabled: true,
        searchRadius: 10000, // 10km
      },
    },
    isEnabled: false, // 默认禁用
    sortOrder: 3,
  });

  console.log('✓ CDEK快递已创建（默认禁用）');

  // 4. 门店自提
  await db.insert(systemConfigs).values({
    code: 'logistics_store_pickup',
    category: 'logistics_method',
    nameRu: 'Самовывоз из магазина',
    nameEn: 'Store Pickup',
    nameZh: '门店自提',
    descriptionRu: 'Заберите заказ в магазине',
    descriptionEn: 'Pick up order at store',
    descriptionZh: '到门店自取订单',
    config: {
      provider: 'self',
      icon: '🏪',
      deliveryType: 'scheduled',
      estimatedTime: {
        min: 15,
        max: 30,
        unit: 'minutes',
      },
      feeCalculation: {
        type: 'fixed',
        fee: 0, // 免费
      },
      workingHours: {
        monday: { start: '10:00', end: '22:00' },
        tuesday: { start: '10:00', end: '22:00' },
        wednesday: { start: '10:00', end: '22:00' },
        thursday: { start: '10:00', end: '22:00' },
        friday: { start: '10:00', end: '22:00' },
        saturday: { start: '10:00', end: '23:00' },
        sunday: { start: '10:00', end: '23:00' },
      },
      tracking: {
        enabled: true,
        realTimeLocation: false,
        smsNotification: true,
      },
      pickupCode: {
        enabled: true,
        codeLength: 4,
        expiryHours: 24,
      },
      restrictions: {
        minOrderAmount: 100,
        requiresAdvanceOrder: false,
      },
    },
    isEnabled: true,
    sortOrder: 4,
  });

  console.log('✓ 门店自提已创建');

  // 5. 预约配送
  await db.insert(systemConfigs).values({
    code: 'logistics_scheduled_delivery',
    category: 'logistics_method',
    nameRu: 'Доставка по расписанию',
    nameEn: 'Scheduled Delivery',
    nameZh: '预约配送',
    descriptionRu: 'Выберите удобное время доставки',
    descriptionEn: 'Choose convenient delivery time',
    descriptionZh: '选择方便的配送时间',
    config: {
      provider: 'self',
      icon: '📅',
      deliveryType: 'scheduled',
      coverageType: 'radius',
      coverageRadius: 10000, // 10km
      timeSlots: [
        { start: '10:00', end: '12:00' },
        { start: '12:00', end: '14:00' },
        { start: '14:00', end: '16:00' },
        { start: '16:00', end: '18:00' },
        { start: '18:00', end: '20:00' },
        { start: '20:00', end: '22:00' },
      ],
      advanceBooking: {
        minHours: 2,
        maxDays: 7,
      },
      feeCalculation: {
        type: 'tiered',
        tiers: [
          { maxDistance: 3000, fee: 150 },
          { maxDistance: 5000, fee: 200 },
          { maxDistance: 10000, fee: 300 },
        ],
        freeThreshold: 1500,
      },
      tracking: {
        enabled: true,
        realTimeLocation: true,
        smsNotification: true,
      },
      restrictions: {
        minOrderAmount: 500,
        maxOrderWeight: 15,
      },
    },
    isEnabled: true,
    sortOrder: 5,
  });

  console.log('✓ 预约配送已创建');

  console.log('物流配送方式配置初始化完成！');
}

// 运行初始化
initLogisticsMethods()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
