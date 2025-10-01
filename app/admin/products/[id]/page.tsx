"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { validateProductUpdate } from "../../../../lib/validators/product";
import ImageUploader from "@/components/admin/ImageUploader";
import { useToast } from "@/components/admin/ToastProvider";

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = String(params?.id || "");
        const res = await fetch(`/api/admin/products/${id}`, {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        if (!res.ok) throw new Error("Não foi possível carregar o produto.");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Erro ao carregar produto");
        const productData = json.data;
        const mapped = {
          id: productData.id,
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price ?? 0,
          price_original: productData.price_original ?? "",
          category_id: productData.category_id || "",
          stock_qty: productData.stock_qty ?? 0,
          track_stock: Boolean(productData.track_stock),
        };
        setProduct(mapped);
        setImages(Array.isArray(productData.images) ? productData.images : []);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.id]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      // Upload de imagens (previews base64) para obter URLs
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
      };
      if (!body.name || !body.category_id || !body.price) {
        throw new Error('Preencha nome, categoria e preço.');
      }
      const vr = validateProductUpdate(body as any);
      if (!vr.ok) throw new Error(vr.error);
      const id = String(params?.id || "");
      const res = await fetch(`/api/admin/products/${id}`, { 
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        }, 
        body: JSON.stringify(vr.data) 
      });
      if (!res.ok) throw new Error('Falha ao salvar produto.');
      toast.success('Produto atualizado com sucesso');
      router.push('/admin/products');
    } catch (e: any) {
      setError(e?.message || 'Erro ao salvar.');
      toast.error(e?.message || 'Erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error && !product) return <div className="text-red-600">{error}</div>;
  if (!product) return null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Editar Produto</h1>
        <p className="text-gray-600">Atualize as informações do produto</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3 bg-white rounded-lg border p-4">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input defaultValue={product.name} name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
          </div>
          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea defaultValue={product.description} name="description" rows={5} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
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
              <select defaultValue={product.category_id} name="category" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="c1">Padaria</option>
                <option value="c2">Revistas</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Preço</label>
                <input type="number" step="0.01" defaultValue={product.price} name="price" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
              </div>
              <div>
                <label className="text-sm font-medium">Preço Original</label>
                <input type="number" step="0.01" defaultValue={product.price_original} name="price_original" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <input type="number" defaultValue={product.stock_qty} name="stock" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"/>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm"><input defaultChecked={product.track_stock} name="track_stock" type="checkbox" className="rounded"/> Controlar estoque</label>
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
