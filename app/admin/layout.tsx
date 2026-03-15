"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { signOut as nextAuthSignOut } from "next-auth/react";
import ToastProvider from "@/components/admin/ToastProvider";
import DashboardOfficialLogo from "@/components/dashboard/DashboardOfficialLogo";
import { ADMIN_MENU, type AdminIconKey } from "@/lib/admin-navigation";
import {
  IconLayoutDashboard,
  IconHome,
  IconStars,
  IconBuildingStore,
  IconUsers,
  IconUser,
  IconClipboardList,
  IconBox,
  IconTags,
  IconTruck,
  IconSpeakerphone,
  IconPhoto,
  IconLayoutGrid,
  IconNews,
  IconGift,
  IconChartLine,
  IconClipboardCheck,
  IconSchool,
  IconSettings,
  IconBrandWhatsapp,
  IconUserCheck,
  IconArticle,
  IconCreditCard,
  IconPalette,
  IconBorderBottom,
} from "@tabler/icons-react";

const iconComponents = {
  dashboard: IconLayoutDashboard,
  home: IconHome,
  sparkles: IconStars,
  store: IconBuildingStore,
  users: IconUsers,
  user: IconUser,
  orders: IconClipboardList,
  box: IconBox,
  tags: IconTags,
  truck: IconTruck,
  megaphone: IconSpeakerphone,
  image: IconPhoto,
  grid: IconLayoutGrid,
  newspaper: IconNews,
  gift: IconGift,
  chart: IconChartLine,
  clipboard: IconClipboardCheck,
  school: IconSchool,
  settings: IconSettings,
  brandWhatsapp: IconBrandWhatsapp,
  userCheck: IconUserCheck,
  article: IconArticle,
  creditCard: IconCreditCard,
  palette: IconPalette,
  footer: IconBorderBottom,
} as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Verificar autenticação admin apenas se não estiver na página de login
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const validateAdminAccess = async () => {
      try {
        let sessionData: any = null;
        let sessionResOk = false;

        for (let attempt = 0; attempt < 6; attempt += 1) {
          const sessionRes = await fetch("/api/auth/validate-session", {
            method: "GET",
            cache: "no-store",
            headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
          });
          sessionData = await sessionRes.json().catch(() => null);
          sessionResOk = sessionRes.ok;

          if (sessionRes.ok && sessionData?.authenticated === true) {
            break;
          }

          if (attempt < 5) {
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }

        if (
          sessionResOk &&
          sessionData?.authenticated === true &&
          sessionData?.profile?.role === "admin"
        ) {
          const adminData = {
            id: sessionData.profile.id,
            name: sessionData.profile.full_name || "Administrador",
            email: sessionData.user?.email || "admin@guiadasbancas.com",
            role: "admin",
          };
          localStorage.setItem("gb:adminAuth", "1");
          localStorage.setItem("gb:admin", JSON.stringify(adminData));
          setUser(adminData);
          setLoading(false);
          return;
        }

        localStorage.removeItem("gb:adminAuth");
        localStorage.removeItem("gb:admin");
        router.replace("/admin/login");
      } catch {
        router.replace("/admin/login");
      }
    };

    validateAdminAccess();
  }, [router, pathname]);

  const logout = async () => {
    try {
      localStorage.removeItem("gb:adminAuth");
      localStorage.removeItem("gb:admin");
    } catch {}
    try {
      await nextAuthSignOut({ redirect: false });
    } catch {}
    router.replace("/admin/login");
  };

  // Se estiver na página de login, renderizar sem verificação
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Se ainda estiver carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
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
            
            <Link href="/admin/dashboard" className="flex items-center">
              <DashboardOfficialLogo />
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
              <div className="h-8 w-8 rounded-full bg-[#ff5c00] text-white grid place-items-center text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{user?.email || 'admin@guiadasbancas.com'}</div>
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
                  Admin do Marketplace
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  Centro de controle do ecossistema Guia das Bancas
                </div>
                <div className="mt-2 text-xs leading-5 text-gray-300">
                  Operacao, growth, catalogo, monetizacao e inteligencia em uma navegação unica.
                </div>
              </div>
            </div>

            <nav className="space-y-5 p-4">
              {ADMIN_MENU.map((section) => (
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
                      const IconComponent = iconComponents[item.icon as AdminIconKey];
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/admin/dashboard" && pathname.startsWith(`${item.href}/`));

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
                              isActive ? "bg-[#fff1e8] text-[#ff5c00]" : "bg-white/5 text-gray-200 group-hover:bg-white/10"
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
  );
}
