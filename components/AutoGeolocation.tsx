"use client";

import { useEffect, useState } from "react";
import { loadStoredLocation, saveCoordsAsLocation, UserLocation } from "@/lib/location";

interface AutoGeolocationProps {
  onLocationUpdate?: (location: UserLocation | null) => void;
}

export default function AutoGeolocation({ onLocationUpdate }: AutoGeolocationProps) {
  const [hasRequested, setHasRequested] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Verificar se já temos localização armazenada
    const stored = loadStoredLocation();
    if (stored) {
      onLocationUpdate?.(stored);
      return;
    }

    // Verificar se já solicitamos permissão nesta sessão
    const sessionRequested = sessionStorage.getItem('gb:geoRequested');
    if (sessionRequested) {
      return;
    }

    // Verificar se o usuário já negou permanentemente
    const permanentDenied = localStorage.getItem('gb:geoDenied');
    if (permanentDenied) {
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
