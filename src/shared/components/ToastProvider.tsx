import React, {createContext, useCallback, useContext, useState} from 'react';
import {Toast} from '../components/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({children}: {children: React.ReactNode}) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, {id, message, type}]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
