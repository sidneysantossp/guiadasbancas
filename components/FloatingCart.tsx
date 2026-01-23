"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import Image from "next/image";

export default function FloatingCart() {
  const { items, totalCount, currentBancaName, addToCart, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  
  const handleFinalizarCompra = () => {
    setIsOpen(false);
    
    if (!isAuthenticated) {
      // Redirecionar para login com mensagem
      router.push('/minha-conta?checkout=true');
    } else {
      // Ir direto para checkout
      router.push('/checkout');
    }
  };
  
  // Mostrar o carrinho com animação quando há itens
  useEffect(() => {
    if (totalCount > 0) {
      setIsVisible(true);
    } else {
      // Delay para permitir animação de saída
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalCount]);

  // Calcular total do carrinho
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);

  // Não mostrar se não há itens
  if (!isVisible) return null;

  return (
    <>
      {/* Botão flutuante do carrinho — posicionado mais abaixo para não cobrir vitrines */}
      <div className={`fixed bottom-24 right-6 z-40 hidden md:block transition-all duration-300 ${
        totalCount > 0 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
      }`}>
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-[#ff5c00] hover:bg-[#ff7a33] text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
        >
          {/* Ícone da sacola */}
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="m16 10a4 4 0 0 1-8 0" />
          </svg>
          
          {/* Badge com quantidade */}
          <span className="absolute -top-2 -right-2 bg-white text-[#ff5c00] text-xs font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-[#ff5c00]">
            {totalCount}
          </span>
          
          {/* Preço total */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            R$ {totalPrice.toFixed(2)}
          </div>
        </button>
      </div>

      {/* Offcanvas do carrinho */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Painel do carrinho */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {totalCount} {totalCount === 1 ? 'Item' : 'Itens'} no seu carrinho
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {currentBancaName && (
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Pedido de: <span className="font-semibold">{currentBancaName}</span>
                  </p>
                )}
              </div>

              {/* Lista de itens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    {/* Imagem do produto */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/placeholder/product.svg"
                          alt="Produto"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Detalhes do produto */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {item.name}
                      </h3>
                      {item.banca_name && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.banca_name}
                        </p>
                      )}
                      <p className="text-[#ff5c00] font-semibold text-sm mt-1">
                        R$ {(item.price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Controles de quantidade */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(item, -1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="w-8 h-8 rounded-full bg-[#ff5c00] hover:bg-[#ff7a33] text-white flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Botão remover */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer com total e botão finalizar */}
              <div className="border-t border-gray-200 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">
                    Preço total
                  </span>
                  <span className="text-xl font-bold text-[#ff5c00]">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
                
                <button 
                  onClick={handleFinalizarCompra}
                  className="w-full bg-[#ff5c00] hover:bg-[#ff7a33] text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Finalizar compra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
