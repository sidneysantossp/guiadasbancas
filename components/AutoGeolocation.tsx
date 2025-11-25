"use client";

import { useEffect, useState } from "react";
import { loadStoredLocation, saveCoordsAsLocation, UserLocation } from "@/lib/location";

interface AutoGeolocationProps {
  onLocationUpdate?: (location: UserLocation | null) => void;
  onGeoDenied?: () => void; // Callback quando geolocalização é negada
}

export default function AutoGeolocation({ onLocationUpdate, onGeoDenied }: AutoGeolocationProps) {
  const [hasRequested, setHasRequested] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Verificar se já temos localização armazenada
    const stored = loadStoredLocation();
    let needUpgrade = false;
    if (stored) {
      onLocationUpdate?.(stored);
      // Se a localização armazenada não for precisa (ex.: via CEP/IP), tentar melhorar
      const isPrecise = (stored as any)?.accuracy === 'precise' || (stored as any)?.source === 'geolocation';
      needUpgrade = !isPrecise;
      if (!needUpgrade) return; // já é precisa, não precisa pedir de novo
    }

    // Verificar se já solicitamos permissão nesta sessão
    const sessionRequested = sessionStorage.getItem('gb:geoRequested');
    if (sessionRequested && !needUpgrade) {
      // Se já foi solicitado e negado, e não tem localização, mostrar popup de CEP
      const permanentDenied = localStorage.getItem('gb:geoDenied');
      if (permanentDenied && !stored) {
        onGeoDenied?.();
      }
      return;
    }

    // Verificar se o usuário já negou permanentemente
    const permanentDenied = localStorage.getItem('gb:geoDenied');
    if (permanentDenied) {
      // Se negou e não tem localização salva, mostrar popup de CEP
      if (!stored) {
        onGeoDenied?.();
      }
      return;
    }

    // Solicitar geolocalização automaticamente
    if (navigator.geolocation && !hasRequested && !isRequesting) {
      setHasRequested(true);
      setIsRequesting(true);
      sessionStorage.setItem('gb:geoRequested', 'true');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const location = await saveCoordsAsLocation(latitude, longitude);
            onLocationUpdate?.(location);
            
            // Disparar evento customizado para outros componentes
            window.dispatchEvent(new CustomEvent('locationUpdate', { 
              detail: location 
            }));
          } catch (error) {
            console.error('Erro ao salvar localização:', error);
            // Se falhou ao salvar, mostrar popup de CEP
            onGeoDenied?.();
          } finally {
            setIsRequesting(false);
          }
        },
        (error) => {
          console.log('Geolocalização negada ou erro:', error.message);
          
          // Se o usuário negou permanentemente, salvar no localStorage
          if (error.code === error.PERMISSION_DENIED) {
            localStorage.setItem('gb:geoDenied', 'true');
          }
          
          setIsRequesting(false);
          onLocationUpdate?.(null);
          
          // Mostrar popup de CEP quando geolocalização é negada
          onGeoDenied?.();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    }
  }, [hasRequested, isRequesting]); // Removido onLocationUpdate da dependência

  // Este componente não renderiza nada visível
  return null;
}
