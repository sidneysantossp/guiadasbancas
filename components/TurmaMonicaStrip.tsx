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
  banca_id?: string;
};

type ApiBanca = {
  id: string;
  name: string;
  contact?: { whatsapp?: string | null } | null;
  whatsapp?: string | null;
  phone?: string | null;
  telefone?: string | null;
  whatsapp_phone?: string | null;
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
  vendorName?: string;
  bancaPhone?: string | null;
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
      const base = p.bancaPhone ? `https://wa.me/${String(p.bancaPhone).replace(/\D/g, "")}` : "https://wa.me/";
      window.location.href = `${base}?text=${encodeURIComponent(message)}`;
    }
  };

  const hasOldPrice = typeof p.priceOriginal === "number" && p.priceOriginal > price;

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
              className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5c00]"
            />
            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition" />
            {hasDiscount && (
              <span className="absolute left-2 top-2 z-10 inline-flex items-center rounded-md bg-[#1e73ff] text-white px-2 py-[2px] text-[11px] font-semibold shadow">
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
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
            Pronta Entrega
          </span>
        </div>
        <Link href={href} className="mt-2 text-[13px] font-semibold hover:underline line-clamp-2">
          {p.name}
        </Link>
        {p.codigo_mercos && (
          <div className="text-[11px] text-gray-500 font-mono">Cód: {p.codigo_mercos}</div>
        )}
        {p.vendorName && (
          <div className="text-[12px] text-gray-600 line-clamp-1 mt-0.5 capitalize">
            {p.vendorName}
          </div>
        )}
        <div className="mt-1 flex items-center gap-2">
          <Stars value={p.ratingAvg ?? undefined} count={p.reviewsCount ?? undefined} />
        </div>
        <div className="mt-auto pt-2 flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            {hasOldPrice ? (
              <>
                <div className="text-[12px] text-gray-600">
                  De: <span className="text-gray-400 line-through">R$ {p.priceOriginal?.toFixed(2)}</span>
                </div>
                <div className="text-[18px] text-[#ff5c00] font-extrabold">Por: R$ {price.toFixed(2)}</div>
              </>
            ) : (
              <div className="text-[18px] text-[#ff5c00] font-extrabold">R$ {price.toFixed(2)}</div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={handleAddToCart}
              className="w-full rounded px-2.5 py-1 text-[11px] font-semibold bg-[#ff5c00] text-white hover:opacity-95"
            >
              Adicionar ao Carrinho
            </button>
            <button
              onClick={handleWhatsApp}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/15 px-2.5 py-1 text-[11px] font-semibold"
            >
              <Image
                src="https://cdn-icons-png.flaticon.com/128/733/733585.png"
                alt="WhatsApp"
                width={14}
                height={14}
                className="h-3.5 w-3.5 object-contain"
              />
              Comprar pelo WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TurmaMonicaStrip() {
  const [items, setItems] = useState<MonicaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);

  const perView = w < 640 ? 2 : w < 1024 ? 2 : 5;

  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
        const [productsJson, bancasRes] = await Promise.all([
          r.json(),
          fetch("/api/bancas", { next: { revalidate: 300 } as any })
        ]);

        const merged: ApiProduct[] = Array.isArray(productsJson?.items)
          ? productsJson.items
          : (Array.isArray(productsJson?.data) ? productsJson.data : []);

        let bancaMap: Record<string, { name: string; phone: string | null }> = {};
        if (bancasRes.ok) {
          try {
            const bj = await bancasRes.json();
            const list: ApiBanca[] = Array.isArray(bj?.data) ? bj.data : [];
            bancaMap = Object.fromEntries(
              list.map((b) => {
                const phone = b.contact?.whatsapp || b.whatsapp || b.phone || b.telefone || b.whatsapp_phone || null;
                return [b.id, { name: b.name, phone }];
              })
            );
          } catch {}
        }

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
            const bancaInfo = p.banca_id ? bancaMap[p.banca_id] : undefined;
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
              vendorName: bancaInfo?.name,
              bancaPhone: bancaInfo?.phone ?? null,
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

  const track = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 4500);
    return () => clearInterval(id);
  }, [items.length]);

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
                  <div
                    key={`${p.id}-${i}`}
                    style={{ flex: `0 0 calc(${100 / perView}% - 1rem)` }}
                    className="shrink-0"
                  >
                    <MonicaCard p={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
