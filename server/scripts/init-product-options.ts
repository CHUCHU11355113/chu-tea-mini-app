/**
 * 初始化产品选项配置
 * 创建默认的产品选项组：糖度、冰度、容量、小料
 */
import { getDb } from '../db';
import { systemConfigs, configItems } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function initProductOptions() {
  console.log('开始初始化产品选项配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 1. 创建糖度选项组
  const sugarResult = await db.insert(systemConfigs).values({
    code: 'product_option_sugar',
    category: 'product_option',
    nameRu: 'Уровень сахара',
    nameEn: 'Sugar Level',
    nameZh: '糖度',
    descriptionRu: 'Выберите уровень сахара',
    descriptionEn: 'Select sugar level',
    descriptionZh: '选择糖度',
    config: {
      type: 'product_option_group',
      icon: '🍬',
      selectionType: 'single',
      isRequired: true,
      maxSelections: 1,
      applicableTo: {
        type: 'all', // all, category, product
      },
    },
    isEnabled: true,
    sortOrder: 1,
  });

  let sugarConfigId = Number(sugarResult.insertId) || 0;
  if (sugarConfigId === 0) {
    // 查询刚创建的配置
    const configs = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'product_option_sugar'));
    if (configs.length === 0) throw new Error('糖度配置创建失败');
    sugarConfigId = configs[0].id;
  }
  console.log('✓ 糖度选项组已创建');

  // 添加糖度选项
  await db.insert(configItems).values([
    {
      configId: sugarConfigId,
      code: 'no_sugar',
      nameRu: 'Без сахара',
      nameEn: 'No Sugar',
      nameZh: '无糖',
      icon: '🚫',
      config: { priceAdjustment: 0, tags: ['healthy'] },
      isEnabled: true,
      sortOrder: 1,
    },
    {
      configId: sugarConfigId,
      code: 'less_sugar',
      nameRu: 'Меньше сахара',
      nameEn: 'Less Sugar',
      nameZh: '少糖',
      icon: '⬇️',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 2,
    },
    {
      configId: sugarConfigId,
      code: 'half_sugar',
      nameRu: 'Половина сахара',
      nameEn: 'Half Sugar',
      nameZh: '半糖',
      icon: '➗',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      isDefault: true,
      sortOrder: 3,
    },
    {
      configId: sugarConfigId,
      code: 'normal_sugar',
      nameRu: 'Обычный сахар',
      nameEn: 'Normal Sugar',
      nameZh: '正常糖',
      icon: '✅',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 4,
    },
    {
      configId: sugarConfigId,
      code: 'extra_sugar',
      nameRu: 'Больше сахара',
      nameEn: 'Extra Sugar',
      nameZh: '多糖',
      icon: '⬆️',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 5,
    },
  ]);

  console.log('✓ 糖度选项已添加');

  // 2. 创建冰度选项组
  const iceResult = await db.insert(systemConfigs).values({
    code: 'product_option_ice',
    category: 'product_option',
    nameRu: 'Уровень льда',
    nameEn: 'Ice Level',
    nameZh: '冰度',
    descriptionRu: 'Выберите уровень льда',
    descriptionEn: 'Select ice level',
    descriptionZh: '选择冰度',
    config: {
      type: 'product_option_group',
      icon: '🧊',
      selectionType: 'single',
      isRequired: true,
      maxSelections: 1,
      applicableTo: {
        type: 'all',
      },
    },
    isEnabled: true,
    sortOrder: 2,
  });

  let iceConfigId = Number(iceResult.insertId) || 0;
  if (iceConfigId === 0) {
    const configs = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'product_option_ice'));
    if (configs.length === 0) throw new Error('冰度配置创建失败');
    iceConfigId = configs[0].id;
  }
  console.log('✓ 冰度选项组已创建');

  // 添加冰度选项
  await db.insert(configItems).values([
    {
      configId: iceConfigId,
      code: 'hot',
      nameRu: 'Горячий',
      nameEn: 'Hot',
      nameZh: '热饮',
      icon: '🔥',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 1,
    },
    {
      configId: iceConfigId,
      code: 'no_ice',
      nameRu: 'Без льда',
      nameEn: 'No Ice',
      nameZh: '去冰',
      icon: '🚫',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 2,
    },
    {
      configId: iceConfigId,
      code: 'less_ice',
      nameRu: 'Меньше льда',
      nameEn: 'Less Ice',
      nameZh: '少冰',
      icon: '⬇️',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 3,
    },
    {
      configId: iceConfigId,
      code: 'normal_ice',
      nameRu: 'Обычный лёд',
      nameEn: 'Normal Ice',
      nameZh: '正常冰',
      icon: '✅',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      isDefault: true,
      sortOrder: 4,
    },
    {
      configId: iceConfigId,
      code: 'extra_ice',
      nameRu: 'Больше льда',
      nameEn: 'Extra Ice',
      nameZh: '多冰',
      icon: '⬆️',
      config: { priceAdjustment: 0 },
      isEnabled: true,
      sortOrder: 5,
    },
  ]);

  console.log('✓ 冰度选项已添加');

  // 3. 创建容量选项组
  const sizeResult = await db.insert(systemConfigs).values({
    code: 'product_option_size',
    category: 'product_option',
    nameRu: 'Размер',
    nameEn: 'Size',
    nameZh: '容量',
    descriptionRu: 'Выберите размер',
    descriptionEn: 'Select size',
    descriptionZh: '选择容量',
    config: {
      type: 'product_option_group',
      icon: '🥤',
      selectionType: 'single',
      isRequired: true,
      maxSelections: 1,
      applicableTo: {
        type: 'all',
      },
    },
    isEnabled: true,
    sortOrder: 3,
  });

  let sizeConfigId = Number(sizeResult.insertId) || 0;
  if (sizeConfigId === 0) {
    const configs = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'product_option_size'));
    if (configs.length === 0) throw new Error('容量配置创建失败');
    sizeConfigId = configs[0].id;
  }
  console.log('✓ 容量选项组已创建');

  // 添加容量选项
  await db.insert(configItems).values([
    {
      configId: sizeConfigId,
      code: 'small',
      nameRu: 'Маленький (300мл)',
      nameEn: 'Small (300ml)',
      nameZh: '小杯 (300ml)',
      icon: '🥤',
      config: { priceAdjustment: -50, volume: 300 },
      isEnabled: true,
      sortOrder: 1,
    },
    {
      configId: sizeConfigId,
      code: 'medium',
      nameRu: 'Средний (500мл)',
      nameEn: 'Medium (500ml)',
      nameZh: '中杯 (500ml)',
      icon: '🥤',
      config: { priceAdjustment: 0, volume: 500 },
      isEnabled: true,
      isDefault: true,
      sortOrder: 2,
    },
    {
      configId: sizeConfigId,
      code: 'large',
      nameRu: 'Большой (700мл)',
      nameEn: 'Large (700ml)',
      nameZh: '大杯 (700ml)',
      icon: '🥤',
      config: { priceAdjustment: 50, volume: 700 },
      isEnabled: true,
      sortOrder: 3,
    },
  ]);

  console.log('✓ 容量选项已添加');

  // 4. 创建小料选项组
  const toppingsResult = await db.insert(systemConfigs).values({
    code: 'product_option_toppings',
    category: 'product_option',
    nameRu: 'Добавки',
    nameEn: 'Toppings',
    nameZh: '小料',
    descriptionRu: 'Выберите добавки',
    descriptionEn: 'Select toppings',
    descriptionZh: '选择小料',
    config: {
      type: 'product_option_group',
      icon: '🧋',
      selectionType: 'multiple',
      isRequired: false,
      maxSelections: 3,
      applicableTo: {
        type: 'all',
      },
    },
    isEnabled: true,
    sortOrder: 4,
  });

  let toppingsConfigId = Number(toppingsResult.insertId) || 0;
  if (toppingsConfigId === 0) {
    const configs = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'product_option_toppings'));
    if (configs.length === 0) throw new Error('小料配置创建失败');
    toppingsConfigId = configs[0].id;
  }
  console.log('✓ 小料选项组已创建');

  // 添加小料选项
  await db.insert(configItems).values([
    {
      configId: toppingsConfigId,
      code: 'pearl',
      nameRu: 'Жемчужины тапиоки',
      nameEn: 'Tapioca Pearls',
      nameZh: '珍珠',
      icon: '⚫',
      config: { priceAdjustment: 30 },
      isEnabled: true,
      sortOrder: 1,
    },
    {
      configId: toppingsConfigId,
      code: 'coconut_jelly',
      nameRu: 'Кокосовое желе',
      nameEn: 'Coconut Jelly',
      nameZh: '椰果',
      icon: '🥥',
      config: { priceAdjustment: 30 },
      isEnabled: true,
      sortOrder: 2,
    },
    {
      configId: toppingsConfigId,
      code: 'pudding',
      nameRu: 'Пудинг',
      nameEn: 'Pudding',
      nameZh: '布丁',
      icon: '🍮',
      config: { priceAdjustment: 40 },
      isEnabled: true,
      sortOrder: 3,
    },
    {
      configId: toppingsConfigId,
      code: 'red_bean',
      nameRu: 'Красная фасоль',
      nameEn: 'Red Bean',
      nameZh: '红豆',
      icon: '🫘',
      config: { priceAdjustment: 30 },
      isEnabled: true,
      sortOrder: 4,
    },
    {
      configId: toppingsConfigId,
      code: 'grass_jelly',
      nameRu: 'Травяное желе',
      nameEn: 'Grass Jelly',
      nameZh: '仙草',
      icon: '🟫',
      config: { priceAdjustment: 30 },
      isEnabled: true,
      sortOrder: 5,
    },
    {
      configId: toppingsConfigId,
      code: 'cheese_foam',
      nameRu: 'Сырная пена',
      nameEn: 'Cheese Foam',
      nameZh: '芝士奶盖',
      icon: '🧀',
      config: { priceAdjustment: 50 },
      isEnabled: true,
      sortOrder: 6,
    },
  ]);

  console.log('✓ 小料选项已添加');

  console.log('产品选项配置初始化完成！');
}

// 如果直接运行此脚本
initProductOptions()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
