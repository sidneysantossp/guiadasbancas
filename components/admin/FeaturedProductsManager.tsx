"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface FeaturedProduct {
  id: string;
  name: string;
  image?: string;
  featured: boolean;
}

interface FeaturedProductsManagerProps {
  currentProductId?: string;
  onFeaturedChange?: (canFeature: boolean, featuredCount: number) => void;
}

export default function FeaturedProductsManager({ currentProductId, onFeaturedChange }: FeaturedProductsManagerProps) {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const authHeaders = useMemo(() => {
    if (typeof window === "undefined") return {} as Record<string, string>;
    const token = window.localStorage.getItem("gb:sellerToken") || "seller-token";
    return { Authorization: `Bearer ${token}` } as Record<string, string>;
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/jornaleiro/products", { 
        headers: authHeaders, 
        cache: "no-store" 
      });
      const json = await res.json();
      
      if (json?.success) {
        const items = Array.isArray(json.items) ? json.items : [];
        const mapped = items.map((item: any) => ({
          id: item.id,
          name: item.name || 'Produto',
          image: Array.isArray(item.images) && item.images.length ? item.images[0] : undefined,
          featured: Boolean(item.featured),
        }));
        setFeaturedProducts(mapped);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos em destaque:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeaturedProducts();
  }, [authHeaders]);

  const featuredCount = featuredProducts.filter(p => p.featured).length;
  const canAddMore = featuredCount < 8;
  const remainingSlots = 8 - featuredCount;

  // Notificar componente pai sobre mudanças
  useEffect(() => {
    onFeaturedChange?.(canAddMore, featuredCount);
  }, [canAddMore, featuredCount, onFeaturedChange]);

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/jornaleiro/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (res.ok) {
        await loadFeaturedProducts(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-600">Carregando produtos em destaque...</div>
      </div>
    );
  }

  if (!featuredProducts) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-600">Erro ao carregar produtos em destaque</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Contador */}
      <div className={`p-4 rounded-lg border ${canAddMore ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-800">🔥 Produtos em Destaque</h4>
            <p className="text-xs text-gray-600 mt-1">
              {featuredCount}/8 produtos destacados
              {canAddMore && ` • ${remainingSlots} vagas restantes`}
            </p>
          </div>
          <div className={`text-2xl font-bold ${canAddMore ? 'text-green-600' : 'text-amber-600'}`}>
            {featuredCount}/8
          </div>
        </div>
        
        {!canAddMore && (
          <div className="mt-2 p-2 bg-amber-100 border border-amber-200 rounded text-xs text-amber-700">
            <strong>⚠️ Limite atingido!</strong> Desative algum produto abaixo para destacar este.
          </div>
        )}
      </div>

      {/* Tabela de produtos em destaque */}
      {featuredProducts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h5 className="text-sm font-medium text-gray-800">Gerenciar Produtos em Destaque</h5>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className={`flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0 ${
                  product.id === currentProductId ? 'bg-blue-50' : ''
                }`}
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  {product.image ? (
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={48} 
                      height={48} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sem imagem
                    </div>
                  )}
                </div>

                {/* Nome do produto */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                    {product.id === currentProductId && (
                      <span className="ml-2 text-xs text-blue-600 font-normal">(produto atual)</span>
                    )}
                  </div>
                </div>

                {/* Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={() => toggleFeatured(product.id, product.featured)}
                    className="rounded text-[#ff5c00] focus:ring-[#ff5c00]"
                    disabled={product.id === currentProductId}
                  />
                  <span className="text-xs text-gray-600">
                    {product.featured ? 'Em destaque' : 'Normal'}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
