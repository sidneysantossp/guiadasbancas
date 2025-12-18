"use client";

import { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { IconBell, IconEye } from "@tabler/icons-react";
import Link from "next/link";

type NewOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  created_at: string;
};

export default function NotificationCenter() {
  const [newOrders, setNewOrders] = useState<NewOrder[]>([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewedOrders, setViewedOrders] = useState<Set<string>>(new Set());
  const toast = useToast();
  const prevNewOrdersRef = useRef<number | null>(null);

  // Carregar pedidos visualizados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('gb:viewedOrders');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setViewedOrders(new Set(parsed));
      } catch (e) {
        console.error('Erro ao carregar pedidos visualizados:', e);
      }
    }
  }, []);

  // Marcar pedido como visualizado
  const markAsViewed = (orderId: string) => {
    const newViewedOrders = new Set(viewedOrders);
    newViewedOrders.add(orderId);
    setViewedOrders(newViewedOrders);
    localStorage.setItem('gb:viewedOrders', JSON.stringify([...newViewedOrders]));
    
    // Remover da lista e atualizar contador
    setNewOrders(prev => prev.filter(o => o.id !== orderId));
    setNewOrdersCount(prev => Math.max(0, prev - 1));
  };

  // Tocar som de notificação
  const playNotificationSound = () => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      const now = ctx.currentTime;
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (error) {
      console.warn('Não foi possível reproduzir som:', error);
    }
  };

  // Buscar pedidos com status "novo"
  const fetchNewOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders?status=novo&limit=20&sort=created_at&order=desc', {
        cache: 'no-store'
      });
      const json = await res.json();
      const allOrders = json.items || [];
      
      // Filtrar pedidos já visualizados
      const storedViewed = localStorage.getItem('gb:viewedOrders');
      const viewedSet = storedViewed ? new Set(JSON.parse(storedViewed)) : new Set();
      const orders = allOrders.filter((o: NewOrder) => !viewedSet.has(o.id));
      const count = orders.length;
      
      // Se aumentou, tocar som e mostrar toast
      if (prevNewOrdersRef.current !== null && count > prevNewOrdersRef.current) {
        playNotificationSound();
        toast.success(`🛒 Novo pedido recebido!`);
        
        // Notificação do browser
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new window.Notification('Novo Pedido!', {
            body: 'Você recebeu um novo pedido.',
            icon: '/favicon.ico'
          });
        }
      }
      
      prevNewOrdersRef.current = count;
      setNewOrdersCount(count);
      setNewOrders(orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos novos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewOrders();
    
    // Polling a cada 15 segundos para verificar novos pedidos
    const interval = setInterval(fetchNewOrders, 15000);
    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notificações ativadas! Você será alertado sobre novos pedidos.");
      }
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="relative">
      {/* Botão de Notificações - Ícone de Sininho */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-[#ff5c00] hover:bg-orange-50 rounded-lg transition-colors"
        title={newOrdersCount > 0 ? `${newOrdersCount} pedido(s) novo(s)` : 'Notificações'}
      >
        <IconBell size={24} stroke={1.5} className={newOrdersCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''} />
        {newOrdersCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center animate-pulse">
            {newOrdersCount > 99 ? "99+" : newOrdersCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notificações</h3>
              {typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== "granted" && (
                <button
                  onClick={requestNotificationPermission}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Ativar alertas
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Carregando...</div>
            ) : newOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <IconBell size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Nenhum pedido pendente</p>
                <p className="text-xs mt-1">Novos pedidos aparecerão aqui</p>
              </div>
            ) : (
              newOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3 border-l-4 border-l-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛒</span>
                        <h4 className="text-sm font-semibold text-gray-900">
                          Novo Pedido Recebido
                        </h4>
                      </div>
                      <p className="text-xs text-gray-700 mt-1 font-medium">
                        #{order.order_number || order.id.substring(0, 8)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.customer_name} • {formatCurrency(order.total)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(order.created_at)}
                      </p>
                    </div>
                    <Link
                      href={`/jornaleiro/pedidos/${order.id}`}
                      onClick={() => {
                        markAsViewed(order.id);
                        setIsOpen(false);
                      }}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-colors"
                      title="Ver detalhes do pedido"
                    >
                      <IconEye size={20} className="text-orange-600" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {newOrders.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <Link
                href="/jornaleiro/pedidos?status=novo"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                Ver todos os pedidos pendentes →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
