"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase";

export default function JornaleiroDashboardPage() {
  const { user, profile } = useAuth();
  const [banca, setBanca] = useState<any>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metrics, setMetrics] = useState({
    pedidosHoje: 0,
    faturamentoHoje: 0,
    pedidosPendentes: 0,
    produtosAtivos: 0,
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
      
      // Buscar pedidos e produtos em PARALELO com cache
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders?limit=50', { 
          next: { revalidate: 30 } // Cache por 30 segundos
        }),
        fetch('/api/products?limit=50', { 
          next: { revalidate: 60 } // Cache por 60 segundos
        })
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

  // Memoizar cálculos pesados
  const memoizedMetrics = useMemo(() => metrics, [metrics]);
  const memoizedRecentOrders = useMemo(() => recentOrders, [recentOrders]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : memoizedMetrics.pedidosHoje}
          </div>
          <div className="mt-1 text-xs text-gray-400">Total de pedidos recebidos nas últimas horas</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Faturamento hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : `R$ ${memoizedMetrics.faturamentoHoje.toFixed(2)}`}
          </div>
          <div className="mt-1 text-xs text-gray-400">Somatório dos pedidos do dia</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos pendentes</div>
          <div className={`mt-1 text-3xl font-semibold ${memoizedMetrics.pedidosPendentes > 0 ? "text-orange-600" : "text-gray-900"}`}>
            {loadingMetrics ? "--" : memoizedMetrics.pedidosPendentes}
          </div>
          <div className="mt-1 text-xs text-gray-400">Novos, confirmados e em preparo</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-gray-500">Produtos ativos</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : memoizedMetrics.produtosAtivos}
          </div>
          <div className="mt-1 text-xs text-gray-400">Itens visíveis na vitrine</div>
        </div>
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
        ) : memoizedRecentOrders.length === 0 ? (
          <div className="text-sm text-gray-500">Nenhum pedido encontrado.</div>
        ) : (
          <div className="space-y-3 text-sm">
            {memoizedRecentOrders.map((order) => (
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
