import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-500',
    icon: 'text-green-600',
    text: 'text-green-900',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    icon: 'text-red-600',
    text: 'text-red-900',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    icon: 'text-yellow-600',
    text: 'text-yellow-900',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    icon: 'text-blue-600',
    text: 'text-blue-900',
  },
};

export function ToastApple({
  id,
  type,
  title,
  description,
  duration = 3000,
  onClose,
}: ToastProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-2xl shadow-lg border-l-4 backdrop-blur-sm",
        "animate-in slide-in-from-top-5 fade-in",
        colors.bg,
        colors.border
      )}
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", colors.icon)} />
      
      <div className="flex-1 min-w-0">
        <h4 className={cn("font-semibold text-sm mb-1", colors.text)}>
          {title}
        </h4>
        {description && (
          <p className={cn("text-sm opacity-90", colors.text)}>
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="w-6 h-6 rounded-full hover:bg-black/10 active:bg-black/20 flex items-center justify-center transition-colors flex-shrink-0"
      >
        <X className={cn("w-4 h-4", colors.icon)} />
      </button>
    </div>
  );
}

// Toast容器
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export function ToastContainerApple({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastApple key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Toast Hook
interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export function useToastApple() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { ...toast, id }]);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'success', title, description, duration });
    },
    [addToast]
  );

  const error = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'error', title, description, duration });
    },
    [addToast]
  );

  const warning = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'warning', title, description, duration });
    },
    [addToast]
  );

  const info = React.useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'info', title, description, duration });
    },
    [addToast]
  );

  return {
    toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
