'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAdminWithDevFallback } from '@/lib/admin-client-fetch';

export default function AtualizarCodigosPage() {
  const params = useParams();
  const router = useRouter();
  const distribuidorId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleAtualizar = async () => {
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const response = await fetchAdminWithDevFallback(`/api/admin/distribuidores/${distribuidorId}/atualizar-codigos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Tentar parsear a resposta como JSON
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Se não é JSON, pegar o texto
        const text = await response.text();
        throw new Error(`Resposta inválida do servidor: ${text.substring(0, 200)}`);
      }

      if (!response.ok) {
        const errorMsg = data.error || 'Erro ao atualizar códigos';
        const detalhes = data.detalhes ? `\n\nDetalhes: ${data.detalhes}` : '';
        throw new Error(errorMsg + detalhes);
      }

      setResultado(data);
    } catch (err: any) {
      console.error('Erro ao atualizar códigos:', err);
      setErro(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold mb-2">Atualizar Códigos Mercos</h1>
        <p className="text-gray-600">
          Esta ferramenta busca os códigos dos produtos na API Mercos e atualiza o campo <code className="bg-gray-100 px-1 rounded">codigo_mercos</code> no banco de dados.
        </p>
      </div>

      {/* Botão de atualizar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <button
          onClick={handleAtualizar}
          disabled={loading}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '⏳ Atualizando códigos... (pode demorar alguns minutos)' : '🔄 Atualizar Códigos'}
        </button>
      </div>

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">❌ Erro</h3>
          <p className="text-red-700">{erro}</p>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="space-y-6">
          {/* Estatísticas da API Mercos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📊 API Mercos</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Total de produtos</p>
                <p className="text-2xl font-bold">{resultado.api_mercos.total_produtos}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Com código</p>
                <p className="text-2xl font-bold text-green-600">{resultado.api_mercos.com_codigo}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Sem código</p>
                <p className="text-2xl font-bold text-red-600">{resultado.api_mercos.sem_codigo}</p>
              </div>
            </div>
          </div>

          {/* Resultado da atualização */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">✅ Resultado da Atualização</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Produtos atualizados</p>
                <p className="text-2xl font-bold text-green-600">{resultado.resultado.atualizados}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Sem mudança</p>
                <p className="text-2xl font-bold text-gray-600">{resultado.resultado.sem_mudanca}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Não encontrados</p>
                <p className="text-2xl font-bold text-orange-600">{resultado.resultado.nao_encontrados}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Erros</p>
                <p className="text-2xl font-bold text-red-600">{resultado.resultado.erros}</p>
              </div>
            </div>
          </div>

          {/* Estatísticas finais */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-800">🎉 Estatísticas Finais</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-700 text-sm">Total com código</p>
                <p className="text-3xl font-bold text-green-700">{resultado.estatisticas_finais.total_com_codigo}</p>
              </div>
              <div>
                <p className="text-gray-700 text-sm">Ativos com código</p>
                <p className="text-3xl font-bold text-green-700">
                  {resultado.estatisticas_finais.ativos_com_codigo} / {resultado.estatisticas_finais.total_ativos}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-700 text-sm mb-2">Percentual de produtos ativos com código</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-600 h-4 rounded-full transition-all"
                    style={{ width: `${resultado.estatisticas_finais.percentual}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-green-700">
                  {resultado.estatisticas_finais.percentual}%
                </span>
              </div>
            </div>
          </div>

          {/* Erros (se houver) */}
          {resultado.erros && resultado.erros.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-800">⚠️ Erros Encontrados</h2>
              <ul className="space-y-2">
                {resultado.erros.map((erro: any, i: number) => (
                  <li key={i} className="text-sm text-red-700">
                    <strong>{erro.produto}:</strong> {erro.erro}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/admin/produtos/upload-imagens-massa`)}
              className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              📸 Ir para Upload de Imagens
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
            >
              ← Voltar
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div>
              <p className="font-semibold text-blue-800">Processando...</p>
              <p className="text-sm text-blue-600">
                Buscando produtos na API Mercos e atualizando códigos. Isso pode levar alguns minutos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
