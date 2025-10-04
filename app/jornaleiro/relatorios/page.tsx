"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalCampanhas: 0,
    produtosAtivos: 0,
    campanhasAtivas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const load = async () => {
      try {
        // Buscar estatísticas reais
        const [prodRes, campRes] = await Promise.all([
          fetch('/api/jornaleiro/products'),
          fetch('/api/jornaleiro/campaigns'),
        ]);

        const prodData = await prodRes.json();
        const campData = await campRes.json();

        const produtos = prodData.items || [];
        const campanhas = campData.data || [];

        setStats({
          totalProdutos: produtos.length,
          totalCampanhas: campanhas.length,
          produtosAtivos: produtos.filter((p: any) => p.active).length,
          campanhasAtivas: campanhas.filter((c: any) => c.status === 'active').length,
        });
      } catch (e) {
        console.error('Erro ao carregar estatísticas:', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Relatórios</h1>
        <p className="text-sm text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Relatórios</h1>
        <p className="text-sm text-gray-600">
          Acompanhe o desempenho da sua banca.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProdutos}</p>
            </div>
            <i className="fa-solid fa-box text-3xl text-blue-500"></i>
          </div>
          <p className="mt-2 text-xs text-gray-500">{stats.produtosAtivos} ativos</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Campanhas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCampanhas}</p>
            </div>
            <i className="fa-solid fa-bullhorn text-3xl text-orange-500"></i>
          </div>
          <p className="mt-2 text-xs text-gray-500">{stats.campanhasAtivas} ativas</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produtos Ativos</p>
              <p className="text-2xl font-bold text-green-600">{stats.produtosAtivos}</p>
            </div>
            <i className="fa-solid fa-check-circle text-3xl text-green-500"></i>
          </div>
          <p className="mt-2 text-xs text-gray-500">Disponíveis para venda</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Campanhas Ativas</p>
              <p className="text-2xl font-bold text-purple-600">{stats.campanhasAtivas}</p>
            </div>
            <i className="fa-solid fa-rocket text-3xl text-purple-500"></i>
          </div>
          <p className="mt-2 text-xs text-gray-500">Em andamento</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Resumo da Banca</h2>
        <p className="text-sm text-gray-600 mb-4">
          Você tem {stats.totalProdutos} produtos cadastrados, sendo {stats.produtosAtivos} disponíveis para venda.
        </p>
        <p className="text-sm text-gray-600">
          Suas campanhas promocionais estão {stats.campanhasAtivas > 0 ? 'ativas e divulgando seus produtos' : 'aguardando configuração'}.
        </p>
      </div>
    </div>
  );
}
