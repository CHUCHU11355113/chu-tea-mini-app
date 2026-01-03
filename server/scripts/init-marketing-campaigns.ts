/**
 * 初始化营销活动配置
 * 创建示例营销活动：限时折扣、满减、买赠等
 */
import { getDb } from '../db';
import { businessRules } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initMarketingCampaigns() {
  console.log('开始初始化营销活动配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在营销活动
  const existing = await db.select().from(businessRules).where(eq(businessRules.code, 'campaign_happy_hour'));
  
  if (existing.length > 0) {
    console.log('营销活动配置已存在，跳过');
    return;
  }

  // 1. 欢乐时光活动（下午2-4点9折）
  await db.insert(businessRules).values({
    code: 'campaign_happy_hour',
    nameRu: 'Счастливые часы',
    nameEn: 'Happy Hour',
    nameZh: '欢乐时光',
    descriptionRu: 'Скидка 10% с 14:00 до 16:00',
    descriptionEn: '10% off from 2PM to 4PM',
    descriptionZh: '下午2点到4点享受9折优惠',
    ruleType: 'marketing',
    conditions: [
      {
        field: 'order.time',
        operator: 'between',
        value: ['14:00', '16:00'],
        logic: 'AND',
      },
      {
        field: 'orderAmount',
        operator: '>=',
        value: 200,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'discount',
        params: {
          discountType: 'percent',
          value: 10,
          maxAmount: 100,
        },
      },
    ],
    priority: 15,
    isEnabled: true,
  });

  console.log('✓ 欢乐时光活动已创建');

  // 2. 周末特惠活动
  await db.insert(businessRules).values({
    code: 'campaign_weekend_special',
    nameRu: 'Выходные специальное предложение',
    nameEn: 'Weekend Special',
    nameZh: '周末特惠',
    descriptionRu: 'Скидка 15% в выходные дни',
    descriptionEn: '15% off on weekends',
    descriptionZh: '周末享受85折优惠',
    ruleType: 'marketing',
    conditions: [
      {
        field: 'order.dayOfWeek',
        operator: 'in',
        value: [6, 0], // 周六、周日
        logic: 'AND',
      },
      {
        field: 'orderAmount',
        operator: '>=',
        value: 300,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'discount',
        params: {
          discountType: 'percent',
          value: 15,
          maxAmount: 150,
        },
      },
    ],
    priority: 12,
    isEnabled: true,
  });

  console.log('✓ 周末特惠活动已创建');

  // 3. 买二送一活动
  await db.insert(businessRules).values({
    code: 'campaign_buy_2_get_1_free',
    nameRu: 'Купи 2, получи 1 бесплатно',
    nameEn: 'Buy 2 Get 1 Free',
    nameZh: '买二送一',
    descriptionRu: 'Купите 2 напитка, получите 1 бесплатно',
    descriptionEn: 'Buy 2 drinks, get 1 free',
    descriptionZh: '购买2杯饮品，第3杯免费',
    ruleType: 'marketing',
    conditions: [
      {
        field: 'cart.itemCount',
        operator: '>=',
        value: 2,
        logic: 'AND',
      },
      {
        field: 'cart.category',
        operator: '=',
        value: 'drinks',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'giveProduct',
        params: {
          productType: 'cheapest_in_cart',
          quantity: 1,
          category: 'drinks',
        },
      },
    ],
    priority: 18,
    isEnabled: true,
  });

  console.log('✓ 买二送一活动已创建');

  // 4. 新品尝鲜活动
  await db.insert(businessRules).values({
    code: 'campaign_new_product_trial',
    nameRu: 'Попробуйте новый продукт',
    nameEn: 'New Product Trial',
    nameZh: '新品尝鲜',
    descriptionRu: 'Скидка 20% на новые продукты',
    descriptionEn: '20% off on new products',
    descriptionZh: '新品享受8折优惠',
    ruleType: 'marketing',
    conditions: [
      {
        field: 'product.tags',
        operator: 'contains',
        value: 'new',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'discount',
        params: {
          discountType: 'percent',
          value: 20,
          applyTo: 'product',
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 新品尝鲜活动已创建');

  // 5. 雨天温暖活动
  await db.insert(businessRules).values({
    code: 'campaign_rainy_day_warmth',
    nameRu: 'Тепло в дождливый день',
    nameEn: 'Rainy Day Warmth',
    nameZh: '雨天温暖',
    descriptionRu: 'Бесплатная доставка в дождливые дни',
    descriptionEn: 'Free delivery on rainy days',
    descriptionZh: '雨天免配送费',
    ruleType: 'marketing',
    conditions: [
      {
        field: 'weather.condition',
        operator: '=',
        value: 'rain',
        logic: 'AND',
      },
      {
        field: 'deliveryMethod',
        operator: '=',
        value: 'delivery',
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'discount',
        params: {
          discountType: 'fixed',
          value: 0,
          applyTo: 'delivery_fee',
        },
      },
    ],
    priority: 20,
    isEnabled: false, // 默认禁用，需要接入天气API后启用
  });

  console.log('✓ 雨天温暖活动已创建（默认禁用）');

  // 6. 连续签到奖励活动
  await db.insert(businessRules).values({
    code: 'campaign_consecutive_checkin',
    nameRu: 'Награда за последовательную регистрацию',
    nameEn: 'Consecutive Check-in Reward',
    nameZh: '连续签到奖励',
    descriptionRu: 'Дополнительные баллы за 7 дней подряд',
    descriptionEn: 'Extra points for 7 consecutive days',
    descriptionZh: '连续签到7天额外奖励',
    ruleType: 'marketing',
    conditions: [
      {
        field: 'user.consecutiveCheckinDays',
        operator: '=',
        value: 7,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'givePoints',
        params: {
          formula: '100',
          reason: 'Бонус за 7 дней подряд',
        },
      },
      {
        type: 'giveCoupon',
        params: {
          couponCode: 'checkin_7days',
          quantity: 1,
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 连续签到奖励活动已创建');

  console.log('营销活动配置初始化完成！');
}

// 运行初始化
initMarketingCampaigns()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
