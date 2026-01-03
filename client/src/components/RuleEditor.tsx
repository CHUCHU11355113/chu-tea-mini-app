import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Condition {
  field: string;
  operator: string;
  value: any;
  logic: 'AND' | 'OR';
}

interface Action {
  type: string;
  params: Record<string, any>;
}

interface RuleEditorProps {
  initialRule?: any;
  onSave?: (rule: any) => void;
  onCancel?: () => void;
}

export default function RuleEditor({ initialRule, onSave, onCancel }: RuleEditorProps) {
  const { t } = useTranslation();
  const [rule, setRule] = useState(initialRule || {
    code: '',
    nameRu: '',
    nameEn: '',
    nameZh: '',
    descriptionRu: '',
    descriptionEn: '',
    descriptionZh: '',
    ruleType: 'marketing',
    conditions: [] as Condition[],
    actions: [] as Action[],
    priority: 10,
    isEnabled: true,
  });

  const conditionFields = [
    { value: 'orderAmount', label: 'Сумма заказа' },
    { value: 'cart.itemCount', label: 'Количество товаров' },
    { value: 'user.memberLevel', label: 'Уровень члена' },
    { value: 'user.totalOrders', label: 'Всего заказов' },
    { value: 'user.totalPoints', label: 'Всего баллов' },
    { value: 'order.time', label: 'Время заказа' },
    { value: 'order.dayOfWeek', label: 'День недели' },
    { value: 'product.category', label: 'Категория товара' },
    { value: 'product.tags', label: 'Теги товара' },
  ];

  const operators = [
    { value: '=', label: 'Равно' },
    { value: '!=', label: 'Не равно' },
    { value: '>', label: 'Больше' },
    { value: '>=', label: 'Больше или равно' },
    { value: '<', label: 'Меньше' },
    { value: '<=', label: 'Меньше или равно' },
    { value: 'in', label: 'В списке' },
    { value: 'not_in', label: 'Не в списке' },
    { value: 'contains', label: 'Содержит' },
    { value: 'between', label: 'Между' },
  ];

  const actionTypes = [
    { value: 'discount', label: 'Скидка' },
    { value: 'givePoints', label: 'Начислить баллы' },
    { value: 'giveCoupon', label: 'Выдать купон' },
    { value: 'giveProduct', label: 'Подарить товар' },
    { value: 'sendNotification', label: 'Отправить уведомление' },
    { value: 'upgradeMember', label: 'Повысить уровень' },
  ];

  const addCondition = () => {
    setRule({
      ...rule,
      conditions: [
        ...rule.conditions,
        {
          field: 'orderAmount',
          operator: '>=',
          value: 0,
          logic: 'AND',
        },
      ],
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = [...rule.conditions];
    newConditions.splice(index, 1);
    setRule({ ...rule, conditions: newConditions });
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = [...rule.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setRule({ ...rule, conditions: newConditions });
  };

  const addAction = () => {
    setRule({
      ...rule,
      actions: [
        ...rule.actions,
        {
          type: 'discount',
          params: {},
        },
      ],
    });
  };

  const removeAction = (index: number) => {
    const newActions = [...rule.actions];
    newActions.splice(index, 1);
    setRule({ ...rule, actions: newActions });
  };

  const updateAction = (index: number, updates: Partial<Action>) => {
    const newActions = [...rule.actions];
    newActions[index] = { ...newActions[index], ...updates };
    setRule({ ...rule, actions: newActions });
  };

  const handleSave = () => {
    onSave?.(rule);
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Код правила</Label>
              <Input
                value={rule.code}
                onChange={(e) => setRule({ ...rule, code: e.target.value })}
                placeholder="rule_code"
              />
            </div>
            <div>
              <Label>Тип правила</Label>
              <Select
                value={rule.ruleType}
                onValueChange={(value) => setRule({ ...rule, ruleType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Маркетинг</SelectItem>
                  <SelectItem value="coupon">Купон</SelectItem>
                  <SelectItem value="points">Баллы</SelectItem>
                  <SelectItem value="member">Членство</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Название (Русский)</Label>
            <Input
              value={rule.nameRu}
              onChange={(e) => setRule({ ...rule, nameRu: e.target.value })}
              placeholder="Название правила"
            />
          </div>

          <div>
            <Label>Описание (Русский)</Label>
            <Input
              value={rule.descriptionRu}
              onChange={(e) => setRule({ ...rule, descriptionRu: e.target.value })}
              placeholder="Описание правила"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Приоритет</Label>
              <Input
                type="number"
                value={rule.priority}
                onChange={(e) => setRule({ ...rule, priority: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rule.isEnabled}
                  onChange={(e) => setRule({ ...rule, isEnabled: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Включено</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 条件 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Условия</CardTitle>
            <Button onClick={addCondition} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Добавить условие
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rule.conditions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нет условий. Нажмите "Добавить условие" для создания.
            </div>
          ) : (
            rule.conditions.map((condition: Condition, index: number) => (
              <div key={index} className="flex items-center gap-2 p-4 border rounded-lg">
                {index > 0 && (
                  <Select
                    value={condition.logic}
                    onValueChange={(value) => updateCondition(index, { logic: value as 'AND' | 'OR' })}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">И</SelectItem>
                      <SelectItem value="OR">ИЛИ</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                <Select
                  value={condition.field}
                  onValueChange={(value) => updateCondition(index, { field: value })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={condition.operator}
                  onValueChange={(value) => updateCondition(index, { operator: value })}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(index, { value: e.target.value })}
                  placeholder="Значение"
                  className="flex-1"
                />

                <Button
                  onClick={() => removeCondition(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 动作 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Действия</CardTitle>
            <Button onClick={addAction} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Добавить действие
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {rule.actions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Нет действий. Нажмите "Добавить действие" для создания.
            </div>
          ) : (
            rule.actions.map((action: Action, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={action.type}
                    onValueChange={(value) => updateAction(index, { type: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() => removeAction(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* 根据动作类型显示不同的参数输入 */}
                {action.type === 'discount' && (
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="Тип (percent/fixed)" />
                    <Input placeholder="Значение" type="number" />
                    <Input placeholder="Макс. сумма" type="number" />
                  </div>
                )}

                {action.type === 'givePoints' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Формула (например: orderAmount * 0.01)" />
                    <Input placeholder="Причина" />
                  </div>
                )}

                {action.type === 'giveCoupon' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Код купона" />
                    <Input placeholder="Количество" type="number" />
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-3">
        <Button onClick={onCancel} variant="outline">
          Отмена
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Сохранить
        </Button>
      </div>
    </div>
  );
}
