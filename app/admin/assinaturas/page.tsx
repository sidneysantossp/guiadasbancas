"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type SubscriptionStatus =
  | "active"
  | "pending"
  | "overdue"
  | "trial"
  | "cancelled"
  | "expired"
  | string;

type PlanType = "free" | "start" | "premium" | string;

type SubscriptionRow = {
  id: string;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string | null;
  updated_at: string | null;
  plan: {
    id: string;
    name: string;
    type: PlanType;
    price: number | null;
    billing_cycle: string | null;
  } | null;
  banca: {
    id: string;
    user_id: string | null;
    name: string | null;
    email: string | null;
    whatsapp: string | null;
    active?: boolean | null;
    approved?: boolean | null;
  } | null;
  latest_payment: {
    id: string;
    amount: number | null;
    status: string | null;
    due_date: string | null;
    paid_at: string | null;
    created_at: string | null;
  } | null;
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  active: { label: "Ativa", className: "bg-green-100 text-green-700" },
  pending: { label: "Aguardando pagamento", className: "bg-amber-100 text-amber-700" },
  overdue: { label: "Em aberto", className: "bg-red-100 text-red-700" },
  trial: { label: "Degustação", className: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Cancelada", className: "bg-gray-100 text-gray-700" },
  expired: { label: "Expirada", className: "bg-gray-100 text-gray-700" },
};

const PLAN_META: Record<string, { label: string; className: string }> = {
  free: { label: "Free", className: "bg-green-100 text-green-700" },
  start: { label: "Start", className: "bg-blue-100 text-blue-700" },
  premium: { label: "Premium", className: "bg-violet-100 text-violet-700" },
};

const PAYMENT_STATUS_META: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmado", className: "bg-green-100 text-green-700" },
  received: { label: "Recebido", className: "bg-green-100 text-green-700" },
  overdue: { label: "Vencido", className: "bg-red-100 text-red-700" },
  refunded: { label: "Estornado", className: "bg-gray-100 text-gray-700" },
  cancelled: { label: "Cancelado", className: "bg-gray-100 text-gray-700" },
  failed: { label: "Falhou", className: "bg-red-100 text-red-700" },
};

function formatCurrency(value?: number | null) {
  return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminAssinaturasPage() {
  const [rows, setRows] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [backfilling, setBackfilling] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  const loadRows = async () => {
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/subscriptions");
      const json = await response.json();
      if (json.success) {
        setRows(Array.isArray(json.data) ? json.data : []);
      }
    } catch (error) {
      console.error("Erro ao carregar assinaturas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRows();
  }, []);

  const handleBackfillFreePlan = async () => {
    const confirmed = window.confirm(
      "Adicionar o plano Free para todas as bancas que ainda não possuem um plano atual?"
    );
    if (!confirmed) return;

    setBackfilling(true);
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/subscriptions/backfill-free", {
        method: "POST",
      });
      const json = await response.json();

      if (!json.success) {
        alert(json.error || "Não foi possível aplicar o plano Free nas bancas existentes.");
        return;
      }

      alert(
        `${json.message}\n\nTotal de bancas: ${json.data?.total_bancas ?? 0}\nJá com plano atual: ${json.data?.already_with_current_plan ?? 0}`
      );
      setLoading(true);
      await loadRows();
    } catch (error) {
      console.error("Erro ao aplicar backfill do Free:", error);
      alert("Erro ao aplicar o plano Free nas bancas existentes.");
    } finally {
      setBackfilling(false);
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const normalizedQuery = query.trim().toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        row.banca?.name?.toLowerCase().includes(normalizedQuery) ||
        row.banca?.email?.toLowerCase().includes(normalizedQuery) ||
        row.id.toLowerCase().includes(normalizedQuery);

      const matchesStatus = !statusFilter || row.status === statusFilter;
      const matchesPlan = !planFilter || row.plan?.type === planFilter;

      return Boolean(matchesQuery && matchesStatus && matchesPlan);
    });
  }, [rows, query, statusFilter, planFilter]);

  const activeCount = filteredRows.filter((row) => row.status === "active").length;
  const pendingCount = filteredRows.filter((row) => row.status === "pending" || row.status === "trial").length;
  const overdueCount = filteredRows.filter((row) => row.status === "overdue").length;
  const recurringRevenue = filteredRows
    .filter((row) => row.status === "active" || row.status === "trial" || row.status === "pending")
    .reduce((sum, row) => sum + Number(row.plan?.price || 0), 0);

  const columns: Column<SubscriptionRow>[] = [
    {
      key: "banca",
      header: "Banca",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.banca?.name || "Banca sem nome"}</div>
          <div className="text-xs text-gray-500">{row.banca?.email || "Sem e-mail"}</div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plano",
      render: (row) => {
        const meta = PLAN_META[row.plan?.type || ""] || { label: row.plan?.name || "Sem plano", className: "bg-gray-100 text-gray-700" };
        return (
          <div className="space-y-1">
            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
              {meta.label}
            </span>
            <div className="text-xs text-gray-500">{row.plan?.name || "Sem plano"}</div>
          </div>
        );
      },
    },
    {
      key: "subscription_status",
      header: "Assinatura",
      render: (row) => {
        const meta = STATUS_META[row.status] || { label: row.status || "Sem status", className: "bg-gray-100 text-gray-700" };
        return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>;
      },
    },
    {
      key: "latest_payment",
      header: "Última cobrança",
      hiddenOnMobile: true,
      render: (row) => {
        if (!row.latest_payment) {
          return <span className="text-sm text-gray-400">Sem cobrança</span>;
        }

        const meta =
          PAYMENT_STATUS_META[row.latest_payment.status || ""] ||
          { label: row.latest_payment.status || "Sem status", className: "bg-gray-100 text-gray-700" };

        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{formatCurrency(row.latest_payment.amount)}</div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${meta.className}`}>
                {meta.label}
              </span>
              <span className="text-xs text-gray-500">Venc. {formatDate(row.latest_payment.due_date)}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "renewal",
      header: "Próximo ciclo",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-600">{formatDate(row.current_period_end)}</span>,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Assinaturas</h1>
        <p className="text-gray-600">
          Acompanhe quais bancas estão no Free, Start ou Premium e o estado comercial de cada assinatura.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Assinaturas ativas" value={activeCount} helper="Bancas operando com plano liberado" />
        <SummaryCard title="Aguardando pagamento" value={pendingCount} helper="Pendentes ou em degustação" />
        <SummaryCard title="Em aberto" value={overdueCount} helper="Cobranças vencidas no momento" />
        <SummaryCard title="Receita recorrente" value={formatCurrency(recurringRevenue)} helper="Soma base dos planos pagos filtrados" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por banca, e-mail ou ID"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]"
          >
            <option value="">Todos os status</option>
            <option value="active">Ativa</option>
            <option value="pending">Aguardando pagamento</option>
            <option value="trial">Degustação</option>
            <option value="overdue">Em aberto</option>
            <option value="cancelled">Cancelada</option>
            <option value="expired">Expirada</option>
          </select>
          <select
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-[#ff5c00] focus:ring-2 focus:ring-[#ff5c00]"
          >
            <option value="">Todos os planos</option>
            <option value="free">Free</option>
            <option value="start">Start</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Base de assinaturas</h2>
            <p className="text-sm text-gray-500">Gestão comercial das bancas cadastradas na plataforma.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={handleBackfillFreePlan}
              disabled={backfilling}
              className="inline-flex items-center justify-center rounded-lg bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e65300] disabled:opacity-50"
            >
              {backfilling ? "Aplicando Free..." : "Adicionar bancas antigas ao Free"}
            </button>
            <Link
              href={"/admin/configuracoes" as Route}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#ff5c00] hover:underline"
            >
              Ir para cobrança e Asaas
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-sm text-gray-500">Carregando assinaturas...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            getId={(row) => row.id}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                {row.banca?.user_id ? (
                  <Link
                    href={`/admin/jornaleiros/${row.banca.user_id}` as Route}
                    className="text-sm font-medium text-[#ff5c00] hover:underline"
                  >
                    Jornaleiro
                  </Link>
                ) : null}
                {row.banca?.id ? (
                  <Link
                    href={`/admin/cms/bancas/${row.banca.id}` as Route}
                    className="text-sm font-medium text-[#ff5c00] hover:underline"
                  >
                    Banca
                  </Link>
                ) : null}
                <Link
                  href={"/admin/planos" as Route}
                  className="text-sm font-medium text-[#ff5c00] hover:underline"
                >
                  Planos
                </Link>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
