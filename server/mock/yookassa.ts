/**
 * YooKassa 支付 API 模拟服务
 * 
 * 用于在没有真实测试账号的情况下进行开发和测试。
 * 当拿到真实的测试账号后，替换为真实的 YooKassa SDK 调用。
 */

import { randomUUID } from 'crypto';

export interface YooKassaPaymentRequest {
  amount: {
    value: string; // 金额，如 "100.00"
    currency: string; // 货币代码，如 "RUB"
  };
  confirmation: {
    type: 'redirect'; // 确认类型
    return_url: string; // 支付完成后的返回 URL
  };
  description: string; // 订单描述
  metadata?: Record<string, any>; // 元数据
}

export interface YooKassaPaymentResponse {
  id: string; // 支付 ID
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: 'redirect';
    confirmation_url: string; // 支付页面 URL
  };
  created_at: string;
  description: string;
  metadata?: Record<string, any>;
}

export class YooKassaMockService {
  /**
   * 创建支付
   */
  static async createPayment(
    request: YooKassaPaymentRequest
  ): Promise<YooKassaPaymentResponse> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const paymentId = randomUUID();

    // 模拟支付响应
    const response: YooKassaPaymentResponse = {
      id: paymentId,
      status: 'pending',
      amount: request.amount,
      confirmation: {
        type: 'redirect',
        confirmation_url: `https://mock-yookassa.com/payment/${paymentId}`,
      },
      created_at: new Date().toISOString(),
      description: request.description,
      metadata: request.metadata,
    };

    console.log('[YooKassa Mock] 创建支付:', response);

    return response;
  }

  /**
   * 查询支付状态
   */
  static async getPayment(paymentId: string): Promise<YooKassaPaymentResponse> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟支付成功
    const response: YooKassaPaymentResponse = {
      id: paymentId,
      status: 'succeeded',
      amount: {
        value: '100.00',
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        confirmation_url: `https://mock-yookassa.com/payment/${paymentId}`,
      },
      created_at: new Date().toISOString(),
      description: 'Mock payment',
    };

    console.log('[YooKassa Mock] 查询支付:', response);

    return response;
  }

  /**
   * 取消支付
   */
  static async cancelPayment(paymentId: string): Promise<YooKassaPaymentResponse> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response: YooKassaPaymentResponse = {
      id: paymentId,
      status: 'canceled',
      amount: {
        value: '100.00',
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        confirmation_url: `https://mock-yookassa.com/payment/${paymentId}`,
      },
      created_at: new Date().toISOString(),
      description: 'Mock payment',
    };

    console.log('[YooKassa Mock] 取消支付:', response);

    return response;
  }

  /**
   * 创建退款
   */
  static async createRefund(paymentId: string, amount: { value: string; currency: string }) {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const refundId = randomUUID();

    const response = {
      id: refundId,
      payment_id: paymentId,
      status: 'succeeded',
      amount,
      created_at: new Date().toISOString(),
    };

    console.log('[YooKassa Mock] 创建退款:', response);

    return response;
  }
}

// 真实 YooKassa SDK 集成示例（当拿到测试账号后使用）
/*
import { YooKassa } from '@a2seven/yoo-checkout';

const yookassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP_ID!,
  secretKey: process.env.YOOKASSA_SECRET_KEY!,
});

export class YooKassaService {
  static async createPayment(request: YooKassaPaymentRequest) {
    return await yookassa.createPayment(request);
  }

  static async getPayment(paymentId: string) {
    return await yookassa.getPayment(paymentId);
  }

  static async cancelPayment(paymentId: string) {
    return await yookassa.cancelPayment(paymentId);
  }

  static async createRefund(paymentId: string, amount: { value: string; currency: string }) {
    return await yookassa.createRefund({ payment_id: paymentId, amount });
  }
}
*/
