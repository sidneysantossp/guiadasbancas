"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/lib/useCategories";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";

type Banca = {
  id: string;
  name: string;
  address?: string;
  cover: string;
  avatar?: string;
  categories?: string[];
  location?: { lat?: number; lng?: number };
  lat?: number; // fallback legacy
  lng?: number; // fallback legacy
  addressObj?: { city?: string; uf?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  rating?: number;
  featured?: boolean;
};

function toUF(b: Banca): string {
  const uf = b.addressObj?.uf || (b.address?.match(/\b([A-Z]{2})\b$/)?.[1]) || "SP";
  return uf.toLowerCase();
}

function normalizeText(value: string) {
  return String(value || "")
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function BuscarPageContent() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const qTerm = q.trim();

  const [loc, setLoc] = useState<{ lat: number; lng: number; state?: string } | null>(null);
  const { addToCart } = useCart();
  const { show } = useToast();
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:userLocation");
      if (raw) setLoc(JSON.parse(raw));
    } catch {}
  }, []);

  const [list, setList] = useState<Banca[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items: categories } = useCategories();
  const [ufFilter, setUfFilter] = useState<string>("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [openNow, setOpenNow] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "order">("distance");

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        // Buscar bancas
        const qs = loc ? `?lat=${loc.lat}&lng=${loc.lng}&radiusKm=50` : "";
        const bancasRes = await fetch(`/api/bancas${qs}`, { cache: 'no-store' });
        const bancasData = await bancasRes.json();
        if (!bancasRes.ok) throw new Error(bancasData?.error || 'Erro ao buscar bancas');
        if (mounted) setList(Array.isArray(bancasData?.data) ? bancasData.data : []);
        
        // Buscar produtos se houver query de busca
        if (qTerm) {
          const locQs = loc ? `&lat=${encodeURIComponent(String(loc.lat))}&lng=${encodeURIComponent(String(loc.lng))}` : "";
          const productsRes = await fetch(`/api/products/most-searched?search=${encodeURIComponent(qTerm)}&limit=20${locQs}`);
          const productsData = await productsRes.json();
          if (!productsRes.ok) {
            throw new Error(productsData?.error || 'Erro ao buscar produtos');
          }
          if (mounted) setProducts(Array.isArray(productsData?.data) ? productsData.data : []);
        } else {
          if (mounted) setProducts([]);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Falha ao carregar resultados');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [loc?.lat, loc?.lng, qTerm]);

  const filtered = useMemo(() => {
    const term = normalizeText(qTerm);
    let arr = list.filter((b) => {
      const matchQ = !term
        || normalizeText(b.name).includes(term)
        || normalizeText(b.address || "").includes(term)
        || normalizeText(b.addressObj?.city || "").includes(term)
        || (b.categories || []).some((c) => normalizeText(c || "").includes(term));
      const matchUF = !ufFilter || (b.addressObj?.uf || "").toLowerCase() === ufFilter.toLowerCase();
      const matchCat = !catFilter || (b.categories || []).some((c) => c.toLowerCase() === catFilter.toLowerCase());
      const matchOpen = !openNow || isOpenNow(b.hours || []);
      return matchQ && matchUF && matchCat && matchOpen;
    });
    // sorting
    if (sortBy === "rating") {
      arr = arr.slice().sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "order") {
      // fallback to as-is order (API already ordered)
      arr = arr;
    } else if (sortBy === "distance" && loc?.lat && loc?.lng) {
      const hav = (a?: number, b?: number) => {
        if (a == null || b == null) return Infinity;
        return Math.hypot((a - loc.lat), (b - loc.lng)); // simple proxy
      };
      arr = arr.slice().sort((a, b) => hav(a.lat ?? a.location?.lat, a.lng ?? a.location?.lng) - hav(b.lat ?? b.location?.lat, b.lng ?? b.location?.lng));
    }
    return arr;
  }, [list, qTerm, ufFilter, catFilter, openNow, sortBy, loc?.lat, loc?.lng]);
  
  // Filtrar produtos também
  const filteredProducts = useMemo(() => {
    if (!qTerm) return [];
    const term = normalizeText(qTerm);
    
    console.log('[BUSCAR] Filtrando produtos:', {
      total: products.length,
      catFilter,
      produtos_sample: products.slice(0, 2).map(p => ({ name: p.name, category: p.category, category_id: p.category_id }))
    });
    
    return products.filter(p => {
      // Usar p.category (nome) ao invés de p.category_id, igual ao filtro das bancas
      const matchCat = !catFilter || normalizeText(p.category || '').includes(normalizeText(catFilter));
      const matchSearch = !term || normalizeText(p.name).includes(term) || normalizeText(p.description || '').includes(term);
      
      if (!matchCat) {
        console.log('[BUSCAR] Produto filtrado por categoria:', {
          name: p.name,
          category: p.category,
          catFilter,
          normalized_category: normalizeText(p.category || ''),
          normalized_filter: normalizeText(catFilter)
        });
      }
      
      return matchCat && matchSearch;
    });
  }, [products, catFilter, qTerm]);
  
  // Verificar se há resultados (bancas ou produtos)
  const hasResults = filtered.length > 0 || filteredProducts.length > 0;

  function isOpenNow(hours: NonNullable<Banca["hours"]>) {
    if (!Array.isArray(hours) || hours.length === 0) return false;
    const now = new Date();
    const dayMap: Record<number, string> = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
    const key = dayMap[now.getDay()];
    const d = hours.find(h => h.key === key);
    if (!d || !d.open) return false;
    const [sh, sm] = (d.start || '00:00').split(':').map(Number);
    const [eh, em] = (d.end || '00:00').split(':').map(Number);
    const cur = now.getHours() * 60 + now.getMinutes();
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    return cur >= start && cur <= end;
  }

  return (
    <section className="container-max py-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Resultados da busca</h1>
        {q ? (
          <p className="text-gray-700">Você pesquisou por: <span className="font-medium">{q}</span></p>
        ) : (
          <p className="text-gray-700">Use a busca para encontrar bancas por nome, cidade ou categoria.</p>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-[12px] text-gray-700">UF</label>
          <select value={ufFilter} onChange={(e)=>setUfFilter(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-sm">
            <option value="">Todas</option>
            {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => <option key={uf} value={uf.toLowerCase()}>{uf}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[12px] text-gray-700">Categoria</label>
          <select value={catFilter} onChange={(e)=>setCatFilter(e.target.value)} className="rounded-md border border-gray-300 px-2 py-1 text-sm">
            <option value="">Todas</option>
            {categories.map(c => <option key={c.key} value={c.name.toLowerCase()}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[12px] text-gray-700">Aberto agora</label>
          <input type="checkbox" checked={openNow} onChange={(e)=>setOpenNow(e.target.checked)} className="rounded border-gray-300" />
        </div>
        <div>
          <label className="block text-[12px] text-gray-700">Ordenar por</label>
          <select value={sortBy} onChange={(e)=> setSortBy(e.target.value as any)} className="rounded-md border border-gray-300 px-2 py-1 text-sm">
            <option value="distance">Distância</option>
            <option value="rating">Avaliação</option>
            <option value="order">Ordem do Admin</option>
          </select>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Carregando...</div>}
      {error && <div className="text-sm text-rose-600">{error}</div>}

      {!loading && !error && (
        <div className="space-y-8">
          {/* Bancas */}
          {filtered.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Bancas ({filtered.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((b) => {
                  const uf = toUF(b);
                  return (
                    <Link key={b.id} href={`/banca/${uf}/${b.id}`} className="block rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow">
                      <div className="h-40 w-full bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.cover} alt={b.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-gray-900 line-clamp-1">{b.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          {typeof b.rating === 'number' && (
                            <span className="inline-flex items-center gap-1 text-amber-500">
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                              <span className="text-gray-700">{b.rating.toFixed(1)}</span>
                            </span>
                          )}
                          {b.featured && (
                            <span className="inline-flex items-center rounded-full bg-orange-50 text-[#ff5c00] border border-orange-200 px-2 py-[2px] text-[11px]">Destaque</span>
                          )}
                        </div>
                        {b.address && <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">{b.address}</div>}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {(b.categories || []).slice(0, 4).map((c) => (
                            <span key={c} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-[2px] text-[11px] text-gray-700">{c}</span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Produtos */}
          {filteredProducts.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Produtos ({filteredProducts.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const productHref = `/produto/${product.id}`;
                  const bancaPhone = product.banca?.phone || product.banca?.whatsapp || product.banca?.telefone || product.banca?.whatsapp_phone;
                  return (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                    >
                      <Link
                        href={productHref}
                        className="block"
                      >
                        <div className="relative h-32 sm:h-28 lg:h-24 bg-gray-100">
                          {product.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl text-gray-400">
                              📦
                            </div>
                          )}
                          {product.discount_percent && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              -{product.discount_percent}%
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="p-3 flex flex-col gap-2 flex-1">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {product.name}
                        </h3>

                        {product.rating_avg && (
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating_avg)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({product.reviews_count})
                            </span>
                          </div>
                        )}

                        <div className="space-y-1">
                          {product.price_original && (
                            <div className="text-xs text-gray-500 line-through">
                              De: R$ {product.price_original.toFixed(2)}
                            </div>
                          )}
                          <div className="text-sm font-semibold text-[#ff5c00]">
                            R$ {product.price.toFixed(2)}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          {product.banca?.name || "Banca"}
                        </div>

                        <div className="mt-2 flex flex-col gap-1">
                          <button
                            type="button"
                            className="w-full rounded-md bg-[#ff5c00] text-white text-xs font-semibold py-2 hover:opacity-95"
                            onClick={() => {
                              addToCart(
                                {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.images?.[0],
                                  banca_id: product.banca?.id,
                                  banca_name: product.banca?.name,
                                },
                                1
                              );
                              show(
                                <span>
                                  Adicionado ao carrinho. {" "}
                                  <Link href="/carrinho" className="underline font-semibold">
                                    Ver carrinho
                                  </Link>
                                </span>
                              );
                            }}
                          >
                            Adicionar ao carrinho
                          </button>

                          {bancaPhone && (
                            <a
                              href={`https://wa.me/${String(bancaPhone).replace(/\D/g, "")}?text=${encodeURIComponent(
                                `Olá! Tenho interesse no produto: ${product.name} (R$ ${product.price.toFixed(2)}).\n\nVer produto: https://guiadasbancas.com${productHref}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] text-xs font-semibold py-2 hover:bg-[#25D366]/15"
                            >
                              <Image
                                src="https://cdn-icons-png.flaticon.com/128/733/733585.png"
                                alt="WhatsApp"
                                width={14}
                                height={14}
                                className="h-3.5 w-3.5 object-contain"
                              />
                              Comprar pelo WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mensagem de nenhum resultado encontrado */}
      {!loading && !error && !hasResults && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Não encontramos bancas ou produtos que correspondam à sua busca por "{q}".
            </p>
            <div className="text-sm text-gray-500">
              Tente usar termos diferentes ou verifique os filtros aplicados.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={
      <div className="container-max py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <BuscarPageContent />
    </Suspense>
  );
}
