"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`, {
          headers: { 'Authorization': 'Bearer admin-token' }
        });
        
        if (!res.ok) {
          throw new Error('Produto não encontrado');
        }
        
        const json = await res.json();
        setProduct(json.data);
      } catch (error: any) {
        toast.error(error.message || 'Erro ao carregar produto');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, router, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData(e.currentTarget);
      
      const body = {
        name: (fd.get("name") as string)?.trim(),
        description: (fd.get("description") as string) || "",
        price: Number(fd.get("price") || 0),
        stock_qty: fd.get("stock") ? Number(fd.get("stock")) : 0,
        track_stock: Boolean(fd.get("track_stock")),
        codigo_mercos: (fd.get("codigo_mercos") as string)?.trim() || null,
      };

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer admin-token"
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar produto");
      }

      toast.success("Produto atualizado com sucesso!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-600">Carregando produto...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Editar Produto</h1>
        <p className="text-sm text-gray-600">Atualize as informações do produto.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
          <div>
            <label className="text-sm font-medium">Nome do Produto</label>
            <input 
              name="name" 
              required 
              defaultValue={product.name}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <textarea 
              name="description" 
              rows={3} 
              defaultValue={product.description}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Preço (R$)</label>
              <input 
                type="number" 
                step="0.01" 
                name="price" 
                required 
                defaultValue={product.price}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
              />
            </div>

            <div>
              <label className="text-sm font-medium">Estoque</label>
              <input 
                type="number" 
                name="stock" 
                defaultValue={product.stock_qty || 0}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Código Mercos</label>
            <input 
              name="codigo_mercos" 
              placeholder="Ex: AKOTO001"
              defaultValue={product.codigo_mercos || ''}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase"
              onChange={(e) => e.target.value = e.target.value.toUpperCase()}
            />
            <p className="text-xs text-gray-500 mt-1">Código único para vinculação de imagens</p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              name="track_stock" 
              type="checkbox" 
              defaultChecked={product.track_stock}
              className="rounded" 
            />
            <label className="text-sm">Controlar estoque</label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-70"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
