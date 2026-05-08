"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

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
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string | null;
  items: Array<{ product_name?: string; quantity?: number }>;
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

const TABS = [
  { key: "products", label: "Produtos" },
  { key: "orders", label: "Pedidos" },
  { key: "visibility", label: "Visibilidade" },
] as const;

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

export default function AdminAtacadoPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("products");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [visibility, setVisibility] = useState<VisibilityPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [visibilityQuery, setVisibilityQuery] = useState("");
  const [form, setForm] = useState({ ...EMPTY_PRODUCT_FORM });
  const [pendingMigration, setPendingMigration] = useState(false);

  const loadAdminData = async () => {
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
      toast.error(error?.message || "Erro ao carregar fornecedor próprio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
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

  const productColumns: Column<Product>[] = [
    {
      key: "image",
      header: "Imagem",
      render: (row) => (
        <div className="h-14 w-14 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {row.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.image_url} alt={row.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs font-semibold text-gray-400">GB</div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Produto",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{row.name}</div>
          <div className="text-xs text-gray-500">{row.sku || "Sem SKU"} {row.category_name ? `- ${row.category_name}` : ""}</div>
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
      header: "Preço",
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
      key: "items",
      header: "Itens",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-700">{row.items?.length || 0} item(ns)</span>,
    },
    {
      key: "payment",
      header: "Pagamento",
      render: (row) => (
        <div>
          <div className="font-medium text-gray-900">{formatCurrency(row.total)}</div>
          <div className="text-xs text-gray-500">{row.payment_method === "credit_card" ? "Cartão" : "Pix"} - {row.payment_status}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge label={orderStatusLabel(row.status)} tone={row.status === "delivered" ? "emerald" : row.status === "cancelled" ? "red" : "blue"} />,
    },
  ];

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
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao criar produto");
      }
      toast.success("Produto criado no fornecedor próprio");
      setForm({ ...EMPTY_PRODUCT_FORM });
      await loadAdminData();
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
      await loadAdminData();
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

  const advanceOrder = async (order: Order) => {
    const flow = ["pending_payment", "paid", "purchasing", "separating", "ready_to_ship", "shipped", "delivered"];
    const currentIndex = flow.indexOf(order.status);
    const nextStatus = currentIndex >= 0 && currentIndex < flow.length - 1 ? flow[currentIndex + 1] : order.status;
    if (nextStatus === order.status) return;

    try {
      const response = await fetchAdminWithDevFallback("/api/admin/atacado/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: nextStatus }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || "Erro ao atualizar pedido");
      toast.success("Pedido atualizado");
      await loadAdminData();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar pedido");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Fornecedor Guia</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Ecommerce B2B operado pelo Guia das Bancas, separado das integrações Mercos. Controle catálogo, estoque, visibilidade e pedidos no mesmo padrão do admin.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAdminData}
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
        >
          Atualizar dados
        </button>
      </div>

      {pendingMigration ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          A migration do fornecedor próprio ainda não foi aplicada no Supabase. A tela já está pronta, mas os dados só aparecem depois de executar o SQL da migration.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Produtos ativos" value={summary?.products_active ?? 0} helper={`${summary?.products_total ?? 0} cadastrados no fornecedor`} />
        <SummaryCard title="Sob encomenda" value={summary?.products_on_demand ?? 0} helper="Itens com prazo maior ou compra consolidada" />
        <SummaryCard title="Pedidos abertos" value={summary?.orders_open ?? 0} helper={`${summary?.orders_total ?? 0} pedidos totais`} />
        <SummaryCard title="Receita confirmada" value={formatCurrency(summary?.revenue_confirmed ?? 0)} helper={`${summary?.orders_paid ?? 0} pedidos pagos`} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "bg-[#ff5c00] text-white"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "products" ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar por produto, SKU ou categoria"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
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

          <form onSubmit={createProduct} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Novo produto</h2>
              <p className="mt-1 text-sm text-gray-500">Cadastro rápido para operar o catálogo próprio.</p>
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
                placeholder="SKU ou código interno"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Descrição comercial"
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
                  placeholder="Preço venda"
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
                value={form.delivery_lead_time}
                onChange={(event) => setForm((prev) => ({ ...prev, delivery_lead_time: event.target.value }))}
                placeholder="Prazo de entrega"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.min_order_quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, min_order_quantity: event.target.value }))}
                  placeholder="Mínimo"
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
      ) : null}

      {activeTab === "orders" ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-sm text-gray-500">Carregando pedidos...</div>
          ) : (
            <DataTable
              columns={orderColumns}
              data={orders}
              getId={(row) => row.id}
              initialPageSize={20}
              pageSizeOptions={[20, 50, 100]}
              renderActions={(row) => (
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => advanceOrder(row)}
                    disabled={["delivered", "cancelled"].includes(row.status)}
                    className="text-sm font-medium text-[#ff5c00] hover:underline disabled:text-gray-400 disabled:no-underline"
                  >
                    Avançar
                  </button>
                </div>
              )}
            />
          )}
        </div>
      ) : null}

      {activeTab === "visibility" ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Liberação geral</h2>
                <p className="mt-1 text-sm text-gray-500">Quando ativo, todas as bancas enxergam a sessão do Fornecedor Guia.</p>
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

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <input
              value={visibilityQuery}
              onChange={(event) => setVisibilityQuery(event.target.value)}
              placeholder="Buscar banca para liberar ou bloquear"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm"
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="divide-y divide-gray-100">
              {filteredBancas.slice(0, 80).map((banca) => {
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
