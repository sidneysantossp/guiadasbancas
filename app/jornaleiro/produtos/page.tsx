"use client";

import Link from "next/link";
// Removido next/image - usando img nativo para evitar falhas em produção
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";
import PlanOverdueCard from "@/components/jornaleiro/PlanOverdueCard";
import PlanPendingActivationCard from "@/components/jornaleiro/PlanPendingActivationCard";
import PlanUpgradeCard from "@/components/jornaleiro/PlanUpgradeCard";
import JornaleiroPageHeading from "@/components/jornaleiro/JornaleiroPageHeading";
import { getPlanUpgradeHint } from "@/lib/plan-messaging";

type ProdutoListItem = {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  price: number;
  cost_price?: number;
  price_original?: number;
  stock_qty: number;
  active: boolean;
  updated_at?: string;
  image?: string;
  codigo_mercos?: string;
};

type CategoryOption = { id: string; name: string };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export default function JornaleiroProdutosPage() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("");
  const [rows, setRows] = useState<ProdutoListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [planName, setPlanName] = useState("Free");
  const [planType, setPlanType] = useState("free");
  const [productLimit, setProductLimit] = useState<number | null>(null);
  const [ownProductsCount, setOwnProductsCount] = useState(0);
  const [paidFeaturesLockedUntilPayment, setPaidFeaturesLockedUntilPayment] = useState(false);
  const [requestedPlanName, setRequestedPlanName] = useState<string | null>(null);
  const [overdueFeaturesLocked, setOverdueFeaturesLocked] = useState(false);
  const [overdueInGracePeriod, setOverdueInGracePeriod] = useState(false);
  const [overdueGraceEndsAt, setOverdueGraceEndsAt] = useState<string | null>(null);
  const [contractedPlanName, setContractedPlanName] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const json = await res.json();
        if (json?.success) {
          setCategories((json.data as any[])?.map((c) => ({ id: c.id, name: c.name })) || []);
        }
      } catch (e: any) {
        toast.error(e?.message || "Não foi possível carregar categorias");
      }
    };
    loadCategories();
  }, [toast]);

  const categoryMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {});
  }, [categories]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (status) params.set("active", String(status === "ativo"));
      if (priceFilter) params.set("priceFilter", priceFilter);
      const res = await fetch(`/api/jornaleiro/products?${params.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Erro ao carregar produtos");
      }
      const items = Array.isArray(json?.items) ? json.items : (Array.isArray(json?.data) ? json.data : []);
      
      setRows(
        items.map((p: any) => ({
          id: p.id,
          name: p.name,
          category_id: p.category_id,
          category_name: categoryMap[p.category_id] || p.category_id,
          price: Number(p.price ?? 0),
          cost_price: p.cost_price ? Number(p.cost_price) : undefined,
          price_original: p.price_original ? Number(p.price_original) : undefined,
          stock_qty: Number(p.stock_qty ?? 0),
          active: Boolean(p.active),
          updated_at: p.updated_at,
          image: Array.isArray(p.images) && p.images.length ? p.images[0] : undefined,
          codigo_mercos: p.codigo_mercos,
        }))
      );
    } catch (e: any) {
      toast.error(e?.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const loadPlanUsage = async () => {
    try {
      const res = await fetch("/api/jornaleiro/products?stats=true", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.error || "Erro ao carregar limites do plano");
      }
      setPlanName(json?.plan?.name || "Free");
      setPlanType(json?.entitlements?.plan_type || json?.plan?.type || "free");
      setProductLimit(Number.isFinite(Number(json?.entitlements?.product_limit)) ? Number(json?.entitlements?.product_limit) : null);
      setOwnProductsCount(Number(json?.stats?.proprios || 0));
      setPaidFeaturesLockedUntilPayment(json?.entitlements?.paid_features_locked_until_payment === true);
      setRequestedPlanName(json?.requested_plan?.name || null);
      setOverdueFeaturesLocked(json?.entitlements?.overdue_features_locked === true);
      setOverdueInGracePeriod(json?.entitlements?.overdue_in_grace_period === true);
      setOverdueGraceEndsAt(json?.entitlements?.overdue_grace_ends_at || null);
      setContractedPlanName(json?.subscription?.plan?.name || null);
    } catch (e: any) {
      console.error("[Produtos] Erro ao carregar consumo do plano:", e);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, status, priceFilter, categoryMap]);

  useEffect(() => {
    loadPlanUsage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryMap]);

  const filtered = useMemo(() => rows, [rows]);
  const usagePercent = productLimit && productLimit > 0 ? Math.min((ownProductsCount / productLimit) * 100, 100) : null;
  const shouldSuggestUpgrade = Boolean(productLimit && usagePercent && usagePercent >= 80);
  const limitReached = Boolean(productLimit && ownProductsCount >= productLimit);
  const activeProducts = useMemo(() => rows.filter((row) => row.active).length, [rows]);
  const inactiveProducts = useMemo(() => rows.filter((row) => !row.active).length, [rows]);
  const productsWithoutImage = useMemo(() => rows.filter((row) => !row.image).length, [rows]);
  const outOfStockProducts = useMemo(() => rows.filter((row) => Number(row.stock_qty || 0) <= 0).length, [rows]);
  const productUpgradeHint = getPlanUpgradeHint({
    currentPlanType: planType,
    currentPlanName: planName,
    context: "product-limit",
    productLimit,
    currentCount: ownProductsCount,
  });
  const productUpgradeHref = "/jornaleiro/meu-plano?source=product-limit" as Route;

  const toggleActive = async (row: ProdutoListItem) => {
    try {
      setSavingId(row.id);
      const res = await fetch(`/api/jornaleiro/products/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !row.active, updated_at: new Date().toISOString() }),
      });
      if (!res.ok) {
        toast.error("Não foi possível atualizar o produto");
        return;
      }
      toast.success(`Produto ${!row.active ? "ativado" : "desativado"}`);
      await fetchRows();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao atualizar produto");
    } finally {
    }
  };

  const columns: Column<ProdutoListItem>[] = [
    {
      key: "name",
      header: "Produto",
      render: (r) => (
        <div className="flex items-start gap-3">
          <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 sm:h-16 sm:w-12">
            {r.image ? (
              <img
                src={r.image}
                alt={r.name}
                className="absolute inset-0 h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium leading-6 text-gray-900">{r.name}</div>
            {r.codigo_mercos && (
              <div className="mt-0.5 text-xs font-mono text-gray-500">{r.codigo_mercos}</div>
            )}
            <div className="mt-1 hidden text-xs text-gray-500 sm:block">
              {r.category_name || "Sem categoria"}
            </div>
            <div className="mt-3 grid gap-2 sm:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge label={r.active ? "Ativo" : "Inativo"} tone={r.active ? "emerald" : "gray"} />
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                  Estoque: {r.stock_qty}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-gray-500">Custo</div>
                  <div className="mt-1 text-sm font-semibold text-gray-700">
                    {formatCurrency(r.cost_price ?? (r.price_original && r.price_original !== r.price ? r.price_original : r.price))}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-orange-50 px-3 py-2">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-orange-600">Venda</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">{formatCurrency(r.price)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "cost_price",
      header: "Preço de Custo",
      hiddenOnMobile: true,
      render: (r) => {
        // Prioridade: cost_price > price_original (se diferente de price)
        const costValue = r.cost_price ?? (r.price_original && r.price_original !== r.price ? r.price_original : r.price);
        return (
          <span className="text-gray-600">
            {formatCurrency(costValue)}
          </span>
        );
      },
      align: "right",
    },
    {
      key: "price",
      header: "Preço de Venda",
      hiddenOnMobile: true,
      render: (r) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(r.price)}
        </span>
      ),
      align: "right",
    },
    {
      key: "stock_qty",
      header: "Estoque",
      hiddenOnMobile: true,
      render: (r) => r.stock_qty.toString(),
      align: "right",
    },
  ];

  return (
    <div className="space-y-4 overflow-x-hidden px-3 pb-24 sm:px-0 sm:pb-0">
      <JornaleiroPageHeading
        title="Produtos"
        actions={
          paidFeaturesLockedUntilPayment || overdueFeaturesLocked ? (
            <Link
              href={"/jornaleiro/meu-plano" as Route}
              className="inline-flex w-full items-center justify-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 sm:w-auto"
            >
              Ver cobrança do plano
            </Link>
          ) : limitReached ? (
            <Link
              href={productUpgradeHref}
              className="inline-flex w-full items-center justify-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 sm:w-auto"
            >
              Fazer upgrade do plano
            </Link>
          ) : (
            <Link
              href={(limitReached ? productUpgradeHref : "/jornaleiro/produtos/create") as Route}
              className="inline-flex w-full items-center justify-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 sm:w-auto"
            >
              {limitReached ? "Ver meu plano" : "Novo produto"}
            </Link>
          )
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Produtos ativos</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{activeProducts}</div>
          <p className="mt-1 text-sm text-gray-500">
            {activeProducts > 0 ? "Itens já prontos para venda no site." : "Nenhum item ativo ainda."}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Sem imagem</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{productsWithoutImage}</div>
          <p className="mt-1 text-sm text-gray-500">
            {productsWithoutImage > 0 ? "Produtos que perdem conversão por falta de foto." : "Seu catálogo visível está completo."}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Estoque zerado</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">{outOfStockProducts}</div>
          <p className="mt-1 text-sm text-gray-500">
            {outOfStockProducts > 0 ? "Itens que pedem reposição ou pausa imediata." : "Nenhum item zerado agora."}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Capacidade do plano</div>
          <div className="mt-3 text-2xl font-semibold text-gray-900">
            {productLimit ? `${ownProductsCount}/${productLimit}` : ownProductsCount}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {productLimit ? "Uso atual do espaço do seu catálogo próprio." : "Seu plano atual não informou limite numérico."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-700">
                Plano atual
              </span>
              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ff5c00]">
                {planName}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-gray-900">Saúde do catálogo próprio</h2>
            <p className="mt-1 text-sm text-gray-600">
              Use este bloco para manter o catálogo publicável: produtos ativos, imagem, estoque e espaço disponível no
              plano. O objetivo aqui não é só cadastrar item, é garantir que a banca consiga vender sem ruído.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={"/jornaleiro/inteligencia" as Route}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Abrir inteligência
              </Link>
              <Link
                href={"/jornaleiro/catalogo-distribuidor" as Route}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Ver catálogo parceiro
              </Link>
            </div>
          </div>
          {productLimit ? (
            <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>Uso do catálogo</span>
                <span>{ownProductsCount}/{productLimit}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    (usagePercent || 0) >= 100
                      ? "bg-red-500"
                      : (usagePercent || 0) >= 80
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${usagePercent || 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {usagePercent && usagePercent >= 100
                  ? "Seu plano chegou ao limite de produtos próprios."
                  : usagePercent && usagePercent >= 80
                    ? "Você está perto do limite. Vale revisar o próximo plano."
                    : "Você ainda tem espaço para continuar cadastrando."}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {overdueFeaturesLocked || overdueInGracePeriod ? (
        <PlanOverdueCard
          planName={contractedPlanName || planName}
          graceEndsAt={overdueGraceEndsAt}
          accessSuspended={overdueFeaturesLocked}
        />
      ) : paidFeaturesLockedUntilPayment && requestedPlanName ? (
        <PlanPendingActivationCard requestedPlanName={requestedPlanName} />
      ) : shouldSuggestUpgrade ? (
        <PlanUpgradeCard
          currentPlanType={planType}
          currentPlanName={planName}
          context="product-limit"
          productLimit={productLimit}
          currentCount={ownProductsCount}
          primaryHref={productUpgradeHref}
        />
      ) : null}

      {(productsWithoutImage > 0 || outOfStockProducts > 0 || inactiveProducts > 0) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <div className="font-semibold">Pontos que merecem revisão no catálogo</div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-amber-800">
            {productsWithoutImage > 0 ? <span>{productsWithoutImage} produto(s) sem imagem</span> : null}
            {outOfStockProducts > 0 ? <span>{outOfStockProducts} produto(s) com estoque zerado</span> : null}
            {inactiveProducts > 0 ? <span>{inactiveProducts} produto(s) inativos</span> : null}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome, código ou SKU"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-[180px] w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm sm:w-auto"
          >
            <option value="">Todas categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="min-w-[140px] w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm sm:w-auto"
          >
            <option value="">Todos status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="min-w-[180px] w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm sm:w-auto"
          >
            <option value="">Todos preços</option>
            <option value="personalizado">Preços Personalizados</option>
            <option value="distribuidor">Preço do Distribuidor</option>
          </select>
          
          {(q || category || status || priceFilter) && (
            <button
              onClick={() => {
                setQ("");
                setCategory("");
                setStatus("");
                setPriceFilter("");
              }}
              className="rounded-md px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {loading && <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">Carregando produtos...</div>}

      <DataTable
        columns={columns}
        data={filtered}
        getId={(row) => row.id}
        renderActions={(row) => (
          <div className="flex flex-col items-end justify-end gap-2 sm:flex-row sm:items-center">
            <Link
              href={( `/jornaleiro/produtos/${row.id}` ) as Route}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
              title="Editar produto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => toggleActive(row)}
              disabled={savingId === row.id}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={row.active ? "Desativar produto" : "Ativar produto"}
            >
              {row.active ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        )}
      />
    </div>
  );
}
