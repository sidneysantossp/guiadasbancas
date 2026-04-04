"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { validateProductCreate } from "@/lib/validators/product";
import ProductImageUploader from "@/components/admin/ProductImageUploader";
import VideoTutorial from "@/components/admin/VideoTutorial";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SpecificationsEditor from "@/components/admin/SpecificationsEditor";
import { useToast } from "@/components/admin/ToastProvider";
import PlanOverdueCard from "@/components/jornaleiro/PlanOverdueCard";
import PlanPendingActivationCard from "@/components/jornaleiro/PlanPendingActivationCard";
import PlanUpgradeCard from "@/components/jornaleiro/PlanUpgradeCard";

interface CategoryOption {
  id: string;
  name: string;
}

// Funções de máscara
const formatCurrency = (value: string | number) => {
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const numbers = value.toString().replace(/\D/g, '');
  if (!numbers || numbers === '') {
    return '';
  }
  const amount = parseFloat(numbers) / 100;
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseCurrency = (value: string): number => {
  const numbers = value.replace(/\D/g, '');
  return parseFloat(numbers) / 100;
};

export default function SellerProductCreatePage() {
  const router = useRouter();
  const toast = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [canFeature, setCanFeature] = useState(true);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [descriptionFull, setDescriptionFull] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [planName, setPlanName] = useState("Plano atual");
  const [planType, setPlanType] = useState<string>("free");
  const [productLimit, setProductLimit] = useState<number | null>(null);
  const [limitReachedInfo, setLimitReachedInfo] = useState<{
    limit: number;
    currentCount: number;
    planName: string;
    planType: string;
  } | null>(null);
  const [pendingPlanName, setPendingPlanName] = useState<string | null>(null);
  const [paidFeaturesLockedUntilPayment, setPaidFeaturesLockedUntilPayment] = useState(false);
  const [overdueFeaturesLocked, setOverdueFeaturesLocked] = useState(false);
  const [overdueInGracePeriod, setOverdueInGracePeriod] = useState(false);
  const [overdueGraceEndsAt, setOverdueGraceEndsAt] = useState<string | null>(null);
  const [contractedPlanName, setContractedPlanName] = useState<string | null>(null);
  const featuredUpgradeUrl = "/jornaleiro/meu-plano?source=destaque";
  const productUpgradeUrl = "/jornaleiro/meu-plano?source=product-limit";
  
  // Estados para contexto da IA
  const [productName, setProductName] = useState("");
  const [productMiniDesc, setProductMiniDesc] = useState("");

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

  useEffect(() => {
    const loadBanca = async () => {
      try {
        const res = await fetch("/api/jornaleiro/banca", { cache: "no-store" });
        const json = await res.json();
        const banca = json?.data;
        const parsedLimit = Number(banca?.entitlements?.product_limit);
        setPlanName(banca?.plan?.name || "Plano atual");
        setPlanType(banca?.entitlements?.plan_type || banca?.plan?.type || "free");
        setProductLimit(Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null);
        setPendingPlanName(banca?.requested_plan?.name || null);
        setPaidFeaturesLockedUntilPayment(banca?.entitlements?.paid_features_locked_until_payment === true);
        setOverdueFeaturesLocked(banca?.entitlements?.overdue_features_locked === true);
        setOverdueInGracePeriod(banca?.entitlements?.overdue_in_grace_period === true);
        setOverdueGraceEndsAt(banca?.entitlements?.overdue_grace_ends_at || null);
        setContractedPlanName(banca?.subscription?.plan?.name || null);
        setCanFeature(banca?.entitlements?.can_access_featured_placement === true);
      } catch {
        setPlanName("Plano atual");
        setPlanType("free");
        setProductLimit(null);
        setPendingPlanName(null);
        setPaidFeaturesLockedUntilPayment(false);
        setOverdueFeaturesLocked(false);
        setOverdueInGracePeriod(false);
        setOverdueGraceEndsAt(null);
        setContractedPlanName(null);
        setCanFeature(false);
      }
    };
    loadBanca();
  }, []);

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
            body: form,
          });
          const upJson = await up.json();
          if (!up.ok || !upJson?.ok) throw new Error("Falha no upload de imagem");
          uploadedUrls.push(upJson.url);
        } else {
          uploadedUrls.push(src);
        }
      }
      
      const salePriceValue = salePrice ? parseCurrency(salePrice) : 0;
      const discountValue = discountPercent ? Number(discountPercent) : 0;
      const costPriceValue = costPrice ? parseCurrency(costPrice) : 0;

      let finalPrice = salePriceValue;
      let originalPrice: number | undefined;

      if (discountValue > 0 && discountValue <= 100) {
        originalPrice = salePriceValue;
        finalPrice = salePriceValue * (1 - discountValue / 100);
      }

      const body = {
        name: (fd.get("name") as string)?.trim(),
        description: (fd.get("description") as string) || "",
        category_id: (fd.get("category") as string)?.trim(),
        price: finalPrice,
        price_original: originalPrice,
        cost_price: costPriceValue || undefined,
        discount_percent: discountValue || undefined,
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
        specifications,
        gallery_images: [],
      };

      const vr = validateProductCreate(body as any);
      if (!vr.ok) throw new Error(vr.error);
      const res = await fetch("/api/jornaleiro/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vr.data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[Create] Erro da API:', errorData);
        if (errorData?.code === "PLAN_PRODUCT_LIMIT_REACHED") {
          setLimitReachedInfo({
            limit: Number(errorData.limit || productLimit || 0),
            currentCount: Number(errorData.currentCount || 0),
            planName: errorData.plan?.name || planName,
            planType: errorData.plan?.type || planType,
          });
        } else if (errorData?.code === "PLAN_FEATURED_PLACEMENT_LOCKED") {
          setCanFeature(false);
        } else if (errorData?.code === "PLAN_PENDING_PAYMENT") {
          setPendingPlanName(errorData?.requested_plan?.name || pendingPlanName || "Plano solicitado");
          setPaidFeaturesLockedUntilPayment(true);
        } else if (errorData?.code === "PLAN_OVERDUE_SUSPENDED") {
          setOverdueFeaturesLocked(true);
          setContractedPlanName(errorData?.contracted_plan?.name || contractedPlanName || "Plano contratado");
          setOverdueGraceEndsAt(errorData?.overdue_grace_ends_at || overdueGraceEndsAt || null);
        }
        throw new Error(errorData.error || "Falha ao criar produto.");
      }
      setLimitReachedInfo(null);
      toast.success("Produto criado com sucesso");
      router.push("/jornaleiro/produtos");
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
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para produtos
        </button>
        <h1 className="text-xl font-semibold">Novo produto</h1>
        <p className="text-sm text-gray-600">Cadastre um novo item na sua banca.</p>
      </div>

      {productLimit ? (
        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          <div className="font-semibold">Limite do {planName}</div>
          <p className="mt-1">
            Este plano permite até <strong>{productLimit} produtos próprios cadastrados</strong>. Se sua banca crescer além disso, o próximo passo é fazer upgrade em{" "}
            <Link href={productUpgradeUrl} className="font-semibold text-[#ff5c00] underline">
              Meu Plano
            </Link>.
          </p>
        </div>
      ) : null}

      {overdueFeaturesLocked || overdueInGracePeriod ? (
        <PlanOverdueCard
          planName={contractedPlanName || planName}
          graceEndsAt={overdueGraceEndsAt}
          accessSuspended={overdueFeaturesLocked}
        />
      ) : paidFeaturesLockedUntilPayment && pendingPlanName ? (
        <PlanPendingActivationCard requestedPlanName={pendingPlanName} />
      ) : limitReachedInfo ? (
        <PlanUpgradeCard
          currentPlanType={limitReachedInfo.planType}
          currentPlanName={limitReachedInfo.planName}
          context="product-limit"
          productLimit={limitReachedInfo.limit}
          currentCount={limitReachedInfo.currentCount}
        />
      ) : null}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <label className="text-sm font-medium">Nome do Produto</label>
            <input 
              name="name" 
              required 
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" 
            />
          </div>
          <div>
            <label className="text-sm font-medium">Mini Descrição</label>
            <textarea 
              name="description" 
              rows={3} 
              onChange={(e) => setProductMiniDesc(e.target.value)}
              placeholder="Descrição breve que aparece no card do produto" 
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
            title="Como Cadastrar um Produto"
            videoId="dQw4w9WgXcQ"
            description="Aprenda passo a passo como adicionar produtos à sua banca"
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">Custo Interno</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 mt-0.5">R$</span>
                  <input
                    type="text"
                    value={formatCurrency(costPrice)}
                    onChange={(e) => setCostPrice(formatCurrency(e.target.value))}
                    className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="0,00"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Opcional. Serve para margem e gestão interna da banca.</p>
              </div>
              <div>
                <label className="text-sm font-medium">Preço de Venda</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 mt-0.5">R$</span>
                  <input
                    type="text"
                    value={formatCurrency(salePrice)}
                    onChange={(e) => setSalePrice(formatCurrency(e.target.value))}
                    required
                    className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="0,00"
                  />
                </div>
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
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cupom</label>
                <input
                  name="coupon_code"
                  placeholder="EX: BANCAX10"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
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
            {salePrice && Number(discountPercent) > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="text-sm text-green-800">
                  <span className="font-medium">Preço final com desconto:</span>{" "}
                  <span className="text-lg font-bold">
                    R$ {((parseCurrency(salePrice) * (1 - Number(discountPercent) / 100))).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="ml-2 text-gray-500 line-through">
                    R$ {parseCurrency(salePrice).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            )}
            
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
                    {canFeature ? (
                      <span className="font-medium text-green-600">
                        {`✅ ${8 - featuredCount} vagas disponíveis de 8`}
                      </span>
                    ) : (
                      <span className="font-medium text-amber-600">
                        Recurso disponível apenas no Premium.
                      </span>
                    )}
                    {!canFeature ? (
                      <>
                        <br />
                        <Link href={featuredUpgradeUrl} className="font-medium text-[#ff5c00] underline">
                          Ative o Premium para destacar produtos na vitrine.
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </label>
            </div>
            
            <div className="pt-2">
              <button
                disabled={saving || Boolean(limitReachedInfo) || paidFeaturesLockedUntilPayment || overdueFeaturesLocked}
                className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving
                  ? "Salvando..."
                  : overdueFeaturesLocked
                    ? "Cobrança do plano em aberto"
                  : paidFeaturesLockedUntilPayment
                    ? "Aguardando pagamento do upgrade"
                    : limitReachedInfo
                      ? "Limite do plano atingido"
                      : "Salvar"}
              </button>
            </div>
          </div>
          
        </div>
      </form>

      {/* Informações sobre produtos em destaque */}
      <div className="mt-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">🔥 Produtos em Destaque</h4>
          <div className="text-xs text-blue-700 space-y-1">
            {canFeature ? (
              <>
                <p>• Marque produtos como destaque (máximo 8 por banca)</p>
                <p>• Produtos destacados aparecem na seção "Ofertas e Promoções"</p>
                <p>• Gerencie os destaques na listagem de produtos</p>
              </>
            ) : (
              <>
                <p>• Destaque na vitrine é um recurso do plano Premium</p>
                <p>• O Free continua liberado para cadastro manual, pedidos, estoque e venda via WhatsApp</p>
                <p>
                  • <Link href={featuredUpgradeUrl} className="font-semibold text-[#ff5c00] underline">Ative o Premium em Meu Plano</Link> para usar destaque editorial na plataforma
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
