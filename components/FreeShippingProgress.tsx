"use client";

import React from "react";
import { shippingConfig } from "@/components/shippingConfig";

export type FreeShippingProgressProps = {
  subtotal: number;
  className?: string;
  size?: "sm" | "md";
  showHeader?: boolean;
  showMessage?: boolean;
};

export default function FreeShippingProgress({
  subtotal,
  className,
  size = "md",
  showHeader = true,
  showMessage = true,
}: FreeShippingProgressProps) {
  const threshold = shippingConfig.freeShippingThreshold;
  const qualifies = shippingConfig.freeShippingEnabled || subtotal >= threshold;
  const pct = Math.min(100, Math.round((subtotal / Math.max(1, threshold)) * 100));
  const remain = Math.max(0, threshold - subtotal);
  const barH = size === "sm" ? "h-1.5" : "h-2";
  const textSize = size === "sm" ? "text-[11px]" : "text-[12px]";

  return (
    <div className={className}>
      {showHeader && (
        <div className={`flex items-center justify-between ${textSize} text-gray-600`}>
          <span>Meta frete grátis</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className={`${barH} mt-1 rounded-full bg-gray-200 overflow-hidden`}>
        <div
          className={`h-full ${qualifies ? "bg-emerald-500" : "bg-[#ff5c00]"}`}
          style={{ width: `${Math.min(100, (subtotal / Math.max(1, threshold)) * 100)}%` }}
        />
      </div>
      {showMessage && (
        !qualifies ? (
          <div className={`${textSize} mt-1 text-gray-700`}>
            Faltam R$ {remain.toFixed(2)} para ganhar frete grátis.
          </div>
        ) : (
          <div className={`${textSize} mt-1 text-emerald-700 font-medium`}>
            Você ganhou frete grátis!
          </div>
        )
      )}
    </div>
  );
}
