"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBuildingStore } from "@tabler/icons-react";

type SearchResult = {
  type: 'product' | 'banca';
  id: string;
  name: string;
  image?: string | null;
  price: number | null;
  banca_name: string;
  banca_id: string;
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
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fallback: usar localização salva (CEP/modal) quando geolocalização não estiver disponível
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gb:userLocation');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const lat = typeof parsed?.lat === 'number' ? parsed.lat : parseFloat(parsed?.lat);
      const lng = typeof parsed?.lng === 'number' ? parsed.lng : parseFloat(parsed?.lng);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        setUserLocation({ lat, lng });
      }
    } catch {
      // ignore
    }
  }, []);

  // Obter geolocalização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocalização não disponível:', error.message);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
      );
    }
  }, []);

  // Buscar produtos/bancas da API
  useEffect(() => {
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
        
        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
          setIsOpen(data.results.length > 0);
        } else {
          setResults([]);
          setIsOpen(false);
        }

        setLoading(false);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Erro ao buscar:', error);
        setResults([]);
        setIsOpen(false);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, bancaId, userLocation]);

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
    onSelect(result);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (result.type === 'banca') {
      // Redirecionar para a página da banca
      // Rota pública canônica: /bancas/[id]
      router.push(`/bancas/${result.id}`);
    } else {
      // Redirecionar para a página do produto
      // Rota pública canônica: /produto/[id]
      router.push(`/produto/${result.id}`);
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

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={`w-full ${className}`}
        autoComplete="off"
      />

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
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left transition-colors ${
                    selectedIndex === index ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                >
                  {/* Imagem */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                    {result.image ? (
                      <Image
                        src={result.image}
                        alt={result.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
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
                        // Banca: mostrar apenas badge de distância
                        result.distance !== undefined && (
                          <span className="inline-flex items-center px-2 py-0.5 bg-[#ff5c00] text-white text-xs rounded-full font-medium">
                            {result.distance < 1 
                              ? `${Math.round(result.distance * 1000)}m` 
                              : `${result.distance.toFixed(1)}km`}
                          </span>
                        )
                      ) : (
                        // Produto: mostrar nome da banca
                        <span className="text-gray-500 truncate">{(result.banca_name || '').split(' ')[0] || 'Banca'}</span>
                      )}
                    </div>
                  </div>

                  {/* Preço ou Tag */}
                  <div className="text-right flex-shrink-0">
                    {result.type === 'product' && result.price !== null ? (
                      <>
                        <div className="font-semibold text-[#ff5c00]">
                          R$ {result.price.toFixed(2)}
                        </div>
                        <span className="inline-block px-2 py-1 bg-[#ff5c00] text-white text-xs rounded-full font-medium">
                          Ver produto
                        </span>
                      </>
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
                onClick={() => setIsOpen(false)}
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
