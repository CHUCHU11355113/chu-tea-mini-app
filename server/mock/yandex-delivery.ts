/**
 * Yandex.Delivery 物流 API 模拟服务
 * 
 * 用于在没有真实测试账号的情况下进行开发和测试。
 * 当拿到真实的测试账号后，替换为真实的 Yandex.Delivery API 调用。
 */

import { randomUUID } from 'crypto';

export interface YandexDeliveryRequest {
  route_points: Array<{
    type: 'source' | 'destination';
    coordinates: [number, number]; // [经度, 纬度]
    address: {
      fullname: string;
      coordinates: [number, number];
    };
    contact: {
      name: string;
      phone: string;
    };
  }>;
  items: Array<{
    title: string;
    quantity: number;
    price: {
      value: string;
      currency: 'RUB';
    };
  }>;
  requirements: {
    taxi_class?: 'express' | 'courier';
  };
}

export interface YandexDeliveryResponse {
  id: string; // 配送订单 ID
  status: 'new' | 'estimating' | 'estimating_failed' | 'ready_for_approval' | 'accepted' | 'performer_lookup' | 'performer_draft' | 'performer_found' | 'pickup_arrived' | 'ready_for_pickup_confirmation' | 'pickuped' | 'delivery_arrived' | 'ready_for_delivery_confirmation' | 'delivered' | 'cancelled';
  created_ts: string;
  updated_ts: string;
  pricing: {
    currency: 'RUB';
    final_price: string;
  };
  performer_info?: {
    courier_name: string;
    legal_name: string;
    car_model: string;
    car_number: string;
  };
  route_points: Array<{
    type: 'source' | 'destination';
    visit_status: 'pending' | 'arrived' | 'visited' | 'skipped';
    coordinates: [number, number];
  }>;
}

export class YandexDeliveryMockService {
  /**
   * 创建配送订单
   */
  static async createDelivery(
    request: YandexDeliveryRequest
  ): Promise<YandexDeliveryResponse> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const deliveryId = randomUUID();

    // 模拟配送费计算
    const basePrice = 150;
    const distancePrice = Math.floor(Math.random() * 100); // 随机距离费用
    const finalPrice = basePrice + distancePrice;

    const response: YandexDeliveryResponse = {
      id: deliveryId,
      status: 'new',
      created_ts: new Date().toISOString(),
      updated_ts: new Date().toISOString(),
      pricing: {
        currency: 'RUB',
        final_price: finalPrice.toString(),
      },
      route_points: request.route_points.map((point) => ({
        type: point.type,
        visit_status: 'pending',
        coordinates: point.coordinates,
      })),
    };

    console.log('[Yandex.Delivery Mock] 创建配送订单:', response);

    return response;
  }

  /**
   * 查询配送状态
   */
  static async getDeliveryStatus(deliveryId: string): Promise<YandexDeliveryResponse> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 模拟配送状态变化
    const statuses: YandexDeliveryResponse['status'][] = [
      'accepted',
      'performer_lookup',
      'performer_found',
      'pickup_arrived',
      'pickuped',
      'delivery_arrived',
      'delivered',
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // 模拟配送员信息
    const courierNames = ['Иван', 'Дмитрий', 'Алексей', 'Сергей'];
    const carModels = ['Toyota Camry', 'Hyundai Solaris', 'Kia Rio', 'Volkswagen Polo'];

    const response: YandexDeliveryResponse = {
      id: deliveryId,
      status: randomStatus,
      created_ts: new Date(Date.now() - 3600000).toISOString(),
      updated_ts: new Date().toISOString(),
      pricing: {
        currency: 'RUB',
        final_price: '250',
      },
      performer_info: {
        courier_name: courierNames[Math.floor(Math.random() * courierNames.length)],
        legal_name: 'Yandex.Taxi',
        car_model: carModels[Math.floor(Math.random() * carModels.length)],
        car_number: `А${Math.floor(100 + Math.random() * 900)}ВС77`,
      },
      route_points: [
        {
          type: 'source',
          visit_status: randomStatus === 'delivered' ? 'visited' : 'pending',
          coordinates: [37.6173, 55.7558],
        },
        {
          type: 'destination',
          visit_status: randomStatus === 'delivered' ? 'visited' : 'pending',
          coordinates: [37.6200, 55.7600],
        },
      ],
    };

    console.log('[Yandex.Delivery Mock] 查询配送状态:', response);

    return response;
  }

  /**
   * 取消配送订单
   */
  static async cancelDelivery(deliveryId: string): Promise<{
    id: string;
    status: 'cancelled';
    cancel_state: 'free' | 'paid';
  }> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = {
      id: deliveryId,
      status: 'cancelled' as const,
      cancel_state: 'free' as const,
    };

    console.log('[Yandex.Delivery Mock] 取消配送订单:', response);

    return response;
  }

  /**
   * 计算配送费用
   */
  static async estimateDelivery(request: YandexDeliveryRequest): Promise<{
    currency: 'RUB';
    price: string;
    distance_meters: number;
    duration_seconds: number;
  }> {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 模拟距离和时间计算
    const distance = Math.floor(1000 + Math.random() * 5000); // 1-6km
    const duration = Math.floor(600 + Math.random() * 1200); // 10-30分钟

    // 模拟费用计算
    const basePrice = 150;
    const distancePrice = Math.floor((distance / 1000) * 30); // 每公里30卢布
    const finalPrice = basePrice + distancePrice;

    const response = {
      currency: 'RUB' as const,
      price: finalPrice.toString(),
      distance_meters: distance,
      duration_seconds: duration,
    };

    console.log('[Yandex.Delivery Mock] 计算配送费用:', response);

    return response;
  }
}

// 真实 Yandex.Delivery API 集成示例（当拿到测试账号后使用）
/*
import axios from 'axios';

const YANDEX_DELIVERY_API_BASE = 'https://b2b.taxi.yandex.net/b2b/cargo/integration/v2';

export class YandexDeliveryService {
  private static async getHeaders() {
    return {
      'Authorization': `Bearer ${process.env.YANDEX_DELIVERY_API_KEY!}`,
      'Content-Type': 'application/json',
      'Accept-Language': 'ru',
    };
  }

  // 创建配送订单
  static async createDelivery(request: YandexDeliveryRequest) {
    const headers = await this.getHeaders();

    const response = await axios.post(
      `${YANDEX_DELIVERY_API_BASE}/claims/create`,
      request,
      { headers }
    );

    return response.data;
  }

  // 查询配送状态
  static async getDeliveryStatus(deliveryId: string) {
    const headers = await this.getHeaders();

    const response = await axios.post(
      `${YANDEX_DELIVERY_API_BASE}/claims/info`,
      { claim_id: deliveryId },
      { headers }
    );

    return response.data;
  }

  // 取消配送订单
  static async cancelDelivery(deliveryId: string) {
    const headers = await this.getHeaders();

    const response = await axios.post(
      `${YANDEX_DELIVERY_API_BASE}/claims/cancel`,
      {
        claim_id: deliveryId,
        cancel_state: 'free',
      },
      { headers }
    );

    return response.data;
  }

  // 计算配送费用
  static async estimateDelivery(request: YandexDeliveryRequest) {
    const headers = await this.getHeaders();

    const response = await axios.post(
      `${YANDEX_DELIVERY_API_BASE}/check-price`,
      request,
      { headers }
    );

    return response.data;
  }
}
*/
