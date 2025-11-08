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
  const [distribuidor, setDistribuidor] = useState<string>("");
  const [rows, setRows] = useState<any[]>([]);
  const [distribuidores, setDistribuidores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchRows = async () => {
    try {
      setLoading(true);
      console.log('🔍 Buscando produtos admin...');
      
      const res = await fetch(`/api/admin/products?_t=${Date.now()}`, {
        headers: {
          'Authorization': 'Bearer admin-token'
        },
        cache: 'no-store'
      });
      
      console.log('📡 Status da resposta:', res.status);
      
      if (!res.ok) {
        console.error('❌ Erro na resposta:', res.status, res.statusText);
        const text = await res.text();
        console.error('❌ Texto da resposta:', text);
        setLoading(false);
        return;
      }
      
      const json = await res.json();
      console.log('📦 JSON recebido:', json);
      console.log('📦 JSON.data:', json?.data);
      console.log('📦 É array?:', Array.isArray(json?.data));
      
      const items = Array.isArray(json?.data) ? json.data : [];
      console.log('📋 Total de produtos:', items.length);
      console.log('📋 Primeiros itens:', items.slice(0, 2));
      
      // adaptar para colunas esperadas
      setRows(items.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.categoria_nome || "Sem Categoria",
        category_id: p.category_id || null,
        price: p.price ?? 0,
        stock: p.stock_qty ?? 0,
        active: true, // produtos sempre ativos por enquanto
        updatedAt: p.updated_at || "",
        codigo_mercos: p.codigo_mercos || null,
        images: p.images || [], // Array de imagens
        thumbnail: (p.images && p.images.length > 0) ? p.images[0] : null, // Primeira imagem como thumb
        distribuidor_id: p.distribuidor_id || null,
        distribuidor_nome: p.distribuidor_nome || "Guia das Bancas", // Nome do distribuidor ou padrão
      })));
      
      console.log('✅ Produtos carregados com sucesso');
    } catch (e) {
      console.error('❌ Erro ao buscar produtos:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} produto(s)? Essa ação não poderá ser desfeita.`)) return;

    try {
      setBulkDeleting(true);
      console.log('[BULK DELETE] Excluindo produtos IDs:', selectedIds);
      const res = await fetch('/api/admin/products/bulk-delete', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: selectedIds })
      });

      console.log('[BULK DELETE] Response status:', res.status);
      const data = await res.json().catch(() => null);
      console.log('[BULK DELETE] Response data:', data);

      if (res.ok && data?.success) {
        alert(`✅ ${data.deleted || selectedIds.length} produto(s) excluído(s) com sucesso!`);
        setSelectedIds([]);
        await fetchRows();
      } else {
        const errorMsg = data?.error || 'Erro ao excluir produtos selecionados';
        console.error('[BULK DELETE] Error:', errorMsg);
        alert('❌ ' + errorMsg);
      }
    } catch (error) {
      console.error('[BULK DELETE] Exception:', error);
      alert('❌ Erro ao excluir produtos: ' + String(error));
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      console.log('[DELETE] Excluindo produto ID:', id);
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer admin-token'
        }
      });
      
      console.log('[DELETE] Response status:', res.status);
      const data = await res.json().catch(() => null);
      console.log('[DELETE] Response data:', data);
      
      if (res.ok && data?.success) {
        alert('✅ Produto excluído com sucesso!');
        // Recarregar a lista
        await fetchRows();
      } else {
        const errorMsg = data?.error || 'Erro ao excluir produto';
        console.error('[DELETE] Error:', errorMsg);
        alert('❌ Erro ao excluir produto: ' + errorMsg);
      }
    } catch (error) {
      console.error('[DELETE] Exception:', error);
      alert('❌ Erro ao excluir produto: ' + String(error));
    }
  };

  useEffect(() => {
    fetchRows();
    fetchDistribuidores();
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDistribuidores = async () => {
    try {
      const res = await fetch('/api/admin/distribuidores', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const json = await res.json();
      if (json.success) {
        setDistribuidores(json.data || []);
      }
    } catch (e) {
      console.error('Erro ao buscar distribuidores:', e);
    }
  };

  const fetchCategorias = async () => {
    try {
      const res = await fetch('/api/admin/all-categories', {
        headers: { 'Authorization': 'Bearer admin-token' }
      });
      const json = await res.json();
      if (json.success) {
        setCategorias(json.data || []);
      }
    } catch (e) {
      console.error('Erro ao buscar categorias:', e);
    }
  };

  const filtered = useMemo(() => {
    return rows.filter(r => {
      // Filtro de busca por nome
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      
      // Filtro de categoria
      if (category && r.category !== category) return false;
      
      // Filtro de status
      if (status && ((status === "ativo" && !r.active) || (status === "inativo" && r.active))) return false;
      
      // Filtro de distribuidor
      if (distribuidor) {
        if (distribuidor === "admin" && r.distribuidor_id) return false;
        if (distribuidor !== "admin" && r.distribuidor_id !== distribuidor) return false;
      }
      
      return true;
    });
  }, [rows, q, category, status, distribuidor]);

  const columns: Column<any>[] = [
    { 
      key: "thumbnail", 
      header: "Imagem", 
      render: (r) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
          <img 
            src={r.thumbnail || '/images/no-image.svg'} 
            alt={r.name || 'Produto sem imagem'}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/no-image.svg';
            }}
          />
        </div>
      )
    },
    { 
      key: "name", 
      header: "Nome", 
      render: (r) => (
        <div>
          <span className="font-medium">{r.name}</span>
          {r.codigo_mercos && (
            <div className="text-xs text-gray-500 mt-1">
              🏷️ {r.codigo_mercos}
            </div>
          )}
        </div>
      )
    },
    { 
      key: "category", 
      header: "Categoria",
      render: (r) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {r.category}
        </span>
      )
    },
    { 
      key: "distribuidor", 
      header: "Distribuidor", 
      render: (r) => (
        <div className="text-sm">
          {r.distribuidor_id ? (
            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
              {r.distribuidor_nome}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs">
              Guia das Bancas
            </span>
          )}
        </div>
      )
    },
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
        actions={(
          <>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {bulkDeleting ? 'Excluindo...' : `Excluir Selecionados (${selectedIds.length})`}
              </button>
            )}
            <Link
              href="/admin/products/create"
              className="rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Novo Produto
            </Link>
          </>
        )}
        onReset={() => { setQ(""); setCategory(""); setStatus(""); setDistribuidor(""); }}
      >
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por nome..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
        <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">Todas categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <select value={distribuidor} onChange={(e)=>setDistribuidor(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">Todos distribuidores</option>
          <option value="admin">Guia das Bancas</option>
          {distribuidores.map((d) => (
            <option key={d.id} value={d.id}>{d.nome}</option>
          ))}
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
        onSelectRows={setSelectedIds}
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
