import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

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

    // Gerar imagem do comprovante
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const receiptImageUrl = `${baseUrl}/api/orders/${orderId}/receipt-image?format=base64`;
    
    console.log('[WhatsApp Send Receipt] Buscando imagem:', receiptImageUrl);
    
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
