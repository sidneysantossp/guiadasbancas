// Sistema de Notificações para Jornaleiros

interface NotificationData {
  bancaId: string;
  bancaName: string;
  orderId: string;
  customerName: string;
  total: number;
  items: number;
  whatsapp?: string;
}

/**
 * Envia notificação de novo pedido via WhatsApp (Evolution API)
 */
export async function notifyNewOrder(data: NotificationData): Promise<boolean> {
  if (!data.whatsapp) {
    console.log('WhatsApp não configurado para esta banca');
    return false;
  }

  try {
    const message = `🔔 *NOVO PEDIDO!*\n\n` +
      `📦 Pedido: #${data.orderId}\n` +
      `👤 Cliente: ${data.customerName}\n` +
      `🛒 Itens: ${data.items}\n` +
      `💰 Total: R$ ${data.total.toFixed(2)}\n\n` +
      `Acesse o painel para gerenciar: ${process.env.NEXT_PUBLIC_APP_URL}/jornaleiro/pedidos/${data.orderId}`;

    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: data.whatsapp,
        message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar notificação WhatsApp:', error);
    return false;
  }
}

/**
 * Envia notificação push (se o jornaleiro tiver habilitado)
 */
export async function sendPushNotification(
  subscription: PushSubscription,
  data: NotificationData
): Promise<boolean> {
  try {
    const response = await fetch('/api/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        title: '🔔 Novo Pedido!',
        body: `${data.customerName} fez um pedido de R$ ${data.total.toFixed(2)}`,
        data: {
          url: `/jornaleiro/pedidos/${data.orderId}`,
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar push notification:', error);
    return false;
  }
}

/**
 * Notifica sobre mudança de status do pedido
 */
export async function notifyOrderStatusChange(
  whatsapp: string,
  orderId: string,
  status: string,
  customerName: string
): Promise<boolean> {
  const statusMessages: Record<string, string> = {
    confirmado: '✅ Pedido confirmado e em preparo',
    em_preparo: '👨‍🍳 Pedido sendo preparado',
    pronto: '✅ Pedido pronto para retirada/entrega',
    saiu_entrega: '🚚 Pedido saiu para entrega',
    entregue: '🎉 Pedido entregue com sucesso',
    cancelado: '❌ Pedido cancelado',
  };

  const message = `📦 *ATUALIZAÇÃO DE PEDIDO*\n\n` +
    `Pedido: #${orderId}\n` +
    `Cliente: ${customerName}\n` +
    `Status: ${statusMessages[status] || status}\n\n` +
    `Acesse o painel para mais detalhes.`;

  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: whatsapp,
        message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar notificação de status:', error);
    return false;
  }
}

/**
 * Notifica sobre estoque baixo
 */
export async function notifyLowStock(
  whatsapp: string,
  productName: string,
  currentStock: number
): Promise<boolean> {
  const message = `⚠️ *ESTOQUE BAIXO*\n\n` +
    `Produto: ${productName}\n` +
    `Estoque atual: ${currentStock} unidades\n\n` +
    `Reponha o estoque para não perder vendas!`;

  try {
    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: whatsapp,
        message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar notificação de estoque:', error);
    return false;
  }
}
