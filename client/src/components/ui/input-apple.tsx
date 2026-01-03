import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputApple = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm transition-colors",
              "placeholder:text-gray-400",
              "focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              leftIcon && "pl-12",
              rightIcon && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
InputApple.displayName = 'InputApple';

export { InputApple };
