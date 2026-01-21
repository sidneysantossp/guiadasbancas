"use client";

import { useEffect, useState } from "react";
import { formatCep, isValidCep, resolveCepToLocation, saveStoredLocation, fetchCepBrasilAPI } from "@/lib/location";

interface WelcomeCepModalProps {
  open: boolean;
  onClose: () => void;
  onCepConfirmed?: () => void;
  autoFilledCep?: string; // CEP preenchido automaticamente pela geolocalização
}

export default function WelcomeCepModal({ open, onClose, onCepConfirmed, autoFilledCep }: WelcomeCepModalProps) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ street?: string; neighborhood?: string; city?: string; state?: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [debounceId, setDebounceId] = useState<any>(null);

  // Preencher automaticamente se geolocalização forneceu CEP
  useEffect(() => {
    if (autoFilledCep && open) {
      setCep(autoFilledCep);
    }
  }, [autoFilledCep, open]);

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
      onCepConfirmed?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Não foi possível localizar o CEP");
    } finally {
      setLoading(false);
    }
  };

  const handleLater = () => {
    // Marcar que usuário escolheu "Mais tarde"
    sessionStorage.setItem('gdb_cep_prompt_dismissed', 'true');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleLater} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header com ícone de localização */}
        <div className="flex items-center gap-4 border-b border-gray-200 p-6 pb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-8-4.5-8-11a8 8 0 1 1 16 0c0 6.5-8 11-8 11Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Compre ou encontre uma Banca perto de você!
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Digite seu CEP abaixo
            </p>
          </div>
        </div>
        
        {/* Corpo do modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="welcome-cep" className="block text-sm font-medium text-gray-700 mb-2">
              CEP
            </label>
            <input
              id="welcome-cep"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-[#ff5c00] focus:outline-none focus:ring-2 focus:ring-[#ff5c00]/20"
              placeholder="00000-000"
              value={formatCep(cep)}
              onChange={(e) => setCep(e.target.value)}
              inputMode="numeric"
              maxLength={9}
              autoFocus
            />
          </div>

          {previewLoading && (
            <div className="text-sm text-gray-500">Buscando endereço...</div>
          )}
          
          {!previewLoading && preview && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="font-medium text-gray-900">📍 Endereço encontrado</div>
              <div className="mt-1 text-gray-700">
                {[preview.street, preview.neighborhood].filter(Boolean).join(" - ")}
              </div>
              <div className="text-gray-600">
                {[preview.city, preview.state].filter(Boolean).join("/")}
              </div>
            </div>
          )}
          
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleLater}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Mais tarde
            </button>
            <button
              type="submit"
              disabled={loading || !isValidCep(formatCep(cep))}
              className="flex-1 rounded-lg bg-[#ff5c00] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#ff6a1a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Buscando..." : "Incluir CEP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
