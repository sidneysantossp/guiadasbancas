"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
        // Buscar estatísticas reais (com stats=true para obter contagem total real)
        const [prodRes, campRes, bancaRes] = await Promise.all([
          fetch('/api/jornaleiro/products?stats=true'),
          fetch('/api/jornaleiro/campaigns'),
          fetch('/api/jornaleiro/banca'),
        ]);

        const prodData = await prodRes.json();
        const campData = await campRes.json();
        const bancaData = await bancaRes.json();

        const campanhas = campData.data || [];
        
        // Usar totalReal que inclui todos os produtos de distribuidores para cotistas
        const totalProdutos = prodData.totalReal || prodData.total || 0;
        const produtosAtivos = totalProdutos; // Se é cotista, todos os de distribuidor estão ativos

        setStats({
          totalProdutos: totalProdutos,
          totalCampanhas: campanhas.length,
          produtosAtivos: produtosAtivos,
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

      {/* Card Analytics */}
      <Link href="/jornaleiro/relatorios/analytics">
        <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100 p-6 hover:shadow-lg transition-all cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <i className="fa-solid fa-chart-line text-2xl text-orange-600"></i>
                <h3 className="text-lg font-bold text-orange-900">Analytics de Acessos</h3>
              </div>
              <p className="text-sm text-orange-700">
                Visualize gráficos de visitas, cliques em produtos, adições ao carrinho, 
                cliques no WhatsApp e pedidos finalizados.
              </p>
            </div>
            <div className="text-orange-600 text-3xl">→</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
