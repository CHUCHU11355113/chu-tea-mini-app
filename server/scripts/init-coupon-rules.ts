/**
 * 初始化优惠券规则
 * 创建示例优惠券规则：满减、折扣等
 */
import { getDb } from '../db';
import { businessRules } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initCouponRules() {
  console.log('开始初始化优惠券规则...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在规则
  const existing = await db.select().from(businessRules).where(eq(businessRules.code, 'coupon_reduce_50_on_500'));
  
  if (existing.length > 0) {
    console.log('优惠券规则已存在，跳过');
    return;
  }

  // 1. 创建满500减50规则
  await db.insert(businessRules).values({
    code: 'coupon_reduce_50_on_500',
    nameRu: 'Скидка 50₽ при заказе от 500₽',
    nameEn: '50₽ off on 500₽',
    nameZh: '满500减50',
    descriptionRu: 'Получите скидку 50₽ при заказе от 500₽',
    descriptionEn: 'Get 50₽ off when you spend 500₽ or more',
    descriptionZh: '订单满500卢布减50卢布',
    ruleType: 'coupon',
    conditions: [
      {
        field: 'orderAmount',
        operator: '>=',
        value: 500,
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'discount',
        params: {
          discountType: 'fixed',
          value: 50,
        },
      },
    ],
    priority: 10,
    isEnabled: true,
  });

  console.log('✓ 满500减50规则已创建');

  // 2. 创建9折优惠规则
  await db.insert(businessRules).values({
    code: 'coupon_10percent_off',
    nameRu: 'Скидка 10%',
    nameEn: '10% Off',
    nameZh: '9折优惠',
    descriptionRu: 'Получите скидку 10% на весь заказ',
    descriptionEn: 'Get 10% off your entire order',
    descriptionZh: '全场9折优惠',
    ruleType: 'coupon',
    conditions: [
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
          value: 10,
          maxAmount: 100, // 最多减100卢布
        },
      },
    ],
    priority: 5,
    isEnabled: true,
  });

  console.log('✓ 9折优惠规则已创建');

  // 3. 创建新用户首单优惠规则
  await db.insert(businessRules).values({
    code: 'coupon_first_order_discount',
    nameRu: 'Скидка для новых клиентов',
    nameEn: 'New Customer Discount',
    nameZh: '新用户首单优惠',
    descriptionRu: 'Скидка 100₽ на первый заказ',
    descriptionEn: '100₽ off your first order',
    descriptionZh: '新用户首单立减100卢布',
    ruleType: 'coupon',
    conditions: [
      {
        field: 'user.orderCount',
        operator: '=',
        value: 0,
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
          discountType: 'fixed',
          value: 100,
        },
      },
    ],
    priority: 20,
    mutexGroup: 'first_order',
    isEnabled: true,
  });

  console.log('✓ 新用户首单优惠规则已创建');

  // 4. 创建会员专享折扣规则
  await db.insert(businessRules).values({
    code: 'coupon_vip_discount',
    nameRu: 'Скидка для VIP',
    nameEn: 'VIP Discount',
    nameZh: '会员专享折扣',
    descriptionRu: 'Дополнительная скидка 5% для VIP членов',
    descriptionEn: 'Extra 5% off for VIP members',
    descriptionZh: 'VIP会员额外享受95折',
    ruleType: 'coupon',
    conditions: [
      {
        field: 'user.memberLevel',
        operator: 'in',
        value: ['gold', 'platinum'],
        logic: 'AND',
      },
    ],
    actions: [
      {
        type: 'discount',
        params: {
          discountType: 'percent',
          value: 5,
          maxAmount: 50,
        },
      },
    ],
    priority: 15,
    isEnabled: true,
  });

  console.log('✓ 会员专享折扣规则已创建');

  // 5. 创建免配送费规则
  await db.insert(businessRules).values({
    code: 'coupon_free_delivery',
    nameRu: 'Бесплатная доставка',
    nameEn: 'Free Delivery',
    nameZh: '免配送费',
    descriptionRu: 'Бесплатная доставка при заказе от 800₽',
    descriptionEn: 'Free delivery on orders over 800₽',
    descriptionZh: '订单满800卢布免配送费',
    ruleType: 'coupon',
    conditions: [
      {
        field: 'orderAmount',
        operator: '>=',
        value: 800,
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
          value: 0, // 配送费将在后续逻辑中处理
          applyTo: 'delivery_fee',
        },
      },
    ],
    priority: 8,
    isEnabled: true,
  });

  console.log('✓ 免配送费规则已创建');

  console.log('优惠券规则初始化完成！');
}

// 运行初始化
initCouponRules()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
