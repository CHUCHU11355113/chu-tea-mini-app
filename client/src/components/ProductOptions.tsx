import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductOptionsProps {
  productId: number;
  onOptionsChange?: (options: SelectedOption[]) => void;
}

interface SelectedOption {
  configId: number;
  itemId: number;
  code: string;
  name: string;
  priceAdjustment: number;
}

export default function ProductOptions({ productId, onOptionsChange }: ProductOptionsProps) {
  const { t, i18n } = useTranslation();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  
  // 获取产品选项配置
  const { data: optionGroups, isLoading } = trpc.config.listConfigs.useQuery({
    category: 'product_option',
    isEnabled: true,
  });

  // 获取每个选项组的选项项
  const optionGroupsWithItems = optionGroups?.map((group) => {
    const { data: items } = trpc.config.listConfigItems.useQuery({
      configId: group.id,
      isEnabled: true,
    });
    return { ...group, items: items || [] };
  });

  useEffect(() => {
    // 自动选择默认选项
    if (optionGroupsWithItems) {
      const defaultOptions: SelectedOption[] = [];
      optionGroupsWithItems.forEach((group) => {
        const defaultItem = group.items.find((item) => item.isDefault);
        if (defaultItem && group.config?.isRequired) {
          defaultOptions.push({
            configId: group.id,
            itemId: defaultItem.id,
            code: defaultItem.code,
            name: getLocalizedName(defaultItem),
            priceAdjustment: defaultItem.config?.priceAdjustment || 0,
          });
        }
      });
      setSelectedOptions(defaultOptions);
      onOptionsChange?.(defaultOptions);
    }
  }, [optionGroupsWithItems]);

  const getLocalizedName = (item: any) => {
    const lang = i18n.language;
    if (lang === 'ru') return item.nameRu;
    if (lang === 'en') return item.nameEn;
    return item.nameZh || item.nameRu;
  };

  const handleOptionSelect = (group: any, item: any) => {
    const selectionType = group.config?.selectionType || 'single';
    const maxSelections = group.config?.maxSelections || 1;

    let newOptions = [...selectedOptions];

    if (selectionType === 'single') {
      // 单选：替换同组的选项
      newOptions = newOptions.filter((opt) => opt.configId !== group.id);
      newOptions.push({
        configId: group.id,
        itemId: item.id,
        code: item.code,
        name: getLocalizedName(item),
        priceAdjustment: item.config?.priceAdjustment || 0,
      });
    } else {
      // 多选
      const existingIndex = newOptions.findIndex(
        (opt) => opt.configId === group.id && opt.itemId === item.id
      );

      if (existingIndex >= 0) {
        // 取消选择
        newOptions.splice(existingIndex, 1);
      } else {
        // 添加选择
        const groupSelections = newOptions.filter((opt) => opt.configId === group.id);
        if (groupSelections.length < maxSelections) {
          newOptions.push({
            configId: group.id,
            itemId: item.id,
            code: item.code,
            name: getLocalizedName(item),
            priceAdjustment: item.config?.priceAdjustment || 0,
          });
        }
      }
    }

    setSelectedOptions(newOptions);
    onOptionsChange?.(newOptions);
  };

  const isOptionSelected = (groupId: number, itemId: number) => {
    return selectedOptions.some(
      (opt) => opt.configId === groupId && opt.itemId === itemId
    );
  };

  const getTotalPriceAdjustment = () => {
    return selectedOptions.reduce((sum, opt) => sum + opt.priceAdjustment, 0);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка опций...</div>;
  }

  if (!optionGroupsWithItems || optionGroupsWithItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {optionGroupsWithItems.map((group) => (
        <Card key={group.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{group.config?.icon}</span>
                <h3 className="font-semibold">{getLocalizedName(group)}</h3>
                {group.config?.isRequired && (
                  <Badge variant="destructive" className="text-xs">
                    Обязательно
                  </Badge>
                )}
              </div>
              {group.config?.selectionType === 'multiple' && (
                <span className="text-xs text-gray-500">
                  Макс. {group.config?.maxSelections}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {group.items.map((item: any) => {
                const isSelected = isOptionSelected(group.id, item.id);
                const priceAdjustment = item.config?.priceAdjustment || 0;

                return (
                  <Button
                    key={item.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'h-auto py-3 px-3 flex flex-col items-center gap-1 relative',
                      isSelected && 'ring-2 ring-primary'
                    )}
                    onClick={() => handleOptionSelect(group, item)}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {item.icon && <span className="text-xl">{item.icon}</span>}
                    <span className="text-sm font-medium text-center">
                      {getLocalizedName(item)}
                    </span>
                    {priceAdjustment !== 0 && (
                      <span className="text-xs text-gray-500">
                        {priceAdjustment > 0 ? '+' : ''}
                        {priceAdjustment}₽
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {getTotalPriceAdjustment() !== 0 && (
        <div className="text-right text-sm text-gray-600">
          Дополнительно: {getTotalPriceAdjustment() > 0 ? '+' : ''}
          {getTotalPriceAdjustment()}₽
        </div>
      )}
    </div>
  );
}
