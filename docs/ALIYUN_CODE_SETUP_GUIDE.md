# 阿里云 Code 仓库设置指南

本文档将指导您如何在阿里云 Code 上创建代码仓库，并将 CHU TEA Mini App 项目代码推送到远程仓库。

---

## 第一步：创建阿里云 Code 仓库

### 1.1 登录阿里云 Code

访问阿里云 Code 平台并登录您的阿里云账号：

**阿里云 Code 地址**：https://code.aliyun.com/

如果您还没有开通阿里云 Code 服务，系统会提示您开通（免费服务）。

### 1.2 创建新仓库

登录后，点击右上角的 **"新建项目"** 或 **"New Project"** 按钮。

填写以下信息：

| 配置项 | 建议值 | 说明 |
|--------|--------|------|
| **项目名称** | `chu-tea-mini-app` | 项目的标识名称，使用小写字母和连字符 |
| **项目描述** | `CHU TEA Telegram Mini App - 俄罗斯市场茶饮订购平台` | 简短描述项目用途 |
| **可见性级别** | **私有** | 建议选择私有，保护您的商业代码 |
| **初始化仓库** | **不勾选** "使用 README 初始化仓库" | 我们已经有完整的代码，不需要初始化 |

点击 **"创建项目"** 完成仓库创建。

### 1.3 获取仓库地址

创建成功后，您会看到仓库的首页。在页面上找到 **"克隆"** 或 **"Clone"** 按钮，会显示两种地址：

- **HTTPS 地址**：`https://code.aliyun.com/your-username/chu-tea-mini-app.git`
- **SSH 地址**：`git@code.aliyun.com:your-username/chu-tea-mini-app.git`

**建议使用 HTTPS 地址**，更简单方便。请记录下这个地址，后面会用到。

---

## 第二步：配置 Git 凭证

### 2.1 生成 Personal Access Token（推荐）

为了安全地推送代码，建议使用 Personal Access Token 而不是直接使用密码。

**步骤**：

1. 在阿里云 Code 页面，点击右上角的 **头像** → **设置** → **访问令牌**（Access Tokens）
2. 点击 **"生成新令牌"** 或 **"Generate new token"**
3. 填写以下信息：
   - **令牌名称**：`chu-tea-deployment`
   - **过期时间**：建议选择 **1 年** 或 **永不过期**
   - **权限范围**：勾选 **`api`**（完整的 API 访问权限）
4. 点击 **"生成令牌"**
5. **重要**：复制生成的令牌并保存到安全的地方（令牌只会显示一次）

令牌格式类似：`glpat-xxxxxxxxxxxxxxxxxxxx`

### 2.2 配置 Git 用户信息（如果还未配置）

在您的本地开发环境或服务器上，配置 Git 用户信息：

```bash
git config --global user.name "您的名字"
git config --global user.email "您的邮箱@example.com"
```

---

## 第三步：推送代码到阿里云 Code

### 3.1 解压项目代码（如果需要）

如果您是从 zip 文件开始，先解压到合适的位置：

```bash
# 创建工作目录
mkdir -p ~/projects
cd ~/projects

# 解压项目文件
unzip chu-tea-mini-app-main.zip
cd chu-tea-mini-app-main
```

### 3.2 添加远程仓库

在项目目录中，添加阿里云 Code 作为远程仓库：

```bash
# 进入项目目录
cd /home/ubuntu/chu-tea-mini-app-main

# 添加远程仓库（请替换为您的实际仓库地址）
git remote add origin https://code.aliyun.com/your-username/chu-tea-mini-app.git

# 验证远程仓库配置
git remote -v
```

您应该看到类似以下输出：

```
origin  https://code.aliyun.com/your-username/chu-tea-mini-app.git (fetch)
origin  https://code.aliyun.com/your-username/chu-tea-mini-app.git (push)
```

### 3.3 推送代码到远程仓库

```bash
# 推送所有分支和标签到远程仓库
git push -u origin master

# 推送所有标签
git push origin --tags
```

**首次推送时的认证**：

系统会提示您输入用户名和密码：

- **用户名**：您的阿里云 Code 用户名
- **密码**：使用您在第二步生成的 **Personal Access Token**（不是阿里云账号密码）

### 3.4 配置凭证缓存（可选，避免重复输入）

为了避免每次推送都输入凭证，可以配置凭证缓存：

```bash
# 缓存凭证 1 小时
git config --global credential.helper 'cache --timeout=3600'

# 或者永久保存凭证（不太安全，仅在安全环境使用）
git config --global credential.helper store
```

---

## 第四步：验证推送成功

### 4.1 在阿里云 Code 查看代码

回到阿里云 Code 的仓库页面，刷新浏览器，您应该能看到：

- ✅ 所有项目文件和目录
- ✅ Git 提交历史
- ✅ 版本标签（如 `v1.1.0`）
- ✅ README 文件内容

### 4.2 检查关键文件

确认以下关键文件已成功推送：

- ✅ `server/index.ts` - 后端服务器
- ✅ `src/client/` - 前端代码
- ✅ `db/schema.ts` - 数据库模式
- ✅ `docs/` - 所有文档
- ✅ `ecosystem.config.js` - PM2 配置
- ✅ `deploy.sh` - 部署脚本
- ✅ `.env.production.template` - 环境变量模板

---

## 常见问题

### Q1: 推送时提示 "Authentication failed"

**解决方案**：

1. 确认您使用的是 **Personal Access Token** 而不是阿里云账号密码
2. 检查 Token 是否有 `api` 权限
3. 检查 Token 是否已过期
4. 尝试重新生成一个新的 Token

### Q2: 推送时提示 "Permission denied"

**解决方案**：

1. 确认您在阿里云 Code 上有该仓库的写入权限
2. 如果是团队仓库，请联系管理员添加您为成员

### Q3: 如何切换到 SSH 方式推送？

如果您更熟悉 SSH 方式，可以：

1. 在阿里云 Code 设置中添加您的 SSH 公钥
2. 修改远程仓库地址：

```bash
git remote set-url origin git@code.aliyun.com:your-username/chu-tea-mini-app.git
```

---

## 下一步

代码推送成功后，您可以继续进行：

1. **阿里云 ECS 服务器部署**：参考 `docs/ALIYUN_ECS_DEPLOYMENT_GUIDE.md`
2. **配置域名和 HTTPS**：将 `chuchutea.vip` 解析到服务器并配置 SSL 证书
3. **Telegram 集成测试**：配置 Webhook 并在 Telegram 中测试 Mini App

---

## 总结

通过本指南，您已经成功将 CHU TEA Mini App 代码推送到阿里云 Code 仓库。现在您拥有了一个安全的代码托管平台，可以方便地进行版本控制和团队协作。

下一步，请参考 **阿里云 ECS 部署指南** 开始服务器部署工作。
