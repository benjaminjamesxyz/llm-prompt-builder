import { createPortal } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({ message, type, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const bgColor = {
    success: 'bg-success',
    error: 'bg-accent',
    info: 'bg-primary'
  }[type];
  
  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  }[type];
  
  return createPortal(
    <div 
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className={`${bgColor} text-bg px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        <span className="text-lg font-bold">{icon}</span>
        <span className="flex-1 text-sm">{message}</span>
        {onClose && (
          <button 
            onClick={() => setIsVisible(false)}
            className="text-bg/70 hover:text-bg transition-colors"
            aria-label="Close notification"
          >
            ✕
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

let toastId = 0;
const activeToasts = new Map<number, { id: number; remove: () => void }>();

export const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
  const id = ++toastId;
  
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const remove = () => {
    activeToasts.delete(id);
    if (document.body.contains(toastElement)) {
      document.body.removeChild(toastElement);
    }
  };
  
  activeToasts.set(id, { id, remove });
  
  import('preact').then(({ render }) => {
    render(
      <Toast 
        message={message} 
        type={type} 
        duration={duration}
        onClose={remove}
      />,
      toastElement
    );
  });
};

export const clearAllToasts = () => {
  activeToasts.forEach(({ remove }) => remove());
  activeToasts.clear();
};
