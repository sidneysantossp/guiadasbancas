"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Coupon = {
  id: string;
  sellerId: string;
  title: string;
  code: string;
  discountText: string;
  active: boolean;
  highlight: boolean;
  expiresAt?: string;
  createdAt: string;
};

export default function SellerCouponsPage() {
  const [sellerId, setSellerId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Coupon[]>([]);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    // Obter ID real da banca via endpoint autenticado
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? (window.localStorage.getItem("gb:sellerToken") || "seller-token") : "seller-token";
        const res = await fetch("/api/jornaleiro/banca", { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const json = await res.json();
        const banca = json?.data;
        if (res.ok && banca?.id) setSellerId(banca.id);
        else setSellerId("");
      } catch {
        setSellerId("");
      }
    })();
  }, []);

  const load = async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/coupons?sellerId=${encodeURIComponent(sellerId)}&active=false`, { cache: "no-store" });
      const j = await res.json();
      if (j?.ok) setList(j.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [sellerId]);

  const activeCount = useMemo(() => list.filter(c=>c.active).length, [list]);

  const toggleActive = async (c: Coupon) => {
    try {
      await fetch(`/api/coupons/${c.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !c.active })
      });
      await load();
    } catch {}
  };

  const setHighlight = async (c: Coupon) => {
    try {
      await fetch(`/api/coupons/${c.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highlight: true, active: true })
      });
      setMsg("Cupom destacado no banner");
      setTimeout(()=>setMsg(""), 2000);
      await load();
    } catch {}
  };

  const remove = async (c: Coupon) => {
    if (!confirm(`Excluir cupom ${c.code}?`)) return;
    try {
      await fetch(`/api/coupons/${c.id}`, { method: 'DELETE' });
      await load();
    } catch {}
  };

  return (
    <section className="container-max py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Meus Cupons</h1>
        <Link href="/jornaleiro/coupons/new" className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Novo cupom</Link>
      </div>

      {msg && <div className="mb-3 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 text-sm px-3 py-2">{msg}</div>}

      {loading ? (
        <div className="text-sm text-gray-600">Carregando...</div>
      ) : list.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-600">Nenhum cupom cadastrado.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Título</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Código</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Desconto</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Ativo</th>
                <th className="text-left px-3 py-2 font-medium text-gray-700">Destaque</th>
                <th className="text-right px-3 py-2 font-medium text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">{c.title}</td>
                  <td className="px-3 py-2 font-semibold tracking-wider">{c.code}</td>
                  <td className="px-3 py-2">{c.discountText}</td>
                  <td className="px-3 py-2">{c.active ? 'Sim' : 'Não'}</td>
                  <td className="px-3 py-2">{c.highlight ? 'Sim' : 'Não'}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={()=>toggleActive(c)} className="rounded-md border border-gray-300 bg-white px-3 py-1 hover:bg-gray-50">{c.active ? 'Desativar' : 'Ativar'}</button>
                      <button onClick={()=>setHighlight(c)} className="rounded-md border border-[#ffb48a] bg-[#fff3eb] text-[#ff5c00] px-3 py-1 hover:bg-[#ffe6d7]">Destacar</button>
                      <button onClick={()=>remove(c)} className="rounded-md border border-rose-300 bg-rose-50 text-rose-700 px-3 py-1 hover:bg-rose-100">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">Ativos: {activeCount} / Total: {list.length}</div>
    </section>
  );
}
