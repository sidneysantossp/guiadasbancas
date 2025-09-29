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
  addToCart: (item: Omit<CartItem, "qty">, qty?: number) => void;
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

  const addToCart = useCallback((item: Omit<CartItem, "qty">, qty: number = 1) => {
    // console.log('Adicionando ao carrinho:', item, 'quantidade:', qty);
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.max(0, next[idx].qty + qty);
        if (newQty === 0) {
          next.splice(idx, 1);
          return next;
        }
        next[idx] = { ...next[idx], qty: newQty };
        // console.log('Item atualizado no carrinho:', next);
        return next;
      }
      const firstQty = Math.max(0, qty);
      if (firstQty === 0) return prev;
      const newItems = [...prev, { ...item, qty: firstQty }];
      // console.log('Novo item adicionado ao carrinho:', newItems);
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = useMemo(() => items.reduce((sum, it) => sum + it.qty, 0), [items]);

  const value = useMemo(() => ({ items, totalCount, addToCart, removeFromCart, clearCart }), [items, totalCount, addToCart, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
