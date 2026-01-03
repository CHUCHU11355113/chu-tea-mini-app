import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheetApple({
  isOpen,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* 底部弹出内容 */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white rounded-t-3xl shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          "max-h-[90vh] overflow-hidden flex flex-col",
          className
        )}
      >
        {/* 拖动指示器 */}
        <div className="flex items-center justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* 标题栏 */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 active:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* 安全区域 */}
        <div className="h-safe-bottom bg-white" />
      </div>
    </>
  );
}
