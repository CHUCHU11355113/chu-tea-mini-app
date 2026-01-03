import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { 
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  Settings,
  LogOut,
  Crown,
  Gift,
  Ticket
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

export default function ProfileNew() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();

  // 模拟用户数据
  const user = {
    name: 'Александр',
    phone: '+7 (999) 123-45-67',
    avatar: '',
    memberLevel: 'silver',
    memberLevelName: 'Серебро',
    points: 3500,
  };

  const menuSections = [
    {
      title: 'Членство',
      items: [
        {
          icon: Crown,
          iconColor: 'text-yellow-500',
          iconBg: 'bg-yellow-50',
          label: 'Центр членства',
          sublabel: `${user.memberLevelName} · ${user.points} баллов`,
          onClick: () => navigate('/member-center'),
        },
        {
          icon: Gift,
          iconColor: 'text-pink-500',
          iconBg: 'bg-pink-50',
          label: 'Мои купоны',
          sublabel: '3 доступны',
          onClick: () => navigate('/coupons'),
        },
        {
          icon: Ticket,
          iconColor: 'text-purple-500',
          iconBg: 'bg-purple-50',
          label: 'Мои заказы',
          sublabel: 'Посмотреть все заказы',
          onClick: () => navigate('/orders'),
        },
      ],
    },
    {
      title: 'Личная информация',
      items: [
        {
          icon: User,
          iconColor: 'text-blue-500',
          iconBg: 'bg-blue-50',
          label: 'Профиль',
          sublabel: 'Редактировать информацию',
          onClick: () => navigate('/profile/edit'),
        },
        {
          icon: MapPin,
          iconColor: 'text-green-500',
          iconBg: 'bg-green-50',
          label: 'Адреса доставки',
          sublabel: '2 сохранённых адреса',
          onClick: () => navigate('/addresses'),
        },
        {
          icon: CreditCard,
          iconColor: 'text-orange-500',
          iconBg: 'bg-orange-50',
          label: 'Способы оплаты',
          sublabel: 'Управление картами',
          onClick: () => navigate('/payment-methods'),
        },
      ],
    },
    {
      title: 'Настройки',
      items: [
        {
          icon: Bell,
          iconColor: 'text-red-500',
          iconBg: 'bg-red-50',
          label: 'Уведомления',
          sublabel: 'Настройки уведомлений',
          onClick: () => navigate('/settings/notifications'),
        },
        {
          icon: Globe,
          iconColor: 'text-indigo-500',
          iconBg: 'bg-indigo-50',
          label: 'Язык',
          sublabel: 'Русский',
          onClick: () => navigate('/settings/language'),
        },
        {
          icon: Settings,
          iconColor: 'text-gray-500',
          iconBg: 'bg-gray-50',
          label: 'Настройки',
          sublabel: 'Общие настройки',
          onClick: () => navigate('/settings'),
        },
      ],
    },
    {
      title: 'Помощь',
      items: [
        {
          icon: HelpCircle,
          iconColor: 'text-teal-500',
          iconBg: 'bg-teal-50',
          label: 'Помощь и поддержка',
          sublabel: 'FAQ и контакты',
          onClick: () => navigate('/help'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部用户信息卡片 - Apple风格 */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 pt-safe">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            {/* 头像 */}
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl border-4 border-white/30">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                '👤'
              )}
            </div>

            {/* 用户信息 */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.name}
              </h2>
              <p className="text-white/90 text-sm">
                {user.phone}
              </p>
            </div>

            {/* 编辑按钮 */}
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
                {section.title}
              </h3>
            )}
            <Card className="overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors",
                      itemIndex !== section.items.length - 1 && "border-b border-gray-100"
                    )}
                  >
                    {/* 图标 */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                      item.iconBg
                    )}>
                      <Icon className={cn("w-5 h-5", item.iconColor)} />
                    </div>

                    {/* 文本 */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-medium text-gray-900">
                        {item.label}
                      </div>
                      {item.sublabel && (
                        <div className="text-sm text-gray-500 truncate">
                          {item.sublabel}
                        </div>
                      )}
                    </div>

                    {/* 箭头 */}
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* 退出登录按钮 */}
        <Button
          variant="outline"
          className="w-full h-14 rounded-xl text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2"
          onClick={() => {
            // TODO: 退出登录逻辑
            console.log('Logout');
          }}
        >
          <LogOut className="w-5 h-5" />
          Выйти
        </Button>

        {/* 版本信息 */}
        <div className="text-center text-sm text-gray-500 py-4">
          CHU TEA v1.0.0
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
