"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

type TopItem = {
  id: string;
  title: string;
  vendor: string;
  description?: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  available?: boolean;
  discountLabel?: string;
  code?: string; // Código do produto (codigo_mercos)
};

function RatingPill({ rating = 5.0, reviews = 1 }: { rating?: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-gray-600">
      ({reviews})
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-1 py-[1px] text-[10px] font-semibold">{rating.toFixed(1)}</span>
    </span>
  );
}

function DiscountBadge({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span className="absolute left-2 top-2 rounded-md bg-[#1e73ff] text-white text-[11px] font-semibold px-2 py-1 shadow">{text}</span>
  );
}

function Stars({ value, count }: { value?: number; count?: number }) {
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
      {typeof count === "number" && (
        <span className="ml-1 text-[11px] text-gray-500">{count} avaliação{count === 1 ? "" : "s"}</span>
      )}
    </span>
  );
}

function Card({ p }: { p: TopItem }) {
  return (
    <Link href={("/produto/" + p.id) as any} className="block rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-36 w-full">
        <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
        <DiscountBadge text={p.discountLabel} />
        {!p.available && (
          <div className="absolute inset-0 bg-black/55 grid place-items-center">
            <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-800">Not Available Now</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.title}</div>
        <div className="text-[12px] text-gray-600 line-clamp-1">{p.vendor}</div>
        {p.description && (
          <div className="text-[12px] text-gray-500 line-clamp-1">{p.description}</div>
        )}
        <div className="mt-1"><RatingPill rating={p.rating} reviews={p.reviews} /></div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[#ff5c00] font-extrabold">R$ {p.price.toFixed(2)}</span>
          {typeof p.oldPrice === "number" && (
            <span className="text-gray-400 line-through text-[12px]">R$ {p.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function TopReviewed() {
  // slider responsivo e rotativo
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  // Mostrar 2 cards no mobile
  const perView = w < 640 ? 2 : w < 1024 ? 2 : 4;
  
  // Preferir vitrine curada pelo Admin (featured); fallback: categorias Eletrônicos/Informática
  type ApiProduct = {
    id: string; name: string; images?: string[]; price?: number; price_original?: number | null;
    discount_percent?: number | null; rating_avg?: number | null; reviews_count?: number | null; active?: boolean; description?: string; banca_id?: string; codigo_mercos?: string;
  };
  const [items, setItems] = useState<TopItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // 1) Tentar vitrine curada desta seção
        const curRes = await fetch('/api/featured-products?section=topreviewed_ei&limit=8', { next: { revalidate: 60 } as any });

        let source: ApiProduct[] = [];
        if (curRes.ok) {
          const cj = await curRes.json();
          source = Array.isArray(cj?.data) ? cj.data : [];
        }

        // 2) Se não houver curados, buscar DIRETAMENTE produtos de Bomboniere
        // OTIMIZAÇÃO: API agora retorna banca_name via JOIN, não precisa mais chamar /api/bancas
        if (!source.length) {
          const BOMBONIERE_ID = '6337c11f-c5ab-4f4b-ab9c-73c754d6eaae';
          
          const r = await fetch(
            `/api/products/public?category=${BOMBONIERE_ID}&limit=50&sort=created_at&order=desc`, 
            { next: { revalidate: 60 } as any }
          );
          
          if (r.ok) {
            const j = await r.json();
            const allProducts: ApiProduct[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j?.data) ? j.data : []);
            
            // Filtrar produtos SEM imagem (evitar mocks)
            let filtered = allProducts.filter((p: ApiProduct) => p.images && p.images.length > 0);
            
            // Embaralhar para ter variedade (shuffle)
            filtered = filtered.sort(() => Math.random() - 0.5);
            
            source = filtered;
            
            console.log(`[TopReviewed] Total Bomboniere: ${allProducts.length}, Com imagem: ${source.length}`);
          }
        }

        // Ordenar: melhor avaliação desc, depois número de reviews desc, depois fallback
        source.sort((a, b) => {
          const ra = Number(a.rating_avg ?? 0);
          const rb = Number(b.rating_avg ?? 0);
          if (rb !== ra) return rb - ra;
          const ca = Number(a.reviews_count ?? 0);
          const cb = Number(b.reviews_count ?? 0);
          if (cb !== ca) return cb - ca;
          return 0;
        });

        const mapped: TopItem[] = source.slice(0, 8).map(p => {
          // Usar imagem diretamente, sem cache-busting que quebra URLs do Supabase
          const imageUrl = p.images && p.images[0] ? p.images[0] : '';
          
          return {
            id: p.id,
            title: p.name,
            // OTIMIZAÇÃO: Usar banca_name que já vem da API via JOIN
            vendor: (p as any).banca_name || '',
            description: p.description,
            image: imageUrl,
            price: Number(p.price || 0),
            oldPrice: p.price_original != null ? Number(p.price_original) : undefined,
            rating: p.rating_avg ?? undefined,
            reviews: p.reviews_count ?? undefined,
            available: p.active !== false,
            discountLabel: (typeof p.discount_percent === 'number' && p.discount_percent > 0) ? `-${Math.round(p.discount_percent)}%` : undefined,
            code: p.codigo_mercos,
          };
        });

        if (alive) setItems(mapped.length ? mapped : []);
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const cards = useMemo(() => (Array.isArray(items) ? items : []), [items]).map((p) => ({ type: "card" as const, p }));
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const loopCards = useMemo(() => [...cards, ...cards], [cards]);
  
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  // IMPORTANTE: Return condicional deve vir DEPOIS de todos os hooks
  if (!loading && cards.length === 0) {
    return null;
  }

  const next = () => {
    setAnimating(true);
    setIndex((i) => i + 1);
  };
  const prev = () => {
    if (index === 0) {
      // salto para o fim sem animação e depois voltar um
      setAnimating(false);
      setIndex(cards.length);
      requestAnimationFrame(() => {
        setAnimating(true);
        setIndex(cards.length - 1);
      });
    } else {
      setAnimating(true);
      setIndex((i) => i - 1);
    }
  };

  return (
    <section className="w-full pt-8 md:pt-10">
      <div className="container-max">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍬</span>
            <h2 className="text-lg sm:text-xl font-semibold">Bomboniere</h2>
          </div>
          <Link href="/categorias/informatica" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todos</Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex gap-4"
              style={{
                transform: `translateX(-${(index * (100 / perView))}%)`,
                transition: animating ? "transform 600ms ease" : "none",
              }}
              onTransitionEnd={() => {
                if (index >= cards.length) {
                  setAnimating(false);
                  setIndex(0);
                  requestAnimationFrame(() => setAnimating(true));
                }
              }}
            >
              {loopCards.map((s, i) => (
                <div key={i} style={{ flex: `0 0 calc(${100 / perView}% - 1rem)` }} className="shrink-0">
                  <EnhancedCard p={s.p} />
                </div>
              ))}
            </div>
          </div>
          {/* Arrows */}
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 shadow rounded-full h-9 w-9 grid place-items-center"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Próximo"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 shadow rounded-full h-9 w-9 grid place-items-center"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function EnhancedCard({ p }: { p: TopItem }) {
  const { addToCart } = useCart();
  const { show } = useToast();
  const outOfStock = p.available === false;
  const productHref = (`/produto/${p.id}` as Route);

  const hasDiscount = typeof p.oldPrice === "number" && p.oldPrice > p.price;

  return (
    <div className="h-full rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
      <div className="relative w-full group h-48 sm:h-56">
        <div className="absolute inset-0 p-2">
          <div className="relative h-full w-full rounded-[14px] overflow-hidden">
            {p.image ? (
              <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain bg-gray-50" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <svg viewBox="0 0 24 24" className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            )}
            <Link href={productHref} aria-label={`Ver detalhes de ${p.title}`} className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]" />
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
            <DiscountBadge text={p.discountLabel} />
            {outOfStock && (
              <span className="absolute right-2 top-2 z-10 inline-flex items-center rounded-md bg-rose-600 text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                Esgotado
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            if (!outOfStock) {
              addToCart({ id: p.id, name: p.title, price: p.price, image: p.image }, 1);
              show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as Route)} className="underline font-semibold">Ver carrinho</Link></span>);
            }
          }}
          aria-label="Adicionar ao carrinho"
          disabled={outOfStock}
          className={`absolute -bottom-5 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border ${outOfStock ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed' : 'border-gray-200 bg-white shadow hover:bg-gray-50'}`}
        >
          <svg viewBox="0 0 24 24" className={`h-5 w-5 ${outOfStock ? 'text-gray-400' : 'text-[#ff5c00]'}`} fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </button>
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1">
          {outOfStock ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-2 py-[2px] text-[10px] font-semibold">
              Indisponível
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Pronta Entrega
            </span>
          )}
        </div>
        <Link href={productHref} className="mt-2 text-[13px] font-semibold hover:underline line-clamp-2">{p.title}</Link>
        {p.code && (
          <div className="text-[11px] text-gray-500 font-mono">Cód: {p.code}</div>
        )}
        <div className="text-[12px] text-gray-600 line-clamp-1">{p.vendor}</div>
        <div className="mt-1 flex items-center gap-2">
          <Stars value={p.rating} count={p.reviews} />
        </div>
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            {hasDiscount ? (
              <>
                <div className="text-[12px] text-gray-600">
                  De: <span className="text-gray-400 line-through">R$ {p.oldPrice?.toFixed(2)}</span>
                </div>
                <div className="text-[18px] text-[#ff5c00] font-extrabold">Por: R$ {p.price.toFixed(2)}</div>
              </>
            ) : (
              <div className="text-[18px] text-[#ff5c00] font-extrabold">R$ {p.price.toFixed(2)}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                if (!outOfStock) {
                  addToCart({ id: p.id, name: p.title, price: p.price, image: p.image }, 1);
                  show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as Route)} className="underline font-semibold">Ver carrinho</Link></span>);
                }
              }}
              disabled={outOfStock}
              className={`w-full rounded px-2.5 py-1 text-[11px] font-semibold ${outOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#ff5c00] text-white hover:opacity-95'}`}
            >
              {outOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>
            <button className="w-full inline-flex items-center justify-center gap-1.5 rounded border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 px-2.5 py-1 text-[11px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
