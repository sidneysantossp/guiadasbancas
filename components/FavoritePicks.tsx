"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState, useRef } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { LoginRequiredModal } from "./LoginRequiredModal";

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

type ApiBanca = { id: string; name: string };

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

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff5c00]" aria-hidden>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6"/>
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
      <span className="ml-1 text-[11px] text-gray-500">{Number(count ?? 0)} avaliação{Number(count ?? 0) === 1 ? '' : 's'}</span>
    </span>
  );
}

function FavCard({ item }: { item: FavItem }) {
  const { id, name, vendorName, image, price, priceOriginal, discountPercent, ratingAvg, reviewsCount, available, codigo_mercos } = item;
  const { addToCart } = useCart();
  const { show } = useToast();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ 
      id, 
      name, 
      price, 
      image 
    }, 1);
    show(<span>Adicionado ao carrinho!</span>);
  };

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
    <div className="group rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-2 flex items-center gap-3">
        {/* Imagem à esquerda com padding e badge - clicável */}
        <Link href={("/produto/" + slugify(name) + "-" + id) as Route} className="relative w-28 h-24 rounded-xl overflow-hidden shrink-0">
          <Image src={image} alt={name} fill sizes="112px" className="object-contain bg-gray-50" />
          <DiscountBadge percent={discountPercent} />
        </Link>
        {/* Conteúdo + coluna de ícones à direita */}
        <div className="flex-1 min-w-0 flex gap-2 items-center">
          {/* Bloco de textos/preços - clicável */}
          <Link href={("/produto/" + slugify(name) + "-" + id) as Route} className="flex-1 min-w-0">
            <div className="min-w-0">
              <div className="text-[13px] font-semibold leading-tight line-clamp-2 break-words hover:underline">{name}</div>
              {codigo_mercos && <div className="text-[10px] text-gray-500 font-mono mt-0.5">{codigo_mercos}</div>}
              {vendorName && <div className="text-[12px] text-gray-600 line-clamp-1">{vendorName}</div>}
              <div className="mt-1"><Stars value={ratingAvg} count={reviewsCount} /></div>
            </div>

            {typeof discountPercent === 'number' && discountPercent > 0 ? (
              <div className="mt-2">
                <div className="text-[12px] text-gray-600">
                  De: <span className="text-gray-400 line-through">R$ {((price) / (1 - (discountPercent || 0) / 100)).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff5c00] font-extrabold">R$ {price.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[#ff5c00] font-extrabold">R$ {price.toFixed(2)}</span>
                {typeof priceOriginal === 'number' && priceOriginal > price && (
                  <span className="text-gray-400 line-through text-[12px]">R$ {Number(priceOriginal).toFixed(2)}</span>
                )}
              </div>
            )}
          </Link>
          {/* Coluna de ícones alinhados verticalmente */}
          <div className="flex flex-col items-center justify-center gap-2 py-1 self-stretch">
            {user && (
              <button 
                onClick={handleFavorite}
                disabled={isLoading}
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                className={`w-9 h-9 grid place-items-center rounded-md border transition-all ${
                  isFavorite 
                    ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-300 hover:bg-gray-50 hover:border-[#ff5c00]'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <HeartOutline filled={isFavorite} />
              </button>
            )}
            <Link href={("/produto/" + slugify(name) + "-" + id) as Route} aria-label="Visualizar produto" className="w-9 h-9 grid place-items-center rounded-md border border-gray-300 hover:bg-gray-50">
              <EyeIcon />
            </Link>
            <button 
              onClick={handleAddToCart}
              aria-label="Adicionar ao carrinho" 
              className="w-9 h-9 grid place-items-center rounded-md border border-[#ff5c00] hover:bg-[#fff3ec]"
            >
              <CartIcon />
            </button>
          </div>
        </div>
      </div>
      
      {/* Modal de login necessário */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}

// IDs das categorias e distribuidor
const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
const BEBIDAS_ID = 'cat-1758882632653';
const BOMBONIERE_ID = 'cat-1758882669110';

export default function FavoritePicks() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FavItem[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        // Buscar produtos da Bambino (bebidas e bomboniere)
        const [pRes, bRes] = await Promise.all([
          fetch(`/api/products/public?distribuidor=${BAMBINO_ID}&limit=50&sort=created_at&order=desc`, {
            next: { revalidate: 60 } as any
          }),
          fetch('/api/bancas', {
            next: { revalidate: 60 } as any
          }),
        ]);
        let list: ApiProduct[] = [];
        
        if (pRes.ok) {
          const pj = await pRes.json();
          const allProducts = Array.isArray(pj?.data) ? pj.data : (Array.isArray(pj?.items) ? pj.items : []);
          
          console.log(`[FavoritePicks] Total produtos Bambino: ${allProducts.length}`);
          
          // Pegar os primeiros 12 produtos da Bambino (sem filtro de categoria)
          list = allProducts.slice(0, 12);
          
          console.log(`[FavoritePicks] Exibindo ${list.length} produtos Bambino`);
        }
        
        console.log(`[FavoritePicks] Total de produtos: ${list.length}`);
        let bancas: Record<string, ApiBanca> = {};
        if (bRes.ok) {
          const bj = await bRes.json();
          const bList: ApiBanca[] = Array.isArray(bj?.data) ? bj.data : [];
          bancas = Object.fromEntries(bList.map((b) => [b.id, b]));
        }

        const mapped: FavItem[] = list.map((p) => {
          const price = Number(p.price || 0);
          const priceOriginal = p.price_original != null ? Number(p.price_original) : null;
          const discountPercent = p.discount_percent != null ? Number(p.discount_percent) : (priceOriginal && priceOriginal > price ? Math.round((1 - price / priceOriginal) * 100) : null);
          return {
            id: p.id,
            name: p.name,
            vendorName: bancas[p.banca_id || '']?.name,
            image: (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop',
            price,
            priceOriginal,
            discountPercent,
            ratingAvg: p.rating_avg ?? null,
            reviewsCount: p.reviews_count ?? null,
            available: p.active !== false,
            codigo_mercos: (p as any).codigo_mercos || undefined,
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

  const data = useMemo(() => Array.isArray(items) ? items.slice(0, 12) : [], [items]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const touchRef = useRef<{ startX: number; startY: number; active: boolean } | null>(null);

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
    <section className="w-full">
      <div className="container-max">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image src="https://stackfood-react.6amtech.com/_next/static/media/fire.612dd1de.svg" alt="Fogo" width={23} height={23} />
              <h2 className="text-lg sm:text-xl font-semibold">Bomboniere e Bebidas</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">Os melhores produtos para você</p>
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

            {/* Desktop/Tablet: Grid 2x3 */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
