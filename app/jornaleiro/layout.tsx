"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import ToastProvider from "@/components/admin/ToastProvider";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { useAuth } from "@/lib/auth/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Hedvig_Letters_Serif } from "next/font/google";
import { supabase } from "@/lib/supabase";
import { QueryProvider } from "@/app/providers/QueryProvider";
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
  IconHome,
} from "@tabler/icons-react";

const hedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["serif"],
});

const journaleiroIconComponents = {
  dashboard: IconLayoutDashboard,
  home: IconHome,
  banca: IconBuilding,
  orders: IconClipboardList,
  products: IconPackage,
  catalog: IconFolderOpen,
  campaigns: IconMessageDots,
  distributors: IconUsers,
  coupons: IconTicket,
  reports: IconChartBar,
  academy: IconSchool,
  settings: IconSettings,
} as const;

type JournaleiroIconKey = keyof typeof journaleiroIconComponents;

const JOURNALEIRO_MENU: { label: string; href: Route; icon: JournaleiroIconKey; disabled?: boolean }[] = [
  { label: "Dashboard", href: "/jornaleiro/dashboard" as Route, icon: "dashboard" },
  { label: "Minha Banca", href: "/jornaleiro/banca" as Route, icon: "banca" },
  { label: "Pedidos", href: "/jornaleiro/pedidos" as Route, icon: "orders" },
  { label: "Produtos", href: "/jornaleiro/produtos" as Route, icon: "products" },
  { label: "Catálogo Distribuidor", href: "/jornaleiro/catalogo-distribuidor" as Route, icon: "catalog" },
  { label: "Campanhas", href: "/jornaleiro/campanhas" as Route, icon: "campaigns" },
  { label: "Distribuidores", href: "/jornaleiro/distribuidores" as Route, icon: "distributors" },
  { label: "Cupons", href: "/jornaleiro/coupons" as Route, icon: "coupons" },
  { label: "Relatórios", href: "/jornaleiro/relatorios" as Route, icon: "reports" },
  { label: "Academy", href: "/jornaleiro/academy" as Route, icon: "academy" },
  { label: "Configurações", href: "/jornaleiro/configuracoes" as Route, icon: "settings" },
];

interface SellerSession {
  seller?: {
    id?: string;
    name?: string;
    email?: string;
  };
  banks?: any[];
  [key: string]: any;
}

export default function JornaleiroLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<SellerSession | null>(null);
  const [branding, setBranding] = useState<{ logoUrl?: string; logoAlt?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [banca, setBanca] = useState<any>(null);
  const [bancaValidated, setBancaValidated] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  // Ouvir atualizações da banca geradas pela página de edição para refletir no header em tempo real
  useEffect(() => {
    const onBancaUpdated = (e: any) => {
      try {
        const detail = e?.detail || {};
        
        // 🚨 SEGURANÇA CRÍTICA: Validar que os dados pertencem ao usuário atual
        if (!user?.id) {
          console.error('[Event] ❌ SEGURANÇA: Tentativa de atualizar banca sem usuário autenticado');
          return;
        }
        
        if (detail.user_id && detail.user_id !== user.id) {
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
  }, [user?.id, banca?.id]);

  // Limpar cache de bancas antigas quando user.id muda
  useEffect(() => {
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

      // Verificar role
      if (profile && profile.role !== 'jornaleiro') {
        console.error('[Security] Usuário não é jornaleiro');
        sessionStorage.clear();
        await signOut();
        router.push('/jornaleiro');
        setBancaValidated(true);
        return;
      }

      // Cache da banca em sessionStorage para evitar múltiplas chamadas
      // IMPORTANTE: Usar chave específica do usuário para evitar conflito
      const cacheKey = `gb:banca:${user.id}`;
      const cachedBanca = sessionStorage.getItem(cacheKey);
      if (cachedBanca) {
        try {
          const bancaData = JSON.parse(cachedBanca);
          console.log('[Cache] 📦 Cache encontrado:', {
            cache_key: cacheKey,
            banca_name: bancaData.name,
            banca_user_id: bancaData.user_id,
            user_autenticado: user.id,
            MATCH: bancaData.user_id === user.id
          });
          
          // Validar se o cache é mesmo deste usuário
          if (bancaData.user_id === user.id) {
            console.log('[Cache] ✅ Cache válido, usando banca do cache');
            setBanca(bancaData);
            setBancaValidated(true);
            return;
          } else {
            // Cache inválido, remover
            console.error('[Cache] ❌ Cache INVÁLIDO detectado!');
            console.error('[Cache] Esperado user_id:', user.id);
            console.error('[Cache] Cache tinha user_id:', bancaData.user_id);
            console.error('[Cache] Limpando cache inválido...');
            sessionStorage.removeItem(cacheKey);
          }
        } catch (e) {
          console.error('[Cache] Erro ao parsear cache:', e);
        }
      }

      // Verificar se tem banca (apenas se não tiver cache)
      try {
        console.log('\n========== [Layout] Carregando banca ==========');
        console.log('[Layout] 👤 Usuário autenticado:', {
          user_id: user.id,
          user_email: (user as any)?.email
        });
        console.log('[Layout] 🔍 Buscando banca para user_id:', user.id);
        
        const { data: bancaData, error } = await supabase
          .from('bancas')
          .select('id, name, user_id, email, profile_image')
          .eq('user_id', user.id)
          .single();

        if (error || !bancaData) {
          console.error('[Layout] ❌ SEGURANÇA: Usuário sem banca associada!', error?.message);
          console.error('[Layout] Forçando logout por segurança...');
          setBanca(null);
          setBancaValidated(true);
          
          // SEGURANÇA CRÍTICA: Fazer logout imediato se não tiver banca
          sessionStorage.clear();
          localStorage.clear();
          await signOut();
          router.push('/jornaleiro?error=no_banca');
          return;
        }

        console.log('[Layout] ✅ Banca encontrada:', {
          banca_id: bancaData.id,
          banca_name: bancaData.name,
          banca_user_id: bancaData.user_id,
          banca_email: bancaData.email
        });
        
        // SEGURANÇA CRÍTICA: Verificar se os dados batem
        if (bancaData.user_id !== user.id) {
          console.error('🚨🚨🚨 ALERTA DE SEGURANÇA: user_id NÃO BATE! 🚨🚨🚨');
          console.error('[SECURITY] user_id esperado:', user.id);
          console.error('[SECURITY] user_id da banca:', bancaData.user_id);
          console.error('[SECURITY] Forçando logout por segurança!');
          sessionStorage.clear();
          await signOut();
          return;
        }

        // Salvar no cache
        sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(bancaData));
        setBanca(bancaData);
        setBancaValidated(true);
      } catch (error) {
        console.error('[Security] Erro ao validar banca:', error);
        setBanca(null);
        setBancaValidated(true);
        // Não faz redirect aqui - deixa a validação na renderização decidir
      }
    };

    validateUserAccess();
  }, [user?.id, profile?.role, authLoading, isAuthRoute]);

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

  // Carregar branding (com cache)
  useEffect(() => {
    const loadBranding = async () => {
      // Cache em sessionStorage
      const cached = sessionStorage.getItem('gb:branding');
      if (cached) {
        try {
          setBranding(JSON.parse(cached));
          return;
        } catch {}
      }

      try {
        const response = await fetch('/api/admin/branding', { 
          next: { revalidate: 3600 } // Cache de 1 hora
        });
        const result = await response.json();
        if (result.success && result.data) {
          setBranding(result.data);
          sessionStorage.setItem('gb:branding', JSON.stringify(result.data));
        }
      } catch (error) {
        console.error('Erro ao carregar branding:', error);
      }
    };
    loadBranding();
  }, []);

  if (isAuthRoute) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  // Aguardar carregamento da autenticação e validação de banca
  if (authLoading || !bancaValidated) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando...</p>
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
  
  // SEGURANÇA CRÍTICA: Se não tiver banca, bloquear TUDO
  if (!banca && !isAuthRoute) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
            <p className="text-gray-600 mb-6">
              Sua conta não possui uma banca associada. Entre em contato com o administrador para configurar sua banca.
            </p>
            <div className="space-y-3">
              <button
                onClick={logout}
                className="w-full bg-[#ff5c00] text-white px-4 py-2 rounded-md hover:opacity-90"
              >
                Ir para Dashboard
              </button>
              <button
                onClick={() => router.push('/jornaleiro/banca')}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50"
              >
                Cadastrar Banca
              </button>
            </div>
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="Alternar menu"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>

              <Link href="/jornaleiro" className="flex items-center gap-2">
                {mounted && branding?.logoUrl ? (
                  <Image
                    src={branding.logoUrl}
                    alt={branding.logoAlt || "Logo"}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain"
                  />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-8 w-8 text-[#ff5c00]"
                      fill="currentColor"
                    >
                      <rect x="3" y="4" width="18" height="16" rx="2" ry="2" opacity="0.15" />
                      <rect x="6" y="7" width="12" height="2" rx="1" />
                      <rect x="6" y="11" width="9" height="2" rx="1" />
                      <rect x="6" y="15" width="6" height="2" rx="1" />
                    </svg>
                    <span className={`text-lg tracking-wide lowercase ${hedvig.className} text-black`}>
                      <span className="font-bold text-[#ff5c00]">g</span>uia das bancas
                    </span>
                  </>
                )}
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Centro de Notificações */}
              <NotificationCenter />
              
              {/* Voltar ao Site */}
              {mounted && banca?.id && (
                <Link
                  href={`/bancas/${banca.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors text-gray-600 hover:text-[#ff5c00] hover:bg-orange-50"
                  title="Ver minha banca no site"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6h4a2 2 0 012 2v4M7 14l3-3 3 3M14 10l3-3 3 3" />
                  </svg>
                  <span className="hidden sm:inline">Ver Banca</span>
                </Link>
              )}
              
              {mounted && banca?.id ? (
                <Link
                  href={`/bancas/${banca.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title="Ver perfil da banca no site"
                >
                  {banca?.profile_image ? (
                    <Image
                      src={banca.profile_image}
                      alt={banca.name || sellerName}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#ff5c00] text-white grid place-items-center text-sm font-semibold">
                      {banca?.name ? banca.name.charAt(0).toUpperCase() : sellerName?.charAt(0)?.toUpperCase() || "B"}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{banca?.name || sellerName}</div>
                    <div className="text-xs text-gray-500">{banca?.email || sellerEmail}</div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#ff5c00] text-white grid place-items-center text-sm font-semibold">
                    {sellerName?.charAt(0)?.toUpperCase() || "B"}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium">{sellerName}</div>
                    <div className="text-xs text-gray-500">{sellerEmail}</div>
                  </div>
                </div>
              )}
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                title="Sair"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="flex">
          <aside
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}
          >
            <nav className="p-4 space-y-4">
              {JOURNALEIRO_MENU.map((item) => {
                const IconComponent = journaleiroIconComponents[item.icon];
                const isActive = pathname === item.href;
                const classes = item.disabled
                  ? "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                  : `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#fff7f2] text-[#ff5c00]"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`;

                const icon = <IconComponent size={20} stroke={1.7} />;

                if (item.disabled) {
                  return (
                    <span key={item.href} className={classes}>
                      {icon}
                      {item.label}
                      <span className="ml-auto text-xs text-gray-400">Em breve</span>
                    </span>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={classes}
                  >
                    {icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="flex-1 min-h-screen">
            <div className="p-6">
              <QueryProvider>
                {children}
              </QueryProvider>
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
