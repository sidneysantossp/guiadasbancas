import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import puppeteer from "puppeteer";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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

    // Gerar HTML do comprovante
    const html = generateReceiptHTML(order);
    
    // Usar Puppeteer para gerar imagem
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 500, height: 800 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Capturar screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    });
    
    await browser.close();
    
    // Retornar imagem como base64 ou como arquivo
    const format = req.nextUrl.searchParams.get('format');
    
    if (format === 'base64') {
      const base64 = Buffer.from(screenshot).toString('base64');
      return NextResponse.json({ 
        success: true, 
        image: `data:image/png;base64,${base64}`,
        imageBase64: base64
      });
    }
    
    // Retornar como imagem diretamente
    const base64 = Buffer.from(screenshot).toString('base64');
    return NextResponse.json({ 
      success: true, 
      image: `data:image/png;base64,${base64}`,
      imageBase64: base64
    });
    
  } catch (e: any) {
    console.error('[API/RECEIPT-IMAGE] Erro:', e);
    return NextResponse.json({ error: e?.message || "Erro ao gerar imagem" }, { status: 500 });
  }
}

function generateReceiptHTML(order: any): string {
  const bancaInfo = {
    name: order.bancas?.name || order.banca_name || "BANCA",
    address: order.bancas?.address || "Endereço não informado",
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

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Courier New', monospace; 
          background: #f5f5dc;
          padding: 24px;
          font-size: 14px;
          color: #000;
        }
        .receipt {
          background: #f5f5dc;
          border: 2px solid #9ca3af;
          padding: 24px;
          max-width: 450px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #9ca3af;
          padding-bottom: 16px;
          margin-bottom: 16px;
        }
        .header h1 {
          font-size: 20px;
          font-weight: bold;
        }
        .header .info {
          font-size: 12px;
          margin-top: 8px;
          white-space: pre-line;
        }
        .client-info {
          margin-bottom: 16px;
          font-size: 12px;
        }
        .order-number {
          text-align: right;
          margin-bottom: 16px;
        }
        .order-number .label {
          font-size: 12px;
        }
        .order-number .number {
          font-size: 18px;
          font-weight: bold;
          word-break: break-all;
        }
        .table-header {
          display: grid;
          grid-template-columns: 60px 1fr 50px 70px;
          gap: 8px;
          border-top: 2px solid #9ca3af;
          border-bottom: 1px solid #9ca3af;
          padding: 8px 0;
          font-size: 12px;
          font-weight: bold;
        }
        .table-header .qty { text-align: center; }
        .table-header .value { text-align: right; }
        .items {
          border-bottom: 1px solid #9ca3af;
          padding: 8px 0;
        }
        .item {
          margin-bottom: 12px;
        }
        .item-row {
          display: grid;
          grid-template-columns: 60px 1fr 50px 70px;
          gap: 8px;
          font-size: 12px;
        }
        .item-row .qty { text-align: center; }
        .item-row .value { text-align: right; }
        .item-detail {
          font-size: 11px;
          color: #666;
          margin-left: 68px;
        }
        .totals {
          padding: 12px 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          margin-bottom: 4px;
        }
        .total-row.grand {
          font-size: 18px;
          font-weight: bold;
          border-top: 1px solid #9ca3af;
          padding-top: 8px;
          margin-top: 8px;
        }
        .payment {
          border-top: 1px solid #9ca3af;
          padding-top: 12px;
          margin-bottom: 16px;
        }
        .payment-title {
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .payment-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          font-size: 11px;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          border-top: 1px solid #9ca3af;
          padding-top: 12px;
        }
        .footer .thanks {
          font-weight: bold;
          margin-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>${bancaInfo.name}</h1>
          <div class="info">${bancaInfo.address}</div>
          ${bancaInfo.phone ? `<div class="info">${bancaInfo.phone}</div>` : ''}
          ${bancaInfo.cnpj ? `<div class="info">CNPJ: ${bancaInfo.cnpj}</div>` : ''}
        </div>

        <div class="client-info">
          <div>CLIENTE: ${(order.customer_name || '').toUpperCase()}</div>
          <div>${formatDate(order.created_at)}</div>
        </div>

        <div class="order-number">
          <div class="label">COMPROVANTE DE PEDIDO</div>
          <div class="number">Nº ${order.id.substring(0, 8)}</div>
        </div>

        <div class="table-header">
          <div>CÓDIGO</div>
          <div>DESCRIÇÃO</div>
          <div class="qty">QTD</div>
          <div class="value">VALOR</div>
        </div>

        <div class="items">
          ${items.map((item: any, index: number) => `
            <div class="item">
              <div class="item-row">
                <div>${String(index + 1).padStart(5, '0')}</div>
                <div>${(item.product_name || '').toUpperCase()}</div>
                <div class="qty">${item.quantity || 1}</div>
                <div class="value">${(Number(item.total_price) || 0).toFixed(2)}</div>
              </div>
              <div class="item-detail">${item.quantity || 1} x ${(Number(item.unit_price) || 0).toFixed(2)}</div>
            </div>
          `).join('')}
        </div>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
          ${shippingFee > 0 ? `
            <div class="total-row">
              <span>Frete:</span>
              <span>R$ ${shippingFee.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="total-row grand">
            <span>Total da Nota R$</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="payment">
          <div class="payment-title">FORMA DE PGTO.: ${getPaymentMethodLabel(order.payment_method)}</div>
          <div class="payment-grid">
            <div>
              <div>DATA PGTO</div>
              <div>${formatDate(order.created_at).split(',')[0]}</div>
            </div>
            <div>
              <div>R$ VALOR</div>
              <div>${total.toFixed(2)}</div>
            </div>
            <div>
              <div>TIPO PGTO</div>
              <div>${getPaymentMethodLabel(order.payment_method)}</div>
            </div>
          </div>
        </div>

        <div class="footer">
          <div>Receba(s) mercadoria(s) acima descrita(s),</div>
          <div>concordando com os preços e condições.</div>
          <div class="thanks">* OBRIGADO E VOLTE SEMPRE *</div>
        </div>
      </div>
    </body>
    </html>
  `;
}
