# 后台管理系统模块架构规划

## 一、模块分类

### 1. 📊 数据概览模块 (Dashboard)
- **仪表盘** `/admin` - 总览数据、关键指标

### 2. 📦 商品管理模块 (Products)
- **商品列表** `/admin/products/list` - 商品管理
- **商品配置** `/admin/products/config` - 商品配置
- **商品选项** `/admin/products/options` - 商品选项管理

### 3. 🛒 订单管理模块 (Orders)
- **订单列表** `/admin/orders/list` - 订单管理
- **支付记录** `/admin/orders/payments` - 支付历史

### 4. 📢 营销管理模块 (Marketing)
- **营销仪表盘** `/admin/marketing/dashboard` - 营销数据总览
- **广告管理** `/admin/marketing/ads` - 广告位管理
- **优惠券管理** `/admin/marketing/coupons` - 优惠券模板
- **积分规则** `/admin/marketing/points` - 积分规则配置
- **营销活动** `/admin/marketing/campaigns` - 营销活动管理
- **营销触发器** `/admin/marketing/triggers` - 自动化营销触发器
- **触发器模板** `/admin/marketing/trigger-templates` - 触发器模板
- **A/B测试** `/admin/marketing/ab-test` - A/B测试对比
- **达人推广** `/admin/marketing/influencer` - 达人推广活动
- **达人提现** `/admin/marketing/influencer-withdrawals` - 达人提现管理
- **达人分析** `/admin/marketing/influencer-analytics` - 达人数据分析

### 5. 👥 会员管理模块 (Members)
- **会员列表** `/admin/members/list` - 用户管理
- **会员标签** `/admin/members/tags` - 会员标签管理
- **会员等级** `/admin/members/levels` - 会员等级配置

### 6. 🏪 门店管理模块 (Stores)
- **门店列表** `/admin/stores/list` - 门店管理
- **配送设置** `/admin/stores/delivery` - 配送设置

### 7. 🔧 系统设置模块 (System)
- **API配置** `/admin/system/api` - API配置
- **iiko集成** `/admin/system/iiko` - iiko系统配置
- **iiko监控** `/admin/system/iiko-monitor` - iiko系统监控
- **支付配置** `/admin/system/yookassa` - YooKassa支付配置
- **系统日志** `/admin/system/logs` - 系统日志
- **通知管理** `/admin/system/notifications` - 通知管理

### 8. 📈 数据分析模块 (Analytics)
- **数据分析** `/admin/analytics/overview` - 数据分析总览

### 9. 🛠️ 管理工具模块 (Tools)
- **测试工具** `/admin/tools/test` - 测试数据管理、批量操作

---

## 二、后端API路由结构

### 1. 商品相关 API
```
appRouter.products.*
- getProducts
- getProductById
- createProduct
- updateProduct
- deleteProduct
- getProductOptions
- updateProductConfig
```

### 2. 订单相关 API
```
appRouter.orders.*
- getOrders
- getOrderById
- createOrder
- updateOrderStatus
- cancelOrder
- getPaymentHistory
```

### 3. 营销相关 API
```
appRouter.marketing.*
- ads.*              // 广告管理
- coupons.*          // 优惠券管理
- points.*           // 积分管理
- campaigns.*        // 营销活动
- triggers.*         // 营销触发器
- abTest.*           // A/B测试
- influencer.*       // 达人推广
```

### 4. 会员相关 API
```
appRouter.members.*
- getUsers
- getUserById
- updateUser
- getTags
- createTag
- updateTag
- deleteTag
- getLevels
- updateLevels
```

### 5. 门店相关 API
```
appRouter.stores.*
- getStores
- createStore
- updateStore
- deleteStore
- getDeliverySettings
- updateDeliverySettings
```

### 6. 系统相关 API
```
appRouter.system.*
- api.*              // API配置
- iiko.*             // iiko集成
- payment.*          // 支付配置
- logs.*             // 系统日志
- notifications.*    // 通知管理
```

### 7. 数据分析 API
```
appRouter.analytics.*
- getOverview
- getSalesData
- getUserStats
- getOrderStats
```

### 8. 管理工具 API
```
appRouter.tools.*
- initTestData       // 初始化测试数据
- batchIssueCoupons  // 批量发放优惠券
- batchIssuePoints   // 批量发放积分
- createTestAccount  // 创建测试账号
```

---

## 三、导航菜单结构

```
📊 数据概览
📦 商品管理
   ├─ 商品列表
   ├─ 商品配置
   └─ 商品选项
🛒 订单管理
   ├─ 订单列表
   └─ 支付记录
📢 营销管理
   ├─ 营销仪表盘
   ├─ 广告管理
   ├─ 优惠券管理
   ├─ 积分规则
   ├─ 营销活动
   ├─ 营销触发器
   ├─ 触发器模板
   ├─ A/B测试
   ├─ 达人推广
   ├─ 达人提现
   └─ 达人分析
👥 会员管理
   ├─ 会员列表
   ├─ 会员标签
   └─ 会员等级
🏪 门店管理
   ├─ 门店列表
   └─ 配送设置
🔧 系统设置
   ├─ API配置
   ├─ iiko集成
   ├─ iiko监控
   ├─ 支付配置
   ├─ 系统日志
   └─ 通知管理
📈 数据分析
🛠️ 管理工具
```

---

## 四、实施步骤

1. ✅ 创建架构规划文档
2. 🔄 重构前端路由结构
3. 🔄 重构AdminLayout导航菜单
4. 🔄 重构后端API路由结构
5. 🔄 更新所有页面组件的导入和路径
6. 🔄 测试所有功能
7. 🔄 部署到生产环境
