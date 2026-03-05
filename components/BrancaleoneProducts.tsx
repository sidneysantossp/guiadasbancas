"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import type { Route } from "next";
import { buildPublicProductPath } from "@/lib/product-url";

type BrancaleoneProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
  codigo_mercos?: string;
  rating_avg?: number;
  reviews_count?: number;
  pronta_entrega?: boolean;
  sob_encomenda?: boolean;
  pre_venda?: boolean;
  banca_name?: string;
};

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, value));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="12" height="12" fill="currentColor" className="text-[#f59e0b]">
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

function ProductCard({ p }: { p: BrancaleoneProduct }) {
  const price = p.price ?? 0;
  const discount = p.discountPercent || 0;
  const productHref = buildPublicProductPath(p.name, p.banca_name, p.id, p.codigo_mercos) as Route;
  const bancaDisplay = p.banca_name
    ? (/^banca\b/i.test(p.banca_name) ? p.banca_name : `Banca ${p.banca_name}`)
    : 'Banca Local';

  return (
    <div className="flex flex-col rounded-[12px] border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow min-w-[220px] overflow-hidden">
      {/* Imagem */}
      <div className="relative">
        <Link href={productHref}>
          <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="220px"
              className="object-contain p-2"
            />
          </div>
        </Link>
      </div>

      {/* Conteúdo */}
      <div className="p-2 flex flex-col flex-1">
        <Link href={productHref} className="text-[12px] font-semibold hover:underline line-clamp-2">
          {p.name}
        </Link>
        
        {/* Código do produto */}
        {p.codigo_mercos && (
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            Cód: {p.codigo_mercos}
          </p>
        )}
        
        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-1">
          Entregue por: <span className="font-medium">{bancaDisplay}</span>
        </p>
        
        {/* Badges */}
        <div className="flex flex-wrap gap-1 mt-1">
          {p.pronta_entrega && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>
              Pronta Entrega
            </span>
          )}
          {p.sob_encomenda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Sob Encomenda
            </span>
          )}
          {p.pre_venda && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 px-2 py-[2px] text-[10px] font-semibold">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Pré-Venda
            </span>
          )}
        </div>
        
        {/* Avaliações */}
        <div className="mt-0.5 flex items-center gap-1.5">
          <Stars value={p.rating_avg || 5} />
          {typeof p.reviews_count === 'number' && p.reviews_count > 0 && (
            <span className="text-[10px] text-gray-500">{p.reviews_count} avaliações</span>
          )}
        </div>
        
        {/* Preço e Botões */}
        <div className="mt-auto pt-1.5 flex flex-col gap-1">
          <div className="flex flex-col">
            {discount > 0 ? (
              <>
                <div className="text-[11px] text-gray-600">
                  De: <span className="text-gray-400 line-through">R$ {(price / (1 - discount / 100)).toFixed(2)}</span>
                </div>
                <div className="text-[16px] text-[#ff5c00] font-extrabold">Por: R$ {price.toFixed(2)}</div>
              </>
            ) : (
              <div className="text-[16px] text-[#ff5c00] font-extrabold">Por: R$ {price.toFixed(2)}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrancaleoneProducts() {
  const [products, setProducts] = useState<BrancaleoneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
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
        
        const prodRes = await fetch(`/api/products/public?limit=96&sort=created_at&order=desc${locationQuery}`);
        
        if (!prodRes.ok) {
          console.error('Erro ao buscar produtos Brancaleone:', prodRes.status);
          if (active) setProducts([]);
          return;
        }
        
        const prodData = await prodRes.json();
        const items = Array.isArray(prodData?.items) ? prodData.items : (Array.isArray(prodData?.data) ? prodData.data : []);
        
        console.log('Produtos encontrados:', items.length);
        
        const marvelPatterns = [
          /marvel/i,
          /homem-?aranha/i,
          /spider[- ]?man/i,
          /x[- ]?men/i,
          /deadpool/i,
          /vingadores/i,
          /avengers/i,
          /wolverine/i,
          /thor/i,
          /hulk/i,
          /homem de ferro/i,
          /iron man/i,
        ];

        const mapped: BrancaleoneProduct[] = items
          .filter((p: any) => {
            if (!p?.id || typeof p.price !== 'number' || p.price <= 0 || !p.images || !p.images[0]) return false;
            const name = String(p.name || "");
            return marvelPatterns.some((re) => re.test(name));
          })
          .map((p: any) => ({
            id: p.id,
            name: p.name || 'Produto',
            image: p.images[0],
            price: Number(p.price || 0),
            priceOriginal: p.price_original != null ? Number(p.price_original) : null,
            discountPercent: p.discount_percent != null ? Number(p.discount_percent) : null,
            codigo_mercos: p.codigo_mercos || undefined,
            rating_avg: typeof p.rating_avg === 'number' ? p.rating_avg : undefined,
            reviews_count: typeof p.reviews_count === 'number' ? p.reviews_count : undefined,
            pronta_entrega: p.pronta_entrega === true,
            sob_encomenda: p.sob_encomenda === true,
            pre_venda: p.pre_venda === true,
            // OTIMIZAÇÃO: Usar banca_name que já vem da API via JOIN
            banca_name: p.banca_name || undefined,
          }));

        console.log('Produtos mapeados:', mapped.length);
        if (active) setProducts(mapped.slice(0, 48)); // Desktop: até 48 produtos
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // Controlar visibilidade das setas
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    checkScroll();
    container.addEventListener('scroll', checkScroll);
    return () => container.removeEventListener('scroll', checkScroll);
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 600;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <section className="w-full py-8">
        <div className="container-max">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[200px] h-80 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0 && !loading) {
    return null; // Não renderizar nada se não houver produtos
  }

  return (
    <section className="w-full pt-8 md:pt-10">
      <div className="container-max">
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Mundo Marvel
          </h2>
        </div>

        {/* Carrossel */}
        <div className="relative group">
          {/* Seta esquerda */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Anterior"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Container de scroll */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>

          {/* Seta direita */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próximo"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
