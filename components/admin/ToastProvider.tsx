"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
  timeout?: number;
};

type ToastContextType = {
  show: (message: string, kind?: ToastKind, timeout?: number) => void;
  success: (message: string, timeout?: number) => void;
  error: (message: string, timeout?: number) => void;
  info: (message: string, timeout?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message: string, kind: ToastKind = "info", timeout = 2500) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const item: ToastItem = { id, kind, message, timeout };
    setItems((prev) => [...prev, item]);
    if (timeout && timeout > 0) {
      setTimeout(() => remove(id), timeout);
    }
  }, [remove]);

  const api = useMemo<ToastContextType>(() => ({
    show: push,
    success: (m, t) => push(m, "success", t),
    error: (m, t) => push(m, "error", t),
    info: (m, t) => push(m, "info", t),
  }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 w-[90vw] max-w-sm">
        {items.map((t) => (
          <div key={t.id} className={`flex items-start gap-2 rounded-lg border px-3 py-2 shadow bg-white ${
            t.kind === 'success' ? 'border-emerald-200' : t.kind === 'error' ? 'border-red-200' : 'border-gray-200'
          }`}>
            <div className={`mt-0.5 text-sm ${t.kind === 'success' ? 'text-emerald-600' : t.kind === 'error' ? 'text-red-600' : 'text-gray-700'}`}>{t.message}</div>
            <button onClick={() => remove(t.id)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
