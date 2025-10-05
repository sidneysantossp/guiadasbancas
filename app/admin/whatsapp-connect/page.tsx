"use client";

import { useState, useEffect } from "react";

export default function WhatsAppConnectPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/whatsapp/reconnect');
      const data = await response.json();
      setStatus(data);
      console.log('Status:', data);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const reconnect = async () => {
    try {
      setLoading(true);
      setQrCode(null);
      const response = await fetch('/api/whatsapp/reconnect', {
        method: 'POST'
      });
      const data = await response.json();
      
      console.log('Reconnect response:', data);
      
      if (data.base64) {
        setQrCode(data.base64);
      }
      
      setStatus(data);
    } catch (error) {
      console.error('Erro ao reconectar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    
    // Auto-refresh a cada 5 segundos
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            📱 Conexão WhatsApp
          </h1>

          {/* Status */}
          <div className={`p-6 rounded-lg mb-6 ${
            status?.connected 
              ? 'bg-green-50 border-2 border-green-500' 
              : 'bg-red-50 border-2 border-red-500'
          }`}>
            <div className="text-center">
              <div className="text-6xl mb-4">
                {status?.connected ? '✅' : '❌'}
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {status?.message || 'Verificando...'}
              </h2>
              <p className="text-sm text-gray-600">
                Instância: <code className="bg-gray-200 px-2 py-1 rounded">SDR_AUDITSEO</code>
              </p>
              {status?.state && (
                <p className="text-sm text-gray-600 mt-1">
                  Estado: <strong>{status.state}</strong>
                </p>
              )}
            </div>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="mb-6 bg-blue-50 border-2 border-blue-500 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-center">
                📱 Escaneie o QR Code
              </h3>
              <div className="flex justify-center mb-4">
                <img 
                  src={qrCode} 
                  alt="QR Code WhatsApp" 
                  className="border-4 border-blue-500 rounded-lg"
                  style={{ width: '300px', height: '300px' }}
                />
              </div>
              <div className="bg-white rounded p-4">
                <p className="font-semibold mb-2">📋 Instruções:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Abra o <strong>WhatsApp</strong> no seu celular</li>
                  <li>Toque em <strong>Menu (⋮)</strong> → <strong>Dispositivos Conectados</strong></li>
                  <li>Toque em <strong>Conectar Dispositivo</strong></li>
                  <li>Aponte a câmera para o <strong>QR Code acima</strong></li>
                </ol>
              </div>
            </div>
          )}

          {/* Próximos Passos */}
          {status?.nextSteps && status.nextSteps.length > 0 && (
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-500 rounded-lg p-4">
              <p className="font-semibold mb-2">⚠️ Próximos Passos:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {status.nextSteps.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4">
            <button
              onClick={checkStatus}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? '⏳ Verificando...' : '🔄 Verificar Status'}
            </button>
            
            {!status?.connected && (
              <button
                onClick={reconnect}
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? '⏳ Reconectando...' : '🔌 Reconectar'}
              </button>
            )}
          </div>

          {/* Link Manual */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600 mb-2">
              Ou acesse manualmente:
            </p>
            <a 
              href="https://api.auditseo.com.br" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              🌐 https://api.auditseo.com.br
            </a>
          </div>

          {/* Debug Info */}
          {status && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                🔧 Debug Info
              </summary>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                {JSON.stringify(status, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
