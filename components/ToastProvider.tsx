"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode, useEffect } from "react";

type Toast = { id: number; message: ReactNode };

type ToastContextType = {
  show: (message: ReactNode, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const show = useCallback((message: ReactNode, durationMs: number = 2200) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container visual */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[9999] flex w-full justify-center px-4">
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto rounded-md bg-black/85 text-white px-3 py-2 text-sm shadow-lg">
              {t.message}
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
