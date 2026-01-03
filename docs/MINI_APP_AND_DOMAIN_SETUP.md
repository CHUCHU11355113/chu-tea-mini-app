# 🌐 CHU TEA Mini App 域名与 HTTPS 配置指南

为了让您的 Telegram Mini App 能够被用户访问，您需要一个**公网可访问的域名**，并且必须**启用 HTTPS**。本文档将指导您完成这些配置。

## 为什么需要域名和 HTTPS？

Telegram 对 Mini App 有严格的安全要求：

1.  **公网访问**：您的应用必须能从互联网上公开访问。
2.  **HTTPS 加密**：所有与您的应用之间的通信都必须经过 HTTPS 加密，以保护用户数据安全。

## 方案选择

我们为您提供了两种推荐的方案：

| 方案 | 优点 | 缺点 | 推荐场景 |
| :--- | :--- | :--- | :--- |
| **方案 A：使用 ngrok** | 简单、快速、免费 | 域名是临时的，每次重启都会变 | **开发和测试阶段** |
| **方案 B：购买域名 + Cloudflare** | 稳定、专业、安全 | 需要购买域名，配置稍复杂 | **生产环境** |

---

## 方案 A：使用 ngrok (推荐用于测试)

**ngrok** 是一个可以创建从公网到您本地服务器的安全隧道的工具。它会为您生成一个临时的 HTTPS 域名。

### 步骤 1：安装 ngrok

如果您还没有 ngrok，请访问 [ngrok.com](https://ngrok.com) 注册并下载。

### 步骤 2：启动您的本地服务器

确保您的 CHU TEA Mini App 服务器正在本地运行（例如，在 3000 端口）。

```bash
cd /path/to/chu-tea-mini-app-main
pnpm dev
```

### 步骤 3：启动 ngrok

打开一个新的终端窗口，运行以下命令：

```bash
ngrok http 3000
```

### 步骤 4：获取 HTTPS 域名

ngrok 会在终端中显示一个临时的 HTTPS 域名，例如：

```
Forwarding    https://random-string-1234.ngrok-free.app -> http://localhost:3000
```

您的 Mini App URL 就是 `https://random-string-1234.ngrok-free.app`。

**请注意**：这个域名是临时的。每次重启 ngrok，域名都会改变。您需要将新的域名更新到 Telegram Bot 的菜单按钮中。

---

## 方案 B：购买域名 + Cloudflare (推荐用于生产)

这是一个更稳定、更专业的方案，适合长期运营。

### 步骤 1：购买域名

您可以从任何域名注册商处购买一个域名，例如：
- [GoDaddy](https://www.godaddy.com/)
- [Namecheap](https://www.namecheap.com/)
- [Google Domains](https://domains.google/)

我们建议选择一个简短、易记的域名，例如 `chutea.app` 或 `chutea.ru`。

### 步骤 2：注册 Cloudflare

[Cloudflare](https://www.cloudflare.com/) 提供免费的 DNS、CDN 和 HTTPS 证书服务。

1.  访问 [cloudflare.com](https://www.cloudflare.com/) 并注册一个免费账户。
2.  添加您的域名到 Cloudflare。
3.  按照 Cloudflare 的指引，将您的域名注册商的 **DNS 服务器**更改为 Cloudflare 提供的 DNS 服务器。

### 步骤 3：配置 DNS 解析

在 Cloudflare 的 DNS 设置中，添加一条 `A` 记录，指向您服务器的公网 IP 地址。

- **类型**: `A`
- **名称**: `@` (代表您的根域名)
- **IPv4 地址**: `您的服务器公网 IP`
- **代理状态**: ✅ **已代理 (Proxied)** - 这会启用 Cloudflare 的 CDN 和 HTTPS

### 步骤 4：配置 HTTPS

在 Cloudflare 的 **SSL/TLS** 设置中，确保加密模式为 **Full (Strict)**。

1.  **概览 (Overview)** → **SSL/TLS 加密模式** → 选择 **Full (Strict)**。
2.  **源服务器 (Origin Server)** → **创建证书 (Create Certificate)**。
3.  按照指引生成源证书和私钥。
4.  将源证书和私钥安装到您的服务器上（例如，使用 Nginx 或 Apache）。

### 步骤 5：完成

现在，您的域名已经启用了 HTTPS，并且指向了您的服务器。您的 Mini App URL 就是 `https://yourdomain.com`。

---

## ✅ 下一步

无论您选择哪个方案，您现在都有一个可用的 HTTPS 域名。请将这个域名：

1.  **设置到 Telegram Bot 的菜单按钮中** (参考上一步的指南)。
2.  **配置到项目的环境变量中** (我们将在下一步中进行)。
