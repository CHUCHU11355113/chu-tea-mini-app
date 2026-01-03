/**
 * 初始化积分规则
 * 创建积分获取和消耗规则
 */
import { getDb } from '../db';
import { businessRules } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initPointsRules() {
  console.log('开始初始化积分规则...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在规则
  const existing = await db.select().from(businessRules).where(eq(businessRules.code, 'points_earn_on_order'));
  
  if (existing.length > 0) {
    console.log('积分规则已存在，跳过');
    return;
  }

  // 1. 创建消费积分规则（消费1卢布=1积分）
  await db.insert(businessRules).values({
    code: 'points_earn_on_order',
    nameRu: 'Баллы за покупки',
    nameEn: 'Points on Purchase',
    nameZh: '消费积分',
    descriptionRu: 'Получайте 1 балл за каждый потраченный рубль',
    descriptionEn: 'Earn 1 point for every ruble spent',
    descriptionZh: '消费1卢布获得1积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'order_completed',
        logic: 'AND',
      },
      {
        field: 'orderAmount',
        operator: '>',
        value: 0,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'givePoints',
        params: {
          formula: 'orderAmount * 1',
          multiplier: 1,
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 消费积分规则已创建');

  // 2. 创建会员等级加速规则
  await db.insert(businessRules).values({
    code: 'points_multiplier_silver',
    nameRu: 'Бонус для серебряных членов',
    nameEn: 'Silver Member Bonus',
    nameZh: '白银会员积分加速',
    descriptionRu: 'Серебряные члены получают 1.2x баллов',
    descriptionEn: 'Silver members earn 1.2x points',
    descriptionZh: '白银会员获得1.2倍积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'order_completed',
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
        type: 'givePoints',
        params: {
          formula: 'orderAmount * 1',
          multiplier: 1.2,
        },
      },
    ],
    priority: 15,
    mutexGroup: 'member_points_bonus',
    isEnabled: true,
  });

  console.log('✓ 白银会员积分加速规则已创建');

  // 3. 创建黄金会员加速规则
  await db.insert(businessRules).values({
    code: 'points_multiplier_gold',
    nameRu: 'Бонус для золотых членов',
    nameEn: 'Gold Member Bonus',
    nameZh: '黄金会员积分加速',
    descriptionRu: 'Золотые члены получают 1.5x баллов',
    descriptionEn: 'Gold members earn 1.5x points',
    descriptionZh: '黄金会员获得1.5倍积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'order_completed',
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
        type: 'givePoints',
        params: {
          formula: 'orderAmount * 1',
          multiplier: 1.5,
        },
      },
    ],
    priority: 20,
    mutexGroup: 'member_points_bonus',
    isEnabled: true,
  });

  console.log('✓ 黄金会员积分加速规则已创建');

  // 4. 创建每日签到积分规则
  await db.insert(businessRules).values({
    code: 'points_daily_checkin',
    nameRu: 'Ежедневная регистрация',
    nameEn: 'Daily Check-in',
    nameZh: '每日签到',
    descriptionRu: 'Получите 10 баллов за ежедневную регистрацию',
    descriptionEn: 'Get 10 points for daily check-in',
    descriptionZh: '每日签到获得10积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'daily_checkin',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'givePoints',
        params: {
          formula: '10',
          multiplier: 1,
        },
      },
    ],
    priority: 5,
    isEnabled: true,
  });

  console.log('✓ 每日签到积分规则已创建');

  // 5. 创建评价积分规则
  await db.insert(businessRules).values({
    code: 'points_review',
    nameRu: 'Баллы за отзывы',
    nameEn: 'Points for Reviews',
    nameZh: '评价积分',
    descriptionRu: 'Получите 20 баллов за отзыв с фото',
    descriptionEn: 'Get 20 points for review with photo',
    descriptionZh: '带图评价获得20积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'review_submitted',
        logic: 'AND',
      },
      {
        field: 'review.hasPhoto',
        operator: '=',
        value: true,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'givePoints',
        params: {
          formula: '20',
          multiplier: 1,
        },
      },
    ],
    priority: 5,
    isEnabled: true,
  });

  console.log('✓ 评价积分规则已创建');

  // 6. 创建邀请好友积分规则
  await db.insert(businessRules).values({
    code: 'points_invite_friend',
    nameRu: 'Баллы за приглашение друзей',
    nameEn: 'Points for Inviting Friends',
    nameZh: '邀请好友积分',
    descriptionRu: 'Получите 100 баллов за каждого приглашенного друга',
    descriptionEn: 'Get 100 points for each friend invited',
    descriptionZh: '每邀请一位好友获得100积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'friend_invited',
        logic: 'AND',
      },
      {
        field: 'invitee.firstOrderCompleted',
        operator: '=',
        value: true,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'givePoints',
        params: {
          formula: '100',
          multiplier: 1,
        },
      },
    ],
    priority: 5,
    isEnabled: true,
  });

  console.log('✓ 邀请好友积分规则已创建');

  // 7. 创建生日积分规则
  await db.insert(businessRules).values({
    code: 'points_birthday',
    nameRu: 'Баллы на день рождения',
    nameEn: 'Birthday Points',
    nameZh: '生日积分',
    descriptionRu: 'Получите 200 баллов в свой день рождения',
    descriptionEn: 'Get 200 points on your birthday',
    descriptionZh: '生日当天获得200积分',
    ruleType: 'points',
    conditions: [
      {
        field: 'eventType',
        operator: '=',
        value: 'birthday',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'givePoints',
        params: {
          formula: '200',
          multiplier: 1,
        },
      },
      {
        type: 'giveCoupon',
        params: {
          couponId: 0, // 需要后续配置
          quantity: 1,
        },
      },
    ],
    priority: 5,
    isEnabled: true,
  });

  console.log('✓ 生日积分规则已创建');

  console.log('积分规则初始化完成！');
}

// 运行初始化
initPointsRules()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
