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
      console.log('[Dashboard] Carregando métricas para banca_id:', banca.id);
      
      // Buscar pedidos da banca
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('banca_id', banca.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('[Dashboard] Erro ao buscar pedidos:', ordersError);
      } else {
        console.log('[Dashboard] Pedidos encontrados:', orders?.length || 0);
      }

      // Buscar produtos da banca
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('banca_id', banca.id);

      if (productsError) {
        console.error('[Dashboard] Erro ao buscar produtos:', productsError);
      } else {
        console.log('[Dashboard] Produtos encontrados:', products?.length || 0);
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const pedidosHoje = (orders || []).filter((o: any) => {
        const orderDate = new Date(o.created_at);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === hoje.getTime();
      });

      console.log('[Dashboard] Pedidos hoje:', pedidosHoje.length);

      const faturamentoHoje = pedidosHoje.reduce((acc: number, o: any) => acc + Number(o.total || 0), 0);
      const pedidosPendentes = (orders || []).filter((o: any) => 
        ["novo","confirmado","em_preparo"].includes(o.status)
      ).length;
      const produtosAtivos = (products || []).filter((p: any) => {
        if (p.track_stock) {
          return (p.stock_qty || 0) > 0;
        }
        return true;
      }).length;

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
      setRecentOrders((orders || []).slice(0, 5));
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

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Dashboard do Jornaleiro</h1>
            <p className="mt-1 text-sm text-gray-600">Visão geral da sua banca e pedidos.</p>
          </div>
          <Link href="/jornaleiro/configuracoes" className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">Configurações</Link>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold">Seus dados</div>
            <div className="mt-1 text-sm">
              <div><span className="text-gray-500">Nome:</span> {sellerName}</div>
              <div><span className="text-gray-500">Email:</span> {sellerEmail}</div>
              <div><span className="text-gray-500">WhatsApp:</span> {sellerPhone || '-'}</div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold">Sua banca</div>
            {!banca ? (
              <div className="mt-2 text-sm text-gray-500">Nenhuma banca cadastrada.</div>
            ) : (
              <div className="mt-2 text-sm">
                <div><span className="text-gray-500">Nome:</span> {banca.name}</div>
                <div><span className="text-gray-500">WhatsApp:</span> {banca.whatsapp || '-'}</div>
                <div><span className="text-gray-500">Endereço:</span> {banca.address}</div>
                {banca.approved ? (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-green-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Banca aprovada
                  </div>
                ) : (
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-amber-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    Aguardando aprovação
                  </div>
                )}
              </div>
            )}
            <div className="mt-3">
              <Link href="/jornaleiro/banca" className="inline-block rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-3 py-2 text-xs font-semibold text-white hover:opacity-95">
                {banca ? 'Editar banca' : 'Cadastrar banca'}
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm font-semibold">Atalhos</div>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              <Link href="/" className="underline text-[#ff5c00]">Ver site</Link>
              <Link href="/jornaleiro/produtos" className="underline text-[#ff5c00]">Meus produtos</Link>
              <Link href="/jornaleiro/pedidos" className="underline text-[#ff5c00]">Meus pedidos</Link>
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
