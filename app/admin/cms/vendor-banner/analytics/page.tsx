'use client';

import { useEffect, useState } from "react";

interface BannerStats {
  banner_id: string;
  title: string;
  total_clicks: number;
  created_at: string;
  updated_at: string;
  recent_clicks: Array<{
    clicked_at: string;
    user_agent?: string;
    referrer?: string;
  }>;
}

export default function VendorBannerAnalyticsPage() {
  const [stats, setStats] = useState<BannerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerId, setBannerId] = useState<string>('');

  const loadStats = async (id: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/vendor-banner/analytics?banner_id=${id}`);
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Erro ao carregar estatísticas');
      }
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveBanner = async () => {
    try {
      const response = await fetch('/api/admin/vendor-banner');
      const result = await response.json();
      
      if (result.success && result.data?.id) {
        setBannerId(result.data.id);
        await loadStats(result.data.id);
      } else {
        setError('Nenhum banner ativo encontrado');
        setLoading(false);
      }
    } catch (err: any) {
      setError(`Erro ao carregar banner: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveBanner();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getBrowserFromUserAgent = (userAgent?: string) => {
    if (!userAgent) return 'Desconhecido';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Outro';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Analytics do Banner</h1>
          <p className="mt-2 text-gray-600">
            Estatísticas de desempenho do banner do jornaleiro
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <a 
            href="/admin/cms/vendor-banner"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            ← Voltar para Configuração do Banner
          </a>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {stats && (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Resumo</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.total_clicks}</div>
                    <div className="text-sm text-gray-500">Total de Cliques</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{stats.title}</div>
                    <div className="text-sm text-gray-500">Título do Banner</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-900">{formatDate(stats.updated_at)}</div>
                    <div className="text-sm text-gray-500">Última Atualização</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cliques Recentes */}
            {stats.recent_clicks && stats.recent_clicks.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Cliques Recentes</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Navegador
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Origem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recent_clicks.map((click, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(click.clicked_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getBrowserFromUserAgent(click.user_agent)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {click.referrer ? new URL(click.referrer).hostname : 'Direto'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Informações Técnicas */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Informações Técnicas</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID do Banner</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">{stats.banner_id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Criado em</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(stats.created_at)}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Ações</h3>
                    <p className="text-sm text-gray-500">Gerenciar dados do banner</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => loadStats(bannerId)}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                    >
                      🔄 Atualizar
                    </button>
                    <a
                      href="/admin/cms/vendor-banner"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                    >
                      ⚙️ Configurar Banner
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
