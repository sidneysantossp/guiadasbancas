"use client";

// Removido next/image - usando img nativo para evitar falhas em produção
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState, useRef } from "react";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { buildPublicProductPath } from "@/lib/product-url";

// Tipos
type FavItem = {
  id: string;
  name: string;
  vendorName?: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
  ratingAvg?: number | null;
  reviewsCount?: number | null;
  available?: boolean;
  codigo_mercos?: string;
  banca_id?: string;
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
  banca_id?: string;
  active?: boolean;
  codigo_mercos?: string;
};

// ApiBanca type removed - banca_name now comes directly from API via JOIN

function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="currentColor" aria-hidden>
      <path d="M13.5 0s1 2.5-1 5-2.5 3.5-1.5 5c0 0 1-2 3-2s4 1.5 4 5.5S14.5 24 9.5 24 1 20.5 1 15 4.5 8 8 6c0 0-.5 1.5.5 2.5C9.5 9 13.5 6.5 13.5 0z"/>
    </svg>
  );
}

function RatingPill({ rating = 4.7, reviews = 1 }: { rating?: number; reviews?: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 px-1.5 py-0.5 text-[11px] font-semibold">
      ({reviews})
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white px-1 py-[1px] text-[10px] font-semibold">{rating.toFixed(1)}
      </span>
    </span>
  );
}

function HeartOutline({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-red-500" aria-hidden>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function DiscountBadge({ percent }: { percent?: number | null }) {
  if (typeof percent !== 'number' || percent <= 0) return null;
  return (
    <span className="absolute left-2 top-2 rounded-md bg-[#ff5c00] text-white text-[11px] font-semibold px-2 py-1 shadow">
      -{Math.round(percent)}%
    </span>
  );
}

function Stars({ value, count }: { value?: number | null; count?: number | null }) {
  const v = Math.max(0, Math.min(5, Number(value ?? 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <span className="inline-flex max-w-full items-center gap-[2px] overflow-hidden text-[#f59e0b]">
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
      <span className="ml-1 min-w-0 truncate text-[11px] text-gray-500">{Number(count ?? 0)} avaliação{Number(count ?? 0) === 1 ? '' : 's'}</span>
    </span>
  );
}

function FavCard({ item }: { item: FavItem }) {
  const { id, name, vendorName, image, price, priceOriginal, discountPercent, ratingAvg, reviewsCount, available, codigo_mercos } = item;
  const { show } = useToast();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const productHref = buildPublicProductPath(name, vendorName, id, codigo_mercos) as Route;
  const bancaDisplay = vendorName
    ? (/^banca\b/i.test(vendorName) ? vendorName : `Banca ${vendorName}`)
    : 'Banca Local';
  
  // Carregar estado inicial dos favoritos
  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    
    const checkFavorite = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          const isFav = data.data?.some((fav: any) => fav.product_id === id);
          setIsFavorite(isFav || false);
        }
      } catch (error) {
        console.error('Erro ao verificar favorito:', error);
      }
    };
    
    checkFavorite();
  }, [user, id]);
  
  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        // Remover dos favoritos
        const response = await fetch(`/api/favorites?product_id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsFavorite(false);
          show(<span>❌ Removido dos favoritos</span>);
        } else {
          const data = await response.json();
          show(<span>Erro: {data.error || 'Não foi possível remover dos favoritos'}</span>);
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: id }),
        });
        
        if (response.ok) {
          setIsFavorite(true);
          show(<span>⭐ Adicionado aos favoritos!</span>);
        } else {
          const data = await response.json();
          show(<span>Erro: {data.error || 'Não foi possível adicionar aos favoritos'}</span>);
        }
      }
    } catch (error) {
      console.error('Erro ao gerenciar favorito:', error);
      show(<span>Erro ao processar favorito</span>);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-40 w-full sm:h-44 lg:h-48">
        <Link href={productHref} className="absolute inset-0 m-2 overflow-hidden rounded-xl bg-gray-50">
          <img src={image} alt={name} className="absolute inset-0 h-full w-full object-contain" />
        </Link>
        <DiscountBadge percent={discountPercent} />
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          {user && (
            <button
              onClick={handleFavorite}
              disabled={isLoading}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className={`grid h-8 w-8 place-items-center rounded-md border bg-white/95 shadow-sm transition-all sm:h-9 sm:w-9 ${
                isFavorite
                  ? 'border-red-500 bg-red-50 hover:bg-red-100'
                  : 'border-gray-300 hover:bg-gray-50 hover:border-[#ff5c00]'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <HeartOutline filled={isFavorite} />
            </button>
          )}
          <Link href={productHref} aria-label="Visualizar produto" className="grid h-8 w-8 place-items-center rounded-md border border-gray-300 bg-white/95 shadow-sm hover:bg-gray-50 sm:h-9 sm:w-9">
            <EyeIcon />
          </Link>
        </div>
      </div>

      <Link href={productHref} className="flex min-w-0 flex-1 flex-col p-3">
        <div className="min-w-0">
          <div className="line-clamp-2 min-h-[2.2rem] break-words text-[12px] font-semibold leading-[1.2] text-gray-900 hover:underline sm:min-h-[2.35rem] sm:text-[14px]">
            {name}
          </div>
          {codigo_mercos && <div className="mt-0.5 truncate font-mono text-[10px] text-gray-500">Cód: {codigo_mercos}</div>}
          <div className="mt-0.5 line-clamp-1 text-[11px] text-gray-600 sm:text-[12px]">Entregue por: {bancaDisplay}</div>
          <div className="mt-1.5 overflow-hidden"><Stars value={ratingAvg} count={reviewsCount} /></div>
        </div>

        {typeof discountPercent === 'number' && discountPercent > 0 ? (
          <div className="mt-auto pt-2">
            <div className="text-[11px] text-gray-600 sm:text-[12px]">
              De: <span className="text-gray-400 line-through">R$ {((price) / (1 - (discountPercent || 0) / 100)).toFixed(2)}</span>
            </div>
            <span className="text-[17px] font-extrabold text-[#ff5c00] sm:text-[20px]">R$ {price.toFixed(2)}</span>
          </div>
        ) : (
          <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-2">
            <span className="text-[17px] font-extrabold text-[#ff5c00] sm:text-[20px]">R$ {price.toFixed(2)}</span>
            {typeof priceOriginal === 'number' && priceOriginal > price && (
              <span className="text-[11px] text-gray-400 line-through sm:text-[12px]">R$ {Number(priceOriginal).toFixed(2)}</span>
            )}
          </div>
        )}
      </Link>
      
      {/* Modal de login necessário */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

// ID da categoria de bebidas
const BEBIDAS_ID = 'c230ed83-b08a-4b7a-8f19-7c8230f36c86'; // Bebidas
const HOME_FETCH_PRODUCTS_LIMIT = 96;
const HOME_MOBILE_PRODUCTS_LIMIT = 12;
const HOME_GRID_MAX_ROWS = 2;

export default function FavoritePicks() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FavItem[]>([]);
  const [viewport, setViewport] = useState<number>(1024);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        let list: ApiProduct[] = [];
        let locationQuery = '';
        try {
          const raw = localStorage.getItem('gb:userLocation');
          if (raw) {
            const loc = JSON.parse(raw);
            if (loc?.lat && loc?.lng) {
              locationQuery = `&lat=${encodeURIComponent(String(loc.lat))}&lng=${encodeURIComponent(String(loc.lng))}`;
            }
          }
        } catch {}

        // Primeiro tenta por nome da categoria (inclui subcategorias).
        // Fallback para UUID legado se necessário.
        const endpoints = [
          `/api/products/public?categoryName=bebidas&limit=${HOME_FETCH_PRODUCTS_LIMIT}&sort=created_at&order=desc${locationQuery}`,
          `/api/products/public?category=${BEBIDAS_ID}&limit=${HOME_FETCH_PRODUCTS_LIMIT}&sort=created_at&order=desc${locationQuery}`,
        ];

        for (const endpoint of endpoints) {
          const pRes = await fetch(endpoint, {
            cache: 'no-store'
          });

          if (!pRes.ok) continue;

          const pj = await pRes.json();
          const candidate = Array.isArray(pj?.data) ? pj.data : (Array.isArray(pj?.items) ? pj.items : []);

          if (candidate.length > 0 || endpoint === endpoints[endpoints.length - 1]) {
            list = candidate;
            console.log(`[FavoritePicks] Produtos de Bebidas (${endpoint.includes('categoryName') ? 'categoryName' : 'categoryId'}) encontrados: ${list.length}`);
            break;
          }
        }

        console.log(`[FavoritePicks] Total de produtos: ${list.length}`);

        // Filtrar apenas produtos com imagem real - sem fallback para mock
        const productsWithImages = list.filter((p) => p.images && p.images[0]);
        console.log(`[FavoritePicks] Produtos com imagem real: ${productsWithImages.length}`);

        const mapped: FavItem[] = productsWithImages.map((p) => {
          const price = Number(p.price || 0);
          const priceOriginal = p.price_original != null ? Number(p.price_original) : null;
          const discountPercent = p.discount_percent != null ? Number(p.discount_percent) : (priceOriginal && priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : null);
          
          // Usar imagem real do banco
          const imageUrl = p.images![0];
          
          return {
            id: p.id,
            name: p.name,
            // OTIMIZAÇÃO: Usar banca_name que já vem da API via JOIN
            vendorName: (p as any).banca_name || undefined,
            image: imageUrl,
            price,
            priceOriginal,
            discountPercent,
            ratingAvg: p.rating_avg ?? null,
            reviewsCount: p.reviews_count ?? null,
            available: p.active !== false,
            codigo_mercos: (p as any).codigo_mercos || undefined,
            banca_id: p.banca_id || undefined,
          } as FavItem;
        });
        console.log(`[FavoritePicks] Produtos mapeados: ${mapped.length}`);
        if (active) setItems(mapped);
      } catch (e) {
        console.error('[FavoritePicks] Erro ao buscar produtos:', e);
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewport < 640;
  const desktopColumns = viewport >= 1536 ? 4 : viewport >= 1024 ? 3 : viewport >= 640 ? 2 : 1;
  const desktopGridLimit = desktopColumns * HOME_GRID_MAX_ROWS;

  const data = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.slice(0, isMobile ? HOME_MOBILE_PRODUCTS_LIMIT : desktopGridLimit);
  }, [items, isMobile, desktopGridLimit]);

  const [scrollIndex, setScrollIndex] = useState(0);
  const touchRef = useRef<{ startX: number; startY: number; active: boolean } | null>(null);

  useEffect(() => {
    setScrollIndex(0);
  }, [data.length, isMobile]);

  const scrollNext = () => {
    if (scrollIndex < data.length - 1) {
      setScrollIndex(scrollIndex + 1);
    }
  };

  const scrollPrev = () => {
    if (scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
    }
  };

  // Touch handlers para swipe
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      active: true
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current?.active) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchRef.current.startX;
    const deltaY = touch.clientY - touchRef.current.startY;
    
    // Se o movimento vertical for maior que horizontal, não interceptar (permitir scroll da página)
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      touchRef.current.active = false;
      return;
    }
    
    // Prevenir scroll da página se estamos fazendo swipe horizontal
    if (Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current?.active) {
      touchRef.current = null;
      return;
    }
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchRef.current.startX;
    const deltaY = touch.clientY - touchRef.current.startY;
    
    touchRef.current = null;
    
    // Só processar se o movimento horizontal for maior que vertical
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    
    // Threshold mínimo para considerar um swipe
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swipe para direita = anterior
        scrollPrev();
      } else {
        // Swipe para esquerda = próximo
        scrollNext();
      }
    }
  };

  // Não exibir seção se não houver produtos
  if (!loading && data.length === 0) return null;

  return (
    <section className="w-full pt-8 md:pt-10">
      <div className="container-max">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <img src="https://stackfood-react.6amtech.com/_next/static/media/fire.612dd1de.svg" alt="Fogo" width={23} height={23} />
              <h2 className="text-lg sm:text-xl font-semibold">Bebidas</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">As melhores bebidas para você</p>
          </div>
          <Link href="/buscar?q=recomendados" className="text-[var(--color-primary)] text-sm font-medium hover:underline">Ver todos</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-28"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile: Carrossel */}
            <div className="sm:hidden relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out gap-4"
                  style={{ transform: `translateX(-${scrollIndex * 100}%)` }}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {data.map((f) => (
                    <div key={f.id} className="w-full flex-shrink-0">
                      <FavCard item={f} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Setas de navegação */}
              {data.length > 1 && (
                <>
                  <button
                    onClick={scrollPrev}
                    disabled={scrollIndex === 0}
                    className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all ${
                      scrollIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Anterior"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={scrollNext}
                    disabled={scrollIndex === data.length - 1}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all ${
                      scrollIndex === data.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Próximo"
                  >
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Indicadores (dots) */}
              {data.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {data.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setScrollIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === scrollIndex 
                          ? 'w-6 bg-[var(--color-primary)]' 
                          : 'w-2 bg-gray-300'
                      }`}
                      aria-label={`Ir para item ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop/Tablet: Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
              {data.map((f) => (
                <FavCard key={f.id} item={f} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
