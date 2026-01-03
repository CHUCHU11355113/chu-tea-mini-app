# CHU TEA Apple Design System

完全遵循 Apple 设计规范的 UI 组件库，为 CHU TEA Mini App 提供统一、优雅的用户界面。

## 🎨 设计原则

### 1. 简洁优雅
- 充足的留白空间
- 清晰的视觉层级
- 精简的界面元素

### 2. 圆角设计
- 按钮：`rounded-xl` (12px)
- 卡片：`rounded-2xl` (16px)
- 输入框：`rounded-xl` (12px)
- 徽章：`rounded-full`

### 3. 渐变色彩
- 主色调：琥珀色到橙色 `from-amber-500 to-orange-600`
- 成功：绿色 `from-green-500 to-green-600`
- 错误：红色 `from-red-500 to-red-600`
- 信息：蓝色 `from-blue-500 to-blue-600`
- 警告：黄色 `from-yellow-500 to-yellow-600`

### 4. 阴影效果
- 卡片：`shadow-sm` 默认，`shadow-md` 悬停
- 按钮：`shadow-md` 默认，`shadow-lg` 悬停
- 弹窗：`shadow-2xl`

### 5. 动画过渡
- 所有交互都有流畅的过渡动画
- 按钮点击：`active:scale-95`
- 悬停效果：`transition-all`

---

## 📦 组件列表

### 1. ButtonApple - 按钮组件

#### 基本用法
```tsx
import { ButtonApple } from '@/components/ui/apple';

<ButtonApple>默认按钮</ButtonApple>
```

#### 变体
```tsx
// 默认渐变按钮
<ButtonApple variant="default">默认</ButtonApple>

// 危险操作按钮
<ButtonApple variant="destructive">删除</ButtonApple>

// 边框按钮
<ButtonApple variant="outline">取消</ButtonApple>

// 次要按钮
<ButtonApple variant="secondary">次要</ButtonApple>

// 幽灵按钮
<ButtonApple variant="ghost">幽灵</ButtonApple>

// 成功按钮
<ButtonApple variant="success">成功</ButtonApple>

// 信息按钮
<ButtonApple variant="info">信息</ButtonApple>
```

#### 尺寸
```tsx
<ButtonApple size="sm">小按钮</ButtonApple>
<ButtonApple size="default">默认</ButtonApple>
<ButtonApple size="lg">大按钮</ButtonApple>
<ButtonApple size="xl">超大按钮</ButtonApple>
<ButtonApple size="icon">图标</ButtonApple>
```

---

### 2. CardApple - 卡片组件

#### 基本用法
```tsx
import {
  CardApple,
  CardAppleHeader,
  CardAppleTitle,
  CardAppleDescription,
  CardAppleContent,
  CardAppleFooter,
} from '@/components/ui/apple';

<CardApple>
  <CardAppleHeader>
    <CardAppleTitle>卡片标题</CardAppleTitle>
    <CardAppleDescription>卡片描述</CardAppleDescription>
  </CardAppleHeader>
  <CardAppleContent>
    卡片内容
  </CardAppleContent>
  <CardAppleFooter>
    <ButtonApple>操作</ButtonApple>
  </CardAppleFooter>
</CardApple>
```

#### 渐变背景卡片
```tsx
<CardApple className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
  <div className="p-6">
    渐变背景卡片
  </div>
</CardApple>
```

---

### 3. InputApple - 输入框组件

#### 基本用法
```tsx
import { InputApple } from '@/components/ui/apple';

<InputApple
  label="用户名"
  placeholder="请输入用户名"
/>
```

#### 带图标
```tsx
import { User, Lock } from 'lucide-react';

<InputApple
  label="用户名"
  placeholder="请输入用户名"
  leftIcon={<User className="w-5 h-5" />}
/>

<InputApple
  type="password"
  label="密码"
  placeholder="请输入密码"
  leftIcon={<Lock className="w-5 h-5" />}
/>
```

#### 错误状态
```tsx
<InputApple
  label="邮箱"
  placeholder="请输入邮箱"
  error="邮箱格式不正确"
/>
```

---

### 4. BottomSheetApple - 底部弹出菜单

#### 基本用法
```tsx
import { BottomSheetApple } from '@/components/ui/apple';
import { useState } from 'react';

const [isOpen, setIsOpen] = useState(false);

<BottomSheetApple
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="选择配送方式"
>
  <div className="space-y-3">
    <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100">
      外卖配送
    </button>
    <button className="w-full p-4 rounded-xl bg-gray-50 hover:bg-gray-100">
      到店自取
    </button>
  </div>
</BottomSheetApple>
```

---

### 5. LoadingApple - 加载动画

#### 基本用法
```tsx
import { LoadingApple } from '@/components/ui/apple';

// 小尺寸
<LoadingApple size="sm" />

// 中等尺寸（默认）
<LoadingApple size="md" text="加载中..." />

// 大尺寸
<LoadingApple size="lg" text="正在处理..." />

// 全屏加载
<LoadingApple fullScreen text="请稍候..." />
```

#### 骨架屏
```tsx
import { SkeletonApple } from '@/components/ui/apple';

// 文本骨架
<SkeletonApple variant="text" className="w-full" />

// 圆形骨架
<SkeletonApple variant="circular" className="w-12 h-12" />

// 矩形骨架
<SkeletonApple variant="rectangular" className="w-full h-32" />
```

---

### 6. ToastApple - 通知提示

#### 基本用法
```tsx
import { useToastApple, ToastContainerApple } from '@/components/ui/apple';

function App() {
  const toast = useToastApple();

  return (
    <>
      <ButtonApple onClick={() => toast.success('操作成功', '您的订单已提交')}>
        显示成功提示
      </ButtonApple>

      <ButtonApple onClick={() => toast.error('操作失败', '网络连接失败')}>
        显示错误提示
      </ButtonApple>

      <ButtonApple onClick={() => toast.warning('警告', '库存不足')}>
        显示警告提示
      </ButtonApple>

      <ButtonApple onClick={() => toast.info('提示', '新消息')}>
        显示信息提示
      </ButtonApple>

      <ToastContainerApple toasts={toast.toasts} onClose={toast.removeToast} />
    </>
  );
}
```

---

### 7. BadgeApple - 徽章组件

#### 基本用法
```tsx
import { BadgeApple } from '@/components/ui/apple';

<BadgeApple>默认</BadgeApple>
```

#### 变体
```tsx
<BadgeApple variant="default">默认</BadgeApple>
<BadgeApple variant="secondary">次要</BadgeApple>
<BadgeApple variant="destructive">危险</BadgeApple>
<BadgeApple variant="outline">边框</BadgeApple>
<BadgeApple variant="success">成功</BadgeApple>
<BadgeApple variant="warning">警告</BadgeApple>
<BadgeApple variant="info">信息</BadgeApple>
```

#### 尺寸
```tsx
<BadgeApple size="sm">小</BadgeApple>
<BadgeApple size="default">默认</BadgeApple>
<BadgeApple size="lg">大</BadgeApple>
```

#### 带圆点
```tsx
<BadgeApple dot>在线</BadgeApple>
```

---

## 🎯 使用建议

### 1. 颜色使用
- **主要操作**：使用默认的琥珀色到橙色渐变
- **危险操作**：使用红色渐变（删除、取消订单等）
- **成功反馈**：使用绿色渐变
- **次要操作**：使用灰色或边框样式

### 2. 间距系统
- 使用 Tailwind 的间距系统：`p-4`, `p-6`, `gap-3`, `gap-4`
- 卡片内边距：`p-4` 或 `p-6`
- 元素间距：`gap-3` 或 `gap-4`
- 页面边距：`px-6 py-6`

### 3. 字体大小
- 标题：`text-2xl` 或 `text-3xl`
- 副标题：`text-lg`
- 正文：`text-sm` 或 `text-base`
- 辅助文字：`text-xs`

### 4. 响应式设计
- 移动优先：默认为移动端设计
- 使用 `max-w-2xl mx-auto` 限制最大宽度
- 使用 `grid grid-cols-1 md:grid-cols-2` 实现响应式网格

### 5. 交互反馈
- 所有可点击元素都应该有 `hover` 和 `active` 状态
- 使用 `transition-all` 或 `transition-colors` 实现平滑过渡
- 按钮点击使用 `active:scale-95` 缩放效果

---

## 📱 完整示例

### 登录页面
```tsx
import {
  CardApple,
  CardAppleContent,
  InputApple,
  ButtonApple,
  useToastApple,
  ToastContainerApple,
} from '@/components/ui/apple';
import { User, Lock } from 'lucide-react';

function LoginPage() {
  const toast = useToastApple();

  const handleLogin = () => {
    toast.success('登录成功', '欢迎回来！');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <CardApple className="w-full max-w-md">
        <CardAppleContent className="p-6 space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              欢迎回来
            </h1>
            <p className="text-gray-600">
              登录您的账户
            </p>
          </div>

          <InputApple
            label="用户名"
            placeholder="请输入用户名"
            leftIcon={<User className="w-5 h-5" />}
          />

          <InputApple
            type="password"
            label="密码"
            placeholder="请输入密码"
            leftIcon={<Lock className="w-5 h-5" />}
          />

          <ButtonApple
            className="w-full"
            size="lg"
            onClick={handleLogin}
          >
            登录
          </ButtonApple>

          <ButtonApple
            variant="ghost"
            className="w-full"
          >
            忘记密码？
          </ButtonApple>
        </CardAppleContent>
      </CardApple>

      <ToastContainerApple toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}
```

---

## 🚀 开始使用

### 1. 导入组件
```tsx
import { ButtonApple, CardApple, InputApple } from '@/components/ui/apple';
```

### 2. 使用组件
按照上面的示例使用各个组件

### 3. 自定义样式
所有组件都支持 `className` 属性，可以使用 Tailwind CSS 进行自定义

---

## 📝 注意事项

1. **俄语优先**：所有文本内容默认使用俄语
2. **配置驱动**：尽可能从配置系统读取数据
3. **响应式设计**：确保在移动端和桌面端都有良好的体验
4. **性能优化**：使用懒加载和代码分割
5. **无障碍访问**：确保所有组件都有适当的 ARIA 标签

---

## 🎉 总结

CHU TEA Apple Design System 提供了一套完整的、遵循 Apple 设计规范的 UI 组件库，帮助您快速构建优雅、现代的用户界面。

所有组件都经过精心设计，确保在各种设备和场景下都能提供最佳的用户体验。
