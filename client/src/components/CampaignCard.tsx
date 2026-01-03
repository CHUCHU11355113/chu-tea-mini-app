import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Gift, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
  campaign: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    startDate: string;
    endDate: string;
    participants?: number;
    reward?: string;
    type: 'discount' | 'gift' | 'points' | 'free_delivery';
  };
  className?: string;
}

export function CampaignCard({ campaign, className }: CampaignCardProps) {
  const [, navigate] = useLocation();

  const getTypeConfig = (type: CampaignCardProps['campaign']['type']) => {
    switch (type) {
      case 'discount':
        return {
          label: 'Скидка',
          icon: '💰',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
        };
      case 'gift':
        return {
          label: 'Подарок',
          icon: '🎁',
          color: 'text-pink-600',
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-200',
        };
      case 'points':
        return {
          label: 'Баллы',
          icon: '⭐',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case 'free_delivery':
        return {
          label: 'Доставка',
          icon: '🚀',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
    }
  };

  const typeConfig = getTypeConfig(campaign.type);

  // 计算剩余时间
  const endDate = new Date(campaign.endDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card
      className={cn(
        "overflow-hidden cursor-pointer hover:shadow-lg transition-all",
        className
      )}
      onClick={() => navigate(`/campaign/${campaign.id}`)}
    >
      {/* 活动图片/图标 */}
      <div className={cn(
        "h-32 flex items-center justify-center text-7xl",
        "bg-gradient-to-br from-gray-50 to-gray-100"
      )}>
        {campaign.image}
      </div>

      {/* 活动信息 */}
      <div className="p-4">
        {/* 类型标签 */}
        <div className="flex items-center gap-2 mb-2">
          <Badge className={cn(
            typeConfig.bgColor,
            typeConfig.color,
            "border",
            typeConfig.borderColor
          )}>
            {typeConfig.icon} {typeConfig.label}
          </Badge>
          {daysLeft <= 3 && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {daysLeft} дн.
            </Badge>
          )}
        </div>

        {/* 标题和描述 */}
        <h3 className="font-bold text-lg text-gray-900 mb-1">
          {campaign.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {campaign.subtitle}
        </p>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">
          {campaign.description}
        </p>

        {/* 统计信息 */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          {campaign.participants && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{campaign.participants}</span>
            </div>
          )}
          {campaign.reward && (
            <div className="flex items-center gap-1">
              <Gift className="w-4 h-4" />
              <span>{campaign.reward}</span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <Button
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/campaign/${campaign.id}`);
          }}
        >
          Участвовать
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
}
