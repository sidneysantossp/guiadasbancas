"use client";

export default function DistanceBadge({ distanceKm }: { distanceKm: number | null | undefined }) {
  if (distanceKm == null || !isFinite(distanceKm)) return null;
  const clamped = Math.max(1, Math.min(3, distanceKm));
  const label = `${clamped.toFixed(1)} km${distanceKm > 3 ? "+" : ""}`;
  return (
    <span className="inline-block rounded-full bg-[#fff3ec] border border-[#ffe2d2] px-2 py-0.5 text-[10px] font-semibold text-[#ff5c00] shadow-sm leading-none">
      {label}
    </span>
  );
}
