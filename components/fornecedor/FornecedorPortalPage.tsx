"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type FornecedorView =
  | "dashboard"
  | "products"
  | "orders"
  | "deliveries"
  | "finance"
  | "bancas"
  | "visibility"
  | "settings";

type Summary = {
  products_total: number;
  products_active: number;
  products_on_demand: number;
  low_stock: number;
  orders_total: number;
  orders_open: number;
  orders_paid: number;
  revenue_confirmed: number;
  all_bancas_enabled: boolean;
};

type Product = {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  image_url: string | null;
  cost_price: number;
  price: number;
  stock_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  availability_status: "in_stock" | "on_demand" | "quote";
  min_order_quantity: number;
  pack_size: number;
  delivery_lead_time: string | null;
  active: boolean;
  visible: boolean;
  created_at: string | null;
};

type Order = {
  id: string;
  order_number: string;
  banca_id: string;
  banca_name: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_cep: string | null;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  asaas_invoice_url: string | null;
  tracking_code: string | null;
  shipping_method: string | null;
  created_at: string | null;
  items: Array<{ product_name?: string; quantity?: number; total_price?: number }>;
};

type Category = {
  id: string;
  name: string;
};

type BancaOption = {
  id: string;
  name: string;
  active: boolean | null;
  approved: boolean | null;
};

type VisibilityRule = {
  id: string;
  scope: string;
  banca_id: string | null;
  enabled: boolean;
};

type VisibilityPayload = {
  all_enabled: boolean;
  banca_rules: VisibilityRule[];
  bancas: BancaOption[];
};

const EMPTY_PRODUCT_FORM = {
  sku: "",
  name: "",
  description: "",
  category_id: "",
  image_url: "",
  cost_price: "",
  price: "",
  stock_quantity: "0",
  availability_status: "in_stock",
  min_order_quantity: "1",
  pack_size: "1",
  delivery_lead_time: "",
  supplier_reference: "",
  admin_notes: "",
  active: true,
  visible: true,
  track_stock: true,
};

function formatDeliveryLeadTime(daysInput: string) {
  const days = Math.floor(Number(String(daysInput || "").replace(",", ".")));
  if (!Number.isFinite(days) || days <= 0) return "";
  return days === 1 ? "1 dia" : `${days} dias`;
}

function extractDeliveryDays(value: string | null | undefined) {
  const match = String(value || "").match(/\d+/);
  return match?.[0] || "";
}

const VIEW_COPY: Record<FornecedorView, { eyebrow: string; title: string; description: string }> = {
  dashboard: {
    eyebrow: "Fornecedor principal",
    title: "Painel do centro de distribuicao",
    description: "Operacao propria para abastecer jornaleiros com produtos fora da rede de distribuidores.",
  },
  products: {
    eyebrow: "Catalogo proprio",
    title: "Produtos do fornecedor",
    description: "Cadastre itens sem Mercos, controle estoque, preco, prazo e disponibilidade.",
  },
  orders: {
    eyebrow: "Checkout B2B",
    title: "Pedidos dos jornaleiros",
    description: "Acompanhe compras feitas pelo painel do jornaleiro e avance o fluxo operacional.",
  },
  deliveries: {
    eyebrow: "Fulfillment",
    title: "Entregas e prazos",
    description: "Separe a fila logistica por etapa, rastreio e pedidos prontos para envio.",
  },
  finance: {
    eyebrow: "Financeiro",
    title: "Pagamentos e receita",
    description: "Veja receita confirmada, pagamentos pendentes e cobrancas geradas no checkout.",
  },
  bancas: {
    eyebrow: "Rede atendida",
    title: "Jornaleiros com acesso",
    description: "Lista de bancas liberadas ou bloqueadas para comprar do fornecedor Guia.",
  },
  visibility: {
    eyebrow: "Governanca",
    title: "Visibilidade por banca",
    description: "Autorize todos os jornaleiros ou controle o acesso individualmente.",
  },
  settings: {
    eyebrow: "Configuracoes",
    title: "Parametros do fornecedor",
    description: "Resumo das regras atuais do modulo proprio, separado das integracoes Mercos.",
  },
};

const ORDER_FLOW = ["pending_payment", "paid", "purchasing", "separating", "ready_to_ship", "shipped", "delivered"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function availabilityLabel(value: Product["availability_status"]) {
  if (value === "on_demand") return "Sob encomenda";
  if (value === "quote") return "Consulta";
  return "Pronta entrega";
}

function orderStatusLabel(value: string) {
  const labels: Record<string, string> = {
    draft: "Rascunho",
    pending_payment: "Aguardando pagamento",
    paid: "Pago",
    purchasing: "Em compra",
    separating: "Separando",
    ready_to_ship: "Pronto para envio",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };
  return labels[value] || value;
}

function paymentStatusLabel(value: string) {
  const labels: Record<string, string> = {
    pending: "Pendente",
    confirmed: "Confirmado",
    overdue: "Vencido",
    refunded: "Reembolsado",
    cancelled: "Cancelado",
    failed: "Falhou",
  };
  return labels[value] || value;
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
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function FornecedorPortalPage({ view }: { view: FornecedorView }) {
  const toast = useToast();
  const copy = VIEW_COPY[view];
  const [summary, setSummary] = useState<Summary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibility, setVisibility] = useState<VisibilityPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [visibilityQuery, setVisibilityQuery] = useState("");
  const [form, setForm] = useState({ ...EMPTY_PRODUCT_FORM });
  const [pendingMigration, setPendingMigration] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setPendingMigration(false);
    try {
      const [summaryResponse, productsResponse, ordersResponse, visibilityResponse, categoriesResponse] = await Promise.all([
        fetchAdminWithDevFallback("/api/admin/atacado"),
        fetchAdminWithDevFallback("/api/admin/atacado/products?page=1&pageSize=100"),
        fetchAdminWithDevFallback("/api/admin/atacado/orders"),
        fetchAdminWithDevFallback("/api/admin/atacado/visibility"),
        fetchAdminWithDevFallback("/api/admin/all-categories"),
      ]);

      const [summaryJson, productsJson, ordersJson, visibilityJson, categoriesJson] = await Promise.all([
        summaryResponse.json().catch(() => null),
        productsResponse.json().catch(() => null),
        ordersResponse.json().catch(() => null),
        visibilityResponse.json().catch(() => null),
        categoriesResponse.json().catch(() => null),
      ]);

      if (summaryJson?.pendingMigration || productsJson?.pendingMigration || visibilityJson?.pendingMigration) {
        setPendingMigration(true);
      }

      if (summaryJson?.success) setSummary(summaryJson.summary);
      if (productsJson?.success) setProducts(Array.isArray(productsJson.data) ? productsJson.data : []);
      if (ordersJson?.success) setOrders(Array.isArray(ordersJson.data) ? ordersJson.data : []);
      if (visibilityJson?.success) setVisibility(visibilityJson.data);
      if (categoriesJson?.success) setCategories(Array.isArray(categoriesJson.data) ? categoriesJson.data : []);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao carregar fornecedor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      [product.name, product.sku || "", product.category_name || ""].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [products, query]);

  const filteredOrders = useMemo(() => {
    const normalized = orderQuery.trim().toLowerCase();
    if (!normalized) return orders;
    return orders.filter((order) =>
      [order.order_number, order.banca_name || "", order.customer_name || "", order.customer_email || ""].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [orders, orderQuery]);

  const deliveryOrders = useMemo(
    () => orders.filter((order) => ["purchasing", "separating", "ready_to_ship", "shipped", "delivered"].includes(order.status)),
    [orders]
  );

  const pendingPayments = useMemo(
    () => orders.filter((order) => ["pending", "overdue", "failed"].includes(order.payment_status)),
    [orders]
  );

  const visibilityRuleByBancaId = useMemo(() => {
    const map = new Map<string, VisibilityRule>();
    for (const rule of visibility?.banca_rules || []) {
      if (rule.banca_id) map.set(rule.banca_id, rule);
    }
    return map;
  }, [visibility]);

  const filteredBancas = useMemo(() => {
    const normalized = visibilityQuery.trim().toLowerCase();
    return (visibility?.bancas || []).filter((banca) => !normalized || banca.name.toLowerCase().includes(normalized));
  }, [visibility?.bancas, visibilityQuery]);

  const createProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/atacado/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Erro ao criar produto");

      toast.success("Produto criado no fornecedor");
      setForm({ ...EMPTY_PRODUCT_FORM });
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao criar produto");
    } finally {
      setSaving(false);
    }
  };

  const updateProduct = async (id: string, payload: Record<string, unknown>) => {
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/atacado/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Erro ao atualizar produto");
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar produto");
    }
  };

  const updateVisibility = async (payload: Record<string, unknown>) => {
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/atacado/visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Erro ao atualizar visibilidade");
      setVisibility(json.data);
      toast.success("Visibilidade atualizada");
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar visibilidade");
    }
  };

  const updateOrder = async (order: Order, payload: Record<string, unknown>) => {
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/atacado/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, ...payload }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Erro ao atualizar pedido");
      toast.success("Pedido atualizado");
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar pedido");
    }
  };

  const advanceOrder = async (order: Order) => {
    const currentIndex = ORDER_FLOW.indexOf(order.status);
    const nextStatus = currentIndex >= 0 && currentIndex < ORDER_FLOW.length - 1 ? ORDER_FLOW[currentIndex + 1] : order.status;
    if (nextStatus === order.status) return;
    await updateOrder(order, { status: nextStatus });
  };

  const productColumns: Column<Product>[] = [
    {
      key: "name",
      header: "Produto",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">
            {row.sku || "Sem SKU"} {row.category_name ? `- ${row.category_name}` : ""}
          </div>
        </div>
      ),
    },
    {
      key: "availability",
      header: "Oferta",
      render: (row) => (
        <div className="space-y-1">
          <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
            {availabilityLabel(row.availability_status)}
          </span>
          <div className="text-xs text-gray-500">{row.delivery_lead_time || "Prazo a definir"}</div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Preco",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{formatCurrency(row.price)}</div>
          <div className="text-xs text-gray-500">Custo {formatCurrency(row.cost_price)}</div>
        </div>
      ),
    },
    {
      key: "stock",
      header: "Estoque",
      hiddenOnMobile: true,
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.available_quantity}</div>
          <div className="text-xs text-gray-500">{row.reserved_quantity} reservado</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <div className="space-y-1">
          <StatusBadge label={row.active ? "Ativo" : "Inativo"} tone={row.active ? "emerald" : "gray"} />
          {!row.visible ? <div className="text-xs text-gray-500">Oculto</div> : null}
        </div>
      ),
    },
  ];

  const orderColumns: Column<Order>[] = [
    {
      key: "order",
      header: "Pedido",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">#{row.order_number}</div>
          <div className="text-xs text-gray-500">{formatDateTime(row.created_at)}</div>
        </div>
      ),
    },
    {
      key: "banca",
      header: "Banca",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.banca_name || "Banca"}</div>
          <div className="text-xs text-gray-500">{row.customer_name}</div>
        </div>
      ),
    },
    {
      key: "payment",
      header: "Pagamento",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{formatCurrency(row.total)}</div>
          <div className="text-xs text-gray-500">{paymentStatusLabel(row.payment_status)}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge
          label={orderStatusLabel(row.status)}
          tone={row.status === "delivered" ? "emerald" : row.status === "cancelled" ? "red" : "blue"}
        />
      ),
    },
  ];

  const renderHeader = () => (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff5c00]">{copy.eyebrow}</div>
        <h1 className="mt-2 text-2xl font-semibold text-gray-900">{copy.title}</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">{copy.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={loadData}
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
        >
          Atualizar dados
        </button>
        <Link
          href={"/fornecedor/produtos" as Route}
          className="inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
        >
          Gerenciar produtos
        </Link>
      </div>
    </div>
  );

  const renderKpis = () => (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard title="Produtos ativos" value={summary?.products_active ?? 0} helper={`${summary?.products_total ?? 0} cadastrados`} />
      <SummaryCard title="Pedidos abertos" value={summary?.orders_open ?? 0} helper={`${summary?.orders_total ?? 0} pedidos totais`} />
      <SummaryCard title="Receita confirmada" value={formatCurrency(summary?.revenue_confirmed ?? 0)} helper={`${summary?.orders_paid ?? 0} pedidos pagos`} />
      <SummaryCard title="Acesso geral" value={summary?.all_bancas_enabled ? "Liberado" : "Restrito"} helper="Controle de visibilidade do fornecedor" />
    </div>
  );

  const renderProducts = () => (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por produto, SKU ou categoria"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-500">Carregando produtos...</div>
          ) : (
            <DataTable
              columns={productColumns}
              data={filteredProducts}
              getId={(row) => row.id}
              initialPageSize={20}
              pageSizeOptions={[20, 50, 100]}
              renderActions={(row) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => updateProduct(row.id, { active: !row.active })}
                    className="text-sm font-medium text-[#ff5c00] hover:underline"
                  >
                    {row.active ? "Inativar" : "Ativar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProduct(row.id, { visible: !row.visible })}
                    className="text-sm font-medium text-[#ff5c00] hover:underline"
                  >
                    {row.visible ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              )}
            />
          )}
        </div>
      </div>

      <form onSubmit={createProduct} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Novo produto</h2>
          <p className="mt-1 text-sm text-gray-500">Cadastro manual do fornecedor, sem integracao Mercos.</p>
        </div>

        <div className="mt-5 space-y-3">
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
            placeholder="Nome do produto"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <input
            value={form.sku}
            onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
            placeholder="SKU ou codigo interno"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Descricao comercial"
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <select
            value={form.category_id}
            onChange={(event) => setForm((prev) => ({ ...prev, category_id: event.target.value }))}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="URL da imagem"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.cost_price}
              onChange={(event) => setForm((prev) => ({ ...prev, cost_price: event.target.value }))}
              placeholder="Custo"
              inputMode="decimal"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
            <input
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              required
              placeholder="Preco venda"
              inputMode="decimal"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.stock_quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, stock_quantity: event.target.value }))}
              placeholder="Estoque"
              inputMode="numeric"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
            <select
              value={form.availability_status}
              onChange={(event) => setForm((prev) => ({ ...prev, availability_status: event.target.value }))}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
            >
              <option value="in_stock">Pronta entrega</option>
              <option value="on_demand">Sob encomenda</option>
              <option value="quote">Consulta</option>
            </select>
          </div>
          <input
            type="number"
            min="1"
            step="1"
            value={extractDeliveryDays(form.delivery_lead_time)}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, delivery_lead_time: formatDeliveryLeadTime(event.target.value) }))
            }
            placeholder="Prazo sob encomenda em dias"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={form.min_order_quantity}
              onChange={(event) => setForm((prev) => ({ ...prev, min_order_quantity: event.target.value }))}
              placeholder="Minimo"
              inputMode="numeric"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
            <input
              value={form.pack_size}
              onChange={(event) => setForm((prev) => ({ ...prev, pack_size: event.target.value }))}
              placeholder="Pack"
              inputMode="numeric"
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400] disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Cadastrar produto"}
          </button>
        </div>
      </form>
    </div>
  );

  const renderOrders = (rows = filteredOrders) => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          value={orderQuery}
          onChange={(event) => setOrderQuery(event.target.value)}
          placeholder="Buscar por pedido, banca ou comprador"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
        />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando pedidos...</div>
        ) : (
          <DataTable
            columns={orderColumns}
            data={rows}
            getId={(row) => row.id}
            initialPageSize={20}
            pageSizeOptions={[20, 50, 100]}
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                {row.asaas_invoice_url ? (
                  <a
                    href={row.asaas_invoice_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-gray-600 hover:underline"
                  >
                    Cobranca
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => advanceOrder(row)}
                  disabled={["delivered", "cancelled"].includes(row.status)}
                  className="text-sm font-medium text-[#ff5c00] hover:underline disabled:text-gray-400 disabled:no-underline"
                >
                  Avancar
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        {["purchasing", "separating", "ready_to_ship", "shipped"].map((status) => (
          <SummaryCard
            key={status}
            title={orderStatusLabel(status)}
            value={orders.filter((order) => order.status === status).length}
            helper="Pedidos nessa etapa"
          />
        ))}
      </div>
      {renderOrders(deliveryOrders)}
    </div>
  );

  const renderFinance = () => (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Receita confirmada" value={formatCurrency(summary?.revenue_confirmed ?? 0)} helper="Pagamentos confirmados" />
        <SummaryCard title="Pagamentos pendentes" value={pendingPayments.length} helper="Pix/cartao ainda nao conciliados" />
        <SummaryCard title="Ticket medio" value={formatCurrency((summary?.orders_paid || 0) > 0 ? (summary?.revenue_confirmed || 0) / (summary?.orders_paid || 1) : 0)} helper="Media dos pedidos pagos" />
      </div>
      {renderOrders(orders)}
    </div>
  );

  const renderVisibilityRows = (limit?: number) => (
    <div className="divide-y divide-gray-100">
      {filteredBancas.slice(0, limit || 120).map((banca) => {
        const rule = visibilityRuleByBancaId.get(banca.id);
        const explicit = Boolean(rule);
        const enabled = explicit ? rule?.enabled === true : visibility?.all_enabled === true;
        return (
          <div key={banca.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-medium text-gray-900">{banca.name}</div>
              <div className="text-xs text-gray-500">
                {banca.approved ? "Aprovada" : "Pendente"} - {explicit ? "Regra individual" : "Segue regra geral"}
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateVisibility({ scope: "banca", banca_id: banca.id, enabled: !enabled })}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                enabled
                  ? "border border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-600"
                  : "bg-[#ff5c00] text-white hover:bg-[#e05400]"
              }`}
            >
              {enabled ? "Bloquear" : "Liberar"}
            </button>
          </div>
        );
      })}
    </div>
  );

  const renderVisibility = (compact = false) => (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Liberacao geral</h2>
            <p className="mt-1 text-sm text-gray-500">
              Quando ativo, todas as bancas enxergam o Fornecedor Guia no painel do jornaleiro.
            </p>
          </div>
          <button
            type="button"
            onClick={() => updateVisibility({ scope: "all", enabled: !(visibility?.all_enabled === true) })}
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              visibility?.all_enabled
                ? "border border-gray-300 text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
                : "bg-[#ff5c00] text-white hover:bg-[#e05400]"
            }`}
          >
            {visibility?.all_enabled ? "Desativar para todos" : "Ativar para todos"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input
          value={visibilityQuery}
          onChange={(event) => setVisibilityQuery(event.target.value)}
          placeholder="Buscar banca para liberar ou bloquear"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {renderVisibilityRows(compact ? 40 : undefined)}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Fila operacional</h2>
              <p className="mt-1 text-sm text-gray-500">Pedidos mais recentes feitos pelos jornaleiros.</p>
            </div>
            <Link href="/fornecedor/pedidos" className="text-sm font-medium text-[#ff5c00] hover:underline">
              Ver pedidos
            </Link>
          </div>
          <div className="mt-4">
            {renderOrders(orders.slice(0, 8))}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Checklist do fornecedor</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span>Catalogo com produtos</span>
              <StatusBadge label={(summary?.products_total || 0) > 0 ? "OK" : "Pendente"} tone={(summary?.products_total || 0) > 0 ? "emerald" : "gray"} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Visibilidade configurada</span>
              <StatusBadge label={summary?.all_bancas_enabled ? "Geral" : "Restrita"} tone={summary?.all_bancas_enabled ? "emerald" : "blue"} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Checkout integrado</span>
              <StatusBadge label="Asaas" tone="blue" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Atalhos</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/fornecedor/produtos" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]">
              Cadastrar produto
            </Link>
            <Link href="/fornecedor/visibilidade" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]">
              Liberar jornaleiros
            </Link>
            <Link href="/jornaleiro/fornecedor" className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]">
              Ver checkout do jornaleiro
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );

  const renderSettings = () => (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Arquitetura do modulo</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Origem dos produtos</dt>
            <dd className="font-medium text-gray-900">Cadastro proprio</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Mercos</dt>
            <dd className="font-medium text-gray-900">Sem integracao</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Checkout jornaleiro</dt>
            <dd className="font-medium text-gray-900">Pix/cartao via Asaas</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-gray-500">Visibilidade</dt>
            <dd className="font-medium text-gray-900">Todos ou banca especifica</dd>
          </div>
        </dl>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Painel admin</h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          O controle administrativo segue em `/admin/fornecedor`, com produtos, pedidos e liberacao para jornaleiros.
        </p>
        <Link
          href="/admin/fornecedor"
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
        >
          Abrir controle admin
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderHeader()}

      {pendingMigration ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          A migration do fornecedor proprio ainda nao foi aplicada no Supabase. Execute `supabase/migrations/20260503000001_create_own_wholesale_module.sql`.
        </div>
      ) : null}

      {renderKpis()}

      {view === "dashboard" ? renderDashboard() : null}
      {view === "products" ? renderProducts() : null}
      {view === "orders" ? renderOrders() : null}
      {view === "deliveries" ? renderDeliveries() : null}
      {view === "finance" ? renderFinance() : null}
      {view === "bancas" ? renderVisibility(true) : null}
      {view === "visibility" ? renderVisibility() : null}
      {view === "settings" ? renderSettings() : null}
    </div>
  );
}
