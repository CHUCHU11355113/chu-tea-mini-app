-- 清空现有数据
TRUNCATE TABLE productOptionItems;
TRUNCATE TABLE productOptions;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE stores;

-- 插入门店数据
INSERT INTO stores (id, code, nameZh, nameRu, nameEn, addressZh, addressRu, addressEn, phone, latitude, longitude, openTime, closeTime, isOpen, status, deliveryRadius, minOrderAmount, deliveryFee) VALUES
(1, 'STORE001', '中央店', 'Центральный магазин', 'Central Store', '北京市朝阳区中央大街1号', 'Пекин, район Чаоян, Центральная улица, 1', 'Beijing, Chaoyang District, Central Street, 1', '+86-10-12345678', 39.9042, 116.4074, '09:00', '22:00', 1, 'active', 5000, 30.00, 5.00);

-- 插入分类数据（茶饮分类）
INSERT INTO categories (id, type, nameZh, nameRu, nameEn, image, sortOrder, isActive) VALUES
(1, 'tea', '奶茶', 'Молочный чай', 'Milk Tea', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', 1, 1),
(2, 'tea', '水果茶', 'Фруктовый чай', 'Fruit Tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200', 2, 1),
(3, 'tea', '咖啡', 'Кофе', 'Coffee', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200', 3, 1),
(4, 'tea', '特调饮品', 'Специальные напитки', 'Special Drinks', 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200', 4, 1);

-- 插入商品数据
INSERT INTO products (id, categoryId, type, code, nameZh, nameRu, nameEn, descriptionZh, descriptionRu, descriptionEn, image, basePrice, stock, isActive, sortOrder) VALUES
(1, 1, 'tea', 'MT001', '珍珠奶茶', 'Молочный чай с жемчужинами', 'Pearl Milk Tea', '经典珍珠奶茶，香浓可口', 'Классический молочный чай с жемчужинами тапиоки', 'Classic pearl milk tea with tapioca pearls', 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', 25.00, 999, 1, 1),
(2, 1, 'tea', 'MT002', '布丁奶茶', 'Молочный чай с пудингом', 'Pudding Milk Tea', '香滑布丁搭配奶茶', 'Нежный пудинг с молочным чаем', 'Smooth pudding with milk tea', 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', 28.00, 999, 1, 2),
(3, 1, 'tea', 'MT003', '椰果奶茶', 'Молочный чай с кокосовым желе', 'Coconut Jelly Milk Tea', '清爽椰果奶茶', 'Освежающий молочный чай с кокосовым желе', 'Refreshing coconut jelly milk tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 26.00, 999, 1, 3),
(4, 2, 'tea', 'FT001', '芒果水果茶', 'Манговый фруктовый чай', 'Mango Fruit Tea', '新鲜芒果制作', 'Приготовлено из свежего манго', 'Made with fresh mango', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 32.00, 999, 1, 4),
(5, 2, 'tea', 'FT002', '草莓水果茶', 'Клубничный фруктовый чай', 'Strawberry Fruit Tea', '酸甜草莓茶', 'Кисло-сладкий клубничный чай', 'Sweet and sour strawberry tea', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 30.00, 999, 1, 5),
(6, 3, 'tea', 'CF001', '美式咖啡', 'Американо', 'Americano', '经典美式咖啡', 'Классический американо', 'Classic americano', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', 22.00, 999, 1, 6),
(7, 3, 'tea', 'CF002', '拿铁咖啡', 'Латте', 'Latte', '香浓拿铁', 'Ароматный латте', 'Aromatic latte', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 28.00, 999, 1, 7),
(8, 4, 'tea', 'SD001', '芝士奶盖', 'Сырный крем-топ', 'Cheese Cream Top', '浓郁芝士奶盖', 'Насыщенный сырный крем', 'Rich cheese cream topping', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', 35.00, 999, 1, 8);

-- 插入商品选项组（温度）
INSERT INTO productOptions (id, productId, groupNameZh, groupNameRu, groupNameEn, groupType, isRequired, isMultiple, maxSelect, sortOrder) VALUES
(1, 1, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1),
(2, 2, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1),
(3, 3, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1),
(4, 4, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1),
(5, 5, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1),
(6, 6, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1),
(7, 7, '温度', 'Температура', 'Temperature', 'ice', 1, 0, 1, 1);

-- 插入温度选项
INSERT INTO productOptionItems (optionId, nameZh, nameRu, nameEn, priceAdjust, isDefault, sortOrder, isActive) VALUES
-- 商品1的温度选项
(1, '热', 'Горячий', 'Hot', 0.00, 0, 1, 1),
(1, '温', 'Тёплый', 'Warm', 0.00, 1, 2, 1),
(1, '冰', 'Холодный', 'Cold', 0.00, 0, 3, 1),
(1, '去冰', 'Без льда', 'No Ice', 0.00, 0, 4, 1),
-- 商品2的温度选项
(2, '热', 'Горячий', 'Hot', 0.00, 0, 1, 1),
(2, '温', 'Тёплый', 'Warm', 0.00, 1, 2, 1),
(2, '冰', 'Холодный', 'Cold', 0.00, 0, 3, 1),
(2, '去冰', 'Без льда', 'No Ice', 0.00, 0, 4, 1),
-- 商品3的温度选项
(3, '热', 'Горячий', 'Hot', 0.00, 0, 1, 1),
(3, '温', 'Тёплый', 'Warm', 0.00, 1, 2, 1),
(3, '冰', 'Холодный', 'Cold', 0.00, 0, 3, 1),
(3, '去冰', 'Без льда', 'No Ice', 0.00, 0, 4, 1),
-- 商品4的温度选项
(4, '冰', 'Холодный', 'Cold', 0.00, 1, 1, 1),
(4, '去冰', 'Без льда', 'No Ice', 0.00, 0, 2, 1),
-- 商品5的温度选项
(5, '冰', 'Холодный', 'Cold', 0.00, 1, 1, 1),
(5, '去冰', 'Без льда', 'No Ice', 0.00, 0, 2, 1),
-- 商品6的温度选项
(6, '热', 'Горячий', 'Hot', 0.00, 1, 1, 1),
(6, '冰', 'Холодный', 'Cold', 0.00, 0, 2, 1),
-- 商品7的温度选项
(7, '热', 'Горячий', 'Hot', 0.00, 1, 1, 1),
(7, '冰', 'Холодный', 'Cold', 0.00, 0, 2, 1);

-- 插入商品选项组（糖度）
INSERT INTO productOptions (id, productId, groupNameZh, groupNameRu, groupNameEn, groupType, isRequired, isMultiple, maxSelect, sortOrder) VALUES
(11, 1, '糖度', 'Сладость', 'Sweetness', 'sugar', 1, 0, 1, 2),
(12, 2, '糖度', 'Сладость', 'Sweetness', 'sugar', 1, 0, 1, 2),
(13, 3, '糖度', 'Сладость', 'Sweetness', 'sugar', 1, 0, 1, 2),
(14, 4, '糖度', 'Сладость', 'Sweetness', 'sugar', 1, 0, 1, 2),
(15, 5, '糖度', 'Сладость', 'Sweetness', 'sugar', 1, 0, 1, 2),
(16, 7, '糖度', 'Сладость', 'Sweetness', 'sugar', 1, 0, 1, 2);

-- 插入糖度选项
INSERT INTO productOptionItems (optionId, nameZh, nameRu, nameEn, priceAdjust, isDefault, sortOrder, isActive) VALUES
-- 商品1的糖度选项
(11, '正常糖', 'Обычная', 'Regular', 0.00, 1, 1, 1),
(11, '少糖', 'Меньше сахара', 'Less Sugar', 0.00, 0, 2, 1),
(11, '半糖', 'Половина сахара', 'Half Sugar', 0.00, 0, 3, 1),
(11, '无糖', 'Без сахара', 'No Sugar', 0.00, 0, 4, 1),
-- 商品2的糖度选项
(12, '正常糖', 'Обычная', 'Regular', 0.00, 1, 1, 1),
(12, '少糖', 'Меньше сахара', 'Less Sugar', 0.00, 0, 2, 1),
(12, '半糖', 'Половина сахара', 'Half Sugar', 0.00, 0, 3, 1),
(12, '无糖', 'Без сахара', 'No Sugar', 0.00, 0, 4, 1),
-- 商品3的糖度选项
(13, '正常糖', 'Обычная', 'Regular', 0.00, 1, 1, 1),
(13, '少糖', 'Меньше сахара', 'Less Sugar', 0.00, 0, 2, 1),
(13, '半糖', 'Половина сахара', 'Half Sugar', 0.00, 0, 3, 1),
(13, '无糖', 'Без сахара', 'No Sugar', 0.00, 0, 4, 1),
-- 商品4的糖度选项
(14, '正常糖', 'Обычная', 'Regular', 0.00, 1, 1, 1),
(14, '少糖', 'Меньше сахара', 'Less Sugar', 0.00, 0, 2, 1),
(14, '半糖', 'Половина сахара', 'Half Sugar', 0.00, 0, 3, 1),
(14, '无糖', 'Без сахара', 'No Sugar', 0.00, 0, 4, 1),
-- 商品5的糖度选项
(15, '正常糖', 'Обычная', 'Regular', 0.00, 1, 1, 1),
(15, '少糖', 'Меньше сахара', 'Less Sugar', 0.00, 0, 2, 1),
(15, '半糖', 'Половина сахара', 'Half Sugar', 0.00, 0, 3, 1),
(15, '无糖', 'Без сахара', 'No Sugar', 0.00, 0, 4, 1),
-- 商品7的糖度选项
(16, '正常糖', 'Обычная', 'Regular', 0.00, 1, 1, 1),
(16, '少糖', 'Меньше сахара', 'Less Sugar', 0.00, 0, 2, 1),
(16, '半糖', 'Половина сахара', 'Half Sugar', 0.00, 0, 3, 1),
(16, '无糖', 'Без сахара', 'No Sugar', 0.00, 0, 4, 1);

-- 插入商品选项组（规格）
INSERT INTO productOptions (id, productId, groupNameZh, groupNameRu, groupNameEn, groupType, isRequired, isMultiple, maxSelect, sortOrder) VALUES
(21, 1, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3),
(22, 2, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3),
(23, 3, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3),
(24, 4, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3),
(25, 5, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3),
(26, 6, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3),
(27, 7, '规格', 'Размер', 'Size', 'size', 1, 0, 1, 3);

-- 插入规格选项
INSERT INTO productOptionItems (optionId, nameZh, nameRu, nameEn, priceAdjust, isDefault, sortOrder, isActive) VALUES
-- 商品1的规格选项
(21, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(21, '大杯', 'Большой', 'Large', 5.00, 0, 2, 1),
-- 商品2的规格选项
(22, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(22, '大杯', 'Большой', 'Large', 5.00, 0, 2, 1),
-- 商品3的规格选项
(23, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(23, '大杯', 'Большой', 'Large', 5.00, 0, 2, 1),
-- 商品4的规格选项
(24, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(24, '大杯', 'Большой', 'Large', 6.00, 0, 2, 1),
-- 商品5的规格选项
(25, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(25, '大杯', 'Большой', 'Large', 6.00, 0, 2, 1),
-- 商品6的规格选项
(26, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(26, '大杯', 'Большой', 'Large', 4.00, 0, 2, 1),
-- 商品7的规格选项
(27, '中杯', 'Средний', 'Medium', 0.00, 1, 1, 1),
(27, '大杯', 'Большой', 'Large', 5.00, 0, 2, 1);

-- 插入商品选项组（配料）
INSERT INTO productOptions (id, productId, groupNameZh, groupNameRu, groupNameEn, groupType, isRequired, isMultiple, maxSelect, sortOrder) VALUES
(31, 1, '配料', 'Добавки', 'Toppings', 'topping', 0, 1, 5, 4),
(32, 2, '配料', 'Добавки', 'Toppings', 'topping', 0, 1, 5, 4),
(33, 3, '配料', 'Добавки', 'Toppings', 'topping', 0, 1, 5, 4),
(34, 7, '配料', 'Добавки', 'Toppings', 'topping', 0, 1, 5, 4);

-- 插入配料选项
INSERT INTO productOptionItems (optionId, nameZh, nameRu, nameEn, priceAdjust, isDefault, sortOrder, isActive) VALUES
-- 商品1的配料选项
(31, '珍珠', 'Жемчужины тапиоки', 'Tapioca Pearls', 3.00, 1, 1, 1),
(31, '椰果', 'Кокосовое желе', 'Coconut Jelly', 3.00, 0, 2, 1),
(31, '布丁', 'Пудинг', 'Pudding', 4.00, 0, 3, 1),
(31, '红豆', 'Красная фасоль', 'Red Bean', 3.00, 0, 4, 1),
(31, '芋圆', 'Таро шарики', 'Taro Balls', 4.00, 0, 5, 1),
-- 商品2的配料选项
(32, '珍珠', 'Жемчужины тапиоки', 'Tapioca Pearls', 3.00, 0, 1, 1),
(32, '椰果', 'Кокосовое желе', 'Coconut Jelly', 3.00, 0, 2, 1),
(32, '布丁', 'Пудинг', 'Pudding', 4.00, 1, 3, 1),
(32, '红豆', 'Красная фасоль', 'Red Bean', 3.00, 0, 4, 1),
(32, '芋圆', 'Таро шарики', 'Taro Balls', 4.00, 0, 5, 1),
-- 商品3的配料选项
(33, '珍珠', 'Жемчужины тапиоки', 'Tapioca Pearls', 3.00, 0, 1, 1),
(33, '椰果', 'Кокосовое желе', 'Coconut Jelly', 3.00, 1, 2, 1),
(33, '布丁', 'Пудинг', 'Pudding', 4.00, 0, 3, 1),
(33, '红豆', 'Красная фасоль', 'Red Bean', 3.00, 0, 4, 1),
(33, '芋圆', 'Таро шарики', 'Taro Balls', 4.00, 0, 5, 1),
-- 商品7的配料选项
(34, '珍珠', 'Жемчужины тапиоки', 'Tapioca Pearls', 3.00, 0, 1, 1),
(34, '椰果', 'Кокосовое желе', 'Coconut Jelly', 3.00, 0, 2, 1),
(34, '焦糖', 'Карамель', 'Caramel', 2.00, 0, 3, 1);

