"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";
import PlanOverdueCard from "@/components/jornaleiro/PlanOverdueCard";
import PlanPendingActivationCard from "@/components/jornaleiro/PlanPendingActivationCard";

const BILLING_CYCLES: Record<string, string> = {
  monthly: "mês",
  quarterly: "trimestre",
  semiannual: "semestre",
  annual: "ano",
};

const SUBSCRIPTION_STATUS_META: Record<string, { label: string; className: string; message: string }> = {
  active: {
    label: "Ativo",
    className: "bg-green-100 text-green-700",
    message: "Seu plano está ativo e liberado para operar normalmente.",
  },
  trial: {
    label: "Teste",
    className: "bg-blue-100 text-blue-700",
    message: "Sua banca está em período de teste. Aproveite para validar a operação antes da cobrança.",
  },
  pending: {
    label: "Aguardando pagamento",
    className: "bg-amber-100 text-amber-700",
    message: "A assinatura já foi criada. Falta apenas quitar a primeira cobrança para confirmar o novo plano.",
  },
  overdue: {
    label: "Pagamento em aberto",
    className: "bg-red-100 text-red-700",
    message: "Existe uma cobrança em aberto. Regularize para evitar impacto nos recursos do plano.",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-gray-100 text-gray-700",
    message: "Sua assinatura foi cancelada. Você pode reativar um plano a qualquer momento.",
  },
};

export default function JornaleiroDashboardPage() {
  const searchParams = useSearchParams();
  const { user, profile, isJornaleiro } = useAuth();
  const [banca, setBanca] = useState<any>(null);
  const [loadingBanca, setLoadingBanca] = useState(true);
  const [bancaLoadMessage, setBancaLoadMessage] = useState("Carregando o painel da sua banca...");
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metrics, setMetrics] = useState({
    pedidosHoje: 0,
    faturamentoHoje: 0,
    pedidosPendentes: 0,
    produtosAtivos: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user && isJornaleiro) {
      loadBancaData();
    }
  }, [user, isJornaleiro]);

  const loadBancaData = async () => {
    const isWelcomeFlow = searchParams?.get("welcome") === "1" || searchParams?.get("trial") === "1";
    const retryDelays = isWelcomeFlow ? [600, 1200, 1800, 2500] : [0];

    try {
      setLoadingBanca(true);

      for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
        if (attempt > 0) {
          setBancaLoadMessage("Estamos finalizando a vinculação da sua banca e ativando o teste premium...");
          await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
        }

        const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
          cache: "no-store",
          credentials: "include",
        });
        const text = await res.text();
        const json = text ? JSON.parse(text) : null;

        if (res.ok && json?.success && json?.data) {
          setBanca(json.data);
          setBancaLoadMessage("Carregando o painel da sua banca...");
          return;
        }

        if (attempt === retryDelays.length - 1) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
      }
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar banca:', error);
      setBanca(null);
    } finally {
      setLoadingBanca(false);
    }
  };

  useEffect(() => {
    if (user && banca?.id) {
      loadMetrics();
    }
  }, [user?.id, banca?.id]);

  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      
      // Buscar stats e pedidos recentes em paralelo
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/jornaleiro/stats', { 
          cache: 'no-store',
          credentials: 'include'
        }),
        fetch('/api/orders?limit=5', { 
          cache: 'no-store',
          credentials: 'include'
        }),
      ]);
      
      const statsJson = await statsRes.json();
      const ordersJson = await ordersRes.json();
      
      console.log('[Dashboard] 📊 Stats:', statsJson);
      
      if (statsJson.success && statsJson.data) {
        const stats = statsJson.data;
        setMetrics({
          pedidosHoje: stats.pedidosHoje || 0,
          faturamentoHoje: stats.faturamentoHoje || 0,
          pedidosPendentes: stats.pedidosPendentes || 0,
          produtosAtivos: stats.produtosAtivos || 0,
        });
      }
      
      const orders = ordersJson.items || [];
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar métricas:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const sellerName = profile?.full_name || user?.email?.split('@')[0] || 'Jornaleiro';
  const sellerEmail = user?.email || '';
  const sellerPhone = profile?.phone || '';
  const isWelcomeFlow = searchParams?.get("welcome") === "1" || searchParams?.get("trial") === "1";
  const bancaLifecycle = resolveBancaLifecycle(banca);

  // Memoizar cálculos pesados
  const memoizedMetrics = useMemo(() => metrics, [metrics]);
  const memoizedRecentOrders = useMemo(() => recentOrders, [recentOrders]);
  const currentPlanType = banca?.entitlements?.plan_type || banca?.plan?.type || "free";
  const currentPlanName = banca?.plan?.name || "Free";
  const currentPlanPrice = Number(banca?.plan?.price || 0);
  const currentPlanPriceLabel =
    currentPlanPrice > 0
      ? `R$ ${currentPlanPrice.toFixed(2).replace(".", ",")}/${BILLING_CYCLES[banca?.plan?.billing_cycle || "monthly"] || "mês"}`
      : "Grátis";
  const currentPlanLimit = banca?.entitlements?.product_limit ?? null;
  const currentSubscriptionStatus = banca?.subscription?.status || "active";
  const currentSubscriptionMeta = SUBSCRIPTION_STATUS_META[currentSubscriptionStatus] || SUBSCRIPTION_STATUS_META.active;
  const requestedPlanName = banca?.requested_plan?.name || null;
  const overdueFeaturesLocked = banca?.entitlements?.overdue_features_locked === true;
  const overdueInGracePeriod = banca?.entitlements?.overdue_in_grace_period === true;
  const overdueGraceEndsAt = banca?.entitlements?.overdue_grace_ends_at || null;
  const checklistItems = useMemo(() => {
    const hasBranding = Boolean(banca?.profile_image || banca?.cover_image);
    const hasOpeningHours = Array.isArray(banca?.hours) && banca.hours.some((day: any) => day?.open);
    const hasContactChannel = Boolean(banca?.whatsapp || sellerPhone || sellerEmail);
    const hasProducts = memoizedMetrics.produtosAtivos > 0;

    return [
      {
        id: "branding",
        title: "Personalize a banca",
        description: hasBranding ? "Logo ou capa adicionadas." : "Adicione logo e capa para transmitir confiança.",
        done: hasBranding,
        href: "/jornaleiro/banca-v2" as Route,
        actionLabel: hasBranding ? "Revisar" : "Adicionar",
      },
      {
        id: "hours",
        title: "Defina seu horário",
        description: hasOpeningHours ? "Horários configurados." : "Informe os dias e horários em que sua banca funciona.",
        done: hasOpeningHours,
        href: "/jornaleiro/banca-v2" as Route,
        actionLabel: hasOpeningHours ? "Ajustar" : "Configurar",
      },
      {
        id: "contact",
        title: "Confirme seu atendimento",
        description: hasContactChannel ? "Contato principal disponível." : "Cadastre WhatsApp ou telefone para receber pedidos.",
        done: hasContactChannel,
        href: "/jornaleiro/banca-v2" as Route,
        actionLabel: hasContactChannel ? "Atualizar" : "Informar",
      },
      {
        id: "products",
        title: "Cadastre o primeiro produto",
        description: hasProducts ? "Sua vitrine já tem produtos." : "Crie pelo menos um item para começar a vender.",
        done: hasProducts,
        href: "/jornaleiro/produtos/create" as Route,
        actionLabel: hasProducts ? "Ver produtos" : "Cadastrar",
      },
    ];
  }, [banca?.cover_image, banca?.hours, banca?.profile_image, banca?.whatsapp, memoizedMetrics.produtosAtivos, sellerEmail, sellerPhone]);
  const completedChecklistCount = checklistItems.filter((item) => item.done).length;
  const isPublished = bancaLifecycle.isPublished;
  const nextObjective = useMemo(() => {
    if (!checklistItems.find((item) => !item.done)) {
      if (bancaLifecycle.code === "draft") {
        return {
          eyebrow: "Publicação da banca",
          title: "Conclua a configuração inicial da banca",
          description: "A banca já existe, mas ainda está em preparação. Feche os dados principais antes de avançar para publicação.",
          href: "/jornaleiro/banca-v2" as Route,
          actionLabel: "Continuar cadastro",
        };
      }

      if (bancaLifecycle.code === "pending_approval") {
        return {
          eyebrow: "Publicação da banca",
          title: "Acompanhe a aprovação da sua banca",
          description: "O cadastro já foi criado. Agora revise as informações e acompanhe a liberação para aparecer no marketplace.",
          href: "/jornaleiro/banca-v2" as Route,
          actionLabel: "Revisar publicação",
        };
      }

      if (bancaLifecycle.code === "paused") {
        return {
          eyebrow: "Operação da banca",
          title: "Reative a operação da sua banca",
          description: "Sua banca já foi aprovada, mas está pausada. Revise o status operacional antes de focar em crescimento.",
          href: "/jornaleiro/banca-v2" as Route,
          actionLabel: "Revisar publicação",
        };
      }

      if (memoizedMetrics.pedidosPendentes > 0) {
        return {
          eyebrow: "Operação do dia",
          title: "Existem pedidos aguardando andamento",
          description: "Priorize a fila operacional para manter atendimento rápido e a experiência do cliente saudável.",
          href: "/jornaleiro/pedidos" as Route,
          actionLabel: "Abrir pedidos",
        };
      }

      return {
        eyebrow: "Crescimento da banca",
        title: "Sua base está pronta para crescer",
        description: "Agora vale acompanhar a inteligência da banca e decidir as próximas melhorias com base em demanda e catálogo.",
        href: "/jornaleiro/inteligencia" as Route,
        actionLabel: "Abrir inteligência",
      };
    }

    const firstPendingItem = checklistItems.find((item) => !item.done)!;
    return {
      eyebrow: "Próximo melhor passo",
      title: firstPendingItem.title,
      description: firstPendingItem.description,
      href: firstPendingItem.href,
      actionLabel: firstPendingItem.actionLabel,
    };
  }, [bancaLifecycle.code, checklistItems, memoizedMetrics.pedidosPendentes]);
  const publicationToneClass =
    bancaLifecycle.code === "published"
      ? "border-green-200 bg-green-50 text-green-800"
      : bancaLifecycle.code === "paused"
        ? "border-red-200 bg-red-50 text-red-800"
        : "border-amber-200 bg-amber-50 text-amber-900";
  const quickActions = useMemo(
    () => [
      {
        label: "Perfil e publicação",
        description: "Revise dados, identidade e horário da banca.",
        href: "/jornaleiro/banca-v2" as Route,
      },
      {
        label: "Produtos",
        description: "Organize catálogo, preço e estoque.",
        href: "/jornaleiro/produtos" as Route,
      },
      {
        label: "Pedidos",
        description: "Veja a fila operacional do dia.",
        href: "/jornaleiro/pedidos" as Route,
      },
      {
        label: "Central de inteligência",
        description: "Leia demanda, alertas e próximos passos.",
        href: "/jornaleiro/inteligencia" as Route,
      },
    ],
    []
  );

  // Sem banca vinculada, orientar o jornaleiro para iniciar o cadastro.
  if (!loadingBanca && !banca) {
    if (isWelcomeFlow) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Estamos finalizando a ativação da sua banca</h1>
            <p className="text-gray-600 mb-6">
              Seu cadastro foi concluído e o teste premium está sendo liberado. Recarregue o painel em alguns instantes se esta tela persistir.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => loadBancaData()}
                className="inline-flex items-center bg-[#ff5c00] text-white px-6 py-3 rounded-md hover:opacity-90 font-semibold"
              >
                Atualizar painel
              </button>
              <Link
                href="/jornaleiro/meu-plano?source=dashboard-trial"
                className="inline-flex items-center border border-gray-200 bg-white px-6 py-3 rounded-md hover:bg-gray-50 font-semibold text-gray-700"
              >
                Ver detalhes do trial
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma banca vinculada</h1>
          <p className="text-gray-600 mb-6">
            Este perfil ainda não tem uma banca principal configurada. Cadastre a banca para liberar o painel operacional e iniciar a publicação.
          </p>
          <Link
            href="/jornaleiro/banca-v2"
            className="inline-block bg-[#ff5c00] text-white px-6 py-3 rounded-md hover:opacity-90 font-semibold"
          >
            Cadastrar banca
          </Link>
        </div>
      </div>
    );
  }

  if (loadingBanca) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff5c00]" />
          <p className="mt-4 text-sm text-gray-600">{bancaLoadMessage}</p>
        </div>
      </div>
    );
  }

  const partnerLinked = banca?.partner_linked === true || banca?.is_cotista === true;
  const needsTpuAlert = banca && !partnerLinked && !banca.tpu_url;
  const shouldShowTrialBanner = currentSubscriptionStatus === "trial" || isWelcomeFlow;
  const trialEndsLabel = banca?.subscription?.trial_ends_at
    ? new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
        new Date(banca.subscription.trial_ends_at)
      )
    : null;

  return (
    <div className="space-y-4 overflow-x-hidden px-3 sm:px-0 max-w-full">
      {shouldShowTrialBanner ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Teste premium ativo</div>
              <div className="mt-1 text-lg font-semibold text-blue-900">
                Sua banca já entrou com todos os recursos premium liberados
              </div>
              <p className="mt-1 text-sm text-blue-800">
                {trialEndsLabel
                  ? `O período grátis vai até ${trialEndsLabel}. Aproveite para configurar distribuidores, campanhas, colaboradores e o crescimento da sua operação antes da primeira cobrança.`
                  : "Aproveite estes primeiros dias para configurar distribuidores, campanhas, colaboradores e o crescimento da sua operação antes da primeira cobrança."}
              </p>
            </div>
            <Link
              href="/jornaleiro/meu-plano?source=dashboard-trial"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-inset ring-blue-200 hover:bg-blue-100/40"
            >
              Ver detalhes do Premium
            </Link>
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5c00] shadow-sm">
              {bancaLifecycle.shortLabel}
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">Olá, {sellerName}</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              {bancaLifecycle.description}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 rounded-2xl border border-orange-100 bg-white/90 p-4 text-sm shadow-sm lg:max-w-xs">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{nextObjective.eyebrow}</span>
            <span className="text-xl font-semibold text-gray-900">{nextObjective.title}</span>
            <span className="text-sm text-gray-600">{nextObjective.description}</span>
            <Link
              href={nextObjective.href}
              className="inline-flex items-center font-semibold text-[#ff5c00] hover:opacity-80"
            >
              {nextObjective.actionLabel}
              <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="text-sm font-semibold text-gray-900">{action.label}</div>
              <p className="mt-1 text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {checklistItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 shadow-sm transition-colors ${
                item.done ? "border-green-200 bg-green-50/70" : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    item.done ? "bg-green-600 text-white" : "bg-orange-100 text-[#ff5c00]"
                  }`}
                >
                  {item.done ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 13 4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{item.id === "products" ? "4" : item.id === "contact" ? "3" : item.id === "hours" ? "2" : "1"}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900">{item.title}</h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        item.done ? "bg-green-100 text-green-700" : "bg-orange-100 text-[#ff5c00]"
                      }`}
                    >
                      {item.done ? "Concluído" : "Pendente"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-3 inline-flex items-center text-sm font-semibold text-[#ff5c00] hover:opacity-80"
                  >
                    {item.actionLabel}
                    <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`mt-4 rounded-2xl border p-4 text-sm shadow-sm ${publicationToneClass}`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">
                {bancaLifecycle.label}
              </h2>
              <p className="mt-1">
                {bancaLifecycle.description}
              </p>
            </div>
            <Link
              href={("/jornaleiro/banca-v2" as Route)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-4 py-2 font-semibold text-[#ff5c00] shadow-sm ring-1 ring-inset ring-current/10 hover:opacity-90"
            >
              Revisar cadastro
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
              Plano e acessos
            </span>
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
              {currentPlanName}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${currentSubscriptionMeta.className}`}>
              {currentSubscriptionMeta.label}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <h2 className="text-2xl font-semibold text-gray-900">{currentPlanName}</h2>
            <span className="pb-1 text-sm text-gray-500">{currentPlanPriceLabel}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {currentPlanType === "free"
              ? `Sua banca já opera no Free com até ${currentPlanLimit || 10} produtos próprios, gestão de vendas, cupons, inteligência, academy, suporte, estoque e vendas pelo WhatsApp.`
              : "Sua banca está no Premium com campanhas, colaboradores, publi editorial, destaque na plataforma, distribuidores e suporte prioritário liberados."}
          </p>
          {currentSubscriptionStatus === "pending" && requestedPlanName ? (
            <div className="mt-3">
              <PlanPendingActivationCard requestedPlanName={requestedPlanName} />
            </div>
          ) : currentSubscriptionStatus === "overdue" ? (
            <div className="mt-3">
              <PlanOverdueCard
                planName={banca?.subscription?.plan?.name || currentPlanName}
                graceEndsAt={overdueGraceEndsAt}
                accessSuspended={overdueFeaturesLocked}
                showSupportAction
              />
            </div>
          ) : (
            <div className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
              currentSubscriptionStatus === "overdue"
                ? "border-red-200 bg-red-50 text-red-900"
                : currentSubscriptionStatus === "trial"
                  ? "border-blue-200 bg-blue-50 text-blue-900"
                  : "border-green-200 bg-green-50 text-green-900"
            }`}>
              {currentSubscriptionMeta.message}
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Capacidade do catálogo</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {currentPlanLimit ? `Até ${currentPlanLimit} produtos próprios` : "Sem limite configurado"}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {currentPlanType === "free"
                  ? `No Free, sua banca publica até ${currentPlanLimit || 10} produtos próprios e continua operando estoque, pedidos e vendas. Hoje a vitrine tem ${memoizedMetrics.produtosAtivos} produtos ativos.`
                  : `Hoje sua banca tem ${memoizedMetrics.produtosAtivos} produtos ativos na vitrine.`}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Recursos premium</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {banca?.entitlements?.can_access_distributor_catalog ? "Premium liberado" : "Upgrade opcional"}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {banca?.entitlements?.can_access_distributor_catalog
                  ? "Distribuidores, campanhas, publi editorial, destaque e suporte prioritário já estão disponíveis para sua banca."
                  : "Distribuidores, campanhas, publi editorial, destaque na plataforma, colaboradores e suporte prioritário entram no Premium quando fizer sentido escalar."}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={("/jornaleiro/inteligencia" as Route)}
              className="inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Abrir central de inteligência
            </Link>
            <Link
              href={("/jornaleiro/meu-plano" as Route)}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              {currentSubscriptionStatus === "pending" ? "Ver cobrança do plano" : "Entender meus planos"}
            </Link>
            {banca?.entitlements?.can_access_distributor_catalog ? (
              <Link
                href={("/jornaleiro/catalogo-distribuidor" as Route)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Abrir catálogo parceiro
              </Link>
            ) : null}
          </div>

          {completedChecklistCount === checklistItems.length ? (
            <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
              <div className="font-semibold">Checklist inicial concluído</div>
              <p className="mt-1">
                Sua banca já passou pelo básico. Continue operando normalmente no {currentPlanName} e só ative o Premium quando quiser destravar aquisição, distribuidores e mais visibilidade.
              </p>
            </div>
          ) : null}
        </div>

        {currentPlanType === "free" ? (
          <div className="rounded-2xl border border-orange-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
              Regras do seu plano atual
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">Seu plano atual: Free</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sua banca já pode operar no plano Free com até <strong>{currentPlanLimit || 10} produtos próprios</strong>. Isso já cobre operação básica, vendas, estoque, cupons, inteligência, academy, exposição nas redes sociais e suporte sem cobrança.
            </p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <div className="font-semibold text-gray-900">O que fica liberado agora</div>
              <ul className="mt-2 space-y-2">
                <li>• Até {currentPlanLimit || 10} produtos próprios publicados</li>
                <li>• Gestão de vendas e pedidos</li>
                <li>• Venda pelo WhatsApp</li>
                <li>• Gestão de estoque</li>
                <li>• Cupons, inteligência e academy</li>
                <li>• Exposição nas redes sociais da plataforma</li>
                <li>• Suporte e publicação básica da banca</li>
              </ul>
            </div>
            <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <div className="font-semibold text-gray-900">O que o Premium destrava</div>
              <ul className="mt-2 space-y-2">
                <li>• Campanhas e colaboradores</li>
                <li>• Publi editorial e destaque na plataforma</li>
                <li>• Distribuidores e catálogo parceiro</li>
                <li>• Suporte prioritário</li>
              </ul>
            </div>
            <div className="mt-4">
              <Link
                href={("/jornaleiro/meu-plano" as Route)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Ver como ativar o Premium
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
              Evolução da banca
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">{currentPlanName}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sua banca já está no Premium. Use campanhas, colaboradores, publi editorial, destaque e distribuidores para acelerar aquisição e abastecimento.
            </p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              O Premium mantém tudo do Free e adiciona campanhas, colaboradores, publi editorial, destaque na plataforma, distribuidores e suporte prioritário.
            </div>
          </div>
        )}
      </div>

      {/* Alerta de documento operacional da banca */}
      {needsTpuAlert && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>  
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-amber-900 mb-2">
                📄 Documento da banca pendente
              </div>
              <p className="text-sm text-amber-800 mb-4">
                <strong>Seu cadastro só será liberado após o envio do documento operacional da banca (TPU).</strong>
                <br />
                Esse arquivo é obrigatório para concluir a ativação.
              </p>
              <div>
                <Link
                  href="/jornaleiro/banca-v2"
                  className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Enviar documento da banca
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 justify-items-center sm:justify-items-stretch max-w-full">
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : memoizedMetrics.pedidosHoje}
          </div>
          <div className="mt-1 text-xs text-gray-400">Total de pedidos recebidos nas últimas horas</div>
        </div>
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Faturamento hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : `R$ ${memoizedMetrics.faturamentoHoje.toFixed(2)}`}
          </div>
          <div className="mt-1 text-xs text-gray-400">Somatório dos pedidos do dia</div>
        </div>
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos pendentes</div>
          <div className={`mt-1 text-3xl font-semibold ${memoizedMetrics.pedidosPendentes > 0 ? "text-orange-600" : "text-gray-900"}`}>
            {loadingMetrics ? "--" : memoizedMetrics.pedidosPendentes}
          </div>
          <div className="mt-1 text-xs text-gray-400">Novos, confirmados e em preparo</div>
        </div>
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Produtos ativos</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : memoizedMetrics.produtosAtivos}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {banca?.entitlements?.can_access_distributor_catalog ? 'Próprios + catálogo parceiro' : 'Itens visíveis na vitrine'}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-x-auto max-w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Pedidos recentes</h2>
            <p className="text-sm text-gray-600">Acompanhe os últimos pedidos recebidos.</p>
          </div>
          <Link href={("/jornaleiro/pedidos" as Route)} className="text-[#ff5c00] text-sm font-medium">Ver todos</Link>
        </div>
        {loadingMetrics ? (
          <div className="text-sm text-gray-500">Carregando pedidos...</div>
        ) : memoizedRecentOrders.length === 0 ? (
          <div className="text-sm text-gray-500">Nenhum pedido encontrado.</div>
        ) : (
          <div className="space-y-3 text-sm min-w-0">
            {memoizedRecentOrders.map((order) => (
              <div key={order.id} className="flex items-center rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50 transition-colors min-w-0 max-w-full">
                <div className="truncate text-gray-900 font-medium flex-1 min-w-0">{order.customer_name || order.customer}</div>
                <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'novo' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'em_preparo' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'entregue' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-gray-500 min-w-[70px] text-right">R$ {Number(order.total || 0).toFixed(2)}</span>
                  <Link 
                    href={`/jornaleiro/pedidos/${order.id}` as Route}
                    className="p-1.5 text-gray-400 hover:text-[#ff5c00] hover:bg-orange-50 rounded-md transition-colors"
                    title="Ver detalhes"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
