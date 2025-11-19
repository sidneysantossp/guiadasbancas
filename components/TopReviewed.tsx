"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

// Mock de itens mais bem avaliados
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

const TOPS: TopItem[] = [
  {
    id: "t1",
    title: "Produto da Banca",
    vendor: "Hungry Puppets",
    image: "https://images.unsplash.com/photo-1548365328-9f547fb095de?q=80&w=1200&auto=format&fit=crop",
    price: 370,
    oldPrice: 400,
    rating: 4.7,
    reviews: 3,
    available: false,
    discountLabel: "$30.00",
  },
  {
    id: "t2",
    title: "Produto da Banca",
    vendor: "Cheese Burger",
    image: "https://images.unsplash.com/photo-1550547660-8b1290f252a9?q=80&w=1200&auto=format&fit=crop",
    price: 80,
    rating: 5.0,
    reviews: 1,
    available: true,
  },
  {
    id: "t3",
    title: "Produto da Banca",
    vendor: "Vintage Kitchen",
    image: "https://images.unsplash.com/photo-1604909052743-88c0dbcc7c9d?q=80&w=1200&auto=format&fit=crop",
    price: 320,
    rating: 5.0,
    reviews: 1,
    available: false,
  },
  {
    id: "t4",
    title: "Produto da Banca",
    vendor: "Redcliff Cafe",
    image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=1200&auto=format&fit=crop",
    price: 13.58,
    oldPrice: 14,
    rating: 5.0,
    reviews: 1,
    available: true,
    discountLabel: "3%",
  },
];

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
        const [curRes, bRes] = await Promise.all([
          fetch('/api/featured-products?section=topreviewed_ei&limit=8', { next: { revalidate: 60 } as any }),
          fetch('/api/bancas', { cache: 'no-store' })
        ]);

        let source: ApiProduct[] = [];
        if (curRes.ok) {
          const cj = await curRes.json();
          source = Array.isArray(cj?.data) ? cj.data : [];
        }

        // 2) Se não houver curados, buscar DIRETAMENTE produtos de Bebidas
        if (!source.length) {
          const BEBIDAS_ID = 'c230ed83-b08a-4b7a-8f19-7c8230f36c86';
          
          const r = await fetch(
            `/api/products/public?category=${BEBIDAS_ID}&limit=50`, 
            { next: { revalidate: 60 } as any }
          );
          
          if (r.ok) {
            const j = await r.json();
            const allProducts: ApiProduct[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j?.data) ? j.data : []);
            
            // Filtrar produtos SEM imagem (evitar mocks)
            source = allProducts.filter((p: ApiProduct) => p.images && p.images.length > 0);
            
            console.log(`[TopReviewed] Total Bebidas: ${allProducts.length}, Com imagem: ${source.length}`);
          }
        }

        let bancaMap: Record<string, { name: string }> = {};
        try {
          const bj = await bRes.json();
          const bList: Array<{ id: string; name: string }> = Array.isArray(bj?.data) ? bj.data : [];
          bancaMap = Object.fromEntries(bList.map(b => [b.id, { name: b.name }]));
        } catch {}

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
          // Cache-busting: adiciona timestamp na URL da imagem
          const imageUrl = p.images && p.images[0] 
            ? `${p.images[0]}${p.images[0].includes('?') ? '&' : '?'}t=${Date.now()}`
            : 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop';
          
          return {
            id: p.id,
            title: p.name,
            vendor: (p.banca_id && bancaMap[p.banca_id]?.name) || '',
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

        if (alive) setItems(mapped.length ? mapped : TOPS);
      } catch {
        if (alive) setItems(TOPS);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const cards = useMemo(() => (Array.isArray(items) && items.length ? items : TOPS).map((p) => ({ type: "card" as const, p })), [items]);
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
    <section className="w-full">
      <div className="container-max">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="https://stackfood-react.6amtech.com/_next/static/media/best_foods.7a9b751b.svg" alt="Bebidas" width={23} height={23} />
            <h2 className="text-lg sm:text-xl font-semibold">Bebidas em Destaque</h2>
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
            <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain bg-gray-50" />
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
          <Image src="https://cdn-icons-png.flaticon.com/128/4982/4982841.png" alt="Carrinho" width={20} height={20} className={`h-5 w-5 object-contain ${outOfStock ? 'opacity-60' : ''}`} />
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
              <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
              Comprar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
