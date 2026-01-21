"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useMemo } from "react";
import FreeShippingProgress from "@/components/FreeShippingProgress";


export default function CartPageClient() {
  const { items, totalCount, currentBancaName, addToCart, removeFromCart, clearCart } = useCart();

  const totalPrice = useMemo(
    () => items.reduce((sum, it) => sum + (it.price ?? 0) * it.qty, 0),
    [items]
  );
  if (items.length === 0) {
    return (
      <section className="container-max py-10">
        <h1 className="text-xl sm:text-2xl font-semibold">Seu Carrinho</h1>
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-700">Seu carrinho está vazio.</p>
          <Link href="/" className="mt-4 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95">Voltar às compras</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-max py-8 pb-24">
      <h1 className="text-xl sm:text-2xl font-semibold">Seu Carrinho</h1>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de itens */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {items.map((it) => (
              <div key={it.id} className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-200 flex items-center justify-center">
                  {it.image ? (
                    <Image 
                      src={it.image} 
                      alt={it.name} 
                      fill 
                      sizes="64px" 
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
                    {!it.image && '📦'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold line-clamp-1">{it.name}</div>
                  {typeof it.price === "number" && (
                    <div className="text-[13px] text-gray-600">R$ {it.price.toFixed(2)}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-md border border-gray-300 overflow-hidden">
                    <button onClick={() => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image, banca_id: it.banca_id, banca_name: it.banca_name }, -1)} className="px-2 py-1 text-sm">-</button>
                    <span className="px-3 py-1 text-sm font-semibold">{it.qty}</span>
                    <button onClick={() => addToCart({ id: it.id, name: it.name, price: it.price, image: it.image, banca_id: it.banca_id, banca_name: it.banca_name }, 1)} className="px-2 py-1 text-sm">+</button>
                  </div>
                  <button onClick={() => removeFromCart(it.id)} className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 hover:bg-gray-50" aria-label="Remover">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M6 7h12v2H6V7zm2 3h8l-1 9H9L8 10zm3-7h2l1 2h5v2H5V5h5l1-2z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 sm:p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Itens: {totalCount}</span>
            <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Esvaziar carrinho</button>
          </div>
        </div>

        {/* Resumo */}
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">Resumo</h2>
          
          {currentBancaName && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 border border-gray-200">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Pedido de:</p>
                <p className="text-sm font-semibold text-gray-900">{currentBancaName}</p>
              </div>
            </div>
          )}
          
          {/* Barra de progresso frete grátis */}
          <FreeShippingProgress subtotal={totalPrice} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">R$ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="mt-1 text-[12px] text-gray-500">Frete calculado na próxima etapa.</div>
          <div className="mt-4 space-y-2">
            <Link href="/checkout" className="block w-full rounded-md bg-gradient-to-r from-[#ff5c00] to-[#ff7a33] px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-95 text-center">Finalizar compra</Link>
            <Link href="/" className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-50 text-center">Continuar comprando</Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
