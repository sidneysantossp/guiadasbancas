"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DistribuidorStats = {
  id: string;
  nome: string;
  ativo: boolean;
  ultima_sincronizacao: string | null;
  minutos_desde_sync: number | null;
  total_produtos: number;
  produtos_ativos: number;
  produtos_inativos: number;
  status: string;
};

type Stats = {
  success: boolean;
  atualizado_em: string;
  distribuidores: DistribuidorStats[];
  totais: {
    total_produtos: number;
    produtos_ativos: number;
    produtos_inativos: number;
  };
};

export default function SyncMonitorPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/sync/stats', { cache: 'no-store' });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const executarSync = async () => {
    if (!confirm('Executar sincronização manual agora?')) return;
    
    try {
      setSyncing(true);
      const res = await fetch('/api/cron/sync-mercos', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        alert('Sincronização executada com sucesso!');
        fetchStats();
      } else {
        alert('Erro na sincronização: ' + data.error);
      }
    } catch (error) {
      alert('Erro ao executar sincronização');
    } finally {
      setSyncing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'atrasado': return 'bg-orange-100 text-orange-800';
      case 'nunca_sincronizado': return 'bg-red-100 text-red-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ok': return 'OK';
      case 'warning': return 'Atenção';
      case 'atrasado': return 'Atrasado';
      case 'nunca_sincronizado': return 'Nunca Sincronizado';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  const formatTempo = (minutos: number | null) => {
    if (minutos === null) return 'Nunca';
    if (minutos < 1) return 'Agora mesmo';
    if (minutos < 60) return `${minutos} min atrás`;
    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `${horas}h atrás`;
    const dias = Math.floor(horas / 24);
    return `${dias}d atrás`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-red-600">Erro ao carregar estatísticas</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitor de Sincronização</h1>
          <p className="text-sm text-gray-600 mt-1">
            Atualizado em: {new Date(stats.atualizado_em).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            🔄 Atualizar
          </button>
          <button
            onClick={executarSync}
            disabled={syncing}
            className="px-4 py-2 bg-[#ff5c00] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {syncing ? '⏳ Sincronizando...' : '▶️ Sincronizar Agora'}
          </button>
        </div>
      </div>

      {/* Cards de Totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Total de Produtos</div>
          <div className="text-3xl font-bold text-gray-900">{stats.totais.total_produtos.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Produtos Ativos</div>
          <div className="text-3xl font-bold text-green-600">{stats.totais.produtos_ativos.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600 mb-1">Produtos Inativos</div>
          <div className="text-3xl font-bold text-gray-400">{stats.totais.produtos_inativos.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabela de Distribuidores */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Distribuidores</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distribuidor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Sync
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produtos Ativos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produtos Inativos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.distribuidores.map((dist) => (
                <tr key={dist.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{dist.nome}</div>
                        <div className="text-xs text-gray-500">
                          {dist.ativo ? '✅ Ativo' : '❌ Inativo'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(dist.status)}`}>
                      {getStatusLabel(dist.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTempo(dist.minutos_desde_sync)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 font-semibold">
                    {dist.produtos_ativos.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-400">
                    {dist.produtos_inativos.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                    {dist.total_produtos.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    <Link
                      href={`/admin/distribuidores/${dist.id}`}
                      className="text-[#ff5c00] hover:text-[#ff7c00] font-medium"
                    >
                      Ver Detalhes →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Sincronização Automática</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Vercel Cron:</strong> 1x por dia às 3h da manhã (backup)</li>
                <li><strong>Cron-Job.org:</strong> A cada 15 minutos (principal)</li>
                <li><strong>Apenas produtos ativos</strong> são sincronizados</li>
                <li><strong>Produtos inativos</strong> são automaticamente removidos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
