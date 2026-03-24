"use client";

import { useEffect, useRef, useState } from "react";

export type PartnerRegistryEntry = {
  id: string;
  codigo: string;
  razao_social: string;
  cnpj_cpf: string;
  telefone?: string;
  cidade?: string;
  estado?: string;
};

export type PartnerRegistrySearchProps = {
  onSelect: (entry: PartnerRegistryEntry | null) => void;
  selectedCnpjCpf?: string;
  initialValue?: string;
  disabled?: boolean;
  mode?: "admin" | "public";
  supportWhatsapp?: string;
  onInputChange?: (value: string) => void;
};

export default function PartnerRegistrySearch({
  onSelect,
  selectedCnpjCpf,
  initialValue,
  disabled = false,
  mode = "admin",
  supportWhatsapp,
  onInputChange,
}: PartnerRegistrySearchProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<PartnerRegistryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<PartnerRegistryEntry | null>(null);
  const [notFound, setNotFound] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const supportNumber = (supportWhatsapp || (process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP as string) || "").trim();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = (entry: PartnerRegistryEntry | null) =>
    entry ? (entry.codigo ? `${entry.codigo} - ${entry.razao_social}` : entry.razao_social) : "";

  useEffect(() => {
    const value = String(initialValue || "").trim();
    if (!value) return;
    if (selected) return;
    setSearch((current) => (current.trim() ? current : value));
  }, [initialValue, selected]);

  useEffect(() => {
    if (selected && search.trim() === selectedLabel(selected)) {
      setShowResults(false);
      return;
    }

    if (notFound) setNotFound(false);

    if (mode === "admin") {
      const searchPartnerRegistry = async () => {
        if (search.length < 2) {
          setResults([]);
          return;
        }

        try {
          setLoading(true);
          const res = await fetch(`/api/admin/cotistas?search=${encodeURIComponent(search)}&limit=10`);
          const json = await res.json();
          if (json.success) {
            setResults(json.data || []);
            setShowResults(true);
          }
        } catch (error) {
          console.error("Error searching partner registry:", error);
        } finally {
          setLoading(false);
        }
      };

      const timer = setTimeout(searchPartnerRegistry, 300);
      return () => clearTimeout(timer);
    }

    const lookup = async () => {
      const term = search.trim();
      const digits = term.replace(/\D/g, "");

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
              setNotFound(true);
            }
          }
        } catch (err) {
          console.error("Lookup error:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

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
          console.error("Lookup error:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      onSelect(null);
      setSelected(null);
      setResults([]);
      setShowResults(false);
    };

    const timer = setTimeout(lookup, 300);
    return () => clearTimeout(timer);
  }, [search, mode, notFound, onSelect, selected]);

  const handleSelect = (entry: PartnerRegistryEntry) => {
    onSelect(entry);
    setSelected(entry);
    setSearch(selectedLabel(entry));
    setShowResults(false);
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
    onSelect(null);
    setSelected(null);
    setNotFound(false);
  };

  const formatCnpjCpf = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (cleaned.length === 14) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return value;
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onInputChange?.(e.target.value);
          }}
          onFocus={() => mode === "admin" && results.length > 0 && setShowResults(true)}
          placeholder={
            mode === "admin"
              ? "Digite o nome, CNPJ/CPF ou codigo da rede..."
              : "Digite o CPF/CNPJ ou codigo da rede parceira..."
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-orange-500 focus:ring-orange-500"
          disabled={disabled}
          readOnly={(mode === "public" && !!selected) || disabled}
          aria-readonly={(mode === "public" && !!selected) || disabled}
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            X
          </button>
        )}
      </div>

      {mode === "admin" && showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleSelect(entry)}
              className="w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{entry.razao_social}</p>
                  <p className="mt-1 font-mono text-xs text-gray-600">{formatCnpjCpf(entry.cnpj_cpf)}</p>
                  {(entry.cidade || entry.estado) && (
                    <p className="mt-1 text-xs text-gray-500">
                      {entry.cidade && entry.estado
                        ? `${entry.cidade}/${entry.estado}`
                        : entry.cidade || entry.estado}
                    </p>
                  )}
                </div>
                <span className="shrink-0 rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-[#ff5c00]">
                  #{entry.codigo}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {loading && <div className="mt-1 text-xs text-gray-500">Buscando...</div>}

      {mode === "admin" && showResults && !loading && results.length === 0 && search.length >= 2 && (
        <div className="mt-1 text-xs text-gray-500">Nenhum cadastro encontrado</div>
      )}

      {mode === "public" && !loading && notFound && (
        <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Nenhum cadastro comercial encontrado para este CPF/CNPJ ou codigo informado.
          {supportNumber ? (
            <>
              {" "}
              Se voce acredita que sua banca ja faz parte da rede parceira, fale com o suporte no{" "}
              <a
                href={`https://wa.me/${supportNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Oi! Nao encontrei meu cadastro comercial na rede parceira e preciso de ajuda."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#ff5c00] underline"
              >
                WhatsApp
              </a>
              .
            </>
          ) : null}
        </div>
      )}

      {selected && selectedCnpjCpf && selected.cnpj_cpf !== selectedCnpjCpf && (
        <p className="mt-1 text-xs text-amber-600">
          O documento selecionado e diferente do registrado para esta conta. Revise antes de salvar.
        </p>
      )}
    </div>
  );
}
