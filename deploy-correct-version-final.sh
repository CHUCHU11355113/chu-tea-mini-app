#!/bin/bash

# CHU TEA - 部署正确版本到腾讯云
# 这个脚本会部署您之前测试好的版本（带有8个商品和正确价格）

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   CHU TEA - 部署正确版本${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 检查root权限
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}请使用 root 用户运行${NC}"
  exit 1
fi

# 1. 停止旧的应用
echo -e "${YELLOW}[1/7] 停止旧应用...${NC}"
pm2 delete all 2>/dev/null || true
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 2. 清理旧文件
echo -e "${YELLOW}[2/7] 清理旧文件...${NC}"
cd /var/www
rm -rf chu-tea chu-tea-working-version.tar.gz
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 3. 下载项目包
echo -e "${YELLOW}[3/7] 下载项目（5MB）...${NC}"
wget -q --show-progress https://github.com/CHUCHU11355113/chu-tea-mini-app/releases/download/v1.0-working/chu-tea-working-version.tar.gz
echo -e "${GREEN}✓ 下载完成${NC}"
echo ""

# 4. 解压项目
echo -e "${YELLOW}[4/7] 解压项目...${NC}"
tar -xzf chu-tea-working-version.tar.gz
mv chu-tea-mini-app-main chu-tea
cd chu-tea
echo -e "${GREEN}✓ 解压完成${NC}"
echo ""

# 5. 配置环境变量
echo -e "${YELLOW}[5/7] 配置环境...${NC}"
JWT_SECRET=$(openssl rand -hex 32)
cat > .env << EOF
DATABASE_URL=mysql://chu_tea_user:chutea2025@localhost:3306/chu_tea_db
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
JWT_SECRET=${JWT_SECRET}
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_URL=
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
EOF
echo -e "${GREEN}✓ 环境配置完成${NC}"
echo ""

# 6. 安装依赖
echo -e "${YELLOW}[6/7] 安装依赖（约2-3分钟）...${NC}"
pnpm install
pnpm db:push
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 7. 启动应用
echo -e "${YELLOW}[7/7] 启动应用...${NC}"
pm2 start dist/index.js --name chu-tea
pm2 save
sleep 2
pm2 status
echo -e "${GREEN}✓ 应用启动完成${NC}"
echo ""

# 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   🎉 部署完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}访问地址: http://${SERVER_IP}:3000${NC}"
echo ""
echo -e "${YELLOW}数据库信息：${NC}"
echo "  数据库: chu_tea_db"
echo "  用户名: chu_tea_user"
echo "  密码: chutea2025"
echo ""
echo -e "${YELLOW}常用命令：${NC}"
echo "  pm2 status         - 查看状态"
echo "  pm2 logs chu-tea   - 查看日志"
echo "  pm2 restart chu-tea - 重启应用"
echo ""
