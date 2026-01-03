import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useRoute } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft,
  Clock,
  Users,
  Gift,
  CheckCircle,
  Share2,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CampaignDetailNew() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [, params] = useRoute('/campaign/:id');
  const [isParticipating, setIsParticipating] = useState(false);

  // 模拟活动详情数据
  const campaign = {
    id: parseInt(params?.id || '1'),
    title: 'Новогодняя акция',
    subtitle: 'Скидка 30% на все напитки',
    description: 'Встречайте Новый год с CHU TEA! Получите специальную скидку 30% на все напитки до 15 января. Не упустите возможность насладиться любимыми напитками по выгодной цене!',
    image: '🎄',
    startDate: '2026-01-01',
    endDate: '2026-01-15',
    participants: 1234,
    maxParticipants: 5000,
    reward: '30% скидка',
    type: 'discount',
    rules: [
      'Акция действует с 1 по 15 января 2026 года',
      'Скидка применяется на все напитки в меню',
      'Скидка не суммируется с другими акциями',
      'Один купон на один заказ',
      'Минимальная сумма заказа: 300₽',
    ],
    steps: [
      'Нажмите кнопку "Участвовать"',
      'Получите купон на скидку',
      'Используйте купон при оформлении заказа',
      'Наслаждайтесь скидкой!',
    ],
  };

  // 计算进度
  const participationProgress = (campaign.participants / campaign.maxParticipants) * 100;

  // 计算剩余时间
  const endDate = new Date(campaign.endDate);
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60)) % 24;

  const handleParticipate = () => {
    // TODO: 调用参与活动的API
    setIsParticipating(true);
    alert('Вы успешно участвуете в акции!');
  };

  const handleShare = () => {
    // TODO: 分享功能
    alert('Поделиться акцией');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate('/campaigns')}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center font-semibold text-gray-900">
            Детали акции
          </h1>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* 活动头图 */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center text-9xl relative">
            {campaign.image}
            
            {/* 倒计时徽章 */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-red-600 border-0 backdrop-blur-sm">
                <Clock className="w-3 h-3 mr-1" />
                {daysLeft}д {hoursLeft}ч
              </Badge>
            </div>
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {campaign.title}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {campaign.subtitle}
            </p>

            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {campaign.participants}
                </div>
                <div className="text-xs text-gray-600">
                  Участников
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {daysLeft}
                </div>
                <div className="text-xs text-gray-600">
                  Дней осталось
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {campaign.reward}
                </div>
                <div className="text-xs text-gray-600">
                  Награда
                </div>
              </div>
            </div>

            {/* 参与进度 */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Прогресс участия</span>
                <span>{campaign.participants} / {campaign.maxParticipants}</span>
              </div>
              <Progress value={participationProgress} className="h-2" />
            </div>

            {/* 参与按钮 */}
            {isParticipating ? (
              <Button
                disabled
                className="w-full h-14 rounded-xl bg-green-500"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Вы участвуете
              </Button>
            ) : (
              <Button
                onClick={handleParticipate}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <Gift className="w-5 h-5 mr-2" />
                Участвовать сейчас
              </Button>
            )}
          </div>
        </Card>

        {/* 活动描述 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Описание акции
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {campaign.description}
          </p>
        </Card>

        {/* 活动时间 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Период проведения
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Начало</span>
              <span className="font-medium text-gray-900">
                {new Date(campaign.startDate).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Окончание</span>
              <span className="font-medium text-gray-900">
                {new Date(campaign.endDate).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>

        {/* 参与步骤 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Как участвовать
          </h2>
          <div className="space-y-3">
            {campaign.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <p className="text-gray-700 pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 活动规则 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Правила акции
          </h2>
          <ul className="space-y-2">
            {campaign.rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-amber-500 mt-1">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* 底部固定按钮 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-14 rounded-xl"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Поделиться
            </Button>
            {!isParticipating && (
              <Button
                onClick={handleParticipate}
                className="flex-1 h-14 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                <Gift className="w-5 h-5 mr-2" />
                Участвовать
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
