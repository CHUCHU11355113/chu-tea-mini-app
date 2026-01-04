# 后端API路由重构计划

## 当前路由结构（需要整理）

### 现有路由列表
```
- auth: 认证相关
- store: 门店相关
- category: 分类相关
- product: 商品相关
- products: 商品列表
- categories: 分类列表
- cart: 购物车
- address: 地址管理
- order: 订单管理
- display: TV显示屏
- coupon: 优惠券
- points: 积分
- landing: 落地页
- yookassa: 支付配置
- telegram: Telegram集成
- adminDashboard: 后台仪表盘
- adminAds: 后台广告管理
- adminHomeEntries: 后台首页入口
- adminCoupons: 后台优惠券管理
- adminMarketing: 后台营销管理
- adminApiConfig: 后台API配置
- adminLogs: 后台日志
- adminUsers: 后台用户管理
- adminStores: 后台门店管理
- adminProducts: 后台商品管理
- adminOrders: 后台订单管理
- adminNotifications: 后台通知管理
- productConfig: 商品配置
- notificationPreferences: 通知偏好
- adminCoupon: 后台优惠券（重复？）
- marketingTrigger: 营销触发器
- admin: 管理工具
- system: 系统路由
- iiko: iiko集成
- payment: 支付
- analytics: 数据分析
- review: 评论
- member: 会员
- influencer: 达人推广
```

## 目标路由结构（模块化）

### 1. 前台用户API（保持不变）
```typescript
appRouter = {
  // 认证
  auth: { me, logout, telegramLogin },
  
  // 门店
  store: { getStores, getStoreById, ... },
  
  // 商品
  product: { getProducts, getProductById, ... },
  products: { ... },
  category: { ... },
  categories: { ... },
  
  // 购物车
  cart: { getCart, addToCart, updateCart, removeFromCart, clearCart },
  
  // 地址
  address: { getAddresses, addAddress, updateAddress, deleteAddress, setDefault },
  
  // 订单
  order: { createOrder, getOrders, getOrderById, cancelOrder, ... },
  
  // 优惠券
  coupon: { getMyCoupons, getAvailableCoupons, claimCoupon, ... },
  
  // 积分
  points: { getBalance, getHistory, ... },
  
  // 支付
  yookassa: { ... },
  payment: { ... },
  
  // Telegram
  telegram: { ... },
  
  // 落地页
  landing: { ... },
  
  // TV显示屏
  display: { getOrders, updateOrderStatus },
  
  // 通知偏好
  notificationPreferences: { ... },
  
  // 评论
  review: { ... },
  
  // 会员
  member: { ... },
  
  // 达人推广
  influencer: { ... },
  
  // 系统
  system: { ... },
  
  // 数据分析
  analytics: { ... },
  
  // iiko集成
  iiko: { ... },
}
```

### 2. 后台管理API（重新组织）
```typescript
appRouter.admin = {
  // 仪表盘
  dashboard: {
    getOverview,
    getStats,
  },
  
  // 商品管理
  products: {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductConfig,
    updateProductConfig,
    getProductOptions,
    updateProductOptions,
  },
  
  // 订单管理
  orders: {
    getOrders,
    getOrderById,
    updateOrderStatus,
    getPaymentHistory,
  },
  
  // 营销管理
  marketing: {
    // 广告
    ads: {
      getAds,
      createAd,
      updateAd,
      deleteAd,
    },
    // 优惠券
    coupons: {
      getCoupons,
      createCoupon,
      updateCoupon,
      deleteCoupon,
      issueCoupon,
    },
    // 积分
    points: {
      getPointsRules,
      updatePointsRules,
      issuePoints,
    },
    // 营销活动
    campaigns: {
      getCampaigns,
      createCampaign,
      updateCampaign,
      deleteCampaign,
    },
    // 营销触发器
    triggers: {
      getTriggers,
      createTrigger,
      updateTrigger,
      deleteTrigger,
      getTriggerTemplates,
    },
    // 达人推广
    influencer: {
      getCampaigns,
      getWithdrawals,
      getAnalytics,
    },
  },
  
  // 会员管理
  members: {
    getUsers,
    getUserById,
    updateUser,
    getTags,
    createTag,
    updateTag,
    deleteTag,
  },
  
  // 门店管理
  stores: {
    getStores,
    createStore,
    updateStore,
    deleteStore,
    getDeliverySettings,
    updateDeliverySettings,
  },
  
  // 系统设置
  system: {
    getApiConfig,
    updateApiConfig,
    getIikoConfig,
    updateIikoConfig,
    getIikoMonitor,
    getYooKassaConfig,
    updateYooKassaConfig,
    getLogs,
    getNotifications,
    sendNotification,
  },
  
  // 数据分析
  analytics: {
    getOverview,
    getSalesData,
    getUserStats,
  },
  
  // 管理工具
  tools: {
    initTestData,
    batchIssueCoupons,
    batchIssuePoints,
    createTestAccount,
  },
}
```

## 实施步骤

1. ✅ 保持前台用户API不变
2. 🔄 将所有admin*路由合并到admin命名空间下
3. 🔄 按照模块重新组织admin子路由
4. 🔄 更新前端API调用路径
5. 🔄 测试所有功能
6. 🔄 部署到生产环境

## 注意事项

- 前台用户API保持不变，确保不影响用户端功能
- 后台API重构后，需要更新所有前端调用
- 保持向后兼容，逐步迁移
- 完成后删除旧的admin*路由
