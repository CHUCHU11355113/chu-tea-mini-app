import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRoute } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft,
  MapPin,
  Phone,
  Navigation,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrderTrackingNew() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [, params] = useRoute('/order/:id/track');

  // 模拟配送员信息
  const delivery = {
    driverName: 'Иван',
    driverPhone: '+7 (999) 888-77-66',
    driverAvatar: '',
    vehicleNumber: 'А123БВ',
    estimatedTime: '15 минут',
    currentLocation: {
      lat: 55.7558,
      lng: 37.6173,
    },
    destinationLocation: {
      lat: 55.7522,
      lng: 37.6156,
    },
  };

  // 模拟配送进度
  const trackingSteps = [
    {
      time: '14:30',
      label: 'Заказ создан',
      description: 'Ваш заказ успешно создан',
      completed: true,
    },
    {
      time: '14:35',
      label: 'Заказ подтверждён',
      description: 'Магазин подтвердил ваш заказ',
      completed: true,
    },
    {
      time: '14:45',
      label: 'Готовится',
      description: 'Ваш заказ готовится',
      completed: true,
    },
    {
      time: '15:00',
      label: 'Курьер забрал заказ',
      description: 'Курьер направляется к вам',
      completed: true,
    },
    {
      time: '15:30',
      label: 'Доставлен',
      description: 'Заказ будет доставлен',
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(`/order/${params?.id}`)}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Отслеживание заказа
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 地图区域（模拟） */}
      <div className="relative h-80 bg-gradient-to-br from-blue-100 to-green-100">
        {/* TODO: 集成真实地图 API (Yandex Maps) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600">
              Карта доставки
            </p>
          </div>
        </div>

        {/* 预计送达时间浮窗 */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <Card className="px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-gray-900">
                Прибытие через {delivery.estimatedTime}
              </span>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* 配送员信息卡片 */}
        <Card className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl text-white">
              {delivery.driverAvatar || '👤'}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {delivery.driverName}
              </h3>
              <p className="text-sm text-gray-600">
                Курьер · {delivery.vehicleNumber}
              </p>
            </div>
            <a
              href={`tel:${delivery.driverPhone}`}
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 flex items-center justify-center transition-colors"
            >
              <Phone className="w-6 h-6 text-white" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="text-xs text-gray-600 mb-1">
                Прибытие через
              </div>
              <div className="text-lg font-bold text-gray-900">
                {delivery.estimatedTime}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <div className="text-xs text-gray-600 mb-1">
                Расстояние
              </div>
              <div className="text-lg font-bold text-gray-900">
                2.3 км
              </div>
            </div>
          </div>
        </Card>

        {/* 配送进度 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-blue-500" />
            Статус доставки
          </h3>

          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    step.completed 
                      ? "bg-blue-500 border-blue-500" 
                      : "bg-white border-gray-300"
                  )}>
                    {step.completed && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={cn(
                      "w-0.5 h-12",
                      step.completed ? "bg-blue-500" : "bg-gray-300"
                    )} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className={cn(
                      "font-medium",
                      step.completed ? "text-gray-900" : "text-gray-400"
                    )}>
                      {step.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 配送地址 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Адрес доставки
          </h3>
          <p className="text-gray-700">
            ул. Пушкина, д. 10, кв. 25
          </p>
        </Card>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-xl"
            onClick={() => {
              // TODO: 联系客服逻辑
            }}
          >
            Связаться с поддержкой
          </Button>
          <Button
            className="flex-1 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            onClick={() => {
              // TODO: 打开地图导航
            }}
          >
            <Navigation className="w-5 h-5 mr-2" />
            Навигация
          </Button>
        </div>
      </div>
    </div>
  );
}
