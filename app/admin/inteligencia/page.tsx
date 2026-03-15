"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Summary = {
  total_users: number;
  total_clientes: number;
  total_jornaleiros: number;
  total_admins: number;
  total_bancas: number;
  active_bancas: number;
  approved_bancas: number;
  pending_bancas: number;
  published_bancas: number;
  bancas_with_catalog: number;
  bancas_with_orders: number;
  published_without_catalog: number;
  catalog_without_orders: number;
  total_distribuidores: number;
  active_distribuidores: number;
  stale_distribuidores: number;
  active_distribuidores_without_products: number;
  total_products: number;
  active_products: number;
  banca_products: number;
  distributor_products: number;
  products_without_image: number;
  total_categories: number;
  total_distributor_categories: number;
  total_orders_period: number;
  orders_today: number;
  open_orders: number;
  gmv_period: number;
  average_ticket: number;
  active_campaigns: number;
  mrr_active: number;
  open_revenue: number;
  period_received_revenue: number;
  paid_bancas: number;
  paid_conversion_rate: number;
  active_paid_bancas: number;
  pending_paid_bancas: number;
  overdue_paid_bancas: number;
  trial_paid_bancas: number;
  page_views: number;
  product_views: number;
  add_to_cart: number;
  checkout_starts: number;
  checkout_completes: number;
  searches: number;
  unique_sessions: number;
  cart_to_checkout_rate: number;
  search_to_checkout_rate: number;
};

type DistributionItem = {
  name: string;
  value: number;
  color?: string;
};

type AlertItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "critical" | "warning" | "info";
};

type IntelligencePayload = {
  success: boolean;
  summary: Summary;
  actorDistribution: DistributionItem[];
  planDistribution: DistributionItem[];
  orderStatusDistribution: DistributionItem[];
  subscriptionStatusDistribution: DistributionItem[];
  funnel: Array<{ stage: string; value: number }>;
  activationFunnel: Array<{ stage: string; value: number }>;
  supplyFunnel: Array<{ stage: string; value: number }>;
  demandTimeline: Array<{
    key: string;
    label: string;
    searches: number;
    product_views: number;
    checkout_completes: number;
    orders: number;
    revenue: number;
  }>;
  topSearches: Array<{ term: string; count: number }>;
  topBancas: Array<{ id: string; name: string; orders: number; revenue: number }>;
  topProducts: Array<{ id: string; name: string; banca_name: string; views: number; clicks: number; cart: number; total: number }>;
  distributorHealth: Array<{ id: string; name: string; products: number; last_sync: string | null; status: string }>;
  operationSignals: Array<{
    id: string;
    title: string;
    value: number;
    description: string;
    href: string;
    tone: "critical" | "warning" | "info";
  }>;
  alerts: AlertItem[];
};

const PERIOD_OPTIONS = [
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "90 dias", value: "90d" },
  { label: "Todo o periodo", value: "all" },
];

const ARCHITECTURE_BLOCKS: Array<{
  title: string;
  description: string;
  routes: Array<{ label: string; href: Route }>;
}> = [
  {
    title: "Site e aquisicao",
    description: "Controla home, vitrines, blog e campanhas que alimentam a descoberta e a demanda do marketplace.",
    routes: [
      { label: "Home", href: "/admin/cms/home" },
      { label: "Vitrines", href: "/admin/cms/vitrines" },
      { label: "Campanhas", href: "/admin/campaigns" },
    ],
  },
  {
    title: "Rede de bancas",
    description: "Orquestra cadastro, aprovacao, operacao e monetizacao das bancas e dos jornaleiros.",
    routes: [
      { label: "Bancas", href: "/admin/bancas" },
      { label: "Assinaturas", href: "/admin/assinaturas" },
      { label: "Planos", href: "/admin/planos" },
    ],
  },
  {
    title: "Oferta e abastecimento",
    description: "Conecta produtos, categorias, distribuidores, imagens e sync Mercos para manter o catalogo vivo.",
    routes: [
      { label: "Produtos", href: "/admin/products" },
      { label: "Distribuidores", href: "/admin/distribuidores" },
      { label: "Sync Mercos", href: "/admin/configuracoes/sync-mercos" },
    ],
  },
  {
    title: "Governanca e plataforma",
    description: "Concentra auditoria, chaves, WhatsApp, cobranca e configuracoes estruturais do ecossistema.",
    routes: [
      { label: "Auditoria", href: "/admin/audit" },
      { label: "Chaves API", href: "/admin/configuracoes/chaves-api" },
      { label: "Cobranca", href: "/admin/configuracoes" },
    ],
  },
];

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold text-gray-900">{value}</div>
      <div className="mt-2 text-sm leading-6 text-gray-500">{helper}</div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "Sem sync";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getAlertClasses(tone: AlertItem["tone"]) {
  if (tone === "critical") return "border-red-200 bg-red-50 text-red-800";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-blue-200 bg-blue-50 text-blue-800";
}

function getSignalClasses(tone: "critical" | "warning" | "info") {
  if (tone === "critical") return "border-red-200 bg-red-50";
  if (tone === "warning") return "border-amber-200 bg-amber-50";
  return "border-gray-200 bg-gray-50";
}

function getDistributorStatusMeta(status: string) {
  if (status === "stale") {
    return { label: "Sync atrasado", className: "bg-amber-100 text-amber-700" };
  }
  if (status === "inactive") {
    return { label: "Inativo", className: "bg-gray-100 text-gray-700" };
  }
  return { label: "Saudavel", className: "bg-green-100 text-green-700" };
}

export default function AdminInteligenciaPage() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<IntelligencePayload | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminWithDevFallback(`/api/admin/inteligencia?period=${period}`);
        const json = await response.json();
        if (json.success) {
          setPayload(json);
        }
      } catch (error) {
        console.error("Erro ao carregar inteligencia:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [period]);

  const summary = payload?.summary;

  const executiveCards = useMemo(() => {
    if (!summary) return [];

    return [
      {
        title: "GMV no periodo",
        value: formatCurrency(summary.gmv_period),
        helper: `${summary.total_orders_period} pedidos e ticket medio de ${formatCurrency(summary.average_ticket)}`,
      },
      {
        title: "MRR ativo",
        value: formatCurrency(summary.mrr_active),
        helper: `${summary.active_paid_bancas} bancas ativas e ${summary.trial_paid_bancas} em degustacao`,
      },
      {
        title: "Receita em aberto",
        value: formatCurrency(summary.open_revenue),
        helper: `${summary.pending_paid_bancas} aguardando pagamento e ${summary.overdue_paid_bancas} em atraso`,
      },
      {
        title: "Bancas operando",
        value: `${summary.published_bancas}/${summary.total_bancas}`,
        helper: `${summary.approved_bancas} aprovadas, ${summary.bancas_with_catalog} com catalogo e ${summary.pending_bancas} pendentes`,
      },
      {
        title: "Oferta ativa",
        value: `${summary.active_products}`,
        helper: `${summary.distributor_products} de distribuidores e ${summary.banca_products} proprios`,
      },
      {
        title: "Conversao de demanda",
        value: `${summary.search_to_checkout_rate.toFixed(1)}%`,
        helper: `${summary.searches} buscas e ${summary.checkout_completes} pedidos concluidos`,
      },
    ];
  }, [summary]);

  if (loading && !payload) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Central de Inteligencia</h1>
          <p className="mt-2 text-sm text-gray-600">Carregando indicadores do ecossistema...</p>
        </div>
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
          <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#ff5c00]" />
        </div>
      </div>
    );
  }

  if (!payload || !summary) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        Nao foi possivel carregar a central de inteligencia.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Central de Inteligencia</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Esta camada reposiciona o admin como centro executivo do marketplace, conectando demanda do site,
            operacao das bancas, oferta dos distribuidores, monetizacao por planos e saude da plataforma.
          </p>
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 xl:w-52"
        >
          {PERIOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {executiveCards.map((card) => (
          <SummaryCard key={card.title} title={card.title} value={card.value} helper={card.helper} />
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">Nova arquitetura operacional do admin</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
            O admin foi reorganizado por dominios do marketplace. Isso elimina menus soltos e aproxima o painel
            da operacao real: aquisicao, rede de bancas, abastecimento, monetizacao e governanca.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {ARCHITECTURE_BLOCKS.map((block) => (
            <div key={block.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-base font-semibold text-gray-900">{block.title}</div>
              <p className="mt-3 text-sm leading-6 text-gray-600">{block.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {block.routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#ff5c00] hover:text-[#ff5c00]"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Ecossistema conectado</h2>
            <p className="mt-2 text-sm text-gray-600">
              Base atual dos atores principais que alimentam o site, o painel do usuario, o painel do jornaleiro e o portal do distribuidor.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payload.actorDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {payload.actorDistribution.map((item) => (
                    <Cell key={item.name} fill={item.color || "#f97316"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Mix de planos</h2>
            <p className="mt-2 text-sm text-gray-600">
              {summary.paid_bancas} bancas pagas, com conversao atual de {summary.paid_conversion_rate.toFixed(1)}%.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={payload.planDistribution} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95}>
                  {payload.planDistribution.map((item) => (
                    <Cell key={item.name} fill={item.color || "#f97316"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Demanda e receita ao longo do tempo</h2>
            <p className="mt-2 text-sm text-gray-600">
              Conecta busca, checkout, pedidos e faturamento em uma leitura temporal unica.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payload.demandTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="searches" name="Buscas" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="orders" name="Pedidos" stroke="#f97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="checkout_completes" name="Checkout" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Saude das assinaturas</h2>
            <p className="mt-2 text-sm text-gray-600">
              Distribuicao atual da base paga entre ativacao, degustacao, pendencia e inadimplencia.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={payload.subscriptionStatusDistribution} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95}>
                  {payload.subscriptionStatusDistribution.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        item.name === "Ativas"
                          ? "#16a34a"
                          : item.name === "Degustacao"
                            ? "#2563eb"
                            : item.name === "Aguardando"
                              ? "#f59e0b"
                              : "#dc2626"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Funil de demanda</h2>
            <p className="mt-2 text-sm text-gray-600">
              Demanda do frontend ate a conclusao do pedido, para orientar conteudo, oferta e operacao.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payload.funnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Funil de supply</h2>
            <p className="mt-2 text-sm text-gray-600">
              Mostra quanto da base de distribuidores realmente se transforma em oferta pronta para vender.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payload.supplyFunnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Funil de ativacao da rede</h2>
            <p className="mt-2 text-sm text-gray-600">
              Mede a progressao do jornaleiro ate a banca publicada com catalogo e pedidos.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payload.activationFunnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Distribuicao dos pedidos</h2>
            <p className="mt-2 text-sm text-gray-600">
              Status operacionais que mais impactam atendimento, entrega e experiencia do cliente.
            </p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payload.orderStatusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Alavancas operacionais</h2>
            <p className="mt-2 text-sm text-gray-600">
              Leitura direta dos gargalos que travam ativacao, abastecimento e conversao do marketplace.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {payload.operationSignals.map((signal) => (
              <Link
                key={signal.id}
                href={signal.href as Route}
                className={`rounded-2xl border p-4 transition hover:shadow-sm ${getSignalClasses(signal.tone)}`}
              >
                <div className="text-sm font-medium text-gray-600">{signal.title}</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">{signal.value}</div>
                <div className="mt-2 text-sm leading-6 text-gray-600">{signal.description}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Alertas priorizados</h2>
            <p className="mt-2 text-sm text-gray-600">Itens que merecem acao imediata do time de operacao.</p>
          </div>
          <div className="space-y-3">
            {payload.alerts.length === 0 ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                Nenhum alerta critico no periodo selecionado.
              </div>
            ) : (
              payload.alerts.map((alert) => (
                <Link
                  key={alert.id}
                  href={alert.href as Route}
                  className={`block rounded-xl border p-4 text-sm transition hover:shadow-sm ${getAlertClasses(alert.tone)}`}
                >
                  <div className="font-semibold">{alert.title}</div>
                  <div className="mt-2 leading-6">{alert.description}</div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Buscas em alta</h2>
              <p className="mt-2 text-sm text-gray-600">Demanda capturada no frontend que pode orientar oferta e vitrines.</p>
            </div>
            <Link href="/admin/analytics" className="text-sm font-medium text-[#ff5c00]">
              Ver analytics
            </Link>
          </div>
          <div className="space-y-3">
            {payload.topSearches.length === 0 ? (
              <div className="text-sm text-gray-500">Sem buscas relevantes no periodo.</div>
            ) : (
              payload.topSearches.map((item) => (
                <div key={item.term} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div className="min-w-0 pr-4 text-sm font-medium text-gray-800">{item.term}</div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600">{item.count}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bancas lideres no periodo</h2>
              <p className="mt-2 text-sm text-gray-600">Bancas com melhor movimento operacional dentro do recorte selecionado.</p>
            </div>
            <Link href="/admin/orders" className="text-sm font-medium text-[#ff5c00]">
              Ver pedidos
            </Link>
          </div>
          <div className="space-y-3">
            {payload.topBancas.length === 0 ? (
              <div className="text-sm text-gray-500">Sem movimentacao relevante no periodo.</div>
            ) : (
              payload.topBancas.map((item) => (
                <div key={item.id} className="rounded-xl bg-gray-50 px-4 py-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>{item.orders} pedidos</span>
                    <span>{formatCurrency(item.revenue)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Saude dos distribuidores</h2>
              <p className="mt-2 text-sm text-gray-600">Monitora a cadeia de abastecimento que alimenta o painel do distribuidor e o catalogo parceiro.</p>
            </div>
            <Link href="/admin/configuracoes/sync-mercos" className="text-sm font-medium text-[#ff5c00]">
              Ver sync
            </Link>
          </div>
          <div className="space-y-3">
            {payload.distributorHealth.map((item) => {
              const statusMeta = getDistributorStatusMeta(item.status);
              return (
                <div key={item.id} className="rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta.className}`}>
                      {statusMeta.label}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                    <span>{item.products} produtos</span>
                    <span>{formatDate(item.last_sync)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Produtos com maior demanda</h2>
            <p className="mt-2 text-sm text-gray-600">Leitura cruzada entre interesse do usuario, clique e carrinho.</p>
          </div>
          <div className="space-y-3">
            {payload.topProducts.length === 0 ? (
              <div className="text-sm text-gray-500">Sem produtos com interacao suficiente no periodo.</div>
            ) : (
              payload.topProducts.map((item) => (
                <div key={item.id} className="rounded-xl bg-gray-50 px-4 py-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="mt-1 text-sm text-gray-500">{item.banca_name}</div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-xs text-gray-600">
                    <div>Views: {item.views}</div>
                    <div>Cliques: {item.clicks}</div>
                    <div>Carrinho: {item.cart}</div>
                    <div>Total: {item.total}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Radar de operacao</h2>
            <p className="mt-2 text-sm text-gray-600">Indicadores taticos que conectam conteudo, oferta, pedidos e monetizacao.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Pedidos em aberto</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{summary.open_orders}</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Produtos sem imagem</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{summary.products_without_image}</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Categorias globais</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{summary.total_categories}</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Campanhas ativas</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{summary.active_campaigns}</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Carrinho para pedido</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{summary.cart_to_checkout_rate.toFixed(1)}%</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm text-gray-500">Recebido no periodo</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(summary.period_received_revenue)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
