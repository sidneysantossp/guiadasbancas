"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";

export default function SellerCouponCreatePage() {
  const router = useRouter();
  const toast = useToast();
  const [sellerId, setSellerId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingBanca, setLoadingBanca] = useState(true);

  useEffect(() => {
    // Buscar banca do jornaleiro via API autenticada
    const fetchBanca = async () => {
      try {
        const res = await fetch("/api/jornaleiro/banca", { cache: 'no-store' });
        const json = await res.json();
        const banca = json?.data;
        if (res.ok && banca?.id) {
          setSellerId(banca.id);
        } else {
          toast.error("Banca não encontrada. Cadastre sua banca primeiro.");
          router.push("/jornaleiro/banca");
        }
      } catch (err) {
        console.error('Erro ao buscar banca:', err);
        toast.error("Erro ao buscar dados da banca");
      } finally {
        setLoadingBanca(false);
      }
    };
    fetchBanca();
  }, [toast, router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      const body = {
        sellerId,
        title: String(fd.get("title") || "").trim(),
        code: String(fd.get("code") || "").trim().toUpperCase(),
        discountText: String(fd.get("discountText") || "").trim(),
        expiresAt: String(fd.get("expiresAt") || "") || undefined,
        active: Boolean(fd.get("active")),
        highlight: Boolean(fd.get("highlight")),
      } as any;

      if (!body.title || !body.code || !body.discountText) {
        throw new Error("Preencha Título, Código e Desconto");
      }

      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Falha ao criar cupom");
      toast.success("Cupom criado com sucesso");
      router.push("/jornaleiro/coupons");
    } catch (e: any) {
      const msg = e?.message || "Erro ao criar cupom";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingBanca) {
    return (
      <section className="container-max py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container-max py-6">
      <h1 className="text-xl font-semibold mb-4">Novo cupom</h1>
      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div>
            <label className="text-sm font-medium">Título</label>
            <input name="title" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Código</label>
              <input name="code" required placeholder="EX: BANCAX10" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase tracking-wider" />
            </div>
            <div>
              <label className="text-sm font-medium">Desconto (texto)</label>
              <input name="discountText" required placeholder="Ex: 10% OFF" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Validade (opcional)</label>
              <input type="date" name="expiresAt" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            </div>
            <div className="flex items-end gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="active" defaultChecked className="rounded" /> Ativo
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="highlight" className="rounded" /> Destacar
              </label>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            <div className="text-sm text-gray-700">Este cupom poderá aparecer em destaque no perfil da sua banca quando marcado como "Destacar" e ativo.</div>
            <button
              disabled={saving || !sellerId}
              className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >{saving ? "Salvando..." : "Salvar"}</button>
          </div>
        </div>
      </form>
    </section>
  );
}
