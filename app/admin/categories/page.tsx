"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminCategoriesPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/categories?all=true`, { headers: { Authorization: "Bearer admin-token" } });
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        setRows(data.map((c: any) => ({ id: c.id, name: c.name, slug: (c.link || '').replace(/^\/+/, ''), order: c.order ?? 0, active: Boolean(c.active) })));
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => rows.filter(r => !q || r.name.toLowerCase().includes(q.toLowerCase())), [rows, q]);

  const columns: Column<any>[] = [
    { key: "name", header: "Nome", render: (r) => (
      <Link href={`/admin/categories/${r.id}` as Route} className="font-medium text-[#ff5c00] hover:underline">
        {r.name}
      </Link>
    ) },
    { key: "slug", header: "Slug", render: (r) => <span className="text-gray-500">{r.slug}</span> },
    { key: "order", header: "Ordem" },
    { key: "active", header: "Status", render: (r) => (
      <StatusBadge label={r.active ? 'Ativa' : 'Inativa'} tone={r.active ? 'emerald' : 'gray'} />
    ) },
    { key: "actions", header: "Ações", render: (r) => (
      <div className="flex gap-2">
        <Link
          href={`/admin/categories/${r.id}` as Route}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Editar
        </Link>
      </div>
    ) },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Categorias</h1>
        <p className="text-gray-600">Organize e gerencie as categorias</p>
      </div>

      <FiltersBar
        actions={<Link href={("/admin/categories/create") as Route} className="rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95">Nova Categoria</Link>}
        onReset={()=> setQ("")}
      >
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por nome..." className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
      </FiltersBar>

      {loading && <div className="p-4 text-sm text-gray-500">Carregando...</div>}

      <DataTable columns={columns} data={filtered} getId={(r)=>r.id} />
    </div>
  );
}
