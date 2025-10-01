"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import ToastProvider from "@/components/admin/ToastProvider";
import NotificationCenter from "@/components/admin/NotificationCenter";
import { useAuth } from "@/lib/auth/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const JOURNALEIRO_MENU: { label: string; href: Route; icon: string; disabled?: boolean }[] = [
  { label: "Dashboard", href: "/jornaleiro/dashboard" as Route, icon: "📊" },
  { label: "Minha Banca", href: "/jornaleiro/banca" as Route, icon: "🏪" },
  { label: "Pedidos", href: "/jornaleiro/pedidos" as Route, icon: "🧾" },
  { label: "Produtos", href: "/jornaleiro/produtos" as Route, icon: "📦" },
  { label: "Campanhas", href: "/jornaleiro/campanhas" as Route, icon: "📢" },
  { label: "Distribuidores", href: "/jornaleiro/distribuidores" as Route, icon: "🚚" },
  { label: "Cupons", href: "/jornaleiro/coupons" as Route, icon: "🏷️" },
  { label: "Financeiro", href: "/jornaleiro/financeiro" as Route, icon: "💵", disabled: true },
  { label: "Relatórios", href: "/jornaleiro/relatorios" as Route, icon: "📊" },
  { label: "Configurações", href: "/jornaleiro/configuracoes" as Route, icon: "⚙️" },
];

interface SellerSession {
  seller?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  };
  banks?: any[];
  [key: string]: any;
}

export default function JornaleiroLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<SellerSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const isAuthRoute = pathname === "/jornaleiro" || pathname?.startsWith("/jornaleiro/registrar") || pathname?.startsWith("/jornaleiro/onboarding");

  useEffect(() => {
    if (isAuthRoute) {
      setLoading(false);
      return;
    }
    setLoading(authLoading);
  }, [authLoading, isAuthRoute]);

  const logout = async () => {
    await signOut();
  };

  const sellerName = profile?.full_name || user?.email?.split('@')[0] || "Jornaleiro";
  const sellerEmail = user?.email || "jornaleiro@guiadasbancas.com";

  if (isAuthRoute) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (loading) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando painel do jornaleiro...</p>
          </div>
        </div>
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <ProtectedRoute requiredRole="jornaleiro">
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

              <Link href={"/jornaleiro/dashboard"} className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-[#ff5c00]"
                  fill="currentColor"
                >
                  <rect x="3" y="4" width="18" height="16" rx="2" ry="2" opacity="0.12" />
                  <path d="M7 8h5v2H7zM7 12h3v2H7zM7 16h5v2H7zM14 8h3v10h-3z" />
                </svg>
                <div>
                  <div className="text-lg font-bold text-[#ff5c00]">Jornaleiro</div>
                  <div className="text-xs text-gray-500 -mt-1">Guia das Bancas</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {/* Centro de Notificações */}
              <NotificationCenter />
              
              {/* Voltar ao Site */}
              <Link
                href={`/banca/${session?.seller?.id || 'demo'}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#ff5c00] hover:bg-orange-50 rounded-md transition-colors"
                title="Ver minha banca no site"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 6h4a2 2 0 012 2v4M7 14l3-3 3 3M14 10l3-3 3 3" />
                </svg>
                <span className="hidden sm:inline">Ver Banca</span>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#ff5c00] text-white grid place-items-center text-sm font-semibold">
                  {sellerName?.charAt(0)?.toUpperCase() || "J"}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{sellerName}</div>
                  <div className="text-xs text-gray-500">{sellerEmail}</div>
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
                        ? "bg-[#fff7f2] text-[#ff5c00] border-r-2 border-[#ff5c00]"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`;

                return item.disabled ? (
                  <span key={item.href} className={classes}>
                    <span className="text-lg">{item.icon}</span>
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
                    <span className="text-lg">{item.icon}</span>
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
      </ProtectedRoute>
    </ToastProvider>
  );
}
