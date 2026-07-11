"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  open: boolean;
  targetPlanType?: string | null;
  bancaName?: string | null;
  distributorEligible?: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

type PlanOption = {
  id: string;
  name: string;
  type: string;
  price: number;
  effective_price?: number;
  original_price?: number | null;
  promotion_label?: string | null;
  trial_days?: number;
};

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function imageSource(value?: string | null) {
  const source = String(value || "").trim();
  if (!source) return "";
  if (source.startsWith("data:image/")) return source;
  if (/^https?:\/\//i.test(source)) return source;
  return `data:image/png;base64,${source}`;
}

export default function PlanCheckoutModal(props: Props) {
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (!props.open) return;

    const loadPlans = async () => {
      try {
        setLoading(true);
        setError("");
        setPayment(null);
        const response = await fetch("/api/jornaleiro/plans", {
          credentials: "include",
          cache: "no-store",
        });
        const json = await response.json();
        if (!response.ok || json?.success === false) {
          throw new Error(json?.error || "Erro ao carregar planos");
        }
        const paidPlans = (json.data || []).filter((plan: PlanOption) => {
          const planType = String(plan.type || "").toLowerCase();
          return planType !== "free" && Number(plan.effective_price ?? plan.price ?? 0) > 0;
        });
        setPlans(paidPlans);
        setSelectedPlanId((current) => current || paidPlans[0]?.id || "");
      } catch (err: any) {
        setError(err?.message || "Erro ao carregar planos");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [props.open]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[0] || null,
    [plans, selectedPlanId]
  );
  const paymentImageSrc = imageSource(payment?.pix_qrcode) || imageSource(payment?.invoice_url) || imageSource(payment?.bank_slip_url);

  if (!props.open) return null;

  const submit = async () => {
    if (!selectedPlan?.id) return;

    try {
      setSubmitting(true);
      setError("");
      const response = await fetch("/api/jornaleiro/subscription", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          billing_type: "PIX",
        }),
      });
      const json = await response.json();
      if (!response.ok || json?.success === false) {
        throw new Error(json?.error || "Erro ao iniciar pagamento");
      }
      setPayment(json.payment || null);
      await props.onSuccess?.();
    } catch (err: any) {
      setError(err?.message || "Erro ao iniciar pagamento");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ff5c00]">Renovar plano</div>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              {props.distributorEligible
                ? "Voltar a exibir os produtos dos distribuidores"
                : "Ampliar o catálogo da sua banca"}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {props.bancaName ? `${props.bancaName}: ` : ""}
              {props.distributorEligible
                ? "após a confirmação, o catálogo parceiro volta automaticamente."
                : "após a confirmação, o limite do catálogo próprio é ampliado automaticamente."}
            </p>
          </div>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="rounded-md border border-dashed border-gray-300 px-4 py-5 text-sm text-gray-500">
              Carregando planos...
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              Nenhum plano pago ativo foi encontrado.
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {plans.map((plan) => {
                  const effectivePrice = Number(plan.effective_price ?? plan.price ?? 0);
                  const originalPrice = Number(plan.original_price ?? plan.price ?? 0);
                  const hasPromotion = originalPrice > effectivePrice;
                  const selected = selectedPlanId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected ? "border-[#ff5c00] bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-gray-900">{plan.name}</div>
                          <div className="mt-1 text-sm text-gray-600">
                            {props.distributorEligible
                              ? "Catálogo dos distribuidores, mais capacidade para produtos próprios e recursos premium."
                              : "Mais capacidade para produtos próprios e recursos premium para sua banca."}
                          </div>
                          {plan.trial_days ? (
                            <div className="mt-2 text-xs font-medium text-orange-700">
                              {plan.trial_days} dias de degustação disponíveis
                            </div>
                          ) : null}
                        </div>
                        <div className="text-right">
                          {hasPromotion ? (
                            <div className="text-sm text-gray-500">
                              De <span className="line-through">{money(originalPrice)}</span>
                            </div>
                          ) : null}
                          <div className="text-lg font-semibold text-gray-900">{money(effectivePrice)}</div>
                          <div className="text-xs text-gray-500">por mês</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Forma de pagamento</label>
                <div className="flex min-h-[96px] items-center justify-center rounded-lg border border-[#ff5c00] bg-white px-6 py-4">
                  <img
                    src="/images/payments/pix-banco-central.png"
                    alt="PIX powered by Banco Central"
                    className="h-auto max-h-16 w-auto max-w-[260px] object-contain"
                  />
                </div>
              </div>
            </>
          )}

          {payment ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <div className="font-semibold">Cobrança criada</div>
              <p className="mt-1">Finalize o pagamento para liberar o catálogo automaticamente.</p>
              {paymentImageSrc ? (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-white p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                    Escaneie para pagar
                  </div>
                  <img
                    src={paymentImageSrc}
                    alt="Cobrança PIX para pagamento"
                    className="mx-auto max-h-[520px] w-full rounded-md object-contain"
                  />
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                {payment.invoice_url ? (
                  <a className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white" href={payment.invoice_url} target="_blank" rel="noreferrer">
                    Abrir cobrança
                  </a>
                ) : null}
                {payment.pix_code ? (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(payment.pix_code)}
                    className="rounded-md border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-800"
                  >
                    Copiar PIX
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={loading || submitting || !selectedPlan || plans.length === 0}
            className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e65300] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Gerando cobrança..." : "PAGAR AGORA"}
          </button>
        </div>
      </div>
    </div>
  );
}
