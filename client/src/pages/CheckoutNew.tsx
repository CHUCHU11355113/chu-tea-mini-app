import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft,
  ChevronRight,
  MapPin,
  User,
  Phone,
  MessageSquare
} from 'lucide-react';
import PaymentMethods from '@/components/PaymentMethods';
import LogisticsMethods from '@/components/LogisticsMethods';

export default function Checkout() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [selectedLogisticsMethod, setSelectedLogisticsMethod] = useState<any>(null);

  // 模拟订单数据
  const orderItems = [
    {
      id: 1,
      name: 'Молочный чай с жемчугом',
      quantity: 2,
      price: 350,
      options: [
        { name: 'Сахар', value: 'Нормальный' },
        { name: 'Жемчуг', value: 'Стандартный', extraPrice: 20 },
      ],
    },
  ];

  const subtotal = orderItems.reduce((sum, item) => {
    const optionsPrice = item.options.reduce((s, opt) => s + (opt.extraPrice || 0), 0);
    return sum + (item.price + optionsPrice) * item.quantity;
  }, 0);

  const deliveryFee = selectedLogisticsMethod?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

  const handleSubmitOrder = () => {
    // TODO: 提交订单逻辑
    console.log('Submit order:', {
      contactInfo,
      paymentMethod: selectedPaymentMethod,
      logisticsMethod: selectedLogisticsMethod,
      items: orderItems,
      total,
    });
    
    // 跳转到支付页面或订单详情
    navigate('/payment');
  };

  const isFormValid = contactInfo.name && contactInfo.phone && selectedPaymentMethod && selectedLogisticsMethod;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 顶部导航栏 - Apple风格 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/cart')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Оформление заказа
          </h1>
          <div className="w-10" /> {/* 占位，保持标题居中 */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* 联系信息 */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Контактная информация
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Имя
              </label>
              <Input
                value={contactInfo.name}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                placeholder="Введите ваше имя"
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Телефон
              </label>
              <Input
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="+7 (___) ___-__-__"
                className="h-11 rounded-xl"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Адрес доставки
              </label>
              <Textarea
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                placeholder="Введите адрес доставки"
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4" />
                Примечание (необязательно)
              </label>
              <Textarea
                value={contactInfo.note}
                onChange={(e) => setContactInfo({ ...contactInfo, note: e.target.value })}
                placeholder="Дополнительная информация"
                className="rounded-xl resize-none"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* 物流方式选择 */}
        <Card className="p-4">
          <LogisticsMethods
            orderAmount={subtotal}
            onMethodSelect={setSelectedLogisticsMethod}
          />
        </Card>

        {/* 支付方式选择 */}
        <Card className="p-4">
          <PaymentMethods
            orderAmount={total}
            onMethodSelect={setSelectedPaymentMethod}
          />
        </Card>

        {/* 订单商品 */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Товары в заказе
            </h3>
            <button
              onClick={() => navigate('/cart')}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Изменить
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {orderItems.map((item) => {
              const optionsPrice = item.options.reduce((s, opt) => s + (opt.extraPrice || 0), 0);
              const itemTotal = (item.price + optionsPrice) * item.quantity;
              
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                    <div className="text-3xl">🥤</div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {item.name}
                    </h4>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {item.options.map((option, index) => (
                        <span key={index} className="text-xs text-gray-600">
                          {option.value}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        x{item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {itemTotal}₽
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 费用明细 */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Детали оплаты
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-gray-700">
              <span>Товары</span>
              <span>{subtotal}₽</span>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>Доставка</span>
              <span>{deliveryFee > 0 ? `${deliveryFee}₽` : 'Бесплатно'}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Итого
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {total}₽
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* 底部提交按钮 - Apple风格 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Button
            onClick={handleSubmitOrder}
            disabled={!isFormValid}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            Оплатить {total}₽
          </Button>
        </div>
      </div>
    </div>
  );
}
