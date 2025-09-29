// Configuração da Evolution API para WhatsApp (Centralizada)
export interface WhatsAppConfig {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  isActive: boolean;
}

export interface JornaleiroWhatsApp {
  jornaleiroId: string;
  whatsappNumber: string;
  bancaName: string;
  isActive: boolean;
}

export interface WhatsAppMessage {
  number: string;
  text?: string;
  media?: {
    mediatype: 'image' | 'video' | 'audio' | 'document';
    media: string; // base64 ou URL
    fileName?: string;
    caption?: string;
  };
}

export interface OrderWhatsAppData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingMethod: string;
  paymentMethod: string;
  address?: string;
  notes?: string;
}

class WhatsAppService {
  private config: WhatsAppConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.EVOLUTION_API_URL || 'https://api.auditseo.com.br',
      apiKey: process.env.EVOLUTION_API_KEY || '43F2839534E2-4231-9BA7-C8193BD064DF',
      instanceName: 'SDR_AUDITSEO', // Sua instância existente
      isActive: true
    };
  }

  // Buscar configurações do admin (em produção, do banco)
  async getAdminConfig(): Promise<WhatsAppConfig | null> {
    try {
      const response = await fetch('/api/admin/whatsapp/config');
      if (!response.ok) return null;
      const config = await response.json();
      
      if (config.baseUrl && config.apiKey) {
        this.config = config;
        return config;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar configurações admin:', error);
      return null;
    }
  }

  // Buscar dados do jornaleiro
  async getJornaleiroWhatsApp(bancaId: string): Promise<JornaleiroWhatsApp | null> {
    try {
      const response = await fetch(`/api/jornaleiro/whatsapp/${bancaId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar WhatsApp do jornaleiro:', error);
      return null;
    }
  }

  // Verificar se a instância está conectada
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/instance/connectionState/${this.config.instanceName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.instance?.state === 'open';
    } catch (error) {
      console.error('Erro ao verificar conexão WhatsApp:', error);
      return false;
    }
  }

  // Enviar mensagem de texto
  async sendMessage(message: WhatsAppMessage): Promise<boolean> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        console.warn('WhatsApp não está conectado');
        return false;
      }

      const response = await fetch(`${this.config.baseUrl}/message/sendText/${this.config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.config.apiKey
        },
        body: JSON.stringify({
          number: message.number,
          text: message.text
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.key?.id ? true : false;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return false;
    }
  }

  // Formatar mensagem do pedido
  formatOrderMessage(orderData: OrderWhatsAppData, bancaName?: string): string {
    const { orderId, customerName, customerPhone, items, total, shippingMethod, paymentMethod, address, notes } = orderData;

    let message = bancaName ? `🛒 *NOVO PEDIDO - ${bancaName}*\n\n` : `🛒 *NOVO PEDIDO RECEBIDO*\n\n`;
    message += `📋 *Pedido:* #${orderId}\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📱 *Telefone:* ${customerPhone}\n\n`;

    message += `📦 *Produtos:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qtd: ${item.quantity}x | Valor: R$ ${item.price.toFixed(2)}\n`;
    });

    message += `\n💰 *Total:* R$ ${total.toFixed(2)}\n`;
    message += `🚚 *Entrega:* ${shippingMethod}\n`;
    message += `💳 *Pagamento:* ${paymentMethod}\n`;

    if (address) {
      message += `📍 *Endereço:* ${address}\n`;
    }

    if (notes) {
      message += `📝 *Observações:* ${notes}\n`;
    }

    message += `\n⏰ *Recebido em:* ${new Date().toLocaleString('pt-BR')}\n`;
    message += `\n✅ Acesse seu painel para gerenciar este pedido.`;

    return message;
  }

  // Enviar notificação de pedido para o jornaleiro (usando instância centralizada)
  async sendOrderNotificationToJornaleiro(bancaId: string, orderData: OrderWhatsAppData): Promise<boolean> {
    try {
      // Buscar configurações do admin
      const adminConfig = await this.getAdminConfig();
      if (!adminConfig || !adminConfig.isActive) {
        console.warn('WhatsApp não configurado ou inativo no admin');
        return false;
      }

      // Buscar dados do jornaleiro
      const jornaleiro = await this.getJornaleiroWhatsApp(bancaId);
      if (!jornaleiro || !jornaleiro.isActive) {
        console.warn(`Jornaleiro ${bancaId} não tem WhatsApp configurado ou está inativo`);
        return false;
      }

      // Formatar número
      const cleanPhone = jornaleiro.whatsappNumber.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      // Formatar mensagem com nome da banca
      const message = this.formatOrderMessage(orderData, jornaleiro.bancaName);

      const result = await this.sendMessage({
        number: formattedPhone,
        text: message
      });

      if (result) {
        console.log(`[WHATSAPP] Notificação enviada para ${jornaleiro.bancaName} (${formattedPhone}) - Pedido #${orderData.orderId}`);
      }

      return result;
    } catch (error) {
      console.error('Erro ao enviar notificação de pedido:', error);
      return false;
    }
  }

  // Manter método antigo para compatibilidade
  async sendOrderNotification(orderData: OrderWhatsAppData, jornaleiroPhone: string): Promise<boolean> {
    try {
      const cleanPhone = jornaleiroPhone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      const message = this.formatOrderMessage(orderData);
      return await this.sendMessage({ number: formattedPhone, text: message });
    } catch (error) {
      console.error('Erro ao enviar notificação de pedido:', error);
      return false;
    }
  }

  // Enviar mensagem de status do pedido
  async sendStatusUpdate(orderId: string, customerPhone: string, newStatus: string, estimatedDelivery?: string): Promise<boolean> {
    try {
      const cleanPhone = customerPhone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      const statusMessages: Record<string, string> = {
        'confirmado': '✅ Seu pedido foi confirmado e está sendo preparado!',
        'em_preparo': '📦 Seu pedido está sendo preparado com carinho!',
        'saiu_para_entrega': '🚚 Seu pedido saiu para entrega!',
        'entregue': '🎉 Seu pedido foi entregue com sucesso!'
      };

      let message = `📋 *Atualização do Pedido #${orderId}*\n\n`;
      message += statusMessages[newStatus] || `Status atualizado para: ${newStatus}`;

      if (estimatedDelivery) {
        message += `\n\n⏰ *Previsão de entrega:* ${new Date(estimatedDelivery).toLocaleString('pt-BR')}`;
      }

      message += `\n\n💬 Dúvidas? Entre em contato conosco!`;

      const result = await this.sendMessage({
        number: formattedPhone,
        text: message
      });

      return result;
    } catch (error) {
      console.error('Erro ao enviar atualização de status:', error);
      return false;
    }
  }
}

// Instância singleton
export const whatsappService = new WhatsAppService();

// Função helper para usar em API routes
export async function sendOrderWhatsAppNotification(orderData: OrderWhatsAppData, jornaleiroPhone: string) {
  try {
    return await whatsappService.sendOrderNotification(orderData, jornaleiroPhone);
  } catch (error) {
    console.error('Erro na notificação WhatsApp:', error);
    return false;
  }
}

export async function sendStatusWhatsAppUpdate(orderId: string, customerPhone: string, newStatus: string, estimatedDelivery?: string) {
  try {
    return await whatsappService.sendStatusUpdate(orderId, customerPhone, newStatus, estimatedDelivery);
  } catch (error) {
    console.error('Erro na atualização WhatsApp:', error);
    return false;
  }
}
