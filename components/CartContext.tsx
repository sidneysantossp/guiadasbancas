"use client";

import { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from "react";

export type CartItem = {
  id: string;
  name: string;
  price?: number;
  image?: string;
  qty: number;
  banca_name?: string;
  banca_id?: string;
};

type CartContextType = {
  items: CartItem[];
  totalCount: number;
  currentBancaId: string | null;
  currentBancaName: string | null;
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => boolean;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gb:cart");
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((it: CartItem) => it.qty > 0));
        }
      }
    } catch (error) {
      // console.error('Erro ao carregar carrinho do localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);
  
  // Persist to localStorage on changes (only after initial load)
  useEffect(() => {
    if (!isLoaded) return; // Não salvar antes de carregar do localStorage
    
    try {
      localStorage.setItem("gb:cart", JSON.stringify(items));
      // console.log('Carrinho salvo no localStorage:', items);
    } catch (error) {
      // console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [items, isLoaded]);

  // Identificar banca atual do carrinho
  const currentBancaId = useMemo(() => {
    return items.length > 0 && items[0].banca_id ? items[0].banca_id : null;
  }, [items]);

  const currentBancaName = useMemo(() => {
    return items.length > 0 && items[0].banca_name ? items[0].banca_name : null;
  }, [items]);

  const addToCart = useCallback((item: Omit<CartItem, "qty">, qty: number = 1): boolean => {
    // console.log('Adicionando ao carrinho:', item, 'quantidade:', qty);
    
    let success = true;
    
    setItems((prev) => {
      // Se carrinho vazio, aceita qualquer produto
      if (prev.length === 0) {
        const firstQty = Math.max(0, qty);
        if (firstQty === 0) return prev;
        return [{ ...item, qty: firstQty }];
      }

      // Se já existe o produto, apenas atualiza quantidade
      const idx = prev.findIndex((it) => it.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.max(0, next[idx].qty + qty);
        if (newQty === 0) {
          next.splice(idx, 1);
          return next;
        }
        next[idx] = { ...next[idx], qty: newQty };
        return next;
      }

      // Produto novo: verificar se é da mesma banca
      const currentBancaId = prev[0].banca_id;
      
      if (item.banca_id && currentBancaId && item.banca_id !== currentBancaId) {
        // Produto de banca diferente - BLOQUEAR
        success = false;
        
        // Mostrar alerta ao usuário
        if (typeof window !== 'undefined') {
          const currentBancaName = prev[0].banca_name || 'outra banca';
          const newBancaName = item.banca_name || 'esta banca';
          
          alert(
            `⚠️ Seu carrinho já contém produtos de "${currentBancaName}".\n\n` +
            `Para adicionar produtos de "${newBancaName}", você precisa:\n` +
            `1. Finalizar o pedido atual, ou\n` +
            `2. Esvaziar o carrinho`
          );
        }
        
        return prev; // Não adiciona
      }

      // Produto da mesma banca ou sem banca_id definido - adicionar
      const firstQty = Math.max(0, qty);
      if (firstQty === 0) return prev;
      return [...prev, { ...item, qty: firstQty }];
    });

    return success;
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);

  const value = useMemo(() => ({ 
    items, 
    totalCount, 
    currentBancaId,
    currentBancaName,
    addToCart, 
    removeFromCart, 
    clearCart 
  }), [items, totalCount, currentBancaId, currentBancaName, addToCart, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
