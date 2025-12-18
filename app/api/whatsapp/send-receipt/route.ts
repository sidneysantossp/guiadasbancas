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
    const config = getWhatsAppConfig();
    
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
          whatsapp,
          cnpj
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

    // Preparar dados para a API de imagem
    const orderDataForImage = {
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customer_name,
      created_at: order.created_at,
      subtotal: order.subtotal,
      shipping_fee: order.shipping_fee,
      total: order.total,
      payment_method: order.payment_method,
      items: (order.items || []).slice(0, 5).map((item: any) => ({
        product_name: item.product_name,
        quantity: item.quantity,
        total_price: item.total_price
      })),
      banca_name: order.bancas?.name || order.banca_name,
      banca_address: order.bancas?.address || '',
      banca_phone: order.bancas?.whatsapp || '',
      banca_cnpj: order.bancas?.cnpj || ''
    };

    // Gerar imagem do comprovante
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}` || 'http://localhost:3000';
    const encodedData = encodeURIComponent(JSON.stringify(orderDataForImage));
    const receiptImageUrl = `${baseUrl}/api/orders/${orderId}/receipt-image?format=base64&data=${encodedData}`;
    
    console.log('[WhatsApp Send Receipt] Gerando imagem...');
    
    const imageResponse = await fetch(receiptImageUrl);
    
    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('[WhatsApp Send Receipt] Erro ao gerar imagem:', errorText);
      return NextResponse.json({ success: false, error: 'Erro ao gerar imagem do comprovante' });
    }
    
    const imageData = await imageResponse.json();
    
    if (!imageData.imageBase64) {
      console.error('[WhatsApp Send Receipt] imageBase64 não encontrado na resposta');
      return NextResponse.json({ success: false, error: 'Imagem não gerada' });
    }

    // Formatar telefone
    const cleanPhone = String(customerPhone).replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    console.log('[WhatsApp Send Receipt] Enviando imagem para:', formattedPhone);

    // Enviar imagem via Evolution API
    const payload = {
      number: formattedPhone,
      mediatype: 'image',
      media: imageData.imageBase64,
      caption: '🧾 Comprovante do seu pedido'
    };

    const response = await fetch(`${config.baseUrl}/message/sendMedia/${config.instanceName}`, {
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
