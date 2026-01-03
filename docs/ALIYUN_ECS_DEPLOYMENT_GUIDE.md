# 🚀 CHU TEA Mini App 阿里云 ECS 部署指南

本文档将指导您如何将 CHU TEA Mini App 部署到阿里云 ECS 服务器上，并配置 Nginx、PM2 和 HTTPS。

## 准备工作

在开始之前，请确保您已经准备好：

-   ✅ **一台阿里云 ECS 服务器** (推荐 Ubuntu 22.04)
-   ✅ **一个已备案的域名** (例如 `chu-tea.com`)
-   ✅ **Git 仓库访问权限**
-   ✅ **SSH 访问服务器的权限**

---

## 部署步骤

### 步骤 1：服务器环境配置

1.  **连接到您的 ECS 服务器**
    ```bash
    ssh root@your_server_ip
    ```

2.  **安装 Node.js 和 pnpm**
    ```bash
    # 安装 nvm (Node Version Manager)
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    source ~/.bashrc

    # 安装 Node.js v22
    nvm install 22
    nvm use 22

    # 安装 pnpm
    npm install -g pnpm
    ```

3.  **安装 MySQL**
    ```bash
    sudo apt-get update
    sudo apt-get install -y mysql-server
    ```

4.  **安装 Nginx**
    ```bash
    sudo apt-get install -y nginx
    ```

5.  **安装 PM2 (进程管理器)**
    ```bash
    pnpm install -g pm2
    ```

### 步骤 2：拉取代码和配置

1.  **克隆您的 Git 仓库**
    ```bash
    git clone your_git_repository_url /var/www/chu-tea
    cd /var/www/chu-tea
    ```

2.  **安装项目依赖**
    ```bash
    pnpm install
    ```

3.  **配置环境变量**
    -   复制 `.env.example` 到 `.env`
    -   修改 `.env` 文件，填写所有生产环境的配置，特别是：
        -   `DATABASE_URL` (使用生产数据库)
        -   `JWT_SECRET` (生成一个安全的密钥)
        -   `TELEGRAM_BOT_TOKEN`
        -   `TELEGRAM_MINI_APP_URL` (您的域名)
        -   `TELEGRAM_WEBHOOK_SECRET`
        -   `USE_MOCK_SERVICES=false`

4.  **运行数据库迁移**
    ```bash
    pnpm db:push
    ```

5.  **初始化配置数据**
    ```bash
    pnpm tsx server/scripts/init-all-configs.ts
    ```

### 步骤 3：配置 Nginx 和 HTTPS

1.  **创建 Nginx 配置文件**
    ```bash
    sudo nano /etc/nginx/sites-available/chu-tea
    ```

2.  **粘贴以下配置** (将 `your_domain.com` 替换为您的域名)
    ```nginx
    server {
        listen 80;
        server_name your_domain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **启用站点**
    ```bash
    sudo ln -s /etc/nginx/sites-available/chu-tea /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

4.  **配置 HTTPS (使用 Certbot)**
    ```bash
    sudo apt-get install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d your_domain.com
    ```
    Certbot 会自动为您配置 HTTPS 并续订证书。

### 步骤 4：使用 PM2 启动应用

1.  **创建 PM2 启动脚本** (`ecosystem.config.js`)
    ```javascript
    module.exports = {
      apps: [
        {
          name: 'chu-tea-app',
          script: 'pnpm',
          args: 'start',
          env: {
            NODE_ENV: 'production',
            PORT: 3000,
          },
        },
      ],
    };
    ```

2.  **使用 PM2 启动应用**
    ```bash
    pm2 start ecosystem.config.js
    ```

3.  **设置开机自启**
    ```bash
    pm2 startup
    pm2 save
    ```

### 步骤 5：配置 Telegram Webhook

1.  **设置 Webhook**
    -   在浏览器中访问以下 URL (替换您的 Token 和域名):
    ```
    https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your_domain.com/api/telegram/webhook&secret_token=<YOUR_WEBHOOK_SECRET>
    ```

2.  **验证 Webhook**
    -   访问 `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo`
    -   **预期结果**：您应该能看到您的 Webhook URL 和没有错误信息。

---

## ✅ 部署完成！

现在，您的 CHU TEA Mini App 已经成功部署到阿里云 ECS 上，并配置了 HTTPS 和 PM2 进程管理。

您可以随时通过以下命令查看应用状态：

-   `pm2 list` - 查看应用列表
-   `pm2 logs chu-tea-app` - 查看实时日志
-   `pm2 restart chu-tea-app` - 重启应用

如果您在部署过程中遇到任何问题，请随时向我提问。
