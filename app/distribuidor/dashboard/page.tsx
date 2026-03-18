"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getDistribuidorAuthHeaders,
} from "@/lib/distribuidor-client-auth";
import { useDistribuidorSession } from "@/lib/distribuidor-client-session";
import {
  IconBox,
  IconCheck,
  IconClipboardList,
  IconBuildingStore,
  IconTrendingUp,
  IconAlertCircle,
  IconArrowRight,
  IconPlugConnected,
  IconPercentage,
} from "@tabler/icons-react";

interface DistribuidorStats {
  totalProdutos: number;
  produtosAtivos: number;
  totalPedidosHoje: number;
  totalPedidos: number;
  totalBancas: number;
  faturamentoMes: number;
  ultimaSincronizacao?: string | null;
}

export default function DistribuidorDashboardPage() {
  const { distribuidor } = useDistribuidorSession();
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
        const dist = distribuidor;

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
  }, [distribuidor]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "Ainda não sincronizado";

    try {
      return new Date(value).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  };

  const orderStatusMeta: Record<string, string> = {
    novo: "bg-amber-100 text-amber-700",
    confirmado: "bg-blue-100 text-blue-700",
    em_preparo: "bg-orange-100 text-orange-700",
    saiu_para_entrega: "bg-purple-100 text-purple-700",
    entregue: "bg-green-100 text-green-700",
    cancelado: "bg-red-100 text-red-700",
  };

  const operationChecklist = [
    {
      title: "Integração Mercos",
      done: Boolean(stats.ultimaSincronizacao),
      description: stats.ultimaSincronizacao
        ? `Última sincronização em ${formatDateTime(stats.ultimaSincronizacao)}`
        : "Configure a integração e rode a primeira sincronização do catálogo.",
      href: "/distribuidor/configuracoes/integracao",
      action: stats.ultimaSincronizacao ? "Ver integração" : "Configurar",
      icon: IconPlugConnected,
      tone: "blue",
    },
    {
      title: "Catálogo disponível",
      done: stats.totalProdutos > 0,
      description:
        stats.totalProdutos > 0
          ? `${stats.produtosAtivos} produto(s) ativo(s) no catálogo do distribuidor.`
          : "Cadastre manualmente ou sincronize produtos para começar a vender.",
      href: stats.totalProdutos > 0 ? "/distribuidor/produtos" : "/distribuidor/produtos/novo",
      action: stats.totalProdutos > 0 ? "Gerenciar catálogo" : "Cadastrar produto",
      icon: IconBox,
      tone: "emerald",
    },
    {
      title: "Bancas com acesso",
      done: stats.totalBancas > 0,
      description:
        stats.totalBancas > 0
          ? `${stats.totalBancas} banca(s) já podem operar com seu catálogo.`
          : "Acompanhe as bancas liberadas para vender seus produtos na plataforma.",
      href: "/distribuidor/bancas",
      action: "Ver bancas",
      icon: IconBuildingStore,
      tone: "orange",
    },
  ];

  const nextSteps = [
    !stats.ultimaSincronizacao
      ? {
          title: "Conectar e testar a Mercos",
          description: "Sem a primeira sincronização, o catálogo não entra automaticamente na plataforma.",
          href: "/distribuidor/configuracoes/integracao",
        }
      : null,
    stats.totalProdutos === 0
      ? {
          title: "Abastecer o catálogo",
          description: "Sincronize produtos da Mercos ou faça um cadastro manual para ter itens disponíveis.",
          href: "/distribuidor/produtos/novo",
        }
      : null,
    stats.totalProdutos > 0 && stats.totalBancas === 0
      ? {
          title: "Ajustar preços e disponibilidade",
          description: "Defina markup e valide quais bancas já podem trabalhar com o seu catálogo.",
          href: "/distribuidor/configuracoes/markup",
        }
      : null,
    stats.totalBancas > 0 && stats.totalPedidos === 0
      ? {
          title: "Acompanhar os primeiros pedidos",
          description: "Seu catálogo já está acessível. Fique de olho na entrada dos primeiros pedidos.",
          href: "/distribuidor/pedidos",
        }
      : null,
  ].filter(Boolean) as Array<{ title: string; description: string; href: string }>;

  const toneClasses: Record<string, string> = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {distribuidor?.nome || 'Distribuidor'}! 👋
          </h1>
          <p className="text-gray-600">Acompanhe sua operação, cuide do catálogo e monitore os pedidos das bancas.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/distribuidor/produtos/novo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <IconBox size={18} />
            Novo Produto
          </Link>
          <Link
            href="/distribuidor/configuracoes/integracao"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <IconPlugConnected size={18} />
            Sincronizar Mercos
          </Link>
          <Link
            href="/distribuidor/configuracoes/markup"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <IconPercentage size={18} />
            Ajustar Markup
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Saúde da operação</h2>
              <p className="text-sm text-gray-600 mt-1">
                Veja rapidamente o que já está pronto e o que ainda precisa de atenção.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {operationChecklist.filter((item) => item.done).length}/{operationChecklist.length} concluído(s)
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {operationChecklist.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`rounded-xl border p-4 ${toneClasses[item.tone]}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/80">
                      <Icon size={20} />
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${item.done ? "bg-white text-gray-900" : "bg-white/70 text-gray-700"}`}>
                      {item.done ? <IconCheck size={14} /> : <IconAlertCircle size={14} />}
                      {item.done ? "OK" : "Pendente"}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-700">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-700"
                  >
                    {item.action}
                    <IconArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Próximos passos</h2>
          <p className="text-sm text-gray-600 mt-1">
            Ações recomendadas para destravar o próximo nível da operação.
          </p>

          {nextSteps.length === 0 ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-medium text-emerald-800">Sua operação já está em andamento.</p>
              <p className="mt-1 text-sm text-emerald-700">
                Agora o foco é acompanhar pedidos, manter catálogo atualizado e revisar preços.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {nextSteps.map((step) => (
                <Link
                  key={step.title}
                  href={step.href}
                  className="block rounded-xl border border-gray-200 p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{step.title}</p>
                      <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                    </div>
                    <IconArrowRight size={18} className="text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
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
                      <span className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${orderStatusMeta[order.status || 'novo'] || 'bg-gray-100 text-gray-700'}`}>
                        {(order.status || 'novo').replace(/_/g, ' ')}
                      </span>
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
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>{product.category || 'Sem categoria'}</span>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${product.origem === 'manual' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                        {product.origem === 'manual' ? 'Manual' : 'Mercos'}
                      </span>
                    </div>
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
                <span className="text-gray-600">Modelo:</span>
                <span className="text-gray-900 font-medium">Distribuidor parceiro</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Integração:</span>
                <span className="text-gray-900 font-medium">
                  {stats.ultimaSincronizacao ? "Mercos sincronizada" : "Mercos pendente"}
                </span>
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
