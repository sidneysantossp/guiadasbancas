"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconBuildingStore, IconSearch } from "@tabler/icons-react";
import { buildFriendlyProductPath } from "@/lib/product-url";

type SearchResult = {
  type: 'product' | 'banca';
  id: string;
  name: string;
  image?: string | null;
  price: number | null;
  banca_name: string;
  banca_id: string;
  codigo_mercos?: string | null;
  distance?: number;
  category: string;
  address?: string;
};

type SearchAutocompleteProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (result: SearchResult) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
  bancaId?: string; // ID da banca para filtrar produtos apenas daquela banca
};

export default function SearchAutocomplete({
  query,
  onQueryChange,
  onSelect,
  onSubmit,
  placeholder = "Buscar produtos, categorias...",
  className = "",
  bancaId
}: SearchAutocompleteProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [allowOpen, setAllowOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const selectedQueryRef = useRef<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 🎯 PRIORIDADE 1: Usar localização salva (CEP manual) - tem prioridade sobre geolocalização
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gdb_location'); // Chave correta do location.ts
      if (raw) {
        const parsed = JSON.parse(raw);
        const lat = typeof parsed?.lat === 'number' ? parsed.lat : parseFloat(parsed?.lat);
        const lng = typeof parsed?.lng === 'number' ? parsed.lng : parseFloat(parsed?.lng);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          console.log('[SearchAutocomplete] 📍 Usando localização salva:', { lat, lng, source: parsed.source });
          setUserLocation({ lat, lng });
          return; // Não buscar geolocalização se já tem localização salva
        }
      }
      
      // 🎯 PRIORIDADE 2: Se não tem localização salva, tentar geolocalização do navegador
      // 🔒 MAS APENAS se usuário não definiu CEP manual
      const isManualLocation = sessionStorage.getItem('gdb_location_manual');
      if (isManualLocation) {
        console.log('[SearchAutocomplete] 🔒 Localização manual definida - ignorando geolocalização');
        return;
      }
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // 🔒 Verificar novamente antes de aplicar (race condition)
            const stillManual = sessionStorage.getItem('gdb_location_manual');
            if (stillManual) {
              console.log('[SearchAutocomplete] 🔒 CEP manual foi definido durante geolocalização - ignorando');
              return;
            }
            
            console.log('[SearchAutocomplete] 📍 Usando geolocalização do navegador');
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log('[SearchAutocomplete] ⚠️ Geolocalização não disponível:', error.message);
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
        );
      }
    } catch (e) {
      console.error('[SearchAutocomplete] Erro ao carregar localização:', e);
    }
  }, []);
  
  // 🔄 Escutar mudanças na localização (quando usuário muda CEP)
  useEffect(() => {
    const handleLocationUpdate = (event: any) => {
      const loc = event.detail;
      if (loc?.lat && loc?.lng) {
        console.log('[SearchAutocomplete] 🔄 Localização atualizada:', { lat: loc.lat, lng: loc.lng, source: loc.source });
        setUserLocation({ lat: loc.lat, lng: loc.lng });
      }
    };
    
    window.addEventListener('gdb:location-updated', handleLocationUpdate);
    return () => window.removeEventListener('gdb:location-updated', handleLocationUpdate);
  }, []);

  // Buscar produtos/bancas da API
  useEffect(() => {
    let active = true;
    if (selectedQueryRef.current && selectedQueryRef.current !== query) {
      selectedQueryRef.current = null;
    }

    if (selectedQueryRef.current && selectedQueryRef.current === query) {
      setIsOpen(false);
      setLoading(false);
      return;
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    
    const timeoutId = setTimeout(async () => {
      try {
        let url = `/api/search/autocomplete?q=${encodeURIComponent(query)}&limit=6`;
        
        // Se estiver na página de uma banca, filtrar por banca_id
        if (bancaId) {
          url += `&banca_id=${bancaId}`;
        }
        
        // Adicionar coordenadas do usuário para cálculo de distância
        if (userLocation) {
          url += `&lat=${userLocation.lat}&lng=${userLocation.lng}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!active) return;

        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
          setIsOpen(allowOpen && data.results.length > 0);
        } else {
          setResults([]);
          setIsOpen(false);
        }

        setLoading(false);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erro ao buscar:', error);
        if (!active) return;
        setResults([]);
        setIsOpen(false);
        setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [query, bancaId, userLocation, allowOpen]);

  useEffect(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
    setAllowOpen(false);
  }, [pathname]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegação por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else {
          onSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelect = (result: SearchResult) => {
    selectedQueryRef.current = result.name;
    onSelect(result);
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    setAllowOpen(false);
    
    if (result.type === 'banca') {
      // Redirecionar para a página da banca
      // Rota pública canônica: /bancas/[id]
      router.push(`/bancas/${result.id}`);
    } else {
      // Redirecionar para a rota canônica com slug amigável
      const productPath = buildFriendlyProductPath(result.banca_name, result.name);
      router.push(productPath);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Gibis': return '📚';
      case 'Revistas': return '📖';
      case 'Jornais': return '📰';
      case 'Livros': return '📗';
      case 'Banca': return <IconBuildingStore size={24} className="text-gray-400" />;
      default: return '📦';
    }
  };

  // Handler para erro de carregamento de imagem
  const handleImageError = useCallback((imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl));
  }, []);

  // Verificar se deve mostrar imagem ou fallback
  const shouldShowImage = (imageUrl: string | null | undefined): boolean => {
    if (!imageUrl) return false;
    if (failedImages.has(imageUrl)) return false;
    return true;
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setAllowOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setAllowOpen(true);
            if (query.length >= 2 && results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pr-10 ${className}`}
          autoComplete="off"
        />
        <IconSearch size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>

      {/* Dropdown de resultados */}
      {isOpen && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ff5c00] mx-auto"></div>
              <span className="text-sm mt-2 block">Buscando...</span>
            </div>
          ) : (
            <>
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  type="button"
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left transition-colors ${
                    selectedIndex === index ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                >
                  {/* Imagem */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    {shouldShowImage(result.image) ? (
                      <img
                        src={result.image!}
                        alt={result.name}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(result.image!)}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                        {getCategoryIcon(result.category)}
                      </div>
                    )}
                  </div>

                  {/* Informações */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {result.type === 'banca' ? (
                        // Banca: mostrar badge de distância
                        result.distance !== undefined && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#ff5c00] text-white text-xs rounded-full font-medium">
                            {result.distance < 1 
                              ? `${Math.round(result.distance * 1000)}m` 
                              : `${result.distance.toFixed(1)}km`}
                          </span>
                        )
                      ) : (
                        // Produto: mostrar nome da banca + distância
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 truncate max-w-[120px]">{result.banca_name || 'Banca'}</span>
                          {result.distance !== undefined && (
                            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                              {result.distance < 1 
                                ? `${Math.round(result.distance * 1000)}m` 
                                : `${result.distance.toFixed(1)}km`}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preço ou Tag */}
                  <div className="text-right flex-shrink-0">
                    {result.type === 'product' && result.price !== null ? (
                      <div className="font-semibold text-[#ff5c00]">
                        R$ {result.price.toFixed(2)}
                      </div>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                        {result.type === 'banca' ? 'Ver Banca' : result.category}
                      </span>
                    )}
                  </div>
                </button>
              ))}

              {/* Link para ver todos os resultados */}
              <Link
                href={`/buscar?q=${encodeURIComponent(query)}`}
                className="block p-3 text-center text-[#ff5c00] hover:bg-orange-50 border-t border-gray-200 font-medium"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedIndex(-1);
                  setAllowOpen(false);
                }}
              >
                Ver todos os resultados para "{query}"
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
