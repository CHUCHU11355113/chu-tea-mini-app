import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTelegramContext } from '@/contexts/TelegramContext';
import { 
  Search,
  Filter,
  ShoppingCart,
  Star,
  TrendingUp,
  X
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

export default function Menu() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const { isTelegram } = useTelegramContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  // 获取产品分类配置
  const { data: productCategories } = trpc.config.listConfigs.useQuery({
    category: 'product_category',
    isEnabled: true,
  });

  // 获取产品列表（实际应该从products表获取）
  // 这里暂时用配置系统的示例
  const [products, setProducts] = useState([
    {
      id: 1,
      nameRu: 'Молочный чай с жемчугом',
      nameEn: 'Pearl Milk Tea',
      nameZh: '珍珠奶茶',
      descriptionRu: 'Классический молочный чай с жемчужинами тапиоки',
      descriptionEn: 'Classic milk tea with tapioca pearls',
      descriptionZh: '经典珍珠奶茶',
      price: 350,
      image: '/products/pearl-milk-tea.png',
      category: 'milk_tea',
      tags: ['hot', 'popular'],
      rating: 4.8,
      soldCount: 1250,
    },
    {
      id: 2,
      nameRu: 'Фруктовый чай с манго',
      nameEn: 'Mango Fruit Tea',
      nameZh: '芒果水果茶',
      descriptionRu: 'Освежающий фруктовый чай с кусочками манго',
      descriptionEn: 'Refreshing fruit tea with mango chunks',
      descriptionZh: '清爽芒果水果茶',
      price: 380,
      image: '/products/mango-fruit-tea.png',
      category: 'fruit_tea',
      tags: ['cold', 'new'],
      rating: 4.9,
      soldCount: 980,
    },
    {
      id: 3,
      nameRu: 'Матча латте',
      nameEn: 'Matcha Latte',
      nameZh: '抹茶拿铁',
      descriptionRu: 'Нежный матча латте с молочной пенкой',
      descriptionEn: 'Smooth matcha latte with milk foam',
      descriptionZh: '顺滑抹茶拿铁',
      price: 420,
      image: '/products/matcha-latte.png',
      category: 'special',
      tags: ['hot', 'premium'],
      rating: 4.7,
      soldCount: 750,
    },
  ]);

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

  const filteredProducts = products.filter(product => {
    // 分类筛选
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // 搜索筛选
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = getLocalizedName(product).toLowerCase();
      const desc = getLocalizedDescription(product).toLowerCase();
      return name.includes(query) || desc.includes(query);
    }
    
    return true;
  });

  const categories = [
    { id: 'milk_tea', nameRu: 'Молочный чай', icon: '🥛' },
    { id: 'fruit_tea', nameRu: 'Фруктовый чай', icon: '🍓' },
    { id: 'special', nameRu: 'Специальные', icon: '⭐' },
    { id: 'dessert', nameRu: 'Десерты', icon: '🍰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部搜索栏 - Apple风格 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск напитков..."
                className="pl-10 pr-10 h-11 rounded-full bg-gray-100 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 购物车图标 */}
            <button
              onClick={() => navigate('/cart')}
              className="relative w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartItemCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 分类标签 - Apple风格的横向滚动 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                !selectedCategory
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Все
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                  selectedCategory === category.id
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <span>{category.icon}</span>
                <span>{category.nameRu}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 产品列表 - Apple风格的网格 */}
      <div className="max-w-2xl mx-auto px-6 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">
              Ничего не найдено
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* 产品图片 */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative">
                  {/* TODO: 实际图片 */}
                  <div className="absolute inset-0 flex items-center justify-center text-6xl">
                    🥤
                  </div>
                  
                  {/* 标签 */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.tags.includes('new') && (
                      <Badge className="bg-green-500 text-white text-xs">
                        Новинка
                      </Badge>
                    )}
                    {product.tags.includes('popular') && (
                      <Badge className="bg-orange-500 text-white text-xs">
                        Популярно
                      </Badge>
                    )}
                  </div>

                  {/* 评分 */}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">{product.rating}</span>
                  </div>
                </div>

                {/* 产品信息 */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {getLocalizedName(product)}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {getLocalizedDescription(product)}
                  </p>
                  
                  {/* 价格和销量 */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {product.price}₽
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {product.soldCount}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
