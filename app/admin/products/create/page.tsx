"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateProductCreate } from "../../../../lib/validators/product";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";

export default function AdminProductCreatePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const toast = useToast();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      // Converte previews base64 em URLs via upload
      const uploadedUrls: string[] = [];
      for (const src of images) {
        if (src.startsWith('data:')) {
          const blob = await (await fetch(src)).blob();
          const form = new FormData();
          form.append('file', blob, `img-${Date.now()}.png`);
          const up = await fetch('/api/upload', { method: 'POST', headers: { Authorization: 'Bearer admin-token' }, body: form });
          const upJson = await up.json();
          if (!up.ok || !upJson?.ok) throw new Error('Falha no upload de imagem');
          uploadedUrls.push(upJson.url);
        } else {
          uploadedUrls.push(src);
        }
      }
      const body = {
        name: (fd.get('name') as string)?.trim(),
        description: (fd.get('description') as string) || '',
        category_id: (fd.get('category') as string) || '',
        price: Number(fd.get('price') || 0),
        price_original: fd.get('price_original') ? Number(fd.get('price_original')) : undefined,
        stock_qty: fd.get('stock') ? Number(fd.get('stock')) : 0,
        track_stock: Boolean(fd.get('track_stock')),
        images: uploadedUrls,
        active: true,
      };
      if (!body.name || !body.category_id || !body.price) {
        throw new Error('Preencha nome, categoria e preço.');
      }
      const vr = validateProductCreate(body as any);
      if (!vr.ok) throw new Error(vr.error);
      const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vr.data) });
      if (!res.ok) throw new Error('Falha ao criar produto.');
      toast.success('Produto criado com sucesso');
      router.push('/admin/products');
    } catch (e: any) {
      setError(e?.message || 'Erro ao salvar.');
      toast.error(e?.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Novo Produto</h1>
        <p className="text-gray-600">Cadastre um novo produto no catálogo</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3 bg-white rounded-lg border p-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea name="description" rows={5} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
          </div>
          <div>
            <ImageUploader label="Imagens" multiple max={8} value={images} onChange={(_, previews)=>setImages(previews)} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-lg border p-4 space-y-2">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select name="category" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="">Selecione</option>
                <option value="c1">Padaria</option>
                <option value="c2">Revistas</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Preço</label>
                <input type="number" step="0.01" name="price" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="text-sm font-medium">Preço Original</label>
                <input type="number" step="0.01" name="price_original" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <input type="number" name="stock" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm"><input name="track_stock" type="checkbox" className="rounded"/> Controlar estoque</label>
              </div>
            </div>
            <div className="pt-2">
              <button disabled={saving} className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95">{saving? 'Salvando...' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
