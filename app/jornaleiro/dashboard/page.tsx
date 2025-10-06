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
      console.log('[Dashboard] Buscando banca para user_id:', user!.id);
      
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
      
      console.log('[Dashboard] Banca encontrada:', bancaData);
      setBanca(bancaData);
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar banca:', error);
    }
  };

  useEffect(() => {
    if (user && banca) {
      loadMetrics();
    }
  }, [user, banca]);

  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      console.log('[Dashboard] Carregando métricas via API...');
      
      // Buscar pedidos via API (já filtra pela banca automaticamente)
      const ordersRes = await fetch('/api/orders?limit=1000');
      const ordersData = await ordersRes.json();
      const orders = ordersData.items || [];
      
      console.log('[Dashboard] Pedidos encontrados:', orders.length);

      // Buscar produtos via API (já filtra pela banca automaticamente)
      const productsRes = await fetch('/api/products?limit=1000');
      const productsData = await productsRes.json();
      const products = productsData.items || productsData.products || [];
      
      console.log('[Dashboard] Produtos encontrados:', products.length);

      // Calcular data de hoje no timezone local
      const hoje = new Date();
      const hojeStart = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
      
      console.log('[Dashboard] Data de hoje:', hojeStart.toISOString());
      
      const pedidosHoje = orders.filter((o: any) => {
        const orderDate = new Date(o.created_at);
        return orderDate >= hojeStart;
      });

      console.log('[Dashboard] Pedidos hoje:', pedidosHoje.length);

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
      
      console.log('[Dashboard] Produtos ativos:', produtosAtivos, 'de', products.length);

      console.log('[Dashboard] Métricas calculadas:', {
        pedidosHoje: pedidosHoje.length,
        faturamentoHoje,
        pedidosPendentes,
        produtosAtivos
      });

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

      {/* Performance por Período - Gráfico de Barras */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Performance por Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hoje */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-blue-600">Hoje</div>
            <div className="text-3xl font-bold text-blue-700">{loadingMetrics ? "--" : performanceData.hoje.pedidos}</div>
            <div className="text-sm text-gray-500">R$ {loadingMetrics ? "0.00" : performanceData.hoje.receita.toFixed(2)}</div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${performanceData.mes.pedidos > 0 
                    ? Math.min((performanceData.hoje.pedidos / performanceData.mes.pedidos) * 100, 100) 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Últimos 7 dias */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-purple-600">Últimos 7 dias</div>
            <div className="text-3xl font-bold text-purple-700">{loadingMetrics ? "--" : performanceData.semana.pedidos}</div>
            <div className="text-sm text-gray-500">R$ {loadingMetrics ? "0.00" : performanceData.semana.receita.toFixed(2)}</div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${performanceData.mes.pedidos > 0 
                    ? Math.min((performanceData.semana.pedidos / performanceData.mes.pedidos) * 100, 100) 
                    : 0}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Últimos 30 dias */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-green-600">Últimos 30 dias</div>
            <div className="text-3xl font-bold text-green-700">{loadingMetrics ? "--" : performanceData.mes.pedidos}</div>
            <div className="text-sm text-gray-500">R$ {loadingMetrics ? "0.00" : performanceData.mes.receita.toFixed(2)}</div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: '100%' }}
              ></div>
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
              <div key={order.id} className="flex items-center rounded-lg border border-gray-100 px-3 py-2">
                <div className="text-gray-900 font-medium mr-3">#{order.id}</div>
                <div className="truncate text-gray-600">{order.customer_name || order.customer}</div>
                <div className="ml-auto flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'novo' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'confirmado' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'em_preparo' ? 'bg-orange-100 text-orange-700' :
                    order.status === 'entregue' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-gray-500">R$ {Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
