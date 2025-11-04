"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { shippingConfig } from "@/components/shippingConfig";
import { cachedFetch } from "@/lib/cache";

export type Product = {
  id: string;
  name: string;
  price?: number;
  priceOriginal?: number | null;
  discountPercent?: number;
  image: string;
  badge?: string;
  vendorName: string;
  vendorAvatar: string;
  description?: string;
  stockQty?: number | null;
  trackStock?: boolean;
  ratingAvg?: number | null;
  reviewsCount?: number;
  prontaEntrega?: boolean;
  sobEncomenda?: boolean;
  preVenda?: boolean;
  bancaId?: string;
  bancaName?: string;
};


type ApiProduct = {
  id: string;
  name: string;
  price?: number;
  price_original?: number | null;
  discount_percent?: number | null;
  images?: string[];
  banca_id?: string;
  description?: string;
  stock_qty?: number | null;
  track_stock?: boolean;
  rating_avg?: number | null;
  reviews_count?: number;
  sob_encomenda?: boolean;
  pre_venda?: boolean;
  pronta_entrega?: boolean;
};

type ApiBanca = { id: string; name: string; cover?: string; avatar?: string };

function Price({ value, original, size = 'sm' }: { value?: number; original?: number | null; size?: 'sm' | 'lg' }) {
  if (typeof value !== "number") return null;
  const showPromo = typeof original === 'number' && original > value;
  const baseCls = size === 'lg' ? 'text-xl md:text-2xl' : 'text-[15px] md:text-base';
  return (
    <div className="flex flex-col leading-tight">
      {showPromo && (
        <span className="text-[12px] text-gray-500 line-through">De: R$ {Number(original).toFixed(2)}</span>
      )}
      <span className={`${baseCls} font-extrabold text-[#ff5c00]`}>{showPromo ? 'Por: ' : ''}R$ {value.toFixed(2)}</span>
    </div>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function Stars({ value, count, size = 'sm' }: { value?: number | null; count?: number; size?: 'sm' | 'md' }) {
  const v = Math.max(0, Math.min(5, Number(value ?? 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-[2px] text-[#f59e0b]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
          {i < full ? (
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.164L12 18.896 4.664 23.16l1.402-8.164L.132 9.21l8.2-1.192L12 .587z" />
          ) : i === full && half ? (
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.402 8.164L12 18.896V.587z" />
          ) : (
            <path d="M22 9.21l-8.2-1.192L12 .587 10.2 8.018 2 9.21l5.934 5.786L6.532 23.16 12 18.896l5.468 4.264-1.402-8.164L22 9.21z" fillOpacity="0.25" />
          )}
        </svg>
      ))}
      {typeof count === 'number' && (
        <span className="ml-1 text-[11px] text-gray-500">{count} avaliação{count === 1 ? '' : 's'}</span>
      )}
    </span>
  );
}

function FeaturedCard({ p }: { p: Product }) {
  const [fav, setFav] = useState(false);
  const { addToCart } = useCart();
  const { show } = useToast();
  const { items } = useCart();
  const subtotal = items.reduce((s, it) => s + (it.price ?? 0) * it.qty, 0);
  const qualifies = shippingConfig.freeShippingEnabled || subtotal >= shippingConfig.freeShippingThreshold;
  return (
    <Link href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} className="group relative col-span-12 md:col-span-5 row-span-2 overflow-hidden rounded-2xl border border-[#ff5c00] bg-white shadow-lg hover:shadow-xl transition-shadow md:min-h-[620px] flex flex-col">
      <div className="relative w-full group h-72 md:h-[280px]">
        {/* Wrapper com padding para a imagem, mantendo cantos arredondados internos */}
        <div className="absolute inset-0 p-2">
          <div className="relative h-full w-full rounded-[14px] overflow-hidden">
            <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain bg-gray-50" />
            {/* Link absoluto cobrindo a imagem para ir à página do produto */}
            <Link
              href={("/produto/" + slugify(p.name) + "-" + p.id) as Route}
              aria-label={`Ver detalhes de ${p.name}`}
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]"
            />
            {/* Efeito hover sutil sobre a imagem */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
            {/* Badge de desconto no canto superior esquerdo */}
            {(() => {
              const d = (typeof p.priceOriginal === 'number' && typeof p.price === 'number' && p.priceOriginal > p.price) ? Math.round((1 - (p.price!/p.priceOriginal!)) * 100) : 0;
              if (d <= 0) return null;
              return (
                <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-md bg-[#ff5c00] text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                  -{d}%
                </span>
              );
            })()}
            {/* Badge livre do mock, se existir */}
            {p.badge && (
              <span className="absolute right-2 top-2 rounded-full bg-black/60 text-white text-xs font-medium px-2 py-1">{p.badge}</span>
            )}
          </div>
        </div>
        {/* Ícone flutuante de carrinho sob a imagem */}
        <button
          onClick={(e) => { 
            e.preventDefault(); 
            addToCart({ 
              id: p.id, 
              name: p.name, 
              price: p.price, 
              image: p.image,
              banca_id: p.bancaId,
              banca_name: p.bancaName
            }, 1); 
            show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as Route)} className="underline font-semibold">Ver carrinho</Link></span>); 
          }}
          aria-label="Adicionar ao carrinho"
          className="absolute -bottom-5 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow hover:bg-gray-50"
        >
          <Image src="https://cdn-icons-png.flaticon.com/128/4982/4982841.png" alt="Carrinho" width={20} height={20} className="h-5 w-5 object-contain" />
        </button>
      </div>
      <div className="p-4 flex-1 flex items-start justify-between gap-4">
        <div className="flex-1 flex flex-col">
          {/* Avatar e nome da banca acima do produto */}
          <div className="mb-1 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full overflow-hidden border border-white shadow ring-1 ring-[#ff5c00]/20">
              <Image src={p.vendorAvatar} alt={p.vendorName} width={24} height={24} className="h-full w-full object-cover" />
            </div>
            <span className="text-xs text-gray-700 font-medium">{p.vendorName}</span>
          </div>
          {/* Badges de categorias/estado do Admin */}
          <div className="mb-1.5 flex flex-wrap gap-1">
            {p.prontaEntrega && (
              <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold">Pronta Entrega</span>
            )}
            {p.sobEncomenda && (
              <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 text-[10px] font-semibold">Sob Encomenda</span>
            )}
            {p.preVenda && (
              <span className="inline-flex items-center rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 text-[10px] font-semibold">Pré-Venda</span>
            )}
            {/* Fallback simples quando apenas trackStock estiver ativo */}
            {!p.prontaEntrega && !p.sobEncomenda && !p.preVenda && p.trackStock && (
              (p.stockQty ?? 0) > 0 ? (
                <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold">Pronta Entrega</span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 text-[10px] font-semibold">Sob Encomenda</span>
              )
            )}
          </div>
          <div className="text-base md:text-xl font-semibold leading-snug break-words">{p.name}</div>
          <div className="mt-1">
            <Stars value={p.ratingAvg} count={p.reviewsCount} size="md" />
          </div>
          {/* Bloco inferior fixo: preço */}
          <div className="mt-auto">
            <div className="mt-1.5"><Price value={p.price} original={p.priceOriginal} size="lg" /></div>
          </div>
          {/* Botões no rodapé do card */}
          <div className="pt-2 flex flex-col gap-2">
            <button className="w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-xs font-semibold text-white shadow hover:opacity-95" onClick={(e)=>{ e.preventDefault(); addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, banca_id: p.bancaId, banca_name: p.bancaName }, 1); show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as Route)} className="underline font-semibold">Ver carrinho</Link></span>); }}>Comprar</button>
            <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#ff5c00] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#ff5c00] leading-tight hover:bg-[#fff3ec] whitespace-nowrap">
              <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
              Comprar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ p }: { p: Product }) {
  const { addToCart } = useCart();
  const { show } = useToast();
  const outOfStock = Boolean(p.trackStock) && (p.stockQty != null) && (p.stockQty <= 0);
  
  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition flex h-full w-full flex-col flex-1">
      <div className="relative w-full group h-48 sm:h-56">
        {/* Wrapper com padding para a imagem, mantendo cantos arredondados internos */}
        <div className="absolute inset-0 p-2">
          <div className="relative h-full w-full rounded-[14px] overflow-hidden">
            <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw" className="object-contain bg-gray-50" />
            {/* Link absoluto cobrindo a imagem para ir à página do produto */}
            <Link
              href={("/produto/" + slugify(p.name) + "-" + p.id) as Route}
              aria-label={`Ver detalhes de ${p.name}`}
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]"
            />
            {/* Efeito hover sutil sobre a imagem */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
            {/* Badge de desconto no canto superior esquerdo */}
            {(() => {
              const baseDiscount = typeof p.discountPercent === 'number' ? p.discountPercent : (p.priceOriginal && p.priceOriginal > (p.price || 0) ? Math.round((1 - (p.price || 0) / p.priceOriginal) * 100) : 0);
              const d = Math.max(0, Math.min(90, baseDiscount || 0));
              if (d <= 0) return null;
              return (
                <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-md bg-[#ff5c00] text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                  -{d}%
                </span>
              );
            })()}
            {/* Esgotado badge */}
            {outOfStock && (
              <span className="absolute right-2 top-2 z-10 inline-flex items-center rounded-md bg-rose-600 text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                Esgotado
              </span>
            )}
          </div>
        </div>
        {/* Ícone flutuante de carrinho sob a imagem */}
        <button
          onClick={() => { 
            if (!outOfStock) { 
              addToCart({ 
                id: p.id, 
                name: p.name, 
                price: p.price, 
                image: p.image,
                banca_id: p.bancaId,
                banca_name: p.bancaName
              }, 1); 
              show(<span>Adicionado ao carrinho.</span>); 
            } 
          }}
          aria-label="Adicionar ao carrinho"
          disabled={outOfStock}
          className={`absolute -bottom-5 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border ${outOfStock ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed' : 'border-gray-200 bg-white shadow hover:bg-gray-50'}`}
        >
          <Image src="https://cdn-icons-png.flaticon.com/128/4982/4982841.png" alt="Carrinho" width={20} height={20} className={`h-5 w-5 object-contain ${outOfStock ? 'opacity-60' : ''}`} />
        </button>
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1">
          {p.prontaEntrega && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Pronta Entrega
            </span>
          )}
          {p.sobEncomenda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Sob Encomenda
            </span>
          )}
          {p.preVenda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Pré-Venda
            </span>
          )}
          {/* Fallback para produtos com track_stock ativo mas sem flags específicas */}
          {p.trackStock && !p.prontaEntrega && !p.sobEncomenda && !p.preVenda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Pronta Entrega
            </span>
          )}
        </div>
        <Link href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} className="mt-2 text-[13px] font-semibold hover:underline">{p.name}</Link>
        <div className="mt-1 flex items-center gap-2">
          <Stars value={p.ratingAvg} count={p.reviewsCount} size="sm" />
        </div>
        
        {/* Seção inferior com preços e botões sempre alinhados */}
        <div className="mt-auto pt-2 flex flex-col gap-1.5">
          {/* Preço com rótulos: 'De:' (antigo) e 'Por:' (atual) */}
          <div className="flex flex-col gap-0.5">
            {(() => {
              const hasDiscount = typeof p.discountPercent === 'number' && p.discountPercent > 0;
              
              if (hasDiscount) {
                const oldPrice = (p.price || 0) / (1 - (p.discountPercent || 0) / 100);
                return (
                  <>
                    <div className="text-[12px] text-gray-600">
                      De: <span className="text-gray-400 line-through">R$ {oldPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-[18px] text-[#ff5c00] font-extrabold">Por: R$ {(p.price || 0).toFixed(2)}</div>
                  </>
                );
              } else {
                return (
                  <div className="text-[18px] text-[#ff5c00] font-extrabold">R$ {(p.price || 0).toFixed(2)}</div>
                );
              }
            })()}
          </div>
          
          {/* Ações: botão carrinho laranja + botão Whats verde */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { 
                if (!outOfStock) { 
                  addToCart({ 
                    id: p.id, 
                    name: p.name, 
                    price: p.price, 
                    image: p.image,
                    banca_id: p.bancaId,
                    banca_name: p.bancaName
                  }, 1); 
                  show(<span>Adicionado ao carrinho.</span>); 
                } 
              }}
              disabled={outOfStock}
              className={`w-full rounded-md px-3 py-2 text-[12px] font-semibold ${outOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#ff5c00] text-white hover:bg-[#ff6f1f]'}`}
            >
              {outOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>
            <button
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-[#5ad58a] bg-[#eafff3] text-[#1f9c4a] hover:bg-[#dcffe9] px-3 py-2 text-[12px] font-semibold"
            >
              <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={16} height={16} className="h-4 w-4 object-contain" />
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MostSearchedProducts() {
  const [apiItems, setApiItems] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [pData, bData] = await Promise.all([
          cachedFetch('/api/products/most-searched', undefined, 300), // 5 min cache
          cachedFetch('/api/admin/bancas', undefined, 600), // 10 min cache
        ]);
        
        let list: ApiProduct[] = [];
        
        // Tenta buscar produtos mais buscados primeiro
        if (pData?.data) {
          list = Array.isArray(pData.data) ? pData.data : [];
        }
        
        // Se não houver produtos mais buscados, busca os últimos produtos cadastrados
        if (list.length === 0) {
          try {
            const latestData = await cachedFetch('/api/products?limit=8&sort=created_at&order=desc', undefined, 180);
            if (latestData?.data) {
              list = Array.isArray(latestData.data) ? latestData.data : [];
            }
          } catch (e) {
            console.log('Fallback para últimos produtos falhou:', e);
          }
        }
        
        let bancas: Record<string, ApiBanca> = {};
        if (bData?.data) {
          const bList: ApiBanca[] = Array.isArray(bData.data) ? bData.data : [];
          bancas = Object.fromEntries(bList.map((b) => [b.id, b]));
        }
        
        const mapped: Product[] = list.map((p) => {
          const price = Number(p.price ?? 0);
          const priceOriginal = p.price_original != null ? Number(p.price_original) : undefined;
          const discountPercentRaw = p.discount_percent != null ? Number(p.discount_percent) : undefined;
          const discountCalculated = priceOriginal && priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : 0;
          const discountPercent = discountPercentRaw != null ? discountPercentRaw : discountCalculated;
          
          return {
            id: p.id,
            name: p.name,
            price,
            priceOriginal,
            discountPercent,
            image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop',
            vendorName: bancas[p.banca_id || '']?.name || 'Banca Local',
            vendorAvatar: bancas[p.banca_id || '']?.avatar || bancas[p.banca_id || '']?.cover || 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=120&auto=format&fit=crop',
            description: p.description || undefined,
            stockQty: p.stock_qty ?? null,
            trackStock: p.track_stock ?? false,
            ratingAvg: p.rating_avg ?? null,
            reviewsCount: p.reviews_count ?? 0,
            prontaEntrega: p.pronta_entrega ?? false,
            sobEncomenda: p.sob_encomenda ?? false,
            preVenda: p.pre_venda ?? false,
            bancaId: p.banca_id,
            bancaName: bancas[p.banca_id || '']?.name,
          };
        });
        
        if (active) setApiItems(mapped);
      } catch (e) {
        console.log('Erro ao carregar produtos:', e);
        if (active) setApiItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const items = useMemo(() => {
    if (!apiItems) return [];
    return apiItems.slice(0, 8); // Limita a 8 produtos
  }, [apiItems]);

  const [viewport, setViewport] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewport < 640;
  const [slideIndex, setSlideIndex] = useState(0);
  const mobileSlides = useMemo(() => {
    const groups: Product[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      groups.push(items.slice(i, i + 2));
    }
    return groups;
  }, [items]);

  useEffect(() => {
    setSlideIndex(0);
  }, [isMobile, mobileSlides.length]);

  useEffect(() => {
    if (!isMobile || mobileSlides.length <= 1) return;
    const id = setInterval(() => {
      setSlideIndex((current) => {
        const next = current + 1;
        return next >= mobileSlides.length ? 0 : next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [isMobile, mobileSlides.length]);

  const goToSlide = (idx: number) => {
    const total = mobileSlides.length;
    if (total === 0) return;
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setSlideIndex(clamped);
  };

  // Não renderiza a seção se não houver produtos e não estiver carregando
  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Produtos mais buscados</h2>
            <p className="text-sm text-gray-600">Veja os itens mais populares da sua região</p>
          </div>
          <Link href="/buscar?q=mais%20buscados" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todos</Link>
        </div>

        {loading ? (
          isMobile ? (
            <div className="rounded-2xl bg-gray-100 h-[420px] animate-pulse" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-80"></div>
              ))}
            </div>
          )
        ) : isMobile ? (
          <div className="relative">
            <div className="overflow-hidden -mx-1">
              <div
                className="flex"
                style={{
                  transform: `translateX(-${slideIndex * 100}%)`,
                  transition: "transform 500ms ease",
                }}
              >
                {mobileSlides.map((group, slideIdx) => (
                  <div key={slideIdx} className="w-full shrink-0 px-1">
                    <div className="flex gap-2 items-stretch">
                      {group.map((product) => (
                        <div key={product.id} className="w-1/2 flex items-stretch">
                          <SmallCard p={product} />
                        </div>
                      ))}
                      {group.length === 1 && (
                        <div className="w-1/2 flex items-stretch" aria-hidden>
                          <div className="rounded-2xl border border-transparent flex-1" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {mobileSlides.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {mobileSlides.map((_, idx) => {
                  const active = idx === slideIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      className={`h-2.5 rounded-full transition ${active ? "w-6 bg-[#5c4ad8]" : "w-2.5 bg-gray-300 hover:bg-gray-400"}`}
                      aria-label={`Ir para produto ${idx + 1}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
            {items.map((p) => (
              <SmallCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
