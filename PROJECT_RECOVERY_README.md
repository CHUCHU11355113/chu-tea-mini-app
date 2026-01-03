# CHU TEA Mini App - 项目恢复完成

## ✅ 恢复状态

项目已完整恢复并成功启动！所有依赖已安装，数据库已配置，开发服务器正在运行。

## 🚀 访问地址

**开发服务器地址：**
- 本地访问: http://localhost:3001
- 公网访问: https://3001-i265sdaxwtvroc8we8fjv-78088df5.sg1.manus.computer

## 📁 项目结构

```
chu-tea-mini-app-main/
├── client/              # 前端代码（React + TypeScript）
│   ├── src/
│   │   ├── pages/      # 页面组件
│   │   ├── components/ # UI组件
│   │   ├── contexts/   # React Context
│   │   ├── hooks/      # 自定义Hooks
│   │   └── lib/        # 工具库
│   └── public/         # 静态资源
├── server/             # 后端代码（Node.js + Express）
│   ├── _core/          # 核心功能
│   ├── routers/        # tRPC路由
│   ├── db/             # 数据库操作
│   └── services/       # 业务服务
├── drizzle/            # 数据库Schema
└── shared/             # 前后端共享代码
```

## 🛠️ 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite 7
- **UI库**: TailwindCSS 4 + Radix UI
- **路由**: Wouter
- **状态管理**: React Query + tRPC
- **Telegram**: @twa-dev/sdk (Telegram Web App SDK)
- **国际化**: i18next

### 后端
- **运行时**: Node.js 22
- **框架**: Express
- **API**: tRPC
- **数据库**: MySQL 8 + Drizzle ORM
- **认证**: JWT + Cookie
- **支付**: YooKassa
- **定时任务**: node-cron

## 🗄️ 数据库配置

**当前配置：**
- 数据库: MySQL 8.0
- 数据库名: chu_tea_db
- 用户名: chu_tea_user
- 密码: chu_tea_pass_2024
- 连接地址: localhost:3306

**数据库表（已自动创建）：**
- users - 用户表
- orders - 订单表
- products - 商品表
- categories - 分类表
- coupons - 优惠券表
- stores - 门店表
- 等57个表...

## 📝 环境变量

当前配置文件: `/home/ubuntu/chu-tea-mini-app-main/.env`

```env
# 核心配置（已配置）
DATABASE_URL="mysql://chu_tea_user:chu_tea_pass_2024@localhost:3306/chu_tea_db"
JWT_SECRET="dev-jwt-secret-key-chu-tea-mini-app-2024"
NODE_ENV="development"
PORT=3000

# 可选配置（需要时添加）
TELEGRAM_BOT_TOKEN=""           # Telegram Bot Token
OAUTH_SERVER_URL=""             # OAuth服务器地址
VITE_APP_ID=""                  # 应用ID
YOOKASSA_SHOP_ID=""             # YooKassa商户ID
YOOKASSA_SECRET_KEY=""          # YooKassa密钥
```

## 🎯 核心功能

### 用户端功能
1. **Telegram登录** - 使用Telegram账号登录
2. **茶饮点单** - 浏览菜单、下单、支付
3. **商城购物** - 商品浏览、购物车、结算
4. **订单管理** - 查看订单、订单详情、退款
5. **会员系统** - 积分、优惠券、会员等级
6. **地址管理** - 配送地址管理
7. **门店选择** - 自提门店选择
8. **多语言** - 支持中文、俄语、英语

### 管理端功能
1. **商品管理** - 商品CRUD、分类管理
2. **订单管理** - 订单处理、状态更新
3. **用户管理** - 用户信息、标签管理
4. **营销管理** - 优惠券、营销活动
5. **数据统计** - 销售报表、用户分析
6. **通知系统** - Telegram通知推送
7. **iiko集成** - 餐饮系统对接

## 🚦 启动命令

### 开发模式
```bash
cd /home/ubuntu/chu-tea-mini-app-main
pnpm dev
```

### 生产构建
```bash
pnpm build
pnpm start
```

### 数据库操作
```bash
# 生成并应用数据库迁移
pnpm db:push

# 查看数据库状态
mysql -u chu_tea_user -pchu_tea_pass_2024 chu_tea_db
```

### 代码检查
```bash
# TypeScript类型检查
pnpm check

# 代码格式化
pnpm format

# 运行测试
pnpm test
```

## 📱 Telegram小程序配置

### 1. 创建Telegram Bot
1. 在Telegram中找到 @BotFather
2. 发送 `/newbot` 创建新Bot
3. 获取Bot Token并配置到 `.env` 文件

### 2. 配置Mini App
1. 发送 `/newapp` 给 @BotFather
2. 选择你的Bot
3. 设置Web App URL: `https://your-domain.com`
4. 上传图标和描述

### 3. 设置Webhook（可选）
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/api/telegram/webhook"
```

## 🔧 常见问题

### Q: 页面空白怎么办？
A: 这是正常的！因为这是Telegram Mini App，需要在Telegram中打开才能正常显示。在浏览器中直接访问会显示空白页面。

### Q: 如何在Telegram中测试？
A: 
1. 配置好Telegram Bot Token
2. 在Telegram中打开你的Bot
3. 点击菜单按钮或发送 `/start`
4. 点击Web App按钮打开小程序

### Q: 如何部署到生产环境？
A: 参考 `DEPLOYMENT.md` 和 `PRODUCTION_DEPLOYMENT.md` 文档

### Q: OAuth配置是什么？
A: 这是Manus平台的OAuth认证，用于管理员登录后台。如果只使用Telegram登录，可以不配置。

## 📚 相关文档

- `QUICKSTART.md` - 快速开始指南
- `DEPLOYMENT.md` - 部署指南
- `PRODUCTION_DEPLOYMENT.md` - 生产环境部署
- `TELEGRAM_BOT_SETUP.md` - Telegram Bot配置
- `PRODUCTION_CHECKLIST.md` - 生产环境检查清单

## 🎉 项目特点

1. **完整的电商系统** - 包含商品、订单、支付、会员等完整功能
2. **Telegram原生体验** - 完美集成Telegram Web App SDK
3. **多语言支持** - 中文、俄语、英语
4. **响应式设计** - 适配各种屏幕尺寸
5. **PWA支持** - 可安装为桌面应用
6. **离线功能** - 支持离线浏览和草稿保存
7. **性能优化** - 代码分割、懒加载、缓存策略
8. **类型安全** - 全栈TypeScript + tRPC

## 🔐 安全提示

- JWT_SECRET 在生产环境请使用强密码
- 数据库密码请定期更换
- 支付密钥请妥善保管
- 生产环境请启用HTTPS

## 📞 技术支持

如有问题，请查看项目文档或联系开发团队。

---

**恢复时间**: 2026-01-03
**Node.js版本**: v22.13.0
**pnpm版本**: 10.4.1
**MySQL版本**: 8.0.43
