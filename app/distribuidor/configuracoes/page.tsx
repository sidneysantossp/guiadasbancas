"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconSettings,
  IconPlugConnected,
  IconPercentage,
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconMapPin,
  IconChevronRight,
} from "@tabler/icons-react";

export default function ConfiguracoesPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

  const menuItems = [
    {
      title: "Integração Mercos",
      description: "Configurar conexão com a API Mercos e sincronização de produtos",
      href: "/distribuidor/configuracoes/integracao",
      icon: IconPlugConnected,
      color: "blue",
    },
    {
      title: "Markup de Preços",
      description: "Definir margens de lucro por categoria ou produto",
      href: "/distribuidor/configuracoes/markup",
      icon: IconPercentage,
      color: "green",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <IconSettings className="h-7 w-7" />
          Configurações
        </h1>
        <p className="text-gray-600 mt-1">Gerencie as configurações da sua conta de distribuidor</p>
      </div>

      {/* Informações da Conta */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <IconBuilding className="h-5 w-5 text-gray-600" />
          Informações da Conta
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {distribuidor?.nome?.charAt(0)?.toUpperCase() || 'D'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{distribuidor?.nome || 'Carregando...'}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <IconMail className="h-4 w-4" />
                {distribuidor?.email || 'email@distribuidor.com'}
              </div>
              {distribuidor?.telefone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <IconPhone className="h-4 w-4" />
                  {distribuidor.telefone}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`text-sm font-medium ${distribuidor?.ativo !== false ? 'text-green-600' : 'text-red-600'}`}>
                {distribuidor?.ativo !== false ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Plano</span>
              <span className="text-sm font-medium text-gray-900">Premium</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Integração</span>
              <span className="text-sm font-medium text-gray-900">Mercos API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu de Configurações */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Opções de Configuração</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  item.color === 'blue' ? 'bg-blue-100' : 
                  item.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <item.icon className={`h-6 w-6 ${
                    item.color === 'blue' ? 'text-blue-600' : 
                    item.color === 'green' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
              <IconChevronRight className="h-5 w-5 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconUser className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Precisa de ajuda?</h3>
            <p className="text-sm text-blue-700 mt-1">
              Entre em contato com nosso suporte para alterar informações da conta ou resolver problemas técnicos.
            </p>
            <a 
              href="mailto:suporte@guiadasbancas.com.br" 
              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 mt-2"
            >
              <IconMail className="h-4 w-4" />
              suporte@guiadasbancas.com.br
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
