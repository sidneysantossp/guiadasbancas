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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={showAsPrompt ? undefined : onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Ícone de localização */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-orange-50 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-8-4.5-8-11a8 8 0 1 1 16 0c0 6.5-8 11-8 11Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-lg font-semibold mb-2 text-center">
          {showAsPrompt ? "Adicione seu CEP" : "Informe seu CEP"}
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          {showAsPrompt 
            ? "Adicione o seu CEP para encontrar uma banca próxima de você"
            : "Usaremos seu CEP para mostrar bancas e ofertas mais próximas de você."
          }
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              id="cep"
              className="input text-center text-lg"
              placeholder="Informe seu CEP"
              value={formatCep(cep)}
              onChange={(e) => setCep(e.target.value)}
              inputMode="numeric"
              maxLength={9}
              autoFocus
            />
          </div>
          {previewLoading && (
            <div className="text-sm text-gray-500 text-center">Buscando endereço...</div>
          )}
          {!previewLoading && preview && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
              <div className="font-medium">Endereço do CEP</div>
              <div>{[preview.street, preview.neighborhood].filter(Boolean).join(" - ")}</div>
              <div>{[preview.city, preview.state].filter(Boolean).join("/")}</div>
            </div>
          )}
          {error && <div className="text-sm text-red-600 text-center">{error}</div>}
          <div className="flex flex-col gap-2 pt-2">
            <button type="submit" disabled={loading} className="w-full btn btn-primary py-3">
              {loading ? "Buscando..." : "Confirmar CEP"}
            </button>
            {showAsPrompt ? (
              <button type="button" onClick={onClose} className="w-full text-sm text-gray-500 hover:text-gray-700 py-2">
                Mais tarde
              </button>
            ) : (
              <button type="button" onClick={onClose} className="w-full btn btn-outline">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
