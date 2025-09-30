import { NextRequest, NextResponse } from "next/server";
import { sendOrderWhatsAppNotification, sendStatusWhatsAppUpdate, type OrderWhatsAppData } from "@/lib/whatsapp";
import { auth } from "@/lib/auth";

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

// Array de pedidos - começa vazio, pedidos reais serão adicionados via POST
let ORDERS: Order[] = [];

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role as string | undefined;
    const userBancaId = (session?.user as any)?.banca_id as string | undefined;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const q = (searchParams.get("q") || "").toLowerCase();
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const bancaIdFilter = searchParams.get("banca_id") || "";
    
    // Filtrar pedidos
    let filtered = ORDERS.filter((r) =>
      (!status || r.status === status) && 
      (!q || 
        `#${r.id}`.toLowerCase().includes(q) || 
        r.customer_name.toLowerCase().includes(q) ||
        r.customer_phone.includes(q)
      )
    );

    // Escopo por banca: jornaleiro vê apenas os pedidos da própria banca
    if (userRole === 'jornaleiro' && userBancaId) {
      filtered = filtered.filter(r => r.banca_id === userBancaId);
    } else if (bancaIdFilter) {
      filtered = filtered.filter(r => r.banca_id === bancaIdFilter);
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      let aVal: any = a[sort as keyof Order];
      let bVal: any = b[sort as keyof Order];
      
      if (sort === "total" || sort === "subtotal") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      
      if (order === "desc") {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });
    
    // Paginar
    const total = filtered.length;
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);
  
    return NextResponse.json({ 
      items, 
      total, 
      page, 
      limit,
      pages: Math.ceil(total / limit)
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao buscar pedidos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const orderId = `ORD-${Date.now()}`;
    
    // Extrair dados do payload do checkout
    const customer = body.customer || {};
    const address = body.address || {};
    const pricing = body.pricing || {};
    const items = body.items || [];
    
    // Criar endereço formatado
    const fullAddress = [
      address.street,
      address.houseNumber,
      address.neighborhood,
      address.city && address.uf ? `${address.city} - ${address.uf}` : '',
      address.cep ? `CEP: ${address.cep}` : ''
    ].filter(Boolean).join(', ');
    
    // Mapear itens para o formato correto
    const orderItems: OrderItem[] = items.map((item: any, index: number) => ({
      id: `item-${index + 1}`,
      product_id: item.id || `prod-${index + 1}`,
      product_name: item.name || 'Produto',
      product_image: item.image || '',
      quantity: item.qty || 1,
      unit_price: item.price || 0,
      total_price: (item.price || 0) * (item.qty || 1)
    }));
    
    // Criar novo pedido
    // Determinar banca
    const sessionBancaId = (session?.user as any)?.banca_id as string | undefined;
    const inferredBancaId = body.banca_id || items[0]?.banca_id || sessionBancaId || "unknown";
    const inferredBancaName = body.banca_name || "Minha Banca";

    const newOrder: Order = {
      id: orderId,
      customer_name: customer.name || "Cliente",
      customer_phone: customer.phone || "",
      customer_email: customer.email || "",
      customer_address: fullAddress,
      banca_id: inferredBancaId,
      banca_name: inferredBancaName,
      items: orderItems,
      subtotal: pricing.subtotal || 0,
      shipping_fee: pricing.shipping || 0,
      total: pricing.total || 0,
      status: "novo",
      payment_method: body.payment || "pix",
      notes: body.shippingMethod ? `Entrega: ${body.shippingMethod}` : "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimated_delivery: ""
    };
    
    // Adicionar ao array de pedidos
    ORDERS.unshift(newOrder);
    
    // Log em server para inspeção
    // eslint-disable-next-line no-console
    console.log("[NOVO PEDIDO CRIADO]", { orderId, customer: newOrder.customer_name, total: newOrder.total });
    
    // Enviar notificação WhatsApp para o jornaleiro (assíncrono)
    try {
      const whatsappData: OrderWhatsAppData = {
        orderId,
        customerName: newOrder.customer_name,
        customerPhone: newOrder.customer_phone,
        items: newOrder.items.map(item => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        })),
        total: newOrder.total,
        shippingMethod: body.shippingMethod || 'Não especificado',
        paymentMethod: newOrder.payment_method,
        address: newOrder.customer_address,
        notes: newOrder.notes
      };
      
      // ID da banca (em produção, virá do pedido ou usuário logado)
      const bancaId = 'banca-001'; // Simulação - em produção pegar do contexto
      
      // Enviar notificação usando instância centralizada (não aguarda para não bloquear a resposta)
      import('@/lib/whatsapp').then(({ whatsappService }) => {
        whatsappService.sendOrderNotificationToJornaleiro(bancaId, whatsappData)
          .then((success: boolean) => {
            if (success) {
              console.log(`[WHATSAPP] Notificação enviada para banca ${bancaId} - Pedido #${orderId}`);
            } else {
              console.warn(`[WHATSAPP] Falha ao enviar notificação - Pedido #${orderId}`);
            }
          })
          .catch((error: any) => {
            console.error(`[WHATSAPP] Erro ao enviar notificação - Pedido #${orderId}:`, error);
          });
      }).catch((error: any) => {
        console.error('[WHATSAPP] Erro ao importar serviço WhatsApp:', error);
      });
    } catch (error) {
      console.error('[WHATSAPP] Erro na configuração da notificação:', error);
    }
    
    return NextResponse.json({ ok: true, orderId, data: newOrder }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao criar pedido" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, estimated_delivery } = body || {};
    const idx = ORDERS.findIndex((o) => o.id === id);
    if (idx === -1) return NextResponse.json({ ok: false, error: "Pedido não encontrado" }, { status: 404 });
    
    // Atualizar campos
    const oldStatus = ORDERS[idx].status;
    if (status) ORDERS[idx].status = status;
    if (notes !== undefined) ORDERS[idx].notes = notes;
    if (estimated_delivery) ORDERS[idx].estimated_delivery = estimated_delivery;
    ORDERS[idx].updated_at = new Date().toISOString();
    
    // Enviar notificação WhatsApp para o cliente se o status mudou
    if (status && status !== oldStatus && ORDERS[idx].customer_phone) {
      try {
        sendStatusWhatsAppUpdate(
          ORDERS[idx].id,
          ORDERS[idx].customer_phone,
          status,
          estimated_delivery
        )
          .then(success => {
            if (success) {
              console.log(`[WHATSAPP] Atualização de status enviada para cliente - Pedido #${id}`);
            } else {
              console.warn(`[WHATSAPP] Falha ao enviar atualização de status - Pedido #${id}`);
            }
          })
          .catch(error => {
            console.error(`[WHATSAPP] Erro ao enviar atualização de status - Pedido #${id}:`, error);
          });
      } catch (error) {
        console.error('[WHATSAPP] Erro na configuração da atualização:', error);
      }
    }
    
    return NextResponse.json({ ok: true, data: ORDERS[idx] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao atualizar pedido" }, { status: 500 });
  }
}
