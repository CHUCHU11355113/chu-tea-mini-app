import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
        outline:
          "border-2 border-gray-300 text-gray-700 bg-white",
        success:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm",
        warning:
          "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm",
        info:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function BadgeApple({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      )}
      {children}
    </div>
  );
}

export { BadgeApple, badgeVariants };
