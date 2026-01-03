/**
 * 初始化所有配置
 * 包括配送方式、产品选项等
 */
import { getDb } from '../db';
import { systemConfigs, configItems } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initAllConfigs() {
  console.log('开始初始化所有配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查并创建产品选项配置
  const existingSugar = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'product_option_sugar'));
  
  if (existingSugar.length === 0) {
    console.log('创建产品选项配置...');
    
    // 创建糖度选项组
    const sugarResult = await db.insert(systemConfigs).values({
      code: 'product_option_sugar',
      category: 'product_option',
      nameRu: 'Уровень сахара',
      nameEn: 'Sugar Level',
      nameZh: '糖度',
      config: {
        type: 'product_option_group',
        icon: '🍬',
        selectionType: 'single',
        isRequired: true,
      },
      isEnabled: true,
      sortOrder: 1,
    });

    const sugarConfigId = Number(sugarResult.insertId);

    // 添加糖度选项
    await db.insert(configItems).values([
      {
        configId: sugarConfigId,
        code: 'no_sugar',
        nameRu: 'Без сахара',
        nameEn: 'No Sugar',
        nameZh: '无糖',
        config: { priceAdjustment: 0 },
        isEnabled: true,
        sortOrder: 1,
      },
      {
        configId: sugarConfigId,
        code: 'half_sugar',
        nameRu: 'Половина сахара',
        nameEn: 'Half Sugar',
        nameZh: '半糖',
        config: { priceAdjustment: 0 },
        isEnabled: true,
        isDefault: true,
        sortOrder: 2,
      },
      {
        configId: sugarConfigId,
        code: 'normal_sugar',
        nameRu: 'Обычный сахар',
        nameEn: 'Normal Sugar',
        nameZh: '正常糖',
        config: { priceAdjustment: 0 },
        isEnabled: true,
        sortOrder: 3,
      },
    ]);

    console.log('✓ 糖度选项配置已创建');

    // 创建冰度选项组
    const iceResult = await db.insert(systemConfigs).values({
      code: 'product_option_ice',
      category: 'product_option',
      nameRu: 'Уровень льда',
      nameEn: 'Ice Level',
      nameZh: '冰度',
      config: {
        type: 'product_option_group',
        icon: '🧊',
        selectionType: 'single',
        isRequired: true,
      },
      isEnabled: true,
      sortOrder: 2,
    });

    const iceConfigId = Number(iceResult.insertId);

    // 添加冰度选项
    await db.insert(configItems).values([
      {
        configId: iceConfigId,
        code: 'no_ice',
        nameRu: 'Без льда',
        nameEn: 'No Ice',
        nameZh: '去冰',
        config: { priceAdjustment: 0 },
        isEnabled: true,
        sortOrder: 1,
      },
      {
        configId: iceConfigId,
        code: 'normal_ice',
        nameRu: 'Обычный лёд',
        nameEn: 'Normal Ice',
        nameZh: '正常冰',
        config: { priceAdjustment: 0 },
        isEnabled: true,
        isDefault: true,
        sortOrder: 2,
      },
      {
        configId: iceConfigId,
        code: 'extra_ice',
        nameRu: 'Больше льда',
        nameEn: 'Extra Ice',
        nameZh: '多冰',
        config: { priceAdjustment: 0 },
        isEnabled: true,
        sortOrder: 3,
      },
    ]);

    console.log('✓ 冰度选项配置已创建');

    // 创建容量选项组
    const sizeResult = await db.insert(systemConfigs).values({
      code: 'product_option_size',
      category: 'product_option',
      nameRu: 'Размер',
      nameEn: 'Size',
      nameZh: '容量',
      config: {
        type: 'product_option_group',
        icon: '🥤',
        selectionType: 'single',
        isRequired: true,
      },
      isEnabled: true,
      sortOrder: 3,
    });

    const sizeConfigId = Number(sizeResult.insertId);

    // 添加容量选项
    await db.insert(configItems).values([
      {
        configId: sizeConfigId,
        code: 'medium',
        nameRu: 'Средний (500мл)',
        nameEn: 'Medium (500ml)',
        nameZh: '中杯 (500ml)',
        config: { priceAdjustment: 0, volume: 500 },
        isEnabled: true,
        isDefault: true,
        sortOrder: 1,
      },
      {
        configId: sizeConfigId,
        code: 'large',
        nameRu: 'Большой (700мл)',
        nameEn: 'Large (700ml)',
        nameZh: '大杯 (700ml)',
        config: { priceAdjustment: 50, volume: 700 },
        isEnabled: true,
        sortOrder: 2,
      },
    ]);

    console.log('✓ 容量选项配置已创建');

    // 创建小料选项组
    const toppingsResult = await db.insert(systemConfigs).values({
      code: 'product_option_toppings',
      category: 'product_option',
      nameRu: 'Добавки',
      nameEn: 'Toppings',
      nameZh: '小料',
      config: {
        type: 'product_option_group',
        icon: '🧋',
        selectionType: 'multiple',
        isRequired: false,
        maxSelections: 3,
      },
      isEnabled: true,
      sortOrder: 4,
    });

    const toppingsConfigId = Number(toppingsResult.insertId);

    // 添加小料选项
    await db.insert(configItems).values([
      {
        configId: toppingsConfigId,
        code: 'pearl',
        nameRu: 'Жемчужины тапиоки',
        nameEn: 'Tapioca Pearls',
        nameZh: '珍珠',
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
        config: { priceAdjustment: 40 },
        isEnabled: true,
        sortOrder: 3,
      },
    ]);

    console.log('✓ 小料选项配置已创建');
  } else {
    console.log('产品选项配置已存在，跳过');
    
    // 检查是否需要添加配置项
    const sugarId = existingSugar[0].id;
    const existingItems = await db.select().from(configItems).where(eq(configItems.configId, sugarId));
    
    if (existingItems.length === 0) {
      console.log('添加缺失的配置项...');
      
      // 添加糖度选项
      await db.insert(configItems).values([
        {
          configId: sugarId,
          code: 'no_sugar',
          nameRu: 'Без сахара',
          nameEn: 'No Sugar',
          nameZh: '无糖',
          config: { priceAdjustment: 0 },
          isEnabled: true,
          sortOrder: 1,
        },
        {
          configId: sugarId,
          code: 'half_sugar',
          nameRu: 'Половина сахара',
          nameEn: 'Half Sugar',
          nameZh: '半糖',
          config: { priceAdjustment: 0 },
          isEnabled: true,
          isDefault: true,
          sortOrder: 2,
        },
        {
          configId: sugarId,
          code: 'normal_sugar',
          nameRu: 'Обычный сахар',
          nameEn: 'Normal Sugar',
          nameZh: '正常糖',
          config: { priceAdjustment: 0 },
          isEnabled: true,
          sortOrder: 3,
        },
      ]);
      
      console.log('✓ 配置项已添加');
    }
  }

  console.log('所有配置初始化完成！');
}

// 运行初始化
initAllConfigs()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
