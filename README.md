# CHU TEA - Telegram Mini App

一个功能完整的奶茶店Telegram小程序，支持在线点单、会员系统、优惠券、积分等功能。

## ✨ 功能特性

### 用户端
- 🛍️ **商品浏览** - 按分类浏览商品（奶茶、水果茶、咖啡、特调）
- 📝 **商品详情** - 查看商品详情，选择温度、冰量、尺寸、配料
- 🛒 **购物车** - 添加商品到购物车，管理订单
- 💳 **在线支付** - 支持多种支付方式
- 📦 **订单管理** - 查看订单历史和状态
- 👤 **会员系统** - 会员等级、积分、优惠券
- 📍 **地址管理** - 保存和管理收货地址
- ⭐ **商品评价** - 对商品进行评价和反馈

### 管理端
- 📊 **数据分析** - 销售数据、用户数据、商品数据分析
- 🏪 **商品管理** - 添加、编辑、删除商品
- 📋 **订单管理** - 查看和处理订单
- 👥 **用户管理** - 查看用户信息和行为
- 🎫 **营销管理** - 优惠券、促销活动管理
- ⚙️ **系统配置** - 配置门店、配送、支付等

## 🛠️ 技术栈

### 前端
- React 19 + TypeScript
- Vite (构建工具)
- TailwindCSS + Radix UI (UI框架)
- Wouter (路由)
- tRPC Client (API通信)
- Telegram Web App SDK

### 后端
- Node.js 22
- Express
- tRPC (类型安全的API)
- Drizzle ORM (数据库ORM)
- MySQL 8.0
- JWT (认证)

## 📦 快速开始

### 开发环境

1. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chu-tea.git
   cd chu-tea
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp server/.env.example server/.env
   # 编辑 server/.env 填入数据库配置
   ```

4. **启动开发服务器**
   ```bash
   pnpm dev
   ```

5. **访问应用**
   - 前端: http://localhost:5173
   - 后端API: http://localhost:3000

### 生产部署

详细部署文档请查看: [DEPLOY_TENCENT_CLOUD.md](./DEPLOY_TENCENT_CLOUD.md)

#### 快速部署到腾讯云

```bash
# 1. 克隆项目到服务器
git clone https://github.com/YOUR_USERNAME/chu-tea.git
cd chu-tea

# 2. 运行一键安装脚本
sudo bash install-tencent.sh

# 3. 等待安装完成，访问您的服务器IP
```

## 📱 Telegram Bot配置

1. **创建Bot**
   - 在Telegram中找到 @BotFather
   - 发送 `/newbot` 创建新bot
   - 记录Bot Token

2. **配置Web App**
   - 发送 `/newapp` 给 @BotFather
   - 选择您的bot
   - 输入Web App名称和URL
   - 上传图标

3. **配置环境变量**
   ```env
   TELEGRAM_BOT_TOKEN=your-bot-token
   ```

## 🗂️ 项目结构

```
chu-tea/
├── client/                 # 前端代码
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义Hooks
│   │   └── utils/         # 工具函数
│   └── dist/              # 构建产物
├── server/                # 后端代码
│   ├── routers/          # tRPC路由
│   ├── db/               # 数据库模型
│   ├── services/         # 业务逻辑
│   └── dist/             # 构建产物
├── shared/               # 前后端共享代码
│   └── types.ts         # 类型定义
├── ecosystem.config.js   # PM2配置
├── nginx.conf           # Nginx配置
├── install-tencent.sh   # 腾讯云安装脚本
└── DEPLOY_TENCENT_CLOUD.md  # 部署文档
```

## 📊 数据库

### 商品数据

项目包含8个示例商品：

| 商品 | 分类 | 价格 |
|------|------|------|
| Pearl Milk Tea | Milk Tea | ₽220 |
| Pudding Milk Tea | Milk Tea | ₽240 |
| Coconut Jelly Milk Tea | Milk Tea | ₽230 |
| Mango Fruit Tea | Fruit Tea | ₽280 |
| Strawberry Fruit Tea | Fruit Tea | ₽290 |
| Americano | Coffee | ₽250 |
| Latte | Coffee | ₽280 |
| Cheese Cream Top | Special Drinks | ₽350 |

### 商品选项

- **温度**: Hot, Warm, Cold
- **冰量**: No Ice, Regular, Less, Half, No Sugar
- **尺寸**: Medium, Large (+₽5)
- **配料**: Tapioca Pearls (+₽3), Coconut Jelly (+₽3), Pudding (+₽4), Red Bean (+₽3), Taro Balls (+₽4)

## 🔧 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm preview          # 预览生产构建

# 数据库
pnpm db:push          # 同步数据库结构
pnpm db:studio        # 打开数据库管理界面

# 测试
pnpm test             # 运行测试

# 生产环境
pm2 start ecosystem.config.js   # 启动应用
pm2 logs chu-tea-api           # 查看日志
pm2 restart chu-tea-api        # 重启应用
pm2 stop chu-tea-api           # 停止应用
```

## 🚀 部署检查清单

- [ ] Node.js 22已安装
- [ ] MySQL已安装并配置
- [ ] Nginx已安装并配置
- [ ] 环境变量已配置
- [ ] 数据库已创建
- [ ] 项目已构建
- [ ] PM2已启动应用
- [ ] 防火墙已配置
- [ ] Telegram Bot已配置
- [ ] 应用可以正常访问

## 📝 环境变量

### 必需配置

```env
# 数据库
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=chu_tea_user
DATABASE_PASSWORD=chu_tea_pass_2024
DATABASE_NAME=chu_tea_db

# JWT
JWT_SECRET=your-secret-key

# Telegram (可选)
TELEGRAM_BOT_TOKEN=your-bot-token
```

## 🔒 安全建议

1. 修改默认密码
2. 配置防火墙
3. 启用HTTPS
4. 定期备份数据
5. 定期更新依赖

## 📞 技术支持

如果遇到问题：

1. 查看 [部署文档](./DEPLOY_TENCENT_CLOUD.md)
2. 查看日志: `pm2 logs chu-tea-api`
3. 查看Nginx日志: `sudo tail -f /var/log/nginx/error.log`

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有贡献者和使用者！

---

**Made with ❤️ for tea lovers**
