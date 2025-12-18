"use client";

import { useEffect, useState } from "react";

type MetricsData = {
  total_orders: number;
  total_revenue: number;
  pending_orders: number;
  completed_orders: number;
  avg_order_value: number;
  today_orders: number;
  today_revenue: number;
  week_orders: number;
  week_revenue: number;
  month_orders: number;
  month_revenue: number;
};

type OrdersByStatus = {
  novo: number;
  confirmado: number;
  em_preparo: number;
  saiu_para_entrega: number;
  parcialmente_retirado: number;
  entregue: number;
  cancelado: number;
};

export default function OrdersMetrics() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [ordersByStatus, setOrdersByStatus] = useState<OrdersByStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os pedidos para calcular métricas
      const res = await fetch('/api/orders?limit=1000');
      const data = await res.json();
      
      if (data.items) {
        calculateMetrics(data.items);
      }
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (orders: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Métricas gerais
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter(o => o.status === 'entregue').length;
    const pendingOrders = orders.filter(o => !['entregue', 'cancelado'].includes(o.status)).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Métricas por período
    const todayOrders = orders.filter(o => new Date(o.created_at) >= today);
    const weekOrders = orders.filter(o => new Date(o.created_at) >= weekAgo);
    const monthOrders = orders.filter(o => new Date(o.created_at) >= monthAgo);

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const weekRevenue = weekOrders.reduce((sum, order) => sum + order.total, 0);
    const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);

    // Pedidos por status
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setMetrics({
      total_orders: totalOrders,
      total_revenue: totalRevenue,
      pending_orders: pendingOrders,
      completed_orders: completedOrders,
      avg_order_value: avgOrderValue,
      today_orders: todayOrders.length,
      today_revenue: todayRevenue,
      week_orders: weekOrders.length,
      week_revenue: weekRevenue,
      month_orders: monthOrders.length,
      month_revenue: monthRevenue
    });

    setOrdersByStatus({
      novo: statusCounts.novo || 0,
      confirmado: statusCounts.confirmado || 0,
      em_preparo: statusCounts.em_preparo || 0,
      saiu_para_entrega: statusCounts.saiu_para_entrega || 0,
      parcialmente_retirado: statusCounts.parcialmente_retirado || 0,
      entregue: statusCounts.entregue || 0,
      cancelado: statusCounts.cancelado || 0
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar métricas</p>
      </div>
    );
  }

  const MetricCard = ({ title, value, subtitle, color = "blue" }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: "blue" | "green" | "yellow" | "red" | "purple";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      red: "bg-red-50 text-red-700 border-red-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200"
    };

    return (
      <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
        <div className="text-sm font-medium opacity-75">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {subtitle && <div className="text-xs opacity-60 mt-1">{subtitle}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Visão Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Pedidos"
            value={metrics.total_orders}
            color="blue"
          />
          <MetricCard
            title="Receita Total"
            value={`R$ ${metrics.total_revenue.toFixed(2)}`}
            color="green"
          />
          <MetricCard
            title="Pedidos Pendentes"
            value={metrics.pending_orders}
            color="yellow"
          />
          <MetricCard
            title="Pedidos Entregues"
            value={metrics.completed_orders}
            color="green"
          />
        </div>
      </div>

      {/* Métricas por Período */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Performance por Período</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Hoje"
            value={metrics.today_orders}
            subtitle={`R$ ${metrics.today_revenue.toFixed(2)}`}
            color="blue"
          />
          <MetricCard
            title="Últimos 7 dias"
            value={metrics.week_orders}
            subtitle={`R$ ${metrics.week_revenue.toFixed(2)}`}
            color="purple"
          />
          <MetricCard
            title="Últimos 30 dias"
            value={metrics.month_orders}
            subtitle={`R$ ${metrics.month_revenue.toFixed(2)}`}
            color="green"
          />
        </div>
      </div>

      {/* Status dos Pedidos */}
      {ordersByStatus && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Pedidos por Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <MetricCard
              title="Novos"
              value={ordersByStatus.novo}
              color="yellow"
            />
            <MetricCard
              title="Confirmados"
              value={ordersByStatus.confirmado}
              color="blue"
            />
            <MetricCard
              title="Em Preparo"
              value={ordersByStatus.em_preparo}
              color="purple"
            />
            <MetricCard
              title="Saiu p/ Entrega"
              value={ordersByStatus.saiu_para_entrega}
              color="blue"
            />
            <MetricCard
              title="Entregues"
              value={ordersByStatus.entregue}
              color="green"
            />
            <MetricCard
              title="Cancelados"
              value={ordersByStatus.cancelado}
              color="red"
            />
          </div>
        </div>
      )}

      {/* Métricas Adicionais */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Indicadores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Ticket Médio"
            value={`R$ ${metrics.avg_order_value.toFixed(2)}`}
            color="purple"
          />
          <MetricCard
            title="Taxa de Conclusão"
            value={`${metrics.total_orders > 0 ? ((metrics.completed_orders / metrics.total_orders) * 100).toFixed(1) : 0}%`}
            subtitle={`${metrics.completed_orders} de ${metrics.total_orders} pedidos`}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}
