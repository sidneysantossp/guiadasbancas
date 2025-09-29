"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";

interface WhatsAppStatus {
  connected: boolean;
  status: string;
  timestamp: string;
  error?: string;
  instanceInfo?: {
    name: string;
    state: string;
  };
}

export default function WhatsAppConfigPage() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Teste de conexão WhatsApp - Guia das Bancas");
  const [sendingTest, setSendingTest] = useState(false);
  const toast = useToast();

  // Verificar status da conexão
  const checkStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/whatsapp');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      toast.error('Erro ao verificar status do WhatsApp');
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
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
    checkStatus();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações WhatsApp</h1>
        <p className="text-gray-600 mt-1">
          Configure e monitore a integração com WhatsApp para notificações automáticas
        </p>
      </div>

      {/* Status da Conexão */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Status da Conexão</h2>
          <button
            onClick={checkStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            Verificar Status
          </button>
        </div>

        {status && (
          <div className="space-y-4">
            {/* Indicador de Status */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`font-medium ${status.connected ? 'text-green-700' : 'text-red-700'}`}>
                {status.status}
              </span>
              <span className="text-sm text-gray-500">
                • Verificado em {new Date(status.timestamp).toLocaleString('pt-BR')}
              </span>
            </div>

            {/* Detalhes do Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Conexão:</span>
                  <span className={`ml-2 ${status.connected ? 'text-green-600' : 'text-red-600'}`}>
                    {status.connected ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Instância:</span>
                  <span className="ml-2 text-gray-600">{status.instanceInfo?.name || 'SDR_AUDITSEO'}</span>
                </div>
              </div>

              {status.error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Erro:</strong> {status.error}
                  </p>
                </div>
              )}
            </div>

            {/* Instruções de Conexão */}
            {!status.connected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">WhatsApp não conectado</h4>
                    <p className="text-sm text-yellow-700">
                      Para ativar as notificações automáticas, é necessário conectar uma instância do WhatsApp através da Evolution API.
                      Entre em contato com o suporte técnico para configurar a integração.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Teste de Mensagem */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Teste de Mensagem</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Telefone
            </label>
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="Ex: 11999999999"
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
            disabled={sendingTest || !status?.connected}
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

      {/* Configurações de Notificação */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notificações Automáticas</h2>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Quando as notificações são enviadas:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Novo pedido:</strong> Notificação enviada para o jornaleiro</li>
                <li>• <strong>Status atualizado:</strong> Notificação enviada para o cliente</li>
                <li>• <strong>Pedido confirmado:</strong> Cliente recebe confirmação</li>
                <li>• <strong>Saiu para entrega:</strong> Cliente é notificado</li>
                <li>• <strong>Pedido entregue:</strong> Confirmação de entrega</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Número do jornaleiro:</strong> As notificações de novos pedidos são enviadas para o número configurado nas variáveis de ambiente.
              Para alterar, entre em contato com o suporte técnico.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
