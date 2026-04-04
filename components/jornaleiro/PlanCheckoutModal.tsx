"use client";

import { useEffect, useMemo, useState } from "react";

type Plan = {
  id: string;
  name: string;
  type: string;
  price: number;
  effective_price?: number;
  original_price?: number | null;
  promotion_label?: string | null;
  billing_cycle?: string | null;
  description?: string | null;
  trial_days?: number;
  trial_available?: boolean;
};

type CheckoutResult = {
  id: string | null;
  asaas_id: string | null;
  asaas_subscription_id: string | null;
  invoice_url: string | null;
  bank_slip_url: string | null;
  pix_qrcode: string | null;
  pix_code: string | null;
  due_date: string;
  amount: number;
  recurring: boolean;
  original_amount?: number | null;
  promotion_label?: string | null;
  trial_days_applied?: number;
  trial_ends_at?: string | null;
};

type Props = {
  open: boolean;
  targetPlanType?: string | null;
  bancaName?: string | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
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

export default function PlanCheckoutModal({ open, targetPlanType, bancaName, onClose, onSuccess }: Props) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [billingType, setBillingType] = useState<"PIX" | "BOLETO">("PIX");
  const [processing, setProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setBillingType("PIX");
      setCheckoutResult(null);
      setError(null);
      return;
    }

    const loadPlans = async () => {
      try {
        setLoadingPlans(true);
        setError(null);
        const res = await fetch("/api/jornaleiro/plans", {
          cache: "no-store",
          credentials: "include",
        });
        const json = await res.json();
        if (!res.ok || json?.success === false) {
          throw new Error(json?.error || "Não foi possível carregar os planos");
        }
        setPlans(
          (json.data || []).filter(
            (plan: Plan) => plan?.type && Number(plan.effective_price ?? plan.price ?? 0) > 0
          )
        );
      } catch (loadError: any) {
        setError(loadError?.message || "Não foi possível carregar os planos");
      } finally {
        setLoadingPlans(false);
      }
    };

    loadPlans();
  }, [open]);

  const selectedPlan = useMemo(() => {
    if (!plans.length) return null;

    if (targetPlanType) {
      const byType = plans.find((plan) => plan.type === targetPlanType);
      if (byType) return byType;
    }

    const premiumPlan = plans.find((plan) => plan.type === "premium");
    if (premiumPlan) return premiumPlan;

    return plans[0] || null;
  }, [plans, targetPlanType]);

  const displayPrice = Number(selectedPlan?.effective_price ?? selectedPlan?.price ?? 0);

  const handleCheckout = async () => {
    if (!selectedPlan) return;

    try {
      setProcessing(true);
      setError(null);
      const res = await fetch("/api/jornaleiro/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          billing_type: billingType,
        }),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Não foi possível gerar a assinatura");
      }
      setCheckoutResult(json.payment || null);
      if (onSuccess) {
        await onSuccess();
      }
    } catch (checkoutError: any) {
      setError(checkoutError?.message || "Não foi possível gerar a assinatura");
    } finally {
      setProcessing(false);
    }
  };

  const copyPixCode = async () => {
    if (!checkoutResult?.pix_code) return;
    await navigator.clipboard.writeText(checkoutResult.pix_code);
    window.alert("Código PIX copiado!");
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {checkoutResult ? "Licença criada" : "Ativar Premium desta banca"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {checkoutResult
                ? checkoutResult.trial_days_applied
                  ? "O período grátis desta banca já começou e a primeira cobrança ficou agendada para o fim desse prazo."
                  : "A primeira cobrança desta licença já foi gerada. Conclua o pagamento para confirmar o Premium."
                : "Escolha como quer ativar a licença Premium desta banca no Asaas."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Fechar modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loadingPlans ? (
          <div className="p-6 text-sm text-gray-500">Carregando planos disponíveis...</div>
        ) : error ? (
          <div className="space-y-4 p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : !selectedPlan ? (
          <div className="space-y-4 p-6">
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              Nenhum plano pago disponível para este upgrade no momento.
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : !checkoutResult ? (
          <div className="space-y-6 p-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
                  Licença selecionada
                </span>
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
                  {selectedPlan.name}
                </span>
                {bancaName ? (
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
                    {bancaName}
                  </span>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                {selectedPlan.original_price ? (
                  <span className="text-sm text-gray-400 line-through">
                    {formatCurrency(selectedPlan.original_price)}
                  </span>
                ) : null}
                <span className="text-3xl font-bold text-[#ff5c00]">
                  {formatCurrency(displayPrice)}
                </span>
                <span className="pb-1 text-sm text-gray-500">
                  /{BILLING_CYCLES[selectedPlan.billing_cycle || "monthly"] || "mês"}
                </span>
              </div>
              {selectedPlan.description ? (
                <p className="mt-2 text-sm text-gray-600">{selectedPlan.description}</p>
              ) : null}
              {selectedPlan.promotion_label ? (
                <div className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-700">
                  {selectedPlan.promotion_label}
                </div>
              ) : null}
              {selectedPlan.trial_available && Number(selectedPlan.trial_days || 0) > 0 ? (
                <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-700">
                  Você terá <strong>{selectedPlan.trial_days} dias grátis</strong> antes do vencimento da primeira cobrança.
                </div>
              ) : null}
              <p className="mt-3 text-sm text-gray-600">
                {selectedPlan.trial_available && Number(selectedPlan.trial_days || 0) > 0
                  ? "A cobrança já fica programada no Asaas, mas o vencimento só chega depois do período grátis."
                  : "A primeira cobrança é gerada agora. Depois disso, o Asaas passa a gerir a recorrência desta licença."}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">Como ativar a primeira cobrança</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingType("PIX")}
                  className={`rounded-2xl border-2 p-4 text-center transition ${
                    billingType === "PIX"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl">📱</div>
                  <div className="mt-2 font-semibold text-gray-900">PIX</div>
                  <div className="mt-1 text-xs text-gray-500">Mais rápido para confirmar a licença</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingType("BOLETO")}
                  className={`rounded-2xl border-2 p-4 text-center transition ${
                    billingType === "BOLETO"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl">📄</div>
                  <div className="mt-2 font-semibold text-gray-900">Boleto</div>
                  <div className="mt-1 text-xs text-gray-500">Prazo bancário tradicional</div>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <div className="font-semibold text-gray-900">Regra desta ativação</div>
              <ul className="mt-3 space-y-2">
                <li>• 1 banca = 1 licença. Esta ativação vale só para a unidade atual.</li>
                <li>• O Free continua liberando operação básica enquanto você decide o upgrade.</li>
                <li>• Distribuidores, campanhas, publi editorial, destaque e colaboradores entram no Premium.</li>
              </ul>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Agora não
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={processing}
                className="rounded-xl bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#ff7a33] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? "Gerando ativação..." : "Gerar ativação no Asaas"}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {checkoutResult.trial_days_applied
                ? `A licença Premium foi criada e o período grátis vai até ${new Date(checkoutResult.trial_ends_at || checkoutResult.due_date).toLocaleDateString("pt-BR")}.`
                : "A licença Premium foi criada. Falta apenas pagar a primeira cobrança para confirmar o novo plano."}
            </div>

            {billingType === "PIX" && checkoutResult.pix_qrcode ? (
              <>
                <div className="text-center">
                  <div className="inline-block rounded-2xl border border-gray-200 bg-white p-4">
                    <img
                      src={`data:image/png;base64,${checkoutResult.pix_qrcode}`}
                      alt="QR Code PIX"
                      className="mx-auto h-52 w-52"
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Escaneie o QR Code ou copie o código abaixo para pagar a primeira cobrança desta licença.
                  </p>
                </div>
                {checkoutResult.promotion_label ? (
                  <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-700">
                    {checkoutResult.promotion_label}
                  </div>
                ) : null}
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Código PIX</p>
                  <p className="mt-1 break-all font-mono text-xs text-gray-700">
                    {checkoutResult.pix_code?.substring(0, 120)}...
                  </p>
                  <button
                    type="button"
                    onClick={copyPixCode}
                    className="mt-3 w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Copiar código PIX
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="font-medium text-blue-700">Primeira cobrança por boleto gerada.</p>
                <p className="mt-2 text-sm text-gray-600">
                  Vencimento: {new Date(checkoutResult.due_date).toLocaleDateString("pt-BR")}
                </p>
                {checkoutResult.bank_slip_url || checkoutResult.invoice_url ? (
                  <a
                    href={checkoutResult.bank_slip_url || checkoutResult.invoice_url || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Visualizar boleto
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">
                    O link do boleto ainda está sendo sincronizado. Atualize a página em instantes.
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Continuar no painel
              </button>
              <a
                href="/jornaleiro/meu-plano"
                className="rounded-xl bg-[#ff5c00] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#ff7a33]"
              >
                Ver detalhes da licença
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
