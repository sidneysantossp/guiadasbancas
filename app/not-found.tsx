import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mb-6">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-[#ff5c00] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Voltar para a página inicial
          </Link>
          
          <Link
            href="/buscar"
            className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Buscar produtos
          </Link>
        </div>
      </div>
    </div>
  );
}
