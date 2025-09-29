"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import FiltersBar from "@/components/admin/FiltersBar";
import DataTable, { type Column } from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/ToastProvider";

export default function AdminOrdersPage() {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchRows = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (q) params.set("q", q);
      const res = await fetch(`/api/orders?${params.toString()}`);
      const json = await res.json();
      setRows(Array.isArray(json?.items) ? json.items : []);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q]);

  const filtered = useMemo(() => rows, [rows]);

  const advanceStatus = async (id: string) => {
    try {
      const order = rows.find(r => r.id === id);
      if (!order) return;
      const flow = ["novo","confirmado","em_preparo","saiu_para_entrega","entregue"] as const;
      const idx = flow.indexOf(order.status as any);
      const next = idx >= 0 && idx < flow.length - 1 ? flow[idx+1] : order.status;
      const res = await fetch('/api/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: next }) });
      if (res.ok) {
        toast.success('Status do pedido atualizado');
        fetchRows();
      } else {
        toast.error('Falha ao atualizar status');
      }
    } catch (e:any) {
      toast.error(e?.message || 'Erro ao atualizar status');
    }
  };

  const statusTone = (s: string): "amber" | "blue" | "orange" | "emerald" | "red" | "gray" => {
    switch (s) {
      case 'novo': return 'amber';
      case 'confirmado': return 'blue';
      case 'em_preparo': return 'orange';
      case 'saiu_para_entrega': return 'blue';
      case 'entregue': return 'emerald';
      case 'cancelado': return 'red';
      default: return 'gray';
    }
  };

  const columns: Column<any>[] = [
    { key: "id", header: "Pedido", render: (r) => <span className="font-medium">#{r.id}</span> },
    { key: "customer", header: "Cliente" },
    { key: "status", header: "Status", render: (r) => <StatusBadge label={r.status} tone={statusTone(r.status)} /> },
    { key: "total", header: "Total", render: (r) => <>R$ {Number(r.total||0).toFixed(2)}</> },
    { key: "createdAt", header: "Criado", render: (r) => <span className="text-gray-500">{r.createdAt}</span> },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Pedidos</h1>
        <p className="text-gray-600">Acompanhe e gerencie os pedidos da banca</p>
      </div>

      <FiltersBar onReset={()=>{ setQ(""); setStatus(""); }}>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por #id ou cliente" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
        <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
          <option value="">Todos status</option>
          <option value="novo">Novo</option>
          <option value="confirmado">Confirmado</option>
          <option value="em_preparo">Em preparo</option>
          <option value="saiu_para_entrega">Saiu para entrega</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </FiltersBar>

      {loading && <div className="p-4 text-sm text-gray-500">Carregando...</div>}

      <DataTable
        columns={columns}
        data={filtered}
        getId={(r)=>r.id}
        renderActions={(r)=> (
          <div className="space-x-2">
            <Link href={( `/admin/orders/${r.id}` ) as Route} className="text-[#ff5c00] font-medium">Ver</Link>
            <button onClick={()=>advanceStatus(r.id)} className="text-gray-500 hover:text-gray-700">Avançar status</button>
          </div>
        )}
      />
    </div>
  );
}
