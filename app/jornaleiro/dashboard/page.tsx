"use client";

export const dynamic = "force-dynamic";

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
      
      console.log('[Dashboard] 🏪 Banca carregada:', bancaData);
      console.log('[Dashboard] 👥 is_cotista:', bancaData?.is_cotista);
      console.log('[Dashboard] 📄 tpu_url:', bancaData?.tpu_url);
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
      
      // Buscar pedidos, produtos próprios e catálogo do distribuidor em PARALELO
      const fetchPromises: Promise<Response>[] = [
        fetch('/api/orders?limit=50', { 
          cache: 'no-store',
          credentials: 'include'
        }),
        fetch('/api/products?limit=50', { 
          cache: 'no-store',
          credentials: 'include'
        }),
      ];
      
      // Se for cotista, buscar também produtos do distribuidor
      if (banca?.is_cotista) {
        fetchPromises.push(
          fetch('/api/jornaleiro/catalogo-distribuidor', { 
            cache: 'no-store',
            credentials: 'include'
          })
        );
      }
      
      const responses = await Promise.all(fetchPromises);
      const [ordersData, productsData, catalogoData] = await Promise.all(
        responses.map(async (r) => {
          const text = await r.text();
          try {
            return JSON.parse(text);
          } catch (parseErr) {
            console.error('[Dashboard] ❌ Resposta inválida ao carregar métricas:', text);
            return {};
          }
        })
      );
      
      const orders = ordersData.items || [];
      const products = productsData.items || productsData.products || [];
      
      // Produtos do catálogo do distribuidor (se cotista)
      const catalogoProdutos = catalogoData?.data || catalogoData?.products || [];

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
      
      // Produtos próprios ativos: visíveis e com estoque (se rastrear)
      const produtosProprios = products.filter((p: any) => {
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
      
      // Produtos do distribuidor ativos (já vem filtrados pela API)
      const produtosDistribuidor = catalogoProdutos.length;
      
      // Total de produtos ativos = próprios + distribuidor
      const produtosAtivos = produtosProprios + produtosDistribuidor;
      
      console.log('[Dashboard] 📊 Produtos próprios:', produtosProprios);
      console.log('[Dashboard] 📊 Produtos distribuidor:', produtosDistribuidor);
      console.log('[Dashboard] 📊 Total produtos ativos:', produtosAtivos);

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

  // Se não tem banca, mostrar CTA para cadastrar
  if (!banca && !loadingMetrics) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastre sua Banca</h1>
          <p className="text-gray-600 mb-6">
            Para começar a vender, você precisa cadastrar sua banca com informações como nome, endereço e horário de funcionamento.
          </p>
          <Link
            href="/jornaleiro/banca-v2"
            className="inline-block bg-[#ff5c00] text-white px-6 py-3 rounded-md hover:opacity-90 font-semibold"
          >
            Cadastrar Minha Banca
          </Link>
        </div>
      </div>
    );
  }

  // Verificar se precisa mostrar alerta de TPU
  const needsTpuAlert = banca && !banca.is_cotista && !banca.tpu_url;
  
  console.log('[Dashboard] 🚨 Verificação do alerta TPU:', {
    banca_exists: !!banca,
    is_cotista: banca?.is_cotista,
    is_cotista_type: typeof banca?.is_cotista,
    not_is_cotista: !banca?.is_cotista,
    tpu_url: banca?.tpu_url,
    not_tpu_url: !banca?.tpu_url,
    needsTpuAlert
  });

  return (
    <div className="space-y-4 overflow-x-hidden px-3 sm:px-0 max-w-full">
      {/* Alerta TPU para não-cotistas sem documento */}
      {needsTpuAlert && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>  
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-semibold text-amber-900 mb-2">
                📄 Documento Pendente
              </div>
              <p className="text-sm text-amber-800 mb-4">
                <strong>Seu cadastro da banca só será liberado após o envio do Termo de Permissão de Uso (TPU).</strong>
                <br />
                Este documento é obrigatório para não-cotistas e garante que você tem autorização para vender na localização informada.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/jornaleiro/banca-v2"
                  className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Enviar TPU na Minha Banca
                </Link>
                <a
                  href="https://example.com/modelo-tpu.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-amber-700 text-sm font-medium rounded-lg border border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar Modelo TPU
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 justify-items-center sm:justify-items-stretch max-w-full">
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : memoizedMetrics.pedidosHoje}
          </div>
          <div className="mt-1 text-xs text-gray-400">Total de pedidos recebidos nas últimas horas</div>
        </div>
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Faturamento hoje</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : `R$ ${memoizedMetrics.faturamentoHoje.toFixed(2)}`}
          </div>
          <div className="mt-1 text-xs text-gray-400">Somatório dos pedidos do dia</div>
        </div>
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Pedidos pendentes</div>
          <div className={`mt-1 text-3xl font-semibold ${memoizedMetrics.pedidosPendentes > 0 ? "text-orange-600" : "text-gray-900"}`}>
            {loadingMetrics ? "--" : memoizedMetrics.pedidosPendentes}
          </div>
          <div className="mt-1 text-xs text-gray-400">Novos, confirmados e em preparo</div>
        </div>
        <div className="w-full max-w-sm sm:max-w-none min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-sm text-gray-500">Produtos ativos</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {loadingMetrics ? "--" : memoizedMetrics.produtosAtivos}
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {banca?.is_cotista ? 'Próprios + catálogo do distribuidor' : 'Itens visíveis na vitrine'}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm overflow-x-auto max-w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Pedidos recentes</h2>
            <p className="text-sm text-gray-600">Acompanhe os últimos pedidos recebidos.</p>
          </div>
          <Link href={("/jornaleiro/pedidos" as Route)} className="text-[#ff5c00] text-sm font-medium">Ver todos</Link>
        </div>
        {loadingMetrics ? (
          <div className="text-sm text-gray-500">Carregando pedidos...</div>
        ) : memoizedRecentOrders.length === 0 ? (
          <div className="text-sm text-gray-500">Nenhum pedido encontrado.</div>
        ) : (
          <div className="space-y-3 text-sm min-w-0">
            {memoizedRecentOrders.map((order) => (
              <div key={order.id} className="flex items-center rounded-lg border border-gray-100 px-3 py-2 hover:bg-gray-50 transition-colors min-w-0 max-w-full">
                <div className="truncate text-gray-900 font-medium flex-1 min-w-0">{order.customer_name || order.customer}</div>
                <div className="ml-auto flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
