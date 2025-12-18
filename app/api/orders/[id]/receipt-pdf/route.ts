import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
// @ts-ignore
import PDFDocument from "pdfkit";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('[API/RECEIPT-PDF] ===== INÍCIO =====');
    console.log('[API/RECEIPT-PDF] ID recebido:', id);
    
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
      console.error('[API/RECEIPT-PDF] Erro ao buscar pedido:', error);
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    }
    
    console.log('[API/RECEIPT-PDF] Pedido encontrado:', { 
      id: order.id, 
      order_number: order.order_number,
      customer_name: order.customer_name 
    });

    // Gerar PDF
    const pdfBuffer = await generateReceiptPDF(order);
    
    // Retornar PDF
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="comprovante-${id.substring(0, 8)}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });
    
  } catch (e: any) {
    console.error('[API/RECEIPT-PDF] Erro:', e);
    return NextResponse.json({ error: e?.message || "Erro ao gerar PDF" }, { status: 500 });
  }
}

async function generateReceiptPDF(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [280, 600], // Tamanho tipo cupom fiscal
        margin: 20
      });

      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
      doc.on('end', () => {
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }
        resolve(Buffer.from(result));
      });
      doc.on('error', reject);

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

      // Configuração de fonte
      doc.font('Courier');
      
      // Cabeçalho - Nome da Banca
      doc.fontSize(14).text(bancaInfo.name, { align: 'center' });
      doc.moveDown(0.3);
      
      // Endereço
      if (bancaInfo.address) {
        doc.fontSize(8).text(bancaInfo.address, { align: 'center' });
      }
      if (bancaInfo.phone) {
        doc.fontSize(8).text(bancaInfo.phone, { align: 'center' });
      }
      if (bancaInfo.cnpj) {
        doc.fontSize(8).text(`CNPJ: ${bancaInfo.cnpj}`, { align: 'center' });
      }
      
      // Linha separadora
      doc.moveDown(0.5);
      doc.fontSize(8).text('─'.repeat(35), { align: 'center' });
      doc.moveDown(0.5);
      
      // Info do Cliente
      doc.fontSize(9).text(`CLIENTE: ${(order.customer_name || '').toUpperCase()}`);
      doc.fontSize(8).text(formatDate(order.created_at));
      
      doc.moveDown(0.5);
      
      // Número do Pedido - usar order_number se existir, senão gerar BAN-XXXXXXXX
      const orderNumber = (order.order_number && order.order_number.trim()) 
        ? order.order_number 
        : `BAN-${String(order.id).substring(0, 8).toUpperCase()}`;
      console.log('[PDF] order_number do banco:', order.order_number, '| Usando:', orderNumber);
      doc.fontSize(8).text('COMPROVANTE DE PEDIDO', { align: 'right' });
      doc.fontSize(11).text(`Nº ${orderNumber}`, { align: 'right' });
      
      // Linha separadora
      doc.moveDown(0.3);
      doc.fontSize(8).text('─'.repeat(35), { align: 'center' });
      
      // Cabeçalho da tabela
      doc.moveDown(0.3);
      doc.fontSize(7).text('COD    DESCRIÇÃO              QTD  VALOR');
      doc.fontSize(8).text('─'.repeat(35), { align: 'center' });
      
      // Itens
      items.forEach((item: any, index: number) => {
        const code = String(index + 1).padStart(5, '0');
        const name = (item.product_name || '').substring(0, 18).toUpperCase();
        const qty = String(item.quantity || 1);
        const value = (Number(item.total_price) || 0).toFixed(2);
        
        doc.fontSize(7).text(`${code}  ${name.padEnd(18)} ${qty.padStart(3)}  ${value.padStart(6)}`);
        doc.fontSize(6).text(`       ${item.quantity || 1} x ${(Number(item.unit_price) || 0).toFixed(2)}`, { continued: false });
      });
      
      // Linha separadora
      doc.moveDown(0.3);
      doc.fontSize(8).text('─'.repeat(35), { align: 'center' });
      
      // Totais
      doc.moveDown(0.3);
      doc.fontSize(9).text(`Subtotal:                 R$ ${subtotal.toFixed(2)}`, { align: 'left' });
      
      if (shippingFee > 0) {
        doc.fontSize(9).text(`Frete:                    R$ ${shippingFee.toFixed(2)}`, { align: 'left' });
      }
      
      doc.moveDown(0.3);
      doc.fontSize(8).text('─'.repeat(35), { align: 'center' });
      doc.fontSize(12).text(`TOTAL: R$ ${total.toFixed(2)}`, { align: 'center' });
      doc.fontSize(8).text('─'.repeat(35), { align: 'center' });
      
      // Forma de Pagamento
      doc.moveDown(0.5);
      doc.fontSize(8).text(`FORMA DE PGTO: ${getPaymentMethodLabel(order.payment_method)}`);
      
      // Rodapé
      doc.moveDown(1);
      doc.fontSize(7).text('Receba(s) mercadoria(s) acima', { align: 'center' });
      doc.text('descrita(s), concordando com os', { align: 'center' });
      doc.text('preços e condições.', { align: 'center' });
      
      doc.moveDown(1);
      doc.fontSize(10).text('* OBRIGADO E VOLTE SEMPRE *', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
