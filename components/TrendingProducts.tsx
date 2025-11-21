"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

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
  const { addToCart } = useCart();
  const { show } = useToast();
  const [favorite, setFavorite] = useState(false);

  const price = p.price ?? 0;
  const baseDiscount = typeof p.discountPercent === 'number' ? Math.round(p.discountPercent) : undefined;
  const inferredDiscount = p.priceOriginal && p.priceOriginal > price ? Math.round((1 - price / p.priceOriginal) * 100) : 0;
  const discount = typeof baseDiscount === 'number' ? Math.max(0, baseDiscount) : inferredDiscount;
  const oldPrice = (p.priceOriginal && p.priceOriginal > price)
    ? p.priceOriginal
    : (discount > 0 ? price / (1 - discount / 100) : null);
  const installment = price > 0 ? price / 10 : null;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, 1);
    show(<span>Adicionado ao carrinho.</span>);
  };

  return (
    <Link href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} className="group flex h-full flex-col rounded-[24px] border border-gray-200 bg-white shadow-[0_22px_60px_-32px_rgba(124,58,237,0.45)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_32px_90px_-40px_rgba(124,58,237,0.55)] overflow-hidden">
      <div className="relative px-5 pt-6 pb-4">
        {discount > 0 && (
          <span className="absolute left-5 top-6 z-10 inline-flex items-center rounded-md bg-[#ff5c00] px-2.5 py-1 text-xs font-bold uppercase tracking-tight text-white shadow">
            -{discount}%
          </span>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setFavorite((prev) => !prev);
          }}
          className="absolute right-5 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#7c3aed]/30 bg-white text-[#7c3aed] shadow-sm transition hover:border-[#7c3aed] hover:bg-[#f6f0ff]"
          aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M12 21s-6.3-4.35-9-8.4C-0.6 7.2 2.4 2 6.9 2c2.1 0 3.9 1.2 5.1 3 1.2-1.8 3-3 5.1-3 4.5 0 7.5 5.1 3.9 10.6-2.7 4.05-9 8.4-9 8.4z" />
          </svg>
        </button>
        <div className="relative mx-auto h-44 w-full max-w-[180px]">
          <div className="absolute inset-0 rounded-[18px] bg-[#f7f5ff]" aria-hidden></div>
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-4"
          />
          <span className="pointer-events-none absolute inset-0" aria-hidden />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6">
        {(discount > 0) && (
          <span className="inline-flex w-max items-center gap-1 rounded-full bg-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
            November Black
            <span aria-hidden className="text-base leading-none">🔥</span>
          </span>
        )}

        <h3 className="mt-3 text-sm font-extrabold uppercase leading-snug text-gray-900">
          {p.name}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-[#f59e0b]">
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
          <span className="text-[11px] text-gray-500">{Number(p.reviewsCount ?? 0)} avaliação{Number(p.reviewsCount ?? 0) === 1 ? '' : 's'}</span>
        </div>

        <div className="mt-4 flex flex-col gap-1 text-gray-700">
          {oldPrice && isFinite(oldPrice) && (
            <span className="text-xs text-gray-500">
              R$ <span className="line-through">{oldPrice.toFixed(2)}</span>
            </span>
          )}
          <span className="text-xl font-extrabold text-[#ff5c00]">
            R$ {price.toFixed(2)}
          </span>
          {installment && (
            <span className="text-xs text-gray-600">10x R$ {Number(installment.toFixed(2)).toFixed(2)} sem juros</span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-1 pt-6">
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
            className="w-full rounded px-2.5 py-1 text-[11px] font-semibold bg-[#ff5c00] text-white hover:opacity-95"
          >
            Adicionar ao Carrinho
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              const message = encodeURIComponent(`Olá! Tenho interesse em ${p.name}.`);
              if (typeof window !== "undefined") {
                window.open(`https://wa.me/?text=${message}`, "_blank", "noopener,noreferrer");
              }
            }}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 px-2.5 py-1 text-[11px] font-semibold"
          >
            <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
            Comprar
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
  const perView = w < 640 ? 2 : w < 1024 ? 2 : 4;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [apiItems, setApiItems] = useState<TrendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const HQS_COMICS_ID = '1e813114-e1bc-442d-96e4-2704910d157d';
        const r = await fetch(`/api/products/public?category=${encodeURIComponent(HQS_COMICS_ID)}&limit=24&sort=created_at&order=desc`, {
          next: { revalidate: 60 } as any,
        });
        if (!r.ok) {
          if (active) setApiItems([]);
          return;
        }
        const j = await r.json();
        const merged: ApiProduct[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j?.data) ? j.data : []);

        // Remover gibis da Turma da Mônica desta vitrine específica (HQs & Comics da home)
        const blockedNamePatterns = [
          /casc[aã]o/i,
          /cebolinha/i,
          /m[oô]nica/i,
          /magali/i,
          /turma da m[oô]nica/i,
        ];

        const seen = new Set<string>();
        const mapped: TrendProduct[] = merged
          .filter(p => {
            if (!p?.id || typeof p.price !== 'number') return false;
            const name = String(p.name || "");
            if (blockedNamePatterns.some((re) => re.test(name))) return false;
            if (seen.has(p.id)) return false;
            return true;
          })
          .map((p) => {
            seen.add(p.id);
            return {
              id: p.id,
              name: p.name,
              image: (p.images && p.images[0]) || "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop",
              price: Number(p.price || 0),
              priceOriginal: p.price_original != null ? Number(p.price_original) : null,
              discountPercent: p.discount_percent != null ? Number(p.discount_percent) : null,
              ratingAvg: p.rating_avg ?? null,
              reviewsCount: p.reviews_count ?? null,
            } as TrendProduct;
          });

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

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="container-max">
        <div className="mb-3 flex items-center gap-2">
          <FireIcon />
          <h2 className="text-lg sm:text-xl font-semibold">HQs e Comics</h2>
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
