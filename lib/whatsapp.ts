// Configuração da Evolution API para WhatsApp (Centralizada)
import { loadJornaleiroWhatsAppByBancaId } from "@/lib/modules/jornaleiro/whatsapp";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

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
      baseUrl: process.env.EVOLUTION_API_URL || 'https://api.guiadasbancas.com.br',
      apiKey: process.env.EVOLUTION_API_KEY || '',
      instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'guiadasbancas',
      isActive: true
    };
  }

  private async refreshConfig(): Promise<WhatsAppConfig> {
    this.config = await getWhatsAppConfig();
    return this.config;
  }

  // Buscar dados do jornaleiro
  async getJornaleiroWhatsApp(bancaId: string): Promise<JornaleiroWhatsApp | null> {
    try {
      return await loadJornaleiroWhatsAppByBancaId(bancaId);
    } catch (error) {
      console.error('Erro ao buscar WhatsApp do jornaleiro:', error);
      return null;
    }
  }

  // Verificar se a instância está conectada
  async checkConnection(): Promise<boolean> {
    try {
      const config = await this.refreshConfig();
      const response = await fetch(`${config.baseUrl}/instance/connectionState/${config.instanceName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
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
      console.log('[WhatsAppService.sendMessage] Enviando para:', message.number);
      const config = await this.refreshConfig();
      
      // REMOVIDO: checkConnection() - estava causando falsos negativos
      // Vamos tentar enviar diretamente, a API retornará erro se não conectado
      
      const payload = {
        number: message.number,
        text: message.text
      };
      
      console.log('[WhatsAppService.sendMessage] URL:', `${config.baseUrl}/message/sendText/${config.instanceName}`);
      console.log('[WhatsAppService.sendMessage] Payload:', JSON.stringify(payload));

      const response = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
        },
        body: JSON.stringify(payload)
      });

      console.log('[WhatsAppService.sendMessage] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[WhatsAppService.sendMessage] HTTP error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[WhatsAppService.sendMessage] Response data:', result);
      
      const success = result.key?.id ? true : false;
      console.log(`[WhatsAppService.sendMessage] Resultado final: ${success ? 'SUCESSO ✅' : 'FALHOU ❌'}`);
      
      return success;
    } catch (error) {
      console.error('[WhatsAppService.sendMessage] Erro ao enviar mensagem WhatsApp:', error);
      return false;
    }
  }

  // Enviar imagem
  async sendImage(number: string, imageBase64: string, caption?: string): Promise<boolean> {
    try {
      console.log('[WhatsAppService.sendImage] Enviando imagem para:', number);
      const config = await this.refreshConfig();
      
      const payload = {
        number: number,
        mediatype: 'image',
        media: imageBase64,
        caption: caption || ''
      };
      
      console.log('[WhatsAppService.sendImage] URL:', `${config.baseUrl}/message/sendMedia/${config.instanceName}`);

      const response = await fetch(`${config.baseUrl}/message/sendMedia/${config.instanceName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.apiKey
        },
        body: JSON.stringify(payload)
      });

      console.log('[WhatsAppService.sendImage] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[WhatsAppService.sendImage] HTTP error:', response.status, errorText);
        return false;
      }

      const result = await response.json();
      console.log('[WhatsAppService.sendImage] Response data:', result);
      
      return result.key?.id ? true : false;
    } catch (error) {
      console.error('[WhatsAppService.sendImage] Erro ao enviar imagem:', error);
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
      const adminConfig = await this.refreshConfig();
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
  async sendStatusUpdate(orderId: string, customerPhone: string, newStatus: string, estimatedDelivery?: string, itemsWithStatus?: { name: string; quantity: number; status: string }[], bancaWhatsapp?: string, orderNumber?: string): Promise<boolean> {
    try {
      console.log('[WhatsAppService] ===== sendStatusUpdate INÍCIO =====');
      console.log('[WhatsAppService] Parâmetros:', { orderId, orderNumber, customerPhone, newStatus, estimatedDelivery, itemsCount: itemsWithStatus?.length });
      
      const cleanPhone = customerPhone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      
      console.log('[WhatsAppService] Telefone original:', customerPhone);
      console.log('[WhatsAppService] Telefone limpo:', cleanPhone);
      console.log('[WhatsAppService] Telefone formatado:', formattedPhone);

      const statusMessages: Record<string, { emoji: string; title: string; message: string }> = {
        'novo': {
          emoji: '🆕',
          title: 'Pedido Recebido',
          message: 'Recebemos seu pedido com sucesso! Estamos analisando e em breve você receberá a confirmação.'
        },
        'confirmado': {
          emoji: '✅',
          title: 'Pedido Confirmado',
          message: 'Seu pedido foi confirmado! Estamos separando os produtos para você.'
        },
        'em_preparo': {
          emoji: '📦',
          title: 'Pedido em Preparo',
          message: 'Seu pedido está sendo preparado com carinho! Em breve estará pronto para entrega.'
        },
        'saiu_para_entrega': {
          emoji: '🚚',
          title: 'Saiu para Entrega',
          message: 'Seu pedido saiu para entrega! Logo chegará no endereço informado.'
        },
        'entregue': {
          emoji: '🎉',
          title: 'Pedido Entregue',
          message: 'Seu pedido foi entregue com sucesso! Esperamos que aproveite!'
        }
      };

      const statusInfo = statusMessages[newStatus] || {
        emoji: '📋',
        title: 'Status Atualizado',
        message: `Status do pedido: ${newStatus}`
      };

      const displayOrderNumber = (orderNumber && orderNumber.trim()) 
        ? orderNumber 
        : `BAN-${String(orderId).substring(0, 8).toUpperCase()}`;
      let message = `${statusInfo.emoji} *${statusInfo.title}*\n\n`;
      message += `📋 *Pedido:* #${displayOrderNumber}\n\n`;
      message += `${statusInfo.message}`;

      // Adicionar resumo dos itens com status
      if (itemsWithStatus && itemsWithStatus.length > 0) {
        const statusLabels: Record<string, string> = {
          'entregue': '✅ Entregue',
          'a_entregar': '📦 A Entregar',
          'em_falta': '❌ Em Falta',
          'sob_encomenda': '🕐 Sob Encomenda'
        };
        
        message += `\n\n📦 *Resumo dos Produtos:*\n`;
        itemsWithStatus.forEach(item => {
          const statusLabel = statusLabels[item.status] || item.status;
          message += `• ${item.name} (${item.quantity}x) - ${statusLabel}\n`;
        });
      }

      if (estimatedDelivery && newStatus !== 'entregue') {
        const deliveryDate = new Date(estimatedDelivery);
        message += `\n⏰ *Previsão de entrega:*\n${deliveryDate.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`;
      }

      message += `\n\n💬 *Dúvidas?*`;
      if (bancaWhatsapp) {
        const cleanBancaPhone = bancaWhatsapp.replace(/\D/g, '');
        const formattedBancaPhone = cleanBancaPhone.startsWith('55') ? cleanBancaPhone : `55${cleanBancaPhone}`;
        message += `\n👉 Falar com Jornaleiro: https://wa.me/${formattedBancaPhone}`;
      } else {
        message += `\nEntre em contato com a banca!`;
      }
      message += `\n\n`;
      message += `_Atualizado em: ${new Date().toLocaleString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      })}_`;

      console.log('[WhatsAppService] Mensagem formatada:', message);
      console.log('[WhatsAppService] Chamando sendMessage...');

      const result = await this.sendMessage({
        number: formattedPhone,
        text: message
      });

      console.log(`[WhatsAppService] sendMessage retornou: ${result ? 'TRUE (✅ enviado)' : 'FALSE (❌ falhou)'}`);

      if (result) {
        console.log(`[WhatsAppService] ✅ Status enviado para ${formattedPhone} - ${statusInfo.title}`);
      } else {
        console.error(`[WhatsAppService] ❌ Falha ao enviar para ${formattedPhone}`);
      }

      console.log('[WhatsAppService] ===== sendStatusUpdate FIM =====');
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

type ItemWithStatus = {
  name: string;
  quantity: number;
  status: string;
};

export async function sendStatusWhatsAppUpdate(orderId: string, customerPhone: string, newStatus: string, estimatedDelivery?: string, itemsWithStatus?: ItemWithStatus[], bancaWhatsapp?: string, orderNumber?: string) {
  try {
    return await whatsappService.sendStatusUpdate(orderId, customerPhone, newStatus, estimatedDelivery, itemsWithStatus, bancaWhatsapp, orderNumber);
  } catch (error) {
    console.error('Erro na atualização WhatsApp:', error);
    return false;
  }
}
