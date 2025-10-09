"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";

export type TrendProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
  ratingAvg?: number | null;
  reviewsCount?: number | null;
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
};

function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="currentColor" aria-hidden>
      <path d="M13.5 0s1 2.5-1 5-2.5 3.5-1.5 5c0 0 1-2 3-2s4 1.5 4 5.5S14.5 24 9.5 24 1 20.5 1 15 4.5 8 8 6c0 0-.5 1.5.5 2.5C9.5 9 13.5 6.5 13.5 0z"/>
    </svg>
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function TrendCard({ p }: { p: TrendProduct }) {
  const d = typeof p.discountPercent === 'number' && p.discountPercent > 0
    ? Math.max(0, Math.min(90, Math.round(p.discountPercent)))
    : (p.priceOriginal && p.priceOriginal > p.price ? Math.round((1 - p.price / (p.priceOriginal || 1)) * 100) : 0);
  return (
    <Link href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} className="group block overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200">
      {/* Imagem com padding conforme referência */}
      <div className="p-2">
        <div className="relative h-40 w-full rounded-xl overflow-hidden">
          <Image src={p.image} alt={p.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-contain bg-gray-50" />
          {/* Overlay sutil no hover */}
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/5 transition" />
          {d > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-[#ff5c00] text-white text-[11px] font-semibold px-2 py-1 shadow">{d}% OFF</span>
          )}
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <div className="text-[13px] font-semibold leading-snug line-clamp-2 break-words">{p.name}</div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
            </svg>
            Pronta Entrega
          </span>
        </div>
        {/* Estrelas e avaliações */}
        <div className="mt-1 flex items-center gap-2 text-[#f59e0b]">
          {(() => {
            const v = Math.max(0, Math.min(5, Number(p.ratingAvg ?? 0)));
            const full = Math.floor(v);
            const half = v - full >= 0.5;
            return (
              <span className="inline-flex items-center gap-[2px]">
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
              </span>
            );
          })()}
          {(() => {
            const count = Number(p.reviewsCount ?? 0);
            return (
              <span className="text-[11px] text-gray-500">{count} avaliação{count === 1 ? '' : 's'}</span>
            );
          })()}
        </div>
        {/* Preço com De: quando promocional */}
        {typeof p.discountPercent === 'number' && p.discountPercent > 0 ? (
          <div className="mt-1">
            <div className="text-[12px] text-gray-600">
              De: <span className="text-gray-400 line-through">R$ {((p.price) / (1 - (p.discountPercent || 0) / 100)).toFixed(2)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[#ff5c00] font-bold">R$ {p.price.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[#ff5c00] font-bold">R$ {p.price.toFixed(2)}</span>
            {typeof p.priceOriginal === 'number' && p.priceOriginal > p.price && (
              <span className="text-gray-400 line-through text-[12px]">R$ {Number(p.priceOriginal).toFixed(2)}</span>
            )}
          </div>
        )}
        <div className="mt-2 flex flex-col gap-2">
          <button className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-[12px] font-semibold text-white hover:opacity-95">
            Adicionar ao carrinho
          </button>
          <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#ff5c00] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#ff5c00] hover:bg-[#fff3ec] whitespace-nowrap">
            <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
            Comprar pelo WhatsApp
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function TrendingProducts() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 4;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [apiItems, setApiItems] = useState<TrendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products/public?limit=12&sort=created_at&order=desc', { 
          next: { revalidate: 60 } as any 
        });
        let list: ApiProduct[] = [];
        if (res.ok) {
          const j = await res.json();
          list = Array.isArray(j?.data) ? j.data : (Array.isArray(j?.items) ? j.items : []);
        }
        const mapped: TrendProduct[] = list.map((p) => ({
          id: p.id,
          name: p.name,
          image: (p.images && p.images[0]) || "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop",
          price: Number(p.price || 0),
          priceOriginal: p.price_original != null ? Number(p.price_original) : null,
          discountPercent: p.discount_percent != null ? Number(p.discount_percent) : null,
          ratingAvg: p.rating_avg ?? null,
          reviewsCount: p.reviews_count ?? null,
        }));
        if (active) setApiItems(mapped);
      } catch {
        if (active) setApiItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const items = useMemo(() => apiItems, [apiItems]);
  const track = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="mb-3 flex items-center gap-2">
          <FireIcon />
          <h2 className="text-lg sm:text-xl font-semibold">Produtos em alta</h2>
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
                if (index >= items.length) {
                  setAnimating(false);
                  setIndex(0);
                  requestAnimationFrame(() => setAnimating(true));
                }
              }}
            >
              {track.map((p, i) => (
                <div key={`${p.id}-${i}`} style={{ flex: `0 0 calc(${100 / perView}% - 1rem)` }} className="shrink-0">
                  <TrendCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
