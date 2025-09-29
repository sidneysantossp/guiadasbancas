"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type Oferta = {
  id: string;
  name: string;
  image: string;
  price: number; // novo preço (com desconto aplicado)
  rating?: number;
  reviews?: number;
  ready?: boolean;
  discountPercent?: number; // para exibição e ordenação
};

const MOCK_OFERTAS: Oferta[] = [
  {
    id: "p1",
    name: "Chocolate Sprinkle Donut",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop",
    price: 120,
    rating: 4.7,
    reviews: 23,
    ready: true,
    discountPercent: 20,
  },
  {
    id: "p2",
    name: "Croissant",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
    price: 47.5,
    rating: 4.8,
    reviews: 12,
    ready: true,
    discountPercent: 10,
  },
  {
    id: "p3",
    name: "Samosa",
    image: "https://images.unsplash.com/photo-1604908176997-43162a5fae9b?q=80&w=800&auto=format&fit=crop",
    price: 2,
    rating: 4.5,
    reviews: 7,
    ready: true,
    discountPercent: 15,
  },
  {
    id: "p4",
    name: "Lanche Especial",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
    price: 35.9,
    rating: 4.6,
    reviews: 18,
    ready: true,
    discountPercent: 25,
  },
  {
    id: "p5",
    name: "Bebida Gelada",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    price: 7.9,
    rating: 4.2,
    reviews: 10,
    ready: true,
    discountPercent: 5,
  },
];

function Stars({ value = 5 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
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
    </span>
  );
}

export default function OfertasPageClient({ params }: { params: { uf: string; slug: string } }) {
  const [sort, setSort] = useState<"discount" | "price" | "rating">("discount");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  // Persistir preferências básicas
  useEffect(() => {
    try {
      const s = localStorage.getItem("gdb_offers_sort");
      if (s === "discount" || s === "price" || s === "rating") setSort(s);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("gdb_offers_sort", sort); } catch {}
  }, [sort]);

  const enriched = useMemo(() => {
    return MOCK_OFERTAS.map((p) => {
      const d = Math.max(0, Math.min(90, p.discountPercent ?? 0));
      const oldPrice = p.price * (100 / Math.max(1, 100 - d));
      return { ...p, oldPrice, discount: d } as Oferta & { oldPrice: number; discount: number };
    });
  }, []);

  const filtered = useMemo(() => {
    let arr = [...enriched];
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) arr = arr.filter((p) => p.price >= min);
    if (!isNaN(max)) arr = arr.filter((p) => p.price <= max);
    if (minRating > 0) arr = arr.filter((p) => (p.rating ?? 0) >= minRating);
    if (sort === "price") arr.sort((a, b) => a.price - b.price);
    else if (sort === "rating") arr.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    else arr.sort((a, b) => (b as any).discount - (a as any).discount);
    return arr;
  }, [enriched, minPrice, maxPrice, minRating, sort]);

  const pageSize = 12;
  const visible = filtered.slice(0, page * pageSize);
  const hasMore = visible.length < filtered.length;

  const title = `Ofertas e Promoções`;

  return (
    <section className="container-max py-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold flex items-center gap-2"><span className="text-[#ff5c00]">🔥</span> {title}</h1>
        <Link href={`/banca/${params.uf}/${params.slug}`} className="text-sm text-[#ff5c00] hover:underline">Voltar à banca</Link>
      </div>

      {/* Filtros */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-xl border border-gray-200 bg-white p-3">
        <div className="sm:col-span-3">
          <label className="block text-[12px] text-gray-600 mb-1">Ordenar</label>
          <select value={sort} onChange={(e)=>setSort(e.target.value as any)} className="w-full rounded-md border border-gray-300 bg-white text-sm px-2 py-2">
            <option value="discount">Maior desconto</option>
            <option value="price">Menor preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <label className="block text-[12px] text-gray-600 mb-1">Preço mínimo</label>
          <input className="w-full rounded-md border border-gray-300 bg-white text-sm px-2 py-2" placeholder="0,00" value={minPrice} onChange={(e)=>setMinPrice(e.target.value.replace(/[^0-9.,]/g, ""))} />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-[12px] text-gray-600 mb-1">Preço máximo</label>
          <input className="w-full rounded-md border border-gray-300 bg-white text-sm px-2 py-2" placeholder="100,00" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value.replace(/[^0-9.,]/g, ""))} />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-[12px] text-gray-600 mb-1">Avaliação mínima</label>
          <select value={minRating} onChange={(e)=>setMinRating(parseFloat(e.target.value))} className="w-full rounded-md border border-gray-300 bg-white text-sm px-2 py-2">
            <option value={0}>Todas</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </div>
      </div>

      {/* Resultado */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {visible.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
            <div className="relative h-36 w-full">
              <Image src={p.image} alt={p.name} fill className="object-cover" />
              {p.discountPercent && (
                <div className="absolute left-2 top-2">
                  <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-600 px-2 py-[2px] text-[10px] font-semibold border border-rose-100">-{Math.round(p.discountPercent)}%</span>
                </div>
              )}
            </div>
            <div className="p-3 flex flex-col h-full">
              <div className="text-[13px] font-semibold md:line-clamp-1">{p.name}</div>
              <div className="mt-1 flex items-center justify-between">
                <Stars value={p.rating ?? 5} />
                <span className="text-[11px] text-gray-500">{p.reviews ?? 0} avaliações</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[#ff5c00] font-extrabold">R$ {p.price.toFixed(2)}</span>
                {p.discountPercent && (
                  <span className="text-[11px] text-gray-400 line-through">R$ {(p.price * (100 / Math.max(1, 100 - p.discountPercent))).toFixed(2)}</span>
                )}
              </div>
              <div className="mt-auto pt-2 flex flex-col gap-2">
                <button className="w-full rounded-md bg-[#ff5c00] px-3 py-2 text-[12px] font-semibold text-white hover:opacity-95">Adicionar ao carrinho</button>
                <button className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-[#ff5c00] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#ff5c00] leading-tight hover:bg-[#fff3ec] whitespace-nowrap">
                  <Image src="https://cdn-icons-png.flaticon.com/128/733/733585.png" alt="WhatsApp" width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                  Comprar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <button onClick={()=>setPage((p)=>p+1)} className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Carregar mais</button>
        </div>
      )}
    </section>
  );
}
