/**
 * Funções helper para registrar histórico de pedidos
 */

type OrderHistoryAction = 
  | 'created'
  | 'status_change'
  | 'note_added'
  | 'delivery_updated'
  | 'payment_updated'
  | 'customer_message'
  | 'vendor_message'
  | 'item_added'
  | 'item_removed'
  | 'price_adjusted';

type UserRole = 'customer' | 'vendor' | 'admin' | 'system';

type AddHistoryParams = {
  orderId: string;
  action: OrderHistoryAction;
  newValue: string;
  oldValue?: string;
  userId?: string;
  userName: string;
  userRole: UserRole;
  details?: string;
};

/**
 * Registra uma entrada no histórico do pedido
 */
export async function addOrderHistory(params: AddHistoryParams): Promise<boolean> {
  try {
    const response = await fetch(`/api/orders/${params.orderId}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: params.action,
        old_value: params.oldValue,
        new_value: params.newValue,
        user_id: params.userId,
        user_name: params.userName,
        user_role: params.userRole,
        details: params.details
      })
    });

    if (!response.ok) {
      console.error('Erro ao registrar histórico:', await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao registrar histórico:', error);
    return false;
  }
}

/**
 * Helper: Registrar mudança de status
 */
export async function logStatusChange(
  orderId: string,
  oldStatus: string,
  newStatus: string,
  userName: string,
  userRole: UserRole,
  details?: string
) {
  return addOrderHistory({
    orderId,
    action: 'status_change',
    oldValue: oldStatus,
    newValue: newStatus,
    userName,
    userRole,
    details
  });
}

/**
 * Helper: Registrar observação
 */
export async function logNote(
  orderId: string,
  note: string,
  userName: string,
  userRole: UserRole
) {
  return addOrderHistory({
    orderId,
    action: 'note_added',
    newValue: note,
    userName,
    userRole
  });
}

/**
 * Helper: Registrar atualização de entrega
 */
export async function logDeliveryUpdate(
  orderId: string,
  oldDelivery: string,
  newDelivery: string,
  userName: string,
  userRole: UserRole,
  details?: string
) {
  return addOrderHistory({
    orderId,
    action: 'delivery_updated',
    oldValue: oldDelivery,
    newValue: newDelivery,
    userName,
    userRole,
    details
  });
}

/**
 * Helper: Registrar mensagem do cliente
 */
export async function logCustomerMessage(
  orderId: string,
  message: string,
  customerName: string
) {
  return addOrderHistory({
    orderId,
    action: 'customer_message',
    newValue: message,
    userName: customerName,
    userRole: 'customer'
  });
}

/**
 * Helper: Registrar mensagem do vendedor
 */
export async function logVendorMessage(
  orderId: string,
  message: string,
  vendorName: string
) {
  return addOrderHistory({
    orderId,
    action: 'vendor_message',
    newValue: message,
    userName: vendorName,
    userRole: 'vendor'
  });
}

/**
 * Helper: Registrar criação do pedido
 */
export async function logOrderCreated(
  orderId: string,
  customerName: string,
  details?: string
) {
  return addOrderHistory({
    orderId,
    action: 'created',
    newValue: 'novo',
    userName: customerName,
    userRole: 'customer',
    details: details || 'Pedido criado pelo cliente'
  });
}

/**
 * Tradução de ações para português
 */
export function getActionLabel(action: OrderHistoryAction): string {
  const labels: Record<OrderHistoryAction, string> = {
    created: 'Pedido criado',
    status_change: 'Status alterado',
    note_added: 'Observação adicionada',
    delivery_updated: 'Previsão de entrega atualizada',
    payment_updated: 'Pagamento atualizado',
    customer_message: 'Mensagem do cliente',
    vendor_message: 'Mensagem do jornaleiro',
    item_added: 'Item adicionado',
    item_removed: 'Item removido',
    price_adjusted: 'Preço ajustado'
  };
  return labels[action] || action;
}

/**
 * Ícones para cada tipo de ação
 */
export function getActionIcon(action: OrderHistoryAction): string {
  const icons: Record<OrderHistoryAction, string> = {
    created: '🆕',
    status_change: '🔄',
    note_added: '📝',
    delivery_updated: '🚚',
    payment_updated: '💳',
    customer_message: '💬',
    vendor_message: '📢',
    item_added: '➕',
    item_removed: '➖',
    price_adjusted: '💰'
  };
  return icons[action] || '📋';
}

/**
 * Cores para status
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    novo: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    em_preparo: 'bg-orange-100 text-orange-800',
    saiu_para_entrega: 'bg-purple-100 text-purple-800',
    entregue: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
