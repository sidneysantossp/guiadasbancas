"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { validateProductUpdate } from "@/lib/validators/product";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductImageUploader from "@/components/admin/ProductImageUploader";
import ImageSizeGuide from "@/components/admin/ImageSizeGuide";
import VideoTutorial from "@/components/admin/VideoTutorial";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SpecificationsEditor from "@/components/admin/SpecificationsEditor";
import ReviewsManager from "@/components/admin/ReviewsManager";
import { useToast } from "@/components/admin/ToastProvider";

interface CategoryOption {
  id: string;
  name: string;
}

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [canFeature, setCanFeature] = useState(true);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [descriptionFull, setDescriptionFull] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [allowReviews, setAllowReviews] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para contexto da IA
  const [productName, setProductName] = useState("");
  const [productMiniDesc, setProductMiniDesc] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = String(params?.id || "");
        if (!id) throw new Error("Produto inválido");
        
        const res = await fetch(`/api/admin/products/${id}`, {
          headers: {
            'Authorization': 'Bearer admin-token'
          }
        });
        if (!res.ok) throw new Error("Não foi possível carregar o produto.");
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Erro ao carregar produto");
        const productData = json.data;
        
        setProduct(productData);
        setProductName(productData.name || "");
        setProductMiniDesc(productData.description || "");
        setImages(Array.isArray(productData.images) ? productData.images : []);
        setDescriptionFull(productData.description_full || "");
        setSpecifications(productData.specifications || "");
        setAllowReviews(productData.allow_reviews !== false);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    };
    
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const json = await res.json();
        if (json?.success) {
          setCategories((json.data as any[])?.map((c) => ({ id: c.id, name: c.name })) || []);
        }
      } catch (e: any) {
        toast.error(e?.message || "Não foi possível carregar categorias");
      }
    };
    
    loadProduct();
    loadCategories();
  }, [params?.id, toast]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const uploadedUrls: string[] = [];
      
      // Upload das imagens principais
      for (const src of images) {
        if (src.startsWith("data:")) {
          const blob = await (await fetch(src)).blob();
          const form = new FormData();
          form.append("file", blob, `img-${Date.now()}.png`);
          const up = await fetch("/api/upload", {
            method: "POST",
            headers: { Authorization: "Bearer admin-token" },
            body: form,
          });
          const upJson = await up.json();
          if (!up.ok || !upJson?.ok) throw new Error("Falha no upload de imagem");
          uploadedUrls.push(upJson.url);
        } else {
          uploadedUrls.push(src);
        }
      }

      const body = {
        name: (fd.get("name") as string)?.trim(),
        description: (fd.get("description") as string) || "",
        category_id: (fd.get("category") as string)?.trim() || null,
        price: Number(fd.get("price") || 0),
        price_original: fd.get("price_original") ? Number(fd.get("price_original")) : undefined,
        discount_percent: fd.get("discount_percent") ? Number(fd.get("discount_percent")) : undefined,
        stock_qty: fd.get("stock") ? Number(fd.get("stock")) : 0,
        track_stock: Boolean(fd.get("track_stock")),
        featured: Boolean(fd.get("featured")),
        images: uploadedUrls,
        active: Boolean(fd.get("active")),
        sob_encomenda: Boolean(fd.get("sob_encomenda")),
        pre_venda: Boolean(fd.get("pre_venda")),
        pronta_entrega: Boolean(fd.get("pronta_entrega")),
        coupon_code: (fd.get("coupon_code") as string)?.trim() || undefined,
        description_full: descriptionFull,
        specifications: specifications,
        gallery_images: product?.gallery_images || [],
        allow_reviews: allowReviews,
      };

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
      const message = e?.message || 'Erro ao salvar.';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-500">Carregando produto...</div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Editar produto</h1>
        <p className="text-sm text-gray-600">Edite as informações do produto.</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="text-sm font-medium">Nome do Produto</label>
            <input 
              name="name" 
              required 
              defaultValue={product?.name || ""} 
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mini Descrição</label>
            <textarea 
              name="description" 
              rows={3} 
              placeholder="Descrição breve que aparece no card do produto" 
              defaultValue={product?.description || ""} 
              onChange={(e) => setProductMiniDesc(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
            />
          </div>
          
          <div>
            <RichTextEditor
              label="Descrição Completa"
              value={descriptionFull}
              onChange={setDescriptionFull}
              placeholder="Descrição detalhada que aparece na página do produto..."
              aiContext={{
                productName: productName,
                productDescription: productMiniDesc
              }}
            />
          </div>
          
          <div>
            <SpecificationsEditor
              value={specifications}
              onChange={setSpecifications}
            />
          </div>
          <div>
            <ProductImageUploader 
              images={images} 
              onChange={setImages}
              maxImages={4}
            />
          </div>
          
        </div>

        <div className="space-y-3">
          {/* Tutorial em vídeo */}
          <VideoTutorial 
            title="Como Editar um Produto"
            videoId="dQw4w9WgXcQ"
            description="Aprenda passo a passo como editar produtos da banca"
          />
          
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
            <div>
              <label className="text-sm font-medium">Categoria (Opcional)</label>
              <select 
                name="category" 
                defaultValue={product?.category_id || ""} 
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                required={false}
                aria-required="false"
              >
                <option value="">-- Sem categoria --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">💡 Deixe em branco se não se aplicar (para produtos da homologação Mercos)</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Preço</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="price" 
                  required 
                  defaultValue={product?.price || ""} 
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preço original</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="price_original" 
                  defaultValue={product?.price_original || ""} 
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Desconto (%)</label>
                <input 
                  type="number" 
                  step="1" 
                  min={0} 
                  max={100} 
                  name="discount_percent" 
                  defaultValue={product?.discount_percent || ""} 
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cupom</label>
                <input 
                  name="coupon_code" 
                  placeholder="EX: BANCAX10" 
                  defaultValue={product?.coupon_code || ""} 
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <input 
                  type="number" 
                  name="stock" 
                  defaultValue={product?.stock_qty || ""} 
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input 
                    name="track_stock" 
                    type="checkbox" 
                    defaultChecked={product?.track_stock || false} 
                    className="rounded" 
                  /> Controlar estoque
                </label>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200 space-y-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input 
                  name="active" 
                  type="checkbox" 
                  defaultChecked={product?.active !== false} 
                  className="rounded" 
                /> Produto ativo
              </label>
              
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">📦 Disponibilidade</div>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input 
                      name="pronta_entrega" 
                      type="checkbox" 
                      defaultChecked={product?.pronta_entrega || false} 
                      className="rounded text-green-600" 
                    /> 
                    <span className="text-green-700">✅ Pronta Entrega</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input 
                      name="sob_encomenda" 
                      type="checkbox" 
                      defaultChecked={product?.sob_encomenda || false} 
                      className="rounded text-blue-600" 
                    /> 
                    <span className="text-blue-700">📋 Sob Encomenda</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input 
                      name="pre_venda" 
                      type="checkbox" 
                      defaultChecked={product?.pre_venda || false} 
                      className="rounded text-purple-600" 
                    /> 
                    <span className="text-purple-700">🔮 Pré-Venda</span>
                  </label>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Selecione as opções de disponibilidade que se aplicam ao produto
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <label className="inline-flex items-start gap-3 text-sm">
                <input 
                  name="featured" 
                  type="checkbox" 
                  defaultChecked={product?.featured || false} 
                  className="rounded mt-0.5" 
                  disabled={!canFeature}
                />
                <div>
                  <div className="font-medium text-gray-900">🔥 Destacar em "Ofertas e Promoções"</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Produto aparecerá na seção especial da vitrine da banca.
                    <br />
                    <span className={`font-medium ${canFeature ? 'text-green-600' : 'text-amber-600'}`}>
                      {canFeature 
                        ? `✅ ${8 - featuredCount} vagas disponíveis de 8` 
                        : '⚠️ Limite de 8 produtos atingido! Desative algum produto abaixo.'
                      }
                    </span>
                  </div>
                </div>
              </label>
            </div>
            
            <div className="pt-2">
              <button
                disabled={saving}
                className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
          
          {/* Gestão de avaliações */}
          <ReviewsManager
            allowReviews={allowReviews}
            onAllowReviewsChange={setAllowReviews}
          />
        </div>
      </form>

      {/* Informações sobre produtos em destaque */}
      <div className="mt-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">🔥 Produtos em Destaque</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Marque produtos como destaque (máximo 8 por banca)</p>
            <p>• Produtos destacados aparecem na seção "Ofertas e Promoções"</p>
            <p>• Gerencie os destaques na listagem de produtos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
