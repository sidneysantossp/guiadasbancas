"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDistribuidorAuthHeaders,
  readDistribuidorClientAuth,
} from "@/lib/distribuidor-client-auth";
import {
  IconBox,
  IconClipboardList,
  IconBuildingStore,
  IconTrendingUp,
  IconAlertCircle,
} from "@tabler/icons-react";

interface DistribuidorStats {
  totalProdutos: number;
  produtosAtivos: number;
  totalPedidosHoje: number;
  totalPedidos: number;
  totalBancas: number;
  faturamentoMes: number;
}

export default function DistribuidorDashboardPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DistribuidorStats>({
    totalProdutos: 0,
    produtosAtivos: 0,
    totalPedidosHoje: 0,
    totalPedidos: 0,
    totalBancas: 0,
    faturamentoMes: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { distribuidor: dist } = readDistribuidorClientAuth();
        setDistribuidor(dist);

        if (!dist?.id) {
          setLoading(false);
          return;
        }

        // Buscar estatísticas do distribuidor
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          fetch(`/api/distribuidor/stats?id=${dist.id}`, {
            headers: getDistribuidorAuthHeaders({ distribuidorId: dist.id }),
          }),
          fetch(`/api/distribuidor/orders?id=${dist.id}&limit=5`, {
            headers: getDistribuidorAuthHeaders({ distribuidorId: dist.id }),
          }),
          fetch(`/api/distribuidor/products?id=${dist.id}&limit=10&sort=recent`, {
            headers: getDistribuidorAuthHeaders({ distribuidorId: dist.id }),
          }),
        ]);

        const [statsJson, ordersJson, productsJson] = await Promise.all([
          statsRes.json().catch(() => ({})),
          ordersRes.json().catch(() => ({ items: [] })),
          productsRes.json().catch(() => ({ data: [] })),
        ]);

        if (statsJson.success) {
          setStats(statsJson.data);
        }

        setRecentOrders(Array.isArray(ordersJson?.items) ? ordersJson.items : []);
        setTopProducts(Array.isArray(productsJson?.data) ? productsJson.data : []);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {distribuidor?.nome || 'Distribuidor'}! 👋
          </h1>
          <p className="text-gray-600">Acompanhe os resultados da sua operação</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/distribuidor/produtos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <IconBox size={18} />
            Gerenciar Produtos
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos Ativos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? '...' : stats.produtosAtivos}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                de {stats.totalProdutos} cadastrados
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <IconBox className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos (30 dias)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? '...' : stats.totalPedidos}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPedidosHoje} pedido(s) hoje
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <IconClipboardList className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <Link href="/distribuidor/bancas" className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bancas Parceiras</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? '...' : stats.totalBancas}
              </p>
              <p className="text-xs text-gray-500 mt-1">vendendo seus produtos</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center">
              <IconBuildingStore className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? '...' : formatCurrency(stats.faturamentoMes)}
              </p>
              <p className="text-xs text-gray-500 mt-1">somatório do mês</p>
            </div>
            <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <IconTrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              href="/distribuidor/produtos"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <span className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200">
                <IconBox className="h-5 w-5 text-blue-600" />
              </span>
              <div>
                <div className="font-medium text-gray-900">Gerenciar Produtos</div>
                <div className="text-sm text-gray-600">Editar preços, estoque e informações</div>
              </div>
            </Link>
            
            <Link
              href="/distribuidor/pedidos"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors group"
            >
              <span className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200">
                <IconClipboardList className="h-5 w-5 text-orange-600" />
              </span>
              <div>
                <div className="font-medium text-gray-900">Ver Pedidos</div>
                <div className="text-sm text-gray-600">Acompanhar pedidos das bancas</div>
              </div>
            </Link>

            <Link
              href="/distribuidor/bancas"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors group"
            >
              <span className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200">
                <IconBuildingStore className="h-5 w-5 text-green-600" />
              </span>
              <div>
                <div className="font-medium text-gray-900">Bancas Parceiras</div>
                <div className="text-sm text-gray-600">Ver bancas que vendem seus produtos</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Pedidos recentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Pedidos recentes</h3>
            <Link href="/distribuidor/pedidos" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver todos
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
              <IconAlertCircle className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-700">Nenhum pedido encontrado</p>
              <p className="mt-1 text-sm text-gray-500">
                Assim que uma banca fizer um pedido com seus produtos, ele aparece aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-lg border border-gray-200 px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.banca_name || order.customer || 'Banca'}</p>
                      <p className="text-sm text-gray-500">Pedido #{String(order.id).slice(0, 8)}</p>
                      <p className="text-xs text-gray-500 mt-1">{order.created_at}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(Number(order.total || 0))}</p>
                      <p className="text-xs text-gray-500 capitalize">{order.status || 'novo'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Produtos recentes e informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Produtos recentes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Produtos recentes</h3>
            <Link href="/distribuidor/produtos" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Ver catálogo
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
              <IconBox className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-3 text-sm font-medium text-gray-700">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-gray-500">
                Cadastre produtos ou rode a integração com a Mercos para abastecer seu catálogo.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category || 'Sem categoria'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(Number(product.distribuidor_price || product.price || 0))}</p>
                    <p className="text-xs text-gray-500">Estoque: {product.stock_qty ?? 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Distribuidor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações da Conta</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {distribuidor?.nome?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">{distribuidor?.nome || 'Distribuidor'}</div>
                <div className="text-sm text-gray-600">{distribuidor?.email || 'email@distribuidor.com'}</div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Ativo</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Plano:</span>
                <span className="text-gray-900 font-medium">Premium</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Integração:</span>
                <span className="text-gray-900 font-medium">Mercos API</span>
              </div>
            </div>

            <Link
              href="/distribuidor/configuracoes"
              className="block w-full text-center py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mt-4"
            >
              Editar Configurações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
