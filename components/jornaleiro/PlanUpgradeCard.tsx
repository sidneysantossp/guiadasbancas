"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getPlanLabel, getPlanUpgradeHint, type UpgradeContext } from "@/lib/plan-messaging";

type TargetPlan = {
  id: string;
  name: string;
  type: string;
  price: number;
  effective_price?: number;
  billing_cycle?: string | null;
  promotion_label?: string | null;
  trial_days?: number;
  trial_available?: boolean;
};

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

const BILLING_CYCLES: Record<string, string> = {
  monthly: "mês",
  quarterly: "trimestre",
  semiannual: "semestre",
  annual: "ano",
};

function formatCurrency(value: number) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatPlanPriceLabel(plan: TargetPlan | null): string | null {
  if (!plan) return null;

  const displayPrice = Number(plan.effective_price ?? plan.price ?? 0);
  if (!(displayPrice > 0)) return null;

  return `${plan.name} por ${formatCurrency(displayPrice)}/${BILLING_CYCLES[plan.billing_cycle || "monthly"] || "mês"}`;
}

const TONE_CLASSES = {
  orange: {
    wrapper: "border-orange-200 bg-orange-50 text-orange-950",
    badge: "bg-white text-[#ff5c00]",
    primary: "bg-[#ff5c00] text-white hover:bg-[#ff7a33]",
  },
  blue: {
    wrapper: "border-blue-200 bg-blue-50 text-slate-950",
    badge: "bg-white text-blue-700",
    primary: "bg-slate-900 text-white hover:bg-slate-800",
  },
  green: {
    wrapper: "border-green-200 bg-green-50 text-green-950",
    badge: "bg-white text-green-700",
    primary: "bg-green-700 text-white hover:bg-green-800",
  },
} as const;

export default function PlanUpgradeCard({
  currentPlanType,
  currentPlanName,
  context,
  productLimit,
  currentCount,
  targetPlanPriceLabel,
  targetPlanPromotionLabel,
  targetPlanTrialDays,
  targetPlanTrialAvailable,
  className = "",
  showSupportAction = false,
  primaryHref = "/jornaleiro/meu-plano",
  onPrimaryAction,
}: Props) {
  const [resolvedTargetPlan, setResolvedTargetPlan] = useState<TargetPlan | null>(null);
  const hint = getPlanUpgradeHint({
    currentPlanType,
    currentPlanName,
    context,
    productLimit,
    currentCount,
  });
  const tone = TONE_CLASSES[hint.tone];
  const resolvedPlanLabel = currentPlanName || getPlanLabel(currentPlanType);
  const needsTargetPlanLookup = useMemo(() => {
    if (!hint.targetPlanType) return false;
    if (!targetPlanPriceLabel) return true;
    if (targetPlanPromotionLabel === undefined) return true;
    if (targetPlanTrialAvailable === undefined) return true;
    if (targetPlanTrialAvailable && targetPlanTrialDays == null) return true;
    return false;
  }, [
    hint.targetPlanType,
    targetPlanPriceLabel,
    targetPlanPromotionLabel,
    targetPlanTrialAvailable,
    targetPlanTrialDays,
  ]);

  useEffect(() => {
    if (!hint.targetPlanType || !needsTargetPlanLookup) {
      setResolvedTargetPlan(null);
      return;
    }

    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/jornaleiro/plans", {
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) {
          throw new Error(json?.error || "Não foi possível carregar os planos");
        }

        const targetPlan = (json.data || []).find((plan: TargetPlan) => plan?.type === hint.targetPlanType) || null;
        if (active) {
          setResolvedTargetPlan(targetPlan);
        }
      } catch {
        if (active) {
          setResolvedTargetPlan(null);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [hint.targetPlanType, needsTargetPlanLookup]);

  const resolvedPriceLabel = targetPlanPriceLabel ?? formatPlanPriceLabel(resolvedTargetPlan);
  const resolvedPromotionLabel =
    targetPlanPromotionLabel !== undefined
      ? targetPlanPromotionLabel
      : resolvedTargetPlan?.promotion_label ?? null;
  const resolvedTrialAvailable =
    typeof targetPlanTrialAvailable === "boolean"
      ? targetPlanTrialAvailable
      : Boolean(resolvedTargetPlan?.trial_available);
  const resolvedTrialDays =
    targetPlanTrialDays != null
      ? targetPlanTrialDays
      : resolvedTargetPlan?.trial_days ?? null;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${tone.wrapper} ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone.badge}`}>
          Plano atual: {resolvedPlanLabel}
        </span>
        {hint.targetPlanLabel ? (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone.badge}`}>
            Próximo passo: {hint.targetPlanLabel}
          </span>
        ) : null}
        {resolvedPriceLabel ? (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone.badge}`}>
            {resolvedPriceLabel}
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 text-lg font-semibold">{hint.title}</h3>
      <p className="mt-2 text-sm leading-6 opacity-90">{hint.description}</p>

      {resolvedPromotionLabel || (resolvedTrialAvailable && Number(resolvedTrialDays || 0) > 0) ? (
        <div className={`mt-4 rounded-xl px-3 py-3 text-sm ${tone.badge}`}>
          {resolvedPromotionLabel ? (
            <p className="font-semibold">{resolvedPromotionLabel}</p>
          ) : null}
          {resolvedTrialAvailable && Number(resolvedTrialDays || 0) > 0 ? (
            <p className={resolvedPromotionLabel ? "mt-1" : ""}>
              Inclui <strong>{resolvedTrialDays} dias grátis</strong> antes da primeira cobrança.
            </p>
          ) : null}
        </div>
      ) : null}

      <ul className="mt-4 space-y-2 text-sm">
        {hint.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {typeof productLimit === "number" && productLimit > 0 ? (
        <div className={`mt-4 rounded-xl px-3 py-2 text-xs font-medium ${tone.badge}`}>
          Limite atual do plano: {productLimit} produtos próprios.
          {typeof currentCount === "number" ? ` Você já usou ${currentCount}.` : ""}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {onPrimaryAction ? (
          <button
            type="button"
            onClick={onPrimaryAction}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tone.primary}`}
          >
            {hint.primaryLabel}
          </button>
        ) : (
          <Link
            href={primaryHref}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tone.primary}`}
          >
            {hint.primaryLabel}
          </Link>
        )}
        {showSupportAction ? (
          <a
            href="https://wa.me/5511994683425?text=Ol%C3%A1!%20Quero%20entender%20qual%20plano%20faz%20mais%20sentido%20para%20minha%20banca%20no%20Guia%20das%20Bancas."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-current/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-white/80"
          >
            Falar com a equipe
          </a>
        ) : null}
      </div>
    </div>
  );
}
