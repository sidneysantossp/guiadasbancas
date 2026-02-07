"use client";

import { useEffect, useState } from "react";
import { loadStoredLocation } from "@/lib/location";

interface LocationPromptBannerProps {
  onConfirmClick: () => void;
  onDismiss: () => void;
}

export default function LocationPromptBanner({ onConfirmClick, onDismiss }: LocationPromptBannerProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Verificar se usuário já tem localização salva
    const stored = loadStoredLocation();
    if (stored) {
      return;
    }

    // Verificar se usuário já dispensou o banner nesta sessão
    const dismissed = sessionStorage.getItem('gdb_location_banner_dismissed');
    if (dismissed) {
      return;
    }

    // Aguardar tempo suficiente para a geolocalização do navegador completar
    const timer = setTimeout(() => {
      const storedAfterWait = loadStoredLocation();
      if (!storedAfterWait) {
        setShow(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Escutar quando localização for atualizada para ocultar banner
  useEffect(() => {
    const handleLocationUpdate = () => {
      setShow(false);
    };

    window.addEventListener('gdb:location-updated', handleLocationUpdate);
    window.addEventListener('locationUpdate', handleLocationUpdate);
    return () => {
      window.removeEventListener('gdb:location-updated', handleLocationUpdate);
      window.removeEventListener('locationUpdate', handleLocationUpdate);
    };
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem('gdb_location_banner_dismissed', 'true');
    setShow(false);
    onDismiss();
  };

  if (!show) return null;

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-[360px]">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff5c00]" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 21s-8-4.5-8-11a8 8 0 1 1 16 0c0 6.5-8 11-8 11Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Encontre uma Banca próxima de você!
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              Por favor, confirme o seu CEP para buscarmos uma Banca mais próxima de você.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onConfirmClick}
                className="px-4 py-1.5 bg-[#3483fa] hover:bg-[#2968c8] text-white text-xs font-semibold rounded transition-colors"
              >
                Informar CEP
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-1.5 text-[#3483fa] hover:bg-blue-50 text-xs font-semibold rounded transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
