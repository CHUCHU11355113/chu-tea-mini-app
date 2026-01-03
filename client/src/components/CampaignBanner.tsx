import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignBannerProps {
  className?: string;
  limit?: number;
}

export function CampaignBanner({ className, limit = 3 }: CampaignBannerProps) {
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 从配置系统获取营销活动
  const { data: campaigns } = trpc.config.listConfigs.useQuery({
    category: 'marketing_campaign',
    isEnabled: true,
  });

  // 模拟营销活动数据
  const mockCampaigns = [
    {
      id: 1,
      title: 'Новогодняя акция',
      subtitle: 'Скидка 30% на все напитки',
      description: 'Только до 15 января',
      image: '🎄',
      bgGradient: 'from-red-500 to-pink-600',
      textColor: 'text-white',
    },
    {
      id: 2,
      title: 'Счастливые часы',
      subtitle: '2 по цене 1',
      description: 'Каждый день с 14:00 до 16:00',
      image: '⏰',
      bgGradient: 'from-orange-500 to-yellow-600',
      textColor: 'text-white',
    },
    {
      id: 3,
      title: 'Бесплатная доставка',
      subtitle: 'При заказе от 500₽',
      description: 'Только в этом месяце',
      image: '🚀',
      bgGradient: 'from-blue-500 to-purple-600',
      textColor: 'text-white',
    },
  ];

  const displayCampaigns = mockCampaigns.slice(0, limit);

  // 自动轮播
  useEffect(() => {
    if (displayCampaigns.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayCampaigns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayCampaigns.length]);

  if (displayCampaigns.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative", className)}>
      {/* 轮播容器 */}
      <div className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="w-full flex-shrink-0"
            >
              <Card
                className={cn(
                  "overflow-hidden cursor-pointer hover:shadow-xl transition-shadow",
                  "bg-gradient-to-br",
                  campaign.bgGradient
                )}
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              >
                <div className="p-6 relative">
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                  {/* 内容 */}
                  <div className="relative z-10 flex items-center gap-4">
                    {/* 图标 */}
                    <div className="text-6xl flex-shrink-0">
                      {campaign.image}
                    </div>

                    {/* 文本 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Акция
                        </Badge>
                      </div>
                      <h3 className={cn(
                        "text-2xl font-bold mb-1",
                        campaign.textColor
                      )}>
                        {campaign.title}
                      </h3>
                      <p className={cn(
                        "text-lg mb-2",
                        campaign.textColor,
                        "opacity-90"
                      )}>
                        {campaign.subtitle}
                      </p>
                      <p className={cn(
                        "text-sm",
                        campaign.textColor,
                        "opacity-75"
                      )}>
                        {campaign.description}
                      </p>
                    </div>

                    {/* 箭头 */}
                    <ChevronRight className={cn(
                      "w-6 h-6 flex-shrink-0",
                      campaign.textColor
                    )} />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* 指示器 */}
      {displayCampaigns.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {displayCampaigns.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentIndex
                  ? "w-6 bg-gray-900"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
