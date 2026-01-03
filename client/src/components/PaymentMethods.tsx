import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Check, CreditCard, Wallet, Coins, Zap, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethodsProps {
  orderAmount: number;
  onMethodSelect?: (method: any) => void;
}

export default function PaymentMethods({ orderAmount, onMethodSelect }: PaymentMethodsProps) {
  const { t, i18n } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  
  // 获取可用的支付方式
  const { data: paymentMethods, isLoading } = trpc.config.listConfigs.useQuery({
    category: 'payment_method',
    isEnabled: true,
  });

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
      'credit-card': CreditCard,
      'wallet': Wallet,
      'coins': Coins,
      'zap': Zap,
      'calendar': Calendar,
    };
    
    const IconComponent = iconMap[iconString] || CreditCard;
    return <IconComponent className="w-6 h-6" />;
  };

  const isMethodAvailable = (method: any) => {
    const config = method.config || {};
    
    // 检查最小金额
    if (config.minAmount && orderAmount < config.minAmount) {
      return false;
    }
    
    // 检查最大金额
    if (config.maxAmount && orderAmount > config.maxAmount) {
      return false;
    }
    
    // 检查其他限制条件
    // TODO: 根据用户等级、订单数量等进行更多检查
    
    return true;
  };

  const handleMethodSelect = (method: any) => {
    setSelectedMethod(method);
    onMethodSelect?.(method);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка способов оплаты...</div>;
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Нет доступных способов оплаты
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Способ оплаты</h3>
      
      <div className="grid gap-3">
        {paymentMethods.map((method) => {
          const isAvailable = isMethodAvailable(method);
          const isSelected = selectedMethod?.id === method.id;
          const config = method.config || {};

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
                      {config.instantConfirmation && (
                        <Badge variant="secondary" className="text-xs">
                          Мгновенно
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
                    
                    {/* 显示限制信息 */}
                    {!isAvailable && (
                      <p className="text-xs text-red-500 mt-1">
                        {config.minAmount && orderAmount < config.minAmount &&
                          `Минимальная сумма: ${config.minAmount}₽`}
                        {config.maxAmount && orderAmount > config.maxAmount &&
                          `Максимальная сумма: ${config.maxAmount}₽`}
                      </p>
                    )}
                  </div>

                  {/* 选中标记 */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 支付方式说明 */}
      {selectedMethod && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-800">
                {selectedMethod.config?.instantConfirmation ? (
                  <p>Оплата будет подтверждена мгновенно после завершения транзакции.</p>
                ) : (
                  <p>Оплата будет подтверждена в течение нескольких минут.</p>
                )}
                {selectedMethod.config?.refundable && (
                  <p className="mt-1">
                    Возврат средств возможен в течение {selectedMethod.config.refundPeriodDays} дней.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
