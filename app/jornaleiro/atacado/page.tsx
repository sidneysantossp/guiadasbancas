"use client";

import { useEffect, useMemo, useState } from "react";
import {
  IconArrowLeft,
  IconBuildingStore,
  IconChevronRight,
  IconMinus,
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import JornaleiroPageHeading from "@/components/jornaleiro/JornaleiroPageHeading";
import { useToast } from "@/components/admin/ToastProvider";

type WholesaleProduct = {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  image_url: string | null;
  images?: string[];
  cost_price?: number;
  price: number;
  available_quantity: number;
  availability_status: "in_stock" | "on_demand" | "quote";
  min_order_quantity: number;
  pack_size: number;
  delivery_lead_time: string | null;
};

type BancaAccess = {
  id: string;
  name: string | null;
  address: string | null;
  cep: string | null;
  whatsapp: string | null;
};

type PlatformCategory = {
  id: string;
  name: string;
  parent_category_id?: string | null;
  order?: number | null;
};

type CartItem = {
  product: WholesaleProduct;
  quantity: number;
};

type WholesaleOrder = {
  id: string;
  order_number: string;
  total: number;
  payment_method: string;
  payment_status: string;
  status: string;
  asaas_invoice_url: string | null;
  asaas_pix_payload: string | null;
  asaas_pix_encoded_image: string | null;
  created_at: string | null;
};

type MarketplaceView = "catalog" | "detail" | "checkout";

const DELIVERY_OPTIONS = [
  {
    id: "marketplace_delivery",
    label: "Entrega pelo Marketplace",
    method: "Entrega pelo Marketplace",
    deadline: "Prazo confirmado após separação",
    fee: 0,
  },
  {
    id: "scheduled_delivery",
    label: "Entrega agendada",
    method: "Entrega agendada",
    deadline: "Combinar data com atendimento",
    fee: 0,
  },
  {
    id: "pickup",
    label: "Retirada combinada",
    method: "Retirada combinada",
    deadline: "Combinar retirada",
    fee: 0,
  },
] as const;

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
  }).format(new Date(value));
}

function availabilityLabel(value: WholesaleProduct["availability_status"]) {
  if (value === "on_demand") return "Sob encomenda";
  if (value === "quote") return "Consulta";
  return "Pronta entrega";
}

function formatWholesaleDisplayPrice(product: Pick<WholesaleProduct, "price" | "availability_status">) {
  if (product.availability_status === "on_demand" && Number(product.price || 0) <= 0) {
    return "Valor a definir";
  }

  return formatCurrency(product.price);
}

function statusLabel(value: string) {
  const labels: Record<string, string> = {
    pending_payment: "Aguardando pagamento",
    draft: "Valor a definir",
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

function productImage(product: WholesaleProduct) {
  return product.image_url || product.images?.[0] || "";
}

function productHasOpenPrice(product: Pick<WholesaleProduct, "price" | "availability_status">) {
  return product.availability_status === "on_demand" && Number(product.price || 0) <= 0;
}

function scrollToTop() {
  if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function JornaleiroAtacadoPage() {
  const toast = useToast();
  const [allowed, setAllowed] = useState(false);
  const [banca, setBanca] = useState<BancaAccess | null>(null);
  const [products, setProducts] = useState<WholesaleProduct[]>([]);
  const [platformCategories, setPlatformCategories] = useState<PlatformCategory[]>([]);
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState("");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [view, setView] = useState<MarketplaceView>("catalog");
  const [selectedProduct, setSelectedProduct] = useState<WholesaleProduct | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    payment_method: "pix" as "pix" | "credit_card",
    delivery_option: "marketplace_delivery",
    customer_name: "",
    customer_phone: "",
    shipping_address: "",
    shipping_cep: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<WholesaleOrder | null>(null);

  const activeDelivery = DELIVERY_OPTIONS.find((option) => option.id === checkoutForm.delivery_option) || DELIVERY_OPTIONS[0];

  const cartItemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const cartHasOpenPrice = useMemo(
    () => cart.some((item) => productHasOpenPrice(item.product)),
    [cart]
  );

  const checkoutTotal = Math.max(0, cartSubtotal + activeDelivery.fee);

  const categoryOptions = useMemo(() => {
    if (platformCategories.length > 0) {
      return [...platformCategories].sort((left, right) => {
        const orderLeft = typeof left.order === "number" ? left.order : Number.MAX_SAFE_INTEGER;
        const orderRight = typeof right.order === "number" ? right.order : Number.MAX_SAFE_INTEGER;
        if (orderLeft !== orderRight) return orderLeft - orderRight;
        return left.name.localeCompare(right.name, "pt-BR");
      });
    }

    return Array.from(
      new Map(
        products
          .map((product) => [String(product.category_name || "").trim(), product.category_id || ""] as const)
          .filter(([name]) => Boolean(name))
          .map(([name, id]) => [name, { id: id || name, name } as PlatformCategory])
      ).values()
    ).sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
  }, [platformCategories, products]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const normalizedCategory = categoryQuery.trim().toLowerCase();
    const selectedCategory = normalizedCategory
      ? categoryOptions.find((category) => category.name.trim().toLowerCase() === normalizedCategory)
      : null;

    return products.filter((product) =>
      (!normalized ||
        [product.name, product.sku || "", product.category_name || ""].some((value) =>
          value.toLowerCase().includes(normalized)
        )) &&
      (!normalizedCategory ||
        (selectedCategory
          ? product.category_id === selectedCategory.id ||
            String(product.category_name || "").toLowerCase() === selectedCategory.name.toLowerCase()
          : String(product.category_name || "").toLowerCase().includes(normalizedCategory)))
    );
  }, [products, query, categoryQuery, categoryOptions]);

  const hydrateCheckoutBanca = (bancaData: BancaAccess | null) => {
    if (!bancaData) return;

    setCheckoutForm((current) => ({
      ...current,
      customer_name: current.customer_name || bancaData.name || "",
      customer_phone: current.customer_phone || bancaData.whatsapp || "",
      shipping_address: current.shipping_address || bancaData.address || "",
      shipping_cep: current.shipping_cep || bancaData.cep || "",
    }));
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [catalogResponse, ordersResponse, categoriesResponse] = await Promise.all([
        fetch("/api/jornaleiro/atacado", { cache: "no-store", credentials: "include" }),
        fetch("/api/jornaleiro/atacado/orders", { cache: "no-store", credentials: "include" }),
        fetch("/api/categories", { cache: "no-store" }),
      ]);
      const [catalogJson, ordersJson, categoriesJson] = await Promise.all([
        catalogResponse.json().catch(() => null),
        ordersResponse.json().catch(() => null),
        categoriesResponse.json().catch(() => null),
      ]);

      const nextBanca = catalogJson?.banca || null;
      setAllowed(catalogJson?.success === true && catalogJson?.allowed === true);
      setBanca(nextBanca);
      setProducts(Array.isArray(catalogJson?.items) ? catalogJson.items : []);
      setPlatformCategories(
        (Array.isArray(categoriesJson?.data) ? categoriesJson.data : [])
          .map((category: any) => ({
            id: String(category.id || ""),
            name: String(category.name || "").trim(),
            parent_category_id: category.parent_category_id || null,
            order: typeof category.order === "number" ? category.order : null,
          }))
          .filter((category: PlatformCategory) => category.id && category.name)
      );
      setOrders(Array.isArray(ordersJson?.data) ? ordersJson.data : []);
      hydrateCheckoutBanca(nextBanca);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao carregar marketplace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openProductDetail = (product: WholesaleProduct) => {
    const minQuantity = Math.max(1, product.min_order_quantity || 1);
    setSelectedProduct(product);
    setDetailQuantity(minQuantity);
    setView("detail");
    scrollToTop();
  };

  const goToCatalog = () => {
    setView("catalog");
    setSelectedProduct(null);
    scrollToTop();
  };

  const addToCart = (product: WholesaleProduct, quantity?: number) => {
    if (product.availability_status === "quote") {
      toast.info("Produto de consulta precisa de confirmação comercial");
      return;
    }

    const minQuantity = Math.max(1, product.min_order_quantity || 1);
    const nextQuantity = Math.max(minQuantity, quantity || minQuantity);
    setCart((prev) => {
      const current = prev.find((item) => item.product.id === product.id);
      if (current) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + nextQuantity }
            : item
        );
      }
      return [...prev, { product, quantity: nextQuantity }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.flatMap((item) => {
        if (item.product.id !== productId) return [item];
        if (quantity <= 0) return [];
        const nextQuantity = Math.max(item.product.min_order_quantity || 1, quantity);
        return [{ ...item, quantity: nextQuantity }];
      })
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const openCheckout = () => {
    if (cart.length === 0) {
      toast.info("Inclua produtos na sacola");
      return;
    }

    setCartOpen(false);
    setView("checkout");
    scrollToTop();
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      toast.info("Inclua produtos na sacola");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/jornaleiro/atacado/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_method: checkoutForm.payment_method,
          customer_name: checkoutForm.customer_name,
          customer_phone: checkoutForm.customer_phone,
          shipping_address: checkoutForm.shipping_address,
          shipping_cep: checkoutForm.shipping_cep,
          shipping_method: activeDelivery.method,
          shipping_fee: activeDelivery.fee,
          notes: checkoutForm.notes,
          items: cart.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || "Erro ao criar pedido");
      }

      toast.success("Pedido criado no Marketplace");
      setCart([]);
      setCartOpen(false);
      setView("catalog");
      setLastOrder(json.data);
      await loadData();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao criar pedido");
    } finally {
      setSubmitting(false);
    }
  };

  const cartButton = cartItemCount > 0 ? (
    <button
      type="button"
      onClick={() => setCartOpen(true)}
      className="relative inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800 shadow-sm hover:border-[#ff5c00] hover:text-[#ff5c00]"
      aria-label="Abrir sacola"
    >
      <IconShoppingBag size={19} />
      <span>Sacola</span>
      {cartItemCount > 0 ? (
        <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#ff5c00] px-1.5 text-xs font-bold text-white">
          {cartItemCount}
        </span>
      ) : null}
    </button>
  ) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-500">
        Carregando marketplace...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="space-y-6">
        <JornaleiroPageHeading title="Marketplace" actions={cartButton} />
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Sessão indisponível para esta banca</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            A liberação desta área é controlada pelo admin do Guia das Bancas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] bg-[#e9ebe7] p-3 shadow-inner sm:p-5">
      <div className="overflow-hidden rounded-[26px] bg-[#fbfcf7] p-3 shadow-sm ring-1 ring-white/80 sm:p-5">
        <MarketplaceTopBar
          banca={banca}
          active={view === "checkout" ? "checkout" : "catalog"}
          cartItemCount={cartItemCount}
          cartSubtotal={cartSubtotal}
          cartHasOpenPrice={cartHasOpenPrice}
          onCatalog={goToCatalog}
          onCheckout={openCheckout}
          onOpenBag={() => setCartOpen(true)}
        />

        {lastOrder ? (
          <div className="mt-5 rounded-[22px] border border-lime-200 bg-lime-50 p-5 text-sm text-gray-900">
            <div className="font-semibold">Pedido #{lastOrder.order_number} criado</div>
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <span>Total: {lastOrder.total <= 0 ? "Valor a definir" : formatCurrency(lastOrder.total)}</span>
              {lastOrder.asaas_invoice_url ? (
                <a
                  href={lastOrder.asaas_invoice_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Abrir cobrança
                </a>
              ) : null}
            </div>
            {!lastOrder.asaas_invoice_url && lastOrder.total <= 0 ? (
              <p className="mt-2 text-sm text-gray-600">Pedido recebido sem cobrança automática. O valor será definido depois.</p>
            ) : null}
            {lastOrder.asaas_pix_payload ? (
              <div className="mt-3 rounded-2xl border border-lime-200 bg-white p-3">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-lime-700">Pix copia e cola</div>
                <p className="mt-2 break-all text-xs leading-5 text-gray-700">{lastOrder.asaas_pix_payload}</p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5">
          {view === "checkout" ? (
            <CheckoutView
              banca={banca}
              cart={cart}
              cartHasOpenPrice={cartHasOpenPrice}
              cartSubtotal={cartSubtotal}
              checkoutTotal={checkoutTotal}
              activeDelivery={activeDelivery}
              form={checkoutForm}
              submitting={submitting}
              onBack={() => setView("catalog")}
              onOpenBag={() => setCartOpen(true)}
              onUpdateForm={(partial) => setCheckoutForm((current) => ({ ...current, ...partial }))}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onSubmit={submitOrder}
            />
          ) : (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_430px]">
              <div className="min-w-0">
                {view === "detail" && selectedProduct ? (
                  <ProductDetail
                    product={selectedProduct}
                    quantity={detailQuantity}
                    onQuantityChange={setDetailQuantity}
                    onBack={goToCatalog}
                    onAddToCart={() => addToCart(selectedProduct, detailQuantity)}
                  />
                ) : (
                  <CatalogView
                    query={query}
                    categoryQuery={categoryQuery}
                    categoryOptions={categoryOptions}
                    products={products}
                    filteredProducts={filteredProducts}
                    onQueryChange={setQuery}
                    onCategoryChange={setCategoryQuery}
                    onClearFilters={() => {
                      setQuery("");
                      setCategoryQuery("");
                    }}
                    onOpenProduct={openProductDetail}
                  />
                )}
              </div>

              <CartSummaryPanel
                banca={banca}
                cart={cart}
                orders={orders}
                cartItemCount={cartItemCount}
                cartSubtotal={cartSubtotal}
                cartHasOpenPrice={cartHasOpenPrice}
                onOpenBag={() => setCartOpen(true)}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={openCheckout}
              />
            </div>
          )}
        </div>
      </div>

      <FloatingBagButton
        count={cartItemCount}
        subtotal={cartSubtotal}
        hasOpenPrice={cartHasOpenPrice}
        onClick={() => setCartOpen(true)}
      />

      <CartDrawer
        open={cartOpen}
        banca={banca}
        cart={cart}
        orders={orders}
        cartItemCount={cartItemCount}
        cartSubtotal={cartSubtotal}
        cartHasOpenPrice={cartHasOpenPrice}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={openCheckout}
      />
    </div>
  );
}

function MarketplaceTopBar({
  banca,
  active,
  cartItemCount,
  cartSubtotal,
  cartHasOpenPrice,
  onCatalog,
  onCheckout,
  onOpenBag,
}: {
  banca: BancaAccess | null;
  active: "catalog" | "checkout";
  cartItemCount: number;
  cartSubtotal: number;
  cartHasOpenPrice: boolean;
  onCatalog: () => void;
  onCheckout: () => void;
  onOpenBag: () => void;
}) {
  const baseClass =
    "inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition";

  return (
    <div className="flex flex-col gap-4 rounded-[24px] bg-white px-4 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lime-300 text-gray-950">
          <IconBuildingStore size={24} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-[-0.01em] text-gray-950 sm:text-2xl">Marketplace</h1>
          <p className="truncate text-sm font-medium text-gray-500">{banca?.name || "Compra para sua banca"}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex overflow-x-auto rounded-full bg-gray-100 p-1">
          <button
            type="button"
            onClick={onCatalog}
            className={`${baseClass} ${
              active === "catalog"
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-600 hover:bg-white/70 hover:text-gray-950"
            }`}
          >
            Produtos
          </button>
          <button
            type="button"
            onClick={onCheckout}
            className={`${baseClass} ${
              active === "checkout"
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-600 hover:bg-white/70 hover:text-gray-950"
            }`}
          >
            Checkout
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenBag}
          className="relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gray-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
          disabled={cartItemCount <= 0}
          aria-label="Abrir sacola"
        >
          <IconShoppingBag size={19} />
          <span>{cartHasOpenPrice ? "A definir" : formatCurrency(cartSubtotal)}</span>
          {cartItemCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-lime-300 px-1.5 text-xs font-bold text-gray-950">
              {cartItemCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}

function CatalogView({
  query,
  categoryQuery,
  categoryOptions,
  products,
  filteredProducts,
  onQueryChange,
  onCategoryChange,
  onClearFilters,
  onOpenProduct,
}: {
  query: string;
  categoryQuery: string;
  categoryOptions: PlatformCategory[];
  products: WholesaleProduct[];
  filteredProducts: WholesaleProduct[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  onOpenProduct: (product: WholesaleProduct) => void;
}) {
  const featuredCategories = categoryOptions.slice(0, 10);

  return (
    <div className="rounded-[26px] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ring-1 ring-gray-100 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.01em] text-gray-950">Produtos</h2>
          <p className="mt-1 text-sm font-medium text-gray-500">{filteredProducts.length} de {products.length} produto(s)</p>
        </div>
        {(query || categoryQuery) ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-10 items-center justify-center self-start rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:text-gray-950 lg:self-auto"
          >
            Limpar filtros
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="relative">
          <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar por produto, SKU ou categoria"
            className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
          />
        </div>
        <div>
          <input
            list="marketplace-categorias"
            value={categoryQuery}
            onChange={(event) => onCategoryChange(event.target.value)}
            placeholder="Todas as categorias"
            className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
          />
          <datalist id="marketplace-categorias">
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onCategoryChange("")}
          className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
            categoryQuery.trim()
              ? "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-gray-950"
              : "bg-lime-300 text-gray-950 shadow-sm"
          }`}
        >
          Todos
        </button>
        {featuredCategories.map((category) => {
          const selected = categoryQuery.trim().toLowerCase() === category.name.trim().toLowerCase();
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.name)}
              className={`h-10 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
                selected
                  ? "bg-lime-300 text-gray-950 shadow-sm"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-gray-950"
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-5 rounded-[22px] border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm font-medium text-gray-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOpen={() => onOpenProduct(product)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onOpen }: { product: WholesaleProduct; onOpen: () => void }) {
  const imageUrl = productImage(product);
  const costPrice = Number(product.cost_price || product.price || 0);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[380px] min-w-0 flex-col rounded-[24px] bg-white p-3 text-left shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-gray-100 transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-4 focus:ring-lime-200"
    >
      <div className="relative aspect-[1.06/1] w-full overflow-hidden rounded-[20px] bg-[#f1f2ef]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-3 transition duration-200 group-hover:scale-[1.03]" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs font-semibold text-gray-400">Marketplace</div>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase text-gray-700 shadow-sm">
          {availabilityLabel(product.availability_status)}
        </span>
        <span className="absolute -bottom-1 right-3 grid h-12 w-12 place-items-center rounded-full bg-lime-300 text-gray-950 shadow-[0_10px_20px_rgba(15,23,42,0.18)] transition group-hover:scale-105">
          <IconPlus size={24} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h2 className="line-clamp-2 min-h-[2.45rem] text-[15px] font-bold uppercase leading-[1.28] tracking-[-0.01em] text-gray-950">
          {product.name}
        </h2>
        <div className="mt-1 min-h-4 truncate font-mono text-xs text-gray-500">{product.sku || "SKU pendente"}</div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="max-w-full truncate text-[11px] font-bold text-blue-600">
            {product.category_name || "Sem categoria"}
          </span>
          <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
            Marketplace
          </span>
        </div>

        <div className="mt-4 space-y-2 text-[11px]">
          <div className="flex items-center justify-between gap-4 text-gray-500">
            <span>Custo:</span>
            <span className="whitespace-nowrap font-medium">
              {productHasOpenPrice(product) && costPrice <= 0 ? "A definir" : formatCurrency(costPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-semibold text-blue-700">Venda:</span>
            <span className="whitespace-nowrap text-[15px] font-black text-blue-700">{formatWholesaleDisplayPrice(product)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-2 text-gray-500">
            <span>Estoque:</span>
            <span className={`font-black ${product.available_quantity > 0 || product.availability_status === "on_demand" ? "text-green-600" : "text-red-500"}`}>
              {product.availability_status === "on_demand" ? "Sob encomenda" : product.available_quantity}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProductDetail({
  product,
  quantity,
  onQuantityChange,
  onBack,
  onAddToCart,
}: {
  product: WholesaleProduct;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onBack: () => void;
  onAddToCart: () => void;
}) {
  const imageUrl = productImage(product);
  const blocked = product.availability_status === "quote";
  const minQuantity = Math.max(1, product.min_order_quantity || 1);
  const packSize = Math.max(1, product.pack_size || 1);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-gray-950 hover:text-gray-950"
      >
        <IconArrowLeft size={15} />
        Voltar ao catálogo
      </button>

      <div className="grid gap-4 rounded-[24px] bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ring-1 ring-gray-100 lg:grid-cols-[minmax(220px,340px)_minmax(0,1fr)] lg:p-4">
        <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#f1f2ef]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-3" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs font-semibold text-gray-400">Marketplace</div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-lime-200 px-2.5 py-1 text-[10px] font-bold text-gray-950">Marketplace</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">{availabilityLabel(product.availability_status)}</span>
            {product.category_name ? (
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-700">{product.category_name}</span>
            ) : null}
          </div>

          <h2 className="mt-3 text-lg font-black uppercase leading-tight tracking-[-0.01em] text-gray-950 sm:text-xl">{product.name}</h2>
          {product.sku ? <div className="mt-1.5 font-mono text-xs text-gray-500">{product.sku}</div> : null}

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-[16px] bg-gray-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Venda</div>
              <div className="mt-1.5 text-sm font-black text-blue-700">{formatWholesaleDisplayPrice(product)}</div>
            </div>
            <div className="rounded-[16px] bg-gray-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Estoque</div>
              <div className="mt-1.5 text-sm font-black text-green-600">
                {product.availability_status === "on_demand" ? "Sob encomenda" : product.available_quantity}
              </div>
            </div>
            <div className="rounded-[16px] bg-gray-50 p-3">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">Prazo</div>
              <div className="mt-1.5 text-xs font-bold text-gray-950">{product.delivery_lead_time || "A combinar"}</div>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
              <div className="inline-flex h-10 w-full items-center justify-between rounded-full border border-gray-200 bg-gray-50 px-2 xl:w-36">
                <button
                  type="button"
                  onClick={() => onQuantityChange(Math.max(minQuantity, quantity - packSize))}
                  className="grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-white"
                >
                  <IconMinus size={15} />
                </button>
                <input
                  type="number"
                  min={minQuantity}
                  value={quantity}
                  onChange={(event) => onQuantityChange(Math.max(minQuantity, Number(event.target.value) || minQuantity))}
                  className="w-12 border-0 bg-transparent text-center text-xs font-bold focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => onQuantityChange(quantity + packSize)}
                  className="grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-white"
                >
                  <IconPlus size={15} />
                </button>
              </div>
              <button
                type="button"
                onClick={onAddToCart}
                disabled={blocked}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-lime-300 px-5 text-sm font-black text-gray-950 shadow-sm transition hover:bg-lime-200 disabled:bg-gray-200 disabled:text-gray-500"
              >
                {blocked ? "Consulta comercial" : "Adicionar à sacola"}
              </button>
            </div>
            <p className="mt-2 text-[11px] font-medium text-gray-500">Mínimo {minQuantity}. Pacote de {packSize} unidade(s).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartSummaryPanel({
  banca,
  cart,
  orders,
  cartItemCount,
  cartSubtotal,
  cartHasOpenPrice,
  onOpenBag,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: {
  banca: BancaAccess | null;
  cart: CartItem[];
  orders: WholesaleOrder[];
  cartItemCount: number;
  cartSubtotal: number;
  cartHasOpenPrice: boolean;
  onOpenBag: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}) {
  return (
    <aside className="min-w-0 rounded-[26px] bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ring-1 ring-gray-100 xl:sticky xl:top-5 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-[-0.01em] text-gray-950">Sacola</h2>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-500">
            <IconBuildingStore size={17} />
            <span className="truncate">{banca?.name || "Sua banca"}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenBag}
          disabled={cartItemCount <= 0}
          className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-950 text-white transition hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-500"
          aria-label="Abrir sacola"
        >
          <IconShoppingBag size={19} />
          {cartItemCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-lime-300 px-1.5 text-xs font-black text-gray-950">
              {cartItemCount}
            </span>
          ) : null}
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {cart.length === 0 ? (
          <div className="rounded-[22px] bg-gray-50 p-5 text-sm font-medium text-gray-500">
            Nenhum produto na sacola.
          </div>
        ) : (
          cart.map((item) => (
            <CartLineItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        )}
      </div>

      <div className="mt-5 rounded-[22px] bg-gray-50 p-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-gray-500">Subtotal</span>
          <span className="font-black text-gray-950">
            {cartHasOpenPrice ? "Valor a definir" : formatCurrency(cartSubtotal)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
          <span className="font-medium text-gray-500">Itens</span>
          <span className="font-black text-gray-950">{cartItemCount}</span>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-gray-500">Pedidos</h3>
            <span className="text-xs font-bold text-gray-400">{orders.length}</span>
          </div>
          <div className="space-y-2">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="rounded-2xl bg-gray-50 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-gray-950">#{order.order_number}</div>
                    <div className="mt-0.5 text-xs font-medium text-gray-500">{formatDate(order.created_at)} - {statusLabel(order.status)}</div>
                  </div>
                  <div className="shrink-0 text-sm font-black text-gray-950">
                    {order.total <= 0 ? "A definir" : formatCurrency(order.total)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onCheckout}
        disabled={cart.length === 0}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-4 text-sm font-black text-gray-950 shadow-[0_14px_30px_rgba(132,204,22,0.28)] transition hover:bg-lime-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
      >
        Finalizar compra
        <IconChevronRight size={18} />
      </button>
    </aside>
  );
}

function FloatingBagButton({
  count,
  subtotal,
  hasOpenPrice,
  onClick,
}: {
  count: number;
  subtotal: number;
  hasOpenPrice: boolean;
  onClick: () => void;
}) {
  if (count <= 0) return null;

  return (
    <div className="fixed bottom-6 right-4 z-30 flex flex-col items-end gap-2 lg:right-6">
      <button
        type="button"
        onClick={onClick}
        className="relative grid h-16 w-16 place-items-center rounded-full bg-gray-950 text-white shadow-[0_16px_36px_rgba(15,23,42,0.28)] transition hover:bg-gray-800"
        aria-label="Abrir sacola"
      >
        <IconShoppingBag size={27} />
        <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-lime-300 px-1.5 text-xs font-black text-gray-950">
          {count}
        </span>
      </button>
      <div className="rounded-full bg-white px-3 py-1.5 text-sm font-black text-gray-950 shadow-lg ring-1 ring-gray-100">
        {hasOpenPrice ? "A definir" : formatCurrency(subtotal)}
      </div>
    </div>
  );
}

function CartDrawer({
  open,
  banca,
  cart,
  orders,
  cartItemCount,
  cartSubtotal,
  cartHasOpenPrice,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: {
  open: boolean;
  banca: BancaAccess | null;
  cart: CartItem[];
  orders: WholesaleOrder[];
  cartItemCount: number;
  cartSubtotal: number;
  cartHasOpenPrice: boolean;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-gray-900/35 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl transition-transform duration-200 sm:rounded-l-[28px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-5">
          <div>
            <h2 className="text-2xl font-black tracking-[-0.01em] text-gray-950">
              {cartItemCount} {cartItemCount === 1 ? "item" : "itens"} na sua sacola
            </h2>
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
              <IconBuildingStore size={18} />
              Pedido de: <span className="font-black uppercase text-gray-700">{banca?.name || "Sua banca"}</span>
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-gray-50 hover:bg-gray-100">
            <IconX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="rounded-[22px] bg-gray-50 p-5 text-sm font-medium text-gray-500">
                Nenhum produto selecionado.
              </div>
            ) : (
              cart.map((item) => (
                <CartLineItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemoveItem={onRemoveItem}
                />
              ))
            )}
          </div>

          <div className="mt-6 rounded-[22px] bg-gray-50 p-4">
            <h3 className="text-sm font-black uppercase tracking-[0.14em] text-gray-500">Pedidos recentes</h3>
            <div className="mt-3 space-y-2">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2">
                  <div>
                    <div className="text-sm font-bold text-gray-950">#{order.order_number}</div>
                    <div className="text-xs font-medium text-gray-500">{formatDate(order.created_at)} - {statusLabel(order.status)}</div>
                  </div>
                  <div className="text-sm font-black text-gray-950">
                    {order.total <= 0 ? "A definir" : formatCurrency(order.total)}
                  </div>
                </div>
              ))}
              {orders.length === 0 ? <p className="text-sm text-gray-500">Nenhum pedido registrado.</p> : null}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 p-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-500">Subtotal</span>
            <span className="font-black text-gray-950">
              {cartHasOpenPrice ? "Valor a definir" : formatCurrency(cartSubtotal)}
            </span>
          </div>
          <button
            type="button"
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-4 text-sm font-black text-gray-950 shadow-[0_14px_30px_rgba(132,204,22,0.28)] transition hover:bg-lime-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
          >
            Finalizar compra
            <IconChevronRight size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}

function CartLineItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}) {
  const imageUrl = productImage(item.product);
  const minQuantity = Math.max(1, item.product.min_order_quantity || 1);
  const packSize = Math.max(1, item.product.pack_size || 1);

  return (
    <div className="rounded-[22px] bg-gray-50 p-3">
      <div className="flex gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-white">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={item.product.name} className="absolute inset-0 h-full w-full object-contain p-2" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-2 text-sm font-black uppercase text-gray-950">{item.product.name}</div>
          <div className="mt-1 text-xs font-medium text-gray-500">{formatWholesaleDisplayPrice(item.product)} cada</div>
        </div>
        <button
          type="button"
          onClick={() => onRemoveItem(item.product.id)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-red-500 hover:bg-red-50"
        >
          <IconTrash size={16} />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="inline-flex h-10 items-center rounded-full bg-white px-1">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - packSize)}
            className="grid h-8 w-8 place-items-center rounded-full hover:bg-gray-100"
          >
            <IconMinus size={15} />
          </button>
          <input
            type="number"
            min={minQuantity}
            value={item.quantity}
            onChange={(event) => onUpdateQuantity(item.product.id, Number(event.target.value) || minQuantity)}
            className="w-12 border-0 bg-transparent text-center text-sm font-black focus:outline-none focus:ring-0"
          />
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + packSize)}
            className="grid h-8 w-8 place-items-center rounded-full bg-gray-950 text-white hover:bg-gray-800"
          >
            <IconPlus size={15} />
          </button>
        </div>
        <div className="text-sm font-black text-gray-950">
          {productHasOpenPrice(item.product) ? "A definir" : formatCurrency(item.product.price * item.quantity)}
        </div>
      </div>
    </div>
  );
}

function CheckoutView({
  banca,
  cart,
  cartHasOpenPrice,
  cartSubtotal,
  checkoutTotal,
  activeDelivery,
  form,
  submitting,
  onBack,
  onOpenBag,
  onUpdateForm,
  onUpdateQuantity,
  onRemoveItem,
  onSubmit,
}: {
  banca: BancaAccess | null;
  cart: CartItem[];
  cartHasOpenPrice: boolean;
  cartSubtotal: number;
  checkoutTotal: number;
  activeDelivery: (typeof DELIVERY_OPTIONS)[number];
  form: {
    payment_method: "pix" | "credit_card";
    delivery_option: string;
    customer_name: string;
    customer_phone: string;
    shipping_address: string;
    shipping_cep: string;
    notes: string;
  };
  submitting: boolean;
  onBack: () => void;
  onOpenBag: () => void;
  onUpdateForm: (partial: Partial<typeof form>) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-950 hover:text-gray-950"
      >
        <IconArrowLeft size={17} />
        Voltar ao catálogo
      </button>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <div className="space-y-4">
          <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ring-1 ring-gray-100">
            <h2 className="text-lg font-black text-gray-950">Dados da banca</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">Usamos os dados do jornaleiro logado para montar o pedido.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Nome da banca</span>
                <input
                  value={form.customer_name}
                  onChange={(event) => onUpdateForm({ customer_name: event.target.value })}
                  placeholder={banca?.name || "Nome da banca"}
                  className="mt-1 h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">WhatsApp</span>
                <input
                  value={form.customer_phone}
                  onChange={(event) => onUpdateForm({ customer_phone: event.target.value })}
                  placeholder={banca?.whatsapp || "Telefone"}
                  className="mt-1 h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
                />
              </label>
              <label className="block text-sm md:col-span-2">
                <span className="font-medium text-gray-700">Endereço de entrega</span>
                <input
                  value={form.shipping_address}
                  onChange={(event) => onUpdateForm({ shipping_address: event.target.value })}
                  placeholder={banca?.address || "Endereço"}
                  className="mt-1 h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">CEP</span>
                <input
                  value={form.shipping_cep}
                  onChange={(event) => onUpdateForm({ shipping_cep: event.target.value })}
                  placeholder={banca?.cep || "CEP"}
                  className="mt-1 h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ring-1 ring-gray-100">
            <h2 className="text-lg font-black text-gray-950">Pagamento, frete e prazo</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Pagamento</span>
                <select
                  value={form.payment_method}
                  onChange={(event) => onUpdateForm({ payment_method: event.target.value as "pix" | "credit_card" })}
                  className="mt-1 h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
                >
                  <option value="pix">Pix</option>
                  <option value="credit_card">Cartão de crédito</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-medium text-gray-700">Entrega</span>
                <select
                  value={form.delivery_option}
                  onChange={(event) => onUpdateForm({ delivery_option: event.target.value })}
                  className="mt-1 h-12 w-full rounded-full border border-gray-200 bg-gray-50 px-4 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
                >
                  {DELIVERY_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 rounded-[22px] bg-gray-50 p-4 text-sm font-medium text-gray-700">
              <div className="flex items-center justify-between gap-3">
                <span>Frete</span>
                <span className="font-semibold">{activeDelivery.fee <= 0 ? "A combinar" : formatCurrency(activeDelivery.fee)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Prazo de entrega</span>
                <span className="text-right font-semibold">{activeDelivery.deadline}</span>
              </div>
            </div>
            <textarea
              value={form.notes}
              onChange={(event) => onUpdateForm({ notes: event.target.value })}
              rows={3}
              placeholder="Observações do pedido"
              className="mt-4 w-full rounded-[22px] border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium outline-none focus:border-lime-300 focus:bg-white focus:ring-4 focus:ring-lime-100"
            />
          </div>
        </div>

        <div className="rounded-[26px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] ring-1 ring-gray-100">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-gray-950">Sacola</h2>
            <button type="button" onClick={onOpenBag} className="text-sm font-bold text-gray-950 hover:underline">
              Abrir sacola
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {cart.map((item) => (
              <CartLineItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
              />
            ))}
            {cart.length === 0 ? (
              <div className="rounded-[22px] bg-gray-50 p-4 text-sm font-medium text-gray-500">Sacola vazia.</div>
            ) : null}
          </div>

          <div className="mt-5 space-y-2 rounded-[22px] bg-gray-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-black text-gray-950">{cartHasOpenPrice ? "Valor a definir" : formatCurrency(cartSubtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Frete</span>
              <span className="font-black text-gray-950">{activeDelivery.fee <= 0 ? "A combinar" : formatCurrency(activeDelivery.fee)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-200 pt-2 text-base">
              <span className="font-black text-gray-950">Total</span>
              <span className="font-black text-gray-950">{cartHasOpenPrice ? "Valor a definir" : formatCurrency(checkoutTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting || cart.length === 0}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-lime-300 px-4 text-sm font-black text-gray-950 shadow-[0_14px_30px_rgba(132,204,22,0.28)] transition hover:bg-lime-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
          >
            {submitting ? "Finalizando..." : "Finalizar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
