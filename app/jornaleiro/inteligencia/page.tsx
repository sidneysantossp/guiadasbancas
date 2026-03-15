"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type IntelligencePayload = {
  period: string;
  generatedAt: string;
  banca: {
    id: string;
    name: string;
    checklist_completed: number;
    checklist_total: number;
    is_published: boolean;
    has_branding: boolean;
    has_contact_channel: boolean;
    has_opening_hours: boolean;
    has_products: boolean;
  };
  summary: {
    orders_period: number;
    orders_today: number;
    open_orders: number;
    revenue_period: number;
    average_ticket: number;
    active_own_products: number;
    partner_catalog_products: number;
    products_without_image: number;
    out_of_stock_products: number;
    recent_catalog_updates: number;
    active_campaigns: number;
    pending_campaigns: number;
    page_views: number;
    product_views: number;
    add_to_cart: number;
    whatsapp_clicks: number;
    checkout_starts: number;
    checkout_completes: number;
    searches: number;
    unique_sessions: number;
    catalog_coverage_rate: number;
  };
  plan: {
    name: string;
    type: string;
    product_limit: number | null;
    can_access_distributor_catalog: boolean;
    can_access_partner_directory: boolean;
    subscription_status: string;
  };
  funnel: { stage: string; value: number }[];
  topSearches: { term: string; count: number }[];
  topProducts: { id: string; name: string; views: number; clicks: number; cart: number; whatsapp: number; total: number }[];
  alerts: { id: string; tone: "warning" | "critical" | "info" | "success"; title: string; description: string; href: string }[];
  recommendations: { id: string; title: string; description: string; href: string; priority: number }[];
};

const PERIOD_OPTIONS = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "all", label: "Todo periodo" },
] as const;

const ALERT_STYLES = {
  critical: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
  success: "border-green-200 bg-green-50 text-green-900",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatGeneratedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function JornaleiroInteligenciaPage() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<IntelligencePayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(`/api/jornaleiro/inteligencia?period=${period}`, {
          cache: "no-store",
          credentials: "include",
        });
        const json = await response.json().catch(() => null);

        if (!response.ok || !json?.success) {
          throw new Error(json?.error || "Não foi possível carregar a central de inteligência da banca.");
        }

        setPayload(json);
      } catch (error: any) {
        console.error("[Jornaleiro/Inteligencia] Erro ao carregar:", error);
        setPayload(null);
        setErrorMessage(error?.message || "Não foi possível carregar a central de inteligência da banca.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [period]);

  const checklistPercent = useMemo(() => {
    if (!payload?.banca?.checklist_total) return 0;
    return Math.round((payload.banca.checklist_completed / payload.banca.checklist_total) * 100);
  }, [payload]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff5c00]" />
          <p className="mt-4 text-sm text-gray-600">Carregando a inteligência da sua banca...</p>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        {errorMessage || "Não foi possível carregar a central de inteligência da banca."}
      </div>
    );
  }

  const { summary, banca, alerts, recommendations, topProducts, topSearches, funnel, plan } = payload;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#ff5c00] shadow-sm">
              Central de inteligencia da banca
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">
              Entenda o que esta acontecendo na sua banca
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
              Aqui voce enxerga operacao, vitrine, catalogo, demanda e proximo passo. A ideia nao e gerar relatorio por relatorio, e sim deixar claro o que precisa de atencao agora.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px] lg:grid-cols-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Publicacao</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {banca.is_published ? "Banca publicada" : "Banca ainda nao publicada"}
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {banca.is_published
                  ? "Sua banca ja pode ser encontrada pelos clientes."
                  : "Foque em fechar o cadastro e a publicacao para converter a operacao em descoberta."}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Checklist inicial</div>
                <span className="text-sm font-semibold text-gray-700">{checklistPercent}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#ff5c00]" style={{ width: `${checklistPercent}%` }} />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {banca.checklist_completed}/{banca.checklist_total} passos concluídos para a base da banca.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/jornaleiro/dashboard"
            className="inline-flex items-center rounded-xl bg-[#ff5c00] px-4 py-2.5 font-semibold text-white shadow-sm hover:opacity-90"
          >
            Voltar ao painel principal
          </Link>
          <Link
            href="/jornaleiro/banca-v2"
            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Revisar banca
          </Link>
          <Link
            href="/jornaleiro/pedidos"
            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Abrir pedidos
          </Link>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="grid gap-3">
          {alerts.map((alert) => (
            <Link
              key={alert.id}
              href={alert.href}
              className={`rounded-2xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 ${ALERT_STYLES[alert.tone]}`}
            >
              <div className="text-base font-semibold">{alert.title}</div>
              <p className="mt-1 text-sm leading-6">{alert.description}</p>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Leitura do período</h2>
          <p className="text-sm text-gray-600">
            Atualizado em {formatGeneratedAt(payload.generatedAt)}.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                period === option.value ? "bg-[#fff3ec] text-[#ff5c00]" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos no período</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{summary.orders_period}</div>
          <p className="mt-2 text-xs text-gray-500">{summary.orders_today} chegaram hoje</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Receita no período</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{formatCurrency(summary.revenue_period)}</div>
          <p className="mt-2 text-xs text-gray-500">Ticket médio de {formatCurrency(summary.average_ticket)}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Catálogo próprio</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{summary.active_own_products}</div>
          <p className="mt-2 text-xs text-gray-500">
            {summary.products_without_image} sem imagem · {summary.out_of_stock_products} sem estoque
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Visibilidade da banca</div>
          <div className="mt-2 text-3xl font-semibold text-gray-900">{summary.page_views}</div>
          <p className="mt-2 text-xs text-gray-500">{summary.product_views} visualizações de produto</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Funil da banca</h2>
              <p className="text-sm text-gray-600">Da descoberta até o pedido.</p>
            </div>
            <Link href="/jornaleiro/relatorios/analytics" className="text-sm font-semibold text-[#ff5c00] hover:opacity-80">
              Ver analytics detalhado
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {funnel.map((item) => (
              <div key={item.stage} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{item.stage}</div>
                <div className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Demanda ativa</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">{summary.searches} buscas</div>
              <p className="mt-1 text-sm text-gray-600">
                {summary.add_to_cart} adições ao carrinho · {summary.checkout_starts} checkouts iniciados
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Canal de atendimento</div>
              <div className="mt-2 text-lg font-semibold text-gray-900">{summary.whatsapp_clicks} cliques no WhatsApp</div>
              <p className="mt-1 text-sm text-gray-600">
                {summary.checkout_completes} pedidos fechados a partir da jornada
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Estado atual da banca</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Plano em uso</span>
                <span className="font-semibold text-gray-900">{plan.name}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Status da assinatura</span>
                <span className="font-semibold capitalize text-gray-900">{plan.subscription_status}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Cobertura do catálogo</span>
                <span className="font-semibold text-gray-900">{summary.catalog_coverage_rate}%</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Catálogo parceiro</span>
                <span className="font-semibold text-gray-900">
                  {plan.can_access_distributor_catalog ? "Liberado" : "Não liberado"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-gray-600">Rede de distribuidores</span>
                <span className="font-semibold text-gray-900">
                  {plan.can_access_partner_directory ? "Liberada" : "Não liberada"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Próximos melhores passos</h2>
            <div className="mt-4 space-y-3">
              {recommendations.length === 0 ? (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                  Sua banca está organizada. O momento agora é manter consistência na operação e acompanhar os sinais da inteligência.
                </div>
              ) : (
                recommendations.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="block rounded-2xl border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-orange-200 hover:bg-orange-50"
                  >
                    <div className="text-base font-semibold text-gray-900">{item.title}</div>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Produtos com mais sinal de interesse</h2>
            <Link href="/jornaleiro/produtos" className="text-sm font-semibold text-[#ff5c00] hover:opacity-80">
              Ver produtos
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {topProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Ainda não existe interação suficiente para ranquear produtos neste período.
              </div>
            ) : (
              topProducts.map((product) => (
                <div key={product.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="font-semibold text-gray-900">{product.name}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                    <span className="rounded-full bg-white px-2.5 py-1">Views: {product.views}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">Cliques: {product.clicks}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">Carrinho: {product.cart}</span>
                    <span className="rounded-full bg-white px-2.5 py-1">WhatsApp: {product.whatsapp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">O que os clientes estão buscando</h2>
            <Link href="/jornaleiro/produtos" className="text-sm font-semibold text-[#ff5c00] hover:opacity-80">
              Revisar catálogo
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {topSearches.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Ainda não existem buscas suficientes para montar o ranking deste período.
              </div>
            ) : (
              topSearches.map((search) => (
                <div key={search.term} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="font-medium text-gray-900">{search.term}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {search.count} buscas
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
