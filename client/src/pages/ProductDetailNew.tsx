import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRoute } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft,
  Star,
  TrendingUp,
  Plus,
  Minus,
  ShoppingCart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ProductOptions from '@/components/ProductOptions';

export default function ProductDetailNew() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const [, params] = useRoute('/product/:id');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>({});
  const [totalPrice, setTotalPrice] = useState(0);

  // 模拟产品数据（实际应从API获取）
  const product = {
    id: parseInt(params?.id || '1'),
    nameRu: 'Молочный чай с жемчугом',
    nameEn: 'Pearl Milk Tea',
    nameZh: '珍珠奶茶',
    descriptionRu: 'Классический молочный чай с жемчужинами тапиоки. Идеальное сочетание нежного молока и ароматного чая.',
    descriptionEn: 'Classic milk tea with tapioca pearls. Perfect combination of smooth milk and aromatic tea.',
    descriptionZh: '经典珍珠奶茶。顺滑牛奶与香浓茶香的完美结合。',
    basePrice: 350,
    image: '/products/pearl-milk-tea.png',
    category: 'milk_tea',
    tags: ['hot', 'popular'],
    rating: 4.8,
    reviewCount: 328,
    soldCount: 1250,
    ingredients: ['Черный чай', 'Молоко', 'Жемчуг тапиоки', 'Сахар'],
  };

  const getLocalizedName = (item: any) => {
    const lang = i18n.language;
    if (lang === 'ru') return item.nameRu;
    if (lang === 'en') return item.nameEn;
    return item.nameZh || item.nameRu;
  };

  const getLocalizedDescription = (item: any) => {
    const lang = i18n.language;
    if (lang === 'ru') return item.descriptionRu;
    if (lang === 'en') return item.descriptionEn;
    return item.descriptionZh || item.descriptionRu;
  };

  // 计算总价
  useEffect(() => {
    let price = product.basePrice;
    
    // 加上选项的额外费用
    Object.values(selectedOptions).forEach((option: any) => {
      if (option && option.extraPrice) {
        price += option.extraPrice;
      }
    });
    
    setTotalPrice(price * quantity);
  }, [selectedOptions, quantity, product.basePrice]);

  const handleAddToCart = () => {
    // TODO: 添加到购物车逻辑
    console.log('Add to cart:', {
      product,
      quantity,
      selectedOptions,
      totalPrice,
    });
    
    // 显示成功提示
    alert('Добавлено в корзину!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            Детали продукта
          </h1>
          <div className="w-10" /> {/* 占位，保持标题居中 */}
        </div>
      </div>

      {/* 产品图片 - Apple风格的大图 */}
      <div className="bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
            {/* TODO: 实际图片 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl">🥤</div>
            </div>
            
            {/* 标签 */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.tags.includes('new') && (
                <Badge className="bg-green-500 text-white">
                  Новинка
                </Badge>
              )}
              {product.tags.includes('popular') && (
                <Badge className="bg-orange-500 text-white">
                  Популярно
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 产品信息 */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* 标题和评分 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getLocalizedName(product)}
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{product.rating}</span>
              <span className="text-gray-500">({product.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Продано {product.soldCount}</span>
            </div>
          </div>
        </div>

        {/* 描述 */}
        <Card className="p-4">
          <p className="text-gray-700 leading-relaxed">
            {getLocalizedDescription(product)}
          </p>
        </Card>

        {/* 成分 */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Состав
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="secondary">
                {ingredient}
              </Badge>
            ))}
          </div>
        </Card>

        {/* 产品选项 - 从配置系统动态渲染 */}
        <ProductOptions
          productId={product.id}
          onOptionsChange={setSelectedOptions}
        />

        {/* 数量选择 */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-900">
              Количество
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* 底部操作栏 - Apple风格 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">
                Итого
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {totalPrice}₽
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1 h-14 text-lg font-semibold rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              В корзину
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
