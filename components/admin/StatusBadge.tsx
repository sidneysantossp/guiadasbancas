"use client";

import React from "react";

type Tone = "gray" | "emerald" | "amber" | "orange" | "red" | "blue";

const tones: Record<Tone, string> = {
  gray: "bg-gray-100 text-gray-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  orange: "bg-orange-50 text-orange-700",
  red: "bg-red-50 text-red-700",
  blue: "bg-blue-50 text-blue-700",
};

export interface StatusBadgeProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export default function StatusBadge({ label, tone = "gray", className = "" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-[2px] text-xs ${tones[tone]} ${className}`}>
      {label}
    </span>
  );
}
