import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft } from 'lucide-react';
import { CampaignBanner } from '@/components/CampaignBanner';
import { CampaignCard } from '@/components/CampaignCard';
import { BottomNav } from '@/components/BottomNav';

export default function CampaignsNew() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>('all');

  // 模拟营销活动数据
  const campaigns = [
    {
      id: 1,
      title: 'Новогодняя акция',
      subtitle: 'Скидка 30% на все напитки',
      description: 'Встречайте Новый год с CHU TEA! Специальная скидка на все напитки до 15 января.',
      image: '🎄',
      startDate: '2026-01-01',
      endDate: '2026-01-15',
      participants: 1234,
      reward: '30% скидка',
      type: 'discount' as const,
    },
    {
      id: 2,
      title: 'Счастливые часы',
      subtitle: '2 по цене 1',
      description: 'Каждый день с 14:00 до 16:00 покупайте два напитка по цене одного!',
      image: '⏰',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      participants: 856,
      reward: '1 напиток',
      type: 'gift' as const,
    },
    {
      id: 3,
      title: 'Бесплатная доставка',
      subtitle: 'При заказе от 500₽',
      description: 'Закажите на сумму от 500₽ и получите бесплатную доставку!',
      image: '🚀',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      participants: 2341,
      type: 'free_delivery' as const,
    },
    {
      id: 4,
      title: 'Двойные баллы',
      subtitle: 'Получайте x2 баллы',
      description: 'Каждую покупку получайте удвоенные баллы для накопления!',
      image: '⭐',
      startDate: '2026-01-01',
      endDate: '2026-01-10',
      participants: 1567,
      reward: 'x2 баллы',
      type: 'points' as const,
    },
    {
      id: 5,
      title: 'Подарок за отзыв',
      subtitle: 'Бесплатный напиток',
      description: 'Оставьте отзыв о вашем заказе и получите бесплатный напиток!',
      image: '🎁',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      participants: 432,
      reward: '1 напиток',
      type: 'gift' as const,
    },
    {
      id: 6,
      title: 'Скидка на день рождения',
      subtitle: '50% скидка',
      description: 'В день вашего рождения получите скидку 50% на любой напиток!',
      image: '🎂',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      participants: 234,
      reward: '50% скидка',
      type: 'discount' as const,
    },
  ];

  const filteredCampaigns = activeTab === 'all'
    ? campaigns
    : campaigns.filter(c => c.type === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Акции и предложения
          </h1>
          <div className="w-10" />
        </div>

        {/* 标签页 */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-5 h-10">
              <TabsTrigger value="all" className="text-xs">
                Все
              </TabsTrigger>
              <TabsTrigger value="discount" className="text-xs">
                Скидки
              </TabsTrigger>
              <TabsTrigger value="gift" className="text-xs">
                Подарки
              </TabsTrigger>
              <TabsTrigger value="points" className="text-xs">
                Баллы
              </TabsTrigger>
              <TabsTrigger value="free_delivery" className="text-xs">
                Доставка
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* 轮播横幅 */}
        <CampaignBanner limit={3} />

        {/* 活动列表 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {activeTab === 'all' ? 'Все акции' : 'Активные акции'}
          </h2>
          
          {filteredCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-8xl mb-4">🎉</div>
              <p className="text-gray-500">
                Нет доступных акций
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
