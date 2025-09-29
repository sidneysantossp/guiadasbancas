"use client";

import { useState } from "react";
import Link from "next/link";

type Distribuidor = {
  id: string;
  nome: string;
  url: string;
  descricao: string;
  logo?: string;
  cor: string;
};

const DISTRIBUIDORES: Distribuidor[] = [
  {
    id: "panini",
    nome: "Panini Brasil Ltda",
    url: "https://brancaleonepublicacoes.meuspedidos.com.br/",
    descricao: "Revistas, gibis, cards colecionáveis e produtos licenciados",
    cor: "bg-blue-600"
  },
  {
    id: "branca-leone",
    nome: "Branca Leone Publicações",
    url: "https://jornaleiro.meuspedidos.com.br/",
    descricao: "Jornais, revistas e publicações especializadas",
    cor: "bg-green-600"
  }
];

export default function DistribuidoresPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Distribuidores</h1>
        <p className="text-gray-600 mt-1">
          Acesse os catálogos dos distribuidores para fazer seus pedidos e orçamentos
        </p>
      </div>

      {/* Cards dos Distribuidores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DISTRIBUIDORES.map((distribuidor) => (
          <div
            key={distribuidor.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Header do Card */}
            <div className={`${distribuidor.cor} px-6 py-4`}>
              <h3 className="text-lg font-semibold text-white">
                {distribuidor.nome}
              </h3>
            </div>

            {/* Conteúdo do Card */}
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4">
                {distribuidor.descricao}
              </p>

              <div className="space-y-3">
                {/* URL do Catálogo */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="truncate">{distribuidor.url}</span>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/jornaleiro/distribuidores/${distribuidor.id}`}
                    className={`flex-1 ${distribuidor.cor} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity text-center`}
                  >
                    Acessar Catálogo
                  </Link>
                  
                  <a
                    href={distribuidor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    title="Abrir em nova aba"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer com informações adicionais */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Catálogo online disponível</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ativo</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Como fazer pedidos
            </h4>
            <p className="text-sm text-blue-700">
              Clique em "Acessar Catálogo" para navegar no site do distribuidor integrado à plataforma, 
              ou use o botão de link externo para abrir em uma nova aba. Seus pedidos serão processados 
              diretamente com o distribuidor selecionado.
            </p>
          </div>
        </div>
      </div>

      {/* Estatísticas (placeholder para futuras implementações) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">2</div>
          <div className="text-sm text-gray-600">Distribuidores Ativos</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-600">Pedidos Este Mês</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-600">Valor Total Pedidos</div>
        </div>
      </div>
    </div>
  );
}
