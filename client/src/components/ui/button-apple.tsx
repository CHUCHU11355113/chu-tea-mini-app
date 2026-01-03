import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-700",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700",
        outline:
          "border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost:
          "hover:bg-gray-100 text-gray-900",
        link:
          "text-amber-600 underline-offset-4 hover:underline",
        success:
          "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700",
        info:
          "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ButtonApple = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonApple.displayName = 'ButtonApple';

export { ButtonApple, buttonVariants };
