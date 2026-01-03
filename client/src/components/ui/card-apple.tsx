import * as React from 'react';
import { cn } from '@/lib/utils';

const CardApple = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md",
      className
    )}
    {...props}
  />
));
CardApple.displayName = 'CardApple';

const CardAppleHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardAppleHeader.displayName = 'CardAppleHeader';

const CardAppleTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-bold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
));
CardAppleTitle.displayName = 'CardAppleTitle';

const CardAppleDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600", className)}
    {...props}
  />
));
CardAppleDescription.displayName = 'CardAppleDescription';

const CardAppleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardAppleContent.displayName = 'CardAppleContent';

const CardAppleFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardAppleFooter.displayName = 'CardAppleFooter';

export { CardApple, CardAppleHeader, CardAppleFooter, CardAppleTitle, CardAppleDescription, CardAppleContent };
