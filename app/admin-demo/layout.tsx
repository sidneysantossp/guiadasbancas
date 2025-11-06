import React from "react";
import Link from "next/link";

export default function AdminDemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-white">
          <div className="h-16 flex items-center px-4 border-b">
            <span className="text-lg font-semibold tracking-tight">Guia das Bancas</span>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            <Link href="/admin-demo" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#ff5c00] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2 4 4L21 4"/></svg>
              <span>Dashboard</span>
            </Link>
            <Link href="/jornaleiro/banca" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#ff5c00] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              <span>Minha Banca</span>
            </Link>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#ff5c00] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
              <span>Pedidos</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#ff5c00] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13V7a2 2 0 0 0-2-2h-5"/><path d="M4 7v10a2 2 0 0 0 2 2h12"/><path d="M12 3v6h6"/></svg>
              <span>Relatórios</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#ff5c00] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15v-3m0 0V9m0 3h3m-3 0H9"/><circle cx="12" cy="12" r="9"/></svg>
              <span>Produtos</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-[#ff5c00] transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15l9-5-9-5-9 5 9 5z"/><path d="M12 15l9-5-9-5-9 5 9 5z" opacity=".2"/><path d="M12 15l9-5-9-5-9 5 9 5z" opacity=".1"/></svg>
              <span>Campanhas</span>
            </a>
          </nav>
          <div className="p-3 border-t text-xs text-gray-500">v0.1.0 • Demo</div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b flex items-center justify-between px-4 gap-3 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button className="md:hidden inline-flex items-center justify-center rounded-md border px-2.5 py-2 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
              <span className="font-medium">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-gray-50">
                <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
                <input placeholder="Buscar..." className="bg-transparent outline-none text-sm" />
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 grid place-items-center text-white text-sm font-semibold">B</div>
            </div>
          </header>

          <main className="p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
