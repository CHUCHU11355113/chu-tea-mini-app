/**
 * 初始化会员等级配置
 * 创建默认的会员等级：青铜、白银、黄金、铂金
 */
import { getDb } from '../db';
import { systemConfigs, configItems } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initMemberLevels() {
  console.log('开始初始化会员等级配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在会员等级配置
  const existing = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'member_level_bronze'));
  
  if (existing.length > 0) {
    console.log('会员等级配置已存在，跳过');
    return;
  }

  // 1. 创建青铜会员等级
  await db.insert(systemConfigs).values({
    code: 'member_level_bronze',
    category: 'member_level',
    nameRu: 'Бронзовый',
    nameEn: 'Bronze',
    nameZh: '青铜会员',
    descriptionRu: 'Базовый уровень членства',
    descriptionEn: 'Basic membership level',
    descriptionZh: '基础会员等级',
    config: {
      level: 1,
      icon: '🥉',
      color: '#CD7F32',
      upgradeConditions: {
        type: 'auto', // auto, manual
        requiredPoints: 0,
        requiredOrders: 0,
        requiredAmount: 0,
      },
      benefits: {
        pointsMultiplier: 1.0,
        birthdayPoints: 100,
        birthdayCoupon: true,
        exclusiveProducts: false,
        prioritySupport: false,
        freeDeliveryThreshold: 1000,
      },
    },
    isEnabled: true,
    sortOrder: 1,
  });

  console.log('✓ 青铜会员等级已创建');

  // 2. 创建白银会员等级
  await db.insert(systemConfigs).values({
    code: 'member_level_silver',
    category: 'member_level',
    nameRu: 'Серебряный',
    nameEn: 'Silver',
    nameZh: '白银会员',
    descriptionRu: 'Серебряный уровень членства',
    descriptionEn: 'Silver membership level',
    descriptionZh: '白银会员等级',
    config: {
      level: 2,
      icon: '🥈',
      color: '#C0C0C0',
      upgradeConditions: {
        type: 'auto',
        requiredPoints: 1000,
        requiredOrders: 10,
        requiredAmount: 5000,
      },
      benefits: {
        pointsMultiplier: 1.2,
        birthdayPoints: 200,
        birthdayCoupon: true,
        exclusiveProducts: false,
        prioritySupport: false,
        freeDeliveryThreshold: 800,
        monthlyFreeCoupon: 1,
      },
    },
    isEnabled: true,
    sortOrder: 2,
  });

  console.log('✓ 白银会员等级已创建');

  // 3. 创建黄金会员等级
  await db.insert(systemConfigs).values({
    code: 'member_level_gold',
    category: 'member_level',
    nameRu: 'Золотой',
    nameEn: 'Gold',
    nameZh: '黄金会员',
    descriptionRu: 'Золотой уровень членства',
    descriptionEn: 'Gold membership level',
    descriptionZh: '黄金会员等级',
    config: {
      level: 3,
      icon: '🥇',
      color: '#FFD700',
      upgradeConditions: {
        type: 'auto',
        requiredPoints: 5000,
        requiredOrders: 50,
        requiredAmount: 25000,
      },
      benefits: {
        pointsMultiplier: 1.5,
        birthdayPoints: 500,
        birthdayCoupon: true,
        exclusiveProducts: true,
        prioritySupport: true,
        freeDeliveryThreshold: 500,
        monthlyFreeCoupon: 2,
        exclusiveDiscount: 5, // 5% 额外折扣
      },
    },
    isEnabled: true,
    sortOrder: 3,
  });

  console.log('✓ 黄金会员等级已创建');

  // 4. 创建铂金会员等级
  await db.insert(systemConfigs).values({
    code: 'member_level_platinum',
    category: 'member_level',
    nameRu: 'Платиновый',
    nameEn: 'Platinum',
    nameZh: '铂金会员',
    descriptionRu: 'Платиновый уровень членства',
    descriptionEn: 'Platinum membership level',
    descriptionZh: '铂金会员等级',
    config: {
      level: 4,
      icon: '💎',
      color: '#E5E4E2',
      upgradeConditions: {
        type: 'auto',
        requiredPoints: 15000,
        requiredOrders: 150,
        requiredAmount: 75000,
      },
      benefits: {
        pointsMultiplier: 2.0,
        birthdayPoints: 1000,
        birthdayCoupon: true,
        exclusiveProducts: true,
        prioritySupport: true,
        freeDeliveryThreshold: 0, // 全部免配送费
        monthlyFreeCoupon: 5,
        exclusiveDiscount: 10, // 10% 额外折扣
        personalizedService: true,
        earlyAccess: true, // 新品优先购买
      },
    },
    isEnabled: true,
    sortOrder: 4,
  });

  console.log('✓ 铂金会员等级已创建');

  console.log('会员等级配置初始化完成！');
}

// 运行初始化
initMemberLevels()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
