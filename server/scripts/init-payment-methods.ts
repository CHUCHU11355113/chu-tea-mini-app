/**
 * 初始化支付方式配置
 * 创建示例支付方式：YooKassa在线支付、货到付款、积分支付等
 */
import { getDb } from '../db';
import { systemConfigs } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

async function initPaymentMethods() {
  console.log('开始初始化支付方式配置...');
  const db = await getDb();
  
  if (!db) {
    throw new Error('数据库连接失败，请检查 DATABASE_URL 环境变量');
  }

  // 检查是否已存在支付方式配置
  const existing = await db.select().from(systemConfigs).where(eq(systemConfigs.code, 'payment_yookassa'));
  
  if (existing.length > 0) {
    console.log('支付方式配置已存在，跳过');
    return;
  }

  // 1. YooKassa 在线支付
  await db.insert(systemConfigs).values({
    code: 'payment_yookassa',
    category: 'payment_method',
    nameRu: 'Онлайн оплата',
    nameEn: 'Online Payment',
    nameZh: '在线支付',
    descriptionRu: 'Оплата банковской картой через YooKassa',
    descriptionEn: 'Pay with bank card via YooKassa',
    descriptionZh: '通过YooKassa银行卡支付',
    config: {
      provider: 'yookassa',
      icon: '💳',
      supportedCurrencies: ['RUB'],
      supportedCards: ['visa', 'mastercard', 'mir'],
      minAmount: 100,
      maxAmount: 100000,
      processingFee: {
        type: 'percent',
        value: 2.5,
        paidBy: 'merchant', // merchant, customer
      },
      requiresAuth: false,
      instantConfirmation: true,
      refundable: true,
      refundPeriodDays: 14,
    },
    isEnabled: true,
    sortOrder: 1,
  });

  console.log('✓ YooKassa在线支付已创建');

  // 2. 货到付款
  await db.insert(systemConfigs).values({
    code: 'payment_cash_on_delivery',
    category: 'payment_method',
    nameRu: 'Оплата при получении',
    nameEn: 'Cash on Delivery',
    nameZh: '货到付款',
    descriptionRu: 'Оплата наличными при получении заказа',
    descriptionEn: 'Pay with cash when receiving order',
    descriptionZh: '收货时现金支付',
    config: {
      provider: 'cash',
      icon: '💵',
      supportedCurrencies: ['RUB'],
      minAmount: 200,
      maxAmount: 10000,
      processingFee: {
        type: 'fixed',
        value: 0,
        paidBy: 'merchant',
      },
      requiresAuth: false,
      instantConfirmation: false,
      refundable: true,
      refundPeriodDays: 7,
      availableFor: ['delivery'], // delivery, pickup
      restrictions: {
        memberLevels: ['bronze', 'silver', 'gold', 'platinum'],
        maxUnpaidOrders: 2, // 最多2个未支付订单
      },
    },
    isEnabled: true,
    sortOrder: 2,
  });

  console.log('✓ 货到付款已创建');

  // 3. 积分支付
  await db.insert(systemConfigs).values({
    code: 'payment_points',
    category: 'payment_method',
    nameRu: 'Оплата баллами',
    nameEn: 'Pay with Points',
    nameZh: '积分支付',
    descriptionRu: 'Используйте баллы для оплаты',
    descriptionEn: 'Use your points to pay',
    descriptionZh: '使用积分支付',
    config: {
      provider: 'points',
      icon: '⭐',
      supportedCurrencies: ['POINTS'],
      conversionRate: 1, // 1 积分 = 1 卢布
      minAmount: 100,
      maxAmount: null, // 无上限
      maxPercentage: 50, // 最多抵扣50%订单金额
      processingFee: {
        type: 'fixed',
        value: 0,
        paidBy: 'merchant',
      },
      requiresAuth: true,
      instantConfirmation: true,
      refundable: true,
      refundPeriodDays: 30,
      restrictions: {
        memberLevels: ['silver', 'gold', 'platinum'], // 白银及以上可用
        minPointsBalance: 100,
      },
    },
    isEnabled: true,
    sortOrder: 3,
  });

  console.log('✓ 积分支付已创建');

  // 4. SBP (Система быстрых платежей) - 快速支付系统
  await db.insert(systemConfigs).values({
    code: 'payment_sbp',
    category: 'payment_method',
    nameRu: 'СБП',
    nameEn: 'SBP',
    nameZh: '快速支付',
    descriptionRu: 'Система быстрых платежей',
    descriptionEn: 'Fast Payment System',
    descriptionZh: '俄罗斯快速支付系统',
    config: {
      provider: 'sbp',
      icon: '⚡',
      supportedCurrencies: ['RUB'],
      minAmount: 100,
      maxAmount: 100000,
      processingFee: {
        type: 'percent',
        value: 0.5,
        paidBy: 'merchant',
      },
      requiresAuth: false,
      instantConfirmation: true,
      refundable: true,
      refundPeriodDays: 14,
      qrCodeTimeout: 300, // 二维码5分钟有效期
    },
    isEnabled: true,
    sortOrder: 4,
  });

  console.log('✓ SBP快速支付已创建');

  // 5. 分期付款
  await db.insert(systemConfigs).values({
    code: 'payment_installment',
    category: 'payment_method',
    nameRu: 'Рассрочка',
    nameEn: 'Installment',
    nameZh: '分期付款',
    descriptionRu: 'Оплата в рассрочку на 3-12 месяцев',
    descriptionEn: 'Pay in installments for 3-12 months',
    descriptionZh: '3-12个月分期付款',
    config: {
      provider: 'tinkoff_installment',
      icon: '📅',
      supportedCurrencies: ['RUB'],
      minAmount: 3000,
      maxAmount: 100000,
      installmentPeriods: [3, 6, 12], // 3、6、12个月
      interestRate: 0, // 0% 利息
      processingFee: {
        type: 'percent',
        value: 5,
        paidBy: 'merchant',
      },
      requiresAuth: true,
      instantConfirmation: false,
      refundable: true,
      refundPeriodDays: 14,
      restrictions: {
        memberLevels: ['gold', 'platinum'], // 黄金及以上可用
        minAge: 18,
        requiresVerification: true,
      },
    },
    isEnabled: false, // 默认禁用，需要与Tinkoff对接后启用
    sortOrder: 5,
  });

  console.log('✓ 分期付款已创建（默认禁用）');

  console.log('支付方式配置初始化完成！');
}

// 运行初始化
initPaymentMethods()
  .then(() => {
    console.log('初始化成功');
    process.exit(0);
  })
  .catch((error) => {
    console.error('初始化失败:', error);
    process.exit(1);
  });
