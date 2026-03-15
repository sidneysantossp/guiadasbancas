"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useParams } from "next/navigation";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type OrderDetail = {
  id: string;
  user_id: string | null;
  banca_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;
  items: any[] | null;
  subtotal: number | null;
  shipping_fee: number | null;
  total: number | null;
  status: string | null;
  payment_method: string | null;
  notes: string | null;
  estimated_delivery: string | null;
  created_at: string | null;
  updated_at: string | null;
  banca: {
    id: string;
    user_id: string | null;
    name: string | null;
    address: string | null;
    whatsapp: string | null;
    active: boolean;
    approved: boolean;
  } | null;
  customer: {
    id: string;
    full_name: string | null;
    email: string | null;
    role: string | null;
    phone: string | null;
    blocked: boolean;
  } | null;
  history: Array<{
    id: string;
    action: string | null;
    old_value: string | null;
    new_value: string | null;
    user_name: string | null;
    user_role: string | null;
    details: string | null;
    created_at: string | null;
  }>;
};

const STATUS_FLOW = ["novo", "confirmado", "em_preparo", "saiu_para_entrega", "parcialmente_retirado", "entregue"];

function formatCurrency(value?: number | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDateTime(value?: string | null) {
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

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [data, setData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/orders/${orderId}`);
      const json = await response.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) load();
  }, [orderId]);

  const advanceStatus = async () => {
    if (!data) return;
    const current = (data.status || "").toLowerCase();
    const index = STATUS_FLOW.indexOf(current);
    const nextStatus = index >= 0 && index < STATUS_FLOW.length - 1 ? STATUS_FLOW[index + 1] : current;
    if (!nextStatus || nextStatus === current) return;

    setSaving(true);
    try {
      await fetchAdminWithDevFallback("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id, status: nextStatus }),
      });
      await load();
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-sm text-gray-500">Carregando pedido...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-sm text-gray-500">Pedido não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link href={"/admin/orders" as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
            Voltar para pedidos
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Pedido #{data.id}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Leitura consolidada do pedido, do cliente, da banca responsável e do histórico operacional.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.customer?.id ? (
            <Link
              href={`/admin/users/${data.customer.id}` as Route}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ver cliente
            </Link>
          ) : null}
          {data.banca?.user_id ? (
            <Link
              href={`/admin/jornaleiros/${data.banca.user_id}` as Route}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
            >
              Ver jornaleiro
            </Link>
          ) : null}
          {data.banca?.id ? (
            <Link
              href={`/admin/bancas/${data.banca.id}` as Route}
              className="rounded-xl bg-[#ff5c00] px-4 py-2 text-sm font-medium text-white hover:bg-[#e65300]"
            >
              Abrir operação da banca
            </Link>
          ) : null}
          <button
            onClick={advanceStatus}
            disabled={saving}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00] disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Avançar status"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total" value={formatCurrency(data.total)} helper={`Subtotal ${formatCurrency(data.subtotal)}`} />
        <SummaryCard title="Entrega" value={formatCurrency(data.shipping_fee)} helper={data.payment_method || "—"} />
        <SummaryCard title="Status" value={data.status || "sem status"} helper={`Atualizado em ${formatDateTime(data.updated_at)}`} />
        <SummaryCard title="Criado" value={formatDateTime(data.created_at)} helper={data.customer_name || "Cliente"} />
        <SummaryCard title="Itens" value={Array.isArray(data.items) ? data.items.length : 0} helper={data.banca?.name || "Sem banca"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Cliente e entrega</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div><span className="font-medium text-gray-900">Nome:</span> {data.customer?.full_name || data.customer_name || "—"}</div>
            <div><span className="font-medium text-gray-900">E-mail:</span> {data.customer?.email || data.customer_email || "—"}</div>
            <div><span className="font-medium text-gray-900">Telefone:</span> {data.customer?.phone || data.customer_phone || "—"}</div>
            <div><span className="font-medium text-gray-900">Endereço:</span> {data.customer_address || "—"}</div>
            <div><span className="font-medium text-gray-900">Observações:</span> {data.notes || "Sem observações"}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Banca responsável</h2>
          {data.banca ? (
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div><span className="font-medium text-gray-900">Nome:</span> {data.banca.name}</div>
              <div><span className="font-medium text-gray-900">Endereço:</span> {data.banca.address || "—"}</div>
              <div><span className="font-medium text-gray-900">WhatsApp:</span> {data.banca.whatsapp || "—"}</div>
              <div><span className="font-medium text-gray-900">Aprovação:</span> {data.banca.approved ? "Aprovada" : "Pendente"}</div>
              <div><span className="font-medium text-gray-900">Operação:</span> {data.banca.active ? "Ativa" : "Pausada"}</div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-500">Banca não localizada para este pedido.</div>
          )}
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Itens do pedido</h2>
          <div className="mt-4 space-y-3">
            {(Array.isArray(data.items) ? data.items : []).length > 0 ? (
              (data.items || []).map((item: any, index: number) => (
                <div key={`${item.product_id || "item"}-${index}`} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-medium text-gray-900">{item.product_name || "Produto"}</div>
                      <div className="text-xs text-gray-500">Qtd. {item.quantity || 0}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{formatCurrency(item.total_price)}</div>
                      <div className="text-xs text-gray-500">Unit. {formatCurrency(item.unit_price)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Nenhum item estruturado para este pedido.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Histórico operacional</h2>
          <div className="mt-4 space-y-3">
            {data.history.length > 0 ? (
              data.history.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-gray-900">{entry.action || "ação"}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(entry.created_at)}</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    {entry.old_value ? `${entry.old_value} → ` : ""}
                    {entry.new_value || "—"}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {entry.user_name || "Sistema"} · {entry.user_role || "sistema"}
                    {entry.details ? ` · ${entry.details}` : ""}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                Sem histórico operacional registrado.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
