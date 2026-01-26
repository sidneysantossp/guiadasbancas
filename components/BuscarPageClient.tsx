"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCategories, type UICategory } from "@/lib/useCategories";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { IconFilter, IconX, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import CategoryCarousel from "@/components/CategoryCarousel";
import BankCard from "@/components/BankCard";
import { filterProductsFuzzy, normalizeForSearch } from "@/lib/fuzzySearch";

type Banca = {
  id: string;
  name: string;
  address?: string;
  cover: string;
  avatar?: string;
  categories?: string[];
  location?: { lat?: number; lng?: number };
  lat?: number;
  lng?: number;
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
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim();
}

function tokenize(value: string) {
  const normalized = normalizeText(value);
  return normalized ? normalized.split(/\s+/).filter((word) => word.length >= 2) : [];
}

// Componente de filtro colapsável
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
      >
        {title}
        {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

type BuscarPageClientProps = {
  initialBancas?: Banca[];
  initialProducts?: any[];
  initialCategories?: UICategory[];
  initialQuery?: string;
};

export default function BuscarPageClient({
  initialBancas,
  initialProducts,
  initialCategories,
  initialQuery,
}: BuscarPageClientProps) {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const qTerm = q.trim();
  const hasInitialBancas = Array.isArray(initialBancas);
  const hasInitialProducts = Array.isArray(initialProducts);
  const initialMatchesQuery = (initialQuery ?? "") === qTerm;
  const hasInitialResults = !qTerm
    ? hasInitialBancas || hasInitialProducts
    : hasInitialProducts && initialProducts.length > 0;
  const hasInitial = hasInitialBancas && hasInitialProducts && initialMatchesQuery && hasInitialResults;

  const [loc, setLoc] = useState<{ lat: number; lng: number; state?: string } | null>(null);
  const { addToCart } = useCart();
  const { show } = useToast();
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:userLocation");
      if (raw) setLoc(JSON.parse(raw));
    } catch {}
  }, []);

  const [list, setList] = useState<Banca[]>(initialBancas ?? []);
  const [products, setProducts] = useState<any[]>(initialProducts ?? []);
  const [loading, setLoading] = useState(!hasInitial);
  const [error, setError] = useState<string | null>(null);
  const { items: categories } = useCategories(initialCategories);
  const [ufFilter, setUfFilter] = useState<string>("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [openNow, setOpenNow] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "order">("distance");

  useEffect(() => {
    if ((initialQuery ?? "") === qTerm) {
      if (Array.isArray(initialBancas)) setList(initialBancas);
      if (Array.isArray(initialProducts) && (initialProducts.length > 0 || !qTerm)) {
        setProducts(initialProducts);
      }
    }
  }, [initialBancas, initialProducts, initialQuery, qTerm]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const shouldFetchBancas = !hasInitial || !!loc;
      const shouldFetchProducts = !!qTerm;

      if (!shouldFetchBancas && !shouldFetchProducts) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        if (shouldFetchBancas) {
          const qs = loc ? `?lat=${loc.lat}&lng=${loc.lng}&radiusKm=50` : "";
          const bancasRes = await fetch(`/api/bancas${qs}`, { cache: 'no-store' });
          const bancasData = await bancasRes.json();
          if (!bancasRes.ok) throw new Error(bancasData?.error || 'Erro ao buscar bancas');
          const bancasList = Array.isArray(bancasData?.data)
            ? bancasData.data
            : Array.isArray(bancasData)
              ? bancasData
              : [];
          if (mounted) setList(bancasList);
        }
        
        if (shouldFetchProducts) {
          const locQs = loc ? `&lat=${encodeURIComponent(String(loc.lat))}&lng=${encodeURIComponent(String(loc.lng))}` : "";
          const productsRes = await fetch(`/api/products/most-searched?search=${encodeURIComponent(qTerm)}&limit=20${locQs}`);
          const productsData = await productsRes.json();
          if (!productsRes.ok) {
            throw new Error(productsData?.error || 'Erro ao buscar produtos');
          }
          let productsList = Array.isArray(productsData?.data)
            ? productsData.data
            : Array.isArray(productsData)
              ? productsData
              : [];

          if (productsList.length === 0) {
            const tokens = tokenize(qTerm);
            const ranked = tokens
              .filter((t) => t.length >= 3 && !/^\d+$/.test(t))
              .sort((a, b) => b.length - a.length);
            const fallbackTerm = ranked[0] || tokens[0];
            if (fallbackTerm && fallbackTerm !== qTerm) {
              const fallbackRes = await fetch(`/api/products/most-searched?search=${encodeURIComponent(fallbackTerm)}&limit=20${locQs}`);
              const fallbackData = await fallbackRes.json();
              if (fallbackRes.ok) {
                const fallbackList = Array.isArray(fallbackData?.data)
                  ? fallbackData.data
                  : Array.isArray(fallbackData)
                    ? fallbackData
                    : [];
                if (fallbackList.length > 0) {
                  productsList = fallbackList;
                }
              }
            }
          }

          if (mounted) setProducts(productsList);
        } else if (mounted) {
          setProducts([]);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Falha ao carregar resultados');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [loc?.lat, loc?.lng, qTerm, hasInitial]);

  const filtered = useMemo(() => {
    const term = normalizeForSearch(qTerm);
    let arr = list.filter((b) => {
      // BUSCA FUZZY para bancas: usa normalização que remove acentos
      const matchQ = !term
        || normalizeForSearch(b.name).includes(term)
        || normalizeForSearch(b.address || "").includes(term)
        || normalizeForSearch(b.addressObj?.city || "").includes(term)
        || (b.categories || []).some((c) => normalizeForSearch(c || "").includes(term));
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
  
  // Filtrar produtos com BUSCA FUZZY (tolerante a erros de digitação)
  // Ex: "amisterdan" encontra "amsterdam", "sedex" encontra "seda"
  const filteredProducts = useMemo(() => {
    if (!qTerm) return [];
    
    let filtered = [...products];
    
    // 1. Filtrar por categoria (se houver filtro ativo)
    if (catFilter) {
      const catTerm = normalizeForSearch(catFilter);
      filtered = filtered.filter(p => 
        normalizeForSearch(p.category || '').includes(catTerm)
      );
    }
    
    // 2. Aplicar busca fuzzy com Fuse.js (tolerante a erros de digitação)
    // Isso permite encontrar "amsterdam" mesmo digitando "amisterdan", "amyster", etc.
    if (qTerm.trim().length >= 2) {
      filtered = filterProductsFuzzy(filtered, qTerm);
    }
    
    // 3. Se não encontrou nada com fuzzy, mostrar todos da categoria selecionada
    if (filtered.length === 0 && products.length > 0 && catFilter) {
      const catTerm = normalizeForSearch(catFilter);
      return products.filter(p => 
        normalizeForSearch(p.category || '').includes(catTerm)
      );
    }
    
    return filtered;
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

  // Extrair categorias únicas dos produtos para filtro
  const productCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // Extrair faixas de preço
  const priceRanges = [
    { label: 'Até R$ 20', min: 0, max: 20 },
    { label: 'R$ 20 - R$ 50', min: 20, max: 50 },
    { label: 'R$ 50 - R$ 100', min: 50, max: 100 },
    { label: 'Acima de R$ 100', min: 100, max: Infinity },
  ];

  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filtrar produtos com faixa de preço
  const filteredProductsWithPrice = useMemo(() => {
    let result = filteredProducts;
    if (priceRange) {
      result = result.filter(p => p.price >= priceRange.min && p.price < priceRange.max);
    }
    return result;
  }, [filteredProducts, priceRange]);

  // Limpar todos os filtros
  const clearAllFilters = () => {
    setUfFilter('');
    setCatFilter('');
    setOpenNow(false);
    setSortBy('distance');
    setPriceRange(null);
  };

  const hasActiveFilters = ufFilter || catFilter || openNow || priceRange;

  // Sidebar de filtros
  const FiltersSidebar = () => (
    <div className="space-y-0">
      {/* Cabeçalho dos filtros */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#ff5c00] hover:underline"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Categoria */}
      <FilterSection title="Categoria">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!catFilter}
              onChange={() => setCatFilter('')}
              className="text-[#ff5c00] focus:ring-[#ff5c00]"
            />
            <span className="text-sm text-gray-700">Todas</span>
          </label>
          {(productCategories.length > 0 ? productCategories : categories.map(c => c.name)).map(cat => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={catFilter.toLowerCase() === cat.toLowerCase()}
                onChange={() => setCatFilter(cat.toLowerCase())}
                className="text-[#ff5c00] focus:ring-[#ff5c00]"
              />
              <span className="text-sm text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Faixa de Preço */}
      <FilterSection title="Faixa de Preço">
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="price"
              checked={!priceRange}
              onChange={() => setPriceRange(null)}
              className="text-[#ff5c00] focus:ring-[#ff5c00]"
            />
            <span className="text-sm text-gray-700">Todos os preços</span>
          </label>
          {priceRanges.map((range, idx) => (
            <label key={idx} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceRange?.min === range.min && priceRange?.max === range.max}
                onChange={() => setPriceRange(range)}
                className="text-[#ff5c00] focus:ring-[#ff5c00]"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Estado (UF) */}
      <FilterSection title="Estado" defaultOpen={false}>
        <select
          value={ufFilter}
          onChange={(e) => setUfFilter(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        >
          <option value="">Todos os estados</option>
          {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map(uf => (
            <option key={uf} value={uf.toLowerCase()}>{uf}</option>
          ))}
        </select>
      </FilterSection>

      {/* Ordenar por */}
      <FilterSection title="Ordenar por">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#ff5c00] focus:ring-1 focus:ring-[#ff5c00]"
        >
          <option value="distance">Distância</option>
          <option value="rating">Avaliação</option>
          <option value="order">Relevância</option>
        </select>
      </FilterSection>

      {/* Aberto agora */}
      <FilterSection title="Disponibilidade" defaultOpen={false}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={openNow}
            onChange={(e) => setOpenNow(e.target.checked)}
            className="rounded text-[#ff5c00] focus:ring-[#ff5c00]"
          />
          <span className="text-sm text-gray-700">Aberto agora</span>
        </label>
      </FilterSection>
    </div>
  );

  return (
    <section className="container-max py-6">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resultados da busca</h1>
        {q ? (
          <p className="text-gray-600 mt-1">Você pesquisou por: <span className="font-semibold text-gray-900">"{q}"</span></p>
        ) : (
          <p className="text-gray-600 mt-1">Use a busca para encontrar produtos e bancas.</p>
        )}
      </div>

      {/* Carrossel de Categorias - sem initialItems para buscar da API com imagens */}
      <div className="mb-6">
        <CategoryCarousel />
      </div>

      {/* Botão de filtros mobile */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <IconFilter size={18} />
          Filtros
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-[#ff5c00] px-2 py-0.5 text-xs text-white">
              {[ufFilter, catFilter, openNow, priceRange].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Modal de filtros mobile */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <IconX size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              <FiltersSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Layout principal com sidebar */}
      <div className="flex gap-8">
        {/* Sidebar de filtros - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl border border-gray-200 p-4">
            <FiltersSidebar />
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 min-w-0">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00]"></div>
              <span className="ml-3 text-gray-600">Carregando...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {/* Contador de resultados */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {filteredProductsWithPrice.length > 0 && (
                    <span><strong>{filteredProductsWithPrice.length}</strong> produto{filteredProductsWithPrice.length !== 1 ? 's' : ''} encontrado{filteredProductsWithPrice.length !== 1 ? 's' : ''}</span>
                  )}
                  {filtered.length > 0 && filteredProductsWithPrice.length > 0 && ' • '}
                  {filtered.length > 0 && (
                    <span><strong>{filtered.length}</strong> banca{filtered.length !== 1 ? 's' : ''}</span>
                  )}
                </p>
              </div>

              {/* Produtos */}
              {filteredProductsWithPrice.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Produtos</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProductsWithPrice.map((product) => {
                      const productHref = product.banca?.id 
                        ? `/produto/${product.id}?banca=${product.banca.id}`
                        : `/produto/${product.id}`;
                      const bancaPhone = product.banca?.phone || product.banca?.whatsapp;
                      // IMPORTANTE: Nunca mostrar nome de distribuidor
                      const bancaName = product.banca?.name || 'Banca Local';
                      
                      return (
                        <div
                          key={product.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                        >
                          <Link href={productHref} className="block">
                            <div className="relative aspect-square bg-gray-100">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <img
                                  src="/placeholder/product.svg"
                                  alt="Produto sem imagem"
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {product.discount_percent && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                  -{product.discount_percent}%
                                </div>
                              )}
                            </div>
                          </Link>

                          <div className="p-3 flex flex-col gap-2 flex-1">
                            <Link href={productHref} className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-[#ff5c00] min-h-[40px]">
                              {product.name}
                            </Link>

                            <div className="space-y-1 mt-auto">
                              {product.price_original && product.price_original > product.price && (
                                <div className="text-xs text-gray-400 line-through">
                                  R$ {product.price_original.toFixed(2)}
                                </div>
                              )}
                              <div className="text-lg font-bold text-[#ff5c00]">
                                R$ {product.price.toFixed(2)}
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 truncate">
                              {bancaName}
                            </div>

                            <button
                              type="button"
                              className="w-full rounded-lg bg-[#ff5c00] text-white text-sm font-semibold py-2.5 hover:bg-[#e55400] transition-colors mt-2"
                              onClick={() => {
                                addToCart(
                                  {
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.images?.[0],
                                    banca_id: product.banca?.id,
                                    banca_name: bancaName,
                                  },
                                  1
                                );
                                show(
                                  <span>
                                    Adicionado ao carrinho.{" "}
                                    <Link href="/carrinho" className="underline font-semibold">
                                      Ver carrinho
                                    </Link>
                                  </span>
                                );
                              }}
                            >
                              Adicionar ao carrinho
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bancas */}
              {filtered.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">{filtered.length} banca{filtered.length !== 1 ? 's' : ''}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((b) => {
                      const open = isOpenNow(b.hours || []);
                      return (
                        <BankCard
                          key={b.id}
                          id={b.id}
                          name={b.name}
                          address={b.address || ''}
                          rating={b.rating ?? 4.7}
                          openNow={open}
                          imageUrl={b.cover}
                          profileImageUrl={b.avatar}
                          categories={b.categories || []}
                          featured={b.featured}
                          description={b.address || ''}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mensagem de nenhum resultado encontrado */}
          {!loading && !error && filteredProductsWithPrice.length === 0 && filtered.length === 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Não encontramos produtos ou bancas para "{q}".
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#ff5c00] text-white px-4 py-2 text-sm font-medium hover:bg-[#e55400]"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
