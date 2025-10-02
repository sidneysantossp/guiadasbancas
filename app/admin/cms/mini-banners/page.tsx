"use client";

import { useEffect, useState } from "react";
import ImageUploadDragDrop from "@/components/admin/ImageUploadDragDrop";

type MiniBanner = {
  id: string;
  image_url: string;
  display_order: number;
  active: boolean;
};

export default function MiniBannersAdminPage() {
  const [items, setItems] = useState<MiniBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/mini-banners", {
        headers: { Authorization: "Bearer admin-token" },
        cache: "no-store",
      });
      const j = await res.json();
      if (j?.success) setItems(j.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createItem = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await fetch("/api/admin/mini-banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer admin-token",
        },
        body: JSON.stringify({ image_url: imageUrl, display_order: Number(displayOrder) || 0, active: true }),
      });
      const j = await res.json();
      if (!j?.success) throw new Error(j?.error || "Erro ao salvar");
      setImageUrl("");
      setDisplayOrder(0);
      await load();
    } catch (e: any) {
      setError(e?.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id: string, patch: Partial<MiniBanner>) => {
    const res = await fetch(`/api/admin/mini-banners/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer admin-token" },
      body: JSON.stringify(patch),
    });
    const j = await res.json();
    if (j?.success) await load();
  };

  const removeItem = async (id: string) => {
    if (!confirm("Excluir este mini banner?")) return;
    const res = await fetch(`/api/admin/mini-banners/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer admin-token" },
    });
    const j = await res.json();
    if (j?.success) await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mini Banners</h1>
        <p className="text-gray-600">Gerencie os mini banners rotativos exibidos abaixo de "Ofertas para você".</p>
      </div>

      {/* Create form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">Adicionar Mini Banner</h2>
        {error && <div className="rounded-md bg-red-50 text-red-800 px-3 py-2 text-sm">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ImageUploadDragDrop
              label="Imagem"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="https://exemplo.com/banner.jpg"
              className="h-40 w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ordem de exibição</label>
            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={createItem}
              disabled={saving || !imageUrl}
              className="mt-3 inline-flex items-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold">Itens</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-600">Carregando...</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={it.image_url} alt="mini banner" className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-700">Ordem: {it.display_order}</div>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={it.active}
                        onChange={(e) => updateItem(it.id, { active: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      Ativo
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    defaultValue={it.display_order}
                    onBlur={(e) => updateItem(it.id, { display_order: Number(e.target.value) || 0 })}
                    className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-8 text-center text-gray-500">Nenhum mini banner cadastrado</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
