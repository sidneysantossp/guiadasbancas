"use client";

import { useEffect, useState } from "react";
import { formatCep, isValidCep, resolveCepToLocation, saveStoredLocation, UserLocation, fetchCepBrasilAPI } from "@/lib/location";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: (loc: UserLocation) => void;
  showAsPrompt?: boolean; // Mostrar como prompt inicial (após geolocalização negada)
}

export default function LocationModal({ open, onClose, onSaved, showAsPrompt = false }: Props) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ street?: string; neighborhood?: string; city?: string; state?: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [debounceId, setDebounceId] = useState<any>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setLoading(false);
      setPreview(null);
    }
  }, [open]);

  // Busca preview de endereço quando CEP é válido
  useEffect(() => {
    const f = formatCep(cep);
    if (!isValidCep(f)) {
      setPreview(null);
      if (debounceId) clearTimeout(debounceId);
      return;
    }
    if (debounceId) clearTimeout(debounceId);
    const id = setTimeout(async () => {
      try {
        setPreviewLoading(true);
        const data = await fetchCepBrasilAPI(f);
        setPreview({
          street: data.street || data.address || undefined,
          neighborhood: data.neighborhood || data.district || undefined,
          city: data.city,
          state: data.state,
        });
      } catch (_) {
        setPreview(null);
      } finally {
        setPreviewLoading(false);
      }
    }, 400);
    setDebounceId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = formatCep(cep);
    if (!isValidCep(f)) {
      setError("Informe um CEP válido (ex.: 01001-000)");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const loc = await resolveCepToLocation(f);
      saveStoredLocation(loc);
      onSaved?.(loc);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Não foi possível localizar o CEP");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={showAsPrompt ? undefined : onClose}
      />
      
      {/* Painel lateral direito (offcanvas) */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {showAsPrompt ? "Adicione seu CEP" : "Informe sua localização"}
              </h2>
              {!showAsPrompt && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {showAsPrompt 
                ? "Adicione o seu CEP para encontrar uma banca próxima de você"
                : "Usaremos seu CEP para mostrar bancas e ofertas mais próximas de você."
              }
            </p>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Ícone de localização */}
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21s-8-4.5-8-11a8 8 0 1 1 16 0c0 6.5-8 11-8 11Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  id="cep"
                  className="input text-center text-lg"
                  placeholder="00000-000"
                  value={formatCep(cep)}
                  onChange={(e) => setCep(e.target.value)}
                  inputMode="numeric"
                  maxLength={9}
                  autoFocus
                />
              </div>
              
              {previewLoading && (
                <div className="text-sm text-gray-500 text-center py-2">Buscando endereço...</div>
              )}
              
              {!previewLoading && preview && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="font-semibold text-gray-900 mb-2">Endereço encontrado</div>
                  <div className="text-sm text-gray-700 space-y-1">
                    {preview.street && <div>{preview.street}</div>}
                    {preview.neighborhood && <div>{preview.neighborhood}</div>}
                    <div>{[preview.city, preview.state].filter(Boolean).join("/")}</div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </form>
          </div>

          {/* Footer com botões */}
          <div className="border-t border-gray-200 p-4 space-y-3">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#ff5c00] hover:bg-[#ff7a33] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Buscando..." : "Confirmar CEP"}
            </button>
            
            {showAsPrompt ? (
              <button 
                type="button" 
                onClick={onClose} 
                className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
              >
                Mais tarde
              </button>
            ) : (
              <button 
                type="button" 
                onClick={onClose} 
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
