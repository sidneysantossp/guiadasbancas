"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAuth } from "@/lib/auth/AuthContext";
import PlanOverdueCard from "@/components/jornaleiro/PlanOverdueCard";
import PlanPendingActivationCard from "@/components/jornaleiro/PlanPendingActivationCard";
import PlanEntryGuide from "@/components/jornaleiro/PlanEntryGuide";

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
  const { user, profile, isJornaleiro } = useAuth();
  const [banca, setBanca] = useState<any>(null);
  const [loadingBanca, setLoadingBanca] = useState(true);
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
    try {
      setLoadingBanca(true);
      const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
        cache: "no-store",
        credentials: "include",
      });
      const text = await res.text();
      const json = JSON.parse(text);
      if (!res.ok || !json?.success || !json?.data) {
        throw new Error(json?.error || `HTTP ${res.status}`);
      }

      console.log('[Dashboard] 🏪 Banca carregada:', json.data);
      setBanca(json.data);
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
  const isPublished = Boolean(banca?.active && banca?.approved);
  const nextObjective = useMemo(() => {
    if (!checklistItems.find((item) => !item.done)) {
      if (!isPublished) {
        return {
          eyebrow: "Publicação da banca",
          title: "Feche a publicação da sua banca",
          description: "O básico já foi concluído. Agora revise cadastro, aprovação e visibilidade para colocar a banca em produção.",
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
  }, [checklistItems, isPublished, memoizedMetrics.pedidosPendentes]);
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

  // Se não tem banca, mostrar CTA para cadastrar
  if (!loadingBanca && !banca) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastre sua Banca</h1>
          <p className="text-gray-600 mb-6">
            Para começar a vender, você precisa cadastrar sua banca com informações como nome, endereço e horário de funcionamento.
          </p>
          <Link
            href="/jornaleiro/banca-v2"
            className="inline-block bg-[#ff5c00] text-white px-6 py-3 rounded-md hover:opacity-90 font-semibold"
          >
            Cadastrar Minha Banca
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
          <p className="mt-4 text-sm text-gray-600">Carregando o painel da sua banca...</p>
        </div>
      </div>
    );
  }

  // Verificar se precisa mostrar alerta de TPU
  const needsTpuAlert = banca && !banca.is_cotista && !banca.tpu_url;
  
  console.log('[Dashboard] 🚨 Verificação do alerta TPU:', {
    banca_exists: !!banca,
    is_cotista: banca?.is_cotista,
    is_cotista_type: typeof banca?.is_cotista,
    not_is_cotista: !banca?.is_cotista,
    tpu_url: banca?.tpu_url,
    not_tpu_url: !banca?.tpu_url,
    needsTpuAlert
  });

  return (
    <div className="space-y-4 overflow-x-hidden px-3 sm:px-0 max-w-full">
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5c00] shadow-sm">
              {isPublished ? "Banca em operação" : "Banca em preparação"}
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900">Olá, {sellerName}</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              {isPublished
                ? "Sua banca já está publicada. Agora o foco é manter catálogo, pedidos e demanda sob controle."
                : "Seu painel já está pronto para organizar a banca, fechar o cadastro e preparar a publicação com menos atrito."}
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
          className={`mt-4 rounded-2xl border p-4 text-sm shadow-sm ${
            isPublished ? "border-green-200 bg-green-50 text-green-800" : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold">
                {isPublished ? "Sua banca já está publicada" : "Sua banca ainda não está publicada"}
              </h2>
              <p className="mt-1">
                {isPublished
                  ? "Os clientes já podem encontrar sua banca na vitrine pública."
                  : "Você já pode configurar tudo por aqui, mas a banca ainda não aparece para os clientes enquanto publicação e aprovação não forem concluídas."}
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
            O plano sustenta os recursos da banca, mas a prioridade continua sendo operação, catálogo e publicação. O upgrade entra quando resolver uma necessidade concreta.
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
                Hoje sua banca tem {memoizedMetrics.produtosAtivos} produtos ativos na vitrine.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Rede parceira</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {banca?.entitlements?.can_access_distributor_catalog ? "Acesso liberado" : "Ainda bloqueado"}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {banca?.entitlements?.can_access_distributor_catalog
                  ? "Sua banca já pode navegar pelo catálogo parceiro dentro do painel."
                  : "Quando fizer sentido para sua operação, você pode liberar distribuidores e catálogo parceiro no upgrade."}
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
                Sua banca já passou pelo básico. Continue operando normalmente no {currentPlanName} e deixe o upgrade para quando a operação realmente pedir mais capacidade.
              </p>
            </div>
          ) : null}
        </div>

        {currentPlanType === "free" ? (
          <PlanEntryGuide compact className="bg-white" />
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
              Evolução da banca
            </div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">{currentPlanName}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Sua banca já está acima do plano inicial. Continue usando o painel normalmente e só revise upgrade quando surgir uma necessidade real da operação.
            </p>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              Produtos, distribuidores e limites mais avançados continuam sendo liberados por contexto, sem transformar o painel numa vitrine de planos logo de saída.
            </div>
          </div>
        )}
      </div>

      {/* Alerta TPU para não-cotistas sem documento */}
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
                📄 Documento Pendente
              </div>
              <p className="text-sm text-amber-800 mb-4">
                <strong>Seu cadastro da banca só será liberado após o envio do Termo de Permissão de Uso (TPU).</strong>
                <br />
                Documento obrigatório para ativação.
              </p>
              <div>
                <Link
                  href="/jornaleiro/banca-v2"
                  className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Enviar TPU da minha banca
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
