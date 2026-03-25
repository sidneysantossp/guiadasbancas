import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * API para enviar comprovante do pedido como IMAGEM via WhatsApp
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerPhone } = body;

    console.log('[WhatsApp Send Receipt] ===== INÍCIO =====');
    console.log('[WhatsApp Send Receipt] orderId:', orderId);
    console.log('[WhatsApp Send Receipt] customerPhone:', customerPhone);

    if (!orderId || !customerPhone) {
      return NextResponse.json(
        { error: 'orderId e customerPhone são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar configuração do WhatsApp
    const config = await getWhatsAppConfig();
    
    if (!config.isActive) {
      console.warn('[WhatsApp Send Receipt] Integração inativa');
      return NextResponse.json({ success: false, error: 'Integração WhatsApp inativa' });
    }

    // Buscar dados do pedido
    console.log('[WhatsApp Send Receipt] Buscando pedido com ID:', orderId);
    
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        bancas:banca_id (
          id,
          name,
          address,
          whatsapp
        )
      `)
      .eq('id', orderId)
      .single();
    
    console.log('[WhatsApp Send Receipt] Resultado da busca:', { 
      found: !!order, 
      error: orderError?.message,
      orderId: order?.id,
      customerName: order?.customer_name
    });
    
    if (orderError || !order) {
      console.error('[WhatsApp Send Receipt] Erro ao buscar pedido:', orderError);
      return NextResponse.json({ success: false, error: `Pedido não encontrado: ${orderError?.message || 'ID inválido'}` });
    }

    // Formatar dados do comprovante
    const orderNumber = (order.order_number && order.order_number.trim()) 
      ? order.order_number 
      : `BAN-${String(order.id).substring(0, 8).toUpperCase()}`;
    
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    };

    const getPaymentLabel = (method: string) => {
      const labels: Record<string, string> = {
        'pix': 'PIX', 'cartao': 'CARTÃO', 'dinheiro': 'DINHEIRO',
        'credito': 'CRÉDITO', 'debito': 'DÉBITO'
      };
      return labels[method] || method?.toUpperCase() || 'N/A';
    };

    const items = order.items || [];
    const bancaName = order.bancas?.name || order.banca_name || 'Banca';

    // Montar mensagem formatada
    const message = `🧾 *COMPROVANTE DE PEDIDO*
━━━━━━━━━━━━━━━━━━━━━━

📋 *Pedido:* ${orderNumber}
📅 *Data:* ${formatDate(order.created_at)}
👤 *Cliente:* ${order.customer_name}

━━━━━━━━━━━━━━━━━━━━━━
📦 *ITENS DO PEDIDO:*
${items.map((item: any) => `• ${item.quantity}x ${item.product_name} - R$ ${Number(item.total_price).toFixed(2)}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* R$ ${Number(order.subtotal).toFixed(2)}
🚚 *Frete:* R$ ${Number(order.shipping_fee || 0).toFixed(2)}
💵 *TOTAL:* R$ ${Number(order.total).toFixed(2)}

💳 *Pagamento:* ${getPaymentLabel(order.payment_method)}

━━━━━━━━━━━━━━━━━━━━━━
🏪 *${bancaName}*

✅ *Pedido confirmado!*
Obrigado pela preferência! 🙏`;

    // Formatar telefone
    const cleanPhone = String(customerPhone).replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    console.log('[WhatsApp Send Receipt] Enviando mensagem para:', formattedPhone);

    // Enviar mensagem de texto via Evolution API
    const payload = {
      number: formattedPhone,
      text: message
    };

    const response = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify(payload)
    });

    console.log('[WhatsApp Send Receipt] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WhatsApp Send Receipt] Erro ao enviar:', errorText);
      return NextResponse.json({ success: false, error: 'Erro ao enviar imagem via WhatsApp' });
    }

    const result = await response.json();
    console.log('[WhatsApp Send Receipt] Resultado:', result);

    const success = result.key?.id ? true : false;
    
    console.log('[WhatsApp Send Receipt] ===== FIM =====', success ? '✅' : '❌');

    return NextResponse.json({
      success,
      message: success ? 'Comprovante enviado com sucesso!' : 'Falha ao enviar comprovante'
    });

  } catch (e: any) {
    console.error('[WhatsApp Send Receipt] Erro:', e);
    return NextResponse.json({ success: false, error: e?.message || 'Erro interno' }, { status: 500 });
  }
}
