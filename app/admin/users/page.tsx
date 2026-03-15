"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  active: boolean;
  blocked: boolean;
  blocked_reason: string | null;
  banca: {
    id: string;
    name: string | null;
    active: boolean;
    approved: boolean;
  } | null;
  orders: {
    total: number;
    total_spent: number;
    open: number;
    last_order_at: string | null;
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

function RoleBadge({ role }: { role: string }) {
  const normalized = role.toLowerCase();
  if (normalized === "jornaleiro" || normalized === "seller") {
    return <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">Jornaleiro</span>;
  }
  return <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">Cliente</span>;
}

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    blocked: 0,
    clientes: 0,
    jornaleiros: 0,
    withBanca: 0,
  });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/users");
      const json = await response.json();
      if (json.success) {
        setRows(Array.isArray(json.data) ? json.data : []);
        setSummary(json.summary || summary);
      }
    } catch (error) {
      console.error("Erro ao carregar usuarios:", error);
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

      const matchesRole = !roleFilter || row.role === roleFilter;
      return Boolean(matchesQuery && matchesRole);
    });
  }, [rows, query, roleFilter]);

  const handleToggleBlock = async (row: UserRow) => {
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
            reason: "Bloqueado via gestão de usuários",
          }),
        });
      }
      await load();
    } catch (error) {
      console.error("Erro ao atualizar bloqueio do usuario:", error);
    } finally {
      setSavingId(null);
    }
  };

  const columns: Column<UserRow>[] = [
    {
      key: "identity",
      header: "Usuario",
      render: (row) => (
        <div>
          <Link href={`/admin/users/${row.id}` as Route} className="font-medium text-gray-900 hover:text-[#ff5c00]">
            {row.full_name || "Sem nome"}
          </Link>
          <div className="text-xs text-gray-500">{row.email || "Sem e-mail"}</div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Perfil",
      render: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: "banca",
      header: "Vinculo",
      hiddenOnMobile: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.banca?.name || "Conta sem banca"}</div>
          <div className="text-xs text-gray-500">
            {row.banca ? (row.banca.approved ? "Banca aprovada" : "Banca pendente") : "Fluxo de cliente final"}
          </div>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Pedidos",
      hiddenOnMobile: true,
      render: (row) => (
        <div className="text-sm text-gray-700">
          <div>{row.orders.total} pedidos</div>
          <div className="text-xs text-gray-500">{row.orders.open} em aberto</div>
        </div>
      ),
    },
    {
      key: "spent",
      header: "Valor movimentado",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm font-medium text-gray-900">{formatCurrency(row.orders.total_spent)}</span>,
    },
    {
      key: "createdAt",
      header: "Cadastro",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Gestão de usuários</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Visão consolidada das contas que interagem com o site e com os painéis da plataforma.
          </p>
        </div>
        <Link
          href="/admin/inteligencia"
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
        >
          Ver inteligência
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total" value={summary.total} helper="Contas nao administrativas" />
        <SummaryCard title="Clientes" value={summary.clientes} helper="Usuarios finais do marketplace" />
        <SummaryCard title="Jornaleiros" value={summary.jornaleiros} helper="Contas operacionais de banca" />
        <SummaryCard title="Com banca" value={summary.withBanca} helper="Contas ligadas a uma operacao" />
        <SummaryCard title="Bloqueados" value={summary.blocked} helper="Acesso interrompido pelo admin" />
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
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os perfis</option>
            <option value="cliente">Clientes</option>
            <option value="jornaleiro">Jornaleiros</option>
            <option value="seller">Jornaleiros</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando usuarios...</div>
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
                  href={`/admin/users/${row.id}` as Route}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
                >
                  Detalhes
                </Link>
                {row.banca?.id ? (
                  <Link
                    href={`/admin/bancas/${row.banca.id}` as Route}
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
