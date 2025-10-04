"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode, useEffect } from "react";

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Toast = { 
  id: number; 
  message: ReactNode;
  type: ToastType;
};

type ToastContextType = {
  show: (message: ReactNode, durationMs?: number) => void;
  success: (message: ReactNode, durationMs?: number) => void;
  error: (message: ReactNode, durationMs?: number) => void;
  warning: (message: ReactNode, durationMs?: number) => void;
  info: (message: ReactNode, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const toastStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-500 text-white',
};

const toastIcons = {
  success: 'fa-regular fa-circle-check',
  error: 'fa-regular fa-circle-xmark',
  warning: 'fa-regular fa-circle-exclamation',
  info: 'fa-regular fa-circle-info',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const showToast = useCallback((message: ReactNode, type: ToastType, durationMs: number = 3000) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const show = useCallback((message: ReactNode, durationMs?: number) => {
    showToast(message, 'info', durationMs);
  }, [showToast]);

  const success = useCallback((message: ReactNode, durationMs?: number) => {
    showToast(message, 'success', durationMs);
  }, [showToast]);

  const error = useCallback((message: ReactNode, durationMs?: number) => {
    showToast(message, 'error', durationMs);
  }, [showToast]);

  const warning = useCallback((message: ReactNode, durationMs?: number) => {
    showToast(message, 'warning', durationMs);
  }, [showToast]);

  const info = useCallback((message: ReactNode, durationMs?: number) => {
    showToast(message, 'info', durationMs);
  }, [showToast]);

  const value = useMemo(() => ({ show, success, error, warning, info }), [show, success, error, warning, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container visual */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex w-full justify-center px-4">
        <div className="flex flex-col gap-2 w-full max-w-md">
          {toasts.map((t) => (
            <div 
              key={t.id} 
              className={`pointer-events-auto rounded-lg ${toastStyles[t.type]} px-4 py-3 text-sm font-medium shadow-lg flex items-center gap-3 animate-in slide-in-from-top duration-300`}
            >
              <i className={`${toastIcons[t.type]} text-lg`}></i>
              <span className="flex-1">{t.message}</span>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
