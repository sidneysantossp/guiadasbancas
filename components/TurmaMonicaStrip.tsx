"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useEffect, useMemo, useState } from "react";

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
};

type MonicaProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
  ratingAvg?: number | null;
  reviewsCount?: number | null;
  codigo_mercos?: string;
};

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
      <span className="ml-1 text-[11px] text-gray-500">{Number(count ?? 0)} avaliação{Number(count ?? 0) === 1 ? "" : "s"}</span>
    </span>
  );
}

function MonicaCard({ p }: { p: MonicaProduct }) {
  const { addToCart } = useCart();
  const { show } = useToast();

  const price = p.price ?? 0;
  const discount = typeof p.discountPercent === "number" ? Math.round(p.discountPercent) : undefined;
  const hasDiscount = discount && discount > 0;

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, 1);
    show(<span>Adicionado ao carrinho.</span>);
  };

  const href = ("/produto/" + slugify(p.name) + "-" + p.id) as Route;

  const handleWhatsApp = (event: React.MouseEvent) => {
    event.preventDefault();
    const price = p.price ?? 0;
    const productPath = href as string;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = origin ? `${origin}${productPath}` : productPath;
    const codeText = p.codigo_mercos ? ` (cód. ${p.codigo_mercos})` : "";
    const message = `Olá! Tenho interesse no produto: ${p.name}${codeText} por R$ ${price.toFixed(2)}.\n\nVer produto: ${productUrl}`;
    if (typeof window !== "undefined") {
      window.location.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }
  };

  return (
    <Link href={href} className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative px-4 pt-4 pb-3">
        {hasDiscount && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center rounded-md bg-[#ff5c00] px-2.5 py-1 text-xs font-bold text-white shadow">
            -{discount}%
          </span>
        )}
        <div className="relative mx-auto h-40 w-full max-w-[160px]">
          <div className="absolute inset-0 rounded-2xl bg-[#fff7ec]" aria-hidden></div>
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            className="object-contain p-4"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">
        <h3 className="text-sm font-semibold leading-snug text-gray-900 line-clamp-2">
          {p.name}
        </h3>
        {p.codigo_mercos && (
          <div className="text-[11px] text-gray-500 font-mono mt-0.5">
            Cód: {p.codigo_mercos}
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          <Stars value={p.ratingAvg} count={p.reviewsCount} />
        </div>
        <div className="mt-2 flex flex-col gap-1 text-gray-700">
          {p.priceOriginal && p.priceOriginal > price && (
            <span className="text-xs text-gray-500">
              R$ <span className="line-through">{p.priceOriginal.toFixed(2)}</span>
            </span>
          )}
          <span className="text-lg font-extrabold text-[#ff5c00]">
            R$ {price.toFixed(2)}
          </span>
        </div>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full rounded px-2.5 py-1.5 text-[11px] font-semibold bg-[#ff5c00] text-white hover:opacity-95"
          >
            Adicionar ao Carrinho
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 px-2.5 py-1.5 text-[11px] font-semibold"
          >
            <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
            Comprar pelo WhatsApp
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function TurmaMonicaStrip() {
  const [items, setItems] = useState<MonicaProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const HQS_COMICS_ID = "1e813114-e1bc-442d-96e4-2704910d157d";
        const r = await fetch(`/api/products/public?category=${encodeURIComponent(HQS_COMICS_ID)}&limit=50&sort=created_at&order=desc`, {
          next: { revalidate: 60 } as any,
        });
        if (!r.ok) {
          if (active) setItems([]);
          return;
        }
        const j = await r.json();
        const merged: ApiProduct[] = Array.isArray(j?.items) ? j.items : (Array.isArray(j?.data) ? j.data : []);

        const namePatterns = [
          /casc[aã]o/i,
          /cebolinha/i,
          /m[oô]nica/i,
          /magali/i,
          /turma da m[oô]nica/i,
        ];

        const seen = new Set<string>();
        const mapped: MonicaProduct[] = merged
          .filter((p) => {
            if (!p?.id || typeof p.price !== "number") return false;
            const name = String(p.name || "");
            if (!namePatterns.some((re) => re.test(name))) return false;
            if (seen.has(p.id)) return false;
            return true;
          })
          .map((p) => {
            seen.add(p.id);
            return {
              id: p.id,
              name: p.name,
              image: (p.images && p.images[0]) || "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop",
              price: Number(p.price || 0),
              priceOriginal: p.price_original != null ? Number(p.price_original) : null,
              discountPercent: p.discount_percent != null ? Number(p.discount_percent) : null,
              ratingAvg: p.rating_avg ?? null,
              reviewsCount: p.reviews_count ?? null,
              codigo_mercos: (p as any).codigo_mercos || undefined,
            } as MonicaProduct;
          });

        if (active) setItems(mapped.slice(0, 12));
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <section className="w-full py-4">
      <div className="container-max">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image src="https://stackfood-react.6amtech.com/_next/static/media/best_foods.7a9b751b.svg" alt="Turma da Mônica" width={23} height={23} />
              <h2 className="text-lg sm:text-xl font-semibold">Especial Turma da Mônica</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Clássicos e lançamentos da turma mais querida dos gibis.</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((p) => (
              <MonicaCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
