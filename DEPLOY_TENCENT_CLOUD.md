# CHU TEA Mini App - 腾讯云部署文档

## 📋 部署概述

本文档将指导您如何将CHU TEA Telegram Mini App部署到腾讯云服务器，实现永久运行。

## 🖥️ 服务器要求

### 最低配置
- **CPU**: 2核
- **内存**: 2GB
- **硬盘**: 20GB
- **带宽**: 1Mbps
- **操作系统**: Ubuntu 20.04 / 22.04 LTS

### 推荐配置
- **CPU**: 2核
- **内存**: 4GB
- **硬盘**: 40GB
- **带宽**: 3Mbps
- **操作系统**: Ubuntu 22.04 LTS

## 🚀 快速部署（推荐）

### 方法一：一键安装脚本

1. **购买腾讯云服务器**
   - 登录[腾讯云控制台](https://console.cloud.tencent.com/)
   - 购买轻量应用服务器或云服务器CVM
   - 选择Ubuntu 22.04系统镜像

2. **连接到服务器**
   ```bash
   ssh root@your-server-ip
   ```

3. **下载并运行一键安装脚本**
   ```bash
   # 克隆项目
   git clone https://github.com/YOUR_USERNAME/chu-tea.git
   cd chu-tea
   
   # 运行安装脚本
   sudo bash install-tencent.sh
   ```

4. **等待安装完成**
   - 脚本会自动安装所有依赖
   - 配置数据库
   - 构建项目
   - 启动服务

5. **访问应用**
   - 浏览器访问: `http://your-server-ip`
   - 配置Telegram Bot的Web App URL

---

## 📝 手动部署步骤

如果您想了解详细的部署过程，可以按照以下步骤手动部署。

### 步骤1: 准备服务器

```bash
# 更新系统
sudo apt-get update
sudo apt-get upgrade -y

# 安装基础工具
sudo apt-get install -y curl git wget vim ufw
```

### 步骤2: 安装Node.js 22

```bash
# 添加Node.js仓库
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -

# 安装Node.js
sudo apt-get install -y nodejs

# 验证安装
node -v  # 应该显示 v22.x.x
npm -v
```

### 步骤3: 安装pnpm和PM2

```bash
# 安装pnpm
sudo npm install -g pnpm

# 安装PM2
sudo npm install -g pm2

# 验证安装
pnpm -v
pm2 -v
```

### 步骤4: 安装MySQL

```bash
# 安装MySQL
sudo apt-get install -y mysql-server

# 启动MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 配置MySQL
sudo mysql
```

在MySQL命令行中执行：

```sql
-- 设置root密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_root_password';
FLUSH PRIVILEGES;

-- 创建数据库
CREATE DATABASE chu_tea_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户
CREATE USER 'chu_tea_user'@'localhost' IDENTIFIED BY 'chu_tea_pass_2024';

-- 授权
GRANT ALL PRIVILEGES ON chu_tea_db.* TO 'chu_tea_user'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 步骤5: 安装Nginx

```bash
# 安装Nginx
sudo apt-get install -y nginx

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

### 步骤6: 克隆项目

```bash
# 创建项目目录
sudo mkdir -p /var/www

# 克隆项目
cd /var/www
sudo git clone https://github.com/YOUR_USERNAME/chu-tea.git
cd chu-tea
```

### 步骤7: 配置环境变量

```bash
# 创建环境变量文件
sudo nano /var/www/chu-tea/server/.env
```

添加以下内容：

```env
NODE_ENV=production
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=chu_tea_user
DATABASE_PASSWORD=chu_tea_pass_2024
DATABASE_NAME=chu_tea_db
JWT_SECRET=your-secret-key-change-this
```

### 步骤8: 安装依赖并构建

```bash
# 构建后端
cd /var/www/chu-tea/server
pnpm install
pnpm run build

# 构建前端
cd /var/www/chu-tea/client
pnpm install
pnpm run build
```

### 步骤9: 配置Nginx

```bash
# 创建Nginx配置
sudo nano /etc/nginx/sites-available/chu-tea
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 改成您的域名或IP
    
    client_max_body_size 50M;

    # 前端静态文件
    location / {
        root /var/www/chu-tea/client/dist;
        try_files $uri $uri/ /index.html;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # 后端API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/chu-tea /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 步骤10: 启动应用

```bash
# 进入服务器目录
cd /var/www/chu-tea/server

# 启动应用
pm2 start dist/index.js --name chu-tea-api

# 保存PM2配置
pm2 save

# 设置开机自启
pm2 startup
# 复制输出的命令并执行
```

### 步骤11: 配置防火墙

```bash
# 允许SSH
sudo ufw allow 22/tcp

# 允许HTTP
sudo ufw allow 80/tcp

# 允许HTTPS
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 🔐 配置SSL证书（可选但推荐）

### 使用Let's Encrypt免费SSL证书

```bash
# 安装Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书（将your-domain.com替换为您的域名）
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

---

## 🤖 配置Telegram Bot

1. **获取Bot Token**
   - 在Telegram中找到 @BotFather
   - 发送 `/newbot` 创建新bot
   - 记录Bot Token

2. **配置Web App**
   - 发送 `/newapp` 给 @BotFather
   - 选择您的bot
   - 输入Web App名称
   - 输入Web App URL: `https://your-domain.com`
   - 上传图标

3. **测试**
   - 在Telegram中打开您的bot
   - 点击Web App应该能看到应用

---

## 📊 常用管理命令

### PM2命令

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs chu-tea-api

# 实时日志
pm2 logs chu-tea-api --lines 100

# 重启应用
pm2 restart chu-tea-api

# 停止应用
pm2 stop chu-tea-api

# 删除应用
pm2 delete chu-tea-api

# 查看详细信息
pm2 show chu-tea-api
```

### Nginx命令

```bash
# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 查看访问日志
sudo tail -f /var/log/nginx/access.log
```

### MySQL命令

```bash
# 登录MySQL
mysql -uroot -p

# 查看数据库
SHOW DATABASES;

# 使用数据库
USE chu_tea_db;

# 查看表
SHOW TABLES;

# 查看商品数据
SELECT * FROM products;

# 备份数据库
mysqldump -uroot -p chu_tea_db > backup.sql

# 恢复数据库
mysql -uroot -p chu_tea_db < backup.sql
```

---

## 🔄 更新应用

### 方法一：使用更新脚本

```bash
cd /var/www/chu-tea
sudo bash update.sh
```

### 方法二：手动更新

```bash
# 1. 拉取最新代码
cd /var/www/chu-tea
git pull

# 2. 更新后端
cd server
pnpm install
pnpm run build

# 3. 更新前端
cd ../client
pnpm install
pnpm run build

# 4. 重启应用
pm2 restart chu-tea-api
```

---

## 🐛 故障排查

### 应用无法访问

1. **检查PM2状态**
   ```bash
   pm2 status
   pm2 logs chu-tea-api --lines 50
   ```

2. **检查Nginx状态**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **检查端口占用**
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

### 数据库连接失败

1. **检查MySQL状态**
   ```bash
   sudo systemctl status mysql
   ```

2. **测试数据库连接**
   ```bash
   mysql -uchu_tea_user -p chu_tea_db
   ```

3. **检查环境变量**
   ```bash
   cat /var/www/chu-tea/server/.env
   ```

### 502 Bad Gateway

1. **检查后端是否运行**
   ```bash
   pm2 status
   curl http://localhost:3000/api/health
   ```

2. **检查Nginx配置**
   ```bash
   sudo nginx -t
   sudo tail -f /var/log/nginx/error.log
   ```

---

## 📈 性能优化

### 1. 启用Gzip压缩

编辑 `/etc/nginx/nginx.conf`：

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. 配置缓存

在Nginx配置中添加：

```nginx
# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 使用PM2集群模式

编辑 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'chu-tea-api',
    script: './server/dist/index.js',
    instances: 'max',  // 使用所有CPU核心
    exec_mode: 'cluster'
  }]
};
```

---

## 🔒 安全建议

1. **修改默认密码**
   - 修改MySQL root密码
   - 修改数据库用户密码
   - 修改JWT_SECRET

2. **配置防火墙**
   - 只开放必要的端口（22, 80, 443）
   - 限制SSH访问IP

3. **定期更新**
   - 定期更新系统: `sudo apt-get update && sudo apt-get upgrade`
   - 定期更新Node.js和依赖

4. **备份数据**
   - 定期备份数据库
   - 定期备份代码和配置

---

## 📞 技术支持

如果遇到问题：

1. 查看日志: `pm2 logs chu-tea-api`
2. 查看Nginx日志: `sudo tail -f /var/log/nginx/error.log`
3. 查看MySQL日志: `sudo tail -f /var/log/mysql/error.log`

---

## ✅ 部署检查清单

- [ ] 服务器已购买并可访问
- [ ] Node.js 22已安装
- [ ] MySQL已安装并配置
- [ ] Nginx已安装并配置
- [ ] 项目已克隆并构建
- [ ] PM2已启动应用
- [ ] 防火墙已配置
- [ ] SSL证书已配置（可选）
- [ ] Telegram Bot已配置
- [ ] 应用可以正常访问

---

**祝您部署顺利！** 🎉
