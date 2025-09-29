"use client";

import { useEffect, useMemo, useState } from "react";

type AuditEntry = {
  id: string;
  at: string; // ISO
  action: string;
  by?: string;
  meta?: any;
};

const ACTION_LABELS: Record<string, string> = {
  approve_banca: "Aprovar banca",
  activate_banca: "Ativar banca",
  deactivate_banca: "Desativar banca",
  reorder_bancas_arrow: "Reordenar (setas)",
  reorder_bancas_dnd: "Reordenar (arrastar)",
  delete_banca: "Excluir banca",
};

export default function AdminAuditPage() {
  const [items, setItems] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string>("");
  const [from, setFrom] = useState<string>(""); // yyyy-mm-dd
  const [to, setTo] = useState<string>(""); // yyyy-mm-dd

  const fetchAll = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/audit', { cache: 'no-store' });
      const j = await res.json();
      if (!res.ok || !j?.ok) throw new Error(j?.error || 'Falha ao carregar');
      setItems(Array.isArray(j.data) ? j.data : []);
    } catch (e: any) {
      setError(e?.message || 'Erro');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const data = useMemo(() => {
    let arr = [...items];
    if (actionFilter) arr = arr.filter((x) => x.action === actionFilter);
    if (from) {
      const f = new Date(from + 'T00:00:00Z').getTime();
      arr = arr.filter((x) => new Date(x.at).getTime() >= f);
    }
    if (to) {
      const t = new Date(to + 'T23:59:59Z').getTime();
      arr = arr.filter((x) => new Date(x.at).getTime() <= t);
    }
    return arr.reverse();
  }, [items, actionFilter, from, to]);

  const actions = useMemo(() => {
    const keys = new Set(items.map(x => x.action));
    return Array.from(keys);
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Auditoria</h1>
          <p className="text-gray-600">Log de alterações e ações administrativas.</p>
        </div>
        <button onClick={fetchAll} className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-gray-50">
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-[12px] text-gray-700">Ação</label>
          <select value={actionFilter} onChange={(e)=>setActionFilter(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-sm">
            <option value="">Todas</option>
            {actions.map((a)=> (
              <option key={a} value={a}>{ACTION_LABELS[a] || a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] text-gray-700">De</label>
          <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-[12px] text-gray-700">Até</label>
          <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-sm" />
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Carregando...</div>}
      {error && <div className="text-sm text-rose-600">{error}</div>}

      {!loading && !error && (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-[12px] text-gray-700 font-medium">
            <div className="col-span-3">Quando</div>
            <div className="col-span-3">Ação</div>
            <div className="col-span-2">Usuário</div>
            <div className="col-span-4">Meta</div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.map((e) => (
              <div key={e.id} className="grid grid-cols-12 px-3 py-2 text-sm">
                <div className="col-span-3 text-gray-700">{new Date(e.at).toLocaleString()}</div>
                <div className="col-span-3 text-gray-900">{ACTION_LABELS[e.action] || e.action}</div>
                <div className="col-span-2 text-gray-600">{e.by || '-'}</div>
                <div className="col-span-4">
                  <pre className="text-[11px] text-gray-600 whitespace-pre-wrap break-all">{JSON.stringify(e.meta || {}, null, 2)}</pre>
                </div>
              </div>
            ))}
            {data.length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-600">Nenhum registro encontrado.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
