"use client";

import React from "react";

interface FiltersBarProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
  onReset?: () => void;
}

export default function FiltersBar({ children, actions, onReset }: FiltersBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {children}
        {actions && (
          <div className="flex md:justify-end gap-2">
            {onReset && (
              <button type="button" onClick={onReset} className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Limpar</button>
            )}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
