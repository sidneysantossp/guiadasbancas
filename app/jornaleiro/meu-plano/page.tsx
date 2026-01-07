"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Plan = {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "free" | "premium";
  price: number;
  billing_cycle: string;
  features: string[];
  limits: Record<string, number>;
  is_active: boolean;
};

type Subscription = {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string | null;
  plan: Plan;
};

type Payment = {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  due_date: string;
  paid_at: string | null;
  asaas_invoice_url: string | null;
  asaas_bank_slip_url: string | null;
  asaas_pix_qrcode: string | null;
  asaas_pix_code: string | null;
  created_at: string;
};

const BILLING_CYCLES: Record<string, string> = {
  monthly: "mês",
  quarterly: "trimestre",
  semiannual: "semestre",
  annual: "ano",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  active: { label: "Ativo", color: "bg-green-100 text-green-700" },
  pending: { label: "Aguardando Pagamento", color: "bg-yellow-100 text-yellow-700" },
  overdue: { label: "Vencido", color: "bg-red-100 text-red-700" },
  trial: { label: "Período de Teste", color: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelado", color: "bg-gray-100 text-gray-700" },
  expired: { label: "Expirado", color: "bg-gray-100 text-gray-700" },
};

const PAYMENT_STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmado", color: "bg-green-100 text-green-700" },
  received: { label: "Recebido", color: "bg-green-100 text-green-700" },
  overdue: { label: "Vencido", color: "bg-red-100 text-red-700" },
  refunded: { label: "Estornado", color: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelado", color: "bg-gray-100 text-gray-700" },
  failed: { label: "Falhou", color: "bg-red-100 text-red-700" },
};

export default function MeuPlanoPage() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingType, setBillingType] = useState<"PIX" | "BOLETO">("PIX");
  const [processing, setProcessing] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadData = async () => {
    try {
      const [subRes, plansRes] = await Promise.all([
        fetch("/api/jornaleiro/subscription"),
        fetch("/api/admin/plans"),
      ]);

      const subData = await subRes.json();
      const plansData = await plansRes.json();

      if (subData.success) {
        setSubscription(subData.subscription);
        setPayments(subData.payments || []);
      }

      if (plansData.success) {
        setPlans(plansData.data?.filter((p: Plan) => p.is_active) || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.type === "free" || plan.price === 0) {
      setProcessing(true);
      try {
        const res = await fetch("/api/jornaleiro/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_id: plan.id }),
        });
        const data = await res.json();
        if (data.success) {
          alert("Plano ativado com sucesso!");
          loadData();
        } else {
          alert(data.error || "Erro ao ativar plano");
        }
      } catch (error) {
        alert("Erro ao processar");
      } finally {
        setProcessing(false);
      }
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) return;

    setProcessing(true);
    try {
      const res = await fetch("/api/jornaleiro/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: selectedPlan.id,
          billing_type: billingType,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCheckoutResult(data.payment);
        loadData();
      } else {
        alert(data.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      alert("Erro ao processar");
    } finally {
      setProcessing(false);
    }
  };

  const copyPixCode = () => {
    if (checkoutResult?.pix_code) {
      navigator.clipboard.writeText(checkoutResult.pix_code);
      alert("Código PIX copiado!");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Meu Plano</h1>
      <p className="text-gray-600 mb-6">Gerencie sua assinatura e pagamentos</p>

      {/* Plano Atual */}
      {subscription?.plan && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{subscription.plan.name}</h2>
                <span className={`text-xs font-medium px-2 py-1 rounded ${STATUS_LABELS[subscription.status]?.color || "bg-gray-100"}`}>
                  {STATUS_LABELS[subscription.status]?.label || subscription.status}
                </span>
              </div>
              {subscription.plan.price > 0 && (
                <p className="text-gray-600 mt-1">
                  R$ {subscription.plan.price.toFixed(2)}/{BILLING_CYCLES[subscription.plan.billing_cycle]}
                </p>
              )}
            </div>
            {subscription.current_period_end && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Próximo vencimento</p>
                <p className="font-medium">{new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}</p>
              </div>
            )}
          </div>

          {subscription.plan.features && subscription.plan.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">Recursos inclusos:</p>
              <ul className="grid gap-1 sm:grid-cols-2">
                {subscription.plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Planos Disponíveis */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {subscription ? "Alterar Plano" : "Escolha um Plano"}
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.plan_id === plan.id;
          return (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-6 relative ${
                isCurrentPlan ? "border-green-500 ring-2 ring-green-100" : "border-gray-200"
              }`}
            >
              {isCurrentPlan && (
                <span className="absolute -top-3 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Plano Atual
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  plan.type === "free" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                }`}>
                  {plan.type === "free" ? "Gratuito" : "Premium"}
                </span>
              </div>

              <h3 className="text-xl font-bold">{plan.name}</h3>

              <div className="mt-3">
                <span className="text-3xl font-bold">
                  {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toFixed(2)}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-gray-500 text-sm">/{BILLING_CYCLES[plan.billing_cycle]}</span>
                )}
              </div>

              {plan.description && (
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
              )}

              <ul className="mt-4 space-y-2">
                {plan.features?.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isCurrentPlan && handleSelectPlan(plan)}
                disabled={isCurrentPlan || processing}
                className={`w-full mt-6 py-2.5 px-4 rounded-lg font-medium transition ${
                  isCurrentPlan
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#ff5c00] text-white hover:bg-[#ff7a33]"
                }`}
              >
                {isCurrentPlan ? "Plano Atual" : plan.price === 0 ? "Ativar Grátis" : "Assinar"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Histórico de Pagamentos */}
      {payments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Histórico de Pagamentos</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Data</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Valor</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Método</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(payment.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 font-medium">R$ {payment.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-600 uppercase">{payment.payment_method}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${PAYMENT_STATUS[payment.status]?.color || "bg-gray-100"}`}>
                        {PAYMENT_STATUS[payment.status]?.label || payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {payment.status === "pending" && (
                        <div className="flex gap-2">
                          {payment.asaas_pix_code && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(payment.asaas_pix_code!);
                                alert("Código PIX copiado!");
                              }}
                              className="text-xs text-green-600 hover:underline"
                            >
                              Copiar PIX
                            </button>
                          )}
                          {payment.asaas_bank_slip_url && (
                            <a
                              href={payment.asaas_bank_slip_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Ver Boleto
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">Finalizar Assinatura</h2>
            </div>

            {!checkoutResult ? (
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600">Plano selecionado</p>
                  <p className="font-bold text-lg">{selectedPlan.name}</p>
                  <p className="text-2xl font-bold text-[#ff5c00] mt-1">
                    R$ {selectedPlan.price.toFixed(2)}
                    <span className="text-sm text-gray-500 font-normal">/{BILLING_CYCLES[selectedPlan.billing_cycle]}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBillingType("PIX")}
                      className={`p-4 rounded-xl border-2 text-center transition ${
                        billingType === "PIX"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">📱</div>
                      <div className="font-medium">PIX</div>
                      <div className="text-xs text-gray-500">Aprovação imediata</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingType("BOLETO")}
                      className={`p-4 rounded-xl border-2 text-center transition ${
                        billingType === "BOLETO"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">📄</div>
                      <div className="font-medium">Boleto</div>
                      <div className="text-xs text-gray-500">1-3 dias úteis</div>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setSelectedPlan(null);
                    }}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="flex-1 py-3 bg-[#ff5c00] text-white font-semibold rounded-lg hover:bg-[#ff7a33] transition disabled:opacity-50"
                  >
                    {processing ? "Processando..." : "Pagar"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {billingType === "PIX" && checkoutResult.pix_qrcode ? (
                  <>
                    <div className="text-center">
                      <p className="text-green-600 font-medium mb-4">Pagamento via PIX gerado!</p>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 inline-block">
                        <img
                          src={`data:image/png;base64,${checkoutResult.pix_qrcode}`}
                          alt="QR Code PIX"
                          className="w-48 h-48 mx-auto"
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        Escaneie o QR Code acima ou copie o código abaixo
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">Código PIX (Copia e Cola)</p>
                      <p className="text-xs font-mono break-all text-gray-700">{checkoutResult.pix_code?.substring(0, 80)}...</p>
                      <button
                        onClick={copyPixCode}
                        className="mt-2 w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                      >
                        Copiar Código PIX
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-blue-600 font-medium mb-4">Boleto gerado com sucesso!</p>
                    <a
                      href={checkoutResult.bank_slip_url || checkoutResult.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Visualizar Boleto
                    </a>
                    <p className="text-sm text-gray-500 mt-4">
                      Vencimento: {new Date(checkoutResult.due_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPlan(null);
                    setCheckoutResult(null);
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
