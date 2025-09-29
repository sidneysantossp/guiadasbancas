"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  priceOriginal?: number;
  image?: string;
  promo?: boolean;
  preSale?: boolean;
  category?: string;
  rating?: number; // 0..5
  sellerName?: string;
  sellerAvatar?: string;
  distanceKm?: number;
  readyToShip?: boolean;
  sellerLat?: number;
  sellerLng?: number;
};

const seedProducts: Product[] = [
  { id: "p1", name: "Chocolate Donut", price: 14.9, priceOriginal: 19.9, image: "/images/sample/donut1.jpg", promo: true, category: "doces", rating: 4.5, sellerName: "Banca Central", sellerAvatar: "/images/sample/seller1.jpg", readyToShip: true, sellerLat: -23.55052, sellerLng: -46.633308 },
  { id: "p2", name: "Revista Tech", price: 29.9, priceOriginal: 39.9, image: "/images/sample/mag1.jpg", promo: true, category: "revistas", rating: 4.2, sellerName: "Banca da Praça", sellerAvatar: "/images/sample/seller2.jpg", readyToShip: true, sellerLat: -23.559616, sellerLng: -46.658043 },
  { id: "p3", name: "Água 500ml", price: 4.5, priceOriginal: 5.5, image: "/images/sample/water.jpg", promo: true, category: "bebidas", rating: 4.8, sellerName: "Banca 24h", sellerAvatar: "/images/sample/seller3.jpg", readyToShip: true, sellerLat: -23.563099, sellerLng: -46.654387 },
  { id: "p4", name: "Café Moído Premium", price: 39.9, priceOriginal: 49.9, image: "/images/sample/coffee.jpg", promo: true, category: "cafe", rating: 4.0, sellerName: "Banca Gourmet", sellerAvatar: "/images/sample/seller4.jpg", readyToShip: false, sellerLat: -23.562, sellerLng: -46.64 },
  { id: "p5", name: "Biscoito Integral", price: 7.9, priceOriginal: 10.9, image: "/images/sample/biscuit.jpg", promo: true, category: "snacks", rating: 4.1, sellerName: "Banca Vida", sellerAvatar: "/images/sample/seller2.jpg", readyToShip: true, sellerLat: -23.553, sellerLng: -46.63 },
  { id: "p6", name: "Suco Natural 1L", price: 8.9, priceOriginal: 12.9, image: "/images/sample/juice.jpg", promo: true, category: "bebidas", rating: 4.6, sellerName: "Banca Natural", sellerAvatar: "/images/sample/seller1.jpg", readyToShip: true, sellerLat: -23.548, sellerLng: -46.636 },
  { id: "p7", name: "Revista Games", price: 24.9, priceOriginal: 34.9, image: "/images/sample/mag2.jpg", promo: true, category: "revistas", rating: 3.9, sellerName: "Banca Geek", sellerAvatar: "/images/sample/seller3.jpg", readyToShip: false, sellerLat: -23.57, sellerLng: -46.65 },
  { id: "p8", name: "Barra de Cereal", price: 3.9, priceOriginal: 5.9, image: "/images/sample/cereal.jpg", promo: true, category: "snacks", rating: 4.3, sellerName: "Banca Fit", sellerAvatar: "/images/sample/seller4.jpg", readyToShip: true, sellerLat: -23.545, sellerLng: -46.62 },
  { id: "p9", name: "Chá Verde", price: 12.9, priceOriginal: 15.9, image: "/images/sample/tea.jpg", promo: true, category: "bebidas", rating: 4.0, sellerName: "Banca Oriente", sellerAvatar: "/images/sample/seller2.jpg", readyToShip: true, sellerLat: -23.58, sellerLng: -46.66 },
  { id: "p10", name: "Cookie Artesanal", price: 9.9, priceOriginal: 13.9, image: "/images/sample/cookie.jpg", promo: true, category: "doces", rating: 4.7, sellerName: "Banca Doce", sellerAvatar: "/images/sample/seller1.jpg", readyToShip: true, sellerLat: -23.552, sellerLng: -46.642 },
];

function PromocoesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [all, setAll] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [order, setOrder] = useState("distance_asc");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [savedSearches, setSavedSearches] = useState<{id:string; name:string; params:string}[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [userPos, setUserPos] = useState<{lat:number; lng:number} | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    // Poderíamos integrar com API. Por hora, seed simples
    try {
      const raw = localStorage.getItem("gb:promos");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) { setAll(list); }
      } else {
        setAll(seedProducts);
        localStorage.setItem("gb:promos", JSON.stringify(seedProducts));
      }
    } catch {
      setAll(seedProducts);
    }
    setLoading(false);
  }, []);

  // Geolocalização e cálculo de distância
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        setGeoError(null);
      },
      () => {
        setGeoError('Não foi possível obter sua localização. Ordenação por relevância aplicada.');
        setOrder((curr) => curr === 'distance_asc' ? 'relevance' : curr);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!userPos) return;
    const R = 6371; // km
    const toRad = (v:number) => (v * Math.PI) / 180;
    const compute = (a:number,b:number,c:number,d:number) => {
      const dLat = toRad(c - a); const dLon = toRad(d - b);
      const la1 = toRad(a); const la2 = toRad(c);
      const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
      return 2 * R * Math.asin(Math.sqrt(x));
    };
    setAll(prev => prev.map(p => {
      if (typeof p.sellerLat === 'number' && typeof p.sellerLng === 'number') {
        const dist = compute(userPos.lat, userPos.lng, p.sellerLat, p.sellerLng);
        return { ...p, distanceKm: dist };
      }
      return p;
    }));
  }, [userPos]);

  // Carrega filtros da URL
  useEffect(() => {
    if (!searchParams) return;
    const qp = searchParams.get("q") || "";
    const qc = searchParams.get("cat") || "";
    const qo = searchParams.get("order") || "relevance";
    const pmin = searchParams.get("min") || "";
    const pmax = searchParams.get("max") || "";
    setQ(qp);
    setCat(qc);
    setOrder(qo);
    setPriceMin(pmin);
    setPriceMax(pmax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

  // Carregar buscas salvas
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gb:savedSearches:promos');
      if (raw) setSavedSearches(JSON.parse(raw));
    } catch {}
  }, []);

  // Atualiza URL quando filtros mudam
  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("cat", cat);
    if (order && order !== "relevance") params.set("order", order);
    if (priceMin) params.set("min", priceMin);
    if (priceMax) params.set("max", priceMax);
    const qs = params.toString();
    const url = qs ? `/promocoes?${qs}` : "/promocoes";
    router.replace(url as any);
    setPage(1); // resetar paginação quando filtros mudam
  }, [q, cat, order, priceMin, priceMax, router]);

  const cats = useMemo(() => {
    const s = new Set<string>();
    for (const p of all) if (p.category) s.add(p.category);
    return Array.from(s);
  }, [all]);

  const items = useMemo(() => {
    let list = all.filter(p => p.promo);
    if (q.trim()) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    if (cat) list = list.filter(p => p.category === cat);
    const min = parseFloat(priceMin || "");
    const max = parseFloat(priceMax || "");
    if (!isNaN(min)) list = list.filter(p => p.price >= min);
    if (!isNaN(max)) list = list.filter(p => p.price <= max);
    if (order === "distance_asc") list = list.slice().sort((a,b)=>{
      const da = typeof a.distanceKm === 'number' ? a.distanceKm : Number.POSITIVE_INFINITY;
      const db = typeof b.distanceKm === 'number' ? b.distanceKm : Number.POSITIVE_INFINITY;
      return da - db;
    });
    if (order === "price_asc") list = list.slice().sort((a,b)=>a.price-b.price);
    if (order === "price_desc") list = list.slice().sort((a,b)=>b.price-a.price);
    if (order === "discount_desc") list = list.slice().sort((a,b)=>{
      const da = a.priceOriginal && a.priceOriginal>0 ? (1 - a.price / a.priceOriginal) : 0;
      const db = b.priceOriginal && b.priceOriginal>0 ? (1 - b.price / b.priceOriginal) : 0;
      return db - da;
    });
    return list;
  }, [all, q, cat, order, priceMin, priceMax]);

  const paginated = useMemo(() => items.slice(0, page * pageSize), [items, page]);

  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (q) chips.push({ key: 'q', label: `Busca: ${q}` , clear: () => setQ('') });
    if (cat) chips.push({ key: 'cat', label: `Categoria: ${cat}` , clear: () => setCat('') });
    if (priceMin) chips.push({ key: 'min', label: `Min: R$ ${parseFloat(priceMin).toFixed(2)}` , clear: () => setPriceMin('') });
    if (priceMax) chips.push({ key: 'max', label: `Max: R$ ${parseFloat(priceMax).toFixed(2)}` , clear: () => setPriceMax('') });
    if (order && order !== 'relevance') {
      const map: Record<string,string> = { price_asc: 'Menor preço', price_desc: 'Maior preço', discount_desc: 'Maior desconto' };
      chips.push({ key: 'order', label: `Ordenar: ${map[order] || order}`, clear: () => setOrder('relevance') });
    }
    return chips;
  }, [q, cat, priceMin, priceMax, order]);

  return (
    <section className="container-max py-8">
      <div className="flex items-center justify-between gap-2 md:gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Promoções</h1>
          {!loading && (
            <span className="text-sm text-gray-500">{items.length} itens</span>
          )}
        </div>
      </div>
      {geoError && (
        <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-sm flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <svg viewBox="0 0 24 24" className="h-4 w-4 mt-[2px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            <span>{geoError}</span>
          </div>
          <button onClick={()=>setGeoError(null)} className="rounded-md px-2 py-1 text-[12px] hover:bg-amber-100">Fechar</button>
        </div>
      )}
      <div className="mt-2 flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <input className="input w-64 md:w-80" placeholder="Buscar em promoções" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <div className="md:hidden">
          <button onClick={()=>setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 5h18M6 12h12M10 19h4"/></svg>
            Filtros
          </button>
        </div>
      </div>
      {/* Chips de filtros ativos */}
      {activeFilters.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {activeFilters.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.clear}
              className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-[2px] text-[12px] text-gray-700 hover:bg-gray-50"
            >
              <span>{c.label}</span>
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setQ(''); setCat(''); setOrder('relevance'); setPriceMin(''); setPriceMax(''); setPage(1); router.replace('/promocoes' as any); }}
            className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-[2px] text-[12px] text-gray-700 hover:bg-gray-50"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Buscas salvas */}
      {savedSearches.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {savedSearches.map(s => (
            <div key={s.id} className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2 py-[2px] text-[12px] text-gray-700">
              <button
                type="button"
                onClick={() => {
                  const url = s.params ? `/promocoes?${s.params}` : '/promocoes';
                  router.replace(url as any);
                }}
                className="hover:underline"
                title="Aplicar filtros salvos"
              >{s.name}</button>
              <button
                type="button"
                onClick={() => {
                  const next = savedSearches.filter(x => x.id !== s.id);
                  setSavedSearches(next);
                  try { localStorage.setItem('gb:savedSearches:promos', JSON.stringify(next)); } catch {}
                }}
                title="Excluir"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar de filtros */}
        <aside className="hidden md:block md:col-span-1 rounded-xl border border-gray-200 bg-white p-3 h-min sticky top-4">
          <div className="text-sm font-semibold mb-2">Filtros</div>
          <div className="space-y-2 text-sm">
            <div>
              <label className="text-gray-700 text-[12px]">Categoria</label>
              <select className="input mt-1" value={cat} onChange={(e)=>setCat(e.target.value)}>
                <option value="">Todas</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <input className="input w-1/2" placeholder="Min R$" value={priceMin} onChange={(e)=>setPriceMin(e.target.value.replace(/[^\d.,]/g,'').replace(',','.'))} />
              <input className="input w-1/2" placeholder="Max R$" value={priceMax} onChange={(e)=>setPriceMax(e.target.value.replace(/[^\d.,]/g,'').replace(',','.'))} />
            </div>
            <div>
              <label className="text-gray-700 text-[12px]">Ordenação</label>
              <select className="input mt-1" value={order} onChange={(e)=>setOrder(e.target.value)}>
                <option value="distance_asc">Mais próximos</option>
                <option value="relevance">Relevância</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
                <option value="discount_desc">Maior desconto</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  setQ(""); setCat(""); setOrder("relevance"); setPriceMin(""); setPriceMax(""); setPage(1);
                  router.replace("/promocoes" as any);
                }}
              >
                Limpar filtros
              </button>
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  const name = typeof window !== 'undefined' ? window.prompt('Nome da busca:') : '';
                  if (!name) return;
                  const params = new URLSearchParams();
                  if (q) params.set('q', q);
                  if (cat) params.set('cat', cat);
                  if (order && order !== 'relevance') params.set('order', order);
                  if (priceMin) params.set('min', priceMin);
                  if (priceMax) params.set('max', priceMax);
                  const qs = params.toString();
                  const entry = { id: String(Date.now()), name, params: qs };
                  const next = [...savedSearches, entry];
                  setSavedSearches(next);
                  try { localStorage.setItem('gb:savedSearches:promos', JSON.stringify(next)); } catch {}
                }}
              >
                Salvar busca
              </button>
            </div>
          </div>
        </aside>

        {/* Conteúdo */}
        <div className="md:col-span-3">
      {loading ? (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({length: pageSize}).map((_,i)=> (
            <div key={i} className="rounded-xl border border-gray-200 bg-white overflow-hidden animate-pulse">
              <div className="h-32 w-full bg-gray-100 border-b border-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="h-7 w-16 bg-gray-100 rounded ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 grid place-items-center text-center text-sm text-gray-600 rounded-2xl border border-gray-200 bg-white p-10">
          <div className="h-16 w-16 rounded-full bg-gray-100 grid place-items-center">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 21l-5-5"/><circle cx="10" cy="10" r="7"/></svg>
          </div>
          <div className="mt-2 font-semibold">Nenhum item encontrado</div>
          <div className="text-gray-500">Tente limpar os filtros ou buscar por outro termo.</div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {paginated.map(p => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              price={p.price}
              priceOriginal={p.priceOriginal}
              image={p.image}
              href="/"
              badgeLabel={p.priceOriginal ? `-${Math.round((1 - p.price / (p.priceOriginal||p.price)) * 100)}%` : "Promo"}
              badgeClassName="bg-[#fff3ec] text-[#ff5c00]"
              savingsAmount={p.priceOriginal && p.priceOriginal>p.price ? (p.priceOriginal - p.price) : undefined}
              rating={p.rating}
              sellerName={p.sellerName}
              sellerAvatar={p.sellerAvatar}
              distanceKm={p.distanceKm}
              readyToShip={p.readyToShip}
              imagePadding
              borderOrange
              ctaLabel="Eu Quero"
            />
          ))}
        </div>
      )}

      {items.length > paginated.length && (
        <div className="flex justify-center mt-6">
          <button onClick={()=>setPage(p=>p+1)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">Carregar mais</button>
        </div>
      )}
        </div>
      </div>

      {/* Drawer de filtros - Mobile */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setFiltersOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base font-semibold">Filtros</span>
              <button onClick={()=>setFiltersOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100" aria-label="Fechar">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-700 text-[12px]">Categoria</label>
                <select className="input mt-1" value={cat} onChange={(e)=>setCat(e.target.value)}>
                  <option value="">Todas</option>
                  {cats.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input className="input w-1/2" placeholder="Min R$" value={priceMin} onChange={(e)=>setPriceMin(e.target.value.replace(/[^\d.,]/g,'').replace(',','.'))} />
                <input className="input w-1/2" placeholder="Max R$" value={priceMax} onChange={(e)=>setPriceMax(e.target.value.replace(/[^\d.,]/g,'').replace(',','.'))} />
              </div>
              <div>
                <label className="text-gray-700 text-[12px]">Ordenação</label>
                <select className="input mt-1" value={order} onChange={(e)=>setOrder(e.target.value)}>
                  <option value="distance_asc">Mais próximos</option>
                  <option value="relevance">Relevância</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                  <option value="discount_desc">Maior desconto</option>
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setQ(""); setCat(""); setOrder("relevance"); setPriceMin(""); setPriceMax(""); setPage(1);
                    router.replace("/promocoes" as any);
                  }}
                >
                  Limpar filtros
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => { setFiltersOpen(false); }}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default function PromocoesPage() {
  return (
    <Suspense fallback={
      <div className="container-max py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <PromocoesPageContent />
    </Suspense>
  );
}
