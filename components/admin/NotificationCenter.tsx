"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";

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
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadNotifications();
    // Simular verificação periódica de novas notificações
    const interval = setInterval(checkNewNotifications, 30000); // 30 segundos
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Simulação de API - em produção seria /api/notifications
      const mockNotifications: Notification[] = [
        {
          id: "notif-1",
          type: "new_order",
          title: "Novo Pedido Recebido",
          message: "Pedido #ORD-001 de João Silva - R$ 33,50",
          timestamp: new Date().toISOString(),
          read: false,
          order_id: "ORD-001",
          priority: "high"
        },
        {
          id: "notif-2",
          type: "status_change",
          title: "Pedido Entregue",
          message: "Pedido #ORD-002 foi marcado como entregue",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          order_id: "ORD-002",
          priority: "medium"
        },
        {
          id: "notif-3",
          type: "system",
          title: "Sistema Atualizado",
          message: "Nova versão do sistema disponível com melhorias",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          priority: "low"
        }
      ];
      
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
      {/* Botão de Notificações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM19 12h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3a2 2 0 002 2h2m10-6V4a2 2 0 00-2-2H9a2 2 0 00-2 2v1M7 14h10l-5 5-5-5z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
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
