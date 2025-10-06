"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateProductCreate } from "@/lib/validators/product";
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

interface BancaOption {
  id: string;
  name: string;
}

export default function AdminProductCreatePage() {
  const router = useRouter();
  const toast = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [bancas, setBancas] = useState<BancaOption[]>([]);
  const [disponibilidadeTipo, setDisponibilidadeTipo] = useState<'todas' | 'especifica'>('todas');
  const [bancaSelecionada, setBancaSelecionada] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [canFeature, setCanFeature] = useState(true);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [descriptionFull, setDescriptionFull] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [allowReviews, setAllowReviews] = useState(true);
  const [imageUrls, setImageUrls] = useState("");

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
    const loadBancas = async () => {
      try {
        const res = await fetch("/api/admin/bancas", { cache: "no-store" });
        const json = await res.json();
        if (json?.success) {
          setBancas((json.data as any[])?.map((b) => ({ id: b.id, name: b.name })) || []);
        }
      } catch (e: any) {
        console.error(e?.message || "Não foi possível carregar bancas");
      }
    };
    loadCategories();
    loadBancas();
  }, [toast]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const fd = new FormData(e.currentTarget);
      const uploadedUrls: string[] = [];
      
      // Processar URLs de imagens diretas (do campo de texto)
      if (imageUrls.trim()) {
        const urls = imageUrls
          .split(/[\n,]/) // Separa por vírgula ou quebra de linha
          .map(url => url.trim())
          .filter(url => url.length > 0);
        uploadedUrls.push(...urls);
      }
      
      // Upload das imagens principais (uploader)
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
        category_id: (fd.get("category") as string)?.trim(),
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
        // Campos Mercos
        codigo_mercos: (fd.get("codigo_mercos") as string)?.trim() || undefined,
        unidade_medida: (fd.get("unidade_medida") as string)?.trim() || "UN",
        venda_multiplos: Number(fd.get("venda_multiplos") || 1),
        categoria_mercos: (fd.get("categoria_mercos") as string)?.trim() || undefined,
        disponivel_todas_bancas: disponibilidadeTipo === 'todas',
        banca_id: disponibilidadeTipo === 'especifica' && bancaSelecionada ? bancaSelecionada : null,
      };

      const vr = validateProductCreate(body as any);
      if (!vr.ok) throw new Error(vr.error);
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": "Bearer admin-token" 
        },
        body: JSON.stringify(vr.data),
      });
      if (!res.ok) throw new Error("Falha ao criar produto.");
      toast.success("Produto criado com sucesso");
      router.push("/admin/products");
    } catch (e: any) {
      const message = e?.message || "Erro ao salvar.";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/products"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5c00] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
        <div>
          <h1 className="text-xl font-semibold">Novo produto</h1>
          <p className="text-sm text-gray-600">Cadastre um novo item na banca.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="text-sm font-medium">Nome do Produto</label>
            <input name="name" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Mini Descrição</label>
            <textarea name="description" rows={3} placeholder="Descrição breve que aparece no card do produto" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
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
          
          <div className="pt-3 border-t border-gray-200">
            <label className="text-sm font-medium text-gray-900">📎 URLs de Imagens (CSV/Import)</label>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              rows={3}
              placeholder="Cole URLs de imagens aqui (uma por linha ou separadas por vírgula)&#10;Ex:&#10;https://exemplo.com/imagem1.jpg&#10;https://exemplo.com/imagem2.jpg"
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Útil para importação via CSV. Separe múltiplas URLs por vírgula ou quebra de linha.
            </p>
          </div>
          
        </div>

        <div className="space-y-3">
          {/* Tutorial em vídeo */}
          <VideoTutorial 
            title="Como Cadastrar um Produto"
            videoId="dQw4w9WgXcQ"
            description="Aprenda passo a passo como adicionar produtos à banca"
          />
          
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <select name="category" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="">Selecione</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Campos compatíveis com Mercos */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm font-semibold text-gray-900 mb-3">🔗 Dados Mercos (Opcional)</div>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">Código Mercos</label>
                  <input 
                    name="codigo_mercos" 
                    placeholder="Ex: AKOTO001"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm uppercase"
                    onChange={(e) => e.target.value = e.target.value.toUpperCase()}
                  />
                  <p className="text-xs text-gray-500 mt-1">Código único para vinculação de imagens</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Unidade</label>
                    <select name="unidade_medida" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                      <option value="UN">UN - Unidade</option>
                      <option value="CX">CX - Caixa</option>
                      <option value="KG">KG - Quilograma</option>
                      <option value="LT">LT - Litro</option>
                      <option value="MT">MT - Metro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Múltiplos</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      name="venda_multiplos" 
                      defaultValue="1.00"
                      placeholder="1.00"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoria Mercos</label>
                  <input 
                    name="categoria_mercos" 
                    placeholder="Ex: Planet Manga"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Disponibilidade para Bancas */}
            <div className="pt-3 border-t border-gray-200">
              <div className="text-sm font-semibold text-gray-900 mb-3">🏪 Disponibilidade nas Bancas</div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="disponibilidade"
                    value="todas"
                    checked={disponibilidadeTipo === 'todas'}
                    onChange={() => setDisponibilidadeTipo('todas')}
                    className="text-[#ff5c00]"
                  />
                  <div>
                    <div className="text-sm font-medium">Todas as Bancas</div>
                    <div className="text-xs text-gray-500">Produto ficará disponível automaticamente para todas</div>
                  </div>
                </label>
                
                <label className="flex items-start gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="disponibilidade"
                    value="especifica"
                    checked={disponibilidadeTipo === 'especifica'}
                    onChange={() => setDisponibilidadeTipo('especifica')}
                    className="mt-0.5 text-[#ff5c00]"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">Banca Específica</div>
                    {disponibilidadeTipo === 'especifica' && (
                      <select 
                        value={bancaSelecionada}
                        onChange={(e) => setBancaSelecionada(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Selecione uma banca</option>
                        {bancas.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Preço</label>
                <input type="number" step="0.01" name="price" required className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Preço original</label>
                <input type="number" step="0.01" name="price_original" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Desconto (%)</label>
                <input type="number" step="1" min={0} max={100} name="discount_percent" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium">Cupom</label>
                <input name="coupon_code" placeholder="EX: BANCAX10" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Estoque</label>
                <input type="number" name="stock" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input name="track_stock" type="checkbox" className="rounded" /> Controlar estoque
                </label>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200 space-y-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input name="active" type="checkbox" defaultChecked className="rounded" /> Produto ativo
              </label>
              
              <div>
                <div className="text-sm font-medium text-gray-900 mb-2">📦 Disponibilidade</div>
                <div className="space-y-2">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input name="pronta_entrega" type="checkbox" className="rounded text-green-600" /> 
                    <span className="text-green-700">✅ Pronta Entrega</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input name="sob_encomenda" type="checkbox" className="rounded text-blue-600" /> 
                    <span className="text-blue-700">📋 Sob Encomenda</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input name="pre_venda" type="checkbox" className="rounded text-purple-600" /> 
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
