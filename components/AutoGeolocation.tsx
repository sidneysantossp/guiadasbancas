"use client";

import { useEffect } from "react";
import { loadStoredLocation, saveCoordsAsLocation, UserLocation } from "@/lib/location";

interface AutoGeolocationProps {
  onLocationUpdate?: (location: UserLocation | null) => void;
  onGeoDenied?: () => void; // Callback quando geolocalização é negada
}

export default function AutoGeolocation({ onLocationUpdate, onGeoDenied }: AutoGeolocationProps) {
  const REQUESTED_KEY = "gb:geoRequested";
  const DENIED_KEY = "gb:geoDenied";
  const IN_PROGRESS_KEY = "gb:geoInProgress";

  async function getGeolocationPermissionState(): Promise<PermissionState | "unsupported"> {
    if (typeof navigator === "undefined") return "unsupported";
    if (!("permissions" in navigator) || typeof navigator.permissions?.query !== "function") {
      return "unsupported";
    }
    try {
      const status = await navigator.permissions.query({ name: "geolocation" });
      return status.state;
    } catch {
      return "unsupported";
    }
  }

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const stored = loadStoredLocation();
      if (stored) {
        onLocationUpdate?.(stored);
        return;
      }

      if (typeof navigator === "undefined" || !navigator.geolocation) {
        onGeoDenied?.();
        return;
      }

      const permissionState = await getGeolocationPermissionState();
      if (cancelled) return;

      const hasRequestedThisSession = sessionStorage.getItem(REQUESTED_KEY) === "true";
      const hasDeniedFlag = localStorage.getItem(DENIED_KEY) === "true";

      if (permissionState === "granted") {
        // Corrige estado antigo: se o usuário liberou no navegador, removemos bloqueios locais.
        localStorage.removeItem(DENIED_KEY);
        sessionStorage.removeItem(REQUESTED_KEY);
      } else if (permissionState === "denied") {
        localStorage.setItem(DENIED_KEY, "true");
        sessionStorage.removeItem(IN_PROGRESS_KEY);
        onGeoDenied?.();
        return;
      } else if (hasDeniedFlag) {
        // Flag local estava travando mesmo após mudar permissão para "prompt".
        localStorage.removeItem(DENIED_KEY);
      }

      const shouldRequest =
        permissionState === "granted" || !hasRequestedThisSession;

      if (!shouldRequest) {
        return;
      }

      sessionStorage.setItem(REQUESTED_KEY, "true");
      sessionStorage.setItem(IN_PROGRESS_KEY, "true");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const location = await saveCoordsAsLocation(latitude, longitude);
            if (!cancelled) {
              onLocationUpdate?.(location);
            }
            localStorage.removeItem(DENIED_KEY);
          } catch (error) {
            console.error("Erro ao salvar localização:", error);
            if (!cancelled) {
              onGeoDenied?.();
            }
          } finally {
            sessionStorage.removeItem(IN_PROGRESS_KEY);
          }
        },
        (error) => {
          console.log("Geolocalização negada ou erro:", error.message);
          sessionStorage.removeItem(IN_PROGRESS_KEY);

          if (error.code === error.PERMISSION_DENIED) {
            localStorage.setItem(DENIED_KEY, "true");
          } else {
            // Timeout/indisponível: permite nova tentativa sem precisar recarregar.
            sessionStorage.removeItem(REQUESTED_KEY);
          }

          if (cancelled) return;

          const existingLoc = loadStoredLocation();
          if (!existingLoc) {
            onLocationUpdate?.(null);
            onGeoDenied?.();
          }
        },
        {
          enableHighAccuracy: permissionState === "granted",
          timeout: permissionState === "granted" ? 12000 : 8000,
          maximumAge: 300000,
        }
      );
    };

    run();

    return () => {
      cancelled = true;
      sessionStorage.removeItem(IN_PROGRESS_KEY);
    };
  }, []);

  // Este componente não renderiza nada visível
  return null;
}
