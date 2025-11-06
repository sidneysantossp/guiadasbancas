"use client";

import { useEffect, useState } from "react";
import type { Route } from "next";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function JornaleiroOnboardingPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [status, setStatus] = useState<"loading" | "creating" | "success" | "error">("loading");
  const [message, setMessage] = useState("Configurando sua conta...");

  useEffect(() => {
    let cancelled = false;
    // Poll por até 10s aguardando a sessão ficar disponível
    const maxWaitMs = 10000;
    const stepMs = 1000;
    let waited = 0;

    const tick = () => {
      if (cancelled) return;
      if (user && profile?.role === "jornaleiro") {
        createBanca();
        return;
      }
      if (waited >= maxWaitMs) {
        // Timeout: voltar para login do jornaleiro
        router.push(("/jornaleiro" as Route));
        return;
      }
      // Atualiza mensagem e segue aguardando
      setStatus("loading");
      setMessage(`Aguardando autenticação... (${Math.floor(waited / 1000)}s)`);
      waited += stepMs;
      setTimeout(tick, stepMs);
    };

    if (!loading) tick();
    return () => { cancelled = true; };
  }, [user, profile, loading, router]);

  const createBanca = async () => {
    try {
      setStatus("creating");
      setMessage("Criando sua banca...");
      // Recuperar dados salvos no localStorage
      const bancaDataStr = localStorage.getItem("gb:bancaData");
      if (!bancaDataStr) {
        setStatus("error");
        setMessage("Dados da banca não encontrados. Por favor, faça o cadastro novamente.");
        return;
      }

      const saved = JSON.parse(bancaDataStr);

      // Tentar recuperar os dados completos do wizard para normalizar campos
      let wizard: any = null;
      try {
        const wizStr = localStorage.getItem('gb:sellerWizard');
        wizard = wizStr ? JSON.parse(wizStr) : null;
      } catch {}

      const normalizedAddress = wizard
        ? `${wizard.street || ''}, ${wizard.number || ''}${wizard.neighborhood ? ' - ' + wizard.neighborhood : ''}, ${wizard.city || ''}${wizard.uf ? ' - ' + wizard.uf : ''}`.replace(/\s+,/g, ',').replace(/,\s+,/g, ', ')
        : (saved.address || '');

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
        cep: saved.cep || wizard?.cep || null,
        address: normalizedAddress,
        lat: saved.lat ?? (wizard?.lat2 ? Number(wizard.lat2) : -23.5505),
        lng: saved.lng ?? (wizard?.lng2 ? Number(wizard.lng2) : -46.6333),
        // Se tivermos os hours do wizard, usá-los; caso contrário, painel usa default
        hours: Array.isArray(wizard?.hours) ? wizard.hours : undefined,
        delivery_fee: 0,
        min_order_value: 0,
        delivery_radius: 5,
        preparation_time: 30,
        payment_methods: saved.payment_methods || ['pix', 'dinheiro'],
      } as any;

      // Se já existe uma banca para este usuário, não criar novamente
      const { data: existing, error: existingErr } = await supabase
        .from("bancas")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (existing?.id) {
        // Garante vinculação no perfil
        console.log('[Onboarding] Banca já existe, vinculando ao perfil:', existing.id);
        const { error: linkError } = await supabase
          .from("user_profiles")
          .update({ banca_id: existing.id })
          .eq("id", user!.id);

        if (linkError) {
          console.error('[Onboarding] ERRO ao vincular banca existente:', linkError);
          throw new Error(`Erro ao vincular banca: ${linkError.message}`);
        }

        console.log('[Onboarding] Banca existente vinculada ao perfil!');
        setStatus("success");
        setMessage("Você já possui uma banca cadastrada. Redirecionando...");
        setTimeout(() => {
          router.push(("/jornaleiro/dashboard" as Route));
        }, 1500);
        return;
      }

      // Criar banca no Supabase
      const { data, error } = await supabase
        .from("bancas")
        .insert({
          user_id: user!.id,
          ...bancaData,
          active: false, // Aguardando aprovação
          approved: false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Atualizar perfil com banca_id
      console.log('[Onboarding] Atualizando user_profiles com banca_id:', data.id);
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({ banca_id: data.id })
        .eq("id", user!.id);

      if (profileError) {
        console.error('[Onboarding] ❌ ERRO ao atualizar user_profiles:', profileError);
        throw new Error(`Erro ao vincular banca ao perfil: ${profileError.message}`);
      }
      
      console.log('[Onboarding] ✅ Banca criada e vinculada ao perfil com sucesso!');

      // Limpar localStorage
      localStorage.removeItem("gb:bancaData");

      setStatus("success");
      setMessage("Banca criada com sucesso! Redirecionando para a Academy...");

      // Redirecionar para academy (vídeo de boas-vindas)
      setTimeout(() => {
        router.push(("/jornaleiro/academy" as Route));
      }, 2000);

    } catch (error) {
      console.error("Erro ao criar banca:", error);
      setStatus("error");
      setMessage("Erro ao criar banca. Tente novamente mais tarde.");
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
