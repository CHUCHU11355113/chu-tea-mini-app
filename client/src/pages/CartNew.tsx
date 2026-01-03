import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  options: Array<{
    name: string;
    value: string;
    extraPrice: number;
  }>;
  selected: boolean;
}

export default function Cart() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      productId: 1,
      name: 'Молочный чай с жемчугом',
      image: '',
      price: 350,
      quantity: 2,
      options: [
        { name: 'Сахар', value: 'Нормальный', extraPrice: 0 },
        { name: 'Лёд', value: 'Много', extraPrice: 0 },
        { name: 'Жемчуг', value: 'Стандартный', extraPrice: 20 },
      ],
      selected: true,
    },
    {
      id: 2,
      productId: 2,
      name: 'Фруктовый чай с манго',
      image: '',
      price: 380,
      quantity: 1,
      options: [
        { name: 'Сахар', value: 'Меньше', extraPrice: 0 },
        { name: 'Лёд', value: 'Нормальный', extraPrice: 0 },
      ],
      selected: true,
    },
  ]);

  const [selectAll, setSelectAll] = useState(true);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setCartItems(items => items.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setCartItems(items => items.map(item => 
      item.id === id ? { ...item, selected: checked } : item
    ));
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateItemTotal = (item: CartItem) => {
    const optionsPrice = item.options.reduce((sum, opt) => sum + opt.extraPrice, 0);
    return (item.price + optionsPrice) * item.quantity;
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const totalAmount = selectedItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 顶部导航栏 - Apple风格 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/menu')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Корзина
          </h1>
          <div className="w-10" /> {/* 占位，保持标题居中 */}
        </div>
      </div>

      {cartItems.length === 0 ? (
        /* 空购物车状态 */
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-8xl mb-4">🛒</div>
          <p className="text-gray-500 mb-6">
            Ваша корзина пуста
          </p>
          <Button
            onClick={() => navigate('/menu')}
            className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Начать покупки
          </Button>
        </div>
      ) : (
        <>
          {/* 全选栏 */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-2xl mx-auto px-6 py-3 flex items-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium text-gray-900">
                  Выбрать все ({cartItems.length})
                </span>
              </label>
            </div>
          </div>

          {/* 购物车商品列表 */}
          <div className="max-w-2xl mx-auto px-6 py-4 space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* 复选框 */}
                    <div className="flex-shrink-0 pt-1">
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </div>

                    {/* 商品图片 */}
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                      <div className="text-4xl">🥤</div>
                    </div>

                    {/* 商品信息 */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      
                      {/* 选项 */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.options.map((option, index) => (
                          <span key={index} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            {option.value}
                            {option.extraPrice > 0 && ` +${option.extraPrice}₽`}
                          </span>
                        ))}
                      </div>

                      {/* 价格和数量 */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {calculateItemTotal(item)}₽
                        </span>

                        {/* 数量控制 */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-50 active:bg-red-100 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* 底部结算栏 - Apple风格 */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
          <div className="max-w-2xl mx-auto px-6 py-4">
            {/* 合计信息 */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">
                Выбрано ({selectedItems.length})
              </span>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">
                  Итого
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalAmount}₽
                </div>
              </div>
            </div>

            {/* 结算按钮 */}
            <Button
              onClick={() => navigate('/checkout')}
              disabled={selectedItems.length === 0}
              size="lg"
              className="w-full h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              Оформить заказ
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
