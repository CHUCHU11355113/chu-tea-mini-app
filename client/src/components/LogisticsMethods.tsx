import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Check, Bike, Car, Package, Store, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogisticsMethodsProps {
  storeId?: number;
  orderAmount: number;
  deliveryAddress?: {
    latitude: number;
    longitude: number;
  };
  onMethodSelect?: (method: any) => void;
}

export default function LogisticsMethods({
  storeId,
  orderAmount,
  deliveryAddress,
  onMethodSelect,
}: LogisticsMethodsProps) {
  const { t, i18n } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [deliveryFees, setDeliveryFees] = useState<Record<number, number>>({});
  
  // 获取可用的物流方式
  const { data: logisticsMethods, isLoading } = trpc.config.listConfigs.useQuery({
    category: 'logistics_method',
    isEnabled: true,
  });

  useEffect(() => {
    // 计算每种物流方式的配送费
    if (logisticsMethods && deliveryAddress) {
      const fees: Record<number, number> = {};
      
      logisticsMethods.forEach((method) => {
        const fee = calculateDeliveryFee(method, deliveryAddress);
        fees[method.id] = fee;
      });
      
      setDeliveryFees(fees);
    }
  }, [logisticsMethods, deliveryAddress]);

  const getLocalizedName = (method: any) => {
    const lang = i18n.language;
    if (lang === 'ru') return method.nameRu;
    if (lang === 'en') return method.nameEn;
    return method.nameZh || method.nameRu;
  };

  const getLocalizedDescription = (method: any) => {
    const lang = i18n.language;
    if (lang === 'ru') return method.descriptionRu;
    if (lang === 'en') return method.descriptionEn;
    return method.descriptionZh || method.descriptionRu;
  };

  const getMethodIcon = (iconString: string) => {
    // 如果是emoji，直接返回
    if (iconString && iconString.length <= 2) {
      return <span className="text-2xl">{iconString}</span>;
    }
    
    // 如果是图标名称，返回对应的Lucide图标
    const iconMap: Record<string, any> = {
      'bike': Bike,
      'car': Car,
      'package': Package,
      'store': Store,
      'calendar': Calendar,
    };
    
    const IconComponent = iconMap[iconString] || Package;
    return <IconComponent className="w-6 h-6" />;
  };

  const calculateDeliveryFee = (method: any, address: any): number => {
    const config = method.config || {};
    const feeCalc = config.feeCalculation || {};

    // 如果是固定费用
    if (feeCalc.type === 'fixed') {
      const fee = feeCalc.fee || 0;
      // 检查是否满足免配送费条件
      if (feeCalc.freeThreshold && orderAmount >= feeCalc.freeThreshold) {
        return 0;
      }
      return fee;
    }

    // 如果是分层费用
    if (feeCalc.type === 'tiered' && feeCalc.tiers) {
      // TODO: 计算实际距离
      const distance = 2000; // 示例距离
      
      for (const tier of feeCalc.tiers) {
        if (distance <= tier.maxDistance) {
          // 检查是否满足免配送费条件
          if (feeCalc.freeThreshold && orderAmount >= feeCalc.freeThreshold) {
            return 0;
          }
          return tier.fee;
        }
      }
    }

    // 如果是API计算
    if (feeCalc.type === 'api') {
      // TODO: 调用API计算费用
      return 0;
    }

    return 0;
  };

  const isMethodAvailable = (method: any) => {
    const config = method.config || {};
    const restrictions = config.restrictions || {};
    
    // 检查最小订单金额
    if (restrictions.minOrderAmount && orderAmount < restrictions.minOrderAmount) {
      return false;
    }
    
    // 检查配送范围
    if (config.coverageType === 'radius' && deliveryAddress) {
      // TODO: 检查是否在配送范围内
    }
    
    // 检查营业时间
    if (config.workingHours) {
      // TODO: 检查当前时间是否在营业时间内
    }
    
    return true;
  };

  const formatEstimatedTime = (estimatedTime: any) => {
    if (!estimatedTime) return '';
    
    const { min, max, unit } = estimatedTime;
    
    if (unit === 'minutes') {
      return `${min}-${max} минут`;
    } else if (unit === 'hours') {
      return `${min}-${max} часов`;
    } else if (unit === 'days') {
      return `${min}-${max} дней`;
    }
    
    return '';
  };

  const handleMethodSelect = (method: any) => {
    setSelectedMethod(method);
    onMethodSelect?.({
      ...method,
      deliveryFee: deliveryFees[method.id] || 0,
    });
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка способов доставки...</div>;
  }

  if (!logisticsMethods || logisticsMethods.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Нет доступных способов доставки
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Способ доставки</h3>
      
      <div className="grid gap-3">
        {logisticsMethods.map((method) => {
          const isAvailable = isMethodAvailable(method);
          const isSelected = selectedMethod?.id === method.id;
          const config = method.config || {};
          const deliveryFee = deliveryFees[method.id] || 0;

          return (
            <Card
              key={method.id}
              className={cn(
                'cursor-pointer transition-all',
                isSelected && 'ring-2 ring-primary',
                !isAvailable && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => isAvailable && handleMethodSelect(method)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* 图标 */}
                  <div className="flex-shrink-0">
                    {getMethodIcon(config.icon)}
                  </div>

                  {/* 信息 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{getLocalizedName(method)}</span>
                      {deliveryFee === 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Бесплатно
                        </Badge>
                      )}
                      {!isAvailable && (
                        <Badge variant="destructive" className="text-xs">
                          Недоступно
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {getLocalizedDescription(method)}
                    </p>
                    
                    {/* 预计时间 */}
                    {config.estimatedTime && (
                      <p className="text-xs text-gray-600 mt-1">
                        ⏱️ {formatEstimatedTime(config.estimatedTime)}
                      </p>
                    )}
                  </div>

                  {/* 费用 */}
                  <div className="flex-shrink-0 text-right">
                    {deliveryFee > 0 ? (
                      <div className="text-lg font-semibold">{deliveryFee}₽</div>
                    ) : (
                      <div className="text-sm text-green-600 font-medium">Бесплатно</div>
                    )}
                    
                    {/* 选中标记 */}
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center mt-2 ml-auto">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 配送说明 */}
      {selectedMethod && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-800">
                {selectedMethod.config?.tracking?.enabled && (
                  <p>Вы сможете отслеживать доставку в реальном времени.</p>
                )}
                {selectedMethod.config?.tracking?.smsNotification && (
                  <p className="mt-1">Вы получите SMS-уведомление о статусе доставки.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
