"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Route } from "next";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

type MarvelProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
  ratingAvg?: number | null;
  reviewsCount?: number | null;
  codigoMercos?: string;
  banca_id?: string;
  banca_name?: string;
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
  codigo_mercos?: string;
  banca_id?: string;
};

function MarvelIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-red-600" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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

function ProductCard({ p }: { p: MarvelProduct }) {
  const { addToCart } = useCart();
  const { show } = useToast();

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
    const added = addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, banca_id: p.banca_id, banca_name: p.banca_name }, 1);
    if (added) show(<span>Adicionado ao carrinho.</span>);
  };
  const href = ("/produto/" + slugify(p.name) + "-" + p.id) as Route;

  return (
    <div className="h-full rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
      <div className="relative w-full group h-48 sm:h-56">
        <div className="absolute inset-0 p-2">
          <div className="relative h-full w-full rounded-[14px] overflow-hidden">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain bg-gray-50"
            />
            <Link
              href={href}
              aria-label={`Ver detalhes de ${p.name}`}
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
            {discount > 0 && (
              <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-md bg-red-600 text-white px-2 py-[2px] text-[11px] font-semibold shadow">
                -{discount}%
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          aria-label="Adicionar ao carrinho"
          className="absolute -bottom-5 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white shadow hover:bg-gray-50"
        >
          <Image
            src="https://cdn-icons-png.flaticon.com/128/4982/4982841.png"
            alt="Carrinho"
            width={20}
            height={20}
            className="h-5 w-5 object-contain"
          />
        </button>
      </div>

      <div className="p-2.5 flex flex-col flex-1">
        <Link href={href} className="mt-1 text-[13px] font-semibold hover:underline line-clamp-2 min-h-[2.5rem]">
          {p.name}
        </Link>
        {p.codigoMercos && (
          <div className="text-[10px] text-gray-500 font-mono mt-0.5">Cód: {p.codigoMercos}</div>
        )}
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
          <span className="text-[11px] text-gray-500">{Number(p.reviewsCount ?? 0)} avaliação{Number(p.reviewsCount ?? 0) === 1 ? '' : 's'}</span>
        </div>
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            {oldPrice && isFinite(oldPrice) ? (
              <>
                <div className="text-[12px] text-gray-600">
                  De: <span className="text-gray-400 line-through">R$ {oldPrice.toFixed(2)}</span>
                </div>
                <div className="text-[18px] text-red-600 font-extrabold">Por: R$ {price.toFixed(2)}</div>
                {installment && (
                  <div className="text-[11px] text-gray-600">10x R$ {Number(installment.toFixed(2)).toFixed(2)} sem juros</div>
                )}
              </>
            ) : (
              <>
                <div className="text-[18px] text-red-600 font-extrabold">R$ {price.toFixed(2)}</div>
                {installment && (
                  <div className="text-[11px] text-gray-600">10x R$ {Number(installment.toFixed(2)).toFixed(2)} sem juros</div>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label="Adicionar ao carrinho"
              className="w-full rounded px-2.5 py-1 text-[11px] font-semibold bg-red-600 text-white hover:opacity-95"
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
              Comprar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarvelComicsProducts() {
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 2 : w < 1024 ? 2 : 5;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const [apiItems, setApiItems] = useState<MarvelProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        // Buscar produtos da categoria Marvel Comics
        const r = await fetch(`/api/products/public?categoryName=marvel&limit=100&sort=created_at&order=desc`, {
          next: { revalidate: 60 } as any,
        });
        if (!r.ok) {
          if (active) setApiItems([]);
          return;
        }
        const j = await r.json();
        const merged: ApiProduct[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j?.data) ? j.data : []);

        const seen = new Set<string>();
        const mapped: MarvelProduct[] = merged
          .filter(p => {
            // Exigir imagem real - sem fallback para mock
            if (!p?.id || typeof p.price !== 'number' || !p.images || !p.images[0]) return false;
            if (seen.has(p.id)) return false;
            return true;
          })
          .map((p) => {
            seen.add(p.id);
            return {
              id: p.id,
              name: p.name,
              image: p.images![0],
              price: Number(p.price || 0),
              priceOriginal: p.price_original != null ? Number(p.price_original) : null,
              discountPercent: p.discount_percent != null ? Number(p.discount_percent) : null,
              ratingAvg: p.rating_avg ?? null,
              reviewsCount: p.reviews_count ?? null,
              codigoMercos: p.codigo_mercos || undefined,
              banca_id: p.banca_id || undefined,
              banca_name: (p as any).banca_name || undefined,
            } as MarvelProduct;
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
    <section className="w-full pt-8 md:pt-10">
      <div className="container-max">
        <div className="mb-3 flex items-center gap-2">
          <MarvelIcon />
          <h2 className="text-lg sm:text-xl font-semibold text-red-600">Marvel Comics</h2>
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
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
