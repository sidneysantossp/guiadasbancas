"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState, useMemo } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminBancasPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/bancas');
        const json = await res.json();
        const items = Array.isArray(json) ? json : [];
        setRows(items.map((b: any) => ({ id: b.id, name: b.name, city: b.address?.split(',').pop()?.trim() || '—', status: b.active ? 'ativo' : 'pausado', updatedAt: '—' })));
      } catch (e) {
        // noop
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

  const columns: Column<any>[] = [
    { key: "name", header: "Nome", render: (r) => <span className="font-medium">{r.name}</span> },
    { key: "city", header: "Cidade" },
    { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} tone={r.status==='ativo'?'emerald':'gray'} /> },
    { key: "updatedAt", header: "Atualizado", render: (r) => <span className="text-gray-500">{r.updatedAt||'—'}</span> },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Bancas</h1>
        <p className="text-gray-600">Gerencie as bancas cadastradas</p>
      </div>

      <FiltersBar
        actions={<Link href={"/admin/bancas/create" as Route} className="rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95">Nova Banca</Link>}
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
  );
}
