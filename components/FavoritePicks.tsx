"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";

// Tipos
type FavItem = {
  id: string;
  name: string;
  vendorName?: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
  ratingAvg?: number | null;
  reviewsCount?: number | null;
  available?: boolean;
};

type ApiProduct = {
  id: string;
  name: string;
  images?: string[];
  price?: number;
  price_original?: number | null;
  discount_percent?: number | null;
  rating_avg?: number | null;
  reviews_count?: number | null;
  banca_id?: string;
  active?: boolean;
};

type ApiBanca = { id: string; name: string };

function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="currentColor" aria-hidden>
      <path d="M13.5 0s1 2.5-1 5-2.5 3.5-1.5 5c0 0 1-2 3-2s4 1.5 4 5.5S14.5 24 9.5 24 1 20.5 1 15 4.5 8 8 6c0 0-.5 1.5.5 2.5C9.5 9 13.5 6.5 13.5 0z"/>
    </svg>
  );
}

function RatingPill({ rating = 4.7, reviews = 1 }: { rating?: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[11px] font-semibold">
      ({reviews})
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-1 py-[1px] text-[10px] font-semibold">{rating.toFixed(1)}
      </span>
    </span>
  );
}

function HeartOutline() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff5c00]" aria-hidden>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function DiscountBadge({ percent }: { percent?: number | null }) {
  if (typeof percent !== 'number' || percent <= 0) return null;
  return (
    <span className="absolute left-2 top-2 rounded-md bg-[#ff5c00] text-white text-[11px] font-semibold px-2 py-1 shadow">
      -{Math.round(percent)}%
    </span>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function Stars({ value, count }: { value?: number | null; count?: number | null }) {
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
      <span className="ml-1 text-[11px] text-gray-500">{Number(count ?? 0)} avaliação{Number(count ?? 0) === 1 ? '' : 's'}</span>
    </span>
  );
}

function FavCard({ item }: { item: FavItem }) {
  const { id, name, vendorName, image, price, priceOriginal, discountPercent, ratingAvg, reviewsCount, available } = item;
  return (
    <Link href={("/produto/" + slugify(name) + "-" + id) as Route} className="group block rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-2 flex items-center gap-3">
        {/* Imagem à esquerda com padding e badge */}
        <div className="relative w-28 h-24 rounded-xl overflow-hidden shrink-0">
          <Image src={image} alt={name} fill className="object-contain bg-gray-50" />
          <DiscountBadge percent={discountPercent} />
          {!available && (
            <div className="absolute inset-0 bg-black/60 grid place-items-center">
              <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-800">Not Available Now</span>
            </div>
          )}
        </div>
        {/* Conteúdo + coluna de ícones à direita */}
        <div className="flex-1 min-w-0 flex gap-2 items-center">
          {/* Bloco de textos/preços */}
          <div className="flex-1 min-w-0">
            <div className="min-w-0">
              <div className="text-[13px] font-semibold leading-tight line-clamp-2 break-words">{name}</div>
              {vendorName && <div className="text-[12px] text-gray-600 line-clamp-1">{vendorName}</div>}
              <div className="mt-1"><Stars value={ratingAvg} count={reviewsCount} /></div>
            </div>

            {typeof discountPercent === 'number' && discountPercent > 0 ? (
              <div className="mt-2">
                <div className="text-[12px] text-gray-600">
                  De: <span className="text-gray-400 line-through">R$ {((price) / (1 - (discountPercent || 0) / 100)).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff5c00] font-extrabold">R$ {price.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[#ff5c00] font-extrabold">R$ {price.toFixed(2)}</span>
                {typeof priceOriginal === 'number' && priceOriginal > price && (
                  <span className="text-gray-400 line-through text-[12px]">R$ {Number(priceOriginal).toFixed(2)}</span>
                )}
              </div>
            )}
          </div>
          {/* Coluna de ícones alinhados verticalmente */}
          <div className="flex flex-col items-center justify-center gap-2 py-1 self-stretch">
            <button aria-label="Favoritar" className="w-9 h-9 grid place-items-center rounded-md border border-gray-300 hover:bg-gray-50"><HeartOutline /></button>
            <Link href={("/produto/" + slugify(name) + "-" + id) as Route} aria-label="Visualizar produto" className="w-9 h-9 grid place-items-center rounded-md border border-gray-300 hover:bg-gray-50">
              <EyeIcon />
            </Link>
            <button aria-label="Adicionar ao carrinho" className="w-9 h-9 grid place-items-center rounded-md border border-[#ff5c00] hover:bg-[#fff3ec]">
              <CartIcon />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FavoritePicks() {
  const [items, setItems] = useState<FavItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        // Futuro: usar histórico do usuário. Início: fallback para últimas novidades
        const [pRes, bRes] = await Promise.all([
          fetch('/api/products?limit=6&sort=created_at&order=desc', {
            next: { revalidate: 60 } as any
          }),
          fetch('/api/admin/bancas', {
            next: { revalidate: 60 } as any
          }),
        ]);
        let list: ApiProduct[] = [];
        if (pRes.ok) {
          const pj = await pRes.json();
          list = Array.isArray(pj?.data) ? pj.data : (Array.isArray(pj?.items) ? pj.items : []);
        }
        if (list.length === 0) {
          const alt = await fetch('/api/products/most-searched', {
            next: { revalidate: 60 } as any
          });
          if (alt.ok) {
            const aj = await alt.json();
            list = Array.isArray(aj?.data) ? aj.data : [];
          }
        }
        let bancas: Record<string, ApiBanca> = {};
        if (bRes.ok) {
          const bj = await bRes.json();
          const bList: ApiBanca[] = Array.isArray(bj?.data) ? bj.data : [];
          bancas = Object.fromEntries(bList.map((b) => [b.id, b]));
        }

        const mapped: FavItem[] = list.map((p) => {
          const price = Number(p.price || 0);
          const priceOriginal = p.price_original != null ? Number(p.price_original) : null;
          const discountPercent = p.discount_percent != null ? Number(p.discount_percent) : (priceOriginal && priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : null);
          return {
            id: p.id,
            name: p.name,
            vendorName: bancas[p.banca_id || '']?.name,
            image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop',
            price,
            priceOriginal,
            discountPercent,
            ratingAvg: p.rating_avg ?? null,
            reviewsCount: p.reviews_count ?? null,
            available: p.active !== false,
          } as FavItem;
        });
        if (active) setItems(mapped);
      } catch (e) {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const data = useMemo(() => Array.isArray(items) ? items.slice(0, 6) : [], [items]);
  const [scrollIndex, setScrollIndex] = useState(0);

  const scrollNext = () => {
    if (scrollIndex < data.length - 1) {
      setScrollIndex(scrollIndex + 1);
    }
  };

  const scrollPrev = () => {
    if (scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
    }
  };

  if (!loading && data.length === 0) return null;

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="https://stackfood-react.6amtech.com/_next/static/media/fire.612dd1de.svg" alt="Fogo" width={23} height={23} />
            <h2 className="text-lg sm:text-xl font-semibold">Recomendados para você</h2>
          </div>
          <Link href="/buscar?q=recomendados" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todos</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-28"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: Carrossel */}
            <div className="sm:hidden relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out gap-4"
                  style={{ transform: `translateX(-${scrollIndex * 100}%)` }}
                >
                  {data.map((f) => (
                    <div key={f.id} className="w-full flex-shrink-0">
                      <FavCard item={f} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Setas de navegação */}
              {data.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    disabled={scrollIndex === 0}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all ${
                      scrollIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Anterior"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollNext}
                    disabled={scrollIndex === data.length - 1}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all ${
                      scrollIndex === data.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Próximo"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicadores (dots) */}
              {data.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {data.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setScrollIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === scrollIndex 
                          ? 'w-6 bg-[var(--color-primary)]' 
                          : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Ir para item ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop/Tablet: Grid 2x3 */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((f) => (
                <FavCard key={f.id} item={f} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
