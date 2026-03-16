"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ToastProvider from "@/components/admin/ToastProvider";
import NotificationCenter from "@/components/admin/NotificationCenter";
import DashboardOfficialLogo from "@/components/dashboard/DashboardOfficialLogo";
import { useAuth } from "@/lib/auth/AuthContext";
import { QueryProvider } from "@/app/providers/QueryProvider";
import {
  JOURNALEIRO_MOBILE_QUICK_LINKS,
  buildJornaleiroMenuSections,
  type JornaleiroMenuItem,
} from "@/lib/jornaleiro-navigation";
import { buildBancaHref } from "@/lib/slug";
import {
  IconLayoutDashboard,
  IconBuilding,
  IconClipboardList,
  IconPackage,
  IconFolderOpen,
  IconMessageDots,
  IconUsers,
  IconTicket,
  IconChartBar,
  IconSchool,
  IconSettings,
  IconBell,
  IconCreditCard,
} from "@tabler/icons-react";

const journaleiroIconComponents = {
  dashboard: IconLayoutDashboard,
  intelligence: IconChartBar,
  banca: IconBuilding,
  orders: IconClipboardList,
  products: IconPackage,
  catalog: IconFolderOpen,
  campaigns: IconMessageDots,
  distributors: IconUsers,
  users: IconUsers,
  coupons: IconTicket,
  reports: IconChartBar,
  notifications: IconBell,
  academy: IconSchool,
  settings: IconSettings,
  plan: IconCreditCard,
} as const;

export default function JornaleiroLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [banca, setBanca] = useState<any>(null);
  const [bancaValidated, setBancaValidated] = useState(false);
  const [mounted, setMounted] = useState(false);
  // 🚨 DESABILITADO: Cache causa problemas com permissões não atualizando em tempo real
  // Agora sempre buscamos dados frescos do Supabase
  const useBancaCache = false;
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [isOwner, setIsOwner] = useState<boolean | null>(null); // null = carregando
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [plansMenuEnabled, setPlansMenuEnabled] = useState(true);

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const isAuthRoute = pathname === "/jornaleiro" || pathname?.startsWith("/jornaleiro/registrar") || pathname?.startsWith("/jornaleiro/onboarding") || pathname?.startsWith("/jornaleiro/esqueci-senha") || pathname?.startsWith("/jornaleiro/nova-senha") || pathname?.startsWith("/jornaleiro/reset-local");
  
  // SEGURANÇA CRÍTICA: Usuário sem banca NÃO pode acessar nenhuma rota do painel
  // Apenas rotas de autenticação são permitidas
  const allowedWithoutBanca = false; // SEMPRE false para segurança

  const logout = async () => {
    console.log('[Logout] 🚪 Iniciando logout e limpeza completa...');
    if (user?.id) {
      console.log('[Logout] Removendo cache da banca:', user.id);
      sessionStorage.removeItem(`gb:banca:${user.id}`);
    }
    // 🚨 SEGURANÇA: Limpar TODO o sessionStorage no logout para prevenir vazamento
    console.log('[Logout] Limpando TODO o sessionStorage...');
    sessionStorage.clear();
    localStorage.clear();
    console.log('[Logout] Logout completo, redirecionando...');
    await signOut();
  };

  const sellerName = profile?.full_name || "Vendedor";
  const sellerEmail = (user as any)?.email || "vendedor@example.com";

  // Mounted state para evitar hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Carregar configuração do menu de planos
  useEffect(() => {
    const loadPlansMenuSetting = async () => {
      try {
        const res = await fetch("/api/settings/plans-menu");
        const data = await res.json();
        if (data.success) {
          setPlansMenuEnabled(data.enabled);
        }
      } catch (error) {
        console.error("Erro ao carregar config de planos:", error);
      }
    };
    loadPlansMenuSetting();
  }, []);

  // Buscar permissões do usuário - IMPORTANTE: só busca quando banca está disponível
  useEffect(() => {
    const loadPermissions = async () => {
      if (!user?.id || isAuthRoute) return;
      
      // IMPORTANTE: Só busca permissões quando a banca já foi carregada
      // Isso garante que o banca_id correto seja enviado para a API
      if (!banca?.id) {
        console.log("[Permissions] Aguardando banca ser carregada...");
        return;
      }
      
      try {
        console.log("[Permissions] ========== CARREGANDO PERMISSÕES ==========");
        console.log("[Permissions] banca.id:", banca.id);
        console.log("[Permissions] banca.name:", banca.name);
        console.log("[Permissions] banca.user_id:", banca.user_id);
        console.log("[Permissions] user.id (logado):", user?.id);
        
        const res = await fetch("/api/jornaleiro/my-permissions", { 
          credentials: "include",
          cache: "no-store",
          headers: {
            "x-banca-id": banca.id,
          },
        });
        const json = await res.json();
        
        console.log("[Permissions] Resposta da API:", JSON.stringify(json));
        
        if (json?.success) {
          const ownerOrAdmin = json.isOwner === true || json.accessLevel === "admin";
          console.log("[Permissions] ========== RESULTADO ==========");
          console.log("[Permissions] json.isOwner:", json.isOwner);
          console.log("[Permissions] json.accessLevel:", json.accessLevel);
          console.log("[Permissions] json.permissions:", json.permissions);
          console.log("[Permissions] ownerOrAdmin calculado:", ownerOrAdmin);
          
          setIsOwner(ownerOrAdmin);
          setUserPermissions(json.permissions || []);
          setPermissionsLoaded(true);
          console.log("[Permissions] Estados atualizados: isOwner=", ownerOrAdmin, "permissions=", json.permissions?.length || 0, "itens");
        }
      } catch (e) {
        console.error("[Permissions] Erro ao carregar:", e);
      }
    };

    loadPermissions();
    
    // Recarregar permissões quando a janela receber foco (colaborador pode ter tido permissões alteradas)
    const handleFocus = () => {
      console.log("[Permissions] Janela recebeu foco, recarregando permissões...");
      loadPermissions();
    };
    
    // Listener para evento de atualização de permissões (disparado pelo dono ao editar colaborador)
    const handlePermissionsUpdate = () => {
      console.log("[Permissions] Evento de atualização recebido, recarregando...");
      loadPermissions();
    };
    
    // Listener para storage event (sincronização entre abas)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'gb:permissions:updated') {
        console.log("[Permissions] Storage event recebido, recarregando...");
        loadPermissions();
      }
    };
    
    window.addEventListener("focus", handleFocus);
    window.addEventListener("permissions:updated", handlePermissionsUpdate);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("permissions:updated", handlePermissionsUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user?.id, isAuthRoute, banca?.id]);

  const hasCatalogAccess = Boolean(
    banca?.entitlements?.can_access_distributor_catalog ?? banca?.is_cotista
  );
  const hasPartnerDirectoryAccess = Boolean(
    banca?.entitlements?.can_access_partner_directory ?? banca?.is_cotista
  );

  const menuSections = useMemo(() => {
    console.log("[JornaleiroMenu] Calculando secoes da navegacao...");
    console.log("[JornaleiroMenu] permissionsLoaded:", permissionsLoaded);
    console.log("[JornaleiroMenu] isOwner:", isOwner);
    console.log("[JornaleiroMenu] userPermissions:", userPermissions);
    console.log("[JornaleiroMenu] hasCatalogAccess:", hasCatalogAccess);
    console.log("[JornaleiroMenu] hasPartnerDirectoryAccess:", hasPartnerDirectoryAccess);

    return buildJornaleiroMenuSections({
      hasCatalogAccess,
      hasPartnerDirectoryAccess,
      plansMenuEnabled,
      permissionsLoaded,
      isOwner,
      userPermissions,
    });
  }, [
    permissionsLoaded,
    isOwner,
    userPermissions,
    hasCatalogAccess,
    hasPartnerDirectoryAccess,
    plansMenuEnabled,
  ]);

  const menuItems = useMemo(() => menuSections.flatMap((section) => section.items), [menuSections]);

  const mobileQuickLinks = useMemo(() => {
    return JOURNALEIRO_MOBILE_QUICK_LINKS.flatMap((shortcut) => {
      const menuItem = menuItems.find((item) => item.href === shortcut.href);
      if (!menuItem) {
        return [];
      }
      return [shortcut];
    });
  }, [menuItems]);

  // IMPORTANTE: TODOS os hooks devem vir ANTES de qualquer return condicional!
  // Isso evita o erro React #310 "Rendered fewer hooks than during the previous render"

  // Ouvir atualizações da banca geradas pela página de edição para refletir no header em tempo real
  useEffect(() => {
    const onBancaUpdated = (e: any) => {
      try {
        const detail = e?.detail || {};
        const isCollaborator = (profile as any)?.jornaleiro_access_level === "collaborator";
        
        // 🚨 SEGURANÇA CRÍTICA: Validar que os dados pertencem ao usuário atual
        if (!user?.id) {
          console.error('[Event] ❌ SEGURANÇA: Tentativa de atualizar banca sem usuário autenticado');
          return;
        }
        
        // Dono da banca pode ter user_id diferente do usuário logado (caso colaborador).
        // Para admin, manter validação estrita.
        if (!isCollaborator && detail.user_id && detail.user_id !== user.id) {
          console.error('[Event] 🚨 ALERTA DE SEGURANÇA: Tentativa de atualizar com dados de outro usuário!');
          console.error('[Event] user_id esperado:', user.id);
          console.error('[Event] user_id recebido:', detail.user_id);
          return;
        }
        
        // Validação adicional: se já temos banca carregada, verificar se o ID bate
        if (banca?.id && detail.id && detail.id !== banca.id) {
          console.error('[Event] 🚨 ALERTA: Tentativa de atualizar com banca diferente!');
          console.error('[Event] banca_id atual:', banca.id);
          console.error('[Event] banca_id recebido:', detail.id);
          return;
        }
        
        console.log('[Event] ✅ Atualização válida recebida, atualizando header');
        const updatedBanca = { ...(banca || {}), ...detail };
        setBanca(updatedBanca);
        
        // 🔥 ATUALIZAR O CACHE IMEDIATAMENTE para refletir as mudanças
        if (user?.id) {
          try {
            sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(updatedBanca));
            console.log('[Event] 📦 Cache atualizado com novos dados');
          } catch (e) {
            console.error('[Event] Erro ao atualizar cache:', e);
          }
        }
      } catch (err) {
        console.error('[Event] Erro ao processar atualização:', err);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('gb:banca:updated', onBancaUpdated as any);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('gb:banca:updated', onBancaUpdated as any);
      }
    };
  }, [user?.id, banca?.id, (profile as any)?.jornaleiro_access_level]);

  // Limpar cache de bancas antigas quando user.id muda
  useEffect(() => {
    if (!useBancaCache) return;

    if (!user?.id) return;
    
    // Limpar todos os caches de banca exceto o atual
    const currentCacheKey = `gb:banca:${user.id}`;
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('gb:banca:') && key !== currentCacheKey) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      console.log('[Cache] Removendo cache antigo:', key);
      sessionStorage.removeItem(key);
    });
  }, [user?.id]);

  // VALIDAÇÃO DE SEGURANÇA: Verificar se usuário tem banca (com cache)
  useEffect(() => {
    const validateUserAccess = async () => {
      // Permitir rotas de autenticação
      if (isAuthRoute) {
        setBancaValidated(true);
        return;
      }

      // Aguardar carregamento
      if (authLoading) {
        return;
      }

      // Usuário não autenticado
      if (!user) {
        // Limpar cache quando não há usuário
        sessionStorage.clear();
        if (pathname !== '/jornaleiro') {
          router.push('/jornaleiro');
        }
        setBancaValidated(true);
        return;
      }

      // Verificar role (aceitando roles legadas como 'seller' como jornaleiro)
      const role = (profile as any)?.role;
      const isJornaleiroRole = role === 'jornaleiro' || role === 'seller';
      if (profile && !isJornaleiroRole) {
        console.error('[Security] Usuário não é jornaleiro');
        sessionStorage.clear();
        await signOut();
        router.push('/jornaleiro');
        setBancaValidated(true);
        return;
      }

      // Verificar se usuário está bloqueado
      if (profile && profile.blocked) {
        console.error('[Security] Usuário bloqueado pelo administrador');
        console.error('[Security] Motivo:', profile.blocked_reason);
        alert(`Sua conta foi bloqueada pelo administrador.\nMotivo: ${profile.blocked_reason || 'Não especificado'}`);
        sessionStorage.clear();
        await signOut();
        router.push('/jornaleiro');
        setBancaValidated(true);
        return;
      }

      // Cache da banca em sessionStorage para evitar múltiplas chamadas
      // IMPORTANTE: Usar chave específica do usuário para evitar conflito
      if (useBancaCache) {
        const cacheKey = `gb:banca:${user.id}`;
        const cachedBanca = sessionStorage.getItem(cacheKey);
        if (cachedBanca) {
          try {
            const bancaData = JSON.parse(cachedBanca);
            const isCollaborator = (profile as any)?.jornaleiro_access_level === "collaborator";
            const expectedBancaId = (profile as any)?.banca_id as string | null | undefined;
            console.log('[Cache] 📦 Cache encontrado:', {
              cache_key: cacheKey,
              banca_name: bancaData.name,
              banca_user_id: bancaData.user_id,
              user_autenticado: user.id,
              MATCH: isCollaborator ? bancaData.id === expectedBancaId : bancaData.user_id === user.id
            });
            
            // Validar se o cache é mesmo deste usuário
            const cacheValido = isCollaborator
              ? !!expectedBancaId && bancaData.id === expectedBancaId
              : bancaData.user_id === user.id;

            if (cacheValido) {
              console.log('[Cache] ✅ Cache válido, usando banca do cache');
              setBanca(bancaData);
              setBancaValidated(true);
              return;
            } else {
              // Cache inválido, remover
              console.error('[Cache] ❌ Cache INVÁLIDO detectado!');
              console.error('[Cache] Esperado:', isCollaborator ? { banca_id: expectedBancaId } : { user_id: user.id });
              console.error('[Cache] Cache tinha:', { user_id: bancaData.user_id, banca_id: bancaData.id });
              console.error('[Cache] Limpando cache inválido...');
              sessionStorage.removeItem(cacheKey);
            }
          } catch (e) {
            console.error('[Cache] Erro ao parsear cache:', e);
          }
        }
      }

      // Verificar se tem banca (apenas se não tiver cache)
      try {
        console.log('\n========== [Layout] Carregando banca ==========');
        console.log('[Layout] 👤 Usuário autenticado:', {
          user_id: user.id,
          user_email: (user as any)?.email
        });
        console.log('[Layout] 🔍 Buscando banca para user_id via API (avoid RLS issues):', user.id);
        
        const response = await fetch('/api/jornaleiro/banca', {
          method: 'GET',
          cache: 'no-store',
        });

        const responseText = await response.text();
        let parsed: any = null;
        try {
          parsed = JSON.parse(responseText);
        } catch (parseErr) {
          console.error('[Layout] ❌ Resposta inválida da API /jornaleiro/banca:', responseText);
        }

        if (!response.ok || !parsed?.success || !parsed?.data) {
          const apiError = parsed?.error || `HTTP ${response.status}`;
          console.error('[Layout] ❌ Usuário sem banca ou erro na API!', apiError);
          console.log('[Layout] Usuário sem banca associada. Redirecionando para fluxo de cadastro, NÃO para onboarding.');
          setBanca(null);
          setBancaValidated(true);
          
          // Regra nova:
          // - Onboarding é reservado para o fluxo logo após o wizard de cadastro
          // - Se o usuário acessa uma rota protegida sem ter banca, enviamos para /jornaleiro/registrar
          if (!pathname?.startsWith('/jornaleiro/registrar')) {
            router.push('/jornaleiro/registrar');
          }
          return;
        }

        console.log('[Layout] ✅ Banca encontrada:', {
          banca_id: parsed.data.id,
          banca_name: parsed.data.name,
          banca_user_id: parsed.data.user_id,
          banca_email: parsed.data.email
        });
        
        // SEGURANÇA: Para colaboradores e admins de banca (não donos), o user_id da banca pode ser diferente.
        // Confiar na API (que valida vínculo via banca_members) e evitar logout indevido.
        const resolvedAccessLevel =
          (parsed?.data?.profile as any)?.jornaleiro_access_level ?? (profile as any)?.jornaleiro_access_level;
        // collaborator ou admin que não é dono da banca - ambos acessam via banca_members
        const isNotOwner = resolvedAccessLevel === "collaborator" || resolvedAccessLevel === "admin";
        const isActualOwner = parsed.data.user_id === user.id;
        
        console.log('[Security] Verificação de acesso:', {
          resolvedAccessLevel,
          isNotOwner,
          isActualOwner,
          banca_user_id: parsed.data.user_id,
          logged_user_id: user.id
        });
        
        // Só faz logout se NÃO é collaborator/admin E user_id não bate
        if (!isNotOwner && !isActualOwner) {
          console.error('🚨🚨🚨 ALERTA DE SEGURANÇA: user_id NÃO BATE! 🚨🚨🚨');
          console.error('[SECURITY] user_id esperado:', user.id);
          console.error('[SECURITY] user_id da banca:', parsed.data.user_id);
          console.error('[SECURITY] Forçando logout por segurança!');
          sessionStorage.clear();
          await signOut();
          return;
        }

        // Salvar no cache (opcional)
        if (useBancaCache) {
          sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(parsed.data));
        }
        setBanca(parsed.data);
        setBancaValidated(true);
      } catch (error) {
        console.error('[Security] Erro ao validar banca:', error);
        setBanca(null);
        setBancaValidated(true);
        // Não faz redirect aqui - deixa a validação na renderização decidir
      }
    };

    validateUserAccess();
  }, [user?.id, profile?.role, (profile as any)?.jornaleiro_access_level, (profile as any)?.banca_id, authLoading, isAuthRoute]);

  // Listener para atualizar a banca quando houver alteração (ex: mudança de imagem)
  useEffect(() => {
    if (!useBancaCache) return;

    const handleBancaUpdate = () => {
      console.log('[Layout] 🔄 Evento de atualização de banca recebido');
      // Limpar cache e recarregar
      if (user?.id) {
        sessionStorage.removeItem(`gb:banca:${user.id}`);
        // Recarregar banca
        const reloadBanca = async () => {
          try {
            const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
              cache: "no-store",
              credentials: "include",
            });
            const text = await res.text();
            const json = JSON.parse(text);
            if (res.ok && json?.success && json?.data) {
              console.log('[Layout] ✅ Banca recarregada:', json.data);
              setBanca(json.data);
              sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(json.data));
            }
          } catch (e) {
            console.error('[Layout] ❌ Falha ao recarregar banca:', e);
          }
        };
        reloadBanca();
      }
    };

    window.addEventListener('banca-updated', handleBancaUpdate);
    return () => window.removeEventListener('banca-updated', handleBancaUpdate);
  }, [user?.id]);

  // Timeout de segurança: se demorar mais de 2s, liberar mesmo assim
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!bancaValidated) {
        console.warn('[Security] Timeout na validação, liberando acesso');
        setBancaValidated(true);
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [bancaValidated]);

  // Removido - banca já é carregada na validação de segurança

  const isMenuItemActive = (item: JornaleiroMenuItem) => {
    const targets = [item.href, ...(item.aliases || [])];
    return targets.some((target) => pathname === target || pathname?.startsWith(`${target}/`));
  };

  // TODOS os hooks foram declarados acima. Agora podemos fazer returns condicionais.
  
  // Evitar erros de hydration: enquanto ainda não montou no client,
  // renderizar apenas um shell neutro de loading, igual no server e no client.
  if (!mounted) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando painel...</p>
          </div>
        </div>
      </ToastProvider>
    );
  }

  if (isAuthRoute) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  // Aguardar apenas carregamento da autenticação
  if (authLoading) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando painel...</p>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // SEGURANÇA: Se não tiver banca, mostrar mensagem de erro em vez de tela branca
  // Debug: verificar se a validação está correta
  if (typeof window !== 'undefined') {
    console.log('[Layout] Validação banca:', { 
      hasBanca: !!banca, 
      allowedWithoutBanca, 
      pathname,
      willBlock: !banca && !allowedWithoutBanca
    });
  }
  
  // IMPORTANTE: Não redirecionar aqui!
  // A lógica de redirecionamento está no useEffect (linhas 293-305)
  // Este bloco causava redirecionamentos indesejados para usuários não autenticados
  // Se não tiver banca e não for rota de autenticação, mostrar loading temporário
  // enquanto a validação assíncrona roda. Após o timeout de segurança (2s),
  // bancaValidated será true e o painel é liberado mesmo se a banca ainda não
  // tiver carregado, evitando esperas muito longas.
  if (!banca && !isAuthRoute && user && !bancaValidated) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-700 font-medium">
              Estamos verificando sua banca.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Se esta tela ficar parada, é possível que sua conta ainda não tenha uma banca
              cadastrada. Clique no botão abaixo para ir direto para o cadastro.
            </p>
            <Link
              href="/jornaleiro/registrar"
              className="mt-4 inline-flex items-center justify-center rounded-md bg-[#ff5c00] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65300]"
            >
              Cadastrar minha banca
            </Link>
          </div>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Link href="/jornaleiro" className="flex items-center">
                <DashboardOfficialLogo />
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Centro de Notificações */}
              <NotificationCenter />
              
              {/* Voltar ao Site */}
              {mounted && banca?.id && (
                <Link
                  href={buildBancaHref(banca?.name || 'banca', banca.id, (banca as any)?.addressObj?.uf)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-orange-50 hover:text-[#ff5c00] sm:h-auto sm:w-auto sm:gap-2 sm:px-3 sm:py-2 sm:text-sm"
                  title="Ver minha banca no site"
                >
                  <svg className="h-6 w-6 shrink-0 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3a15.3 15.3 0 014 9 15.3 15.3 0 01-4 9 15.3 15.3 0 01-4-9 15.3 15.3 0 014-9Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 7.5A15.8 15.8 0 0112 6c2.8 0 5.4.6 7.5 1.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 16.5A15.8 15.8 0 0112 18c2.8 0 5.4-.6 7.5-1.5" />
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  </svg>
                  <span className="hidden sm:inline">Ver Banca</span>
                </Link>
              )}
              
              {mounted && banca?.id ? (
                <Link
                  href={buildBancaHref(banca?.name || 'banca', banca.id, (banca as any)?.addressObj?.uf)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden items-center gap-2 rounded-xl transition-opacity hover:opacity-80 lg:flex"
                  title="Ver perfil da banca no site"
                >
                  {banca?.profile_image ? (
                    <Image
                      src={banca.profile_image}
                      alt={banca.name || sellerName}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover sm:h-10 sm:w-10"
                    />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ff5c00] text-sm font-semibold text-white sm:h-10 sm:w-10">
                      {banca?.name ? banca.name.charAt(0).toUpperCase() : sellerName?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{banca?.name || sellerName}</div>
                    <div className="text-xs text-gray-500">{sellerEmail}</div>
                  </div>
                </Link>
              ) : (
                <div className="hidden items-center gap-2 lg:flex">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ff5c00] text-sm font-semibold text-white sm:h-10 sm:w-10">
                    {sellerName?.charAt(0)?.toUpperCase() || "B"}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{sellerName}</div>
                    <div className="text-xs text-gray-500">{sellerEmail}</div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
                aria-label="Alternar menu"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-60 bg-[#334257] border-r border-gray-200 transition-transform duration-300 ease-in-out`}
          >
            <div className="flex h-full flex-col">
              <div className="border-b border-white/10 p-4 lg:hidden">
                <div className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-white">
                  {banca?.profile_image ? (
                    <Image
                      src={banca.profile_image}
                      alt={banca?.name || sellerName}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#ff5c00] text-sm font-semibold text-white">
                      {banca?.name ? banca.name.charAt(0).toUpperCase() : sellerName?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-white/60">Jornaleiro</div>
                    <div className="truncate text-sm font-semibold">{sellerName}</div>
                    <div className="truncate text-xs text-white/70">{banca?.name || sellerEmail}</div>
                  </div>
                </div>
              </div>

              <nav className="flex-1 space-y-4 overflow-y-auto p-4 text-gray-100">
                {menuSections.map((section) => (
                  <div key={section.section} className="space-y-2">
                    <div className="px-3">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
                        {section.section}
                      </div>
                    </div>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const IconComponent = journaleiroIconComponents[item.icon];
                        const isActive = isMenuItemActive(item);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                              isActive
                                ? "bg-[#fff7f2] text-[#ff5c00] shadow-sm"
                                : "text-gray-100 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span
                              className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                                isActive ? "bg-[#ff5c00]/10 text-[#ff5c00]" : "bg-white/5 text-white/80 group-hover:bg-white/10"
                              }`}
                            >
                              <IconComponent size={20} stroke={1.7} />
                            </span>
                            <span className="min-w-0 flex-1 font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="border-t border-white/10 p-4">
                <button
                  type="button"
                  onClick={() => {
                    setSidebarOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sair
                </button>
              </div>
            </div>
          </aside>

          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="flex-1 min-h-screen overflow-x-hidden">
            <div className="max-w-full overflow-x-hidden px-3 py-4 pb-24 sm:p-6 lg:pb-6">
              <QueryProvider>
                {children}
              </QueryProvider>
            </div>
          </main>
        </div>

        {mobileQuickLinks.length > 0 && (
          <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
            aria-label="Atalhos principais do painel"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
          >
            <div className="mx-auto flex max-w-md items-center justify-around gap-2 px-3 pt-2">
              {mobileQuickLinks.map((shortcut) => {
                const IconComponent = journaleiroIconComponents[shortcut.icon];
                const isActive = pathname === shortcut.href || pathname?.startsWith(`${shortcut.href}/`);

                return (
                  <Link
                    key={shortcut.key}
                    href={shortcut.href}
                    className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#fff3ec] text-[#ff5c00]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <IconComponent size={20} stroke={1.8} />
                    <span className="truncate">{shortcut.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </ToastProvider>
  );
}
