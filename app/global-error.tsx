'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Erro Crítico
              </h2>
              <p className="text-gray-600 mb-6">
                Ocorreu um erro crítico na aplicação. Por favor, recarregue a página.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-[#ff5c00] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Tentar novamente
              </button>
              
              <a
                href="/"
                className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Voltar para a página inicial
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
