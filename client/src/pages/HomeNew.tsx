import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTelegramContext } from '@/contexts/TelegramContext';
import { 
  Coffee, 
  ShoppingBag, 
  Gift,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Star
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();
  const { isTelegram, setHeaderColor, setBackgroundColor } = useTelegramContext();

  // 从配置系统获取首页入口配置
  const { data: homeEntries } = trpc.config.listConfigs.useQuery({
    category: 'home_entry',
    isEnabled: true,
  });

  // 获取当前营销活动
  const { data: activeMarketingRules } = trpc.rules.listRules.useQuery({
    ruleType: 'marketing',
    isEnabled: true,
  });

  // 获取会员等级信息
  const { data: memberLevels } = trpc.config.listConfigs.useQuery({
    category: 'member_level',
    isEnabled: true,
  });

  // 设置 Telegram 主题
  useEffect(() => {
    if (isTelegram) {
      setHeaderColor('#FFFFFF');
      setBackgroundColor('#F5F5F7'); // Apple 浅灰背景
    }
  }, [isTelegram, setHeaderColor, setBackgroundColor]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Apple风格的大标题 */}
      <div className="bg-gradient-to-b from-white to-gray-50 px-6 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            CHU TEA
          </h1>
          <p className="text-lg text-gray-600">
            {t('home.welcome')}
          </p>
        </div>
      </div>

      {/* 主要功能入口 - Apple风格的大卡片 */}
      <div className="px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {/* 点单入口 */}
          <Card 
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
            onClick={() => navigate('/menu')}
          >
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="w-8 h-8" />
                    <h2 className="text-2xl font-semibold">
                      {t('nav.order')}
                    </h2>
                  </div>
                  <p className="text-white/90 text-sm">
                    Свежие напитки и десерты
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </Card>

          {/* 商城入口 */}
          <Card 
            className="overflow-hidden cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
            onClick={() => navigate('/mall')}
          >
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-8 h-8" />
                    <h2 className="text-2xl font-semibold">
                      {t('nav.mall')}
                    </h2>
                  </div>
                  <p className="text-white/90 text-sm">
                    Товары и подарки
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-white/80" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 当前活动 - Apple风格的紧凑卡片 */}
      {activeMarketingRules && activeMarketingRules.length > 0 && (
        <div className="px-6 py-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Текущие акции
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/marketing')}
              >
                Все
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-2">
              {activeMarketingRules.slice(0, 3).map((rule: any) => (
                <Card 
                  key={rule.id}
                  className="overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-[0.99]"
                >
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {getLocalizedName(rule)}
                      </h4>
                      <p className="text-sm text-gray-600 truncate">
                        {getLocalizedDescription(rule)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 快捷入口 - Apple风格的网格 */}
      <div className="px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/coupons')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Купоны
              </span>
            </button>

            <button
              onClick={() => navigate('/points')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Баллы
              </span>
            </button>

            <button
              onClick={() => navigate('/membership')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center">
                <Star className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Членство
              </span>
            </button>

            <button
              onClick={() => navigate('/orders')}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Coffee className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-700">
                Заказы
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 会员等级展示 - Apple风格的信息卡片 */}
      {memberLevels && memberLevels.length > 0 && (
        <div className="px-6 py-4 pb-24">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Уровни членства
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {memberLevels.slice(0, 4).map((level: any) => {
                const config = level.config || {};
                return (
                  <Card 
                    key={level.id}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
                    onClick={() => navigate('/membership')}
                  >
                    <div 
                      className="p-4 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${config.color || '#888'}, ${config.color || '#666'})`
                      }}
                    >
                      <div className="text-3xl mb-2">{config.icon || '⭐'}</div>
                      <h4 className="font-semibold mb-1">
                        {getLocalizedName(level)}
                      </h4>
                      <p className="text-xs text-white/80">
                        {config.benefits?.pointsMultiplier}x баллы
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
