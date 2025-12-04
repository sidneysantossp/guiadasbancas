"use client";

import { useEffect, useState } from "react";
import { IconRefresh, IconCheck, IconX, IconClock, IconPlugConnected, IconAlertCircle, IconMail } from "@tabler/icons-react";

type HealthResult = {
  distribuidor: string;
  success: boolean;
  error?: string;
  latency_ms?: number;
  needsSetup?: boolean;
  sample?: {
    id: number;
    nome: string;
    ultima_alteracao?: string;
    saldo_estoque?: number;
    ativo?: boolean;
    excluido?: boolean;
  } | null;
};

export default function IntegracaoMercosPage() {
  const [distribuidor, setDistribuidor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<HealthResult | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("gb:distribuidor");
    if (raw) {
      setDistribuidor(JSON.parse(raw));
    }
  }, []);

  const loadHealth = async () => {
    if (!distribuidor?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/distribuidor/health?id=${distribuidor.id}`);
      const json = await res.json();
      setHealth(json);
    } catch (err) {
      setHealth({ distribuidor: distribuidor.nome, success: false, error: (err as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const runSync = async (full: boolean) => {
    if (!distribuidor?.id) return;
    
    setSyncLoading(true);
    setSyncResult(null);
    try {
      const res = await fetch(`/api/distribuidor/sync?id=${distribuidor.id}${full ? '&full=true' : ''}`, {
        method: 'POST',
      });
      const json = await res.json();
      setSyncResult(json);
      // Atualizar health após sync
      if (json.success) {
        setTimeout(() => loadHealth(), 1000);
      }
    } catch (err) {
      setSyncResult({ success: false, error: (err as Error).message });
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    if (distribuidor?.id) {
      loadHealth();
    }
  }, [distribuidor]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IconPlugConnected className="text-blue-600" />
            Integração Mercos
          </h1>
          <p className="text-gray-600">
            Healthcheck, sincronização manual e status da conexão com a API Mercos.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Healthcheck */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Healthcheck</h2>
          <p className="text-sm text-gray-600 mb-4">
            Valida tokens e leitura de produto (ultima_alteracao desc).
          </p>
          
          <button
            onClick={loadHealth}
            disabled={loading || !distribuidor}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {loading ? (
              <>
                <IconRefresh className="animate-spin" size={18} />
                Checando...
              </>
            ) : (
              <>
                <IconRefresh size={18} />
                Rodar health agora
              </>
            )}
          </button>

          {health && (
            <div className="mt-4">
              {health.needsSetup ? (
                // Mensagem especial quando precisa de configuração pelo admin
                <div className="rounded-lg p-4 bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <IconAlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="font-semibold text-amber-800">Integração Pendente</p>
                      <p className="text-sm text-amber-700 mt-1">
                        A integração com a API Mercos ainda não foi configurada para sua conta.
                      </p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-amber-200">
                        <p className="text-sm text-gray-700 font-medium mb-2">Para ativar:</p>
                        <p className="text-sm text-gray-600">
                          Entre em contato com o suporte do Guia das Bancas para solicitar a ativação da integração.
                        </p>
                        <a 
                          href="mailto:suporte@guiadasbancas.com.br?subject=Ativar Integração Mercos - {distribuidor?.nome}"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          <IconMail size={16} />
                          suporte@guiadasbancas.com.br
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Status normal (sucesso ou erro de conexão)
                <div className={`rounded-lg p-4 ${health.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{health.distribuidor}</span>
                    <span className={`flex items-center gap-1 font-medium ${health.success ? 'text-green-600' : 'text-red-600'}`}>
                      {health.success ? (
                        <>
                          <IconCheck size={16} />
                          Conectado
                        </>
                      ) : (
                        <>
                          <IconX size={16} />
                          Erro
                        </>
                      )}
                    </span>
                  </div>
                  
                  {health.latency_ms !== undefined && (
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <IconClock size={14} />
                      Latência: {health.latency_ms}ms
                    </p>
                  )}
                  
                  {health.error && !health.needsSetup && (
                    <p className="text-sm text-red-600 mt-2">{health.error}</p>
                  )}
                  
                  {health.sample && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Produto exemplo:</p>
                      <p className="text-sm text-gray-700 font-medium">{health.sample.nome}</p>
                      <p className="text-xs text-gray-500">ID: {health.sample.id}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sincronização Manual */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sincronização Manual</h2>
          <p className="text-sm text-gray-600 mb-4">
            Sincronize seus produtos com a API Mercos manualmente.
          </p>
          
          {health?.needsSetup ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Sincronização disponível após ativação da integração.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => runSync(false)}
                disabled={syncLoading || !distribuidor || !health?.success}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60 transition-colors"
              >
                {syncLoading ? 'Sincronizando...' : 'Sync incremental'}
              </button>
              
              <button
                onClick={() => runSync(true)}
                disabled={syncLoading || !distribuidor || !health?.success}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-60 transition-colors"
              >
                {syncLoading ? 'Sincronizando...' : 'Sync completo (full)'}
              </button>
            </div>
          )}

          {syncResult && (
            <div className="mt-4">
              <div className={`rounded-lg p-3 ${syncResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {syncResult.success ? (
                    <IconCheck className="text-green-600" size={18} />
                  ) : (
                    <IconX className="text-red-600" size={18} />
                  )}
                  <span className={`font-medium ${syncResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {syncResult.success ? 'Sincronização concluída!' : 'Erro na sincronização'}
                  </span>
                </div>
                
                {syncResult.success && syncResult.data && (
                  <div className="text-sm text-gray-700 space-y-1">
                    {syncResult.data.produtos_atualizados !== undefined && (
                      <p>Produtos atualizados: <strong>{syncResult.data.produtos_atualizados}</strong></p>
                    )}
                    {syncResult.data.produtos_novos !== undefined && (
                      <p>Produtos novos: <strong>{syncResult.data.produtos_novos}</strong></p>
                    )}
                    {syncResult.data.total_produtos !== undefined && (
                      <p>Total de produtos: <strong>{syncResult.data.total_produtos}</strong></p>
                    )}
                  </div>
                )}
                
                {syncResult.error && (
                  <p className="text-sm text-red-600">{syncResult.error}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Informações da Integração */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sobre a Integração</h2>
          <p className="text-sm text-gray-600 mb-4">
            Informações sobre a sincronização automática com a Mercos.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-medium text-blue-900 mb-2">Sincronização Automática</h3>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Seus produtos são sincronizados automaticamente a cada 15 minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Preços e estoque são atualizados em tempo real</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={16} className="mt-0.5 flex-shrink-0" />
                  <span>Novos produtos são adicionados automaticamente</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">Tipos de Sincronização</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <div>
                  <span className="font-medium text-emerald-600">Incremental:</span>
                  <p className="text-gray-600">Atualiza apenas produtos modificados desde a última sincronização. Mais rápido.</p>
                </div>
                <div>
                  <span className="font-medium text-orange-600">Completo (full):</span>
                  <p className="text-gray-600">Sincroniza todos os produtos do zero. Use quando houver inconsistências.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status da Conexão */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status da Conexão</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className={`h-3 w-3 rounded-full ${health?.success ? 'bg-green-500' : health?.needsSetup ? 'bg-amber-500' : 'bg-gray-300'}`}></div>
            <div>
              <p className="font-medium text-gray-900">API Mercos</p>
              <p className="text-sm text-gray-600">
                {health?.success ? 'Conectado' : health?.needsSetup ? 'Pendente' : 'Verificando...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className={`h-3 w-3 rounded-full ${distribuidor ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div>
              <p className="font-medium text-gray-900">Distribuidor</p>
              <p className="text-sm text-gray-600">{distribuidor?.nome || 'Carregando...'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className={`h-3 w-3 rounded-full ${health?.success ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div>
              <p className="font-medium text-gray-900">Sync Automático</p>
              <p className="text-sm text-gray-600">
                {health?.success ? 'Ativo (a cada 15 min)' : health?.needsSetup ? 'Aguardando ativação' : 'Verificando...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
