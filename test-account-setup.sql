-- CHU TEA 测试账户和测试数据设置
-- 创建测试用户，包含10张优惠券和1000积分

-- 1. 创建测试用户
INSERT INTO users (
  openId, 
  telegramId, 
  name, 
  email, 
  phone, 
  phoneVerified,
  totalPoints, 
  availablePoints, 
  memberLevel,
  role,
  createdAt,
  updatedAt
) VALUES (
  'test_user_001',
  '123456789',
  '测试用户',
  'test@chutea.com',
  '+79001234567',
  true,
  1000,  -- 1000积分
  1000,
  'gold',
  'user',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  availablePoints = 1000,
  totalPoints = 1000;

-- 获取测试用户ID
SET @test_user_id = (SELECT id FROM users WHERE openId = 'test_user_001');

-- 2. 创建"满100减50"优惠券模板
INSERT INTO couponTemplates (
  code,
  nameZh,
  nameRu,
  nameEn,
  descriptionZh,
  descriptionRu,
  descriptionEn,
  type,
  value,
  minOrderAmount,
  maxDiscount,
  totalQuantity,
  usedQuantity,
  perUserLimit,
  validDays,
  isActive,
  createdAt,
  updatedAt
) VALUES (
  'SAVE50',
  '满100减50',
  'Скидка 50₽ при заказе от 100₽',
  'Save 50₽ on orders over 100₽',
  '订单满100卢布立减50卢布',
  'Скидка 50 рублей при заказе от 100 рублей',
  'Get 50 rubles off on orders over 100 rubles',
  'fixed',  -- 固定金额优惠
  50.00,    -- 减50卢布
  100.00,   -- 最低消费100卢布
  50.00,    -- 最大折扣50卢布
  1000,     -- 总共1000张
  0,        -- 已使用0张
  10,       -- 每人限领10张
  30,       -- 有效期30天
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  isActive = true,
  totalQuantity = 1000;

-- 获取优惠券模板ID
SET @coupon_template_id = (SELECT id FROM couponTemplates WHERE code = 'SAVE50');

-- 3. 为测试用户发放10张优惠券
INSERT INTO userCoupons (userId, templateId, status, expireAt, createdAt)
SELECT 
  @test_user_id,
  @coupon_template_id,
  'available',
  DATE_ADD(NOW(), INTERVAL 30 DAY),
  NOW()
FROM (
  SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
  UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) AS numbers
WHERE NOT EXISTS (
  SELECT 1 FROM userCoupons 
  WHERE userId = @test_user_id 
  AND templateId = @coupon_template_id 
  AND status = 'available'
  HAVING COUNT(*) >= 10
);

-- 4. 记录积分获取历史
INSERT INTO pointsHistory (
  userId,
  type,
  points,
  balance,
  descriptionZh,
  descriptionRu,
  descriptionEn,
  createdAt
) VALUES (
  @test_user_id,
  'adjust',
  1000,
  1000,
  '测试账户初始积分',
  'Начальные баллы тестового аккаунта',
  'Test account initial points',
  NOW()
) ON DUPLICATE KEY UPDATE
  createdAt = createdAt;

-- 5. 创建更多优惠券模板（用于测试）

-- 新用户欢迎券
INSERT INTO couponTemplates (
  code, nameZh, nameRu, nameEn,
  descriptionZh, descriptionRu, descriptionEn,
  type, value, minOrderAmount, maxDiscount,
  totalQuantity, usedQuantity, perUserLimit, validDays, isActive,
  createdAt, updatedAt
) VALUES (
  'WELCOME20',
  '新用户立减20',
  'Скидка 20₽ для новых пользователей',
  '20₽ off for new users',
  '新用户首单立减20卢布',
  'Скидка 20 рублей на первый заказ',
  'Get 20 rubles off your first order',
  'fixed', 20.00, 50.00, 20.00,
  -1, 0, 1, 7, true,
  NOW(), NOW()
) ON DUPLICATE KEY UPDATE isActive = true;

-- 满200减100
INSERT INTO couponTemplates (
  code, nameZh, nameRu, nameEn,
  descriptionZh, descriptionRu, descriptionEn,
  type, value, minOrderAmount, maxDiscount,
  totalQuantity, usedQuantity, perUserLimit, validDays, isActive,
  createdAt, updatedAt
) VALUES (
  'SAVE100',
  '满200减100',
  'Скидка 100₽ при заказе от 200₽',
  'Save 100₽ on orders over 200₽',
  '订单满200卢布立减100卢布',
  'Скидка 100 рублей при заказе от 200 рублей',
  'Get 100 rubles off on orders over 200 rubles',
  'fixed', 100.00, 200.00, 100.00,
  500, 0, 5, 30, true,
  NOW(), NOW()
) ON DUPLICATE KEY UPDATE isActive = true;

-- 9折优惠券
INSERT INTO couponTemplates (
  code, nameZh, nameRu, nameEn,
  descriptionZh, descriptionRu, descriptionEn,
  type, value, minOrderAmount, maxDiscount,
  totalQuantity, usedQuantity, perUserLimit, validDays, isActive,
  createdAt, updatedAt
) VALUES (
  'DISCOUNT10',
  '全场9折',
  'Скидка 10%',
  '10% off',
  '全场商品享9折优惠',
  'Скидка 10% на все товары',
  'Get 10% off on all items',
  'percent', 10.00, 0.00, 50.00,
  -1, 0, 3, 14, true,
  NOW(), NOW()
) ON DUPLICATE KEY UPDATE isActive = true;

-- 6. 显示测试账户信息
SELECT 
  '测试账户信息' AS info,
  u.id AS user_id,
  u.openId,
  u.telegramId,
  u.name,
  u.email,
  u.phone,
  u.availablePoints AS points,
  COUNT(uc.id) AS available_coupons
FROM users u
LEFT JOIN userCoupons uc ON u.id = uc.userId AND uc.status = 'available'
WHERE u.openId = 'test_user_001'
GROUP BY u.id;

-- 显示用户的优惠券
SELECT 
  '用户优惠券' AS info,
  ct.code,
  ct.nameRu AS name,
  ct.descriptionRu AS description,
  ct.value,
  ct.minOrderAmount,
  uc.status,
  uc.expireAt
FROM userCoupons uc
JOIN couponTemplates ct ON uc.templateId = ct.id
WHERE uc.userId = @test_user_id
ORDER BY uc.createdAt DESC;

-- 显示所有可用优惠券模板
SELECT 
  '所有优惠券模板' AS info,
  id,
  code,
  nameRu AS name,
  type,
  value,
  minOrderAmount,
  totalQuantity,
  usedQuantity,
  isActive
FROM couponTemplates
WHERE isActive = true
ORDER BY minOrderAmount ASC;
