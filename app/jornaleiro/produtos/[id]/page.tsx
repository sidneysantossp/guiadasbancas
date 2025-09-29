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

export default function SellerProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  
  const authHeaders = useMemo(() => {
    if (typeof window === "undefined") return {} as Record<string, string>;
    const token = window.localStorage.getItem("gb:sellerToken") || "seller-token";
    return { Authorization: `Bearer ${token}` } as Record<string, string>;
  }, []);

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const id = String(params?.id || "");
        if (!id) throw new Error("Produto inválido");
        
        console.log("Carregando produto ID:", id);
        console.log("Headers:", authHeaders);
        
        // Timeout de 10 segundos
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const res = await fetch(`/api/jornaleiro/products/${id}`, { 
          headers: authHeaders, 
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Error response:", errorText);
          throw new Error("Não foi possível carregar o produto.");
        }
        
        const json = await res.json();
        console.log("Response JSON:", json);
        const p = json?.data || json;
        
        if (!p || !p.id) {
          throw new Error("Dados do produto inválidos");
        }
        
        setProduct({
          id: p.id,
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? 0,
          price_original: p.price_original ?? "",
          discount_percent: p.discount_percent ?? "",
          coupon_code: p.coupon_code || "",
          category_id: p.category_id || "",
          stock_qty: p.stock_qty ?? 0,
          track_stock: Boolean(p.track_stock),
          featured: Boolean(p.featured),
          active: Boolean(p.active),
          sob_encomenda: Boolean(p.sob_encomenda),
          pre_venda: Boolean(p.pre_venda),
          pronta_entrega: Boolean(p.pronta_entrega),
        });
        setImages(Array.isArray(p.images) ? p.images : []);
        setDescriptionFull(p.description_full || "");
        setSpecifications(p.specifications || "");
        setAllowReviews(Boolean(p.allow_reviews));
      } catch (e: any) {
        let message = e?.message || "Erro ao carregar produto.";
        if (e.name === 'AbortError') {
          message = "Timeout: A requisição demorou muito para responder.";
        }
        console.error("Erro ao carregar produto:", e);
        setError(message);
        toast.error(message);
        
        // Se o produto não foi encontrado, redirecionar para listagem
        if (message.includes("não encontrado") || message.includes("inválido")) {
          setTimeout(() => {
            router.push("/jornaleiro/produtos");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [params?.id, toast, authHeaders]);

  useEffect(() => {
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
    loadCategories();
  }, [toast]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
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
        gallery_images: [],
        allow_reviews: allowReviews,
      };

      const vr = validateProductUpdate(body as any);
      if (!vr.ok) throw new Error(vr.error);
      const res = await fetch(`/api/jornaleiro/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(vr.data),
      });
      if (!res.ok) throw new Error("Falha ao salvar produto.");
      toast.success("Produto atualizado com sucesso");
      router.push("/jornaleiro/produtos");
    } catch (e: any) {
      const message = e?.message || "Erro ao salvar.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
        <div className="text-lg font-medium mt-4">Carregando produto...</div>
        <div className="text-sm text-gray-500 mt-1">ID: {params?.id}</div>
        <div className="mt-4 space-x-2">
          <button 
            onClick={() => router.push("/jornaleiro/produtos")}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            ← Voltar para listagem
          </button>
          <button 
            onClick={() => router.push("/jornaleiro/produtos/create")}
            className="px-4 py-2 text-sm bg-[#ff5c00] text-white hover:opacity-90 rounded-md transition-colors"
          >
            + Criar produto
          </button>
        </div>
      </div>
    </div>
  );
  
  if (error && !product) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-lg font-medium text-red-600">Erro ao carregar produto</div>
        <div className="text-sm text-gray-500 mt-1">{error}</div>
        <button 
          onClick={() => router.push("/jornaleiro/produtos")}
          className="mt-4 px-4 py-2 bg-[#ff5c00] text-white rounded-md hover:opacity-95"
        >
          Voltar para produtos
        </button>
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-lg font-medium text-gray-600">Produto não encontrado</div>
        <div className="text-sm text-gray-500 mt-1">O produto pode ter sido removido</div>
        <button 
          onClick={() => router.push("/jornaleiro/produtos")}
          className="mt-4 px-4 py-2 bg-[#ff5c00] text-white rounded-md hover:opacity-95"
        >
          Voltar para produtos
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Editar produto</h1>
        <p className="text-sm text-gray-600">Atualize as informações do produto.</p>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="text-sm font-medium">Nome do Produto</label>
            <input defaultValue={product.name} name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Mini Descrição</label>
            <textarea defaultValue={product.description} name="description" rows={3} placeholder="Descrição breve que aparece no card do produto" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          
          <div>
            <RichTextEditor
              label="Descrição Completa"
              value={descriptionFull}
              onChange={setDescriptionFull}
              placeholder="Descrição detalhada que aparece na página do produto..."
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
            title="ACADEMY GUIA DAS BANCAS"
            videoId="dQw4w9WgXcQ"
          />
          
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select defaultValue={product.category_id} name="category" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                {categories.length === 0 ? <option value="">Selecione</option> : null}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Preço</label>
                <input defaultValue={product.price} type="number" step="0.01" name="price" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Preço original</label>
                <input defaultValue={product.price_original} type="number" step="0.01" name="price_original" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Desconto (%)</label>
                <input type="number" step="1" min={0} max={100} defaultValue={product.discount_percent} name="discount_percent" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Cupom</label>
                <input defaultValue={product.coupon_code} name="coupon_code" placeholder="EX: BANCAX10" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <input defaultValue={product.stock_qty} type="number" name="stock" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input defaultChecked={product.track_stock} name="track_stock" type="checkbox" className="rounded" /> Controlar estoque
                </label>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <label className="inline-flex items-start gap-3 text-sm">
                <input 
                  defaultChecked={product.featured} 
                  name="featured" 
                  type="checkbox" 
                  className="rounded mt-0.5"
                  disabled={!product.featured && !canFeature}
                />
                <div>
                  <div className="font-medium text-gray-900">🔥 Destacar em "Ofertas e Promoções"</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Produto aparecerá na seção especial da vitrine da banca.
                    <br />
                    <span className={`font-medium ${canFeature || product.featured ? 'text-green-600' : 'text-amber-600'}`}>
                      {canFeature || product.featured
                        ? `✅ ${8 - featuredCount} vagas disponíveis de 8` 
                        : '⚠️ Limite de 8 produtos atingido! Desative algum produto abaixo.'
                      }
                    </span>
                  </div>
                </div>
              </label>
            </div>
            <div className="pt-2 border-t border-gray-200 space-y-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input defaultChecked={product.active} name="active" type="checkbox" className="rounded" /> Produto ativo
              </label>
              
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">📦 Disponibilidade</div>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input defaultChecked={product.pronta_entrega} name="pronta_entrega" type="checkbox" className="rounded text-green-600" /> 
                    <span className="text-green-700">✅ Pronta Entrega</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input defaultChecked={product.sob_encomenda} name="sob_encomenda" type="checkbox" className="rounded text-blue-600" /> 
                    <span className="text-blue-700">📋 Sob Encomenda</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input defaultChecked={product.pre_venda} name="pre_venda" type="checkbox" className="rounded text-purple-600" /> 
                    <span className="text-purple-700">🔮 Pré-Venda</span>
                  </label>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Selecione as opções de disponibilidade que se aplicam ao produto
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                disabled={saving}
                className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Salvando..." : "Salvar"}
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
      {product && (
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
      )}
    </div>
  );
}
