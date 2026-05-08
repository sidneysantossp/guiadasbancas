"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { Route } from "next";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function JornaleiroDashboardPage() {
  const searchParams = useSearchParams();
  const { user, isJornaleiro } = useAuth();
  const [banca, setBanca] = useState<any>(null);
  const [loadingBanca, setLoadingBanca] = useState(true);
  const [bancaLoadMessage, setBancaLoadMessage] = useState("Carregando o painel da sua banca...");
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metrics, setMetrics] = useState({
    pedidosHoje: 0,
    faturamentoHoje: 0,
    pedidosPendentes: 0,
    produtosAtivos: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user && isJornaleiro) {
      loadBancaData();
    }
  }, [user, isJornaleiro]);

  const loadBancaData = async () => {
    const isWelcomeFlow = searchParams?.get("welcome") === "1";
    const retryDelays = isWelcomeFlow ? [600, 1200, 1800, 2500] : [0];

    try {
      setLoadingBanca(true);

      for (let attempt = 0; attempt < retryDelays.length; attempt += 1) {
        if (attempt > 0) {
          setBancaLoadMessage("Estamos finalizando a vinculação da sua banca ao painel...");
          await new Promise((resolve) => setTimeout(resolve, retryDelays[attempt]));
        }

        const res = await fetch(`/api/jornaleiro/banca?ts=${Date.now()}`, {
          cache: "no-store",
          credentials: "include",
        });
        const text = await res.text();
        const json = text ? JSON.parse(text) : null;

        if (res.ok && json?.success && json?.data) {
          setBanca(json.data);
          setBancaLoadMessage("Carregando o painel da sua banca...");
          return;
        }

        if (attempt === retryDelays.length - 1) {
          throw new Error(json?.error || `HTTP ${res.status}`);
        }
      }
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar banca:', error);
      setBanca(null);
    } finally {
      setLoadingBanca(false);
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
      
      // Buscar stats e pedidos recentes em paralelo
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/jornaleiro/stats', { 
          cache: 'no-store',
          credentials: 'include'
        }),
        fetch('/api/orders?limit=5', { 
          cache: 'no-store',
          credentials: 'include'
        }),
      ]);
      
      const statsJson = await statsRes.json();
      const ordersJson = await ordersRes.json();
      
      console.log('[Dashboard] 📊 Stats:', statsJson);
      
      if (statsJson.success && statsJson.data) {
        const stats = statsJson.data;
        setMetrics({
          pedidosHoje: stats.pedidosHoje || 0,
          faturamentoHoje: stats.faturamentoHoje || 0,
          pedidosPendentes: stats.pedidosPendentes || 0,
          produtosAtivos: stats.produtosAtivos || 0,
        });
      }
      
      const orders = ordersJson.items || [];
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('[Dashboard] Erro ao carregar métricas:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const isWelcomeFlow = searchParams?.get("welcome") === "1";

  // Memoizar cálculos pesados
  const memoizedMetrics = useMemo(() => metrics, [metrics]);
  const memoizedRecentOrders = useMemo(() => recentOrders, [recentOrders]);

  // Sem banca vinculada, orientar o jornaleiro para iniciar o cadastro.
  if (!loadingBanca && !banca) {
    if (isWelcomeFlow) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Estamos finalizando a ativação da sua banca</h1>
            <p className="text-gray-600 mb-6">
              Seu cadastro foi concluído e a sua banca está sendo vinculada ao painel. Recarregue em alguns instantes se esta tela persistir.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => loadBancaData()}
                className="inline-flex items-center bg-[#ff5c00] text-white px-6 py-3 rounded-md hover:opacity-90 font-semibold"
              >
                Atualizar painel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma banca vinculada</h1>
          <p className="text-gray-600 mb-6">
            Este perfil ainda não tem uma banca principal configurada. Cadastre a banca para liberar o painel operacional e iniciar a publicação.
          </p>
          <Link
            href="/jornaleiro/banca-v2"
            className="inline-block bg-[#ff5c00] text-white px-6 py-3 rounded-md hover:opacity-90 font-semibold"
          >
            Cadastrar banca
          </Link>
        </div>
      </div>
    );
  }

  if (loadingBanca) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#ff5c00]" />
          <p className="mt-4 text-sm text-gray-600">{bancaLoadMessage}</p>
        </div>
      </div>
    );
  }

  const partnerLinked = banca?.partner_linked === true || banca?.is_cotista === true;
  const needsTpuAlert = banca && !partnerLinked && !banca.tpu_url;

  return (
    <div className="space-y-4 overflow-x-hidden px-3 sm:px-0 max-w-full">
      {/* Alerta de documento operacional da banca */}
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
                📄 Documento da banca pendente
              </div>
              <p className="text-sm text-amber-800 mb-4">
                <strong>Seu cadastro só será liberado após o envio do documento operacional da banca (TPU).</strong>
                <br />
                Esse arquivo é obrigatório para concluir a ativação.
              </p>
              <div>
                <Link
                  href="/jornaleiro/banca-v2"
                  className="inline-flex items-center justify-center px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Enviar documento da banca
                </Link>
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
            {banca?.entitlements?.can_access_distributor_catalog ? 'Próprios + catálogo parceiro' : 'Itens visíveis na vitrine'}
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
