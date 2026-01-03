# 🤖 CHU TEA Telegram Bot 配置指南

本文档将指导您如何创建一个新的 Telegram Bot 并获取必要的凭证，以便将 CHU TEA Mini App 集成到 Telegram 中。

## 步骤 1：与 BotFather 对话

1.  在 Telegram 中搜索 **@BotFather** 并开始与他对话。BotFather 是 Telegram 官方用于管理所有 Bot 的机器人。

2.  发送 `/start` 命令开始。

## 步骤 2：创建新机器人

1.  向 BotFather 发送 `/newbot` 命令。

2.  **设置机器人名称 (Name)**：
    -   BotFather 会询问您的机器人叫什么名字。这个名字会显示在用户的聊天列表中。
    -   我们建议使用：`CHU TEA`

3.  **设置机器人用户名 (Username)**：
    -   接下来，BotFather 会要求您设置一个唯一的用户名。这个用户名必须以 `bot` 结尾。
    -   例如：`ChuTeaBot` 或 `ChuTeaOfficialBot`。

## 步骤 3：获取机器人令牌 (Token)

创建成功后，BotFather 会发送一条消息，其中包含您的**机器人令牌 (Token)**。这个令牌非常重要，是您与 Telegram Bot API 通信的唯一凭证。

**请务必妥善保管您的机器人令牌，不要泄露给任何人！**

> 示例消息：
> ```
> Done! Congratulations on your new bot. You will find it at t.me/YourBotUsername. You can now add a description, about section and profile picture for your bot, see /help for a list of commands.
> 
> Use this token to access the HTTP API:
> 1234567890:ABCdEfgHiJkLmNoPqRsTuVwXyZ
> 
> For a description of the Bot API, see this page: https://core.telegram.org/bots/api
> ```

## 步骤 4：配置机器人信息

为了让您的机器人看起来更专业，我们建议您配置以下信息：

1.  **设置描述 (Description)**：
    -   向 BotFather 发送 `/setdescription` 命令。
    -   选择您要设置的机器人。
    -   输入一段简短的描述，告诉用户这个机器人是做什么的。
    -   **建议描述 (俄语)**：`Официальный бот CHU TEA. Заказывайте любимые напитки прямо в Telegram!`

2.  **设置关于信息 (About Text)**：
    -   向 BotFather 发送 `/setabouttext` 命令。
    -   选择机器人。
    -   输入一段更详细的介绍，会显示在机器人的个人资料页面。
    -   **建议关于信息 (俄语)**：`CHU TEA - самый популярный чайный бренд в России. С помощью этого бота вы можете легко заказать наши напитки, накапливать баллы и получать эксклюзивные скидки.`

3.  **设置机器人头像 (Profile Picture)**：
    -   向 BotFather 发送 `/setuserpic` 命令。
    -   选择机器人。
    -   发送您想要设置为头像的图片（建议使用 CHU TEA 的 Logo）。

## 步骤 5：设置机器人命令

为了方便用户与您的 Mini App 交互，我们建议设置以下命令：

1.  向 BotFather 发送 `/setcommands` 命令。
2.  选择机器人。
3.  发送以下格式的命令列表：

    ```
    start - 🚀 Запустить приложение (启动应用)
    menu - 📋 Открыть меню (打开菜单)
    cart - 🛒 Моя корзина (我的购物车)
    orders - 📦 Мои заказы (我的订单)
    profile - 👤 Мой профиль (我的资料)
    ```

## 步骤 6：设置 Mini App 启动按钮

这是最关键的一步，它会在您的机器人聊天界面下方添加一个启动 Mini App 的按钮。

1.  向 BotFather 发送 `/mybots` 命令。
2.  选择您的机器人。
3.  点击 **Bot Settings** → **Menu Button**。
4.  选择 **Configure Menu Button**。
5.  输入您的 Mini App 的 **URL**（我们将在下一步中配置）。
6.  输入按钮上显示的文字，例如 `🚀 Запустить`。

---

## ✅ 完成

完成以上步骤后，您就已经成功创建并配置了您的 Telegram Bot。请将获取到的**机器人令牌 (Token)** 安全地记录下来，我们将在下一步的环境变量配置中使用它。
