"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Distribuidor = {
  id: string;
  nome: string;
  url: string;
  descricao: string;
  cor: string;
};

const DISTRIBUIDORES: Record<string, Distribuidor> = {
  "panini": {
    id: "panini",
    nome: "Brancaleone Publicações",
    url: "https://brancaleonepublicacoes.meuspedidos.com.br/",
    descricao: "Revistas, gibis, cards colecionáveis e produtos licenciados",
    cor: "bg-blue-600"
  },
  "branca-leone": {
    id: "branca-leone",
    nome: "Bambino distribuidora",
    url: "https://jornaleiro.meuspedidos.com.br/",
    descricao: "Jornais, revistas e publicações especializadas",
    cor: "bg-green-600"
  }
};

export default function DistribuidorPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const distribuidorId = params?.id as string;
  const distribuidor = DISTRIBUIDORES[distribuidorId];

  useEffect(() => {
    if (!distribuidor) {
      router.push("/jornaleiro/distribuidores");
      return;
    }

    // Simular carregamento do iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [distribuidor, router]);

  if (!distribuidor) {
    return null;
  }

  const handleIframeError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Compacto */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Voltar aos Distribuidores"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-sm">
              <span className="font-medium text-gray-900">{distribuidor.nome}</span>
              <span className="text-gray-500 ml-2">•</span>
              <span className="text-gray-600 ml-2">{distribuidor.descricao}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Indicador de Status Compacto */}
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              {isLoading ? (
                <>
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Carregando</span>
                </>
              ) : hasError ? (
                <>
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <span>Erro</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Conectado</span>
                </>
              )}
            </div>

            {/* Botões Compactos */}
            <button
              onClick={() => {
                setIsLoading(true);
                setHasError(false);
                const iframe = document.getElementById('distribuidor-iframe') as HTMLIFrameElement;
                if (iframe) {
                  iframe.src = iframe.src;
                }
              }}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Recarregar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <a
              href={distribuidor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Abrir em nova aba"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal com Iframe */}
      <div className="flex-1 relative bg-gray-100 min-h-0">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando catálogo do distribuidor...</p>
              <p className="text-sm text-gray-500 mt-1">Conectando com {distribuidor.nome}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Erro ao carregar catálogo
              </h3>
              <p className="text-gray-600 mb-4">
                Não foi possível conectar com o site do distribuidor. Isso pode acontecer devido a restrições de segurança.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    const iframe = document.getElementById('distribuidor-iframe') as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tentar novamente
                </button>
                <a
                  href={distribuidor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors inline-block text-center"
                >
                  Abrir em nova aba
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Iframe Maximizado */}
        <iframe
          id="distribuidor-iframe"
          src={distribuidor.url}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={`Catálogo ${distribuidor.nome}`}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
        />
      </div>
    </div>
  );
}
