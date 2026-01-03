import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Loader2, Save, Store, Truck, Clock, DollarSign, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DeliverySettings() {
  const { t } = useTranslation();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    deliveryEnabled: true,
    pickupEnabled: true,
    deliveryFee: '0.00',
    freeDeliveryThreshold: '',
    minOrderAmount: '0.00',
    deliveryRadius: 5000,
    estimatedDeliveryTime: 30,
    estimatedPickupTime: 15,
  });

  // 获取门店列表
  const { data: stores } = trpc.stores.list.useQuery();

  // 获取配送配置
  const { data: config, isLoading, refetch } = trpc.delivery.getConfig.useQuery(
    { storeId: selectedStoreId || undefined },
    { enabled: true }
  );

  // 获取所有配置列表
  const { data: configList } = trpc.delivery.list.useQuery();

  // 更新配置
  const upsertMutation = trpc.delivery.upsert.useMutation({
    onSuccess: () => {
      toast.success(t('admin.deliverySettings.saveSuccess'));
      refetch();
    },
    onError: (error) => {
      toast.error(t('admin.deliverySettings.saveError') + ': ' + error.message);
    },
  });

  // 当配置加载完成时更新表单
  useEffect(() => {
    if (config) {
      setFormData({
        deliveryEnabled: config.deliveryEnabled,
        pickupEnabled: config.pickupEnabled,
        deliveryFee: config.deliveryFee,
        freeDeliveryThreshold: config.freeDeliveryThreshold || '',
        minOrderAmount: config.minOrderAmount,
        deliveryRadius: config.deliveryRadius,
        estimatedDeliveryTime: config.estimatedDeliveryTime,
        estimatedPickupTime: config.estimatedPickupTime,
      });
    }
  }, [config]);

  const handleSave = async () => {
    // 验证至少开启一种配送方式
    if (!formData.deliveryEnabled && !formData.pickupEnabled) {
      toast.error(t('admin.deliverySettings.atLeastOneMethod'));
      return;
    }

    // 验证数字格式
    const deliveryFee = parseFloat(formData.deliveryFee);
    const minOrderAmount = parseFloat(formData.minOrderAmount);
    const freeDeliveryThreshold = formData.freeDeliveryThreshold
      ? parseFloat(formData.freeDeliveryThreshold)
      : null;

    if (isNaN(deliveryFee) || deliveryFee < 0) {
      toast.error(t('admin.deliverySettings.invalidDeliveryFee'));
      return;
    }

    if (isNaN(minOrderAmount) || minOrderAmount < 0) {
      toast.error(t('admin.deliverySettings.invalidMinOrderAmount'));
      return;
    }

    if (freeDeliveryThreshold !== null && (isNaN(freeDeliveryThreshold) || freeDeliveryThreshold < 0)) {
      toast.error(t('admin.deliverySettings.invalidFreeDeliveryThreshold'));
      return;
    }

    try {
      await upsertMutation.mutateAsync({
        id: config?.id && config.id > 0 ? config.id : undefined,
        storeId: selectedStoreId,
        deliveryEnabled: formData.deliveryEnabled,
        pickupEnabled: formData.pickupEnabled,
        deliveryFee: deliveryFee.toFixed(2),
        freeDeliveryThreshold: freeDeliveryThreshold ? freeDeliveryThreshold.toFixed(2) : null,
        minOrderAmount: minOrderAmount.toFixed(2),
        deliveryRadius: formData.deliveryRadius,
        estimatedDeliveryTime: formData.estimatedDeliveryTime,
        estimatedPickupTime: formData.estimatedPickupTime,
      });
    } catch (error) {
      console.error('Failed to save delivery settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">{t('admin.deliverySettings.title')}</h1>
        <p className="text-gray-500">{t('admin.deliverySettings.subtitle')}</p>
      </div>

      {/* 门店选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {t('admin.deliverySettings.storeSelection')}
          </CardTitle>
          <CardDescription>
            {t('admin.deliverySettings.storeSelectionDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>{t('admin.deliverySettings.selectStore')}</Label>
            <Select
              value={selectedStoreId?.toString() || 'global'}
              onValueChange={(value) => {
                setSelectedStoreId(value === 'global' ? null : parseInt(value));
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">
                  {t('admin.deliverySettings.globalConfig')}
                </SelectItem>
                {stores?.map((store) => (
                  <SelectItem key={store.id} value={store.id.toString()}>
                    {store.nameZh} ({store.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {selectedStoreId
                ? t('admin.deliverySettings.storeConfigDesc')
                : t('admin.deliverySettings.globalConfigDesc')}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 配送方式开关 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t('admin.deliverySettings.deliveryMethods')}
          </CardTitle>
          <CardDescription>
            {t('admin.deliverySettings.deliveryMethodsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 外卖开关 */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                {t('admin.deliverySettings.enableDelivery')}
              </Label>
              <p className="text-sm text-gray-500">
                {t('admin.deliverySettings.enableDeliveryDesc')}
              </p>
            </div>
            <Switch
              checked={formData.deliveryEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, deliveryEnabled: checked })
              }
            />
          </div>

          {/* 自提开关 */}
          <div className="flex items-center justify-between border-t pt-6">
            <div className="space-y-1">
              <Label className="text-base font-medium">
                {t('admin.deliverySettings.enablePickup')}
              </Label>
              <p className="text-sm text-gray-500">
                {t('admin.deliverySettings.enablePickupDesc')}
              </p>
            </div>
            <Switch
              checked={formData.pickupEnabled}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, pickupEnabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 配送费设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('admin.deliverySettings.deliveryFeeSettings')}
          </CardTitle>
          <CardDescription>
            {t('admin.deliverySettings.deliveryFeeSettingsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 配送费 */}
            <div className="space-y-2">
              <Label htmlFor="deliveryFee">
                {t('admin.deliverySettings.deliveryFee')}
              </Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryFee}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryFee: e.target.value })
                }
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">
                {t('admin.deliverySettings.deliveryFeeDesc')}
              </p>
            </div>

            {/* 免配送费门槛 */}
            <div className="space-y-2">
              <Label htmlFor="freeDeliveryThreshold">
                {t('admin.deliverySettings.freeDeliveryThreshold')}
              </Label>
              <Input
                id="freeDeliveryThreshold"
                type="number"
                step="0.01"
                min="0"
                value={formData.freeDeliveryThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeDeliveryThreshold: e.target.value })
                }
                placeholder={t('admin.deliverySettings.optional')}
              />
              <p className="text-xs text-gray-500">
                {t('admin.deliverySettings.freeDeliveryThresholdDesc')}
              </p>
            </div>

            {/* 起送金额 */}
            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">
                {t('admin.deliverySettings.minOrderAmount')}
              </Label>
              <Input
                id="minOrderAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderAmount: e.target.value })
                }
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500">
                {t('admin.deliverySettings.minOrderAmountDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 配送范围和时间 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('admin.deliverySettings.deliveryRangeAndTime')}
          </CardTitle>
          <CardDescription>
            {t('admin.deliverySettings.deliveryRangeAndTimeDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 配送范围 */}
            <div className="space-y-2">
              <Label htmlFor="deliveryRadius">
                {t('admin.deliverySettings.deliveryRadius')}
              </Label>
              <Input
                id="deliveryRadius"
                type="number"
                step="100"
                min="0"
                value={formData.deliveryRadius}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryRadius: parseInt(e.target.value) || 0 })
                }
                placeholder="5000"
              />
              <p className="text-xs text-gray-500">
                {t('admin.deliverySettings.deliveryRadiusDesc')}
              </p>
            </div>

            {/* 预计配送时间 */}
            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryTime" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t('admin.deliverySettings.estimatedDeliveryTime')}
              </Label>
              <Input
                id="estimatedDeliveryTime"
                type="number"
                step="5"
                min="0"
                value={formData.estimatedDeliveryTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedDeliveryTime: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="30"
              />
              <p className="text-xs text-gray-500">
                {t('admin.deliverySettings.estimatedDeliveryTimeDesc')}
              </p>
            </div>

            {/* 预计自提时间 */}
            <div className="space-y-2">
              <Label htmlFor="estimatedPickupTime" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t('admin.deliverySettings.estimatedPickupTime')}
              </Label>
              <Input
                id="estimatedPickupTime"
                type="number"
                step="5"
                min="0"
                value={formData.estimatedPickupTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedPickupTime: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="15"
              />
              <p className="text-xs text-gray-500">
                {t('admin.deliverySettings.estimatedPickupTimeDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => {
            if (config) {
              setFormData({
                deliveryEnabled: config.deliveryEnabled,
                pickupEnabled: config.pickupEnabled,
                deliveryFee: config.deliveryFee,
                freeDeliveryThreshold: config.freeDeliveryThreshold || '',
                minOrderAmount: config.minOrderAmount,
                deliveryRadius: config.deliveryRadius,
                estimatedDeliveryTime: config.estimatedDeliveryTime,
                estimatedPickupTime: config.estimatedPickupTime,
              });
            }
          }}
        >
          {t('common.reset')}
        </Button>
        <Button
          onClick={handleSave}
          disabled={upsertMutation.isPending || (!formData.deliveryEnabled && !formData.pickupEnabled)}
        >
          {upsertMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.saving')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('common.save')}
            </>
          )}
        </Button>
      </div>

      {/* 配置列表（显示所有已配置的门店） */}
      {configList && configList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.deliverySettings.existingConfigs')}</CardTitle>
            <CardDescription>
              {t('admin.deliverySettings.existingConfigsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {configList.map((cfg) => {
                const store = stores?.find((s) => s.id === cfg.storeId);
                return (
                  <div
                    key={cfg.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedStoreId(cfg.storeId)}
                  >
                    <div>
                      <p className="font-medium">
                        {cfg.storeId ? store?.nameZh || `Store #${cfg.storeId}` : t('admin.deliverySettings.globalConfig')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('admin.deliverySettings.delivery')}: {cfg.deliveryEnabled ? '✓' : '✗'} |{' '}
                        {t('admin.deliverySettings.pickup')}: {cfg.pickupEnabled ? '✓' : '✗'} |{' '}
                        {t('admin.deliverySettings.fee')}: ₽{cfg.deliveryFee}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStoreId(cfg.storeId);
                      }}
                    >
                      {t('common.edit')}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
