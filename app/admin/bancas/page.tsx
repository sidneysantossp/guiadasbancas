"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, useMemo } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { IconExternalLink, IconEye, IconPencil } from "@tabler/icons-react";

type TabKey = "overview" | "list" | "settings";

export default function AdminBancasPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("list");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/bancas?all=true');
        const json = await res.json();
        const items = json.success && Array.isArray(json.data) ? json.data : [];
        setRows(items.map((b: any) => ({ 
          id: b.id,
          name: b.name,
          cover: b.cover || b.avatar || "",
          city: b.address?.split(',').pop()?.trim() || b.addressObj?.city || '—', 
          status: b.active ? 'ativo' : 'pausado', 
          updatedAt: b.createdAt ? new Date(b.createdAt).toLocaleDateString('pt-BR') : '—' 
        })));
      } catch (e) {
        console.error('Erro ao carregar bancas:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => rows.filter(r =>
    (!q || r.name.toLowerCase().includes(q.toLowerCase())) &&
    (!city || r.city === city) &&
    (!status || r.status === status)
  ), [rows, q, city, status]);

  const metrics = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.status === 'ativo').length;
    const inactive = rows.filter((r) => r.status !== 'ativo').length;
    return { total, active, inactive };
  }, [rows]);

  const toggleStatus = async (row: any) => {
    try {
      const newStatus = row.status !== 'ativo';
      const res = await fetch('/api/admin/bancas', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token',
        },
        body: JSON.stringify({
          data: {
            id: row.id,
            name: row.name,
            active: newStatus,
          },
        }),
      });

      if (!res.ok) {
        console.error('Erro ao alterar status da banca');
        return;
      }

      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? { ...r, status: newStatus ? 'ativo' : 'pausado' }
            : r
        )
      );
    } catch (error) {
      console.error('Erro ao alterar status da banca:', error);
    }
  };

  const columns: Column<any>[] = [
    {
      key: "name",
      header: "Nome",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
            {r.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.cover} alt={r.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-200" />
            )}
          </div>
          <span className="font-medium text-gray-900">{r.name}</span>
        </div>
      ),
    },
    { key: "city", header: "Cidade" },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <div className="flex items-center justify-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={r.status === 'ativo'}
              onChange={() => toggleStatus(r)}
              className="sr-only"
            />
            <div
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                r.status === 'ativo' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  r.status === 'ativo' ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </div>
          </label>
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Atualizado",
      render: (r) => <span className="text-gray-500">{r.updatedAt || '—'}</span>,
    },
    {
      key: "actions",
      header: "Ações",
      render: (r) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/cms/bancas/${r.id}` as Route}
            className="inline-flex items-center justify-center rounded-md bg-blue-600 p-1.5 text-white hover:bg-blue-700"
            title="Editar banca (CMS)"
          >
            <IconPencil size={16} />
          </Link>
          <Link
            href={`/banca/${r.id}` as Route}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md bg-orange-500 p-1.5 text-white hover:bg-orange-600"
            title="Ver página pública da banca"
          >
            <IconEye size={16} />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Bancas</h1>
          <p className="text-gray-600">Gestão centralizada das bancas cadastradas na plataforma.</p>
        </div>
        <Link
          href={"/admin/bancas/create" as Route}
          className="rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Nova Banca
        </Link>
      </div>

      {/* Abas principais */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4 text-sm" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`whitespace-nowrap border-b-2 px-3 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "border-[#ff5c00] text-[#ff5c00]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Visão geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className={`whitespace-nowrap border-b-2 px-3 py-2 font-medium transition-colors ${
              activeTab === "list"
                ? "border-[#ff5c00] text-[#ff5c00]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Lista de bancas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`whitespace-nowrap border-b-2 px-3 py-2 font-medium transition-colors ${
              activeTab === "settings"
                ? "border-[#ff5c00] text-[#ff5c00]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Configurações
          </button>
        </nav>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Filtros rápidos no topo (placeholder para filtros mais avançados) */}
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Cidade</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>Todas as cidades</option>
                <option>São Paulo - SP</option>
                <option>Outras</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>Todos os status</option>
                <option>Ativas</option>
                <option>Inativas</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white">
                <option>Todas</option>
                <option>Cotistas</option>
                <option>Não cotistas</option>
              </select>
            </div>
          </div>

          {/* Cards de métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg bg-blue-50 px-4 py-3 border border-blue-100">
              <p className="text-xs font-medium text-blue-800 uppercase tracking-wide">Total de bancas</p>
              <p className="mt-2 text-2xl font-bold text-blue-900">{metrics.total}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-4 py-3 border border-emerald-100">
              <p className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Bancas ativas</p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">{metrics.active}</p>
            </div>
            <div className="rounded-lg bg-red-50 px-4 py-3 border border-red-100">
              <p className="text-xs font-medium text-red-800 uppercase tracking-wide">Bancas inativas</p>
              <p className="mt-2 text-2xl font-bold text-red-900">{metrics.inactive}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Esses números são calculados com base na mesma fonte de dados da lista de bancas.
            Podemos expandir esta visão com métricas de pedidos, faturamento por banca e
            status de aprovação em etapas futuras.
          </p>
        </div>
      )}

      {activeTab === "list" && (
        <div className="space-y-4">
          <FiltersBar
            actions={null}
            onReset={()=>{ setQ(""); setCity(""); setStatus(""); }}
          >
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por nome..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
            <select value={city} onChange={(e)=>setCity(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Todas cidades</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
            </select>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
              <option value="">Todos status</option>
              <option value="ativo">Ativo</option>
              <option value="pausado">Pausado</option>
              <option value="aprovacao">Em aprovação</option>
            </select>
          </FiltersBar>

          {loading && <div className="p-4 text-sm text-gray-500">Carregando...</div>}

          <DataTable columns={columns} data={filtered} getId={(r)=>r.id} />
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Nesta aba vamos concentrar configurações operacionais avançadas relacionadas
            às bancas, como regras globais de visibilidade de produtos de distribuidores,
            critérios de aprovação, limites de operação e outras opções técnicas do
            backoffice. Tudo que for de layout/aparência das bancas fica centralizado em
            Configurações de Frontend.
          </p>
        </div>
      )}
    </div>
  );
}
