'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Distribuidor, MercosSyncResult } from '@/types/distribuidor';
import { fetchAdminWithDevFallback } from '@/lib/admin-client-fetch';

export default function SyncDistribuidorPage() {
  const params = useParams();
  const router = useRouter();
  const [distribuidor, setDistribuidor] = useState<Distribuidor | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncingContinuous, setSyncingContinuous] = useState(false);
  const [syncingAuto, setSyncingAuto] = useState(false);
  const [debugging, setDebugging] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [debugResult, setDebugResult] = useState<any>(null);
  const [continuousProgress, setContinuousProgress] = useState<any>(null);
  const [result, setResult] = useState<MercosSyncResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [customTimestamp, setCustomTimestamp] = useState('');

  useEffect(() => {
    loadDistribuidor();
  }, []);

  const loadDistribuidor = async () => {
    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDistribuidor(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar distribuidor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (force = false) => {
    if (!distribuidor) return;

    setSyncing(true);
    setResult(null);

    try {
      const body: any = { force };
      
      // Adicionar timestamp customizado se informado
      if (customTimestamp.trim() !== '') {
        body.startTimestamp = customTimestamp.trim();
      }

      // Usar sempre a rota principal de sincronização, que já trata paginação completa
      const response = await fetchAdminWithDevFallback(
        `/api/admin/distribuidores/${params.id}/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        let errText = '';
        try {
          const j = await response.json();
          errText = j?.error || JSON.stringify(j);
        } catch {
          errText = await response.text();
        }
        throw new Error(`HTTP ${response.status} - ${errText?.slice(0, 300)}`);
      }

      // Resposta sempre JSON do sync-full
      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        await loadDistribuidor(); // Recarregar para atualizar última sincronização
      } else {
        throw new Error(data.error || 'Erro na sincronização');
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      alert('Erro na sincronização: ' + (error as any)?.message || 'Erro desconhecido');
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoSync = async () => {
    if (!distribuidor) return;

    setSyncingAuto(true);
    setContinuousProgress(null);
    setResult(null);

    try {
      console.log('[UI] Iniciando sincronização automática contínua...');
      
      const response = await fetchAdminWithDevFallback(
        `/api/admin/distribuidores/${params.id}/sync-auto`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          produtos_novos: data.data.produtos_novos,
          produtos_atualizados: data.data.produtos_ignorados,
          produtos_total: data.data.total_geral,
          erros: data.data.erros || [],
          ultima_sincronizacao: new Date().toISOString(),
        });
        
        setContinuousProgress({
          success: true,
          completed: data.data.completed,
          message: data.data.message,
        });
        
        await loadDistribuidor();
      } else {
        throw new Error(data.error || 'Erro desconhecido');
      }
    } catch (error: any) {
      console.error('[UI] Erro na sincronização automática:', error);
      alert('Erro na sincronização automática: ' + error.message);
    } finally {
      setSyncingAuto(false);
    }
  };

  const handleContinuousSync = async () => {
    if (!distribuidor) return;

    setSyncingContinuous(true);
    setContinuousProgress(null);
    setResult(null);

    const maxRetries = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[UI] Tentativa ${attempt}/${maxRetries} - Iniciando sincronização ultra-rápida...`);
        
        const response = await fetchAdminWithDevFallback(
          `/api/admin/distribuidores/${params.id}/sync-fast`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('[UI] Status da resposta:', response.status);

        if (!response.ok) {
          let errText = '';
          try {
            const j = await response.json();
            errText = j?.error || JSON.stringify(j);
          } catch {
            errText = await response.text();
          }
          throw new Error(`HTTP ${response.status} - ${errText?.slice(0, 300)}`);
        }

        const rawText = await response.text();
        let data: any;
        try {
          data = JSON.parse(rawText || '{}');
        } catch {
          throw new Error(`Resposta não-JSON da API: ${rawText?.slice(0, 300)}`);
        }
        console.log('[UI] Dados recebidos:', data);

        if (data.success) {
          const ignorados = data.data.produtos_ignorados || 0;
          const novos = data.data.produtos_novos || 0;
          
          // Exibir resultado
          setResult({
            success: true,
            produtos_novos: novos,
            produtos_atualizados: ignorados, // Usar campo de atualizados para mostrar ignorados
            produtos_total: data.data.produtos_total,
            erros: data.data.erros || [],
            ultima_sincronizacao: new Date().toISOString(),
          });
          
          // Mostrar progresso
          setContinuousProgress({
            success: true,
            completed: true,
            message: `✅ Sincronização em ${data.data.tempo_execucao}! 
            
🆕 ${novos} produtos novos inseridos
⏭️ ${ignorados} já existiam (ignorados)
📦 Total no banco: ${data.data.total_no_banco} produtos

${data.data.total_no_banco < 7700 ? '⚠️ Clique novamente para continuar até completar 7.701 produtos' : '✅ Sincronização completa!'}`,
          });
          
          await loadDistribuidor();
          return; // Success - exit retry loop
        } else {
          throw new Error(data.error || 'Erro desconhecido');
        }
      } catch (error: any) {
        lastError = error;
        console.error(`[UI] Tentativa ${attempt} falhou:`, error);
        
        // Check if it's a network error that should be retried
        const isNetworkError = error.message?.includes('Failed to fetch') || 
                              error.message?.includes('NetworkError') ||
                              error.message?.includes('ERR_NETWORK');
        
        if (isNetworkError && attempt < maxRetries) {
          console.log(`[UI] Erro de rede detectado, tentando novamente em 2s...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        } else if (attempt === maxRetries || !isNetworkError) {
          // Last attempt or non-network error
          break;
        }
      }
    }

    // If we get here, all retries failed
    console.error('[UI] Todas as tentativas falharam:', lastError);
    setResult({
      success: false,
      produtos_novos: 0,
      produtos_atualizados: 0,
      produtos_total: 0,
      erros: [lastError?.message || 'Erro ao executar sincronização'],
      ultima_sincronizacao: new Date().toISOString(),
    });
    
    // Check if sync might have completed on server despite network error
    try {
      console.log('[UI] Verificando status no servidor...');
      const statusResponse = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${params.id}/sync-status`);
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.success && statusData.totalProdutos > 500) {
          alert(`Atenção: A sincronização pode ter sido concluída no servidor (${statusData.totalProdutos} produtos encontrados). Recarregue a página para verificar.`);
        } else {
          alert('Erro na sincronização: ' + (lastError?.message || 'Falha de rede'));
        }
      } else {
        alert('Erro na sincronização: ' + (lastError?.message || 'Falha de rede'));
      }
    } catch {
      alert('Erro na sincronização: ' + (lastError?.message || 'Falha de rede'));
    } finally {
      setSyncingContinuous(false);
    }
  };

  const handleDebugSync = async () => {
    if (!distribuidor) return;

    setDebugging(true);
    setDebugResult(null);

    try {
      const response = await fetchAdminWithDevFallback(
        `/api/admin/distribuidores/${params.id}/sync-debug`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        const produtoNome = data.produto?.[0]?.name || 'Produto';
        const acao = data.acao || 'processado';
        
        setDebugResult({
          success: true,
          message: `${data.message}\n\n✅ Produto ${acao}: ${produtoNome}\n📦 Total no banco: ${data.totalProdutos}`,
          produto: data.produto?.[0],
          totalProdutos: data.totalProdutos,
          acao: acao,
        });
        await loadDistribuidor();
      } else {
        setDebugResult(data);
      }
    } catch (error) {
      console.error('Erro no debug:', error);
      setDebugResult({
        success: false,
        error: 'Erro ao executar debug',
      });
    } finally {
      setDebugging(false);
    }
  };

  const handleVerifySchema = async () => {
    if (!distribuidor) return;

    setDebugging(true);
    setDebugResult(null);

    try {
      const response = await fetchAdminWithDevFallback(
        `/api/admin/distribuidores/${params.id}/verify-schema`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      // Formatar resultado para exibir
      if (data.success) {
        setDebugResult({
          success: true,
          message: 'Schema verificado com sucesso! ✅',
          details: data,
        });
      } else {
        setDebugResult(data);
      }

      if (data.success) {
        await loadDistribuidor();
      }
    } catch (error) {
      console.error('Erro na verificação:', error);
      setDebugResult({
        success: false,
        error: 'Erro ao verificar schema',
      });
    } finally {
      setDebugging(false);
    }
  };

  const handleCleanupProducts = async () => {
    if (!distribuidor) return;

    const confirmed = window.confirm(
      `⚠️ Tem certeza que deseja REMOVER todos os ${distribuidor.total_produtos} produtos deste distribuidor?\n\nIsso não pode ser desfeito!`
    );

    if (!confirmed) return;

    setCleaning(true);
    setDebugResult(null);

    try {
      const response = await fetchAdminWithDevFallback(
        `/api/admin/distribuidores/${params.id}/cleanup-products`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setDebugResult({
          success: true,
          message: `✅ ${data.produtosRemovidos} produtos removidos com sucesso!`,
          details: data,
        });
        await loadDistribuidor();
      } else {
        setDebugResult({
          success: false,
          error: data.error || 'Erro ao limpar produtos',
          details: data,
        });
      }
    } catch (error) {
      console.error('Erro na limpeza:', error);
      setDebugResult({
        success: false,
        error: 'Erro ao limpar produtos',
      });
    } finally {
      setCleaning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00] mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!distribuidor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Distribuidor não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-page-version="v4-timestamp-forced">
      <div className="mb-8">
        <div className="mb-4">
          <Link
            href="/admin/distribuidores"
            className="text-[#ff5c00] hover:underline flex items-center gap-2"
          >
            ← Voltar
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/admin/distribuidores/${params.id}/debug-mercos`}
            className="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition"
          >
            🔍 Debug API Mercos
          </Link>
          <Link
            href={`/admin/distribuidores/${params.id}/atualizar-codigos`}
            className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
          >
            🔄 Atualizar Códigos
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Sincronizar Catálogo
        </h1>
        <p className="text-gray-600 mt-2">{distribuidor.nome}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Informações</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Total de produtos:</span>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {distribuidor.total_produtos || 0}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Última sincronização:</span>
              <p className="text-gray-900 mt-1">
                {distribuidor.ultima_sincronizacao
                  ? new Date(distribuidor.ultima_sincronizacao).toLocaleString('pt-BR')
                  : 'Nunca sincronizado'}
              </p>
            </div>
          </div>
        </div>

        {/* CAMPO TIMESTAMP - SEMPRE VISÍVEL */}
        <style dangerouslySetInnerHTML={{ __html: `
          .timestamp-field-container {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
          }
        `}} />
        
        <div className="mb-8 space-y-4 timestamp-field-container" data-version="v4-timestamp-visible">
          {/* Campo para timestamp customizado (homologação) - SEMPRE VISÍVEL */}
          <div 
            className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg timestamp-field-container" 
            style={{ display: 'block', visibility: 'visible', minHeight: '200px' }}
          >
            <h3 className="text-base font-bold text-yellow-900 mb-3 flex items-center gap-2">
              🔧 Homologação Mercos - Timestamp Customizado
            </h3>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Timestamp inicial (alterado_apos):
            </label>
            <input
              type="text"
              value={customTimestamp}
              onChange={(e) => setCustomTimestamp(e.target.value)}
              placeholder="Ex: 2025-10-15T08:35:00 (deixe vazio para usar padrão)"
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-md text-base font-mono bg-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
              disabled={syncing}
            />
            <p className="text-sm text-gray-700 mt-2 bg-yellow-100 p-2 rounded">
              💡 <strong>Para homologação:</strong> Use o timestamp fornecido pela Mercos ou a hora antes da criação do produto (ex: 2025-10-15T08:35:00)
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleVerifySchema}
              disabled={syncing || syncingContinuous || syncingAuto || debugging || cleaning}
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
            >
              {debugging ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Verificando...
                </span>
              ) : (
                '🔍 Verificar'
              )}
            </button>
            
            <button
              onClick={handleDebugSync}
              disabled={syncing || syncingContinuous || syncingAuto || debugging || cleaning}
              className="bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
            >
              {debugging ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Testando...
                </span>
              ) : (
                '🔧 Testar'
              )}
            </button>

            <button
              onClick={handleCleanupProducts}
              disabled={syncing || syncingContinuous || syncingAuto || debugging || cleaning}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-semibold"
            >
              {cleaning ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Limpando...
                </span>
              ) : (
                '🗑️ Limpar'
              )}
            </button>
          </div>

          <button
            onClick={handleAutoSync}
            disabled={syncing || syncingContinuous || syncingAuto || debugging}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-bold shadow-lg"
          >
            {syncingAuto ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                🔄 Sincronizando TODOS os produtos automaticamente...
              </span>
            ) : (
              '🚀 Sincronização Automática Completa (4000+ produtos)'
            )}
          </button>

          <button
            onClick={handleContinuousSync}
            disabled={syncing || syncingContinuous || syncingAuto || debugging}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold shadow-lg"
          >
            {syncingContinuous ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sincronizando Ultra-Rápido...
              </span>
            ) : (
              '✨ Sincronização Ultra-Rápida (1 execução)'
            )}
          </button>

          <button
            onClick={() => handleSync(false)}
            disabled={syncing || syncingContinuous || syncingAuto}
            className="w-full bg-[#ff5c00] text-white px-6 py-4 rounded-lg hover:bg-[#e05400] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {syncing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sincronizando...
              </span>
            ) : (
              'Sincronizar Apenas Novos/Alterados'
            )}
          </button>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong className="text-green-700">🚀 Sincronização Automática Completa:</strong> Executa múltiplas sincronizações automaticamente até processar TODOS os 4000+ produtos. Ideal para primeira sincronização ou quando há muitos produtos novos. Pode levar 3-5 minutos.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong className="text-green-700">✨ Sincronização Ultra-Rápida:</strong> Executa UMA sincronização rápida. Clique múltiplas vezes se necessário para completar todos os produtos.
            </p>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            <strong>Sincronizar Apenas Novos/Alterados:</strong> Sincroniza apenas produtos novos ou alterados desde a última sincronização (mais rápido para atualizações).
          </p>
        </div>

        {debugResult && (
          <div className={`mb-4 border rounded-lg p-4 ${
            debugResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <h3 className={`text-sm font-semibold mb-2 ${
              debugResult.success ? 'text-green-900' : 'text-red-900'
            }`}>
              {debugResult.success ? '✅ Teste bem-sucedido!' : '❌ Teste falhou'}
            </h3>
            <div className="text-sm space-y-1">
              {debugResult.success ? (
                <>
                  <p className="text-green-800">
                    • Produto inserido: <strong>{debugResult.produto?.[0]?.name}</strong>
                  </p>
                  <p className="text-green-800">
                    • Total de produtos no banco: <strong>{debugResult.totalProdutos}</strong>
                  </p>
                  <p className="mt-2 text-green-700 bg-green-100 p-2 rounded">
                    ✅ O banco de dados está funcionando corretamente! Se a sincronização completa falhar, verifique os logs no console.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-red-800 font-medium">Erro: {debugResult.error}</p>
                  {debugResult.errorDetails && (
                    <div className="mt-2 bg-red-100 p-2 rounded text-xs">
                      <p><strong>Código:</strong> {debugResult.errorDetails.code}</p>
                      <p><strong>Mensagem:</strong> {debugResult.errorDetails.message}</p>
                      {debugResult.errorDetails.details && (
                        <p><strong>Detalhes:</strong> {debugResult.errorDetails.details}</p>
                      )}
                      {debugResult.errorDetails.hint && (
                        <p><strong>Dica:</strong> {debugResult.errorDetails.hint}</p>
                      )}
                    </div>
                  )}
                  {debugResult.details && (
                    <details className="mt-2 bg-gray-100 p-2 rounded text-xs">
                      <summary className="cursor-pointer font-medium">Ver detalhes completos</summary>
                      <pre className="mt-2 overflow-auto">{JSON.stringify(debugResult.details, null, 2)}</pre>
                    </details>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {continuousProgress && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              📊 Detalhes da Sincronização Contínua
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Iterações executadas: <strong>{continuousProgress.iterations}</strong></p>
              <p>• Status: <strong className={continuousProgress.completed ? 'text-green-600' : 'text-yellow-600'}>
                {continuousProgress.completed ? '✅ Completo' : '⚠️ Parcial'}
              </strong></p>
              {continuousProgress.message && (
                <p className="mt-2 text-blue-700">
                  {continuousProgress.message}
                </p>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                ✓ Sincronização Concluída
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    {result.produtos_novos}
                  </p>
                  <p className="text-sm text-gray-600">Novos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">
                    {result.produtos_atualizados}
                  </p>
                  <p className="text-sm text-gray-600">Atualizados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-700">
                    {result.produtos_total}
                  </p>
                  <p className="text-sm text-gray-600">Total Processados</p>
                </div>
              </div>
            </div>

            {result.erros.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                  ⚠️ Avisos ({result.erros.length})
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {result.erros.map((erro, index) => (
                    <p key={index} className="text-sm text-yellow-800">
                      • {erro}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href={`/admin/distribuidores/${params.id}/produtos`}
                className="flex-1 text-center bg-[#ff5c00] text-white px-6 py-3 rounded-lg hover:bg-[#e05400] transition-colors"
              >
                Ver Produtos Sincronizados
              </Link>
              <button
                onClick={() => handleSync(true)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Sincronizar Novamente (Completo)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Sincronização Automática:</strong> Este distribuidor será
              sincronizado automaticamente a cada 15 minutos se estiver ativo.
              Você também pode sincronizar manualmente a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
