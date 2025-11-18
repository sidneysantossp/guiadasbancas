"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import type { Route } from "next";

type BrancaleoneProduct = {
  id: string;
  name: string;
  image: string;
  price: number;
  priceOriginal?: number | null;
  discountPercent?: number | null;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function ProductCard({ p }: { p: BrancaleoneProduct }) {
  const price = p.price ?? 0;
  const baseDiscount = typeof p.discountPercent === 'number' ? Math.round(p.discountPercent) : undefined;
  const inferredDiscount = p.priceOriginal && p.priceOriginal > price ? Math.round((1 - price / p.priceOriginal) * 100) : 0;
  const discount = typeof baseDiscount === 'number' ? Math.max(0, baseDiscount) : inferredDiscount;
  const oldPrice = (p.priceOriginal && p.priceOriginal > price)
    ? p.priceOriginal
    : (discount > 0 ? price / (1 - discount / 100) : null);
  const installmentValue = price > 0 ? price / 6 : null; // 6 parcelas

  return (
    <Link 
      href={("/produto/" + slugify(p.name) + "-" + p.id) as Route} 
      className="group block bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all p-4 min-w-[200px]"
    >
      {/* Imagem do produto */}
      <div className="relative w-full aspect-square bg-gray-50 rounded-md mb-3 overflow-hidden">
        <Image
          src={p.image}
          alt={p.name}
          fill
          sizes="200px"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Nome do produto */}
      <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 min-h-[2.5rem]">
        {p.name}
      </h3>

      {/* Preço parcelado */}
      {installmentValue && (
        <div className="text-xs text-gray-600 mb-1">
          6x R$ {installmentValue.toFixed(2)} sem juros
        </div>
      )}

      {/* Preços e desconto */}
      <div className="flex items-center gap-2 mb-2">
        {oldPrice && isFinite(oldPrice) && (
          <span className="text-xs text-gray-400 line-through">
            R$ {oldPrice.toFixed(2)}
          </span>
        )}
        <span className="text-lg font-semibold text-gray-900">
          R$ {price.toFixed(0)}
        </span>
        {discount > 0 && (
          <span className="text-xs font-semibold text-green-600">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Badge Frete grátis */}
      <div className="flex flex-wrap gap-1">
        <span className="text-[10px] text-green-600 font-medium">
          Frete grátis
        </span>
      </div>
    </Link>
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
        
        // Buscar produtos direto da API pública, limitando bastante
        const prodRes = await fetch(`/api/products/public?limit=100&sort=created_at&order=desc`);
        
        if (!prodRes.ok) {
          console.error('Erro ao buscar produtos:', prodRes.status);
          if (active) setProducts([]);
          return;
        }
        
        const prodData = await prodRes.json();
        const items = Array.isArray(prodData?.items) ? prodData.items : (Array.isArray(prodData?.data) ? prodData.data : []);
        
        // Filtrar produtos da Brancaleone
        const brancaleoneItems = items.filter((p: any) => {
          const distribNome = p.distribuidor_nome || p.distributor_name || '';
          return distribNome.toLowerCase().includes('brancaleone');
        });
        
        console.log('Total de produtos da API:', items.length);
        console.log('Produtos Brancaleone encontrados:', brancaleoneItems.length);
        
        const mapped: BrancaleoneProduct[] = brancaleoneItems
          .filter((p: any) => p?.id && typeof p.price === 'number' && p.price > 0 && p.images && p.images[0])
          .map((p: any) => ({
            id: p.id,
            name: p.name || 'Produto',
            image: p.images[0],
            price: Number(p.price || 0),
            priceOriginal: p.price_original != null ? Number(p.price_original) : null,
            discountPercent: p.discount_percent != null ? Number(p.discount_percent) : null,
          }));

        console.log('Produtos Brancaleone mapeados:', mapped.length);
        if (active) setProducts(mapped.slice(0, 12)); // Limitar a 12 produtos
      } catch (error) {
        console.error('Erro ao carregar produtos Brancaleone:', error);
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
    // Exibir mensagem temporária para debug
    return (
      <section className="w-full py-8 bg-gray-50">
        <div className="container-max">
          <div className="text-center text-gray-500 text-sm">
            Nenhum produto Brancaleone disponível no momento.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="container-max">
        {/* Título */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Produtos que outras pessoas compram de novo
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
