"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";

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
    discount_percent?: number | null; rating_avg?: number | null; reviews_count?: number | null; active?: boolean; description?: string; banca_id?: string;
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

        // 2) Se não houver curados, buscar pelas categorias Eletrônicos e Informática
        if (!source.length) {
          const cRes = await fetch('/api/categories', { cache: 'no-store' });
          const cj = await cRes.json();
          const cats: Array<{ id: string; link?: string; name?: string }> = Array.isArray(cj?.data) ? cj.data : [];
          const getIdBySlug = (slug: string) => cats.find(c => c.link?.endsWith(`/categorias/${slug}`))?.id;
          const catEle = getIdBySlug('eletronicos');
          const catInfo = getIdBySlug('informatica');

          const fetchByCat = async (cat?: string | null) => {
            if (!cat) return [] as ApiProduct[];
            const r = await fetch(`/api/products/public?category=${encodeURIComponent(cat)}&limit=12`, { 
              next: { revalidate: 60 } as any 
            });
            if (!r.ok) return [] as ApiProduct[];
            const j = await r.json();
            const list: ApiProduct[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j?.data) ? j.data : []);
            return list;
          };

          const [listEle, listInfo] = await Promise.all([
            fetchByCat(catEle),
            fetchByCat(catInfo)
          ]);
          const merged = [...listEle, ...listInfo];
          // Dedupe by id
          const seen = new Set<string>();
          source = merged.filter(p => { if (!p?.id || seen.has(p.id)) return false; seen.add(p.id); return true; });
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

        const mapped: TopItem[] = source.slice(0, 8).map(p => ({
          id: p.id,
          title: p.name,
          vendor: (p.banca_id && bancaMap[p.banca_id]?.name) || '',
          description: p.description,
          image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop',
          price: Number(p.price || 0),
          oldPrice: p.price_original != null ? Number(p.price_original) : undefined,
          rating: p.rating_avg ?? undefined,
          reviews: p.reviews_count ?? undefined,
          available: p.active !== false,
          discountLabel: (typeof p.discount_percent === 'number' && p.discount_percent > 0) ? `-${Math.round(p.discount_percent)}%` : undefined,
        }));

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
            <Image src="https://stackfood-react.6amtech.com/_next/static/media/best_foods.7a9b751b.svg" alt="Eletrônicos e Informática" width={23} height={23} />
            <h2 className="text-lg sm:text-xl font-semibold">Eletrônicos e Informática</h2>
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
  const [fav, setFav] = useState(false);
  const { addToCart } = useCart();
  const { show } = useToast();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Badge de pronta entrega com raio
  const ReadyBadge = () => (
    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
      </svg>
      Pronta Entrega
    </span>
  );

  return (
    <div className="block rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Imagem com padding + overlay de ações */}
      <div className="p-2">
        <div className="relative h-48 md:h-72 w-full rounded-xl overflow-hidden">
          <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
          <DiscountBadge text={p.discountLabel} />
          {!p.available && (
            <div className="absolute inset-0 bg-black/55 grid place-items-center">
              <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-gray-800">Not Available Now</span>
            </div>
          )}
          {/* Overlay ações */}
          <div className="absolute right-2 top-2 flex items-center gap-2">
            {/* Visualizar */}
            <Link href={("/produto/" + p.id) as any} className="backdrop-blur bg-white/60 hover:bg-white/80 h-8 w-8 rounded-md grid place-items-center shadow transition" aria-label="Visualizar">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 115-5 5 5 0 01-5 5zm0-8a3 3 0 103 3 3 3 0 00-3-3z"/></svg>
            </Link>
            {/* Favoritar */}
            <button onClick={() => setFav((v)=>!v)} aria-pressed={fav} aria-label="Favoritar" className={`backdrop-blur h-8 w-8 rounded-md grid place-items-center shadow transition ${fav ? "bg-rose-500/90 text-white" : "bg-white/60 hover:bg-white/80 text-gray-700"}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 21s-6.7-4.4-9.2-7.7A5.6 5.6 0 0112 6.3a5.6 5.6 0 019.2 7C18.7 16.6 12 21 12 21z"/></svg>
            </button>
            {/* Adicionar ao carrinho */}
            <button onClick={() => { addToCart({ id: p.id, name: p.title, price: p.price, image: p.image }, 1); show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as any)} className="underline font-semibold">Ver carrinho</Link></span>); }} aria-label="Adicionar ao carrinho" className="backdrop-blur bg-white/60 hover:bg-white/80 h-8 w-8 rounded-md grid place-items-center shadow transition">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7 4h-2l-1 2h2l3.6 7.6-1.35 2.45A1 1 0 0010.1 18h8.4v-2h-7.3l.9-1.6h5.8a1 1 0 00.9-.6L22 7H6.2zM7 20a2 2 0 102-2 2 2 0 00-2 2zm8 0a2 2 0 102-2 2 2 0 00-2 2z"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.title}</div>
            <div className="text-[12px] text-gray-600 line-clamp-1">{p.vendor}</div>
            {p.description && (
              <div className="text-[12px] text-gray-500 line-clamp-1">{p.description}</div>
            )}
          </div>
          <ReadyBadge />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <RatingPill rating={p.rating} reviews={p.reviews} />
          <span className="text-[11px] text-gray-500">{(p.reviews ?? 1) * 25}+ avaliações</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[#ff5c00] font-extrabold">R$ {p.price.toFixed(2)}</span>
          {typeof p.oldPrice === "number" && (
            <span className="text-gray-400 line-through text-[12px]">R$ {p.oldPrice.toFixed(2)}</span>
          )}
        </div>
        {/* Botões */}
        <div className="mt-2 flex flex-col gap-2">
          <button className="w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-xs font-semibold text-white shadow hover:opacity-95" onClick={() => { addToCart({ id: p.id, name: p.title, price: p.price, image: p.image }, 1); show(<span>Adicionado ao carrinho. <Link href={("/carrinho" as any)} className="underline font-semibold">Ver carrinho</Link></span>); }}>Adicionar ao carrinho</button>
          <button className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-[#ff5c00] bg-white px-3 py-0.5 text-xs font-semibold text-[#ff5c00] leading-tight hover:bg-[#fff3ec]">
            <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
            Comprar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
