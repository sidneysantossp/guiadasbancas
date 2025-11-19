"use client";

import { useState } from "react";

export default function SetupHeroSlides() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleSetup = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch('/api/admin/hero-slides/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-token'
        }
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Erro desconhecido');
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao executar setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Setup: Hero Slides
        </h1>
        <p className="text-gray-600 mb-8">
          Configure as tabelas necessárias para o sistema de slides da home page.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                O que este setup faz:
              </h3>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Cria a tabela <code className="bg-blue-100 px-1 rounded">hero_slides</code> no Supabase</li>
                <li>Cria a tabela <code className="bg-blue-100 px-1 rounded">slider_config</code> no Supabase</li>
                <li>Insere 3 slides padrão com imagens</li>
                <li>Insere configuração padrão do slider</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao executar setup
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  {result?.details && (
                    <p className="mt-2 text-xs">
                      <strong>Detalhes:</strong> {result.details}
                    </p>
                  )}
                  {result?.hint && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-800">
                        <strong>💡 Solução alternativa:</strong><br />
                        {result.hint}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {result?.success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  ✅ Setup concluído com sucesso!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{result.message}</p>
                  {result.data && (
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      <li>{result.data.slides} slides criados</li>
                      <li>Configuração do slider criada</li>
                    </ul>
                  )}
                </div>
                <div className="mt-4">
                  <a
                    href="/admin/cms/home"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Ir para Gestão da Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSetup}
          disabled={loading}
          className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#ff5c00] hover:bg-[#e64a00]'
          } transition-colors`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executando setup...
            </>
          ) : (
            'Executar Setup Agora'
          )}
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Opção Manual (SQL)
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Se preferir executar o SQL manualmente no Supabase:
          </p>
          <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
            <li>Acesse o <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Supabase Dashboard</a></li>
            <li>Vá para <strong>SQL Editor</strong> → <strong>New Query</strong></li>
            <li>Copie o conteúdo do arquivo: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">/database/create-hero-slides-tables.sql</code></li>
            <li>Cole no editor e clique em <strong>Run</strong></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
