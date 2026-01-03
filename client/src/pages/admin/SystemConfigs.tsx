import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Power, PowerOff } from 'lucide-react';

export default function SystemConfigs() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  const { data: configs, isLoading, refetch } = trpc.config.listConfigs.useQuery({
    category: selectedCategory,
  });

  const updateConfig = trpc.config.updateConfig.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteConfig = trpc.config.deleteConfig.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const categories = [
    { value: undefined, label: 'Все категории' },
    { value: 'delivery_method', label: 'Способы доставки' },
    { value: 'product_option', label: 'Опции продукта' },
    { value: 'payment_method', label: 'Способы оплаты' },
    { value: 'member_level', label: 'Уровни членства' },
  ];

  const toggleEnabled = async (id: number, currentStatus: boolean) => {
    await updateConfig.mutateAsync({
      id,
      isEnabled: !currentStatus,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту конфигурацию?')) {
      await deleteConfig.mutateAsync({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Системные конфигурации</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить конфигурацию
        </Button>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat.value || 'all'}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* 配置列表 */}
      <div className="grid gap-4">
        {configs?.map((config) => (
          <Card key={config.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{config.nameRu}</h3>
                    <Badge variant={config.isEnabled ? 'default' : 'secondary'}>
                      {config.isEnabled ? 'Активно' : 'Неактивно'}
                    </Badge>
                    <Badge variant="outline">{config.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">{config.descriptionRu}</p>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Код: <code className="bg-gray-100 px-2 py-1 rounded">{config.code}</code></div>
                    <div>Порядок: {config.sortOrder}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEnabled(config.id, config.isEnabled || false)}
                  >
                    {config.isEnabled ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* 显示配置详情 */}
              {config.config && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600">
                    Детали конфигурации
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                    {JSON.stringify(config.config, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}

        {configs?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              Конфигурации не найдены
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
