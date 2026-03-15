"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type OrderRow = {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping_fee: number;
  payment_method: string;
  customer: {
    id: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    role: string;
    blocked: boolean;
  };
  banca: {
    id: string;
    user_id: string | null;
    name: string;
    active: boolean;
    approved: boolean;
  } | null;
  created_at: string | null;
  updated_at: string | null;
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
    hour: "2-digit",
    minute: "2-digit",
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const toast = useToast();
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [bancaId, setBancaId] = useState("");
  const [userId, setUserId] = useState("");
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setStatus(searchParams.get("status") || "");
    setQ(searchParams.get("q") || "");
    setBancaId(searchParams.get("bancaId") || "");
    setUserId(searchParams.get("userId") || "");
  }, [searchParams]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (q) params.set("q", q);
      if (bancaId) params.set("bancaId", bancaId);
      if (userId) params.set("userId", userId);
      const res = await fetchAdminWithDevFallback(`/api/admin/orders?${params.toString()}`);
      const json = await res.json();
      setRows(Array.isArray(json?.data) ? json.data : []);
    } catch (error) {
      console.error("Erro ao buscar pedidos administrativos:", error);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [status, q, bancaId, userId]);

  const advanceStatus = async (id: string) => {
    try {
      const order = rows.find((item) => item.id === id);
      if (!order) return;

      const flow = ["novo", "confirmado", "em_preparo", "saiu_para_entrega", "parcialmente_retirado", "entregue"] as const;
      const currentIndex = flow.indexOf(order.status as (typeof flow)[number]);
      const nextStatus =
        currentIndex >= 0 && currentIndex < flow.length - 1 ? flow[currentIndex + 1] : order.status;

      const response = await fetchAdminWithDevFallback("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });

      if (!response.ok) {
        toast.error("Falha ao atualizar status");
        return;
      }

      toast.success("Status do pedido atualizado");
      fetchRows();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar status");
    }
  };

  const metrics = useMemo(() => {
    const total = rows.length;
    const open = rows.filter((item) => !["entregue", "cancelado"].includes((item.status || "").toLowerCase())).length;
    const gmv = rows.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const withBlockedUser = rows.filter((item) => item.customer.blocked).length;
    return { total, open, gmv, withBlockedUser };
  }, [rows]);

  const statusTone = (value: string): "amber" | "blue" | "orange" | "emerald" | "red" | "gray" => {
    switch (value) {
      case "novo":
        return "amber";
      case "confirmado":
        return "blue";
      case "em_preparo":
        return "orange";
      case "saiu_para_entrega":
      case "parcialmente_retirado":
        return "blue";
      case "entregue":
        return "emerald";
      case "cancelado":
        return "red";
      default:
        return "gray";
    }
  };

  const columns: Column<OrderRow>[] = [
    {
      key: "id",
      header: "Pedido",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">#{row.id}</div>
          <div className="text-xs text-gray-500">{formatDate(row.created_at)}</div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Cliente",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.customer.name}</div>
          <div className="text-xs text-gray-500">{row.customer.email || row.customer.phone || "Sem contato"}</div>
        </div>
      ),
    },
    {
      key: "banca",
      header: "Banca",
      hiddenOnMobile: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.banca?.name || "Sem banca"}</div>
          <div className="text-xs text-gray-500">
            {row.banca ? (row.banca.approved ? "Aprovada" : "Pendente") : "Sem vínculo"}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge label={row.status} tone={statusTone(row.status)} />,
    },
    {
      key: "payment",
      header: "Pagamento",
      hiddenOnMobile: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{formatCurrency(row.total)}</div>
          <div className="text-xs text-gray-500">{row.payment_method || "—"}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Pedidos do marketplace</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Operação unificada dos pedidos, conectando cliente, banca responsável e fluxo de entrega.
          </p>
        </div>
        <Link
          href={"/admin/inteligencia" as Route}
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
        >
          Ver inteligência
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Pedidos filtrados" value={metrics.total} helper="Recorte atual da operação" />
        <SummaryCard title="Em aberto" value={metrics.open} helper="Pedidos fora de entregue ou cancelado" />
        <SummaryCard title="GMV filtrado" value={formatCurrency(metrics.gmv)} helper="Soma dos pedidos listados" />
        <SummaryCard title="Clientes bloqueados" value={metrics.withBlockedUser} helper="Alertas de conta no recorte" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1.1fr_220px_220px_220px]">
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Buscar por #id, cliente, telefone ou e-mail"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="confirmado">Confirmado</option>
            <option value="em_preparo">Em preparo</option>
            <option value="saiu_para_entrega">Saiu para entrega</option>
            <option value="parcialmente_retirado">Parcialmente retirado</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <input
            value={bancaId}
            onChange={(event) => setBancaId(event.target.value)}
            placeholder="Filtrar por ID da banca"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="Filtrar por ID do usuário"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando pedidos...</div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            getId={(row) => row.id}
            initialPageSize={20}
            pageSizeOptions={[20, 50, 100]}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/orders/${row.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Ver pedido
                </Link>
                <button onClick={() => advanceStatus(row.id)} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Avançar status
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
