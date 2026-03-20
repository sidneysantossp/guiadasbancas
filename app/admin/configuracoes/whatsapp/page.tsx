"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { fetchAdminWithDevFallback } from "@/lib/admin-client-fetch";

interface EvolutionConfig {
  baseUrl: string;
  apiKey: string;
  apiKeyConfigured?: boolean;
  apiKeySuffix?: string | null;
  instanceName: string;
  isActive: boolean;
}

interface ConnectionStatus {
  connected: boolean;
  status: string;
  timestamp: string;
  error?: string;
  upstreamStatus?: number | null;
  authModeTried?: string;
  authModeUsed?: string;
  instanceInfo?: {
    name: string;
    state: string;
    profileName?: string;
    profilePicUrl?: string;
  };
}

export default function AdminWhatsAppConfigPage() {
  const [config, setConfig] = useState<EvolutionConfig>({
    baseUrl: 'https://api.guiadasbancas.com.br',
    apiKey: '',
    instanceName: 'guiadasbancas-central',
    isActive: false
  });
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("🧪 Teste de conexão Evolution API - Guia das Bancas");
  const [sendingTest, setSendingTest] = useState(false);
  const toast = useToast();

  // Carregar configurações salvas
  const loadConfig = async () => {
    try {
      const response = await fetchAdminWithDevFallback('/api/admin/whatsapp/config');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          baseUrl: data.baseUrl || 'https://api.guiadasbancas.com.br',
          apiKey: '',
          apiKeyConfigured: Boolean(data.apiKeyConfigured),
          apiKeySuffix: data.apiKeySuffix || null,
          instanceName: data.instanceName || 'guiadasbancas-central',
          isActive: Boolean(data.isActive),
        });
      } else {
        console.error('Erro HTTP ao carregar configurações:', response.status);
        toast.error('Erro ao carregar configurações');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro de conexão ao carregar configurações');
    }
  };

  // Salvar configurações
  const saveConfig = async () => {
    try {
      setSaving(true);
      const response = await fetchAdminWithDevFallback('/api/admin/whatsapp/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify(config)
      });

      if (response.ok) {
        await response.json();
        toast.success('Configurações salvas com sucesso!');
        await loadConfig();
        checkStatus(); // Verificar status após salvar
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
        console.error('Erro ao salvar:', errorData);
        toast.error(errorData.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      toast.error('Erro ao salvar configurações');
      console.error('Erro:', error);
    } finally {
      setSaving(false);
    }
  };

  // Verificar status da conexão
  const checkStatus = async () => {
    try {
      setLoading(true);
      const response = await fetchAdminWithDevFallback('/api/admin/whatsapp/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      toast.error('Erro ao verificar status do WhatsApp');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova instância
  const createInstance = async () => {
    try {
      setLoading(true);
      const response = await fetchAdminWithDevFallback('/api/admin/whatsapp/create-instance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({
          instanceName: config.instanceName
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Instância criada com sucesso!');
        checkStatus();
      } else {
        toast.error(data.error || 'Erro ao criar instância');
      }
    } catch (error) {
      toast.error('Erro ao criar instância');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensagem de teste
  const sendTestMessage = async () => {
    if (!testPhone.trim()) {
      toast.error('Digite um número de telefone');
      return;
    }

    try {
      setSendingTest(true);
      const response = await fetchAdminWithDevFallback('/api/admin/whatsapp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({
          phone: testPhone,
          message: testMessage
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Mensagem de teste enviada com sucesso!');
        setTestPhone('');
      } else {
        toast.error(data.error || 'Falha ao enviar mensagem');
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem de teste');
      console.error('Erro:', error);
    } finally {
      setSendingTest(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações WhatsApp Evolution API</h1>
        <p className="text-gray-600 mt-1">
          Configure a instância centralizada da Evolution API para envio de notificações automáticas
        </p>
      </div>

      {/* Configurações da API */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Credenciais da Evolution API</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Evolution API
            </label>
            <input
              type="url"
              value={config.baseUrl}
              onChange={(e) => setConfig({...config, baseUrl: e.target.value})}
              placeholder="http://localhost:8080 ou https://sua-api.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL completa da sua instância Evolution API
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({...config, apiKey: e.target.value})}
              placeholder={config.apiKeyConfigured ? "Deixe em branco para manter a chave atual" : "Sua chave de API"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Chave de autenticação da Evolution API. {config.apiKeyConfigured ? `Chave já configurada${config.apiKeySuffix ? ` (final ${config.apiKeySuffix})` : ""}.` : "Nenhuma chave configurada."} Deixe em branco para manter a chave atual.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Instância
            </label>
            <input
              type="text"
              value={config.instanceName}
              onChange={(e) => setConfig({...config, instanceName: e.target.value})}
              placeholder="guiadasbancas-central"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Nome único para a instância centralizada
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={config.isActive}
              onChange={(e) => setConfig({...config, isActive: e.target.checked})}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Ativar notificações WhatsApp
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={saveConfig}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              Salvar Configurações
            </button>

            <button
              onClick={checkStatus}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Verificar Status
            </button>
          </div>
        </div>
      </div>

      {/* Status da Conexão */}
      {status && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status da Instância</h2>

          <div className="space-y-4">
            {/* Indicador Principal */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`font-medium ${status.connected ? 'text-green-700' : 'text-red-700'}`}>
                {status.status}
              </span>
              <span className="text-sm text-gray-500">
                • {new Date(status.timestamp).toLocaleString('pt-BR')}
              </span>
            </div>

            {/* Informações da Instância */}
            {status.instanceInfo && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Instância:</span>
                    <span className="ml-2 text-gray-600">{status.instanceInfo.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado:</span>
                    <span className={`ml-2 ${status.instanceInfo.state === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                      {status.instanceInfo.state}
                    </span>
                  </div>
                  {status.instanceInfo.profileName && (
                    <div>
                      <span className="font-medium text-gray-700">Perfil:</span>
                      <span className="ml-2 text-gray-600">{status.instanceInfo.profileName}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Erro */}
            {status.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  <strong>Erro:</strong> {status.error}
                </p>
                {typeof status.upstreamStatus === 'number' && (
                  <p className="text-xs text-red-600 mt-1">
                    HTTP upstream: {status.upstreamStatus}
                  </p>
                )}
                {(status.upstreamStatus === 401 || status.upstreamStatus === 403) && (
                  <p className="text-xs text-red-600 mt-2">
                    Verifique a API Key da Evolution API e permissões da instância.
                  </p>
                )}
              </div>
            )}

            {/* Ações */}
            {!status.connected && (
              <div className="flex gap-3">
                <button
                  onClick={createInstance}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Criar Instância
                </button>

                {config.baseUrl && (
                  <a
                    href={`${config.baseUrl}/instance/connect/${config.instanceName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Conectar WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teste de Mensagem */}
      {status?.connected && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Teste de Envio</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Telefone
              </label>
              <input
                type="tel"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="11999999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite apenas números (DDD + número)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem
              </label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              onClick={sendTestMessage}
              disabled={sendingTest}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {sendingTest ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              Enviar Teste
            </button>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Como configurar:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Configure a URL e API Key da sua Evolution API</li>
              <li>Salve as configurações</li>
              <li>Clique em "Criar Instância" se necessário</li>
              <li>Use o botão "Conectar WhatsApp" para escanear o QR Code</li>
              <li>Teste o envio de mensagens</li>
              <li>Ative as notificações para começar a usar</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
