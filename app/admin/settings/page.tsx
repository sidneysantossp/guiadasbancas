"use client";

import { useState } from "react";
import { clearFrontendCaches } from "@/lib/cache";
import {
  IconSettings,
  IconRefresh,
  IconDatabaseExclamation,
  IconLayoutDashboard,
  IconBrandWhatsapp
} from "@tabler/icons-react";

type SettingsTab = "banca" | "platform" | "whatsapp";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("banca");

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IconSettings size={24} className="text-[#ff5c00]" />
            <span>Configurações de Frontend</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            Espaço para configurar tudo que é visual e de experiência do usuário, tanto
            da vitrine das bancas quanto da plataforma como um todo, separado das
            configurações operacionais de cadastro e gestão em /admin/bancas.
          </p>
        </div>
      </header>

      {/* Abas principais */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex flex-wrap gap-4 text-sm" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("banca")}
            className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
              activeTab === "banca"
                ? "border-[#ff5c00] text-[#ff5c00]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <IconLayoutDashboard size={16} />
            <span>Banca</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("platform")}
            className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
              activeTab === "platform"
                ? "border-[#ff5c00] text-[#ff5c00]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <IconLayoutDashboard size={16} />
            <span>Cache</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 font-medium transition-colors ${
              activeTab === "whatsapp"
                ? "border-[#ff5c00] text-[#ff5c00]"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <IconBrandWhatsapp size={16} />
            <span>WhatsApp</span>
          </button>
        </nav>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "banca" && (
        <section className="space-y-4">
          <p className="text-sm text-gray-600 max-w-2xl">
            Nesta aba vamos concentrar tudo que for de frontend das bancas: como a banca
            aparece para o cliente final. Isso fica separado das informações cadastrais e
            operacionais em /admin/bancas.
          </p>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
            <p>
              Em etapas futuras, esta área deve centralizar configurações como:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Layout da vitrine da banca (template, ordem de blocos, destaques);</li>
              <li>Cores, logo e elementos visuais específicos da banca;</li>
              <li>Banners e faixas promocionais próprias da banca;</li>
              <li>Textos institucionais e informações públicas da banca;</li>
              <li>Ajustes de SEO da página pública da banca.</li>
            </ul>
          </div>
        </section>
      )}

      {activeTab === "platform" && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card de Cache & Sincronização */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <IconRefresh size={20} className="text-[#ff5c00]" />
                  <span>Cache &amp; Sincronização</span>
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Ferramentas para lidar com dados antigos em produção que afetam a
                  experiência visual da plataforma. Vamos adicionar aqui ações como limpar
                  cache local de jornaleiros, forçar recarga de dados de bancas e atualizar
                  informações públicas (home, vitrines, branding).
                </p>
              </div>
            </div>

            <div className="mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <IconDatabaseExclamation size={20} className="text-gray-400" />
                <div>
                  <p className="font-medium text-gray-700">Limpeza de cache do frontend</p>
                  <p>
                    Esta ação remove caches em memória e chaves locais com prefixo
                    <code className="mx-1 bg-gray-100 px-1 rounded">gb:</code> (banca,
                    branding, etc.), forçando o recarregamento dos dados na próxima navegação.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearFrontendCaches();
                    if (typeof window !== "undefined") {
                      window.location.reload();
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-md bg-[#ff5c00] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e65300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ff5c00]"
                >
                  Limpar cache agora
                </button>
                <p className="text-xs text-gray-500">
                  Use quando perceber dados de interface desatualizados. Usuários finais não
                  precisam acessar DevTools para isso.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === "whatsapp" && (
        <section className="space-y-4">
          <p className="text-sm text-gray-600 max-w-2xl">
            Nesta aba vamos agrupar tudo que for comunicação via WhatsApp ligada ao
            frontend: botões de contato, mensagens automáticas e status de integração.
          </p>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 text-sm text-gray-500">
            <p>
              Em breve, esta área deve centralizar:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Configurações do WhatsApp (número principal, provedor, templates);</li>
              <li>Status da conexão WhatsApp (como em /admin/whatsapp-connect);</li>
              <li>Preferências de exibição de botões e CTAs de WhatsApp no frontend.</li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
