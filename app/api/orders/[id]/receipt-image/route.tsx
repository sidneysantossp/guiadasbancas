import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Buscar pedido
    const { data: order, error } = await supabaseAdmin
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
      .eq('id', id)
      .single();
    
    if (error || !order) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }

    const bancaInfo = {
      name: order.bancas?.name || order.banca_name || "BANCA",
      address: order.bancas?.address || "",
      phone: order.bancas?.whatsapp || "",
      cnpj: order.bancas?.cnpj || ""
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getPaymentMethodLabel = (method: string) => {
      const labels: Record<string, string> = {
        'pix': 'PIX',
        'cartao': 'CARTÃO',
        'dinheiro': 'DINHEIRO',
        'credito': 'CRÉDITO',
        'debito': 'DÉBITO'
      };
      return labels[method] || method?.toUpperCase() || 'N/A';
    };

    const items = order.items || [];
    const subtotal = Number(order.subtotal) || 0;
    const shippingFee = Number(order.shipping_fee) || 0;
    const total = Number(order.total) || 0;
    const orderNumber = (order.order_number && order.order_number.trim()) 
      ? order.order_number 
      : `BAN-${String(order.id).substring(0, 8).toUpperCase()}`;

    // Verificar se é para retornar base64
    const format = req.nextUrl.searchParams.get('format');

    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '400px',
            backgroundColor: '#f5f5dc',
            padding: '24px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#000',
            border: '2px solid #9ca3af',
          }}
        >
          {/* Cabeçalho */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '2px solid #9ca3af', paddingBottom: '16px', marginBottom: '16px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{bancaInfo.name}</div>
            {bancaInfo.address && <div style={{ fontSize: '11px', marginTop: '4px', textAlign: 'center' }}>{bancaInfo.address}</div>}
            {bancaInfo.phone && <div style={{ fontSize: '11px' }}>{bancaInfo.phone}</div>}
            {bancaInfo.cnpj && <div style={{ fontSize: '11px' }}>CNPJ: {bancaInfo.cnpj}</div>}
          </div>

          {/* Cliente e Data */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px' }}>CLIENTE: {(order.customer_name || '').toUpperCase()}</div>
            <div style={{ fontSize: '11px' }}>{formatDate(order.created_at)}</div>
          </div>

          {/* Número do Pedido */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px' }}>COMPROVANTE DE PEDIDO</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Nº {orderNumber}</div>
          </div>

          {/* Tabela de Itens */}
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #9ca3af', borderBottom: '1px solid #9ca3af', padding: '8px 0' }}>
            <div style={{ display: 'flex', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px' }}>
              <div style={{ width: '50px' }}>CÓD</div>
              <div style={{ flex: 1 }}>DESCRIÇÃO</div>
              <div style={{ width: '40px', textAlign: 'center' }}>QTD</div>
              <div style={{ width: '60px', textAlign: 'right' }}>VALOR</div>
            </div>
            {items.slice(0, 5).map((item: any, index: number) => (
              <div key={index} style={{ display: 'flex', fontSize: '10px', marginBottom: '4px' }}>
                <div style={{ width: '50px' }}>{String(index + 1).padStart(5, '0')}</div>
                <div style={{ flex: 1 }}>{(item.product_name || '').substring(0, 20).toUpperCase()}</div>
                <div style={{ width: '40px', textAlign: 'center' }}>{item.quantity || 1}</div>
                <div style={{ width: '60px', textAlign: 'right' }}>{(Number(item.total_price) || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Totais */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', borderBottom: '1px solid #9ca3af' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            {shippingFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Frete:</span>
                <span>R$ {shippingFee.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginTop: '8px', borderTop: '1px solid #9ca3af', paddingTop: '8px' }}>
              <span>TOTAL:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Pagamento */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 0', fontSize: '11px' }}>
            <div style={{ fontWeight: 'bold' }}>FORMA DE PGTO: {getPaymentMethodLabel(order.payment_method)}</div>
          </div>

          {/* Rodapé */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid #9ca3af', paddingTop: '12px', fontSize: '10px' }}>
            <div>Receba(s) mercadoria(s) acima descrita(s),</div>
            <div>concordando com os preços e condições.</div>
            <div style={{ fontWeight: 'bold', marginTop: '12px', fontSize: '12px' }}>* OBRIGADO E VOLTE SEMPRE *</div>
          </div>
        </div>
      ),
      {
        width: 450,
        height: 600,
      }
    );

    if (format === 'base64') {
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      return NextResponse.json({
        success: true,
        imageBase64: base64,
        image: `data:image/png;base64,${base64}`
      });
    }

    return imageResponse;

  } catch (e: any) {
    console.error('[API/RECEIPT-IMAGE] Erro:', e);
    return NextResponse.json({ error: e?.message || "Erro ao gerar imagem" }, { status: 500 });
  }
}
