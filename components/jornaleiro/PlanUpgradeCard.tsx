"use client";

import Link from "next/link";
import type { UpgradeContext } from "@/lib/plan-messaging";

type Props = {
  currentPlanType: string | null | undefined;
  currentPlanName?: string | null;
  context: UpgradeContext;
  productLimit?: number | null;
  currentCount?: number | null;
  targetPlanPriceLabel?: string | null;
  targetPlanPromotionLabel?: string | null;
  targetPlanTrialDays?: number | null;
  targetPlanTrialAvailable?: boolean | null;
  className?: string;
  showSupportAction?: boolean;
  primaryHref?: string;
  onPrimaryAction?: () => void;
};

export default function PlanUpgradeCard(props: Props) {
  const limitText = props.productLimit
    ? `${props.currentCount || 0}/${props.productLimit} produtos`
    : "catálogo limitado";

  return (
    <div className={`rounded-lg border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900 ${props.className || ""}`}>
      <div className="font-semibold">Plano gratuito em uso</div>
      <p className="mt-1 text-orange-800">
        Seu plano atual está em {limitText}. Renove para liberar os produtos dos distribuidores e remover o limite operacional.
      </p>
      {props.onPrimaryAction ? (
        <button
          type="button"
          onClick={props.onPrimaryAction}
          className="mt-3 inline-flex rounded-md bg-[#ff5c00] px-3 py-2 text-xs font-semibold text-white hover:bg-[#e65300]"
        >
          Renovar meu plano
        </button>
      ) : (
        <Link
          href={props.primaryHref || "/jornaleiro/dashboard"}
          className="mt-3 inline-flex rounded-md bg-[#ff5c00] px-3 py-2 text-xs font-semibold text-white hover:bg-[#e65300]"
        >
          Renovar meu plano
        </Link>
      )}
    </div>
  );
}
