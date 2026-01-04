# CHU TEA 数据库架构设计

## 现有表结构

### products (产品表)
- id: string (主键)
- name: string
- description: string
- price: decimal
- image: string
- category: string
- available: boolean
- createdAt: datetime
- updatedAt: datetime

### productOptions (产品选项表)
- id: string (主键)
- productId: string (外键)
- name: string (杯型、温度、糖度、配料)
- type: string
- required: boolean
- displayOrder: int

### productOptionItems (产品选项项表)
- id: string (主键)
- optionId: string (外键)
- name: string
- priceModifier: decimal
- displayOrder: int

---

## 新增表结构

### users (用户表)
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  telegramId VARCHAR(50) UNIQUE,
  username VARCHAR(100),
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  phone VARCHAR(20),
  points INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### carts (购物车表)
```sql
CREATE TABLE carts (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### cartItems (购物车项表)
```sql
CREATE TABLE cartItems (
  id VARCHAR(36) PRIMARY KEY,
  cartId VARCHAR(36) NOT NULL,
  productId VARCHAR(36) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  selectedOptions JSON,
  price DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

### coupons (优惠券表)
```sql
CREATE TABLE coupons (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  type ENUM('fixed', 'percentage', 'threshold') NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  minPurchase DECIMAL(10, 2) DEFAULT 0,
  maxDiscount DECIMAL(10, 2),
  description VARCHAR(255),
  startDate DATETIME,
  endDate DATETIME,
  usageLimit INT,
  usedCount INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### userCoupons (用户优惠券关联表)
```sql
CREATE TABLE userCoupons (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  couponId VARCHAR(36) NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  usedAt DATETIME,
  orderId VARCHAR(36),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (couponId) REFERENCES coupons(id) ON DELETE CASCADE
);
```

### orders (订单表)
```sql
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  orderNumber VARCHAR(20) UNIQUE NOT NULL,
  pickupCode VARCHAR(10) NOT NULL,
  status ENUM('pending', 'paid', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  pointsUsed INT DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  couponId VARCHAR(36),
  paymentMethod VARCHAR(50),
  paymentStatus ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (couponId) REFERENCES coupons(id)
);
```

### orderItems (订单项表)
```sql
CREATE TABLE orderItems (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  productId VARCHAR(36) NOT NULL,
  productName VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  selectedOptions JSON,
  unitPrice DECIMAL(10, 2) NOT NULL,
  totalPrice DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES products(id)
);
```

### pointsHistory (积分历史表)
```sql
CREATE TABLE pointsHistory (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  orderId VARCHAR(36),
  points INT NOT NULL,
  type ENUM('earn', 'redeem', 'refund', 'admin') NOT NULL,
  description VARCHAR(255),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (orderId) REFERENCES orders(id)
);
```

### iikoIntegration (iiko集成配置表)
```sql
CREATE TABLE iikoIntegration (
  id VARCHAR(36) PRIMARY KEY,
  apiKey VARCHAR(255) NOT NULL,
  organizationId VARCHAR(255) NOT NULL,
  terminalId VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### tvDisplays (TV显示屏配置表)
```sql
CREATE TABLE tvDisplays (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(100),
  displayMode ENUM('all', 'ready', 'preparing') DEFAULT 'ready',
  refreshInterval INT DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### adminUsers (后台管理员表)
```sql
CREATE TABLE adminUsers (
  id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
  active BOOLEAN DEFAULT TRUE,
  lastLogin DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 业务规则

### 购物车
- 每个用户只有一个活跃购物车
- 购物车项包含产品、数量、选项配置
- 价格根据产品基础价格 + 选项价格修正计算

### 优惠券
- 类型：固定金额、百分比、满减
- 满100减50：type='threshold', minPurchase=100, value=50
- 每张优惠券可设置使用次数限制
- 用户领取后绑定到userCoupons表
- 使用后标记为已使用

### 积分
- 1积分 = 1卢布
- 只能全额抵扣（不能部分使用）
- 订单完成后获得积分（消费金额的一定比例）
- 积分和优惠券互斥（只能选一个）

### 订单
- 取餐码格式：T + 4位数字（例如：T1234）
- 订单状态流转：pending → paid → preparing → ready → completed
- 支付成功后调用iiko API创建订单并打印小票

### TV显示屏
- 实时显示准备中和可取餐的订单
- 显示取餐码、订单号、等待时间
- WebSocket实时推送更新

---

## API接口设计

### 购物车 API
- POST /api/cart/add - 添加商品到购物车
- GET /api/cart - 获取购物车
- PUT /api/cart/item/:id - 更新购物车项数量
- DELETE /api/cart/item/:id - 删除购物车项
- DELETE /api/cart/clear - 清空购物车

### 优惠券 API
- GET /api/coupons - 获取可用优惠券列表
- POST /api/coupons/claim/:id - 领取优惠券
- GET /api/user/coupons - 获取用户优惠券
- POST /api/coupons/validate - 验证优惠券是否可用

### 积分 API
- GET /api/user/points - 获取用户积分
- GET /api/user/points/history - 获取积分历史
- POST /api/points/calculate - 计算可用积分抵扣

### 订单 API
- POST /api/orders/create - 创建订单
- POST /api/orders/:id/pay - 支付订单
- GET /api/orders/:id - 获取订单详情
- GET /api/user/orders - 获取用户订单列表
- GET /api/orders/:id/status - 获取订单状态

### iiko API
- POST /api/iiko/create-order - 创建iiko订单
- POST /api/iiko/print-receipt - 打印小票

### TV显示屏 API
- GET /api/tv/orders - 获取待显示订单
- WebSocket /api/tv/ws - 实时订单更新

### 后台管理 API
- POST /api/admin/login - 管理员登录
- GET /api/admin/orders - 订单管理
- PUT /api/admin/orders/:id/status - 更新订单状态
- GET /api/admin/coupons - 优惠券管理
- POST /api/admin/coupons - 创建优惠券
- GET /api/admin/users - 用户管理
- PUT /api/admin/users/:id/points - 调整用户积分
