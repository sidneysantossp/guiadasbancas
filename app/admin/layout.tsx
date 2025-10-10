"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import ToastProvider from "@/components/admin/ToastProvider";
import { Hedvig_Letters_Serif } from "next/font/google";

const hedvig = Hedvig_Letters_Serif({ subsets: ["latin"] });

const ADMIN_MENU = [
  {
    section: "CMS",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
      { label: "Home Page", href: "/admin/cms/home", icon: "🏠" },
      { label: "Vitrines", href: "/admin/cms/vitrines", icon: "⭐" },
      { label: "SEO", href: "/admin/cms/seo", icon: "🔍" },
      { label: "Branding", href: "/admin/cms/branding", icon: "🎨" },
      { label: "Header", href: "/admin/cms/header", icon: "📱" },
      { label: "Footer", href: "/admin/cms/footer", icon: "🦶" },
    ]
  },
  {
    section: "Gestão das Bancas",
    items: [
      { label: "Cadastros", href: "/admin/gestao/bancas/cadastros", icon: "🗂️" },
    ]
  },
  {
    section: "Negócio",
    items: [
      { label: "Bancas", href: "/admin/gestao/bancas/cadastros", icon: "🏪" },
      { label: "Jornaleiros", href: "/admin/jornaleiros", icon: "👥" },
      { label: "Usuários", href: "/admin/users", icon: "👤" },
      { label: "Pedidos", href: "/admin/orders", icon: "📋" },
    ]
  },
  {
    section: "Catálogo",
    items: [
      { label: "Produtos", href: "/admin/products", icon: "📦" },
      { label: "Categorias", href: "/admin/cms/categories", icon: "🏷️" },
      { label: "Distribuidores", href: "/admin/distribuidores", icon: "🚚" },
    ]
  },
  {
    section: "Marketing",
    items: [
      { label: "Campanhas", href: "/admin/campaigns", icon: "📢" },
      { label: "Cupons", href: "/admin/coupons", icon: "🎫" },
      { label: "Banners", href: "/admin/banners", icon: "🖼️" },
      { label: "Vitrines", href: "/admin/cms/vitrines", icon: "⭐" },
      { label: "Mini Banners", href: "/admin/cms/mini-banners", icon: "🧩" },
      { label: "Banner Jornaleiro", href: "/admin/cms/vendor-banner", icon: "📰" },
      { label: "Newsletter", href: "/admin/newsletter", icon: "📧" },
    ]
  },
  {
    section: "Relatórios",
    items: [
      { label: "Financeiro", href: "/admin/financial", icon: "💰" },
      { label: "Analytics", href: "/admin/analytics", icon: "📈" },
      { label: "Auditoria", href: "/admin/audit", icon: "🧾" },
    ]
  },
  {
    section: "Conteúdo",
    items: [
      { label: "Academy", href: "/admin/academy", icon: "🎓" },
    ]
  },
  {
    section: "Configurações",
    items: [
      { label: "Plataforma", href: "/admin/settings", icon: "⚙️" },
      { label: "WhatsApp", href: "/admin/configuracoes/whatsapp", icon: "📱" },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [branding, setBranding] = useState<{ logoUrl?: string; logoAlt?: string } | null>(null);

  // Carregar branding
  useEffect(() => {
    const loadBranding = async () => {
      try {
        const response = await fetch('/api/admin/branding');
        const result = await response.json();
        if (result.success && result.data) {
          setBranding(result.data);
        }
      } catch (error) {
        console.error('Erro ao carregar branding:', error);
      }
    };
    loadBranding();
  }, []);

  useEffect(() => {
    // Verificar autenticação admin apenas se não estiver na página de login
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    try {
      const auth = localStorage.getItem("gb:adminAuth");
      const userData = localStorage.getItem("gb:admin");
      
      if (auth !== "1" || !userData) {
        router.replace("/admin/login");
        return;
      }
      
      setUser(JSON.parse(userData));
      setLoading(false);
    } catch {
      router.replace("/admin/login");
    }
  }, [router, pathname]);

  const logout = () => {
    try {
      localStorage.removeItem("gb:adminAuth");
      localStorage.removeItem("gb:admin");
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
            
            <Link href="/admin/dashboard" className="flex items-center gap-2">
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
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
          <div className="h-full overflow-y-auto">
            <nav className="p-4 space-y-6">
              {ADMIN_MENU.map((section) => (
                <div key={section.section}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href as Route}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'bg-[#fff7f2] text-[#ff5c00] border-r-2 border-[#ff5c00]'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
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
