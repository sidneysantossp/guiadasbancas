"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";

type ProdutoListItem = {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  price: number;
  stock_qty: number;
  active: boolean;
  updated_at?: string;
  image?: string;
};

type CategoryOption = { id: string; name: string };

export default function JornaleiroProdutosPage() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [rows, setRows] = useState<ProdutoListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const authHeaders = useMemo(() => {
    if (typeof window === "undefined") return {};
    const token = window.localStorage.getItem("gb:sellerToken") || "seller-token";
    return { Authorization: `Bearer ${token}` } as Record<string, string>;
  }, []);

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
      const res = await fetch(`/api/jornaleiro/products?${params.toString()}`, { headers: authHeaders, cache: "no-store" });
      const json = await res.json();
      const items = Array.isArray(json?.items) ? json.items : (Array.isArray(json?.data) ? json.data : []);
      
      setRows(
        items.map((p: any) => ({
          id: p.id,
          name: p.name,
          category_id: p.category_id,
          category_name: categoryMap[p.category_id] || p.category_id,
          price: Number(p.price ?? 0),
          stock_qty: Number(p.stock_qty ?? 0),
          active: Boolean(p.active),
          updated_at: p.updated_at,
          image: Array.isArray(p.images) && p.images.length ? p.images[0] : undefined,
        }))
      );
    } catch (e: any) {
      toast.error(e?.message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, status, categoryMap]);

  const filtered = useMemo(() => rows, [rows]);

  const toggleActive = async (row: ProdutoListItem) => {
    try {
      setSavingId(row.id);
      const res = await fetch(`/api/jornaleiro/products/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
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
        <div className="flex items-center gap-3">
          {r.image ? (
            <Image
              src={r.image}
              alt={r.name}
              width={48}
              height={48}
              className="rounded-md object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="font-medium">{r.name}</div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Preço",
      render: (r) => (
        <span className="font-semibold text-gray-900">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(r.price)}
        </span>
      ),
      align: "right",
    },
    {
      key: "stock_qty",
      header: "Estoque",
      render: (r) => r.stock_qty.toString(),
      align: "right",
    },
  ];

  return (
    <div className="space-y-4 overflow-x-hidden px-3 sm:px-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold">Produtos</h1>
          <p className="text-sm text-gray-600">Gerencie os itens disponíveis na sua banca.</p>
        </div>
        <div>
          <Link
            href={("/jornaleiro/produtos/create") as Route}
            className="inline-flex items-center justify-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 w-full sm:w-auto"
          >
            Novo produto
          </Link>
        </div>
      </div>

      <FiltersBar
        onReset={() => {
          setQ("");
          setCategory("");
          setStatus("");
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou SKU"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Todas categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Todos status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </FiltersBar>

      {loading && <div className="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">Carregando produtos...</div>}

      <DataTable
        columns={columns}
        data={filtered}
        getId={(row) => row.id}
        renderActions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <Link
              href={( `/jornaleiro/produtos/${row.id}` ) as Route}
              className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center"
              title="Editar produto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => toggleActive(row)}
              disabled={savingId === row.id}
              className="rounded-md border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center"
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
