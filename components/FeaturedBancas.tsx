"use client";

import Image from "next/image";
import Link from "next/link";
import { buildBancaHref } from "@/lib/slug";
import { useEffect, useMemo, useState } from "react";
import { useCategories } from "@/lib/useCategories";
import { BANCAS_MOCK } from "@/data/bancas";
import { haversineKm, loadStoredLocation, UserLocation } from "@/lib/location";
import type { Route } from "next";

// Mock de capas e categorias por banca (substituível futuramente por API)
const COVER_BY_ID: Record<string, { image: string; openText?: string; rating: number; categories: { name: string; icon: string }[] }> = {
  "b1": {
    image: "https://images.unsplash.com/photo-1561644248-0380c8900032?q=80&w=1200&auto=format&fit=crop",
    openText: "ABRE às 07:00",
    rating: 4.8,
    categories: [
      { name: "Revistas", icon: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=40&w=40&auto=format&fit=crop" },
      { name: "Jornais", icon: "https://images.unsplash.com/photo-1495020689067-958852a7765e?q=40&w=40&auto=format&fit=crop" },
      { name: "Papelaria", icon: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=40&w=40&auto=format&fit=crop" },
    ],
  },
  "b2": {
    image: "https://storage.caosplanejado.com/uploads/2024/09/Banca-Capa.webp",
    rating: 4.6,
    categories: [
      { name: "Colecionáveis", icon: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=40&w=40&auto=format&fit=crop" },
      { name: "Quadrinhos", icon: "https://images.unsplash.com/photo-1558888400-16fdd38fbb47?q=40&w=40&auto=format&fit=crop" },
      { name: "Snacks", icon: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=40&w=40&auto=format&fit=crop" },
    ],
  },
  "b3": {
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop",
    rating: 4.9,
    categories: [
      { name: "Bebidas", icon: "https://images.unsplash.com/photo-1514361892635-6b07e31e75fb?q=40&w=40&auto=format&fit=crop" },
      { name: "Recargas", icon: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=40&w=40&auto=format&fit=crop" },
      { name: "Conveniência", icon: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=40&w=40&auto=format&fit=crop" },
    ],
  },
};

// Fallback de produtos/categorias (quando não houver mapeamento específico)
const DEFAULT_CATEGORIES: { name: string; icon: string }[] = [
  { name: "Sanduíches", icon: "https://images.unsplash.com/photo-1550547660-8b1290f252a9?q=40&w=40&auto=format&fit=crop" },
  { name: "Bebidas", icon: "https://images.unsplash.com/photo-1514361892635-6b07e31e75fb?q=40&w=40&auto=format&fit=crop" },
  { name: "Snacks", icon: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?q=40&w=40&auto=format&fit=crop" },
];

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z"/></svg>
    );
    if (i === full && half) return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-amber-400" fill="currentColor"><defs><linearGradient id="half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" fill="url(#half)"/><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z" fill="none" stroke="currentColor"/></svg>
    );
    return (
      <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 text-gray-300" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.88L18.18 22 12 18.77 5.82 22 7 14.15l-5-4.88 6.91-1.01L12 2z"/></svg>
    );
  });
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

function BancaCard({
  id,
  name,
  address,
  distance,
  cover,
  rating,
  categories,
  uf,
  description,
  featured,
  priority = false,
}: {
  id: string;
  name: string;
  address: string;
  distance: number | null;
  cover: string;
  rating: number;
  categories: { name: string; icon: string }[];
  uf: string;
  description?: string;
  featured?: boolean;
  priority?: boolean;
}) {
  // badges reais de categorias derivadas dos produtos
  const [catBadges, setCatBadges] = useState<Array<{ name: string; icon: string }>>([]);
  const { items: allCats } = useCategories();
  useEffect(() => {
    // OTIMIZAÇÃO: Usar dados mock primeiro para carregamento instantâneo
    const mockData = COVER_BY_ID[id];
    if (mockData) {
      setCatBadges(mockData.categories);
    }

    // Carregar dados reais em background (não bloqueia renderização)
    let alive = true;
    const loadRealData = async () => {
      try {
        const res = await fetch(`/api/bancas/${id}/products`, {
          next: { revalidate: 300 } // Cache por 5 minutos
        });
        if (!res.ok) return;
        const j = await res.json();
        const list: any[] = Array.isArray(j?.data) ? j.data : [];
        const mapped = list
          .map((p) => ({
            id: p.id,
            name: p.name || 'Produto',
            image: Array.isArray(p.images) && p.images.length ? p.images[0] : (p.image || ''),
            price: p.price || 0,
            category_id: p.category_id || '',
          }))
          .filter((p) => p.image);
        if (alive) {
          // gerar badges de categorias a partir dos produtos
          const counts = new Map<string, number>();
          mapped.forEach(p => { if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) || 0) + 1); });
          const top = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([catId])=>{
            const found = allCats.find(c=>c.key===catId);
            return { name: found?.name || 'Categoria', icon: found?.image || 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=40&w=40&auto=format&fit=crop' };
          });
          setCatBadges(top);
        }
      } catch {
        // silencioso: mantém fallback
      }
    };
    
    // Executar após um pequeno delay para não bloquear renderização
    setTimeout(loadRealData, 100);
    
    return () => {
      alive = false;
    };
  }, [id, allCats]);
  const distanceLabel = distance == null ? null : (distance > 3 ? "+3Km" : `${Math.max(1, Math.round(distance))}Km`);
  const openNow = useMemo(() => {
    try {
      const h = new Date().getHours();
      return h >= 6 && h < 20; // janela padrão 06:00-19:59
    } catch {
      return true;
    }
  }, []);
  return (
    <Link href={(buildBancaHref(name, id, uf) as Route)} className="block min-h-[22rem] rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100">
        <Image 
          src={cover} 
          alt={name} 
          fill 
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 45vw, 30vw"
          className="object-cover" 
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
        />
        {/* Removido badge de distância para não poluir a imagem */}
        {featured && (
          <div className="absolute left-2 top-2 z-10 inline-flex items-center rounded-full bg-orange-50 text-[#ff5c00] border border-orange-200 px-2 py-[2px] text-[11px]">Destaque</div>
        )}
      </div>
      <div className="p-3 space-y-2">
        {/* Estrelas + nota + status de abertura */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Stars value={rating} />
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-emerald-700 font-semibold">{rating.toFixed(1)}</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-[2px] text-[11px] font-semibold ${openNow ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}
            aria-label={openNow ? 'Banca aberta agora' : 'Banca fechada agora'}
          >
            {openNow ? 'Aberta' : 'Fechada'}
          </span>
        </div>
        {/* Nome */}
        <div className="text-[13px] font-semibold leading-snug line-clamp-2">{name}</div>
        {/* Descrição curta */}
        {description && (
          <div className="-mt-1 text-[12px] text-gray-700 line-clamp-2">{description}</div>
        )}
        {/* Ver no Mapa */}
        <div className="mt-1 flex items-center">
          <span className="inline-flex items-center gap-1 text-[12px] text-black">
            <Image src="https://cdn-icons-png.flaticon.com/128/2875/2875433.png" alt="Mapa" width={14} height={14} className="h-3.5 w-3.5 rounded-full object-contain" />
            Ver no Mapa
          </span>
        </div>
        <div className="text-xs text-gray-700">
          <div className="mt-3">
            <span className="inline-flex w-full items-center justify-center rounded-full bg-[#ff5c00] px-4 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-[#ff7a33]">
              Ver Banca
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedBancas() {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  useEffect(() => setLoc(loadStoredLocation()), []);
  const uf = (loc?.state || "SP").toLowerCase();

  // Bancas reais do Admin CMS
  type ApiBanca = { id: string; name: string; address?: string; lat?: number; lng?: number; cover: string; rating?: number; featured?: boolean; categories?: string[]; active: boolean; order: number };
  const [apiBancas, setApiBancas] = useState<ApiBanca[] | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/bancas', { 
          next: { revalidate: 60 } as any // Cache de 60 segundos
        });
        if (!res.ok) throw new Error('fail');
        const j = await res.json();
        const list = Array.isArray(j?.data) ? (j.data as ApiBanca[]) : [];
        setApiBancas(list.filter(b => b.active));
      } catch {
        setApiBancas([]);
      }
    })();
  }, []);

  // Descrições curtas temporárias (meta-história)
  const DESCRIPTIONS: Record<string, string> = {
    b1: "Desde 1982 conectando leitores com as melhores revistas e jornais da Paulista.",
    b2: "Tradição no centro histórico com atendimento rápido e seleção especial de títulos.",
    b3: "Referência em Pinheiros: quadrinhos, papelaria e um papo com o jornaleiro.",
    b4: "Ponto clássico de Moema, com conveniência e novidades toda semana.",
    b5: "No Ibirapuera, perfeita para um passeio com parada para revistas e snacks.",
  };

  const rawItems = useMemo(() => {
    const source: Array<{ id: string; name: string; address?: string; lat?: number; lng?: number; cover: string; rating?: number; featured?: boolean; categories?: { name: string; icon: string }[] }>
      = (apiBancas && apiBancas.length) ?
        apiBancas.map((b) => ({
          id: b.id,
          name: b.name,
          address: b.address,
          lat: b.lat,
          lng: b.lng,
          cover: b.cover,
          rating: typeof b.rating === 'number' ? b.rating : 4.7,
          featured: Boolean(b.featured),
          categories: DEFAULT_CATEGORIES, // placeholder até termos ícones reais por categoria
        }))
      : BANCAS_MOCK.map((b) => ({
          id: b.id,
          name: b.name,
          address: b.address,
          lat: b.lat,
          lng: b.lng,
          cover: COVER_BY_ID[b.id]?.image || "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop",
          rating: COVER_BY_ID[b.id]?.rating ?? 4.7,
          categories: (COVER_BY_ID[b.id]?.categories ?? DEFAULT_CATEGORIES),
        }));

    const mapped = source.map((b) => {
      const distance = (loc && typeof b.lat === 'number' && typeof b.lng === 'number')
        ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: b.lat, lng: b.lng })
        : null;
      return { id: b.id, name: b.name, address: b.address || '', distance, cover: b.cover, rating: b.rating || 4.7, featured: b.featured, categories: b.categories || DEFAULT_CATEGORIES };
    }).sort((a, b) => {
      // Destaque primeiro
      if (Boolean(a.featured) !== Boolean(b.featured)) return Boolean(b.featured) ? 1 * -1 : 1; // featured true vem antes
      // Depois por distância quando disponível
      if (a.distance == null && b.distance != null) return 1;
      if (b.distance == null && a.distance != null) return -1;
      if (a.distance != null && b.distance != null) return a.distance - b.distance;
      // Fallback por rating desc
      return (b.rating || 0) - (a.rating || 0);
    });

    if (mapped.length < 9) {
      const fill = [] as typeof mapped;
      while (fill.length + mapped.length < 9) fill.push(...mapped);
      return [...mapped, ...fill].slice(0, 9);
    }
    return mapped.slice(0, 12);
  }, [apiBancas, loc]);

  // Slider responsivo: 1/2/3 por view
  const [w, setW] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const perView = w < 640 ? 1 : w < 1024 ? 2 : 4; // 4 por view no desktop
  const isMobile = w < 768;

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const gapRem = 1.5;
  const normalized = useMemo(() => {
    const minCount = 6;
    if (rawItems.length >= minCount) return rawItems;
    const out: typeof rawItems = [] as any;
    let i = 0;
    while (out.length < minCount) {
      out.push(rawItems[i % rawItems.length]);
      i++;
    }
    return out;
  }, [rawItems]);
  const trackItems = useMemo(() => [...normalized, ...normalized], [normalized]);

  useEffect(() => {
    if (isMobile) return; // autoplay somente no desktop/tablet
    const id = setInterval(() => {
      setIndex((i) => i + 1);
      setAnimating(true);
    }, 5000);
    return () => clearInterval(id);
  }, [isMobile]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => i + 1);

  return (
    <section className="w-full">
      <div className="container-max relative px-3 sm:px-6 md:px-8 py-6">
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">Bancas perto de você</h2>
            <p className="text-sm text-gray-600">Recomendações perto de você</p>
          </div>
          <Link href="/bancas-perto-de-mim" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todas</Link>
        </div>
        {/* Carrossel: mobile scroll-snap manual, desktop slider com setas */}
        {isMobile ? (
          <div className="relative z-10 py-2">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 snap-x snap-mandatory">
                {normalized.map((b, i) => (
                  <div key={`${b.id}-${i}`} className="shrink-0 snap-start" style={{ flex: `0 0 calc(88%)` }}>
                    <BancaCard {...b} uf={uf} description={DESCRIPTIONS[b.id as keyof typeof DESCRIPTIONS]} priority={i === 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-2">
            {/* Viewport com gutters para as setas (evita que o card entre sob a seta) */}
            <div className="overflow-hidden px-6">
              <div
                className="flex gap-6"
                style={{
                  transform: `translateX(-${(index * (100 / perView))}%)`,
                  transition: animating ? "transform 600ms ease" : "none",
                }}
                onTransitionEnd={() => {
                  if (index >= normalized.length) {
                    setAnimating(false);
                    setIndex(0);
                    requestAnimationFrame(() => setAnimating(true));
                  }
                }}
              >
                {trackItems.map((b, i) => (
                  <div
                    key={`${b.id}-${i}`}
                    className="shrink-0"
                    style={{ flex: `0 0 calc((100% - ${(perView - 1) * gapRem}rem) / ${perView})` }}
                  >
                    <BancaCard {...b} uf={uf} description={DESCRIPTIONS[b.id as keyof typeof DESCRIPTIONS]} priority={i < perView} />
                  </div>
                ))}
              </div>
            </div>
            {/* Arrows desktop */}
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próximo"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 items-center justify-center rounded-full bg-white/90 border border-gray-200 shadow hover:bg-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        )}
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar{ display:none; }
          .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
        `}</style>
      </div>
    </section>
  );
}
