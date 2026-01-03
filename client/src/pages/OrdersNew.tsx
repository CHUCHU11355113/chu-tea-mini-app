import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/BottomNav';

interface Order {
  id: number;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    options: string[];
  }>;
  totalAmount: number;
  createdAt: string;
  deliveryMethod: string;
  pickupCode?: string;
}

export default function OrdersNew() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  
  const [activeTab, setActiveTab] = useState<string>('all');

  // 模拟订单数据
  const orders: Order[] = [
    {
      id: 1,
      orderNumber: 'CHU20260103001',
      status: 'delivering',
      items: [
        {
          id: 1,
          name: 'Молочный чай с жемчугом',
          quantity: 2,
          price: 350,
          options: ['Нормальный сахар', 'Много льда'],
        },
      ],
      totalAmount: 700,
      createdAt: '2026-01-03 14:30',
      deliveryMethod: 'Доставка',
    },
    {
      id: 2,
      orderNumber: 'CHU20260102002',
      status: 'completed',
      items: [
        {
          id: 2,
          name: 'Фруктовый чай с манго',
          quantity: 1,
          price: 380,
          options: ['Меньше сахара'],
        },
        {
          id: 3,
          name: 'Матча латте',
          quantity: 1,
          price: 420,
          options: ['Горячий'],
        },
      ],
      totalAmount: 800,
      createdAt: '2026-01-02 16:45',
      deliveryMethod: 'Самовывоз',
      pickupCode: '8426',
    },
    {
      id: 3,
      orderNumber: 'CHU20260101003',
      status: 'cancelled',
      items: [
        {
          id: 1,
          name: 'Молочный чай с жемчугом',
          quantity: 1,
          price: 350,
          options: [],
        },
      ],
      totalAmount: 350,
      createdAt: '2026-01-01 10:20',
      deliveryMethod: 'Доставка',
    },
  ];

  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Ожидание',
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case 'confirmed':
        return {
          label: 'Подтверждён',
          icon: CheckCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case 'preparing':
        return {
          label: 'Готовится',
          icon: Package,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
        };
      case 'delivering':
        return {
          label: 'В пути',
          icon: Truck,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        };
      case 'completed':
        return {
          label: 'Завершён',
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'cancelled':
        return {
          label: 'Отменён',
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Мои заказы
          </h1>
          <div className="w-10" />
        </div>

        {/* 标签页 */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 h-10">
              <TabsTrigger value="all" className="text-sm">
                Все
              </TabsTrigger>
              <TabsTrigger value="delivering" className="text-sm">
                В пути
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-sm">
                Завершён
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-sm">
                Отменён
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 订单列表 */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-8xl mb-4">📦</div>
            <p className="text-gray-500 mb-6">
              Нет заказов
            </p>
            <Button
              onClick={() => navigate('/menu')}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              Начать покупки
            </Button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card
                key={order.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                {/* 订单头部 */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </span>
                    <Badge className={cn(statusConfig.bgColor, statusConfig.color, "border", statusConfig.borderColor)}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.createdAt}
                  </div>
                </div>

                {/* 订单商品 */}
                <div className="p-4 space-y-3">
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
                          <div className="flex flex-wrap gap-1 mb-1">
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

                {/* 订单底部 */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">
                      {order.deliveryMethod}
                      {order.pickupCode && (
                        <span className="ml-2 font-mono font-bold text-gray-900">
                          #{order.pickupCode}
                        </span>
                      )}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 mb-1">
                        Итого
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {order.totalAmount}₽
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    {order.status === 'delivering' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/order/${order.id}/track`);
                        }}
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Отследить
                      </Button>
                    )}
                    {order.status === 'completed' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/order/${order.id}/review`);
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Отзыв
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: 再来一单逻辑
                          }}
                        >
                          Повторить
                        </Button>
                      </>
                    )}
                    {order.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-lg text-red-600 border-red-200 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: 取消订单逻辑
                        }}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Отменить
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
