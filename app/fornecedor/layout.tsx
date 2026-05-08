"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { signOut as nextAuthSignOut } from "next-auth/react";
import ToastProvider from "@/components/admin/ToastProvider";
import DashboardOfficialLogo from "@/components/dashboard/DashboardOfficialLogo";
import {
  FORNECEDOR_MENU,
  type FornecedorIconKey,
} from "@/lib/fornecedor-navigation";
import {
  IconBox,
  IconBuildingStore,
  IconClipboardList,
  IconCreditCard,
  IconEye,
  IconLayoutDashboard,
  IconSettings,
  IconTruck,
} from "@tabler/icons-react";

const iconComponents = {
  dashboard: IconLayoutDashboard,
  box: IconBox,
  orders: IconClipboardList,
  truck: IconTruck,
  creditCard: IconCreditCard,
  store: IconBuildingStore,
  eye: IconEye,
  settings: IconSettings,
} as const;

export default function FornecedorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const validateAdminAccess = async () => {
      try {
        const sessionRes = await fetch("/api/auth/validate-session", {
          method: "GET",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        });
        const sessionData = await sessionRes.json().catch(() => null);

        if (
          sessionRes.ok &&
          sessionData?.authenticated === true &&
          sessionData?.profile?.role === "admin"
        ) {
          setUser({
            id: sessionData.profile.id,
            name: sessionData.profile.full_name || "Fornecedor",
            email: sessionData.user?.email || "admin@guiadasbancas.com",
            role: "admin",
          });
          setLoading(false);
          return;
        }

        router.replace("/admin/login");
      } catch {
        router.replace("/admin/login");
      }
    };

    validateAdminAccess();
  }, [router]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-[#ff5c00]" />
          <p className="mt-2 text-sm text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
                aria-label="Abrir menu"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>

              <Link href="/fornecedor/dashboard" className="flex items-center gap-2">
                <DashboardOfficialLogo />
                <span className="hidden rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-[#ff5c00] sm:inline-flex">
                  Fornecedor
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/fornecedor"
                className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 sm:inline-flex"
              >
                Painel admin
              </Link>

              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#ff5c00] text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || "F"}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{user?.name || "Fornecedor Guia"}</div>
                  <div className="text-xs text-gray-500">{user?.email || "admin@guiadasbancas.com"}</div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
          </div>
        </header>

        <div className="flex">
          <aside
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-80 border-r border-gray-200 bg-[#334257] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
          >
            <div className="h-full overflow-y-auto">
              <div className="border-b border-white/10 px-4 py-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-200">
                    Portal do Fornecedor
                  </div>
                  <div className="mt-2 text-sm font-medium text-white">
                    Centro de distribuicao proprio
                  </div>
                  <div className="mt-2 text-xs leading-5 text-gray-300">
                    Catalogo sem Mercos, checkout B2B, pedidos, entregas e visibilidade por jornaleiro.
                  </div>
                </div>
              </div>

              <nav className="space-y-5 p-4">
                {FORNECEDOR_MENU.map((section) => (
                  <section key={section.section} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="mb-3 px-1">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200">
                        {section.section}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-gray-300">{section.description}</p>
                    </div>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const IconComponent = iconComponents[item.icon as FornecedorIconKey];
                        const isActive =
                          pathname === item.href ||
                          (item.href !== "/fornecedor/dashboard" && pathname.startsWith(`${item.href}/`));

                        return (
                          <Link
                            key={item.href}
                            href={item.href as Route}
                            onClick={() => setSidebarOpen(false)}
                            className={`group flex items-start gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                              isActive
                                ? "bg-[#fff7f2] text-[#ff5c00] shadow-sm"
                                : "text-gray-100 hover:bg-white/10 hover:text-white"
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

          {sidebarOpen ? (
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              aria-label="Fechar menu"
              onClick={() => setSidebarOpen(false)}
            />
          ) : null}

          <main className="min-h-screen flex-1">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
