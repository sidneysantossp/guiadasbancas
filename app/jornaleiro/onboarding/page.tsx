"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { geocodeByAddressNominatim, resolveCepToLocation, isValidCep } from "@/lib/location";
import logger from "@/lib/logger";

export default function JornaleiroOnboardingPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [status, setStatus] = useState<"loading" | "creating" | "success" | "error">("loading");
  const [message, setMessage] = useState("Configurando sua conta...");

  useEffect(() => {
    let cancelled = false;

    const checkAndProceed = async () => {
      if (cancelled) return;
      if (loading) return;

      // Se o usuário já é jornaleiro, verificar se já tem banca na tabela bancas
      // (não confiar apenas no profile.banca_id que pode estar desatualizado)
      if (user && profile?.role === "jornaleiro") {
        try {
          const { data: existingBanca } = await supabase
            .from('bancas')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (existingBanca) {
            logger.log('[Onboarding] ✅ Banca já existe, redirecionando para dashboard');
            setStatus("success");
            setMessage("Você já possui uma banca cadastrada. Redirecionando...");
            setTimeout(() => {
              if (!cancelled) {
                router.push("/jornaleiro/dashboard" as Route);
              }
            }, 1000);
            return;
          }

          // Se não tem banca, segue para criação
          logger.log('[Onboarding] 📝 Banca não encontrada, iniciando criação');
          if (!cancelled) {
            createBanca();
          }
          return;
        } catch (error) {
          logger.error('[Onboarding] Erro ao verificar banca:', error);
          // Em caso de erro, tenta criar mesmo assim
          if (!cancelled) {
            createBanca();
          }
          return;
        }
      }

      // Se não é jornaleiro ainda, aguarda ou timeout
      if (!user || !profile) {
        setStatus("loading");
        setMessage("Aguardando autenticação...");
        // Timeout de 5s (reduzido de 10s para melhor UX)
        setTimeout(() => {
          if (!cancelled && (!user || !profile)) {
            logger.warn('[Onboarding] Timeout de autenticação, redirecionando para login');
            router.push("/jornaleiro" as Route);
          }
        }, 5000);
      }
    };

    checkAndProceed();
    return () => { cancelled = true; };
  }, [user, profile, loading, router]);

  const createBanca = async () => {
    try {
      setStatus("creating");
      setMessage("Criando sua banca...");
      // Recuperar dados salvos no localStorage
      const bancaDataStr = localStorage.getItem("gb:bancaData");
      
      // Se não tem dados no localStorage, redirecionar para o cadastro
      let saved: any = null;
      if (!bancaDataStr) {
        logger.warn('[Onboarding] ❌ Dados não encontrados no localStorage!');
        logger.log('[Onboarding] 🔄 Redirecionando para página de cadastro...');
        setStatus("error");
        setMessage("Dados de cadastro não encontrados. Redirecionando...");
        setTimeout(() => {
          router.push("/jornaleiro/registrar" as Route);
        }, 2000);
        return;
      } else {
        saved = JSON.parse(bancaDataStr);
        logger.log('[Onboarding] 📦 Dados recuperados do localStorage');
        logger.log('[Onboarding] 🏢 is_cotista:', saved.is_cotista);
      }

      // Tentar recuperar os dados completos do wizard para normalizar campos
      let wizard: any = null;
      try {
        const wizStr = localStorage.getItem('gb:sellerWizard');
        wizard = wizStr ? JSON.parse(wizStr) : null;
      } catch {}

      const normalizedAddress = wizard
        ? `${wizard.street || ''}, ${wizard.number || ''}${wizard.neighborhood ? ' - ' + wizard.neighborhood : ''}, ${wizard.city || ''}${wizard.uf ? ' - ' + wizard.uf : ''}`.replace(/\s+,/g, ',').replace(/,\s+,/g, ', ')
        : (saved.address || '');

      // Horários padrão se não tiver
      const defaultHours = {
        seg: '08:00-18:00',
        ter: '08:00-18:00',
        qua: '08:00-18:00',
        qui: '08:00-18:00',
        sex: '08:00-18:00',
        sab: '08:00-14:00',
      };

      // Construir addressObj estruturado para facilitar edição posterior
      const addressObj = {
        cep: saved.cep || wizard?.cep || '00000-000',
        street: wizard?.street || saved.street || '',
        number: wizard?.number || saved.number || '',
        complement: wizard?.complement || saved.complement || '',
        neighborhood: wizard?.neighborhood || saved.neighborhood || '',
        city: wizard?.city || saved.city || '',
        uf: wizard?.uf || saved.uf || '',
      };

      // Geocodificar endereço para obter coordenadas reais
      let finalLat = saved.lat ?? (wizard?.lat2 ? Number(wizard.lat2) : null);
      let finalLng = saved.lng ?? (wizard?.lng2 ? Number(wizard.lng2) : null);
      
      // Se não temos coordenadas válidas, tentar geocodificar
      if (!finalLat || !finalLng || (finalLat === -23.5505 && finalLng === -46.6333)) {
        logger.log('[Onboarding] 📍 Geocodificando endereço...');
        try {
          // Primeiro tentar pelo CEP
          const cepToUse = addressObj.cep || saved.cep || wizard?.cep;
          if (cepToUse && isValidCep(cepToUse)) {
            const locFromCep = await resolveCepToLocation(cepToUse);
            if (locFromCep.lat && locFromCep.lng) {
              finalLat = locFromCep.lat;
              finalLng = locFromCep.lng;
              logger.log('[Onboarding] ✅ Coordenadas obtidas via CEP:', finalLat, finalLng);
            }
          }
          
          // Se ainda não temos coordenadas, tentar pelo endereço completo
          if (!finalLat || !finalLng) {
            const addressToGeocode = `${normalizedAddress}, Brasil`;
            const coords = await geocodeByAddressNominatim(addressToGeocode);
            if (coords) {
              finalLat = coords.lat;
              finalLng = coords.lng;
              logger.log('[Onboarding] ✅ Coordenadas obtidas via endereço:', finalLat, finalLng);
            }
          }
        } catch (geoError) {
          logger.warn('[Onboarding] ⚠️ Erro ao geocodificar:', geoError);
        }
      }
      
      // Fallback para coordenadas de São Paulo se tudo falhar
      if (!finalLat || !finalLng) {
        logger.warn('[Onboarding] ⚠️ Usando coordenadas padrão de São Paulo');
        finalLat = -23.5505;
        finalLng = -46.6333;
      }

      const bancaData = {
        name: saved.name,
        description: saved.description || '',
        profile_image: saved.logo_url || saved.profile_image || wizard?.bankProfilePreview || wizard?.bankProfileUrl || null,
        cover_image: saved.cover_image || wizard?.bankCoverPreview || wizard?.bankCoverUrl || null,
        phone: saved.phone || wizard?.phone || null,
        whatsapp: saved.whatsapp || wizard?.servicePhone || null,
        email: saved.email || null,
        instagram: saved.instagram || (wizard?.instagramHas === 'yes' ? (wizard?.instagramUrl || '').replace(/^@/, '') : null),
        facebook: saved.facebook || (wizard?.facebookHas === 'yes' ? (wizard?.facebookUrl || '').replace(/^@/, '') : null),
        cep: addressObj.cep, // CEP obrigatório
        address: normalizedAddress || 'Endereço a configurar',
        // Salvar também o objeto estruturado (temporariamente desabilitado até migração)
        // ...(addressObj.street ? { addressObj: addressObj } : {}),
        lat: finalLat,
        lng: finalLng,
        tpu_url: saved.tpu_url || wizard?.bankTpuUrl || null,
        opening_hours: saved.opening_hours || defaultHours,
        delivery_fee: saved.delivery_fee ?? 0,
        min_order_value: saved.min_order_value ?? 0,
        delivery_radius: saved.delivery_radius ?? 5,
        preparation_time: saved.preparation_time ?? 30,
        payment_methods: saved.payment_methods || ['pix', 'dinheiro'],
        // Dados do cotista (prioritize saved que vem do wizard completo)
        is_cotista: saved.is_cotista ?? false,
        cotista_id: saved.cotista_id ?? null,
        cotista_codigo: saved.cotista_codigo ?? null,
        cotista_razao_social: saved.cotista_razao_social ?? null,
        cotista_cnpj_cpf: saved.cotista_cnpj_cpf ?? null,
      } as any;
      
      logger.log('[Onboarding] 🏢 Preparando dados da banca - is_cotista:', bancaData.is_cotista);

      // Se já existe uma banca para este usuário, não criar novamente
      const { data: existing, error: existingErr } = await supabase
        .from("bancas")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing?.id) {
        // Garante vinculação no perfil
        logger.log('[Onboarding] Banca já existe, vinculando ao perfil:', existing.id);
        const { error: linkError } = await supabase
          .from("user_profiles")
          .update({ banca_id: existing.id })
          .eq("id", user!.id);

        if (linkError) {
          logger.error('[Onboarding] ERRO ao vincular banca existente:', linkError);
          throw new Error(`Erro ao vincular banca: ${linkError.message}`);
        }

        logger.log('[Onboarding] Banca existente vinculada ao perfil!');
        setStatus("success");
        setMessage("Você já possui uma banca cadastrada. Redirecionando...");
        setTimeout(() => {
          router.push(("/jornaleiro/dashboard" as Route));
        }, 1500);
        return;
      }

      // Preparar dados de perfil para salvar junto
      const profileUpdates: any = {};
      const phoneToSave = saved.phone || wizard?.phone || wizard?.servicePhone;
      const cpfToSave = saved.cpf || wizard?.cpf;
      
      if (phoneToSave) {
        profileUpdates.phone = phoneToSave;
      }
      if (cpfToSave) {
        profileUpdates.cpf = cpfToSave;
      }

      logger.log('[Onboarding] 🔗 Chamando API para criar banca...');
      const response = await fetch("/api/jornaleiro/banca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banca: bancaData,
          profile: profileUpdates,
        }),
      });

      const responseText = await response.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        logger.error('[Onboarding] ❌ Resposta inválida da API');
        throw new Error('Resposta inválida da API de criação da banca');
      }

      if (!response.ok || !parsed?.success) {
        const apiError = parsed?.error || `HTTP ${response.status}`;
        logger.error('[Onboarding] ❌ Erro ao criar banca via API:', apiError);
        throw new Error(apiError);
      }

      const data = parsed.data;
      logger.log('[Onboarding] ✅ Banca criada com sucesso!');

      // Salvar banca no cache imediatamente
      sessionStorage.setItem(`gb:banca:${user!.id}`, JSON.stringify(data));

      // Limpar localStorage do wizard
      localStorage.removeItem("gb:bancaData");
      localStorage.removeItem("gb:sellerWizard");

      setStatus("success");
      setMessage("Banca criada com sucesso! Redirecionando...");
      
      logger.log('[Onboarding] 🎉 Sucesso! Redirecionando para dashboard...');

      // Redirecionar para dashboard (com hard reload para garantir que o layout detecte a banca)
      setTimeout(() => {
        logger.log('[Onboarding] 🔄 Executando redirecionamento agora...');
        window.location.href = '/jornaleiro/dashboard';
      }, 1500);

    } catch (error: any) {
      logger.error("Erro ao criar banca:", error);
      setStatus("error");
      const errorMsg = error?.message || error?.toString() || "Erro desconhecido";
      setMessage(`Erro ao criar banca: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Ícone de Status */}
        <div className="mb-6">
          {status === "loading" || status === "creating" ? (
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
          ) : status === "success" ? (
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Mensagem */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === "success" ? "Tudo pronto!" : status === "error" ? "Ops!" : "Aguarde..."}
        </h2>
        <p className="text-gray-600">{message}</p>

        {/* Botão de Retry */}
        {status === "error" && (
          <div className="mt-6 space-y-3">
            <button
              onClick={createBanca}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.push(("/jornaleiro/registrar" as Route))}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-all"
            >
              Voltar ao Cadastro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
