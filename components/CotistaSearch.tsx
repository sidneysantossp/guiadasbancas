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
  mode?: 'admin' | 'public';
};

export default function CotistaSearch({ onSelect, selectedCnpjCpf, mode = 'admin' }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<Cotista | null>(null);
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

  const selectedLabel = (c: Cotista | null) => c ? (c.codigo ? `${c.codigo} - ${c.razao_social}` : c.razao_social) : '';

  // Search cotistas
  useEffect(() => {
    // If we have a selection and the input still matches the selection label, do not search
    if (selected && search.trim() === selectedLabel(selected)) {
      setShowResults(false);
      return;
    }
    if (mode === 'admin') {
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
    } else {
      // PUBLIC MODE: only exact lookups, never list others
      const lookup = async () => {
        const term = search.trim();
        const digits = term.replace(/\D/g, '');
        if (digits.length === 11 || digits.length === 14) {
          try {
            setLoading(true);
            const res = await fetch(`/api/public/cotistas/lookup?q=${encodeURIComponent(term)}`);
            const json = await res.json();
            if (json.success) {
              if (json.data) {
                onSelect(json.data);
                setSelected(json.data);
                setSearch(selectedLabel(json.data));
                setShowResults(false);
              } else {
                onSelect(null);
                setSelected(null);
              }
            }
          } catch (err) {
            console.error('Lookup error:', err);
          } finally {
            setLoading(false);
          }
          return;
        }
        // Optional: allow code lookup when full code is typed (3-6 digits)
        if (/^\d+$/.test(term) && digits.length >= 3 && digits.length <= 6) {
          try {
            setLoading(true);
            const res = await fetch(`/api/public/cotistas/lookup?q=${encodeURIComponent(term)}&type=code`);
            const json = await res.json();
            if (json.success) {
              if (json.data) {
                onSelect(json.data);
                setSelected(json.data);
                setSearch(selectedLabel(json.data));
                setShowResults(false);
              } else {
                onSelect(null);
                setSelected(null);
              }
            }
          } catch (err) {
            console.error('Lookup error:', err);
          } finally {
            setLoading(false);
          }
          return;
        }
        // otherwise, clear selection without querying
        onSelect(null);
        setSelected(null);
        setResults([]);
        setShowResults(false);
      };

      const timer = setTimeout(lookup, 300);
      return () => clearTimeout(timer);
    }
  }, [search, mode, onSelect]);

  const handleSelect = (cotista: Cotista) => {
    onSelect(cotista);
    setSelected(cotista);
    setSearch(selectedLabel(cotista));
    setShowResults(false);
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
    onSelect(null);
    setSelected(null);
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
        {/** readOnly when public mode has a selection to avoid re-queries */}
        {/** user can click X to clear and type another value */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => mode === 'admin' && results.length > 0 && setShowResults(true)}
          placeholder={mode === 'admin' ? "Digite o nome, CNPJ/CPF ou código do cotista..." : "Digite seu CNPJ/CPF ou código..."}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-orange-500 focus:ring-orange-500"
          readOnly={mode === 'public' && !!selected}
          aria-readonly={mode === 'public' && !!selected}
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

      {/* Results Dropdown (ADMIN ONLY) */}
      {mode === 'admin' && showResults && results.length > 0 && (
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
                  {/* Admin list may show limited details; keep as-is here */}
                  <p className="text-xs text-gray-600 mt-1 font-mono">{formatCnpjCpf(cotista.cnpj_cpf)}</p>
                  {(cotista.cidade || cotista.estado) && (<p className="text-xs text-gray-500 mt-1">📍 {cotista.cidade && cotista.estado ? `${cotista.cidade}/${cotista.estado}` : cotista.cidade || cotista.estado}</p>)}
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

      {/* No Results (ADMIN ONLY) */}
      {mode === 'admin' && showResults && !loading && results.length === 0 && search.length >= 2 && (
        <div className="mt-1 text-xs text-gray-500">
          Nenhum cotista encontrado
        </div>
      )}
    </div>
  );
}
