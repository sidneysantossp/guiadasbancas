"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type JornaleiroRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  blocked: boolean;
  blocked_reason: string | null;
  banca: {
    id: string;
    name: string | null;
    active: boolean;
    approved: boolean;
  } | null;
  plan: {
    name: string;
    type: string;
    price: number;
    status: string;
  } | null;
  orders: {
    total_30d: number;
    today: number;
    open: number;
    revenue_30d: number;
    last_order_at: string | null;
  };
  products: {
    total: number;
    active: number;
  };
  created_at: string | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: JornaleiroRow["plan"] }) {
  if (!plan) {
    return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Sem plano</span>;
  }

  const color =
    plan.type === "premium"
      ? "bg-violet-100 text-violet-700"
      : plan.type === "start"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700";

  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>{plan.name}</span>;
}

function StatusBadge({
  blocked,
  banca,
}: {
  blocked: boolean;
  banca: JornaleiroRow["banca"];
}) {
  if (blocked) {
    return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Bloqueado</span>;
  }
  if (!banca) {
    return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Sem banca</span>;
  }
  if (!banca.approved) {
    return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">Pendente</span>;
  }
  return <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Operando</span>;
}

export default function AdminJornaleirosPage() {
  const [rows, setRows] = useState<JornaleiroRow[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    blocked: 0,
    withBanca: 0,
    approvedBancas: 0,
    paidPlans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/jornaleiros");
      const json = await response.json();
      if (json.success) {
        setRows(Array.isArray(json.data) ? json.data : []);
        setSummary(json.summary || summary);
      }
    } catch (error) {
      console.error("Erro ao carregar jornaleiros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesQuery =
        !normalized ||
        row.full_name?.toLowerCase().includes(normalized) ||
        row.email?.toLowerCase().includes(normalized) ||
        row.banca?.name?.toLowerCase().includes(normalized);

      const status = row.blocked ? "blocked" : row.banca?.approved ? "approved" : row.banca ? "pending" : "without_banca";
      const matchesStatus = !statusFilter || status === statusFilter;

      return Boolean(matchesQuery && matchesStatus);
    });
  }, [rows, query, statusFilter]);

  const handleToggleBlock = async (row: JornaleiroRow) => {
    setSavingId(row.id);
    try {
      if (row.blocked) {
        await fetchAdminWithDevFallback(`/api/admin/users/block?userId=${encodeURIComponent(row.id)}`, {
          method: "DELETE",
        });
      } else {
        await fetchAdminWithDevFallback("/api/admin/users/block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: row.id,
            reason: "Bloqueado via gestão de jornaleiros",
          }),
        });
      }
      await load();
    } catch (error) {
      console.error("Erro ao atualizar bloqueio do jornaleiro:", error);
    } finally {
      setSavingId(null);
    }
  };

  const columns: Column<JornaleiroRow>[] = [
    {
      key: "identity",
      header: "Jornaleiro",
      render: (row) => (
        <div>
          <Link href={`/admin/jornaleiros/${row.id}` as Route} className="font-medium text-gray-900 hover:text-[#ff5c00]">
            {row.full_name || "Sem nome"}
          </Link>
          <div className="text-xs text-gray-500">{row.email || "Sem e-mail"}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge blocked={row.blocked} banca={row.banca} />,
    },
    {
      key: "banca",
      header: "Banca",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.banca?.name || "Sem banca vinculada"}</div>
          <div className="text-xs text-gray-500">
            {row.banca ? (row.banca.approved ? "Aprovada" : "Aguardando aprovacao") : "Cadastro incompleto"}
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plano",
      hiddenOnMobile: true,
      render: (row) => (
        <div className="space-y-1">
          <PlanBadge plan={row.plan} />
          <div className="text-xs text-gray-500">{row.plan ? row.plan.status : "Sem assinatura"}</div>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Pedidos",
      hiddenOnMobile: true,
      render: (row) => (
        <div className="text-sm text-gray-700">
          <div>{row.orders.total_30d} em 30 dias</div>
          <div className="text-xs text-gray-500">{row.orders.open} em aberto hoje: {row.orders.today}</div>
        </div>
      ),
    },
    {
      key: "revenue",
      header: "Receita",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm font-medium text-gray-900">{formatCurrency(row.orders.revenue_30d)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Gestão de jornaleiros</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Este módulo conecta conta, banca, plano, catálogo e operação do jornaleiro em um único lugar.
          </p>
        </div>
        <Link
          href="/admin/gestao/bancas/cadastros"
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
        >
          Operar bancas
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total" value={summary.total} helper="Jornaleiros com perfil operacional" />
        <SummaryCard title="Com banca" value={summary.withBanca} helper="Perfis com banca vinculada" />
        <SummaryCard title="Aprovados" value={summary.approvedBancas} helper="Bancas aptas a operar" />
        <SummaryCard title="Planos pagos" value={summary.paidPlans} helper="Start ou Premium contratados" />
        <SummaryCard title="Bloqueados" value={summary.blocked} helper="Perfis com acesso interrompido" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_220px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, e-mail ou banca"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="approved">Operando</option>
            <option value="pending">Pendente</option>
            <option value="without_banca">Sem banca</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando jornaleiros...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRows}
            getId={(row) => row.id}
            initialPageSize={20}
            pageSizeOptions={[20, 50, 100]}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/admin/jornaleiros/${row.id}` as Route}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
                >
                  Detalhes
                </Link>
                {row.banca?.id ? (
                  <Link
                    href={`/admin/cms/bancas/${row.banca.id}` as Route}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
                  >
                    Ver banca
                  </Link>
                ) : null}
                <button
                  onClick={() => handleToggleBlock(row)}
                  disabled={savingId === row.id}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white ${
                    row.blocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-60`}
                >
                  {savingId === row.id ? "Salvando..." : row.blocked ? "Desbloquear" : "Bloquear"}
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
