import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft,
  ChevronRight,
  Crown,
  Gift,
  Star,
  TrendingUp,
  Calendar,
  Award,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/BottomNav';

export default function MemberCenterNew() {
  const { t, i18n } = useTranslation();
  const [, navigate] = useLocation();

  // 获取会员等级配置
  const { data: memberLevels } = trpc.config.listConfigs.useQuery({
    category: 'member_level',
    isEnabled: true,
  });

  // 模拟当前用户会员信息
  const currentUser = {
    id: 1,
    name: 'Александр',
    currentLevel: 'silver',
    currentLevelName: 'Серебро',
    points: 3500,
    nextLevel: 'gold',
    nextLevelName: 'Золото',
    pointsToNextLevel: 1500,
    totalOrders: 28,
    totalSpent: 15680,
    joinDate: '2025-08-15',
    benefits: [
      { icon: '🎁', name: 'Скидка 10%', description: 'На все напитки' },
      { icon: '⭐', name: 'Двойные баллы', description: 'По вторникам' },
      { icon: '🎂', name: 'Подарок на день рождения', description: 'Бесплатный напиток' },
      { icon: '🚀', name: 'Приоритетная доставка', description: 'Быстрее на 20%' },
    ],
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'from-amber-700 to-amber-900';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '⭐';
    }
  };

  const progressPercentage = ((currentUser.points / (currentUser.points + currentUser.pointsToNextLevel)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Членство
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* 会员等级卡片 - Apple风格的大卡片 */}
        <Card className={cn(
          "overflow-hidden relative",
          "bg-gradient-to-br",
          getLevelColor(currentUser.currentLevel)
        )}>
          <div className="p-6 text-white">
            {/* 等级图标和名称 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-5xl">
                  {getLevelIcon(currentUser.currentLevel)}
                </div>
                <div>
                  <div className="text-sm opacity-90">Текущий уровень</div>
                  <div className="text-2xl font-bold">{currentUser.currentLevelName}</div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* 积分信息 */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold">{currentUser.points}</span>
                <span className="text-sm opacity-90">баллов</span>
              </div>
              <div className="text-sm opacity-90">
                Ещё {currentUser.pointsToNextLevel} баллов до {currentUser.nextLevelName}
              </div>
            </div>

            {/* 进度条 */}
            <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* 装饰性背景 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </Card>

        {/* 统计数据 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {currentUser.totalOrders}
            </div>
            <div className="text-sm text-gray-600">
              Заказов
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {currentUser.totalSpent}₽
            </div>
            <div className="text-sm text-gray-600">
              Потрачено
            </div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {Math.floor((Date.now() - new Date(currentUser.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-sm text-gray-600">
              Дней с нами
            </div>
          </Card>
        </div>

        {/* 会员权益 */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Ваши привилегии
            </h2>
          </div>

          <div className="space-y-3">
            {currentUser.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="text-3xl flex-shrink-0">
                  {benefit.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 mb-1">
                    {benefit.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {benefit.description}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </Card>

        {/* 会员等级说明 */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" />
            Уровни членства
          </h2>

          <div className="space-y-3">
            {['bronze', 'silver', 'gold', 'platinum'].map((level, index) => {
              const isCurrent = level === currentUser.currentLevel;
              const levelNames: Record<string, string> = {
                bronze: 'Бронза',
                silver: 'Серебро',
                gold: 'Золото',
                platinum: 'Платина',
              };
              const levelPoints: Record<string, number> = {
                bronze: 0,
                silver: 2000,
                gold: 5000,
                platinum: 10000,
              };

              return (
                <div
                  key={level}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-colors",
                    isCurrent ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50"
                  )}
                >
                  <div className="text-3xl">
                    {getLevelIcon(level)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {levelNames[level]}
                      </span>
                      {isCurrent && (
                        <Badge className="bg-blue-500 text-white text-xs">
                          Текущий
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      От {levelPoints[level]} баллов
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* 快速操作 */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate('/points-history')}
            variant="outline"
            className="h-14 rounded-xl flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            История баллов
          </Button>
          <Button
            onClick={() => navigate('/member-tasks')}
            className="h-14 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Задания
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
