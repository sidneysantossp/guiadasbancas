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

      // Se o usuário já é jornaleiro E já tem banca vinculada ao perfil,
      // não deve passar pelo fluxo de onboarding novamente.
      // Redireciona direto para o dashboard.
      if (user && profile?.role === "jornaleiro" && (profile as any)?.banca_id) {
        setStatus("success");
        setMessage("Você já possui uma banca cadastrada. Redirecionando...");
        setTimeout(() => {
          router.push("/jornaleiro/dashboard" as Route);
        }, 1000);
        return;
      }

      // Se é jornaleiro mas ainda não tem banca, segue para criação
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
      
      // Se não tem dados no localStorage, redirecionar para o cadastro
      let saved: any = null;
      if (!bancaDataStr) {
        console.log('[Onboarding] ❌ Dados não encontrados no localStorage!');
        console.log('[Onboarding] 🔄 Redirecionando para página de cadastro...');
        setStatus("error");
        setMessage("Dados de cadastro não encontrados. Redirecionando...");
        setTimeout(() => {
          router.push("/jornaleiro/registrar" as Route);
        }, 2000);
        return;
      } else {
        saved = JSON.parse(bancaDataStr);
        console.log('[Onboarding] 📦 Dados recuperados do localStorage:', saved);
        console.log('[Onboarding] 🏢 is_cotista do localStorage:', saved.is_cotista);
        console.log('[Onboarding] 🏢 cotista_id do localStorage:', saved.cotista_id);
        console.log('[Onboarding] 👥 cotista_razao_social do localStorage:', saved.cotista_razao_social);
        console.log('[Onboarding] 📋 CNPJ/CPF do localStorage:', saved.cotista_cnpj_cpf);
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
        lat: saved.lat ?? (wizard?.lat2 ? Number(wizard.lat2) : -23.5505),
        lng: saved.lng ?? (wizard?.lng2 ? Number(wizard.lng2) : -46.6333),
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
      
      console.log('[Onboarding] 🏢 ANTES DE SALVAR - is_cotista:', bancaData.is_cotista);
      console.log('[Onboarding] 🏢 ANTES DE SALVAR - cotista_id:', bancaData.cotista_id);
      console.log('[Onboarding] 👥 ANTES DE SALVAR - cotista_razao_social:', bancaData.cotista_razao_social);
      console.log('[Onboarding] 📋 ANTES DE SALVAR - cotista_cnpj_cpf:', bancaData.cotista_cnpj_cpf);

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
      console.log('[Onboarding] 👤 user.id:', user!.id);
      console.log('[Onboarding] 📧 user.email:', (user as any)?.email);
      console.log('[Onboarding] 🔑 Verificando se usuário existe no banco...');
      
      // Verificar se o usuário existe no banco antes de criar a banca
      const { data: userCheck, error: userCheckError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user!.id)
        .single();
      
      if (userCheckError || !userCheck) {
        console.error('[Onboarding] ❌ Usuário não encontrado no banco:', userCheckError);
        throw new Error('Usuário não encontrado. Por favor, faça login novamente.');
      }
      
      console.log('[Onboarding] ✅ Usuário encontrado no banco!');
      
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
        console.error('[Onboarding] ❌ Erro ao criar banca:', error);
        throw new Error(`Erro ao criar banca: ${error.message || JSON.stringify(error)}`);
      }
      
      console.log('[Onboarding] ✅ Banca criada com sucesso!');
      console.log('[Onboarding] 🏢 is_cotista salvo:', data.is_cotista);
      console.log('[Onboarding] 👥 cotista_razao_social salvo:', data.cotista_razao_social);

      // Atualizar perfil com banca_id E dados do cadastro (phone, cpf)
      console.log('[Onboarding] Atualizando user_profiles com banca_id:', data.id);
      
      // Tentar recuperar dados do perfil do wizard
      const profileUpdates: any = { banca_id: data.id };
      
      // Extrair telefone e CPF do wizard ou saved (bancaData)
      const phoneToSave = saved.phone || wizard?.phone || wizard?.servicePhone;
      const cpfToSave = saved.cpf || wizard?.cpf;
      
      if (phoneToSave) {
        profileUpdates.phone = phoneToSave;
        console.log('[Onboarding] 📞 Salvando telefone no perfil:', phoneToSave);
      }
      if (cpfToSave) {
        profileUpdates.cpf = cpfToSave;
        console.log('[Onboarding] 🆔 Salvando CPF no perfil:', cpfToSave);
      }
      
      console.log('[Onboarding] 📋 Dados para atualizar perfil:', profileUpdates);
      
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update(profileUpdates)
        .eq("id", user!.id);

      if (profileError) {
        console.error('[Onboarding] ❌ ERRO ao atualizar user_profiles:', profileError);
        throw new Error(`Erro ao vincular banca ao perfil: ${profileError.message}`);
      }
      
      console.log('[Onboarding] ✅ Banca criada e vinculada ao perfil com sucesso!');

      // Salvar banca no cache imediatamente
      sessionStorage.setItem(`gb:banca:${user!.id}`, JSON.stringify(data));
      console.log('[Onboarding] 📦 Banca salva no cache');

      // Limpar localStorage do wizard
      localStorage.removeItem("gb:bancaData");
      localStorage.removeItem("gb:sellerWizard");

      setStatus("success");
      setMessage("Banca criada com sucesso! Redirecionando...");
      
      console.log('[Onboarding] 🎉 Sucesso! Redirecionando para dashboard em 1.5s...');
      console.log('[Onboarding] 📊 Banca criada com ID:', data.id);
      console.log('[Onboarding] 🏢 is_cotista final:', data.is_cotista);

      // Redirecionar para dashboard (com hard reload para garantir que o layout detecte a banca)
      setTimeout(() => {
        console.log('[Onboarding] 🔄 Executando redirecionamento agora...');
        window.location.href = '/jornaleiro/dashboard';
      }, 1500);

    } catch (error: any) {
      console.error("Erro ao criar banca:", error);
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
