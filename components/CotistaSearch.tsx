"use client";

import { useState, useEffect, useRef } from "react";

type Cotista = {
  id: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
};

type Props = {
  onSelect: (cotista: Cotista | null) => void;
  selectedCnpjCpf?: string;
};

export default function CotistaSearch({ onSelect, selectedCnpjCpf }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search cotistas
  useEffect(() => {
    const searchCotistas = async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/admin/cotistas?search=${encodeURIComponent(search)}&limit=10`, {
          headers: { 'Authorization': 'Bearer admin-token' }
        });
        const json = await res.json();
        if (json.success) {
          setResults(json.data || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Error searching cotistas:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchCotistas, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (cotista: Cotista) => {
    onSelect(cotista);
    setSearch(cotista.razao_social);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
    onSelect(null);
  };

  const formatCnpjCpf = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return value;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Digite o nome, CNPJ/CPF ou código do cotista..."
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-orange-500 focus:ring-orange-500"
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.map((cotista) => (
            <button
              key={cotista.id}
              type="button"
              onClick={() => handleSelect(cotista)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {cotista.razao_social}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-mono">
                    {formatCnpjCpf(cotista.cnpj_cpf)}
                  </p>
                  {(cotista.cidade || cotista.estado) && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {cotista.cidade && cotista.estado 
                        ? `${cotista.cidade}/${cotista.estado}`
                        : cotista.cidade || cotista.estado}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#ff5c00] bg-orange-50 px-2 py-1 rounded">
                  #{cotista.codigo}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-1 text-xs text-gray-500">
          Buscando...
        </div>
      )}

      {/* No Results */}
      {showResults && !loading && results.length === 0 && search.length >= 2 && (
        <div className="mt-1 text-xs text-gray-500">
          Nenhum cotista encontrado
        </div>
      )}
    </div>
  );
}
