"use client";

import { useRouter } from "next/navigation";

export function LoginRequiredModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    router.push('/minha-conta');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* Ícone */}
        <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#ff5c00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        
        {/* Título e mensagem */}
        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
          Login necessário
        </h3>
        <p className="text-center text-gray-600 mb-6">
          Para adicionar produtos aos favoritos, você precisa estar logado em sua conta.
        </p>
        
        {/* Botões */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Agora não
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-4 py-3 rounded-lg bg-[#ff5c00] text-white font-semibold hover:bg-[#ff7a33] transition-colors shadow-lg shadow-orange-500/30"
          >
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
}
