"use client";

import { useEffect, useMemo, useState } from "react";

// Tipos básicos
type Featured = {
  id: string;
  section_key: string;
  product_id: string;
  label?: string | null;
  order_index: number;
  active: boolean;
};

type ProductLite = {
  id: string;
  name: string;
  images?: string[];
};

type SectionDef = {
  key: string;
  title: string;
  hint?: string;
};

const SECTIONS: SectionDef[] = [
  { key: "topreviewed_ei", title: "Eletrônicos e Informática", hint: "Seção da Home (TopReviewed)" },
  // Você pode adicionar outras seções depois (ex.: trending, favoritos, etc.)
];

export default function AdminVitrinesPage() {
  const [section, setSection] = useState<string>(SECTIONS[0].key);
  const [items, setItems] = useState<Featured[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [newProductId, setNewProductId] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");

  // Opcional: cache simples de nomes/imagens para preview
  const [prodMap, setProdMap] = useState<Record<string, ProductLite>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/featured-products?section=${encodeURIComponent(section)}`, {
          headers: { Authorization: "Bearer admin-token" },
        });
        const j = await res.json();
        if (!res.ok || !j?.success) throw new Error(j?.error || "Falha ao listar");
        setItems(Array.isArray(j.data) ? j.data : []);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar vitrine");
      } finally {
        setLoading(false);
      }
    })();
  }, [section]);

  // Buscar dados básicos dos produtos para preview (nome/imagem)
  useEffect(() => {
    (async () => {
      const ids = items.map((it) => it.product_id).filter(Boolean);
      const toFetch = ids.filter((id) => !prodMap[id]);
      if (toFetch.length === 0) return;
      try {
        const res = await fetch(`/api/products?limit=100`, {
          headers: { Authorization: "Bearer admin-token" },
        });
        const j = await res.json();
        const list: any[] = Array.isArray(j?.items) ? j.items : [];
        const map = Object.fromEntries(
          list
            .filter((p) => ids.includes(p.id))
            .map((p) => [p.id, { id: p.id, name: p.name, images: p.images }])
        );
        setProdMap((prev) => ({ ...prev, ...map }));
      } catch {}
    })();
  }, [items]);

  const addItem = async () => {
    if (!newProductId.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/featured-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer admin-token" },
        body: JSON.stringify({ section_key: section, product_id: newProductId.trim(), label: newLabel || null }),
      });
      const j = await res.json();
      if (!res.ok || !j?.success) throw new Error(j?.error || "Falha ao adicionar");
      setItems((prev) => [...prev, j.data]);
      setNewProductId("");
      setNewLabel("");
    } catch (e: any) {
      alert(e?.message || "Erro ao adicionar produto");
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id: string, patch: Partial<Pick<Featured, "label" | "order_index" | "active">>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/featured-products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer admin-token" },
        body: JSON.stringify({ id, ...patch }),
      });
      const j = await res.json();
      if (!res.ok || !j?.success) throw new Error(j?.error || "Falha ao atualizar");
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } as any : it)));
    } catch (e: any) {
      alert(e?.message || "Erro ao atualizar");
    } finally {
      setSaving(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!confirm("Remover item desta vitrine?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/featured-products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer admin-token" },
      });
      const j = await res.json();
      if (!res.ok || !j?.success) throw new Error(j?.error || "Falha ao remover");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: any) {
      alert(e?.message || "Erro ao remover");
    } finally {
      setSaving(false);
    }
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === id);
    if (idx < 0) return;
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const swapped = [...items];
    const a = swapped[idx];
    const b = swapped[target];
    swapped[idx] = { ...a, order_index: b.order_index } as Featured;
    swapped[target] = { ...b, order_index: a.order_index } as Featured;
    setItems(swapped);
    // Persistir ordem rapidamente
    updateItem(a.id, { order_index: swapped[idx].order_index });
    updateItem(b.id, { order_index: swapped[target].order_index });
  };

  const productName = (pid: string) => prodMap[pid]?.name || pid;
  const productImage = (pid: string) => (prodMap[pid]?.images?.[0]) || "https://placehold.co/80x80/e5e7eb/666666?text=IMG";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vitrines da Home</h1>
          <p className="text-gray-600">Gerencie os produtos curados exibidos em seções específicas</p>
        </div>
      </div>

      {/* Seletor de seção */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
        <label className="text-sm text-gray-700">Seção</label>
        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {SECTIONS.map((s) => (
            <option key={s.key} value={s.key}>{s.title}</option>
          ))}
        </select>
        {SECTIONS.find((s) => s.key === section)?.hint && (
          <span className="text-xs text-gray-500">{SECTIONS.find((s) => s.key === section)?.hint}</span>
        )}
      </div>

      {/* Lista de itens */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Produtos desta Vitrine</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="ID do produto (UUID)"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
            />
            <input
              type="text"
              placeholder="Rótulo opcional (ex.: -20%)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm w-48"
            />
            <button
              onClick={addItem}
              disabled={saving || !newProductId.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Carregando...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((it, idx) => (
              <div key={it.id} className="p-4 flex items-center gap-3">
                {/* Imagem */}
                <div className="h-16 w-16 rounded-md overflow-hidden border border-gray-200 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productImage(it.product_id)} alt={productName(it.product_id)} className="h-full w-full object-cover" />
                </div>
                {/* Nome e metadados */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{productName(it.product_id)}</div>
                  <div className="text-xs text-gray-500 truncate">{it.product_id}</div>
                </div>
                {/* Label */}
                <div>
                  <input
                    type="text"
                    placeholder="Label"
                    defaultValue={it.label || ''}
                    onBlur={(e) => {
                      if (e.target.value !== (it.label || '')) updateItem(it.id, { label: e.target.value || null as any });
                    }}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm w-36"
                  />
                </div>
                {/* Ordem */}
                <div className="flex items-center gap-1">
                  <button onClick={() => move(it.id, -1)} className="p-1 text-gray-500 hover:text-gray-800" title="Subir">▲</button>
                  <span className="text-sm w-6 text-center">{it.order_index}</span>
                  <button onClick={() => move(it.id, 1)} className="p-1 text-gray-500 hover:text-gray-800" title="Descer">▼</button>
                </div>
                {/* Ativo */}
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    defaultChecked={it.active}
                    onChange={(e) => updateItem(it.id, { active: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  Ativo
                </label>
                {/* Remover */}
                <button
                  onClick={() => removeItem(it.id)}
                  className="ml-2 inline-flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100"
                >
                  Remover
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-6 text-sm text-gray-500">Nenhum produto nesta vitrine.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
