-- CHU TEA - 为所有用户添加优惠券和积分
-- 每个用户获得：10张满100减50优惠券 + 1000积分

-- 1. 确保优惠券模板存在
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
  'fixed',
  50.00,
  100.00,
  50.00,
  -1,  -- 无限量
  0,
  10,  -- 每人限领10张
  30,
  true,
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  isActive = true,
  totalQuantity = -1,
  perUserLimit = 10;

-- 获取优惠券模板ID
SET @coupon_template_id = (SELECT id FROM couponTemplates WHERE code = 'SAVE50');

-- 2. 为所有用户添加1000积分
UPDATE users 
SET 
  availablePoints = availablePoints + 1000,
  totalPoints = totalPoints + 1000,
  updatedAt = NOW()
WHERE id > 0;

-- 3. 记录积分历史
INSERT INTO pointsHistory (userId, type, points, balance, descriptionZh, descriptionRu, descriptionEn, createdAt)
SELECT 
  id,
  'adjust',
  1000,
  availablePoints,
  '系统赠送积分',
  'Системные бонусные баллы',
  'System bonus points',
  NOW()
FROM users
WHERE id > 0
ON DUPLICATE KEY UPDATE createdAt = createdAt;

-- 4. 为所有用户发放10张优惠券
-- 创建临时表存储用户ID和数字序列
CREATE TEMPORARY TABLE IF NOT EXISTS user_coupon_temp AS
SELECT u.id as userId, n.num
FROM users u
CROSS JOIN (
  SELECT 1 as num UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
  UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) n
WHERE u.id > 0;

-- 插入优惠券（避免重复）
INSERT INTO userCoupons (userId, templateId, status, expireAt, createdAt)
SELECT 
  t.userId,
  @coupon_template_id,
  'available',
  DATE_ADD(NOW(), INTERVAL 30 DAY),
  NOW()
FROM user_coupon_temp t
WHERE NOT EXISTS (
  SELECT 1 FROM userCoupons uc
  WHERE uc.userId = t.userId 
  AND uc.templateId = @coupon_template_id 
  AND uc.status = 'available'
  HAVING COUNT(*) >= 10
)
GROUP BY t.userId, t.num;

-- 清理临时表
DROP TEMPORARY TABLE IF EXISTS user_coupon_temp;

-- 5. 创建更多优惠券模板供用户使用

-- 新用户欢迎券（20卢布）
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
) ON DUPLICATE KEY UPDATE isActive = true, totalQuantity = -1;

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
  -1, 0, 5, 30, true,
  NOW(), NOW()
) ON DUPLICATE KEY UPDATE isActive = true, totalQuantity = -1;

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
) ON DUPLICATE KEY UPDATE isActive = true, totalQuantity = -1;

-- 6. 显示统计信息
SELECT 
  '用户总数' AS info,
  COUNT(*) AS count
FROM users;

SELECT 
  '已添加积分的用户数' AS info,
  COUNT(*) AS count
FROM users
WHERE availablePoints >= 1000;

SELECT 
  '已发放的优惠券总数' AS info,
  COUNT(*) AS count
FROM userCoupons
WHERE templateId = @coupon_template_id
AND status = 'available';

SELECT 
  '每个用户的优惠券数量' AS info,
  userId,
  COUNT(*) AS coupon_count,
  (SELECT availablePoints FROM users WHERE id = uc.userId) AS points
FROM userCoupons uc
WHERE templateId = @coupon_template_id
AND status = 'available'
GROUP BY userId
LIMIT 10;

-- 完成提示
SELECT '✅ 所有用户已成功添加1000积分和10张满100减50优惠券！' AS result;
