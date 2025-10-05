/**
 * Hook para ações de pedidos com registro automático de histórico
 */

import { useState } from 'react';
import {
  logStatusChange,
  logNote,
  logDeliveryUpdate,
  logVendorMessage,
  logCustomerMessage
} from '@/lib/orderHistory';

export function useOrderActions(orderId: string, userName: string, userRole: 'vendor' | 'customer' | 'admin') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Atualizar status do pedido
   */
  const updateStatus = async (oldStatus: string, newStatus: string, details?: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Atualizar status no banco
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      // 2. Registrar no histórico
      await logStatusChange(orderId, oldStatus, newStatus, userName, userRole, details);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Adicionar observação
   */
  const addNote = async (note: string) => {
    setLoading(true);
    setError(null);

    try {
      // Registrar no histórico
      await logNote(orderId, note, userName, userRole);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Atualizar previsão de entrega
   */
  const updateDelivery = async (oldDelivery: string, newDelivery: string, details?: string) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Atualizar no banco
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimated_delivery: newDelivery })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar entrega');
      }

      // 2. Registrar no histórico
      await logDeliveryUpdate(orderId, oldDelivery, newDelivery, userName, userRole, details);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enviar mensagem
   */
  const sendMessage = async (message: string) => {
    setLoading(true);
    setError(null);

    try {
      // Registrar mensagem no histórico
      if (userRole === 'vendor') {
        await logVendorMessage(orderId, message, userName);
      } else {
        await logCustomerMessage(orderId, message, userName);
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    addNote,
    updateDelivery,
    sendMessage,
    loading,
    error
  };
}
