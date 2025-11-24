"use client";

import { IconSettings, IconRefresh, IconDatabaseExclamation } from "@tabler/icons-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IconSettings size={24} className="text-[#ff5c00]" />
            <span>Configurações da Plataforma</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 max-w-2xl">
            Área central para ajustes avançados da plataforma. Aqui vamos concentrar
            ferramentas de manutenção, cache e sincronização de dados, para evitar
            depender de "limpar cache" manual do navegador ou da Vercel.
          </p>
        </div>
      </header>

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
                Ferramentas para lidar com dados antigos em produção. Vamos adicionar
                aqui ações como limpar cache local de jornaleiros, forçar recarga de dados
                de bancas e atualizar informações públicas (home, vitrines, branding).
              </p>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 flex items-center gap-3">
            <IconDatabaseExclamation size={20} className="text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">Em breve</p>
              <p>
                Esta seção ainda não executa nenhuma ação real. Vamos implementar os
                botões de limpeza de cache e sincronização passo a passo, testando
                primeiro em localhost.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
