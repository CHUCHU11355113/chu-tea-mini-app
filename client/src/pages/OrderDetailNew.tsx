import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRoute } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  Package,
  CheckCircle,
  Truck,
  Copy,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderDetailNew() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [, params] = useRoute('/order/:id');

  // 模拟订单详情数据
  const order = {
    id: parseInt(params?.id || '1'),
    orderNumber: 'CHU20260103001',
    status: 'delivering',
    statusText: 'В пути',
    items: [
      {
        id: 1,
        name: 'Молочный чай с жемчугом',
        quantity: 2,
        price: 350,
        options: ['Нормальный сахар', 'Много льда', 'Жемчуг стандартный'],
      },
    ],
    subtotal: 700,
    deliveryFee: 100,
    discount: 50,
    totalAmount: 750,
    createdAt: '2026-01-03 14:30',
    deliveryMethod: 'Доставка',
    deliveryAddress: 'ул. Пушкина, д. 10, кв. 25',
    contactName: 'Александр',
    contactPhone: '+7 (999) 123-45-67',
    note: 'Позвоните за 5 минут',
    pickupCode: '',
    timeline: [
      { time: '14:30', label: 'Заказ создан', completed: true },
      { time: '14:35', label: 'Заказ подтверждён', completed: true },
      { time: '14:40', label: 'Готовится', completed: true },
      { time: '15:00', label: 'В пути', completed: true },
      { time: '15:30', label: 'Доставлен', completed: false },
    ],
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Скопировано!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/orders')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Детали заказа
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* 订单状态卡片 */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {order.statusText}
              </h2>
              <p className="text-sm text-gray-600">
                Ожидаемое время доставки: 15:30
              </p>
            </div>
          </div>

          {/* 时间线 */}
          <div className="space-y-3">
            {order.timeline.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    step.completed ? "bg-orange-500" : "bg-gray-300"
                  )} />
                  {index < order.timeline.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-8",
                      step.completed ? "bg-orange-500" : "bg-gray-300"
                    )} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className={cn(
                    "font-medium",
                    step.completed ? "text-gray-900" : "text-gray-400"
                  )}>
                    {step.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 订单号 */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Номер заказа
              </div>
              <div className="font-mono font-semibold text-gray-900">
                {order.orderNumber}
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(order.orderNumber)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </Card>

        {/* 配送信息 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Информация о доставке
          </h3>

          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">
                Адрес
              </div>
              <div className="font-medium text-gray-900">
                {order.deliveryAddress}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Получатель
                </div>
                <div className="font-medium text-gray-900">
                  {order.contactName}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Телефон
                </div>
                <div className="font-medium text-gray-900">
                  {order.contactPhone}
                </div>
              </div>
            </div>

            {order.note && (
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Примечание
                </div>
                <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {order.note}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 订单商品 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Товары
          </h3>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                  <div className="text-3xl">🥤</div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {item.name}
                  </h4>
                  {item.options.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.options.map((option, index) => (
                        <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                          {option}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      x{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {item.price * item.quantity}₽
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 费用明细 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            Детали оплаты
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-700">
              <span>Товары</span>
              <span>{order.subtotal}₽</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>Доставка</span>
              <span>{order.deliveryFee}₽</span>
            </div>
            {order.discount > 0 && (
              <div className="flex items-center justify-between text-green-600">
                <span>Скидка</span>
                <span>-{order.discount}₽</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Итого
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {order.totalAmount}₽
              </span>
            </div>
          </div>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-xl"
            onClick={() => navigate(`/help/order/${order.id}`)}
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Связаться
          </Button>
          <Button
            className="flex-1 h-14 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            onClick={() => navigate(`/order/${order.id}/track`)}
          >
            <Truck className="w-5 h-5 mr-2" />
            Отследить
          </Button>
        </div>
      </div>
    </div>
  );
}
