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

const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"] });

const JOURNALEIRO_MENU: { label: string; href: Route; icon: string; iconStyle?: string; disabled?: boolean }[] = [
  { label: "Dashboard", href: "/jornaleiro/dashboard" as Route, icon: "house", iconStyle: "solid" },
  { label: "Minha Banca", href: "/jornaleiro/banca" as Route, icon: "building", iconStyle: "regular" },
  { label: "Pedidos", href: "/jornaleiro/pedidos" as Route, icon: "clipboard", iconStyle: "regular" },
  { label: "Produtos", href: "/jornaleiro/produtos" as Route, icon: "clone", iconStyle: "regular" },
  { label: "Catálogo Distribuidor", href: "/jornaleiro/catalogo-distribuidor" as Route, icon: "folder-open", iconStyle: "regular" },
  { label: "Campanhas", href: "/jornaleiro/campanhas" as Route, icon: "comment-dots", iconStyle: "regular" },
  { label: "Distribuidores", href: "/jornaleiro/distribuidores" as Route, icon: "address-card", iconStyle: "regular" },
  { label: "Cupons", href: "/jornaleiro/coupons" as Route, icon: "id-card", iconStyle: "regular" },
  { label: "Relatórios", href: "/jornaleiro/relatorios" as Route, icon: "chart-bar", iconStyle: "regular" },
  { label: "Academy", href: "/jornaleiro/academy" as Route, icon: "graduation-cap", iconStyle: "solid" },
  { label: "Configurações", href: "/jornaleiro/configuracoes" as Route, icon: "circle-dot", iconStyle: "regular" },
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

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const isAuthRoute = pathname === "/jornaleiro" || pathname?.startsWith("/jornaleiro/registrar") || pathname?.startsWith("/jornaleiro/onboarding") || pathname?.startsWith("/jornaleiro/esqueci-senha") || pathname?.startsWith("/jornaleiro/nova-senha") || pathname?.startsWith("/jornaleiro/reset-local");
  // Permite acessar todas as páginas do jornaleiro mesmo sem banca (exceto rotas de autenticação)
  const allowedWithoutBanca = Boolean(
    pathname?.startsWith('/jornaleiro/dashboard') ||
    pathname?.startsWith('/jornaleiro/banca') ||
    pathname?.startsWith('/jornaleiro/pedidos') ||
    pathname?.startsWith('/jornaleiro/produtos') ||
    pathname?.startsWith('/jornaleiro/configuracoes') ||
    pathname?.startsWith('/jornaleiro/academy') ||
    pathname?.startsWith('/jornaleiro/catalogo-distribuidor') ||
    pathname?.startsWith('/jornaleiro/distribuidores') ||
    pathname?.startsWith('/jornaleiro/campanhas') ||
    pathname?.startsWith('/jornaleiro/coupons') ||
    pathname?.startsWith('/jornaleiro/relatorios')
  );

  const logout = async () => {
    await signOut();
  };

  const sellerName = profile?.full_name || "Vendedor";
  const sellerEmail = (user as any)?.email || "vendedor@example.com";

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
        if (pathname !== '/jornaleiro') {
          router.push('/jornaleiro');
        }
        setBancaValidated(true);
        return;
      }

      // Verificar role
      if (profile && profile.role !== 'jornaleiro') {
        console.error('[Security] Usuário não é jornaleiro');
        await signOut();
        router.push('/jornaleiro');
        setBancaValidated(true);
        return;
      }

      // Cache da banca em sessionStorage para evitar múltiplas chamadas
      const cachedBanca = sessionStorage.getItem(`gb:banca:${user.id}`);
      if (cachedBanca) {
        try {
          const bancaData = JSON.parse(cachedBanca);
          setBanca(bancaData);
          setBancaValidated(true);
          return;
        } catch {}
      }

      // Verificar se tem banca (apenas se não tiver cache)
      try {
        const { data: bancaData, error } = await supabase
          .from('bancas')
          .select('id, slug, name, user_id, email, profile_image')
          .eq('user_id', user.id)
          .single();

        if (error || !bancaData) {
          console.warn('[Security] Usuário sem banca associada.');
          setBanca(null);
          setBancaValidated(true);
          // Não faz redirect aqui - deixa a validação na renderização decidir
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
  
  if (!banca && !allowedWithoutBanca) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Banca não encontrada</h1>
            <p className="text-gray-600 mb-6">
              Você precisa ter uma banca associada à sua conta para acessar esta página.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/jornaleiro/dashboard')}
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
                {branding?.logoUrl ? (
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
              <Link
                href={banca?.slug ? `/banca/${banca.slug}` : `/banca/${banca?.id || '#'}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  banca?.slug || banca?.id 
                    ? 'text-gray-600 hover:text-[#ff5c00] hover:bg-orange-50 cursor-pointer' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                title={banca?.slug || banca?.id ? "Ver minha banca no site" : "Carregando..."}
                onClick={(e) => {
                  if (!banca?.slug && !banca?.id) {
                    e.preventDefault();
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6h4a2 2 0 012 2v4M7 14l3-3 3 3M14 10l3-3 3 3" />
                </svg>
                <span className="hidden sm:inline">Ver Banca</span>
              </Link>
              
              <div className="flex items-center gap-2">
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
                    {banca?.name?.charAt(0)?.toUpperCase() || sellerName?.charAt(0)?.toUpperCase() || "B"}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{banca?.name || sellerName}</div>
                  <div className="text-xs text-gray-500">{banca?.email || sellerEmail}</div>
                </div>
              </div>
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
                const isActive = pathname === item.href;
                const classes = item.disabled
                  ? "flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-400 bg-gray-100 cursor-not-allowed"
                  : `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#fff7f2] text-[#ff5c00]"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`;

                // SVG customizado para home (outline)
                const HomeIcon = () => (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                );

                // SVG customizado para Academy
                const AcademyIcon = () => (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                );

                const iconClass = `fa-${item.iconStyle || 'solid'} fa-${item.icon} w-5`;
                
                const renderIcon = () => {
                  if (item.icon === 'house') return <HomeIcon />;
                  if (item.icon === 'graduation-cap') return <AcademyIcon />;
                  return <i className={iconClass}></i>;
                };
                
                return item.disabled ? (
                  <span key={item.href} className={classes}>
                    {renderIcon()}
                    {item.label}
                    <span className="ml-auto text-xs text-gray-400">Em breve</span>
                  </span>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={classes}
                  >
                    {renderIcon()}
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
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
