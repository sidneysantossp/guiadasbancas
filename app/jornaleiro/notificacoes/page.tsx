"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";

type Notification = {
  id: string;
  type: 'novo_produto' | 'produto_atualizado' | 'estoque_baixo';
  title: string;
  message: string;
  product_id?: string;
  product_name?: string;
  distribuidor_nome?: string;
  read: boolean;
  created_at: string;
};

export default function NotificacoesPage() {
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jornaleiro/notificacoes');
      const json = await res.json();

      if (json.success) {
        setNotifications(json.notifications || []);
      } else {
        toast.error(json.error || "Erro ao carregar notificações");
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error("Erro ao carregar notificações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/jornaleiro/notificacoes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });

      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/jornaleiro/notificacoes/mark-all-read', {
        method: 'POST'
      });

      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast.success("Todas notificações marcadas como lidas");
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error("Erro ao marcar notificações");
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'novo_produto': return '🆕';
      case 'produto_atualizado': return '🔄';
      case 'estoque_baixo': return '⚠️';
      default: return '📬';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount > 0 ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` : 'Você está em dia!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Não lidas ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando notificações...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-gray-200 bg-white">
          <span className="text-4xl mb-3 block">📭</span>
          <p className="text-gray-500">
            {filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border bg-white p-4 transition-all ${
                notification.read 
                  ? 'border-gray-200' 
                  : 'border-orange-200 bg-orange-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{getIcon(notification.type)}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold ${
                        notification.read ? 'text-gray-900' : 'text-orange-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        notification.read ? 'text-gray-600' : 'text-orange-800'
                      }`}>
                        {notification.message}
                      </p>
                      {notification.distribuidor_nome && (
                        <p className="text-xs text-gray-500 mt-2">
                          📦 {notification.distribuidor_nome}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs font-medium text-orange-600 hover:text-orange-700"
                      >
                        Marcar como lida
                      </button>
                    )}
                    {notification.product_id && (
                      <Link
                        href="/jornaleiro/catalogo-distribuidor/gerenciar"
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Ver produto →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
