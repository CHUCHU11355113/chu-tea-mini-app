/**
 * 初始化会员等级升级规则
 */
import { getDb } from '../db';
import { businessRules } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initMemberUpgradeRules() {
  console.log('开始初始化会员升级规则...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在规则
  const existing = await db.select().from(businessRules).where(eq(businessRules.code, 'member_upgrade_to_silver'));
  
  if (existing.length > 0) {
    console.log('会员升级规则已存在，跳过');
    return;
  }

  // 1. 升级到白银会员规则
  await db.insert(businessRules).values({
    code: 'member_upgrade_to_silver',
    nameRu: 'Повышение до серебряного',
    nameEn: 'Upgrade to Silver',
    nameZh: '升级到白银会员',
    descriptionRu: 'Автоматическое повышение до серебряного уровня',
    descriptionEn: 'Automatic upgrade to Silver level',
    descriptionZh: '自动升级到白银会员',
    ruleType: 'member',
    conditions: [
      {
        field: 'user.totalPoints',
        operator: '>=',
        value: 1000,
        logic: 'AND',
      },
      {
        field: 'user.totalOrders',
        operator: '>=',
        value: 10,
        logic: 'AND',
      },
      {
        field: 'user.totalSpent',
        operator: '>=',
        value: 5000,
        logic: 'AND',
      },
      {
        field: 'user.memberLevel',
        operator: '=',
        value: 'bronze',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'upgradeMember',
        params: {
          newLevel: 'silver',
        },
      },
      {
        type: 'givePoints',
        params: {
          formula: '100',
          reason: 'Бонус за повышение уровня',
        },
      },
      {
        type: 'sendNotification',
        params: {
          type: 'member_upgrade',
          title: 'Поздравляем!',
          message: 'Вы повышены до серебряного уровня!',
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 白银会员升级规则已创建');

  // 2. 升级到黄金会员规则
  await db.insert(businessRules).values({
    code: 'member_upgrade_to_gold',
    nameRu: 'Повышение до золотого',
    nameEn: 'Upgrade to Gold',
    nameZh: '升级到黄金会员',
    descriptionRu: 'Автоматическое повышение до золотого уровня',
    descriptionEn: 'Automatic upgrade to Gold level',
    descriptionZh: '自动升级到黄金会员',
    ruleType: 'member',
    conditions: [
      {
        field: 'user.totalPoints',
        operator: '>=',
        value: 5000,
        logic: 'AND',
      },
      {
        field: 'user.totalOrders',
        operator: '>=',
        value: 50,
        logic: 'AND',
      },
      {
        field: 'user.totalSpent',
        operator: '>=',
        value: 25000,
        logic: 'AND',
      },
      {
        field: 'user.memberLevel',
        operator: '=',
        value: 'silver',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'upgradeMember',
        params: {
          newLevel: 'gold',
        },
      },
      {
        type: 'givePoints',
        params: {
          formula: '500',
          reason: 'Бонус за повышение уровня',
        },
      },
      {
        type: 'giveCoupon',
        params: {
          couponCode: 'gold_welcome',
          quantity: 1,
        },
      },
      {
        type: 'sendNotification',
        params: {
          type: 'member_upgrade',
          title: 'Поздравляем!',
          message: 'Вы повышены до золотого уровня!',
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 黄金会员升级规则已创建');

  // 3. 升级到铂金会员规则
  await db.insert(businessRules).values({
    code: 'member_upgrade_to_platinum',
    nameRu: 'Повышение до платинового',
    nameEn: 'Upgrade to Platinum',
    nameZh: '升级到铂金会员',
    descriptionRu: 'Автоматическое повышение до платинового уровня',
    descriptionEn: 'Automatic upgrade to Platinum level',
    descriptionZh: '自动升级到铂金会员',
    ruleType: 'member',
    conditions: [
      {
        field: 'user.totalPoints',
        operator: '>=',
        value: 15000,
        logic: 'AND',
      },
      {
        field: 'user.totalOrders',
        operator: '>=',
        value: 150,
        logic: 'AND',
      },
      {
        field: 'user.totalSpent',
        operator: '>=',
        value: 75000,
        logic: 'AND',
      },
      {
        field: 'user.memberLevel',
        operator: '=',
        value: 'gold',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'upgradeMember',
        params: {
          newLevel: 'platinum',
        },
      },
      {
        type: 'givePoints',
        params: {
          formula: '2000',
          reason: 'Бонус за повышение уровня',
        },
      },
      {
        type: 'giveCoupon',
        params: {
          couponCode: 'platinum_welcome',
          quantity: 3,
        },
      },
      {
        type: 'sendNotification',
        params: {
          type: 'member_upgrade',
          title: 'Поздравляем!',
          message: 'Вы повышены до платинового уровня!',
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 铂金会员升级规则已创建');

  console.log('会员升级规则初始化完成！');
}

// 运行初始化
initMemberUpgradeRules()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
