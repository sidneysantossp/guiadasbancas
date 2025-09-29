"use client";

import { useRef } from "react";

type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  banca_id: string;
  banca_name: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
};

type OrderReceiptProps = {
  order: Order;
  bancaInfo?: {
    name: string;
    address: string;
    phone: string;
    cnpj?: string;
  };
};

export default function OrderReceipt({ order, bancaInfo }: OrderReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const defaultBancaInfo = {
    name: bancaInfo?.name || "BANCA SÃO JORGE",
    address: bancaInfo?.address || "Rua Augusta, 1024 - Consolação\nCentro - 01305-100 - São Paulo/SP",
    phone: bancaInfo?.phone || "(11) 98765-4321",
    cnpj: bancaInfo?.cnpj || "11.111.111/0001-11"
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
    return labels[method] || method.toUpperCase();
  };

  const generateImage = async () => {
    // Função simplificada - em produção, usar html2canvas ou similar
    return null;
  };

  const shareViaWhatsApp = async () => {
    // Por enquanto, apenas enviar mensagem de texto
    sendWhatsAppMessage();
  };

  const printReceipt = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && receiptRef.current) {
      const receiptHTML = receiptRef.current.outerHTML;
      printWindow.document.write(`
        <html>
          <head>
            <title>Comprovante - Pedido #${order.id}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: 'Courier New', monospace; }
              .bg-\\[\\#f5f5dc\\] { background-color: #f5f5dc !important; }
              .border-2 { border: 2px solid #9ca3af !important; }
              .border-gray-400 { border-color: #9ca3af !important; }
              .text-center { text-align: center !important; }
              .text-right { text-align: right !important; }
              .font-bold { font-weight: bold !important; }
              .text-lg { font-size: 1.125rem !important; }
              .text-sm { font-size: 0.875rem !important; }
              .text-xs { font-size: 0.75rem !important; }
              .grid { display: grid !important; }
              .grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
              .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
              .col-span-2 { grid-column: span 2 / span 2 !important; }
              .col-span-6 { grid-column: span 6 / span 6 !important; }
              .gap-1 { gap: 0.25rem !important; }
              .gap-2 { gap: 0.5rem !important; }
              .p-6 { padding: 1.5rem !important; }
              .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem !important; }
              .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem !important; }
              .pt-1 { padding-top: 0.25rem !important; }
              .pt-2 { padding-top: 0.5rem !important; }
              .pb-4 { padding-bottom: 1rem !important; }
              .mb-2 { margin-bottom: 0.5rem !important; }
              .mb-4 { margin-bottom: 1rem !important; }
              .mt-1 { margin-top: 0.25rem !important; }
              .mt-2 { margin-top: 0.5rem !important; }
              .mt-4 { margin-top: 1rem !important; }
              .ml-8 { margin-left: 2rem !important; }
              .space-y-1 > * + * { margin-top: 0.25rem !important; }
              .space-y-2 > * + * { margin-top: 0.5rem !important; }
              .flex { display: flex !important; }
              .justify-between { justify-content: space-between !important; }
              .border-t { border-top: 1px solid #9ca3af !important; }
              .border-b { border-bottom: 1px solid #9ca3af !important; }
              .border-t-2 { border-top: 2px solid #9ca3af !important; }
              .h-8 { height: 2rem !important; }
              .whitespace-pre-line { white-space: pre-line !important; }
              .text-gray-600 { color: #4b5563 !important; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            ${receiptHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const sendWhatsAppMessage = () => {
    const message = `🧾 *COMPROVANTE DE PEDIDO*\n\n` +
      `📋 Pedido: #${order.id}\n` +
      `👤 Cliente: ${order.customer_name}\n` +
      `💰 Total: R$ ${order.total.toFixed(2)}\n` +
      `📅 Data: ${formatDate(order.created_at)}\n` +
      `💳 Pagamento: ${getPaymentMethodLabel(order.payment_method)}\n\n` +
      `📦 *ITENS DO PEDIDO:*\n` +
      `${order.items.map(item => 
        `• ${item.quantity}x ${item.product_name} - R$ ${item.total_price.toFixed(2)}`
      ).join('\n')}\n\n` +
      `📍 *${defaultBancaInfo.name}*\n` +
      `${defaultBancaInfo.address}\n` +
      `📞 ${defaultBancaInfo.phone}\n\n` +
      `✅ *Pedido confirmado!*\n` +
      `Obrigado pela preferência! 🙏`;

    const phone = order.customer_phone.replace(/\D/g, '');
    const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Comprovante */}
      <div 
        ref={receiptRef}
        className="bg-[#f5f5dc] border-2 border-gray-400 p-6 font-mono text-sm max-w-md mx-auto"
        style={{ fontFamily: 'Courier New, monospace' }}
      >
        {/* Cabeçalho */}
        <div className="text-center border-b-2 border-gray-400 pb-4 mb-4">
          <div className="text-lg font-bold">{defaultBancaInfo.name}</div>
          <div className="text-xs mt-1 whitespace-pre-line">{defaultBancaInfo.address}</div>
          <div className="text-xs">{defaultBancaInfo.phone}</div>
          <div className="text-xs">CNPJ: {defaultBancaInfo.cnpj}</div>
        </div>

        {/* Informações do Cliente */}
        <div className="mb-4">
          <div className="text-xs">CLIENTE: {order.customer_name.toUpperCase()}</div>
          <div className="text-xs">{formatDate(order.created_at)}</div>
        </div>

        {/* Número do Pedido */}
        <div className="text-right mb-4">
          <div className="text-xs">COMPROVANTE DE PEDIDO</div>
          <div className="text-lg font-bold">Nº {order.id}</div>
        </div>

        {/* Cabeçalho da Tabela */}
        <div className="border-t-2 border-b border-gray-400 py-1">
          <div className="grid grid-cols-12 gap-1 text-xs font-bold">
            <div className="col-span-2">CÓDIGO</div>
            <div className="col-span-6">DESCRIÇÃO</div>
            <div className="col-span-2 text-center">QTD</div>
            <div className="col-span-2 text-right">VALOR</div>
          </div>
        </div>

        {/* Itens */}
        <div className="border-b border-gray-400 py-2">
          {order.items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="grid grid-cols-12 gap-1 text-xs">
                <div className="col-span-2">{String(index + 1).padStart(5, '0')}</div>
                <div className="col-span-6">{item.product_name.toUpperCase()}</div>
                <div className="col-span-2 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">{item.total_price.toFixed(2)}</div>
              </div>
              <div className="text-xs ml-8 text-gray-600">
                {item.quantity} x {item.unit_price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totais */}
        <div className="py-2 space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>R$ {order.subtotal.toFixed(2)}</span>
          </div>
          {order.shipping_fee > 0 && (
            <div className="flex justify-between text-sm">
              <span>Frete:</span>
              <span>R$ {order.shipping_fee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-400 pt-1">
            <span>Total da Nota R$</span>
            <span>{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="border-t border-gray-400 pt-2 mb-4">
          <div className="text-xs font-bold">FORMA DE PGTO.: {getPaymentMethodLabel(order.payment_method)}</div>
          <div className="grid grid-cols-3 gap-2 text-xs mt-1">
            <div>
              <div>DATA PGTO</div>
              <div>{formatDate(order.created_at).split(' ')[0]}</div>
            </div>
            <div>
              <div>R$ VALOR</div>
              <div>{order.total.toFixed(2)}</div>
            </div>
            <div>
              <div>TIPO PGTO</div>
              <div>{getPaymentMethodLabel(order.payment_method)}</div>
            </div>
          </div>
        </div>

        {/* Vendedor */}
        <div className="text-xs border-t border-gray-400 pt-2 mb-4">
          VENDEDOR(A): {defaultBancaInfo.name}
        </div>

        {/* Números de Série */}
        <div className="text-xs mb-4">
          <div>Números de Série:</div>
          <div>{order.id}HVDDB1808</div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs border-t border-gray-400 pt-2 space-y-2">
          <div>Receba(s) mercadoria(s) acima descrita(s), concordando</div>
          <div>plenamente com os preços e condições de garantia.</div>
          
          <div className="border-t border-gray-400 mt-4 pt-2">
            <div>ASSINATURA DO CLIENTE</div>
            <div className="h-8 border-b border-gray-400 mt-2"></div>
          </div>
          
          <div className="font-bold mt-4">
            * OBRIGADO E VOLTE SEMPRE *
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={printReceipt}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir Comprovante
        </button>
        
        <button
          onClick={sendWhatsAppMessage}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
          </svg>
          Enviar WhatsApp
        </button>
      </div>
    </div>
  );
}
