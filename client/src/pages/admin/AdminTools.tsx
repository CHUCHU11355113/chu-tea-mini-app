import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { toast } from "sonner";
import { Gift, Coins, UserPlus, Loader2 } from "lucide-react";

export default function AdminTools() {
  const { t } = useTranslation();
  
  // 批量发放优惠券
  const [couponTemplateId, setCouponTemplateId] = useState<string>("");
  const [couponCount, setCouponCount] = useState<number>(10);
  const [isSendingCoupons, setIsSendingCoupons] = useState(false);
  
  // 批量发放积分
  const [pointsAmount, setPointsAmount] = useState<number>(1000);
  const [isSendingPoints, setIsSendingPoints] = useState(false);
  
  // 创建测试账号
  const [testAccountName, setTestAccountName] = useState<string>("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  // 获取优惠券模板列表
  const { data: couponTemplates } = trpc.coupon.listTemplates.useQuery();
  
  // 批量发放优惠券 mutation
  const sendCouponsMutation = trpc.admin.sendCouponsToAllUsers.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ 成功！已为 ${data.userCount} 个用户发放 ${data.couponCount} 张优惠券`);
      setIsSendingCoupons(false);
    },
    onError: (error) => {
      toast.error('发放失败: ' + error.message);
      setIsSendingCoupons(false);
    },
  });
  
  // 批量发放积分 mutation
  const sendPointsMutation = trpc.admin.sendPointsToAllUsers.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ 成功！已为 ${data.userCount} 个用户发放 ${data.totalPoints} 积分`);
      setIsSendingPoints(false);
    },
    onError: (error) => {
      toast.error('发放失败: ' + error.message);
      setIsSendingPoints(false);
    },
  });
  
  // 创建测试账号 mutation
  const createTestAccountMutation = trpc.admin.createTestAccount.useMutation({
    onSuccess: (data) => {
      toast.success(`✅ 测试账号创建成功！\nTelegram ID: ${data.telegramId}\n积分: ${data.points}\n优惠券: ${data.coupons}张`);
      setIsCreatingAccount(false);
      setTestAccountName("");
    },
    onError: (error) => {
      toast.error('创建失败: ' + error.message);
      setIsCreatingAccount(false);
    },
  });
  
  const handleSendCoupons = () => {
    if (!couponTemplateId) {
      toast.error('请选择优惠券模板');
      return;
    }
    if (confirm(`确定要为所有用户发放 ${couponCount} 张优惠券吗？`)) {
      setIsSendingCoupons(true);
      sendCouponsMutation.mutate({
        templateId: parseInt(couponTemplateId),
        count: couponCount,
      });
    }
  };
  
  const handleSendPoints = () => {
    if (confirm(`确定要为所有用户发放 ${pointsAmount} 积分吗？`)) {
      setIsSendingPoints(true);
      sendPointsMutation.mutate({
        amount: pointsAmount,
      });
    }
  };
  
  const handleCreateTestAccount = () => {
    if (!testAccountName.trim()) {
      toast.error('请输入测试账号名称');
      return;
    }
    if (confirm(`确定要创建测试账号 "${testAccountName}" 吗？\n将自动获得1000积分和10张优惠券`)) {
      setIsCreatingAccount(true);
      createTestAccountMutation.mutate({
        name: testAccountName,
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">管理工具</h1>
        <p className="text-gray-500 mt-2">批量操作和测试工具</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 批量发放优惠券 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-pink-500" />
              <CardTitle>批量发放优惠券</CardTitle>
            </div>
            <CardDescription>为所有用户发放指定优惠券</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>优惠券模板</Label>
              <Select value={couponTemplateId} onValueChange={setCouponTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择优惠券模板" />
                </SelectTrigger>
                <SelectContent>
                  {couponTemplates?.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name} - {template.discountType === 'fixed' 
                        ? `减${template.discountValue}₽` 
                        : `${template.discountValue}折`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>每人发放数量</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={couponCount}
                onChange={(e) => setCouponCount(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <Button 
              onClick={handleSendCoupons} 
              disabled={isSendingCoupons}
              className="w-full"
            >
              {isSendingCoupons ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发放中...
                </>
              ) : (
                '发放优惠券'
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* 批量发放积分 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <CardTitle>批量发放积分</CardTitle>
            </div>
            <CardDescription>为所有用户发放指定积分</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>积分数量</Label>
              <Input
                type="number"
                min="1"
                max="100000"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              将为所有用户发放 {pointsAmount} 积分
            </div>
            
            <Button 
              onClick={handleSendPoints} 
              disabled={isSendingPoints}
              className="w-full"
            >
              {isSendingPoints ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发放中...
                </>
              ) : (
                '发放积分'
              )}
            </Button>
          </CardContent>
        </Card>
        
        {/* 创建测试账号 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              <CardTitle>创建测试账号</CardTitle>
            </div>
            <CardDescription>创建带有初始数据的测试账号</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>账号名称</Label>
              <Input
                type="text"
                placeholder="例如: Test User 001"
                value={testAccountName}
                onChange={(e) => setTestAccountName(e.target.value)}
              />
            </div>
            
            <div className="text-sm text-gray-500">
              自动获得：
              <ul className="list-disc list-inside mt-1">
                <li>1000 积分</li>
                <li>10 张满100减50优惠券</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleCreateTestAccount} 
              disabled={isCreatingAccount}
              className="w-full"
            >
              {isCreatingAccount ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  创建中...
                </>
              ) : (
                '创建测试账号'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
