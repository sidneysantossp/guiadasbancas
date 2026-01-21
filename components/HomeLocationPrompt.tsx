"use client";

import { useEffect, useState } from "react";
import { loadStoredLocation, UserLocation } from "@/lib/location";
import WelcomeCepModal from "./WelcomeCepModal";

export default function HomeLocationPrompt() {
  const [showModal, setShowModal] = useState(false);
  const [autoFilledCep, setAutoFilledCep] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Verificar se usuário já tem localização salva
    const stored = loadStoredLocation();
    if (stored) {
      console.log('[HomeLocationPrompt] Usuário já tem localização salva, não mostrar modal');
      return;
    }

    // Verificar se usuário já dispensou o modal nesta sessão
    const dismissed = sessionStorage.getItem('gdb_cep_prompt_dismissed');
    if (dismissed) {
      console.log('[HomeLocationPrompt] Modal já foi dispensado nesta sessão');
      return;
    }

    // Aguardar um pouco para dar tempo da geolocalização tentar primeiro
    const timer = setTimeout(() => {
      // Verificar novamente se geolocalização não preencheu
      const storedAfterWait = loadStoredLocation();
      if (!storedAfterWait) {
        console.log('[HomeLocationPrompt] Mostrando modal de CEP');
        setShowModal(true);
      } else {
        console.log('[HomeLocationPrompt] Geolocalização preencheu, não mostrar modal');
      }
    }, 2000); // Aguardar 2 segundos

    return () => clearTimeout(timer);
  }, [mounted]);

  // Escutar quando geolocalização preencher a localização
  useEffect(() => {
    if (!mounted) return;

    const handleLocationUpdate = (event: any) => {
      const loc = event.detail as UserLocation;
      console.log('[HomeLocationPrompt] Localização atualizada:', loc);
      
      // Se modal está aberto e geolocalização preencheu, preencher CEP e fechar
      if (showModal && loc.source === 'geolocation' && loc.cep) {
        console.log('[HomeLocationPrompt] Preenchendo CEP automaticamente:', loc.cep);
        setAutoFilledCep(loc.cep);
        // Fechar modal após 1 segundo para usuário ver o preenchimento
        setTimeout(() => {
          setShowModal(false);
        }, 1000);
      }
    };

    window.addEventListener('gdb:location-updated', handleLocationUpdate);
    return () => window.removeEventListener('gdb:location-updated', handleLocationUpdate);
  }, [mounted, showModal]);

  if (!mounted) return null;

  return (
    <WelcomeCepModal
      open={showModal}
      onClose={() => setShowModal(false)}
      onCepConfirmed={() => {
        console.log('[HomeLocationPrompt] CEP confirmado pelo usuário');
        setShowModal(false);
      }}
      autoFilledCep={autoFilledCep}
    />
  );
}
