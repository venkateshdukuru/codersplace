//hackathon page 


import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive';
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-80 rounded-lg border p-4 shadow-lg bg-white ${
              toast.variant === 'success'
                ? 'border-green-200 bg-green-50'
                : toast.variant === 'destructive'
                ? 'border-red-200 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  toast.variant === 'success'
                    ? 'text-green-900'
                    : toast.variant === 'destructive'
                    ? 'text-red-900'
                    : 'text-gray-900'
                }`}>
                  {toast.title}
                </p>
                {toast.description && (
                  <p className={`text-sm mt-1 ${
                    toast.variant === 'success'
                      ? 'text-green-700'
                      : toast.variant === 'destructive'
                      ? 'text-red-700'
                      : 'text-gray-700'
                  }`}>
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`ml-2 text-gray-400 hover:text-gray-600 ${
                  toast.variant === 'success'
                    ? 'text-green-500 hover:text-green-700'
                    : toast.variant === 'destructive'
                    ? 'text-red-500 hover:text-red-700'
                    : ''
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};