# CHU TEA Mini App - 第三方 API 集成指南

**版本**: v1.0
**作者**: Manus AI
**日期**: 2026年1月3日

---

## 1. 概述

CHU TEA Mini App 需要集成以下俄罗斯本地的第三方服务：

1.  **YooKassa** - 在线支付
2.  **IIKO** - POS 系统（订单同步、菜单管理）
3.  **Yandex.Delivery** - 外卖配送

在开发阶段，我们创建了**模拟服务（Mock Services）**，以便在没有真实测试账号的情况下完成开发和测试。当您拿到真实的测试账号后，只需按照本文档的指引，替换为真实的 API 调用即可。

---

## 2. 模拟服务架构

所有模拟服务都位于 `server/mock/` 目录下：

```
server/
├── mock/
│   ├── yookassa.ts         # YooKassa 支付模拟
│   ├── iiko.ts             # IIKO POS 模拟
│   └── yandex-delivery.ts  # Yandex.Delivery 物流模拟
```

### 2.1. 模拟服务的特点

-   **完全模拟真实 API 的请求和响应格式**
-   **包含随机延迟，模拟网络请求**
-   **支持所有核心功能（创建、查询、取消等）**
-   **详细的日志输出，方便调试**

### 2.2. 如何使用模拟服务

在业务逻辑中，通过环境变量控制使用模拟服务还是真实服务：

```typescript
import { YooKassaMockService } from './mock/yookassa';
// import { YooKassaService } from './services/yookassa'; // 真实服务

const USE_MOCK = process.env.USE_MOCK_SERVICES === 'true';

const paymentService = USE_MOCK ? YooKassaMockService : YooKassaService;

// 使用
const payment = await paymentService.createPayment(request);
```

---

## 3. YooKassa 支付集成

### 3.1. 模拟服务功能

-   ✅ 创建支付
-   ✅ 查询支付状态
-   ✅ 取消支付
-   ✅ 创建退款

### 3.2. 真实 API 集成步骤

#### 步骤 1: 安装 YooKassa SDK

```bash
pnpm add @a2seven/yoo-checkout
```

#### 步骤 2: 配置环境变量

在 `.env` 文件中添加：

```env
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=your_secret_key
USE_MOCK_SERVICES=false
```

#### 步骤 3: 替换模拟服务

在 `server/mock/yookassa.ts` 文件末尾，已经提供了真实 API 集成的示例代码。取消注释并使用即可。

#### 步骤 4: 测试

1.  创建一笔测试支付
2.  访问返回的 `confirmation_url`
3.  使用 YooKassa 提供的测试卡号完成支付
4.  验证支付状态是否更新为 `succeeded`

### 3.3. 注意事项

-   **生产环境**：确保使用生产环境的 `shopId` 和 `secretKey`
-   **回调 URL**：配置 YooKassa 后台的 Webhook URL，以接收支付状态更新
-   **安全性**：不要在前端代码中暴露 `secretKey`

---

## 4. IIKO POS 集成

### 4.1. 模拟服务功能

-   ✅ 创建订单（生成取件码）
-   ✅ 查询订单状态
-   ✅ 取消订单
-   ✅ 获取菜单

### 4.2. 真实 API 集成步骤

#### 步骤 1: 获取 IIKO API 凭证

联系 IIKO 技术支持，获取：
-   `apiLogin`
-   `organizationId`
-   `terminalGroupId`

#### 步骤 2: 配置环境变量

在 `.env` 文件中添加：

```env
IIKO_API_LOGIN=your_api_login
IIKO_ORGANIZATION_ID=your_organization_id
IIKO_TERMINAL_GROUP_ID=your_terminal_group_id
USE_MOCK_SERVICES=false
```

#### 步骤 3: 安装依赖

```bash
pnpm add axios
```

#### 步骤 4: 替换模拟服务

在 `server/mock/iiko.ts` 文件末尾，已经提供了真实 API 集成的示例代码。取消注释并使用即可。

#### 步骤 5: 测试

1.  创建一笔测试订单
2.  在 IIKO 后台查看订单是否成功同步
3.  验证取件码是否正确显示在小票上
4.  测试订单状态更新是否实时同步

### 4.3. 注意事项

-   **订单类型**：确保 `orderTypeId` 与 IIKO 后台配置的订单类型一致
-   **支付类型**：确保 `paymentTypeId` 与 IIKO 后台配置的支付类型一致
-   **取件码**：IIKO 返回的 `externalNumber` 即为取件码，需要在小票上显示
-   **菜单同步**：定期从 IIKO 获取最新的菜单数据，更新到数据库中

---

## 5. Yandex.Delivery 物流集成

### 5.1. 模拟服务功能

-   ✅ 创建配送订单
-   ✅ 查询配送状态
-   ✅ 取消配送订单
-   ✅ 计算配送费用

### 5.2. 真实 API 集成步骤

#### 步骤 1: 获取 Yandex.Delivery API 密钥

访问 [Yandex.Delivery B2B 平台](https://b2b.taxi.yandex.net/)，注册并获取 API 密钥。

#### 步骤 2: 配置环境变量

在 `.env` 文件中添加：

```env
YANDEX_DELIVERY_API_KEY=your_api_key
USE_MOCK_SERVICES=false
```

#### 步骤 3: 安装依赖

```bash
pnpm add axios
```

#### 步骤 4: 替换模拟服务

在 `server/mock/yandex-delivery.ts` 文件末尾，已经提供了真实 API 集成的示例代码。取消注释并使用即可。

#### 步骤 5: 测试

1.  创建一笔测试配送订单
2.  查询配送状态，验证配送员信息是否正确
3.  在地图上追踪配送进度
4.  测试取消配送订单功能

### 5.3. 注意事项

-   **地址解析**：确保地址格式正确，Yandex 才能准确定位
-   **配送范围**：Yandex.Delivery 的服务范围有限，需要提前确认
-   **费用计算**：使用 `estimateDelivery` API 预先计算配送费用，避免用户下单后费用变动
-   **实时追踪**：可以使用 Yandex 提供的 Webhook，实时接收配送状态更新

---

## 6. 集成测试清单

在替换为真实 API 后，请按照以下清单进行测试：

### 6.1. YooKassa 支付

- [ ] 创建支付成功
- [ ] 支付页面可以正常打开
- [ ] 使用测试卡号完成支付
- [ ] 支付状态更新为 `succeeded`
- [ ] Webhook 回调正常接收
- [ ] 退款功能正常

### 6.2. IIKO POS

- [ ] 订单成功同步到 IIKO
- [ ] 取件码正确显示在小票上
- [ ] 订单状态实时更新
- [ ] 菜单数据同步正确
- [ ] 取消订单功能正常

### 6.3. Yandex.Delivery

- [ ] 创建配送订单成功
- [ ] 配送费用计算准确
- [ ] 配送员信息正确显示
- [ ] 配送状态实时更新
- [ ] 地图追踪功能正常
- [ ] 取消配送订单功能正常

---

## 7. 故障排查

### 7.1. 常见问题

#### 问题 1: API 返回 401 Unauthorized

**原因**: API 密钥或凭证不正确。

**解决方案**:
1.  检查 `.env` 文件中的凭证是否正确
2.  确认凭证是否已过期
3.  联系服务提供商重新获取凭证

#### 问题 2: IIKO 订单同步失败

**原因**: 订单类型或支付类型 ID 不匹配。

**解决方案**:
1.  登录 IIKO 后台，查看订单类型和支付类型的 ID
2.  更新代码中的 `orderTypeId` 和 `paymentTypeId`

#### 问题 3: Yandex.Delivery 无法创建订单

**原因**: 地址格式不正确或超出配送范围。

**解决方案**:
1.  使用 Yandex.Maps API 验证地址
2.  确认地址在 Yandex.Delivery 的服务范围内

---

## 8. 总结

通过使用模拟服务，我们可以在没有真实测试账号的情况下完成开发和测试。当您拿到真实的测试账号后，只需按照本文档的指引，替换为真实的 API 调用，并进行集成测试即可。

所有模拟服务的代码都已经包含了真实 API 集成的示例，您只需取消注释并配置环境变量即可使用。
