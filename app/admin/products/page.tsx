"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

type ProductRow = {
  id: string;
  name: string;
  code: string | null;
  category_id: string | null;
  category_name: string;
  distribuidor_id: string | null;
  distribuidor_name: string | null;
  banca_id: string | null;
  banca_name: string | null;
  price: number;
  cost_price: number;
  stock: number;
  active: boolean;
  thumbnail: string | null;
  source: "distribuidor" | "banca";
  created_at: string | null;
};

type SummaryCounts = {
  distribuidores_ativos: number;
  distribuidores_inativos: number;
  proprios: number;
  total_geral: number;
};

type SelectOption = {
  id: string;
  name: string;
};

function formatCurrency(value?: number | null) {
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
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{helper}</div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [counts, setCounts] = useState<SummaryCounts>({
    distribuidores_ativos: 0,
    distribuidores_inativos: 0,
    proprios: 0,
    total_geral: 0,
  });
  const [distribuidores, setDistribuidores] = useState<SelectOption[]>([]);
  const [categorias, setCategorias] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [distributorFilter, setDistributorFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);

  const loadCounts = async () => {
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/products/count");
      const json = await response.json();
      if (json.success) {
        setCounts({
          distribuidores_ativos: Number(json.counts?.distribuidores_ativos || 0),
          distribuidores_inativos: Number(json.counts?.distribuidores_inativos || 0),
          proprios: Number(json.counts?.proprios || 0),
          total_geral: Number(json.counts?.total_geral || 0),
        });
      }
    } catch (error) {
      console.error("Erro ao carregar contadores de produtos:", error);
    }
  };

  const loadFilters = async () => {
    try {
      const [distResponse, categoriesResponse] = await Promise.all([
        fetchAdminWithDevFallback("/api/admin/distribuidores"),
        fetchAdminWithDevFallback("/api/admin/all-categories"),
      ]);

      const [distJson, categoriesJson] = await Promise.all([distResponse.json(), categoriesResponse.json()]);

      if (distJson.success) {
        setDistribuidores((distJson.data || []).map((item: any) => ({ id: item.id, name: item.nome })));
      }

      if (categoriesJson.success) {
        setCategorias((categoriesJson.data || []).map((item: any) => ({ id: item.id, name: item.name })));
      }
    } catch (error) {
      console.error("Erro ao carregar filtros do catálogo:", error);
    }
  };

  const loadRows = async (options?: {
    page?: number;
    pageSize?: number;
    query?: string;
    category?: string;
    status?: string;
    distribuidor?: string;
  }) => {
    const nextPage = options?.page ?? page;
    const nextPageSize = options?.pageSize ?? pageSize;
    const nextQuery = (options?.query ?? query).trim();
    const nextCategory = options?.category ?? categoryFilter;
    const nextStatus = options?.status ?? statusFilter;
    const nextDistribuidor = options?.distribuidor ?? distributorFilter;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(nextPageSize),
      });

      if (nextQuery) params.set("q", nextQuery);
      if (nextCategory) params.set("category", nextCategory);
      if (nextStatus) params.set("status", nextStatus);
      if (nextDistribuidor) params.set("distribuidor", nextDistribuidor);

      const response = await fetchAdminWithDevFallback(`/api/admin/products?${params.toString()}`);
      const json = await response.json();

      if (json.success) {
        setRows(Array.isArray(json.data) ? json.data : []);
        setTotal(Number(json.total || 0));
        setPage(nextPage);
        setPageSize(nextPageSize);
      } else {
        setRows([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
    loadFilters();
    loadRows({ page: 1, pageSize });
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadRows({
        page: 1,
        pageSize,
        query,
        category: categoryFilter,
        status: statusFilter,
        distribuidor: distributorFilter,
      });
    }, 250);

    return () => clearTimeout(debounce);
  }, [query, categoryFilter, statusFilter, distributorFilter]);

  const sourceSummary = useMemo(() => {
    return {
      activeDistributor: counts.distribuidores_ativos,
      inactiveDistributor: counts.distribuidores_inativos,
      own: counts.proprios,
      total: counts.total_geral,
    };
  }, [counts]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        alert(json.error || "Erro ao excluir produto");
        return;
      }

      await Promise.all([
        loadRows({ page, pageSize, query, category: categoryFilter, status: statusFilter, distribuidor: distributorFilter }),
        loadCounts(),
      ]);
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(`Tem certeza que deseja excluir ${selectedIds.length} produto(s)?`);
    if (!confirmed) return;

    setBulkDeleting(true);
    try {
      const response = await fetchAdminWithDevFallback("/api/admin/products/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const json = await response.json();

      if (!response.ok || !json.success) {
        alert(json.error || "Erro ao excluir produtos selecionados");
        return;
      }

      setSelectedIds([]);
      await Promise.all([
        loadRows({ page: 1, pageSize, query, category: categoryFilter, status: statusFilter, distribuidor: distributorFilter }),
        loadCounts(),
      ]);
    } catch (error) {
      console.error("Erro ao excluir produtos em lote:", error);
      alert("Erro ao excluir produtos selecionados");
    } finally {
      setBulkDeleting(false);
    }
  };

  const columns: Column<ProductRow>[] = [
    {
      key: "thumbnail",
      header: "Imagem",
      render: (row) => (
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
          {row.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.thumbnail}
              alt={row.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                (event.target as HTMLImageElement).src = "/images/no-image.svg";
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/images/no-image.svg" alt="Sem imagem" className="h-full w-full object-cover" />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Produto",
      render: (row) => (
        <div>
          <Link href={`/admin/products/${row.id}` as Route} className="font-medium text-gray-900 hover:text-[#ff5c00]">
            {row.name}
          </Link>
          <div className="text-xs text-gray-500">{row.code || row.id}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      hiddenOnMobile: true,
      render: (row) => (
        <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
          {row.category_name}
        </span>
      ),
    },
    {
      key: "source",
      header: "Origem",
      render: (row) => (
        <div className="space-y-1">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
              row.source === "distribuidor" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
            }`}
          >
            {row.source === "distribuidor" ? "Distribuidor" : "Catálogo próprio"}
          </span>
          <div className="text-xs text-gray-500">{row.distribuidor_name || row.banca_name || "Guia das Bancas"}</div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Preço final",
      render: (row) => <span className="text-sm font-medium text-gray-900">{formatCurrency(row.price)}</span>,
    },
    {
      key: "stock",
      header: "Estoque",
      hiddenOnMobile: true,
      render: (row) => <span className="text-sm text-gray-700">{row.stock}</span>,
    },
    {
      key: "active",
      header: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            row.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.active ? "Ativo" : "Inativo"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Camada operacional do catálogo central, unindo produtos próprios das bancas, oferta de distribuidores e governança de conteúdo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 ? (
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="rounded-xl border border-red-300 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              {bulkDeleting ? "Excluindo..." : `Excluir selecionados (${selectedIds.length})`}
            </button>
          ) : null}
          <Link
            href="/admin/produtos/upload-imagens"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:border-[#ff5c00] hover:text-[#ff5c00]"
          >
            Importar fotos
          </Link>
          <Link
            href="/admin/products/create"
            className="rounded-xl bg-[#ff5c00] px-4 py-3 text-sm font-medium text-white hover:bg-[#e05400]"
          >
            Novo produto
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Catálogo total" value={sourceSummary.total} helper="Todos os produtos operacionais" />
        <SummaryCard title="Supply ativo" value={sourceSummary.activeDistributor} helper="Produtos ativos vindos de distribuidores" />
        <SummaryCard title="Supply inativo" value={sourceSummary.inactiveDistributor} helper="Itens do supply fora de operação" />
        <SummaryCard title="Próprios" value={sourceSummary.own} helper="Produtos mantidos pelas bancas" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_240px_220px_240px]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou código Mercos"
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
          <select
            value={distributorFilter}
            onChange={(event) => setDistributorFilter(event.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-3 text-sm"
          >
            <option value="">Todos os distribuidores</option>
            <option value="admin">Catálogo próprio / Guia das Bancas</option>
            {distribuidores.map((distribuidor) => (
              <option key={distribuidor.id} value={distribuidor.id}>
                {distribuidor.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-500">Carregando catálogo...</div>
        ) : (
          <DataTable
            columns={columns}
            data={rows}
            getId={(row) => row.id}
            selectable
            onSelectRows={setSelectedIds}
            serverMode
            serverPage={page}
            serverPageSize={pageSize}
            serverTotal={total}
            onServerPageChange={(nextPage) =>
              loadRows({
                page: nextPage,
                pageSize,
                query,
                category: categoryFilter,
                status: statusFilter,
                distribuidor: distributorFilter,
              })
            }
            onServerPageSizeChange={(nextPageSize) =>
              loadRows({
                page: 1,
                pageSize: nextPageSize,
                query,
                category: categoryFilter,
                status: statusFilter,
                distribuidor: distributorFilter,
              })
            }
            renderActions={(row) => (
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/products/${row.id}` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Detalhes
                </Link>
                <Link href={`/admin/products/${row.id}/edit` as Route} className="text-sm font-medium text-[#ff5c00] hover:underline">
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(row.id)}
                  disabled={deletingId === row.id}
                  className="text-sm font-medium text-red-600 hover:underline disabled:opacity-60"
                >
                  {deletingId === row.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
}
