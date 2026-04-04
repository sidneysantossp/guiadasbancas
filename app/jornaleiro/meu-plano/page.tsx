"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import JornaleiroPageHeading from "@/components/jornaleiro/JornaleiroPageHeading";
import PlanOverdueCard from "@/components/jornaleiro/PlanOverdueCard";
import PlanPendingActivationCard from "@/components/jornaleiro/PlanPendingActivationCard";

type PlanType = "free" | "premium" | string;

type Plan = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  type: PlanType;
  price: number;
  billing_cycle: string | null;
  features: string[];
  limits: Record<string, number | null>;
  is_active: boolean;
  effective_price?: number;
  original_price?: number | null;
  promotion_label?: string | null;
  promo_applied?: boolean;
  trial_days?: number;
  trial_available?: boolean;
};

type Subscription = {
  id: string;
  plan_id: string;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_ends_at?: string | null;
  plan: Plan | null;
};

type Payment = {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  due_date: string | null;
  paid_at: string | null;
  asaas_invoice_url: string | null;
  bank_slip_url?: string | null;
  asaas_bank_slip_url?: string | null;
  created_at: string;
};

type BillingEntitlements = {
  plan_type: "free" | "premium" | string;
  product_limit?: number | null;
  paid_features_locked_until_payment?: boolean;
  overdue_features_locked?: boolean;
  overdue_in_grace_period?: boolean;
  overdue_grace_ends_at?: string | null;
};

type BancaSummary = {
  id: string;
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  cep?: string | null;
  address_obj?: {
    street?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    uf?: string | null;
    complement?: string | null;
    cep?: string | null;
  } | null;
};

type RequesterProfile = {
  full_name?: string | null;
  phone?: string | null;
  cpf?: string | null;
};

type SubscriptionPayload = {
  success: boolean;
  subscription: Subscription | null;
  effective_plan: Plan | null;
  requested_plan: Plan | null;
  entitlements: BillingEntitlements | null;
  payments: Payment[];
  banca: BancaSummary | null;
  requester_profile?: RequesterProfile | null;
  error?: string;
};

type PlansPayload = {
  success: boolean;
  data: Plan[];
  error?: string;
};

const STATUS_LABELS: Record<string, { label: string; className: string; message: string }> = {
  active: {
    label: "Ativo",
    className: "bg-green-100 text-green-700",
    message: "Sua licença desta banca está ativa e com os recursos pagos liberados.",
  },
  trial: {
    label: "Teste",
    className: "bg-blue-100 text-blue-700",
    message: "Esta banca está usando o período de teste do Premium.",
  },
  pending: {
    label: "Aguardando ativação",
    className: "bg-amber-100 text-amber-700",
    message: "A assinatura já foi iniciada, mas a primeira cobrança ainda não foi confirmada.",
  },
  overdue: {
    label: "Pagamento em aberto",
    className: "bg-red-100 text-red-700",
    message: "Existe uma cobrança em aberto para esta banca. Os recursos pagos podem ser limitados.",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-gray-100 text-gray-700",
    message: "A assinatura paga foi cancelada e a banca opera no plano base.",
  },
};

const PAYMENT_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmado", className: "bg-green-100 text-green-700" },
  received: { label: "Recebido", className: "bg-green-100 text-green-700" },
  overdue: { label: "Vencido", className: "bg-red-100 text-red-700" },
  refunded: { label: "Estornado", className: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelado", className: "bg-gray-100 text-gray-700" },
  failed: { label: "Falhou", className: "bg-red-100 text-red-700" },
};

const BILLING_CYCLE_LABELS: Record<string, string> = {
  monthly: "mês",
  quarterly: "trimestre",
  semiannual: "semestre",
  annual: "ano",
};

const FREE_FEATURES = [
  "Até 10 produtos manuais",
  "Gestão de vendas e pedidos",
  "Cupons",
  "Central de inteligência",
  "Academy",
  "Venda pelo WhatsApp",
  "Gestão de estoque",
  "Exposição nas redes sociais da plataforma",
  "Suporte",
];

const PREMIUM_FEATURES = [
  "Tudo do Free",
  "Campanhas",
  "Colaboradores",
  "Publi editorial",
  "Destaque na plataforma",
  "Distribuidores",
  "Suporte prioritário",
];

type ActivationFormState = {
  holderName: string;
  holderCpfCnpj: string;
  holderEmail: string;
  holderPhone: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
  holderAddressNumber: string;
  holderAddressComplement: string;
};

function formatCurrency(value: number) {
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("pt-BR");
}

function getPlanDisplayPrice(plan: Plan | null | undefined) {
  return Number(plan?.effective_price ?? plan?.price ?? 0);
}

function getBillingLabel(plan: Plan | null | undefined) {
  const cycle = plan?.billing_cycle || "monthly";
  return BILLING_CYCLE_LABELS[cycle] || "mês";
}

function digitsOnly(value: string | null | undefined) {
  return String(value || "").replace(/\D/g, "");
}

function formatCpfCnpj(value: string) {
  const digits = digitsOnly(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhone(value: string) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCardNumber(value: string) {
  return digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function getSourceCopy(source: string | null) {
  switch (source) {
    case "distribuidores":
    case "catalogo-distribuidor":
      return {
        eyebrow: "Upgrade orientado por distribuidor",
        title: "Ative o Premium para liberar os distribuidores",
        description:
          "Seu plano atual mantém a operação básica da banca. O Premium libera catálogo parceiro e rede de distribuidores para ampliar o mix sem cadastrar tudo manualmente.",
      };
    case "catalogo-distribuidor-gerenciar":
      return {
        eyebrow: "Upgrade orientado por catálogo parceiro",
        title: "Ative o Premium para gerenciar produtos dos distribuidores",
        description:
          "O gerenciamento do catálogo parceiro faz parte da operação premium. Ative o plano para editar preços, habilitar itens dos distribuidores e ampliar o sortimento da banca.",
      };
    case "campanhas":
      return {
        eyebrow: "Upgrade orientado por campanha",
        title: "Ative o Premium para rodar campanhas",
        description:
          "Campanhas fazem parte do pacote de crescimento. Ao ativar o Premium, sua banca passa a acessar essa camada de visibilidade e promoção.",
      };
    case "product-limit":
      return {
        eyebrow: "Upgrade orientado por capacidade",
        title: "Ative o Premium para ampliar o catálogo da banca",
        description:
          "O Free mantém a operação básica com até 10 produtos manuais. O Premium libera capacidade ampliada, distribuidores e ferramentas de crescimento para escalar o mix da banca.",
      };
    case "colaboradores":
      return {
        eyebrow: "Upgrade orientado por equipe",
        title: "Ative o Premium para operar com colaboradores",
        description:
          "O Premium libera gestão de equipe para dividir operação, atendimento e execução diária com mais controle.",
      };
    case "destaque":
      return {
        eyebrow: "Upgrade orientado por visibilidade",
        title: "Ative o Premium para destacar sua banca e seus produtos",
        description:
          "Destaque na plataforma e publi editorial são recursos pagos. O Premium libera essa camada de exposição para acelerar aquisição de clientes.",
      };
    case "multiplas-bancas":
      return {
        eyebrow: "Licença por banca",
        title: "Ative uma nova licença para cadastrar outra banca",
        description:
          "Sua conta pode administrar várias bancas, mas cada unidade precisa da própria licença. Ative o Premium da nova banca para abrir outra operação sem misturar assinaturas.",
      };
    default:
      return {
        eyebrow: "Plano por banca",
        title: "Escolha como quer fazer esta banca crescer",
        description:
          "Cada banca tem sua própria licença. O plano Free libera a operação básica; o Premium destrava visibilidade, distribuidores e ferramentas de crescimento.",
      };
  }
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3 text-sm text-gray-700">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ff5c00]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function MeuPlanoPage() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const sourceCopy = getSourceCopy(source);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [effectivePlan, setEffectivePlan] = useState<Plan | null>(null);
  const [requestedPlan, setRequestedPlan] = useState<Plan | null>(null);
  const [billingEntitlements, setBillingEntitlements] = useState<BillingEntitlements | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [banca, setBanca] = useState<BancaSummary | null>(null);
  const [requesterProfile, setRequesterProfile] = useState<RequesterProfile | null>(null);
  const [activatingPremium, setActivatingPremium] = useState(false);
  const [cancellingPremium, setCancellingPremium] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [activationSuccess, setActivationSuccess] = useState<string | null>(null);
  const [activationForm, setActivationForm] = useState<ActivationFormState>({
    holderName: "",
    holderCpfCnpj: "",
    holderEmail: "",
    holderPhone: "",
    number: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    holderAddressNumber: "",
    holderAddressComplement: "",
  });

  const loadData = useCallback(
    async (cancelled = false) => {
      try {
        setLoading(true);
        setError(null);

        const [subscriptionRes, plansRes] = await Promise.all([
          fetch("/api/jornaleiro/subscription", { cache: "no-store", credentials: "include" }),
          fetch("/api/jornaleiro/plans", { cache: "no-store", credentials: "include" }),
        ]);

        const subscriptionJson = (await subscriptionRes.json().catch(() => ({}))) as SubscriptionPayload;
        const plansJson = (await plansRes.json().catch(() => ({}))) as PlansPayload;

        if (!subscriptionRes.ok || !subscriptionJson.success) {
          throw new Error(subscriptionJson.error || "Erro ao carregar assinatura");
        }

        if (!plansRes.ok || !plansJson.success) {
          throw new Error(plansJson.error || "Erro ao carregar planos");
        }

        if (cancelled) return;

        setSubscription(subscriptionJson.subscription || null);
        setEffectivePlan(subscriptionJson.effective_plan || null);
        setRequestedPlan(subscriptionJson.requested_plan || null);
        setBillingEntitlements(subscriptionJson.entitlements || null);
        setPayments(subscriptionJson.payments || []);
        setPlans((plansJson.data || []).filter((plan) => plan.is_active));
        setBanca(subscriptionJson.banca || null);
        setRequesterProfile(subscriptionJson.requester_profile || null);
      } catch (loadError: any) {
        if (cancelled) return;
        setError(loadError?.message || "Erro ao carregar plano");
      } finally {
        if (!cancelled) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    loadData(cancelled);

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  const freePlan = useMemo(
    () => plans.find((plan) => (plan.type || "").toLowerCase() === "free" || getPlanDisplayPrice(plan) === 0) || null,
    [plans]
  );
  const premiumPlan = useMemo(
    () => plans.find((plan) => (plan.type || "").toLowerCase() !== "free" && getPlanDisplayPrice(plan) > 0) || null,
    [plans]
  );

  const currentPlan = effectivePlan || subscription?.plan || freePlan;
  const currentPlanType = billingEntitlements?.plan_type || currentPlan?.type || "free";
  const currentPlanPrice = getPlanDisplayPrice(currentPlan);
  const currentPlanStatusMeta = STATUS_LABELS[subscription?.status || "active"] || STATUS_LABELS.active;
  const pendingPayments = payments.filter((payment) => ["pending", "overdue"].includes(payment.status)).length;
  const lastPayment = payments[0] || null;
  const isPremiumActive = currentPlanType === "premium";
  const structuredAddress = banca?.address_obj || null;
  const premiumTrialDays = Number(premiumPlan?.trial_days || 7);
  const premiumCtaLabel = source === "multiplas-bancas" ? "Ativar licença desta banca" : `Ativar ${premiumTrialDays} dias grátis`;

  useEffect(() => {
    setActivationForm((current) => ({
      ...current,
      holderName: current.holderName || requesterProfile?.full_name || banca?.name || "",
      holderCpfCnpj: current.holderCpfCnpj || formatCpfCnpj(requesterProfile?.cpf || ""),
      holderEmail: current.holderEmail || banca?.email || "",
      holderPhone: current.holderPhone || formatPhone(requesterProfile?.phone || banca?.whatsapp || ""),
      holderAddressNumber: current.holderAddressNumber || structuredAddress?.number || "",
      holderAddressComplement: current.holderAddressComplement || structuredAddress?.complement || "",
    }));
  }, [banca?.email, banca?.name, banca?.whatsapp, requesterProfile?.cpf, requesterProfile?.full_name, requesterProfile?.phone, structuredAddress?.complement, structuredAddress?.number]);

  const updateActivationForm = useCallback(
    <K extends keyof ActivationFormState>(field: K, value: ActivationFormState[K]) => {
      setActivationForm((current) => ({ ...current, [field]: value }));
    },
    []
  );

  const handleActivatePremium = useCallback(async () => {
    if (!premiumPlan) return;

    try {
      setActivatingPremium(true);
      setActivationError(null);
      setActivationSuccess(null);

      const res = await fetch("/api/jornaleiro/subscription", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: premiumPlan.id,
          billing_type: "CREDIT_CARD",
          card: {
            holderName: activationForm.holderName,
            holderCpfCnpj: activationForm.holderCpfCnpj,
            holderEmail: activationForm.holderEmail,
            holderPhone: activationForm.holderPhone,
            number: activationForm.number,
            expiryMonth: activationForm.expiryMonth,
            expiryYear: activationForm.expiryYear,
            ccv: activationForm.ccv,
            holderAddressNumber: activationForm.holderAddressNumber,
            holderAddressComplement: activationForm.holderAddressComplement,
          },
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Não foi possível ativar o Premium.");
      }

      const trialEndsAt = json?.payment?.trial_ends_at || json?.subscription?.trial_ends_at || null;
      setActivationSuccess(
        trialEndsAt
          ? `Premium ativado. Seu período grátis vai até ${formatDate(trialEndsAt)}. Se cancelar antes dessa data, não haverá cobrança.`
          : json?.message || "Premium ativado com sucesso."
      );
      await loadData(false);
    } catch (activateError: any) {
      setActivationError(activateError?.message || "Não foi possível ativar o Premium.");
    } finally {
      setActivatingPremium(false);
    }
  }, [activationForm, loadData, premiumPlan]);

  const handleCancelPremium = useCallback(async () => {
    try {
      setCancellingPremium(true);
      setActivationError(null);
      setActivationSuccess(null);

      const res = await fetch("/api/jornaleiro/subscription", {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Não foi possível cancelar o Premium.");
      }

      setActivationSuccess(json?.message || "Premium cancelado. Esta banca voltou para o plano Free.");
      await loadData(false);
    } catch (cancelError: any) {
      setActivationError(cancelError?.message || "Não foi possível cancelar o Premium.");
    } finally {
      setCancellingPremium(false);
    }
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-56 rounded-2xl bg-gray-200" />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="h-56 rounded-2xl bg-gray-200" />
            <div className="h-56 rounded-2xl bg-gray-200" />
            <div className="h-56 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <JornaleiroPageHeading
        title={sourceCopy.title}
        description={sourceCopy.description}
        eyebrow={sourceCopy.eyebrow}
        note={
          banca ? (
            <span>
              Licença atual da banca <strong>{banca.name}</strong>. Cada banca da sua conta precisa da própria assinatura para acessar recursos pagos.
            </span>
          ) : null
        }
        className="mb-6"
      />

      {error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Plano liberado</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{currentPlan?.name || "Gratuito"}</div>
          <p className="mt-1 text-sm text-gray-500">Plano que hoje governa os acessos desta banca.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Plano contratado</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">
            {subscription?.plan?.name || requestedPlan?.name || currentPlan?.name || "Gratuito"}
          </div>
          <p className="mt-1 text-sm text-gray-500">Plano comercial vinculado à assinatura desta banca.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Status da assinatura</div>
          <div className="mt-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${currentPlanStatusMeta.className}`}>
              {subscription ? currentPlanStatusMeta.label : "Sem assinatura paga"}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{subscription ? currentPlanStatusMeta.message : "A banca está operando no plano Free."}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Cobranças em aberto</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{pendingPayments}</div>
          <p className="mt-1 text-sm text-gray-500">
            {lastPayment ? `Última cobrança em ${formatDate(lastPayment.due_date || lastPayment.created_at)}.` : "Nenhum histórico de cobrança desta banca."}
          </p>
        </div>
      </div>

      {billingEntitlements?.paid_features_locked_until_payment && requestedPlan ? (
        <PlanPendingActivationCard requestedPlanName={requestedPlan.name} className="mb-6" showSupportAction />
      ) : null}

      {billingEntitlements?.overdue_features_locked && subscription?.plan ? (
        <PlanOverdueCard
          planName={subscription.plan.name}
          className="mb-6"
          accessSuspended
          showSupportAction
        />
      ) : null}

      {!billingEntitlements?.overdue_features_locked && billingEntitlements?.overdue_in_grace_period && subscription?.plan ? (
        <PlanOverdueCard
          planName={subscription.plan.name}
          className="mb-6"
          graceEndsAt={billingEntitlements.overdue_grace_ends_at}
          showSupportAction
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">
        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="rounded-2xl border border-[#ffeddc] bg-[#fff7f1] p-5">
              <p className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff5c00]">
                Plano por banca
              </p>
              <p className="mt-4 text-lg text-gray-700">
                O cadastro da banca já está concluído. Agora a decisão é simples: seguir operando no <strong>Free</strong> ou ativar o
                <strong> Premium</strong> quando fizer sentido destravar distribuidores, visibilidade e recursos de crescimento.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className={`rounded-3xl border bg-white p-7 shadow-sm ${currentPlanType === "free" ? "border-green-300 ring-2 ring-green-100" : "border-gray-200"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
                    Free
                  </span>
                  <h2 className="mt-4 text-3xl font-semibold text-gray-900">Grátis</h2>
                </div>
                {currentPlanType === "free" ? (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">Plano atual</span>
                ) : null}
              </div>

              <p className="mt-4 text-base leading-7 text-gray-600">
                Base operacional da banca para vender, organizar o catálogo manual e atender clientes sem cobrança recorrente.
              </p>

              <FeatureList items={FREE_FEATURES} />

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                <strong className="text-gray-900">Limite atual:</strong> até {billingEntitlements?.plan_type === "free" ? billingEntitlements?.product_limit || 10 : freePlan?.limits?.max_products || 10} produtos manuais.
              </div>
            </article>

            <article className={`rounded-3xl border bg-white p-7 shadow-sm ${isPremiumActive ? "border-[#ffb27f] ring-2 ring-[#fff0e3]" : "border-gray-200"}`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-[#fff0e3] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
                      Premium
                    </span>
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {premiumTrialDays} dias grátis
                    </span>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold text-gray-900">
                    {premiumPlan ? formatCurrency(getPlanDisplayPrice(premiumPlan)) : "Premium"}
                  </h2>
                  {premiumPlan ? (
                    <p className="mt-1 text-sm text-gray-500">por {getBillingLabel(premiumPlan)} desta banca</p>
                  ) : null}
                </div>
                {isPremiumActive ? (
                  <span className="rounded-full bg-[#fff0e3] px-3 py-1 text-sm font-semibold text-[#ff5c00]">Plano atual</span>
                ) : null}
              </div>

              <p className="mt-4 text-base leading-7 text-gray-600">
                Libera aquisição, visibilidade e abastecimento para a banca crescer sem depender só de cadastro manual.
              </p>

              <FeatureList items={PREMIUM_FEATURES} />

              <div className="mt-6 rounded-2xl border border-[#ffe0c7] bg-[#fff8f2] p-4 text-sm text-gray-700">
                <div className="font-semibold text-gray-900">Quando o Premium faz sentido</div>
                <p className="mt-1">
                  Quando a banca precisa ampliar o mix com distribuidores, ganhar destaque na plataforma, rodar campanhas e operar com apoio de equipe.
                </p>
              </div>
            </article>
          </div>

          {payments.length > 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Histórico de cobranças</h2>
                  <p className="mt-1 text-sm text-gray-500">Leitura financeira da licença desta banca.</p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                      <th className="py-3 pr-4">Vencimento</th>
                      <th className="py-3 pr-4">Valor</th>
                      <th className="py-3 pr-4">Método</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((payment) => {
                      const statusMeta = PAYMENT_STATUS[payment.status] || {
                        label: payment.status,
                        className: "bg-gray-100 text-gray-700",
                      };
                      const invoiceUrl = payment.asaas_invoice_url || payment.asaas_bank_slip_url || payment.bank_slip_url;

                      return (
                        <tr key={payment.id}>
                          <td className="py-4 pr-4 text-gray-700">{formatDate(payment.due_date || payment.created_at)}</td>
                          <td className="py-4 pr-4 font-medium text-gray-900">{formatCurrency(Number(payment.amount || 0))}</td>
                          <td className="py-4 pr-4 text-gray-600">{payment.payment_method || "—"}</td>
                          <td className="py-4 pr-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
                              {statusMeta.label}
                            </span>
                          </td>
                          <td className="py-4">
                            {invoiceUrl ? (
                              <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-[#ff5c00] hover:text-[#ff7a33]"
                              >
                                Abrir cobrança
                              </a>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm xl:sticky xl:top-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5c00]">Ativação Premium</p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">Ative o Premium com 7 dias grátis</h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Asaas</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              Use o Asaas para ativar o Premium desta banca em ambiente seguro. O cartão entra agora, mas a primeira cobrança só acontece depois do período grátis se você não cancelar antes.
            </p>

            <div className="mt-5 space-y-3 rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#ff5c00]" />
                <span>1 banca = 1 licença. Se você operar mais de uma banca, cada unidade precisa da própria assinatura.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#ff5c00]" />
                <span>O plano Free mantém a operação com até 10 produtos, pedidos, estoque, cupons, inteligência, academy, exposição nas redes sociais, suporte e vendas pelo WhatsApp.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#ff5c00]" />
                <span>Ao ativar o Premium, a cobrança e o histórico desta banca passam a ser geridos pelo Asaas.</span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#ffe0c7] bg-[#fff8f2] p-4">
              <div className="text-sm font-semibold text-gray-900">O que destrava no Premium</div>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>• Distribuidores e catálogo parceiro</li>
                <li>• Destaque na plataforma</li>
                <li>• Publi editorial e campanhas</li>
                <li>• Operação com colaboradores</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>

            {activationError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {activationError}
              </div>
            ) : null}

            {activationSuccess ? (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {activationSuccess}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Nome do titular</label>
                  <input
                    type="text"
                    value={activationForm.holderName}
                    onChange={(event) => updateActivationForm("holderName", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="Nome como está no cartão"
                    disabled={isPremiumActive}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">CPF/CNPJ do titular</label>
                  <input
                    type="text"
                    value={activationForm.holderCpfCnpj}
                    onChange={(event) => updateActivationForm("holderCpfCnpj", formatCpfCnpj(event.target.value))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="000.000.000-00"
                    disabled={isPremiumActive}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Email de cobrança</label>
                  <input
                    type="email"
                    value={activationForm.holderEmail}
                    onChange={(event) => updateActivationForm("holderEmail", event.target.value.trim())}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="email@banca.com.br"
                    disabled={isPremiumActive}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Telefone do titular</label>
                  <input
                    type="text"
                    value={activationForm.holderPhone}
                    onChange={(event) => updateActivationForm("holderPhone", formatPhone(event.target.value))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="(11) 99999-9999"
                    disabled={isPremiumActive}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Número do cartão</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={activationForm.number}
                  onChange={(event) => updateActivationForm("number", formatCardNumber(event.target.value))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                  placeholder="0000 0000 0000 0000"
                  disabled={isPremiumActive}
                />
              </div>

              <div className="grid gap-4 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Validade</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatExpiry(`${activationForm.expiryMonth}${activationForm.expiryYear}`)}
                    onChange={(event) => {
                      const digits = digitsOnly(event.target.value);
                      updateActivationForm("expiryMonth", digits.slice(0, 2));
                      updateActivationForm("expiryYear", digits.slice(2, 4));
                    }}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="MM/AA"
                    disabled={isPremiumActive}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={activationForm.ccv}
                    onChange={(event) => updateActivationForm("ccv", digitsOnly(event.target.value).slice(0, 4))}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="123"
                    disabled={isPremiumActive}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Número do endereço</label>
                  <input
                    type="text"
                    value={activationForm.holderAddressNumber}
                    onChange={(event) => updateActivationForm("holderAddressNumber", event.target.value)}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                    placeholder="123"
                    disabled={isPremiumActive}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Complemento do endereço</label>
                <input
                  type="text"
                  value={activationForm.holderAddressComplement}
                  onChange={(event) => updateActivationForm("holderAddressComplement", event.target.value)}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#ff5c00]"
                  placeholder="Sala, bloco ou referência"
                  disabled={isPremiumActive}
                />
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <div className="font-semibold text-gray-900">Endereço de cobrança desta banca</div>
                <p className="mt-2 leading-6">
                  {structuredAddress?.street || "Endereço ainda não cadastrado"}{structuredAddress?.number ? `, ${structuredAddress.number}` : ""}
                  {structuredAddress?.neighborhood ? ` • ${structuredAddress.neighborhood}` : ""}
                  {structuredAddress?.city ? ` • ${structuredAddress.city}` : ""}
                  {structuredAddress?.uf ? `/${structuredAddress.uf}` : ""}
                  {structuredAddress?.cep ? ` • CEP ${structuredAddress.cep}` : ""}
                </p>
                {!structuredAddress?.street || !structuredAddress?.cep ? (
                  <p className="mt-2 text-xs text-red-600">
                    Atualize o cadastro da banca com um endereço completo antes de ativar o Premium.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {isPremiumActive ? (
                <button
                  type="button"
                  onClick={handleCancelPremium}
                  disabled={cancellingPremium}
                  className="inline-flex items-center justify-center rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancellingPremium ? "Cancelando..." : "Cancelar Premium e voltar para o Free"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleActivatePremium}
                  disabled={!premiumPlan || activatingPremium || !structuredAddress?.street || !structuredAddress?.cep}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#ff5c00] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#ff7a33] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {activatingPremium ? "Ativando Premium..." : premiumCtaLabel}
                </button>
              )}

              <Link
                href="/jornaleiro/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              >
                Voltar para o dashboard
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
