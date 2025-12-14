"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  image?: string;
  price: number;
  price_original?: number;
  discount_percent?: number;
  category: string;
  banca_name: string;
  banca_id: string;
  rating_avg?: number;
  reviews_count?: number;
};

type RelatedProductsSliderProps = {
  searchQuery: string;
  category?: string;
};

export default function RelatedProductsSlider({ searchQuery, category }: RelatedProductsSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      
      try {
        // Primeiro, tentar buscar produtos da categoria específica
        let apiUrl = '/api/products/most-searched';
        let params = new URLSearchParams();
        
        if (category) {
          params.append('category', category);
        }
        
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        
        if (params.toString()) {
          apiUrl += '?' + params.toString();
        }
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        let fetchedProducts = [];
        
        if (data.ok && Array.isArray(data.data) && data.data.length > 0) {
          // Mapear produtos da API para o formato esperado
          fetchedProducts = data.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            image: p.images?.[0] || p.image,
            price: p.price,
            price_original: p.price_original,
            discount_percent: p.discount_percent,
            category: p.category || 'Produtos',
            banca_name: p.banca?.name || 'Banca',
            banca_id: p.banca?.id || p.banca_id || '',
            rating_avg: p.rating_avg,
            reviews_count: p.reviews_count
          }));
        }
        
        // Se não encontrou produtos da categoria específica, buscar produtos gerais
        if (fetchedProducts.length === 0) {
          const generalResponse = await fetch('/api/products/most-searched?limit=8');
          const generalData = await generalResponse.json();
          
          if (generalData.ok && Array.isArray(generalData.data)) {
            fetchedProducts = generalData.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              image: p.images?.[0] || p.image,
              price: p.price,
              price_original: p.price_original,
              discount_percent: p.discount_percent,
              category: p.category || 'Produtos',
              banca_name: p.banca?.name || 'Banca',
              banca_id: p.banca?.id || p.banca_id || '',
              rating_avg: p.rating_avg,
              reviews_count: p.reviews_count
            }));
          }
        }
        
        setProducts(fetchedProducts.slice(0, 8));
      } catch (error) {
        console.error('Erro ao buscar produtos relacionados:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRelatedProducts();
  }, [searchQuery, category]);

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Gibis': return '📚';
      case 'Revistas': return '📖';
      case 'Jornais': return '📰';
      case 'Livros': return '📗';
      default: return '📦';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border rounded-lg p-4 animate-pulse">
              <div className="h-40 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Produtos relacionados à sua busca
        </h2>
        
        {products.length > itemsPerView && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Anterior"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              aria-label="Próximo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-2"
            >
              <Link
                href={`/produto/${product.id}`}
                className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Imagem do produto */}
                <div className="relative h-40 bg-gray-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      {getCategoryIcon(product.category)}
                    </div>
                  )}
                  
                  {/* Badge de desconto */}
                  {product.discount_percent && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount_percent}%
                    </div>
                  )}
                </div>

                {/* Informações do produto */}
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  
                  {/* Avaliações */}
                  {product.rating_avg && (
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating_avg!) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
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

                  {/* Preço */}
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

                  {/* Banca */}
                  <div className="text-xs text-gray-500 mt-2">
                    {product.banca_name}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      {products.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(maxIndex + 1)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === i ? 'bg-[#ff5c00]' : 'bg-gray-300'
              }`}
              aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
