"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type DashboardSummary = {
  total_bancas: number;
  active_bancas: number;
  pending_bancas: number;
  published_bancas: number;
  bancas_with_catalog: number;
  catalog_without_orders: number;
  total_orders_period: number;
  orders_today: number;
  open_orders: number;
  total_products: number;
  active_products: number;
  products_without_image: number;
  total_distribuidores: number;
  stale_distribuidores: number;
  mrr_active: number;
  open_revenue: number;
  paid_conversion_rate: number;
  searches: number;
  checkout_completes: number;
};

type DashboardPayload = {
  success: boolean;
  summary: DashboardSummary;
  alerts: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    tone: "critical" | "warning" | "info";
  }>;
};

const QUICK_ACTIONS: Array<{ title: string; description: string; href: Route }> = [
  {
    title: "Operar bancas e aprovacoes",
    description: "Entrada de novas bancas, ajustes cadastrais e validacao operacional da rede.",
    href: "/admin/bancas",
  },
  {
    title: "Controlar oferta e abastecimento",
    description: "Produtos, distribuidores, categorias, imagens e sincronizacao Mercos.",
    href: "/admin/distribuidores",
  },
  {
    title: "Gerenciar monetizacao",
    description: "Planos, assinaturas, cobranca, degustacao e inadimplencia.",
    href: "/admin/assinaturas",
  },
  {
    title: "Ler inteligencia da plataforma",
    description: "Cruza comportamento, operacao, oferta e receita em uma unica camada executiva.",
    href: "/admin/inteligencia",
  },
];

function MetricCard({
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

function getAlertClasses(tone: "critical" | "warning" | "info") {
  if (tone === "critical") return "border-red-200 bg-red-50 text-red-800";
  if (tone === "warning") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-blue-200 bg-blue-50 text-blue-800";
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState<DashboardPayload | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetchAdminWithDevFallback("/api/admin/inteligencia?period=30d");
        const json = await response.json();
        if (json.success) {
          setPayload(json);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard administrativo:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const cards = useMemo(() => {
    if (!payload?.summary) return [];

    const summary = payload.summary;

    return [
      {
        title: "Rede de bancas",
        value: `${summary.published_bancas}/${summary.total_bancas}`,
        helper: `${summary.bancas_with_catalog} com catalogo e ${summary.pending_bancas} aguardando tratamento`,
      },
      {
        title: "Pedidos e operacao",
        value: `${summary.orders_today}`,
        helper: `${summary.open_orders} em aberto e ${summary.catalog_without_orders} bancas com catalogo sem pedido`,
      },
      {
        title: "Oferta ativa",
        value: `${summary.active_products}`,
        helper: `${summary.products_without_image} produtos ainda sem imagem`,
      },
      {
        title: "Distribuidores",
        value: `${summary.total_distribuidores}`,
        helper: `${summary.stale_distribuidores} com sincronizacao atrasada`,
      },
      {
        title: "Receita ativa",
        value: formatCurrency(summary.mrr_active),
        helper: `${formatCurrency(summary.open_revenue)} ainda em aberto`,
      },
      {
        title: "Demanda capturada",
        value: `${summary.searches}`,
        helper: `${summary.checkout_completes} pedidos a partir da navegacao do site`,
      },
    ];
  }, [payload]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Centro de comando do marketplace</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            O admin agora parte da operacao real da plataforma: rede de bancas, demanda do site, oferta dos distribuidores,
            monetizacao por planos e governanca dos fluxos criticos.
          </p>
        </div>

        <Link
          href="/admin/inteligencia"
          className="inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#e55300]"
        >
          Abrir inteligencia de dados
        </Link>
      </div>

      {loading && !payload ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white">
          <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-[#ff5c00]" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <MetricCard key={card.title} title={card.title} value={card.value} helper={card.helper} />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-900">Acoes prioritarias</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Entradas que fazem sentido para a engenharia operacional do marketplace e conectam o admin ao restante da plataforma.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-5 transition hover:border-[#ff5c00] hover:bg-white hover:shadow-sm"
                  >
                    <div className="text-base font-semibold text-gray-900">{action.title}</div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-xl font-semibold text-gray-900">Alertas de gestao</h2>
                <p className="mt-2 text-sm text-gray-600">Pontos que exigem decisao administrativa ou acao operacional.</p>
              </div>

              <div className="space-y-3">
                {payload?.alerts?.length ? (
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
                ) : (
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                    Nenhum alerta prioritario no momento.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
