"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconEye, IconRefresh, IconSearch } from "@tabler/icons-react";
import JornaleiroPageHeading from "@/components/jornaleiro/JornaleiroPageHeading";
import { useToast } from "@/components/admin/ToastProvider";

type WholesaleOrderItem = {
  id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type WholesaleOrder = {
  id: string;
  order_number: string;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  shipping_method: string | null;
  tracking_code: string | null;
  created_at: string | null;
  items: WholesaleOrderItem[];
};

type OrderTab = "all" | "approval" | "on_the_way" | "completed";

const ORDER_TABS: Array<{ key: OrderTab; label: string; statuses: string[] }> = [
  { key: "all", label: "Todos", statuses: [] },
  { key: "approval", label: "Em aprovação", statuses: ["draft", "pending_payment", "paid", "purchasing"] },
  { key: "on_the_way", label: "A caminho", statuses: ["separating", "ready_to_ship", "shipped"] },
  { key: "completed", label: "Concluídos", statuses: ["delivered"] },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    draft: "Valor a definir",
    pending_payment: "Em aprovação",
    paid: "Pagamento aprovado",
    purchasing: "Em aprovação",
    separating: "Separando",
    ready_to_ship: "A caminho",
    shipped: "A caminho",
    delivered: "Concluído",
    cancelled: "Cancelado",
  };
  return labels[value] || value;
}

function paymentLabel(value: string) {
  const labels: Record<string, string> = {
    pix: "PIX",
    credit_card: "Cartão",
    manual: "Manual",
  };
  return labels[value] || value;
}

function statusClass(value: string) {
  if (["delivered"].includes(value)) return "bg-green-50 text-green-700";
  if (["separating", "ready_to_ship", "shipped"].includes(value)) return "bg-blue-50 text-blue-700";
  if (["cancelled"].includes(value)) return "bg-red-50 text-red-700";
  return "bg-amber-50 text-amber-700";
}

function firstProductSummary(order: WholesaleOrder) {
  const first = order.items?.[0];
  if (!first) return "Sem produtos";
  const suffix = order.items.length > 1 ? ` +${order.items.length - 1}` : "";
  return `${first.quantity}x ${first.product_name}${suffix}`;
}

export default function JornaleiroFornecedorPedidosPage() {
  const toast = useToast();
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderTab>("all");
  const [query, setQuery] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jornaleiro/atacado/orders", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await response.json().catch(() => null);
      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Não foi possível carregar os pedidos");
      }
      setOrders(Array.isArray(json.data) ? json.data : []);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao carregar pedidos do Marketplace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metrics = useMemo(() => {
    const countByTab = (tab: OrderTab) => {
      const statuses = ORDER_TABS.find((item) => item.key === tab)?.statuses || [];
      return orders.filter((order) => statuses.includes(order.status)).length;
    };

    return {
      approval: countByTab("approval"),
      onTheWay: countByTab("on_the_way"),
      completed: countByTab("completed"),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const currentTab = ORDER_TABS.find((tab) => tab.key === activeTab) || ORDER_TABS[0];

    return orders.filter((order) => {
      const matchesTab = currentTab.key === "all" || currentTab.statuses.includes(order.status);
      const matchesQuery =
        !normalized ||
        [
          order.order_number,
          order.status,
          statusLabel(order.status),
          order.items.map((item) => item.product_name).join(" "),
        ].some((value) => String(value || "").toLowerCase().includes(normalized));

      return matchesTab && matchesQuery;
    });
  }, [activeTab, orders, query]);

  return (
    <div className="space-y-5">
      <JornaleiroPageHeading
        title="Meus Pedidos"
        description="Pedidos feitos no Marketplace, separados por aprovação, envio e conclusão."
        actions={
          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            <IconRefresh size={17} />
            Atualizar
          </button>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Em aprovação" value={metrics.approval} />
        <MetricCard label="A caminho" value={metrics.onTheWay} />
        <MetricCard label="Concluídos" value={metrics.completed} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {ORDER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-[#ff5c00] text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:max-w-sm">
            <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por pedido, produto ou status"
              className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-[#ff5c00] focus:outline-none focus:ring-1 focus:ring-[#ff5c00]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Carregando pedidos...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          Nenhum pedido encontrado neste filtro.
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                <tr>
                  <th className="px-4 py-3">Pedido</th>
                  <th className="px-4 py-3">Produtos</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pagamento</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Criado</th>
                  <th className="px-4 py-3 text-right">Abrir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-gray-900">#{order.order_number}</td>
                    <td className="px-4 py-4 text-gray-700">{firstProductSummary(order)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{paymentLabel(order.payment_method)}</td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">
                      {order.total <= 0 ? "A definir" : formatCurrency(order.total)}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/jornaleiro/fornecedor/pedidos/${order.id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-blue-600 hover:bg-blue-50"
                        title="Ver pedido"
                      >
                        <IconEye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">#{order.order_number}</div>
                    <div className="mt-1 text-xs text-gray-500">{formatDate(order.created_at)}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                </div>
                <div className="mt-4 text-sm text-gray-700">{firstProductSummary(order)}</div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">Pagamento</div>
                    <div className="text-sm font-semibold text-gray-800">{paymentLabel(order.payment_method)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-sm font-bold text-gray-900">
                      {order.total <= 0 ? "A definir" : formatCurrency(order.total)}
                    </div>
                  </div>
                  <Link
                    href={`/jornaleiro/fornecedor/pedidos/${order.id}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                    title="Ver pedido"
                  >
                    <IconEye size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-3 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
