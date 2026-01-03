# ⚙️ CHU TEA Mini App 环境变量与 Webhook 配置指南

本文档将指导您配置项目的环境变量，并设置 Telegram Bot 的 Webhook，以便您的应用能够接收和处理来自 Telegram 的消息和事件。

## 步骤 1：配置环境变量

环境变量用于存储敏感信息（如 API 密钥）和配置参数。CHU TEA Mini App 使用 `.env` 文件来管理这些变量。

### 1.1 打开 `.env` 文件

在项目根目录下，找到并打开 `.env` 文件：

```bash
cd /path/to/chu-tea-mini-app-main
nano .env
```

### 1.2 配置必要的环境变量

请根据以下说明，填写或更新您的 `.env` 文件：

```bash
# ===== 数据库配置 =====
DATABASE_URL="mysql://chu_tea_user:your_password@localhost:3306/chu_tea_db"

# ===== Telegram Bot 配置 =====
# 从 BotFather 获取的机器人令牌
TELEGRAM_BOT_TOKEN="1234567890:ABCdEfgHiJkLmNoPqRsTuVwXyZ"

# 您的 Mini App 的公网 HTTPS 域名
TELEGRAM_MINI_APP_URL="https://your-domain.com"

# Webhook 密钥（用于验证来自 Telegram 的请求）
TELEGRAM_WEBHOOK_SECRET="your_random_secret_string_here"

# ===== OAuth 配置 (可选) =====
# 如果您使用 Manus OAuth 服务，请配置以下变量
OAUTH_CLIENT_ID="your_oauth_client_id"
OAUTH_CLIENT_SECRET="your_oauth_client_secret"
OAUTH_REDIRECT_URI="https://your-domain.com/auth/callback"

# ===== YooKassa 支付配置 (可选) =====
# 在获取测试账号后填写
YOOKASSA_SHOP_ID=""
YOOKASSA_SECRET_KEY=""

# ===== IIKO POS 配置 (可选) =====
# 在获取测试账号后填写
IIKO_API_URL=""
IIKO_API_LOGIN=""
IIKO_API_PASSWORD=""

# ===== Yandex.Delivery 配置 (可选) =====
# 在获取测试账号后填写
YANDEX_DELIVERY_API_KEY=""
YANDEX_DELIVERY_CLIENT_ID=""

# ===== 其他配置 =====
NODE_ENV="production"
PORT="3000"

# 启用模拟服务（在没有真实 API 时使用）
USE_MOCK_SERVICES="true"
```

### 1.3 生成 Webhook 密钥

`TELEGRAM_WEBHOOK_SECRET` 是一个随机字符串，用于验证来自 Telegram 的 Webhook 请求的真实性。您可以使用以下命令生成一个随机密钥：

```bash
openssl rand -hex 32
```

将生成的字符串复制到 `.env` 文件中的 `TELEGRAM_WEBHOOK_SECRET` 变量。

---

## 步骤 2：设置 Telegram Webhook

Webhook 是一种机制，允许 Telegram 在有新消息或事件时主动通知您的服务器。

### 2.1 理解 Webhook URL

您的 Webhook URL 应该是：

```
https://your-domain.com/api/telegram/webhook
```

其中 `your-domain.com` 是您在上一步中配置的域名。

### 2.2 使用 Telegram Bot API 设置 Webhook

您可以通过向 Telegram Bot API 发送一个 HTTPS 请求来设置 Webhook。

**方法 1：使用 curl 命令**

在终端中运行以下命令（请替换 `YOUR_BOT_TOKEN` 和 `YOUR_WEBHOOK_URL`）：

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook",
    "secret_token": "your_random_secret_string_here"
  }'
```

**方法 2：在浏览器中访问**

您也可以直接在浏览器中访问以下 URL（请替换相应的值）：

```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://your-domain.com/api/telegram/webhook&secret_token=your_random_secret_string_here
```

### 2.3 验证 Webhook 设置

设置成功后，您应该会看到类似以下的响应：

```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```

您可以通过以下命令检查当前的 Webhook 设置：

```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

---

## 步骤 3：启动应用服务器

现在，您的环境变量和 Webhook 都已配置完成。让我们启动应用服务器。

### 3.1 安装依赖（如果尚未安装）

```bash
cd /path/to/chu-tea-mini-app-main
pnpm install
```

### 3.2 运行数据库迁移

```bash
pnpm db:push
```

### 3.3 启动生产服务器

```bash
pnpm start
```

或者，如果您在开发环境中测试：

```bash
pnpm dev
```

---

## 步骤 4：测试 Webhook

### 4.1 向您的 Bot 发送消息

在 Telegram 中打开您的 Bot，发送一条消息，例如 `/start`。

### 4.2 检查服务器日志

查看您的服务器日志，您应该能看到来自 Telegram 的 Webhook 请求。

```bash
tail -f /path/to/your/server.log
```

如果一切配置正确，您的服务器应该能够接收并处理这些请求。

---

## ✅ 完成

恭喜！您已经成功配置了环境变量和 Telegram Webhook。您的 CHU TEA Mini App 现在可以与 Telegram 进行通信了。

## 常见问题

### Q: Webhook 设置失败，提示 "Bad Request: wrong HTTP URL"

**A**: 请确保您的域名是 HTTPS 的，并且可以从公网访问。Telegram 不接受 HTTP 或本地地址。

### Q: 服务器收不到 Webhook 请求

**A**: 请检查：
1. 您的服务器是否正在运行。
2. 防火墙是否允许来自 Telegram 的请求。
3. Webhook URL 是否正确配置。
4. 使用 `getWebhookInfo` 命令检查 Telegram 端的配置。

### Q: 如何删除 Webhook？

**A**: 如果您需要删除 Webhook（例如，切换回轮询模式），可以运行：

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook"
```
