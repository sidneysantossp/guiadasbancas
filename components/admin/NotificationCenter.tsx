"use client";

import { useEffect, useState, useRef } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { IconBell } from "@tabler/icons-react";

type Notification = {
  id: string;
  type: "new_order" | "status_change" | "payment" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  order_id?: string;
  priority: "low" | "medium" | "high";
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const prevNewOrdersRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Buscar contagem de pedidos novos
  const fetchNewOrdersCount = async () => {
    try {
      const res = await fetch('/api/orders?status=novo&limit=1', {
        cache: 'no-store'
      });
      const json = await res.json();
      const count = json.total || 0;
      
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
    } catch (error) {
      console.error('Erro ao buscar pedidos novos:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    fetchNewOrdersCount();
    
    // Polling a cada 15 segundos para verificar novos pedidos
    const interval = setInterval(fetchNewOrdersCount, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Em produção, carregar notificações reais da API
      // const response = await fetch('/api/notifications');
      // const data = await response.json();
      
      // Por enquanto, sem notificações de demonstração
      const mockNotifications: Notification[] = [];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkNewNotifications = async () => {
    // Simular verificação de novas notificações
    // Em produção, faria uma chamada para API
    const hasNewOrders = Math.random() > 0.8; // 20% chance
    
    if (hasNewOrders) {
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        type: "new_order",
        title: "Novo Pedido Recebido",
        message: `Pedido #ORD-${Math.floor(Math.random() * 1000)} - R$ ${(Math.random() * 100 + 10).toFixed(2)}`,
        timestamp: new Date().toISOString(),
        read: false,
        order_id: `ORD-${Math.floor(Math.random() * 1000)}`,
        priority: "high"
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Mostrar toast para novo pedido
      toast.success(`${newNotification.title}: ${newNotification.message}`);
      
      // Notificação do browser (se permitido)
      if (Notification.permission === "granted") {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: "/favicon.ico"
        });
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notificações ativadas! Você será alertado sobre novos pedidos.");
      }
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_order":
        return "🛒";
      case "status_change":
        return "📦";
      case "payment":
        return "💰";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-gray-500 bg-gray-50";
      default:
        return "border-l-gray-500 bg-gray-50";
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
              <div className="flex items-center gap-2">
                {Notification.permission !== "granted" && (
                  <button
                    onClick={requestNotificationPermission}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Ativar
                  </button>
                )}
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-gray-600 hover:text-gray-800"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Carregando...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? "bg-blue-50" : ""
                  } hover:bg-gray-50 cursor-pointer`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2 flex-1">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      ×
                    </button>
                  </div>
                  {notification.order_id && (
                    <div className="mt-2">
                      <a
                        href={`/jornaleiro/pedidos/${notification.order_id}`}
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Ver pedido →
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Fechar
              </button>
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
