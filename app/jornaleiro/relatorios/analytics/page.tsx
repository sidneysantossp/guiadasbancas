"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Stats {
  total_events: number;
  page_views: number;
  product_views: number;
  product_clicks: number;
  add_to_cart: number;
  whatsapp_clicks: number;
  checkout_starts: number;
  checkout_completes: number;
  searches: number;
}

interface ChartData {
  date: string;
  page_views: number;
  product_views: number;
  product_clicks: number;
  add_to_cart: number;
  whatsapp_clicks: number;
  checkout_completes: number;
}

interface TopProduct {
  id: string;
  name: string;
  image?: string;
  views: number;
  clicks: number;
  cart: number;
  whatsapp: number;
  total: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [bancaId, setBancaId] = useState<string | null>(null);

  // Buscar banca do usuário
  useEffect(() => {
    const loadBanca = async () => {
      try {
        const res = await fetch("/api/jornaleiro/banca");
        const data = await res.json();
        if (data?.data?.id) {
          setBancaId(data.data.id);
        }
      } catch (e) {
        console.error("Erro ao carregar banca:", e);
      }
    };
    loadBanca();
  }, []);

  useEffect(() => {
    if (!bancaId) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/track?banca_id=${bancaId}&period=${period}`);
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setChartData(data.chartData || []);
          setTopProducts(data.topProducts || []);
        }
      } catch (e) {
        console.error("Erro ao carregar analytics:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [bancaId, period]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Analytics</h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Analytics</h1>
          <p className="text-sm text-gray-600">
            Acompanhe as métricas de acesso e interação da sua banca
          </p>
        </div>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="all">Todo o período</option>
        </select>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <i className="fa-solid fa-eye text-blue-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.page_views || 0}</p>
              <p className="text-sm text-gray-600">Visitas ao Perfil</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <i className="fa-solid fa-box text-purple-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.product_views || 0}</p>
              <p className="text-sm text-gray-600">Produtos Visualizados</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <i className="fa-brands fa-whatsapp text-green-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.whatsapp_clicks || 0}</p>
              <p className="text-sm text-gray-600">Cliques no WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <i className="fa-solid fa-shopping-cart text-orange-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.add_to_cart || 0}</p>
              <p className="text-sm text-gray-600">Adicionados ao Carrinho</p>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda linha de cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-indigo-100 p-3">
              <i className="fa-solid fa-credit-card text-indigo-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.checkout_starts || 0}</p>
              <p className="text-sm text-gray-600">Checkouts Iniciados</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <i className="fa-solid fa-check-circle text-emerald-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.checkout_completes || 0}</p>
              <p className="text-sm text-gray-600">Pedidos Finalizados</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-pink-100 p-3">
              <i className="fa-solid fa-search text-pink-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.searches || 0}</p>
              <p className="text-sm text-gray-600">Buscas Realizadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Linha - Evolução ao longo do tempo */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Evolução de Acessos</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label as string)}
                  contentStyle={{ borderRadius: 8 }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="page_views" 
                  name="Visitas"
                  stroke="#3b82f6" 
                  fill="#93c5fd" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="product_views" 
                  name="Produtos Vistos"
                  stroke="#8b5cf6" 
                  fill="#c4b5fd" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráfico de Barras - Ações */}
      {chartData.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Ações dos Usuários</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(label) => formatDate(label as string)}
                  contentStyle={{ borderRadius: 8 }}
                />
                <Legend />
                <Bar dataKey="add_to_cart" name="Carrinho" fill="#f97316" />
                <Bar dataKey="whatsapp_clicks" name="WhatsApp" fill="#22c55e" />
                <Bar dataKey="checkout_completes" name="Pedidos" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Top Produtos */}
      {topProducts.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Produtos Mais Populares</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Produto</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Visualizações</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Cliques</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Carrinho</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">WhatsApp</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <span className="text-sm font-medium truncate max-w-[200px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-2 text-sm">{product.views}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.clicks}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.cart}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.whatsapp}</td>
                    <td className="text-center py-3 px-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {product.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mensagem quando não há dados */}
      {chartData.length === 0 && topProducts.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <i className="fa-solid fa-chart-line text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Ainda não há dados de analytics
          </h3>
          <p className="text-sm text-gray-500">
            Assim que os usuários começarem a interagir com sua banca, você verá as métricas aqui.
          </p>
        </div>
      )}
    </div>
  );
}
