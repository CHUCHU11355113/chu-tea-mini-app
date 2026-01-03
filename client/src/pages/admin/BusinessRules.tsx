import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Power, PowerOff, Play } from 'lucide-react';

export default function BusinessRules() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  
  const { data: rules, isLoading, refetch } = trpc.config.listRules.useQuery({
    ruleType: selectedType,
  });

  const updateRule = trpc.config.updateRule.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteRule = trpc.config.deleteRule.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const ruleTypes = [
    { value: undefined, label: 'Все типы' },
    { value: 'coupon', label: 'Купоны' },
    { value: 'points', label: 'Баллы' },
    { value: 'member', label: 'Членство' },
    { value: 'marketing', label: 'Маркетинг' },
    { value: 'pricing', label: 'Ценообразование' },
  ];

  const toggleEnabled = async (id: number, currentStatus: boolean) => {
    await updateRule.mutateAsync({
      id,
      isEnabled: !currentStatus,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить это правило?')) {
      await deleteRule.mutateAsync({ id });
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
        <h1 className="text-2xl font-bold">Бизнес-правила</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Добавить правило
        </Button>
      </div>

      {/* 类型筛选 */}
      <div className="flex gap-2 flex-wrap">
        {ruleTypes.map((type) => (
          <Button
            key={type.value || 'all'}
            variant={selectedType === type.value ? 'default' : 'outline'}
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* 规则列表 */}
      <div className="grid gap-4">
        {rules?.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{rule.nameRu}</h3>
                    <Badge variant={rule.isEnabled ? 'default' : 'secondary'}>
                      {rule.isEnabled ? 'Активно' : 'Неактивно'}
                    </Badge>
                    <Badge variant="outline">{rule.ruleType}</Badge>
                    <Badge variant="secondary">Приоритет: {rule.priority}</Badge>
                    {rule.mutexGroup && (
                      <Badge variant="destructive">Группа: {rule.mutexGroup}</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-3">{rule.descriptionRu}</p>
                  
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Код: <code className="bg-gray-100 px-2 py-1 rounded">{rule.code}</code></div>
                    <div>Выполнено: {rule.executionCount} раз</div>
                    {rule.lastExecutedAt && (
                      <div>Последнее выполнение: {new Date(rule.lastExecutedAt).toLocaleString('ru-RU')}</div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Тестировать правило"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleEnabled(rule.id, rule.isEnabled || false)}
                  >
                    {rule.isEnabled ? (
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
                    onClick={() => handleDelete(rule.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* 显示条件和动作 */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Условия</h4>
                  <pre className="p-3 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(rule.conditions, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">Действия</h4>
                  <pre className="p-3 bg-gray-50 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(rule.actions, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {rules?.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              Правила не найдены
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
