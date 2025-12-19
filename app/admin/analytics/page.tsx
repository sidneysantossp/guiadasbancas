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
  PieChart,
  Pie,
  Cell,
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
  unique_sessions: number;
}

interface TopBanca {
  id: string;
  name: string;
  image?: string;
  interactions: number;
}

interface TopProduct {
  id: string;
  name: string;
  image?: string;
  banca_name?: string;
  views: number;
  clicks: number;
  cart: number;
  whatsapp: number;
  total: number;
}

interface TopSearch {
  term: string;
  count: number;
}

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");
  const [stats, setStats] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [topBancas, setTopBancas] = useState<TopBanca[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?period=${period}`);
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
          setChartData(data.chartData || []);
          setTopBancas(data.topBancas || []);
          setTopProducts(data.topProducts || []);
          setTopSearches(data.topSearches || []);
        }
      } catch (e) {
        console.error("Erro ao carregar analytics:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [period]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  // Dados para o gráfico de pizza
  const pieData = stats ? [
    { name: "Visitas", value: stats.page_views },
    { name: "Produtos Vistos", value: stats.product_views },
    { name: "Carrinho", value: stats.add_to_cart },
    { name: "WhatsApp", value: stats.whatsapp_clicks },
    { name: "Pedidos", value: stats.checkout_completes },
  ].filter(d => d.value > 0) : [];

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">Analytics da Plataforma</h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics da Plataforma</h1>
          <p className="text-sm text-gray-600">
            Visão geral de todas as interações na plataforma
          </p>
        </div>
        
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-md border border-gray-300 px-4 py-2"
        >
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="90d">Últimos 90 dias</option>
          <option value="all">Todo o período</option>
        </select>
      </div>

      {/* Cards principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <i className="fa-solid fa-chart-line text-blue-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total_events?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">Total de Eventos</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 p-3">
              <i className="fa-solid fa-users text-purple-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.unique_sessions?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">Sessões Únicas</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <i className="fa-brands fa-whatsapp text-green-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.whatsapp_clicks?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">Cliques WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <i className="fa-solid fa-shopping-cart text-orange-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.add_to_cart?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">Add ao Carrinho</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-100 p-3">
              <i className="fa-solid fa-check-circle text-emerald-600"></i>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.checkout_completes?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-600">Pedidos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolução temporal */}
        {chartData.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Evolução de Interações</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={(label) => formatDate(label as string)} />
                  <Legend />
                  <Area type="monotone" dataKey="total" name="Total" stroke="#f97316" fill="#fed7aa" />
                  <Area type="monotone" dataKey="page_views" name="Visitas" stroke="#3b82f6" fill="#93c5fd" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Distribuição de eventos */}
        {pieData.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Distribuição de Eventos</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Ações por dia */}
        {chartData.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Ações por Dia</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip labelFormatter={(label) => formatDate(label as string)} />
                  <Legend />
                  <Bar dataKey="add_to_cart" name="Carrinho" fill="#f97316" />
                  <Bar dataKey="whatsapp_clicks" name="WhatsApp" fill="#22c55e" />
                  <Bar dataKey="checkout_completes" name="Pedidos" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Tabelas */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Bancas */}
        {topBancas.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">🏪 Bancas Mais Ativas</h2>
            <div className="space-y-3">
              {topBancas.map((banca, index) => (
                <div key={banca.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    {banca.image && (
                      <img src={banca.image} alt={banca.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <span className="font-medium truncate max-w-[180px]">{banca.name}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm font-medium">
                    {banca.interactions.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Buscas */}
        {topSearches.length > 0 && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">🔍 Termos Mais Buscados</h2>
            <div className="space-y-3">
              {topSearches.map((search, index) => (
                <div key={search.term} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-medium">{search.term}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {search.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Top Produtos */}
      {topProducts.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">📦 Produtos Mais Populares</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Produto</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Banca</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Views</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Cliques</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Carrinho</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">WhatsApp</th>
                  <th className="text-center py-3 px-2 text-sm font-medium text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 font-bold text-gray-400">{index + 1}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="text-sm font-medium truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">{product.banca_name || "-"}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.views}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.clicks}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.cart}</td>
                    <td className="text-center py-3 px-2 text-sm">{product.whatsapp}</td>
                    <td className="text-center py-3 px-2">
                      <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
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

      {/* Sem dados */}
      {!stats?.total_events && (
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <i className="fa-solid fa-chart-pie text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Ainda não há dados</h3>
          <p className="text-sm text-gray-500">
            Os dados de analytics aparecerão aqui conforme os usuários interagirem com a plataforma.
          </p>
        </div>
      )}
    </div>
  );
}
