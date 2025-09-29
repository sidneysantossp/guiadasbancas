"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchResult = {
  id: string;
  name: string;
  image?: string;
  price: number;
  banca_name: string;
  banca_id: string;
  distance?: number;
  category: string;
};

type SearchAutocompleteProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (result: SearchResult) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
};

export default function SearchAutocomplete({
  query,
  onQueryChange,
  onSelect,
  onSubmit,
  placeholder = "Buscar produtos, categorias...",
  className = ""
}: SearchAutocompleteProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Simular dados de produtos para autocomplete
  const mockProducts: SearchResult[] = [
    {
      id: "prod-1",
      name: "Chico Bento - Edição 450",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
      price: 8.90,
      banca_name: "Banca São Jorge",
      banca_id: "banca-1",
      distance: 0.5,
      category: "Gibis"
    },
    {
      id: "prod-2", 
      name: "Chico Bento Moço - Aventuras",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
      price: 12.50,
      banca_name: "Banca Central",
      banca_id: "banca-2",
      distance: 1.2,
      category: "Gibis"
    },
    {
      id: "prod-3",
      name: "Revista Chiclete com Banana",
      price: 15.90,
      banca_name: "Banca do Centro",
      banca_id: "banca-3",
      distance: 0.8,
      category: "Revistas"
    },
    {
      id: "prod-4",
      name: "Folha de S.Paulo",
      price: 3.50,
      banca_name: "Banca São Jorge",
      banca_id: "banca-1", 
      distance: 0.5,
      category: "Jornais"
    },
    {
      id: "prod-5",
      name: "Revista Veja",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400",
      price: 12.90,
      banca_name: "Banca Central",
      banca_id: "banca-2",
      distance: 1.2,
      category: "Revistas"
    },
    {
      id: "prod-6",
      name: "O Estado de S.Paulo",
      price: 4.00,
      banca_name: "Banca do Centro", 
      banca_id: "banca-3",
      distance: 0.8,
      category: "Jornais"
    }
  ];

  // Buscar produtos baseado na query
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    
    // Simular delay de API
    const timeoutId = setTimeout(() => {
      const filtered = mockProducts
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.banca_name.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => (a.distance || 0) - (b.distance || 0)) // Ordenar por proximidade
        .slice(0, 6); // Limitar a 6 resultados

      setResults(filtered);
      setIsOpen(filtered.length > 0);
      setLoading(false);
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

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
    // Redirecionar para a página do produto
    router.push(`/produto/${result.name.toLowerCase().replace(/\s+/g, '-')}-prod-${result.id}`);
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
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left transition-colors ${
                    selectedIndex === index ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                >
                  {/* Imagem do produto */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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

                  {/* Informações do produto */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {result.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{result.banca_name}</span>
                      {result.distance && (
                        <>
                          <span>•</span>
                          <span>{result.distance}km</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Preço */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-semibold text-[#ff5c00]">
                      R$ {result.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.category}
                    </div>
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
