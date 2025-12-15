"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
// BANCAS_MOCK removido - dados vêm exclusivamente da API
import homeCategories from "@/data/categories.json";
import { haversineKm, loadStoredLocation, saveStoredLocation, UserLocation, formatCep, isValidCep, resolveCepToLocation, saveCoordsAsLocation, geocodeByAddressNominatim } from "@/lib/location";
import BankCard from "@/components/BankCard";

function isOpenNowDefault(now: Date = new Date()): boolean {
  // Regra simples até termos horários reais: seg-sex 08:00-18:00, sáb 08:00-13:00, dom fechado
  const day = now.getDay(); // 0=dom, 6=sab
  const hhmm = now.getHours() * 60 + now.getMinutes();
  if (day === 0) return false; // domingo
  if (day === 6) return hhmm >= 8 * 60 && hhmm <= 13 * 60;
  return hhmm >= 8 * 60 && hhmm <= 18 * 60;
}

function closeTimeDefault(now: Date = new Date()): string | null {
  const day = now.getDay();
  if (day === 0) return null; // domingo
  if (day === 6) return "13:00";
  return "18:00";
}

function formatAddress(addr?: { cep?: string; street?: string; number?: string; neighborhood?: string; city?: string; uf?: string; complement?: string }) {
  if (!addr) return '';
  const line1 = [addr.street, addr.number].filter(Boolean).join(', ');
  const line2 = [addr.neighborhood, addr.city, addr.uf].filter(Boolean).join(' - ');
  const cep = addr.cep ? `CEP ${addr.cep}` : '';
  return [line1, line2, cep].filter(Boolean).join(' | ');
}

function summarizeHours(hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>): { open: boolean; close?: string } {
  if (!Array.isArray(hours) || hours.length === 0) return { open: true };
  const map: Record<string, { open: boolean; start: string; end: string; label: string }> = {};
  for (const h of hours) map[h.key] = { open: h.open, start: h.start, end: h.end, label: h.label };
  const now = new Date();
  const dayIdx = now.getDay();
  const key = ['sun','mon','tue','wed','thu','fri','sat'][dayIdx];
  const info = map[key];
  if (!info) return { open: true };
  const [sh, sm] = (info.start || '00:00').split(':').map(Number);
  const [eh, em] = (info.end || '23:59').split(':').map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const isOpen = info.open && cur >= startMin && cur <= endMin;
  return { open: isOpen, close: info.end };
}

const CATEGORY_LOOKUP = (() => {
  const map = new Map<string, string>();
  try {
    if (Array.isArray(homeCategories)) {
      for (const c of homeCategories as any[]) {
        if (c?.id && c?.name) {
          map.set(String(c.id), String(c.name));
        }
      }
    }
  } catch {}
  return map;
})();

const normalizeCategory = (raw: any): string => {
  const value = typeof raw === "string" ? raw.trim() : String(raw || "").trim();
  if (!value) return "";
  return CATEGORY_LOOKUP.get(value) ?? value;
};

// Capitaliza primeira letra de cada palavra (Title Case)
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function BancasPertoDeMimPage() {
  const [loc, setLoc] = useState<UserLocation | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [apiBancas, setApiBancas] = useState<any[] | null>(null);
  const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(new Map());
  const [coordsOverride, setCoordsOverride] = useState<Map<string, { lat: number; lng: number }>>(new Map());
  // Filtros
  const [maxKm, setMaxKm] = useState<number>(5); // 0..5 (5 = 5+)
  const [minStars, setMinStars] = useState<number>(0); // 0..5 (0 = qualquer)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"featured" | "distance" | "rating" | "az">("featured");
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false); // mobile painel
  const [cep, setCep] = useState<string>("");
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Carregar categorias (públicas + admin como fallback) para cobrir todos os IDs
  useEffect(() => {
    (async () => {
      try {
        const [pubRes, admRes] = await Promise.all([
          fetch('/api/categories', { cache: 'no-store' }).catch(() => null),
          fetch('/api/admin/categories?all=true', { cache: 'no-store' }).catch(() => null),
        ]);

        const pubJson = pubRes && pubRes.ok ? await pubRes.json() : { success: false, data: [] };
        const admJson = admRes && admRes.ok ? await admRes.json() : { success: false, data: [] };

        const map = new Map<string, string>();
        const add = (list: any[]) => {
          for (const cat of Array.isArray(list) ? list : []) {
            if (cat?.id && cat?.name) {
              map.set(String(cat.id), String(cat.name));
            }
          }
        };
        add(pubJson.data);
        add(admJson.data);

        if (map.size > 0) {
          setCategoriesMap(map);
        }
      } catch (e) {
        console.error('Erro ao carregar categorias:', e);
      }
    })();
  }, []);

  useEffect(() => {
    const stored = loadStoredLocation();
    if (stored) {
      setLoc(stored);
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          // Enriquecer com reverse-geocode e persistir
          (async () => {
            const saved = await saveCoordsAsLocation(latitude, longitude);
            setLoc(saved);
          })();
        },
        (err) => {
          setGeoError(err.message || "Não foi possível obter sua localização.");
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      setGeoError("Geolocalização não suportada no navegador.");
    }
  }, []);

  // Ouvir atualizações de localização da Navbar
  useEffect(() => {
    const handleLocationUpdate = (e: CustomEvent<UserLocation>) => {
      console.log('[BancasPerto] Localização atualizada via evento:', e.detail);
      setLoc(e.detail);
    };
    
    window.addEventListener('gdb:location-updated', handleLocationUpdate as EventListener);
    return () => window.removeEventListener('gdb:location-updated', handleLocationUpdate as EventListener);
  }, []);

  // Buscar bancas reais do Admin CMS; se tiver localização, usar endpoint com lat/lng para reduzir payload
  useEffect(() => {
    (async () => {
      try {
        let res: Response;
        if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
          res = await fetch(`/api/admin/bancas?lat=${encodeURIComponent(String(loc.lat))}&lng=${encodeURIComponent(String(loc.lng))}&maxKm=${encodeURIComponent(String(Math.max(1, Math.min(50, maxKm || 50))))}`, { cache: 'no-store' });
        } else {
          res = await fetch('/api/admin/bancas', { cache: 'no-store' });
        }
        if (!res.ok) throw new Error('fail');
        const j = await res.json();
        const list = Array.isArray(j?.data) ? j.data : [];
        setApiBancas(list.filter((b: any) => b?.active));
      } catch {
        setApiBancas([]);
      }
    })();
  }, [loc]);

  // Fallback: geocodificar endereço de bancas sem coordenadas para obter lat/lng aproximados
  useEffect(() => {
    if (!apiBancas || !apiBancas.length) return;
    let active = true;
    (async () => {
      try {
        const inBrazilBox = (lat: number, lng: number) => lat >= -35 && lat <= 5 && lng >= -75 && lng <= -30;
        const toNum = (v: any) => (typeof v === 'number' ? v : (v != null ? Number(String(v).replace(',', '.')) : undefined));
        const needsFix = apiBancas.filter((b: any) => {
          const lat = toNum(b.lat ?? b.location?.lat);
          const lng = toNum(b.lng ?? b.location?.lng);
          if (typeof lat !== 'number' || typeof lng !== 'number') return true; // faltando
          if (!inBrazilBox(lat, lng)) return true; // fora do BR
          // se temos loc e a banca declara SP no endereço mas distância > 150km, provavelmente errado
          if (loc && typeof loc.lat === 'number' && typeof loc.lng === 'number') {
            try {
              const d = haversineKm({ lat: loc.lat, lng: loc.lng }, { lat, lng });
              const addrStr = String(b.address || '').toLowerCase();
              // muito longe de SP => claramente errado
              if (d > 150 && (addrStr.includes('são paulo') || addrStr.includes('sp'))) return true;
              // dentro de SP, mas distância exagerada > 8 km para o contexto de "perto de mim"
              const userCity = (loc.city || '').toLowerCase();
              if (userCity && addrStr.includes(userCity) && d > 8) return true;
            } catch {}
          }
          return false;
        });
        if (!needsFix.length) return;
        const batch = needsFix.slice(0, 25);
        const entries: Array<[string, { lat: number; lng: number }]> = [];
        for (const b of batch) {
          try {
            let coords: { lat: number; lng: number } | null = null;
            // Preferir CEP quando disponível e válido
            if (b.cep && isValidCep(String(b.cep))) {
              const loc = await resolveCepToLocation(String(b.cep));
              coords = { lat: loc.lat, lng: loc.lng };
            } else {
              const addrStr = (b.address && String(b.address).trim()) || formatAddress(b.addressObj) || '';
              if (!addrStr) { await new Promise((r)=> setTimeout(r, 120)); continue; }
              const parts = [addrStr, 'Brasil'].filter(Boolean).join(', ');
              const q = b.name ? `${b.name}, ${parts}` : parts;
              const res = await geocodeByAddressNominatim(q);
              if (res) coords = res;
            }
            if (coords && isFinite(coords.lat) && isFinite(coords.lng)) {
              entries.push([b.id, { lat: coords.lat, lng: coords.lng }]);
            }
          } catch {}
          // Throttle simples para respeitar o serviço de geocodificação
          await new Promise((r)=> setTimeout(r, 200));
        }
        if (active && entries.length) {
          setCoordsOverride((prev) => {
            const next = new Map(prev);
            for (const [id, c] of entries) next.set(id, c);
            return next;
          });
        }
      } catch {}
    })();
    return () => { active = false; };
  }, [loc, apiBancas]);

  // persistência simples dos filtros
  useEffect(() => {
    try {
      localStorage.setItem('gdb_maxKm', String(maxKm));
      localStorage.setItem('gdb_minStars', String(minStars));
      localStorage.setItem('gdb_sortBy', sortBy);
      localStorage.setItem('gdb_cats', JSON.stringify(selectedCategories));
    } catch {}
  }, [maxKm, minStars, sortBy, selectedCategories]);
  useEffect(() => {
    try {
      const r1 = localStorage.getItem('gdb_maxKm');
      const r2 = localStorage.getItem('gdb_minStars');
      if (r1 != null) setMaxKm(Math.min(5, Math.max(0, Number(r1))));
      if (r2 != null) setMinStars(Math.min(5, Math.max(0, Number(r2))));
      const sb = localStorage.getItem('gdb_sortBy');
      if (sb === 'featured' || sb === 'distance' || sb === 'rating' || sb === 'az') setSortBy(sb);
      const catsStr = localStorage.getItem('gdb_cats');
      if (catsStr) { try { const arr = JSON.parse(catsStr); if (Array.isArray(arr)) setSelectedCategories(arr.filter(Boolean)); } catch {} }
    } catch {}
  }, []);

  const onSubmitCep = useCallback(async () => {
    // Mantido para uso futuro, UI removida conforme solicitado
    return;
  }, []);

  const refreshGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não suportada no navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        (async () => {
          const saved = await saveCoordsAsLocation(latitude, longitude);
          setLoc(saved);
        })();
        setGeoError(null);
      },
      (err) => setGeoError(err.message || "Não foi possível obter sua localização."),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  // Mock de avaliações por banca (até termos na API)
  const RATINGS: Record<string, number> = {
    b1: 4.8,
    b2: 4.6,
    b3: 4.9,
    b4: 4.2,
    b5: 4.0,
  };

  // Descrições curtas (meta-história) temporárias até integrar com backend
  const DESCRIPTIONS: Record<string, string> = {
    b1: "Desde 1982 conectando leitores com as melhores revistas e jornais da Paulista.",
    b2: "Tradição no centro histórico com atendimento rápido e seleção especial de títulos.",
    b3: "Referência em Pinheiros: quadrinhos, papelaria e um papo com o jornaleiro.",
    b4: "Ponto clássico de Moema, com conveniência e novidades toda semana.",
    b5: "No Ibirapuera, perfeita para um passeio com parada para revistas e snacks.",
  };

  const ordered = useMemo(() => {
    // Preferir dados da API quando disponíveis
    const source: Array<{ id: string; name: string; address?: string; lat?: number; lng?: number; rating?: number; cover?: string; avatar?: string; openNow?: boolean; close?: string; categories?: string[]; description?: string; featured?: boolean }>
      = (apiBancas && apiBancas.length)
        ? apiBancas.map((b: any) => {
            const cover = b.cover || b.images?.cover;
            const avatar = b.avatar || b.images?.avatar;
            const { open, close } = summarizeHours(b.hours);
            // Coordenadas seguras: usar override > valores do backend > b.location
            let rawLat: any = (coordsOverride.get?.(b.id)?.lat ?? b.lat ?? b.location?.lat);
            let rawLng: any = (coordsOverride.get?.(b.id)?.lng ?? b.lng ?? b.location?.lng);
            // Corrigir strings e vírgulas
            const normLat = typeof rawLat === 'number' ? rawLat : (rawLat != null ? Number(String(rawLat).replace(',', '.')) : undefined);
            const normLng = typeof rawLng === 'number' ? rawLng : (rawLng != null ? Number(String(rawLng).replace(',', '.')) : undefined);
            // Corrigir possível troca lat/lng
            const inLat = typeof normLat === 'number' ? normLat : undefined;
            const inLng = typeof normLng === 'number' ? normLng : undefined;
            let fixedLat = inLat, fixedLng = inLng;
            if (typeof inLat === 'number' && typeof inLng === 'number') {
              const latOk = Math.abs(inLat) <= 90;
              const lngOk = Math.abs(inLng) <= 180;
              const altLatOk = Math.abs(inLng) <= 90;
              const altLngOk = Math.abs(inLat) <= 180;
              // Heurística Brasil: lat ~ [-35, 5], lng ~ [-75, -30]
              const inBrazilBox = (lat: number, lng: number) => lat >= -35 && lat <= 5 && lng >= -75 && lng <= -30;
              const curInBR = inBrazilBox(inLat, inLng);
              const swappedInBR = inBrazilBox(inLng, inLat);
              if (((!latOk || !lngOk) && altLatOk && altLngOk) || (!curInBR && swappedInBR)) {
                fixedLat = inLng; fixedLng = inLat; // swap
              }
            }
            return {
            id: b.id,
            name: b.name,
            address: b.address || formatAddress(b.addressObj),
            lat: fixedLat,
            lng: fixedLng,
            rating: typeof b.rating === 'number' ? b.rating : 4.7,
            cover,
            avatar,
            openNow: open,
            close,
            categories: Array.isArray(b.categories)
              ? b.categories
                  .map((cat: any) => {
                    const id = String(cat ?? '').trim();
                    return categoriesMap.get(id) ?? normalizeCategory(id);
                  })
                  .filter(Boolean)
              : [],
            description: b.description || undefined,
            featured: Boolean(b.featured),
          };
          })
        : []; // Sem fallback - dados devem vir da API

    // Quando não há localização, ordena por nome
    if (!loc) {
      return source
        .map((b) => ({ id: b.id, name: b.name, address: b.address || '', distance: Number.POSITIVE_INFINITY, rating: b.rating ?? 4.5, cover: b.cover, avatar: b.avatar, openNow: b.openNow, close: b.close, categories: b.categories, description: b.description, featured: b.featured }))
        .sort((a, b) => (Number(b.featured) - Number(a.featured)) || a.name.localeCompare(b.name));
    }
    // Com localização: ordenar por proximidade
    return source
      .map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address || '',
        distance: (typeof b.lat === 'number' && typeof b.lng === 'number') ? haversineKm({ lat: loc.lat, lng: loc.lng }, { lat: b.lat, lng: b.lng }) : Number.POSITIVE_INFINITY,
        rating: b.rating ?? 4.5,
        cover: b.cover,
        avatar: b.avatar,
        openNow: b.openNow,
        close: b.close,
        categories: b.categories,
        description: b.description,
        featured: b.featured,
      }))
      .sort((a, b) => (Number(b.featured) - Number(a.featured)) || (a.distance - b.distance));
  }, [loc, apiBancas, categoriesMap, coordsOverride]);

  const visible = useMemo(() => {
    // aplica filtros
    const applyDistance = (d: number) => {
      if (!loc) return true; // sem localização do usuário, não filtra
      if (!isFinite(d)) return false; // com localização, ignorar bancas sem coordenadas
      if (maxKm >= 5) return true;   // 5 = 5+
      return d <= maxKm + 1e-9;
    };
    const applyStars = (r?: number) => {
      const rv = r ?? 0;
      return rv >= minStars;
    };
    const applyCategories = (b: any) => {
      if (!selectedCategories.length) return true;
      const bcats: string[] = Array.isArray(b.categories) ? b.categories : [];
      return selectedCategories.every((c) => bcats.includes(c));
    };
    let filtered = ordered.filter((b) => applyDistance(b.distance) && applyStars((b as any).rating) && applyCategories(b as any));
    // ordenar conforme sortBy
    if (sortBy === 'featured') filtered = filtered.sort((a:any,b:any)=> (Number(b.featured)-Number(a.featured)) || (a.distance - b.distance));
    if (sortBy === 'distance') filtered = filtered.sort((a:any,b:any)=> a.distance - b.distance);
    if (sortBy === 'rating') filtered = filtered.sort((a:any,b:any)=> (b.rating ?? 0) - (a.rating ?? 0));
    if (sortBy === 'az') filtered = filtered.sort((a:any,b:any)=> a.name.localeCompare(b.name));
    return filtered;
  }, [ordered, maxKm, minStars, selectedCategories, sortBy]);

  // paginação incremental
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  useEffect(()=>{ setPage(1); }, [maxKm, minStars, selectedCategories, sortBy, loc]);
  const visiblePage = useMemo(()=> visible.slice(0, page * PAGE_SIZE), [visible, page]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    for (const banca of ordered) {
      const cats = (banca as any).categories;
      if (Array.isArray(cats)) {
        cats.forEach((c: any) => {
          const key = String(c ?? '').trim();
          if (!key) return;
          const label = categoriesMap.get(key) ?? normalizeCategory(key);
          if (label) set.add(label);
        });
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR", { sensitivity: "base" }));
  }, [ordered, categoriesMap]);

  return (
    <section className="container-max pt-0 md:pt-5 pb-6">
      <h1 className="text-xl font-semibold">Bancas perto de mim</h1>

      {/* Cabeçalho e filtros (mobile) */}
      <div className="mt-1 md:mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="text-gray-700 text-sm">
          Resultados — <span className="font-medium">{visible.length}</span> bancas encontradas
          {(() => {
            const activeCount = (maxKm < 5 ? 1 : 0) + (minStars > 0 ? 1 : 0) + (selectedCategories.length > 0 ? 1 : 0);
            if (!activeCount) return null;
            return <span className="ml-2 inline-flex items-center rounded-full bg-[#fff3ec] text-[#ff5c00] px-2 py-[2px] text-[12px]">{activeCount} filtro(s)</span>;
          })()}
        </div>
        <div className="flex items-center gap-2">
          {/* Ordenação */}
          <label className="text-sm text-gray-600 hidden md:block">Ordenar:</label>
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value as any)} className="rounded-md border border-gray-300 bg-white text-sm px-2 py-2">
            <option value="featured">Destaque</option>
            <option value="distance">Distância</option>
            <option value="rating">Avaliação</option>
            <option value="az">A–Z</option>
          </select>
          {/* Toggle filtros mobile */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
              Filtros
            </button>
          </div>
          {/* Limpar tudo */}
          {((maxKm < 5) || (minStars > 0) || selectedCategories.length > 0) && (
            <button type="button" onClick={()=>{ setMaxKm(5); setMinStars(0); setSelectedCategories([]); }} className="hidden md:inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-black shadow-sm">Limpar tudo</button>
          )}
        </div>
      </div>

      {/* Painel de filtros mobile */}
      {filtersOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          {/* Distância */}
          <div>
            <div className="text-sm font-semibold">Distância</div>
            <div className="mt-2">
              <input type="range" min={0} max={5} step={1} value={maxKm} onChange={(e)=>setMaxKm(Number(e.target.value))} className="w-full accent-[#ff5c00] range-orange" />
              <div className="flex justify-between text-xs text-gray-500 mt-1 px-0.5">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>+5Km</span>
              </div>
            </div>
          </div>
          {/* Categorias */}
          <div className="mt-3">
            <div className="text-sm font-semibold">Categorias</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableCategories.map((c)=>{
                const on = selectedCategories.includes(c);
                return (
                  <button key={c} type="button" onClick={()=> setSelectedCategories((prev)=> on? prev.filter(x=>x!==c): [...prev, c])} className={`px-2 py-1 rounded-md border text-sm ${on? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]': 'bg-white border-gray-300 text-gray-700'}`}>{c}</button>
                );
              })}
            </div>
          </div>
          {/* Estrelas */}
          <div className="mt-3">
            <div className="text-sm font-semibold">Avaliação mínima</div>
            <div className="mt-2 flex items-center gap-2">
              {[0,1,2,3,4,5].map((n)=> (
                <button key={n} type="button" onClick={()=>setMinStars(n)} aria-pressed={minStars===n} className={`h-8 px-2 rounded-md border text-sm ${minStars===n? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]': 'bg-white border-gray-300 text-gray-700'}`}>
                  {n===0? 'Qualquer' : `${n}+★`}
                </button>
              ))}
            </div>
          </div>
          {/* Limpar filtros */}
          <div className="mt-3">
            <button type="button" onClick={()=>{ setMaxKm(5); setMinStars(0); setSelectedCategories([]); }} className="text-sm text-gray-700 underline hover:text-black">Limpar filtros</button>
          </div>
        </div>
      )}

      {loc && ordered.filter((b)=>b.distance <= 3).length === 0 && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
          Nenhuma banca encontrada dentro de 3 km. Mostrando outras próximas.
          <button
            type="button"
            onClick={refreshGeo}
            className="ml-2 underline font-semibold"
          >Atualizar minha localização</button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        {/* Sidebar (desktop) — Left side */}
        <aside className="hidden md:block rounded-2xl border border-gray-200 bg-white p-4 md:sticky top-20 md:self-start md:h-full md:min-h-full">
          <div>
            <div className="text-sm font-semibold">Distância</div>
            <div className="mt-2">
              <input type="range" min={0} max={5} step={1} value={maxKm} onChange={(e)=>setMaxKm(Number(e.target.value))} className="w-full accent-[#ff5c00] range-orange" />
              <div className="flex justify-between text-xs text-gray-500 mt-1 px-0.5">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>+5Km</span>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-semibold">Categorias</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableCategories.map((c)=>{
                const on = selectedCategories.includes(c);
                return (
                  <button key={c} type="button" onClick={()=> setSelectedCategories((prev)=> on? prev.filter(x=>x!==c): [...prev, c])} className={`px-2 py-1 rounded-md border text-sm ${on? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]': 'bg-white border-gray-300 text-gray-700'}`}>{c}</button>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-semibold">Avaliação mínima</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[0,1,2,3,4,5].map((n)=> (
                <button key={n} type="button" onClick={()=>setMinStars(n)} aria-pressed={minStars===n} className={`h-8 px-2 rounded-md border text-sm ${minStars===n? 'bg-[#fff3ec] border-[#ffd7bd] text-[#ff5c00]': 'bg-white border-gray-300 text-gray-700'}`}>
                  {n===0? 'Qualquer' : `${n}+★`}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <button type="button" onClick={()=>{ setMaxKm(5); setMinStars(0); setSelectedCategories([]); }} className="text-sm text-gray-700 underline hover:text-black">Limpar filtros</button>
          </div>
        </aside>
        {/* Grid de resultados */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
          {visiblePage.map((b, idx) => {
            // As categorias já vêm mapeadas do 'ordered', não precisa mapear novamente
            const categories = Array.isArray((b as any).categories) ? (b as any).categories : [];
            return (
              <BankCard
                key={b.id}
                id={b.id}
                name={toTitleCase(b.name)}
                address={b.address}
                distanceKm={b.distance}
                rating={(b as any).rating ?? 4.8}
                openNow={(b as any).openNow ?? isOpenNowDefault()}
                closeTimeLabel={(b as any).openNow ? (b as any).close : undefined}
                imageUrl={(b as any).cover}
                profileImageUrl={(b as any).avatar || "/placeholder/jornaleiro-profile.jpg"}
                categories={categories}
                description={(b as any).description || DESCRIPTIONS[b.id as keyof typeof DESCRIPTIONS] || "Banca de jornal com variedades de revistas, jornais, recargas e snacks."}
                featured={Boolean((b as any).featured)}
              />
            );
          })}
        </div>
      </div>
      {/* Estado sem resultados */}
      {visible.length === 0 && (
        <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm">
          Nenhuma banca encontrada com os filtros atuais. 
          <button type="button" onClick={()=>{ setMaxKm(5); setMinStars(0); setSelectedCategories([]); }} className="ml-2 underline font-semibold">Limpar filtros</button>
        </div>
      )}
      {/* Paginação */}
      <div className="mt-4 flex justify-center">
        {visiblePage.length < visible.length && (
          <button type="button" onClick={()=> setPage((p)=>p+1)} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            Carregar mais
          </button>
        )}
      </div>
      {/* Skeleton de carregamento enquanto busca a API */}
      {apiBancas === null && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="h-44 w-full bg-gray-100 animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="mt-2 h-3 w-40 bg-gray-100 rounded animate-pulse" />
                <div className="mt-3 h-9 w-full bg-gray-100 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        /* Track */
        .range-orange::-webkit-slider-runnable-track {
          background: #ffe2d2; /* light orange track */
          height: 6px;
          border-radius: 9999px;
        }
        .range-orange::-moz-range-track {
          background: #ffe2d2;
          height: 6px;
          border-radius: 9999px;
        }
        /* Thumb */
        .range-orange::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #ff5c00;
          border-radius: 9999px;
          margin-top: -5px; /* centers the thumb on 6px track */
          border: 2px solid #fff;
          box-shadow: 0 0 0 1px #ffd7bd;
        }
        .range-orange::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ff5c00;
          border: 2px solid #fff;
          border-radius: 9999px;
          box-shadow: 0 0 0 1px #ffd7bd;
        }
      `}</style>
    </section>
  );
}
