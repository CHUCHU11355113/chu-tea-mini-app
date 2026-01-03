# 如何测试 CHU TEA Mini App

## ⚠️ 重要说明

**这是一个Telegram Mini App（小程序），必须在Telegram中打开才能正常使用！**

在普通浏览器中直接访问会显示空白页面，这是正常现象。因为应用依赖Telegram Web App SDK，需要Telegram环境才能初始化。

## 🎯 测试方式

### 方式一：在Telegram中测试（推荐）

这是唯一能完整测试所有功能的方式。

#### 步骤：

1. **配置Telegram Bot**
   ```bash
   # 编辑环境变量文件
   nano /home/ubuntu/chu-tea-mini-app-main/.env
   
   # 添加你的Bot Token
   TELEGRAM_BOT_TOKEN="your_bot_token_here"
   ```

2. **重启开发服务器**
   ```bash
   cd /home/ubuntu/chu-tea-mini-app-main
   ./start-dev.sh
   ```

3. **配置Bot的Web App URL**
   - 在Telegram中找到 @BotFather
   - 发送 `/myapps`
   - 选择你的Bot
   - 点击 "Edit Web App URL"
   - 输入: `https://3001-i265sdaxwtvroc8we8fjv-78088df5.sg1.manus.computer`

4. **在Telegram中打开**
   - 打开你的Bot
   - 点击菜单按钮或Web App按钮
   - 小程序将在Telegram内打开

### 方式二：模拟Telegram环境（开发调试）

如果暂时没有配置Telegram Bot，可以通过修改代码来模拟Telegram环境进行基础测试。

#### 临时修改方法：

编辑 `/home/ubuntu/chu-tea-mini-app-main/client/src/lib/telegram.ts`

```typescript
// 在文件开头添加模拟对象
if (typeof window !== 'undefined' && !window.Telegram) {
  window.Telegram = {
    WebApp: {
      ready: () => console.log('[Mock] Telegram ready'),
      expand: () => console.log('[Mock] Telegram expand'),
      enableClosingConfirmation: () => {},
      platform: 'web',
      version: '6.0',
      initData: '',
      initDataUnsafe: {
        user: {
          id: 123456789,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
          language_code: 'zh'
        }
      },
      themeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        button_color: '#2563eb',
        button_text_color: '#ffffff'
      },
      BackButton: {
        show: () => {},
        hide: () => {},
        onClick: () => {}
      },
      MainButton: {
        setText: () => {},
        show: () => {},
        hide: () => {},
        onClick: () => {}
      },
      showAlert: (msg) => alert(msg),
      showConfirm: (msg, cb) => cb(confirm(msg)),
      close: () => {},
      openTelegramLink: (url) => window.open(url),
      openLink: (url) => window.open(url),
      HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {}
      }
    }
  };
}
```

**注意：** 这只是临时测试方案，生产环境请删除此代码！

### 方式三：查看UI设计（静态预览）

如果只想查看UI设计，可以：

1. 访问项目的静态资源目录
2. 查看组件代码和样式
3. 查看设计文档

```bash
# 查看页面组件
ls /home/ubuntu/chu-tea-mini-app-main/client/src/pages/

# 查看UI组件
ls /home/ubuntu/chu-tea-mini-app-main/client/src/components/

# 查看静态资源
ls /home/ubuntu/chu-tea-mini-app-main/client/public/
```

## 🧪 功能测试清单

### 基础功能
- [ ] Telegram登录
- [ ] 用户信息显示
- [ ] 主题切换（跟随Telegram主题）
- [ ] 多语言切换

### 茶饮点单
- [ ] 浏览菜单
- [ ] 查看商品详情
- [ ] 添加到购物车
- [ ] 修改购物车
- [ ] 选择门店
- [ ] 选择配送方式
- [ ] 下单结算
- [ ] 支付

### 商城功能
- [ ] 浏览商品
- [ ] 商品搜索
- [ ] 商品筛选
- [ ] 查看商品详情
- [ ] 添加到购物车
- [ ] 下单购买

### 订单管理
- [ ] 查看订单列表
- [ ] 查看订单详情
- [ ] 订单状态更新
- [ ] 申请退款
- [ ] 订单评价

### 会员功能
- [ ] 查看会员信息
- [ ] 积分查询
- [ ] 积分使用
- [ ] 优惠券领取
- [ ] 优惠券使用
- [ ] 会员等级升级

### 个人中心
- [ ] 个人信息编辑
- [ ] 地址管理
- [ ] 通知设置
- [ ] 语言设置

## 📊 测试数据

### 测试用户
开发环境会自动创建测试数据，包括：
- 测试商品
- 测试分类
- 测试门店
- 测试优惠券

### 创建测试数据
```bash
cd /home/ubuntu/chu-tea-mini-app-main
# 运行测试脚本（如果有）
pnpm test
```

## 🔍 调试工具

### 查看日志
```bash
# 查看服务器日志
tail -f /tmp/dev-server.log

# 查看数据库日志
sudo tail -f /var/log/mysql/error.log
```

### 数据库查询
```bash
# 连接数据库
mysql -u chu_tea_user -pchu_tea_pass_2024 chu_tea_db

# 查看用户
SELECT * FROM users LIMIT 10;

# 查看订单
SELECT * FROM orders ORDER BY createdAt DESC LIMIT 10;

# 查看商品
SELECT * FROM products WHERE isActive = 1 LIMIT 10;
```

### API测试
```bash
# 测试健康检查
curl http://localhost:3001/api/trpc/health.ping

# 测试用户登录（需要Telegram initData）
curl -X POST http://localhost:3001/api/trpc/auth.telegramLogin \
  -H "Content-Type: application/json" \
  -d '{"initData": "..."}'
```

## 🐛 常见问题

### Q: 页面一直空白
A: 这是正常的！必须在Telegram中打开，或者使用上面的"方式二"模拟Telegram环境。

### Q: 如何查看控制台错误？
A: 
- Telegram桌面版: 右键 -> 检查元素
- Telegram Web版: F12打开开发者工具
- 服务器日志: `tail -f /tmp/dev-server.log`

### Q: 数据库连接失败
A: 检查MySQL是否运行: `sudo systemctl status mysql`

### Q: 端口被占用
A: 服务器会自动使用3001端口，如果3000被占用

## 📱 真实环境测试

### 准备工作
1. 注册Telegram Bot (@BotFather)
2. 获取Bot Token
3. 配置到 `.env` 文件
4. 部署到公网服务器（或使用ngrok等内网穿透）
5. 配置Bot的Web App URL

### 测试流程
1. 在Telegram中打开Bot
2. 点击Web App按钮
3. 进入小程序
4. 测试各项功能
5. 检查用户体验
6. 收集反馈

## 🎨 UI/UX测试要点

- [ ] 界面美观，符合Telegram风格
- [ ] 响应速度快
- [ ] 动画流畅
- [ ] 触摸反馈（震动）
- [ ] 返回按钮正常工作
- [ ] 主按钮正常工作
- [ ] 主题颜色跟随Telegram
- [ ] 多语言显示正确
- [ ] 图片加载正常
- [ ] 字体大小合适
- [ ] 布局适配各种屏幕

## 📈 性能测试

- [ ] 首屏加载时间 < 2秒
- [ ] 页面切换流畅
- [ ] 滚动流畅
- [ ] 内存占用合理
- [ ] 网络请求优化
- [ ] 图片懒加载
- [ ] 代码分割生效

## ✅ 测试完成标准

- 所有核心功能正常工作
- 无严重bug
- UI/UX体验良好
- 性能指标达标
- 多语言正确
- 支付流程完整
- 数据持久化正常

---

**祝测试顺利！** 🎉
