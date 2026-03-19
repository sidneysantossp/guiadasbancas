"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { Providers } from "@/components/Providers";
import ToastProvider from "@/components/admin/ToastProvider";
import DashboardOfficialLogo from "@/components/dashboard/DashboardOfficialLogo";
import { destroyDistribuidorSession } from "@/lib/distribuidor-client-auth";
import { useDistribuidorSession } from "@/lib/distribuidor-client-session";
import {
  DISTRIBUIDOR_MENU,
  type DistribuidorIconKey,
} from "@/lib/distribuidor-navigation";
import {
  IconLayoutDashboard,
  IconBox,
  IconClipboardList,
  IconTags,
  IconSettings,
  IconTruck,
  IconPhoto,
  IconPercentage,
  IconPlugConnected,
} from "@tabler/icons-react";

const iconComponents = {
  dashboard: IconLayoutDashboard,
  box: IconBox,
  orders: IconClipboardList,
  tags: IconTags,
  settings: IconSettings,
  truck: IconTruck,
  image: IconPhoto,
  percentage: IconPercentage,
  plug: IconPlugConnected,
} as const;

export default function DistribuidorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLoginRoute = pathname === "/distribuidor/login";
  const { distribuidor, loading } = useDistribuidorSession({
    enabled: !isLoginRoute,
    redirectToLogin: !isLoginRoute,
  });

  const logout = () => {
    void destroyDistribuidorSession().finally(() => {
      router.replace("/distribuidor/login");
    });
  };

  // Se estiver na página de login, renderizar sem verificação
  if (isLoginRoute) {
    return <Providers>{children}</Providers>;
  }

  // Se ainda estiver carregando, mostrar loading
  if (loading) {
    return (
      <Providers>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Verificando acesso...</p>
          </div>
        </div>
      </Providers>
    );
  }

  return (
    <Providers>
    <ToastProvider>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            </button>
            
            <Link href="/distribuidor/dashboard" className="flex items-center gap-2">
              <DashboardOfficialLogo />
              <span className="hidden sm:inline-flex ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Distribuidor
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Ver Site
            </Link>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center text-sm font-semibold">
                {distribuidor?.nome?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{distribuidor?.nome || 'Distribuidor'}</div>
                <div className="text-xs text-gray-500">{distribuidor?.email || 'distribuidor@email.com'}</div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                title="Sair"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[#334257] border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          <div className="h-full overflow-y-auto">
            <div className="border-b border-white/10 px-4 py-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-200">
                  Portal do Distribuidor
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  Operacao comercial e abastecimento da rede
                </div>
                <div className="mt-2 text-xs leading-5 text-gray-300">
                  Catalogo, pedidos, bancas parceiras, markup e integracoes em uma navegacao unica.
                </div>
              </div>
            </div>

            <nav className="space-y-5 p-4">
              {DISTRIBUIDOR_MENU.map((section) => (
                <section key={section.section} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-3 px-1">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">
                      {section.section}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-gray-300">
                      {section.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const IconComponent = iconComponents[item.icon as DistribuidorIconKey];
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/distribuidor/dashboard" && pathname.startsWith(`${item.href}/`));

                      return (
                        <Link
                          key={item.href}
                          href={item.href as Route}
                          onClick={() => setSidebarOpen(false)}
                          className={`group flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                            isActive
                              ? 'bg-[#fff7f2] text-[#ff5c00] shadow-sm'
                              : 'text-gray-100 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div
                            className={`mt-0.5 rounded-lg p-2 ${
                              isActive
                                ? "bg-[#fff1e8] text-[#ff5c00]"
                                : "bg-white/5 text-gray-200 group-hover:bg-white/10"
                            }`}
                          >
                            <IconComponent size={18} stroke={1.8} />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium">{item.label}</div>
                            <div className={`mt-1 text-xs leading-5 ${isActive ? "text-[#c85a16]" : "text-gray-300"}`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
    </ToastProvider>
    </Providers>
  );
}
