"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando produtos admin...');
      
      const res = await fetch('/api/admin/products', {
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      console.log('📡 Status da resposta:', res.status);
      
      const json = await res.json();
      console.log('📦 JSON recebido:', json);
      
      const items = Array.isArray(json?.data) ? json.data : [];
      console.log('📋 Total de produtos:', items.length);
      
      // adaptar para colunas esperadas
      setRows(items.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category_id || "-",
        price: p.price ?? 0,
        stock: p.stock_qty ?? 0,
        active: true, // produtos sempre ativos por enquanto
        updatedAt: p.updated_at || "",
      })));
      
      console.log('✅ Produtos carregados com sucesso');
    } catch (e) {
      console.error('❌ Erro ao buscar produtos:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      if (res.ok) {
        // Recarregar a lista
        fetchRows();
      } else {
        alert('Erro ao excluir produto');
      }
    } catch (error) {
      alert('Erro ao excluir produto');
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, status]);

  const filtered = useMemo(() => {
    return rows.filter(r => (
      (!q || r.name.toLowerCase().includes(q.toLowerCase())) &&
      (!category || r.category === category) &&
      (!status || (status === "ativo" ? r.active : !r.active))
    ));
  }, [rows, q, category, status]);

  const columns: Column<any>[] = [
    { key: "name", header: "Nome", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "category", header: "Categoria" },
    { key: "price", header: "Preço", render: (r) => <>R$ {Number(r.price||0).toFixed(2)}</> },
    { key: "stock", header: "Estoque" },
    { key: "active", header: "Status", render: (r) => (
      <StatusBadge label={r.active ? 'Ativo' : 'Inativo'} tone={r.active ? 'emerald' : 'gray'} />
    ) },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Produtos</h1>
        <p className="text-gray-600">Gerencie o catálogo da sua banca</p>
      </div>

      <FiltersBar
        actions={<Link href="/admin/products/create" className="rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95">Novo Produto</Link>}
        onReset={() => { setQ(""); setCategory(""); setStatus(""); }}
      >
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por nome..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">Todas categorias</option>
          <option value="Padaria">Padaria</option>
          <option value="Revistas">Revistas</option>
        </select>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">Todos status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
        </select>
      </FiltersBar>

      {loading && <div className="p-4 text-sm text-gray-500">Carregando...</div>}

      <DataTable
        columns={columns}
        data={filtered}
        getId={(r)=>r.id}
        selectable
        renderActions={(row) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/products/${row.id}`}
              className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
            >
              Ver
            </Link>
            <Link
              href={`/admin/products/${row.id}/edit`}
              className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
            >
              Editar
            </Link>
            <button
              onClick={() => handleDelete(row.id)}
              className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
            >
              Excluir
            </button>
          </div>
        )}
      />
    </div>
  );
}
