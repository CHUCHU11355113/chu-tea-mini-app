/**
 * IIKO POS API 模拟服务
 * 
 * 用于在没有真实测试账号的情况下进行开发和测试。
 * 当拿到真实的测试账号后，替换为真实的 IIKO API 调用。
 */

import { randomUUID } from 'crypto';

export interface IIKOOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  modifiers?: Array<{
    modifierId: string;
    modifierName: string;
    quantity: number;
    price: number;
  }>;
}

export interface IIKOOrderRequest {
  organizationId: string;
  terminalGroupId: string;
  order: {
    phone: string;
    customer: {
      name: string;
      phone: string;
    };
    orderTypeId: string; // 订单类型（外卖/自提）
    deliveryPoint?: {
      address: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    items: IIKOOrderItem[];
    payments: Array<{
      paymentTypeId: string;
      sum: number;
      isProcessedExternally: boolean;
    }>;
  };
}

export interface IIKOOrderResponse {
  correlationId: string; // 订单关联 ID
  orderInfo: {
    id: string; // IIKO 订单 ID
    externalNumber: string; // 外部订单号（取件码）
    organizationId: string;
    timestamp: number;
    creationStatus: 'Success' | 'InProgress' | 'Error';
    errorInfo?: {
      code: string;
      message: string;
    };
    order: {
      id: string;
      externalNumber: string;
      status: 'New' | 'Waiting' | 'InProgress' | 'CookingStarted' | 'CookingCompleted' | 'Closed' | 'Cancelled';
    };
  };
}

export class IIKOMockService {
  /**
   * 创建订单
   */
  static async createOrder(request: IIKOOrderRequest): Promise<IIKOOrderResponse> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const orderId = randomUUID();
    const correlationId = randomUUID();
    
    // 生成取件码（4位数字）
    const pickupCode = Math.floor(1000 + Math.random() * 9000).toString();

    const response: IIKOOrderResponse = {
      correlationId,
      orderInfo: {
        id: orderId,
        externalNumber: pickupCode,
        organizationId: request.organizationId,
        timestamp: Date.now(),
        creationStatus: 'Success',
        order: {
          id: orderId,
          externalNumber: pickupCode,
          status: 'New',
        },
      },
    };

    console.log('[IIKO Mock] 创建订单:', response);
    console.log('[IIKO Mock] 取件码:', pickupCode);

    return response;
  }

  /**
   * 查询订单状态
   */
  static async getOrderStatus(orderId: string): Promise<{
    id: string;
    externalNumber: string;
    status: string;
    items: any[];
  }> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟订单状态变化
    const statuses = ['New', 'Waiting', 'InProgress', 'CookingStarted', 'CookingCompleted', 'Closed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const response = {
      id: orderId,
      externalNumber: Math.floor(1000 + Math.random() * 9000).toString(),
      status: randomStatus,
      items: [],
    };

    console.log('[IIKO Mock] 查询订单状态:', response);

    return response;
  }

  /**
   * 取消订单
   */
  static async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = {
      success: true,
      message: '订单已取消',
    };

    console.log('[IIKO Mock] 取消订单:', orderId);

    return response;
  }

  /**
   * 获取菜单
   */
  static async getMenu(organizationId: string): Promise<{
    groups: any[];
    products: any[];
  }> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟菜单数据
    const response = {
      groups: [
        {
          id: 'group-1',
          name: 'Чай с молоком',
          description: 'Молочный чай',
          order: 1,
        },
        {
          id: 'group-2',
          name: 'Фруктовый чай',
          description: 'Фруктовый чай',
          order: 2,
        },
      ],
      products: [
        {
          id: 'product-1',
          name: 'Классический молочный чай',
          description: 'Традиционный молочный чай с жемчугом',
          price: 350,
          groupId: 'group-1',
          images: [],
        },
        {
          id: 'product-2',
          name: 'Манго молочный чай',
          description: 'Молочный чай с манго',
          price: 400,
          groupId: 'group-1',
          images: [],
        },
      ],
    };

    console.log('[IIKO Mock] 获取菜单:', response);

    return response;
  }
}

// 真实 IIKO API 集成示例（当拿到测试账号后使用）
/*
import axios from 'axios';

const IIKO_API_BASE = 'https://api-ru.iiko.services';

export class IIKOService {
  private static accessToken: string | null = null;
  private static tokenExpiry: number = 0;

  // 获取访问令牌
  static async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await axios.post(`${IIKO_API_BASE}/api/1/access_token`, {
      apiLogin: process.env.IIKO_API_LOGIN!,
    });

    this.accessToken = response.data.token;
    this.tokenExpiry = Date.now() + 3600 * 1000; // 1小时后过期

    return this.accessToken;
  }

  // 创建订单
  static async createOrder(request: IIKOOrderRequest): Promise<IIKOOrderResponse> {
    const token = await this.getAccessToken();

    const response = await axios.post(
      `${IIKO_API_BASE}/api/1/deliveries/create`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  // 查询订单状态
  static async getOrderStatus(orderId: string) {
    const token = await this.getAccessToken();

    const response = await axios.post(
      `${IIKO_API_BASE}/api/1/deliveries/by_id`,
      {
        organizationIds: [process.env.IIKO_ORGANIZATION_ID!],
        orderIds: [orderId],
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.orders[0];
  }

  // 取消订单
  static async cancelOrder(orderId: string) {
    const token = await this.getAccessToken();

    const response = await axios.post(
      `${IIKO_API_BASE}/api/1/deliveries/cancel`,
      {
        organizationId: process.env.IIKO_ORGANIZATION_ID!,
        orderId,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  // 获取菜单
  static async getMenu(organizationId: string) {
    const token = await this.getAccessToken();

    const response = await axios.post(
      `${IIKO_API_BASE}/api/1/nomenclature`,
      {
        organizationId,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
}
*/
