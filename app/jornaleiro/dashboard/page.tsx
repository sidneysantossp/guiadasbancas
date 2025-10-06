"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import OrdersMetrics from "@/components/admin/OrdersMetrics";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";

export default function JornaleiroDashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [banca, setBanca] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metrics, setMetrics] = useState({
    pedidosHoje: 0,
    faturamentoHoje: 0,
    pedidosPendentes: 0,
    produtosAtivos: 0,
  });
  const [performanceData, setPerformanceData] = useState({
    hoje: { pedidos: 0, receita: 0 },
    semana: { pedidos: 0, receita: 0 },
    mes: { pedidos: 0, receita: 0 },
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user && profile?.role === 'jornaleiro') {
      loadBancaData();
    }
  }, [user, profile]);

  const loadBancaData = async () => {
    try {
      // Buscar banca do jornaleiro
      const { data: bancaData, error } = await supabase
        .from('bancas')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      if (error) {
        console.error('[Dashboard] Erro ao buscar banca:', error);
        return;
      }
      
      setBanca(bancaData);
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar banca:', error);
    }
  };

  useEffect(() => {
    if (user && banca?.id) {
      loadMetrics();
    }
  }, [user?.id, banca?.id]);

  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      
      // Buscar pedidos e produtos em PARALELO para melhorar performance
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders?limit=200'),
        fetch('/api/products?limit=100')
      ]);
      
      const [ordersData, productsData] = await Promise.all([
        ordersRes.json(),
        productsRes.json()
      ]);
      
      const orders = ordersData.items || [];
      const products = productsData.items || productsData.products || [];

      // Calcular data de hoje no timezone local
      const hoje = new Date();
      const hojeStart = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      
      const pedidosHoje = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= hojeStart;
      });

      const faturamentoHoje = pedidosHoje.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);
      const pedidosPendentes = orders.filter((o: any) => 
        !['entregue', 'cancelado'].includes(o.status)
      ).length;
      
      // Calcular últimos 7 e 30 dias
      const semanaAgo = new Date(hojeStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      const mesAgo = new Date(hojeStart.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const pedidosSemana = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= semanaAgo;
      });
      
      const pedidosMes = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= mesAgo;
      });
      
      const faturamentoSemana = pedidosSemana.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);
      const faturamentoMes = pedidosMes.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);
      
      // Produtos ativos: visíveis e com estoque (se rastrear)
      const produtosAtivos = products.filter((p: any) => {
        // Se o produto está oculto/inativo, não conta
        if (p.is_hidden || p.status === 'inactive') {
          return false;
        }
        
        // Se rastreia estoque, precisa ter estoque disponível
        if (p.track_stock) {
          return (p.stock_qty || 0) > 0;
        }
        
        // Se não rastreia estoque, está ativo
        return true;
      }).length;

      setMetrics({
        pedidosHoje: pedidosHoje.length,
        faturamentoHoje,
        pedidosPendentes,
        produtosAtivos,
      });
      
      setPerformanceData({
        hoje: { pedidos: pedidosHoje.length, receita: faturamentoHoje },
        semana: { pedidos: pedidosSemana.length, receita: faturamentoSemana },
        mes: { pedidos: pedidosMes.length, receita: faturamentoMes },
      });
      
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar métricas:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const sellerName = profile?.full_name || user?.email?.split('@')[0] || 'Jornaleiro';
  const sellerEmail = user?.email || '';
  const sellerPhone = profile?.phone || '';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : metrics.pedidosHoje}
          </div>
          <div className="mt-1 text-xs text-gray-400">Total de pedidos recebidos nas últimas horas</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Faturamento hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : `R$ ${metrics.faturamentoHoje.toFixed(2)}`}
          </div>
          <div className="mt-1 text-xs text-gray-400">Somatório dos pedidos do dia</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos pendentes</div>
          <div className={`mt-1 text-3xl font-semibold ${metrics.pedidosPendentes > 0 ? "text-orange-600" : "text-gray-900"}`}>
            {loadingMetrics ? "--" : metrics.pedidosPendentes}
          </div>
          <div className="mt-1 text-xs text-gray-400">Novos, confirmados e em preparo</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Produtos ativos</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : metrics.produtosAtivos}
          </div>
          <div className="mt-1 text-xs text-gray-400">Itens visíveis na vitrine</div>
        </div>
      </div>

      {/* Performance por Período - Gráfico de Barras Vertical */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Performance por Período</h2>
        
        <div className="flex items-end justify-around gap-8 h-64 px-4">
          {/* Hoje */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-sm font-medium text-blue-600 mb-2">{loadingMetrics ? "--" : performanceData.hoje.pedidos}</div>
            <div className="w-full flex flex-col justify-end items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-500 flex items-start justify-center pt-2"
                style={{ 
                  height: `${performanceData.mes.pedidos > 0 
                    ? Math.max((performanceData.hoje.pedidos / performanceData.mes.pedidos) * 100, 5) 
                    : 5}%` 
                }}
              >
                <span className="text-xs text-white font-semibold">{loadingMetrics ? "" : performanceData.hoje.pedidos}</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-700">Hoje</div>
              <div className="text-xs text-gray-500">R$ {loadingMetrics ? "0.00" : performanceData.hoje.receita.toFixed(2)}</div>
            </div>
          </div>

          {/* Últimos 7 dias */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-sm font-medium text-purple-600 mb-2">{loadingMetrics ? "--" : performanceData.semana.pedidos}</div>
            <div className="w-full flex flex-col justify-end items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500 flex items-start justify-center pt-2"
                style={{ 
                  height: `${performanceData.mes.pedidos > 0 
                    ? Math.max((performanceData.semana.pedidos / performanceData.mes.pedidos) * 100, 5) 
                    : 5}%` 
                }}
              >
                <span className="text-xs text-white font-semibold">{loadingMetrics ? "" : performanceData.semana.pedidos}</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-700">Últimos 7 dias</div>
              <div className="text-xs text-gray-500">R$ {loadingMetrics ? "0.00" : performanceData.semana.receita.toFixed(2)}</div>
            </div>
          </div>

          {/* Últimos 30 dias */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-sm font-medium text-green-600 mb-2">{loadingMetrics ? "--" : performanceData.mes.pedidos}</div>
            <div className="w-full flex flex-col justify-end items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 flex items-start justify-center pt-2"
                style={{ height: '100%' }}
              >
                <span className="text-xs text-white font-semibold">{loadingMetrics ? "" : performanceData.mes.pedidos}</span>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium text-gray-700">Últimos 30 dias</div>
              <div className="text-xs text-gray-500">R$ {loadingMetrics ? "0.00" : performanceData.mes.receita.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Detalhadas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Métricas de Vendas</h2>
            <p className="text-sm text-gray-600">Acompanhe o desempenho detalhado dos seus pedidos.</p>
          </div>
          <Link href={"/jornaleiro/pedidos" as Route} className="text-[#ff5c00] text-sm font-medium">Gerenciar pedidos</Link>
        </div>
        <OrdersMetrics />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Pedidos recentes</h2>
            <p className="text-sm text-gray-600">Acompanhe os últimos pedidos recebidos.</p>
          </div>
          <Link href={"/jornaleiro/pedidos" as Route} className="text-[#ff5c00] text-sm font-medium">Ver todos</Link>
        </div>
        {loadingMetrics ? (
          <div className="text-sm text-gray-500">Carregando pedidos...</div>
        ) : recentOrders.length === 0 ? (
          <div className="text-sm text-gray-500">Nenhum pedido encontrado.</div>
        ) : (
          <div className="space-y-3 text-sm">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50 transition-colors">
                <div className="text-gray-900 font-medium mr-3">#{order.id}</div>
                <div className="truncate text-gray-600">{order.customer_name || order.customer}</div>
                <div className="ml-auto flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'novo' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'em_preparo' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'entregue' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-gray-500 min-w-[70px] text-right">R$ {Number(order.total || 0).toFixed(2)}</span>
                  <Link 
                    href={`/jornaleiro/pedidos/${order.id}` as Route}
                    className="p-1.5 text-gray-400 hover:text-[#ff5c00] hover:bg-orange-50 rounded-md transition-colors"
                    title="Ver detalhes"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
