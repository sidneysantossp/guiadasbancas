'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAdminWithDevFallback } from '@/lib/admin-client-fetch';

interface Categoria {
  id: string;
  mercos_id: number;
  nome: string;
  categoria_pai_id: number | null;
  ativo: boolean;
  created_at: string;
}

export default function CategoriasPage() {
  const params = useParams();
  const router = useRouter();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [timestamp, setTimestamp] = useState('2025-11-01T02:50:00');
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Buscar distribuidor
      const distRes = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${params.id}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (distRes.ok) {
        const distData = await distRes.json();
        const distribuidor = distData.data || distData;
        setDistribuidor(distribuidor);
      }

      // Buscar categorias
      const catRes = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${params.id}/categorias`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategorias(catData.data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias do distribuidor:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncWithTimestamp = async () => {
    setSyncing(true);
    setSyncResult(null);
    
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${params.id}/categorias/sync-sandbox`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alteradoApos: timestamp,
        })
      });

      if (response.status === 429) {
        const j = await response.json();
        setSyncResult({ success: false, error: j.error || 'Limite de requisições da Mercos. Aguarde e tente novamente.', tempo_ate_permitir_novamente: j.tempo_ate_permitir_novamente });
        setSyncing(false);
        return;
      }

      const result = await response.json();
      setSyncResult(result);

      // Recarregar categorias
      if (result.success) {
        await fetchData();
        setCurrentPage(1); // Voltar para primeira página após sync
      }
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      setSyncResult({ success: false, error: 'Erro ao sincronizar' });
    } finally {
      setSyncing(false);
    }
  };

  // Cálculos de paginação
  const totalPages = Math.ceil(categorias.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategorias = showAll ? categorias : categorias.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          >
            ← Voltar
          </button>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Categorias Sincronizadas
            </h1>
            <p className="text-gray-600">
              {distribuidor?.nome || 'Distribuidor'}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                {categorias.length} categorias sincronizadas
              </div>
            </div>
          </div>
        </div>

        {/* Sincronização com Timestamp */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔄 Sincronizar Categorias
          </h2>
          
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timestamp (alterado_apos)
              </label>
              <input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="2025-11-01T02:50:00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato: YYYY-MM-DDTHH:mm:ss (ex: 2025-11-01T02:50:00)
              </p>
            </div>
            
            <button
              onClick={syncWithTimestamp}
              disabled={syncing}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                syncing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {syncing ? '🔄 Sincronizando...' : '✨ Sincronizar'}
            </button>
          </div>

          {syncResult && (
            <div className={`mt-4 p-4 rounded-lg ${
              syncResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {syncResult.success ? (
                <div className="text-green-800">
                  <div className="font-semibold mb-2">✅ Sincronização Concluída!</div>
                  <div className="text-sm space-y-1">
                    <div>• Total Mercos: {syncResult.resultado.total_mercos}</div>
                    <div>• Inseridas: {syncResult.resultado.inseridas}</div>
                    <div>• Atualizadas: {syncResult.resultado.atualizadas}</div>
                    {syncResult.resultado.erros > 0 && (
                      <div className="text-red-600">• Erros: {syncResult.resultado.erros}</div>
                    )}
                    {Array.isArray(syncResult.resultado.erros_exemplo) && syncResult.resultado.erros_exemplo.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        Exemplos de erros: {syncResult.resultado.erros_exemplo.map((e: any) => `${e.mercos_id} - ${e.erro}`).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-red-800">
                  <div className="font-semibold mb-2">❌ Erro na Sincronização</div>
                  <div className="text-sm">{syncResult.error}</div>
                  {typeof syncResult.tempo_ate_permitir_novamente === 'number' && (
                    <div className="text-xs mt-1 text-gray-600">Aguarde {syncResult.tempo_ate_permitir_novamente}s e tente novamente.</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Controles de Visualização e Paginação */}
        {categorias.length > 0 && (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showAll
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showAll ? '📄 Mostrando Todas' : '📋 Ver Todas (Print)'}
                </button>
                <span className="text-sm text-gray-600">
                  {showAll ? 'Ideal para tirar print completo' : 'Navegação paginada (10 por página)'}
                </span>
              </div>
            </div>
            
            {!showAll && (
              <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                <span className="font-medium">{Math.min(endIndex, categorias.length)}</span> de{' '}
                <span className="font-medium">{categorias.length}</span> categorias
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {/* Números das páginas */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        page === currentPage
                          ? 'bg-[#ff5c00] text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Tabela de Categorias */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Mercos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome da Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria Pai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Sincronização
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategorias.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {categorias.length === 0 
                      ? 'Nenhuma categoria sincronizada ainda. Use o botão "Sincronizar" acima.'
                      : 'Nenhuma categoria nesta página.'
                    }
                  </td>
                </tr>
              ) : (
                currentCategorias.map((categoria) => (
                <tr 
                  key={categoria.id}
                  className={
                    categoria.nome.startsWith('b8ea7d42') ||
                    categoria.nome.startsWith('f962ef5e') ||
                    categoria.nome.startsWith('b4f48a33')
                      ? 'bg-yellow-50' 
                      : ''
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {categoria.mercos_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {categoria.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {categoria.categoria_pai_id || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoria.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {categoria.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(categoria.created_at).toLocaleString('pt-BR')}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Instruções */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            📸 Instruções para Homologação:
          </h3>
          <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal">
            <li>Tire um <strong>print (screenshot)</strong> desta página mostrando a tabela completa</li>
            <li>As categorias destacadas em amarelo são as de homologação:</li>
          </ol>
          <div className="mt-3 space-y-2 ml-4">
            {categorias.filter(c => 
              c.nome.startsWith('b8ea7d42') ||
              c.nome.startsWith('f962ef5e') ||
              c.nome.startsWith('b4f48a33')
            ).map((cat, idx) => (
              <div key={cat.id} className="bg-white rounded p-3 border border-blue-200">
                <div className="text-xs text-blue-600 font-semibold">ETAPA {idx + 1}</div>
                <div className="font-mono text-sm text-gray-900 mt-1">{cat.nome}</div>
              </div>
            ))}
          </div>
          <ol className="text-sm text-blue-800 space-y-1 ml-4 list-decimal mt-3" start={3}>
            <li>Envie o print junto com o nome da categoria na etapa correspondente</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
