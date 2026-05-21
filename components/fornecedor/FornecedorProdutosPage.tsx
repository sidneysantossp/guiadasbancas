"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import {
  IconBox,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type Product = {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  image_url: string | null;
  images: string[];
  cost_price: number;
  price: number;
  stock_quantity: number;
  available_quantity: number;
  active: boolean;
  visible: boolean;
  visible_jornaleiro: boolean;
  visible_banca: boolean;
  availability_status: "in_stock" | "on_demand" | "quote";
};

type Category = {
  id: string;
  name: string;
  count: number;
};

const DEFAULT_STATUS_FILTER = "active";

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function statusLabel(value: Product["availability_status"]) {
  if (value === "on_demand") return "Sob encomenda";
  if (value === "quote") return "Pré-venda";
  return "Pronta entrega";
}

export default function FornecedorProdutosPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterActive, setFilterActive] = useState(DEFAULT_STATUS_FILTER);
  const [totalItems, setTotalItems] = useState(0);
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0 });
  const [pendingMigration, setPendingMigration] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const fetchCategories = async (categoryCounts: Record<string, number> = {}) => {
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/categories");
      const json = await response.json().catch(() => null);

      if (json?.success) {
        const rows: Category[] = (json.data || [])
          .map((category: any) => ({
            id: String(category.id),
            name: String(category.name || ""),
            count: Number(categoryCounts[category.id] || 0),
          }))
          .filter((category: Category) => category.name)
          .sort((a: Category, b: Category) => a.name.localeCompare(b.name));

        setCategories(rows);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias do fornecedor:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setPendingMigration(false);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
        status: filterActive,
      });

      const normalizedSearch = deferredSearch.trim();
      if (normalizedSearch) params.set("search", normalizedSearch);
      if (selectedCategory) params.set("category", selectedCategory);

      const response = await fetchAdminWithDevFallback(`/api/admin/atacado/products?${params.toString()}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || json?.success === false) {
        if (json?.pendingMigration) setPendingMigration(true);
        throw new Error(json?.error || "Erro ao carregar produtos");
      }

      setProducts(Array.isArray(json.data) ? json.data : []);
      setTotalItems(Number(json.total || 0));
      setSummary({
        total: Number(json.summary?.total || 0),
        active: Number(json.summary?.active || 0),
        inactive: Number(json.summary?.inactive || 0),
      });
      await fetchCategories(json.categoryCounts || {});
    } catch (error: any) {
      toast.error(error?.message || "Erro ao carregar produtos do fornecedor");
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, selectedCategory, filterActive, deferredSearch]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, filterActive]);

  const handleToggleActive = async (product: Product) => {
    const isActive = product.active !== false && product.visible !== false;

    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/atacado/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !isActive, visible: !isActive }),
      });
      const json = await response.json().catch(() => null);

      if (!response.ok || json?.success === false) {
        throw new Error(json?.error || "Erro ao alterar status");
      }

      await fetchProducts();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao alterar status");
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const selectedCategoryLabel = categories.find((category) => category.id === selectedCategory)?.name || selectedCategory;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Meus Produtos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie preços, estoque e disponibilidade dos seus produtos
          </p>
        </div>
        <Link
          href="/fornecedor/produtos/novo"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto"
        >
          <IconBox size={18} />
          Novo Produto
        </Link>
      </div>

      {pendingMigration ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          A migration do fornecedor próprio ainda não foi aplicada no Supabase. Execute
          {" "}
          <code>supabase/migrations/20260503000001_create_own_wholesale_module.sql</code>.
        </div>
      ) : null}

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Buscar produtos</label>
            <div className="relative">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Digite o nome ou código do produto..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Filtrar por categoria</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Todas as categorias ({categories.length})</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filterActive}
              onChange={(event) => setFilterActive(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        {(search || selectedCategory || filterActive !== DEFAULT_STATUS_FILTER) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Filtros ativos:</span>
            {search ? (
              <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-blue-800">
                Busca: &quot;{search}&quot;
                <button type="button" onClick={() => setSearch("")} className="hover:text-blue-900">
                  <IconX size={14} />
                </button>
              </span>
            ) : null}
            {selectedCategory ? (
              <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-green-800">
                Categoria: {selectedCategoryLabel}
                <button type="button" onClick={() => setSelectedCategory("")} className="hover:text-green-900">
                  <IconX size={14} />
                </button>
              </span>
            ) : null}
            {filterActive !== DEFAULT_STATUS_FILTER ? (
              <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-2 py-1 text-purple-800">
                Status: {filterActive === "all" ? "Todos" : filterActive === "active" ? "Ativos" : "Inativos"}
                <button type="button" onClick={() => setFilterActive(DEFAULT_STATUS_FILTER)} className="hover:text-purple-900">
                  <IconX size={14} />
                </button>
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setFilterActive(DEFAULT_STATUS_FILTER);
              }}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <p className="text-sm text-gray-600">Total de Produtos</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{summary.total}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <p className="text-sm text-gray-600">Ativos</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{summary.active}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <p className="text-sm text-gray-600">Inativos</p>
          <p className="mt-1 text-2xl font-bold text-gray-500">{summary.inactive}</p>
        </div>
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <p className="text-sm text-gray-600">Categorias</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{categories.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600" />
            <p className="mt-3 text-gray-500">Carregando produtos...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
          <IconBox size={48} className="mx-auto text-gray-300" />
          <p className="mt-3 text-gray-500">
            {search || selectedCategory || filterActive !== DEFAULT_STATUS_FILTER
              ? "Nenhum produto encontrado com esses filtros"
              : "Nenhum produto ativo cadastrado"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => {
            const imageUrl = product.image_url || product.images?.[0] || "";
            const isActive = product.active !== false && product.visible !== false;

            return (
              <div
                key={product.id}
                className={`grid grid-cols-[96px_minmax(0,1fr)] gap-3 rounded-xl border bg-white p-3 transition-all hover:shadow-md sm:flex sm:flex-col sm:p-4 ${
                  !isActive ? "border-gray-300 opacity-60" : "border-gray-200"
                }`}
              >
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100 sm:mb-3 sm:h-auto sm:w-full sm:aspect-square">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-1.5" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">Sem imagem</div>
                  )}
                  {!isActive ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">Inativo</span>
                    </div>
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 sm:text-base">{product.name}</h3>

                  {product.sku ? <p className="mb-1 font-mono text-[11px] text-gray-500">{product.sku}</p> : null}

                  <div className="mb-2 flex min-w-0 flex-wrap items-start gap-1.5">
                    {product.category_name ? (
                      <span className="max-w-full truncate text-xs font-medium text-blue-600">{product.category_name}</span>
                    ) : null}
                    <span className="max-w-full rounded bg-purple-100 px-1.5 py-0.5 text-[10px] leading-4 text-purple-700">
                      {statusLabel(product.availability_status)}
                    </span>
                    {product.visible_jornaleiro !== false ? (
                      <span className="max-w-full rounded bg-blue-100 px-1.5 py-0.5 text-[10px] leading-4 text-blue-700">
                        Jornaleiro
                      </span>
                    ) : null}
                    {product.visible_banca === true ? (
                      <span className="max-w-full rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] leading-4 text-emerald-700">
                        Banca
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-3 flex-1 space-y-1.5 text-xs text-gray-600">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                        <span>Custo:</span>
                        <span className="whitespace-nowrap text-gray-500">{formatPrice(product.cost_price)}</span>
                      </div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                        <span className="font-medium text-blue-700">Venda:</span>
                        <span className="whitespace-nowrap text-sm font-bold text-blue-700">
                          {(product.availability_status === "on_demand" || product.availability_status === "quote") && Number(product.price || 0) <= 0
                            ? "Valor a definir"
                            : formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-x-2 border-t border-gray-100 pt-1">
                      <span>Estoque:</span>
                      <span className={`font-semibold ${product.available_quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                        {product.available_quantity}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(product)}
                      className={`inline-flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                        isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={isActive ? "Desativar" : "Ativar"}
                    >
                      {isActive ? <IconCheck size={14} /> : <IconX size={14} />}
                      {isActive ? "Ativo" : "Inativo"}
                    </button>
                    <Link
                      href={`/fornecedor/produtos/editar/${product.id}`}
                      className="inline-flex min-h-10 min-w-0 items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <IconEdit size={14} />
                      Editar
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && totalItems > 0 ? (
        <div className="mt-6 flex flex-col items-stretch justify-between gap-4 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="text-center text-sm text-gray-600 sm:text-left">
            Mostrando {(page - 1) * pageSize + 1} - {Math.min((page - 1) * pageSize + products.length, totalItems)} de {totalItems}
          </div>

          <div className="flex items-center justify-center gap-1">
            <button type="button" onClick={() => setPage(1)} disabled={page === 1} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <IconChevronsLeft size={16} />
            </button>
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <IconChevronLeft size={16} />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">{page} de {totalPages}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <IconChevronRight size={16} />
            </button>
            <button type="button" onClick={() => setPage(totalPages)} disabled={page === totalPages} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              <IconChevronsRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Por página:</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(parseInt(event.target.value, 10));
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      ) : null}
    </div>
  );
}
