'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Distribuidor, MercosSyncResult } from '@/types/distribuidor';

export default function SyncDistribuidorPage() {
  const params = useParams();
  const router = useRouter();
  const [distribuidor, setDistribuidor] = useState<Distribuidor | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<MercosSyncResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [customTimestamp, setCustomTimestamp] = useState('');

  useEffect(() => {
    loadDistribuidor();
  }, []);

  const loadDistribuidor = async () => {
    try {
      const response = await fetch(`/api/admin/distribuidores/${params.id}`);
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

      const response = await fetch(
        `/api/admin/distribuidores/${params.id}/sync`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        await loadDistribuidor(); // Recarregar para atualizar última sincronização
      } else {
        alert('Erro na sincronização: ' + data.error);
      }
    } catch (error) {
      console.error('Erro na sincronização:', error);
      alert('Erro na sincronização');
    } finally {
      setSyncing(false);
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
        <Link
          href="/admin/distribuidores"
          className="text-[#ff5c00] hover:underline flex items-center gap-2 mb-4"
        >
          ← Voltar
        </Link>
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

          <button
            onClick={() => handleSync(false)}
            disabled={syncing}
            className="w-full bg-[#ff5c00] text-white px-6 py-4 rounded-lg hover:bg-[#e05400] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {syncing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sincronizando...
              </span>
            ) : (
              'Sincronizar Produtos Novos/Alterados'
            )}
          </button>
          
          <button
            onClick={() => handleSync(true)}
            disabled={syncing}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
          >
            Sincronizar Todos (Completo)
          </button>
          
          <p className="text-sm text-gray-600 mt-2 text-center">
            <strong>Incremental:</strong> Sincroniza apenas produtos novos ou alterados desde a última sincronização.<br />
            <strong>Completo:</strong> Sincroniza todos os produtos novamente (use se houver inconsistências).
          </p>
        </div>

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
