import * as React from 'react';
import { cn } from '@/lib/utils';

interface LoadingAppleProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingApple({
  size = 'md',
  text,
  fullScreen = false,
  className,
}: LoadingAppleProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className={cn("relative", sizeClasses[size])}>
      {/* 外圈 */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
      {/* 旋转的渐变圈 */}
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 border-r-orange-600 animate-spin" />
    </div>
  );

  const content = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {spinner}
      {text && (
        <p className="text-sm font-medium text-gray-600">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
}

// 骨架屏组件
interface SkeletonAppleProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function SkeletonApple({ className, variant = 'rectangular' }: SkeletonAppleProps) {
  const variantClasses = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        variantClasses[variant],
        className
      )}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}

// 添加shimmer动画的CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;
  document.head.appendChild(style);
}
