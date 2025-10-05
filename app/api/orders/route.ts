import { NextRequest, NextResponse } from "next/server";
import { sendOrderWhatsAppNotification, sendStatusWhatsAppUpdate, type OrderWhatsAppData } from "@/lib/whatsapp";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

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
    
    // Buscar pedidos do Supabase
    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        bancas:banca_id (
          id,
          name,
          address,
          whatsapp
        )
      `, { count: 'exact' });

    // Filtrar por status
    if (status) {
      query = query.eq('status', status);
    }

    // Filtrar por banca (jornaleiro só vê pedidos da própria banca)
    if (userRole === 'jornaleiro' && userBancaId) {
      query = query.eq('banca_id', userBancaId);
    } else if (bancaIdFilter) {
      query = query.eq('banca_id', bancaIdFilter);
    }

    // Busca por texto
    if (q) {
      query = query.or(`id.ilike.%${q}%,customer_name.ilike.%${q}%,customer_phone.ilike.%${q}%`);
    }

    // Ordenar
    query = query.order(sort, { ascending: order === 'asc' });

    // Paginar
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[API/ORDERS/GET] Erro ao buscar pedidos:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Formatar dados para o formato esperado pelo frontend
    const items = (data || []).map((order: any) => ({
      id: order.id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email,
      customer_address: order.customer_address,
      banca_id: order.banca_id,
      banca_name: order.bancas?.name || 'Banca',
      banca_address: order.bancas?.address || '',
      banca_whatsapp: order.bancas?.whatsapp || '',
      items: order.items,
      subtotal: Number(order.subtotal),
      shipping_fee: Number(order.shipping_fee),
      total: Number(order.total),
      status: order.status,
      payment_method: order.payment_method,
      notes: order.notes,
      created_at: order.created_at,
      updated_at: order.updated_at,
      estimated_delivery: order.estimated_delivery
    }));
  
    return NextResponse.json({ 
      items, 
      total: count || 0, 
      page, 
      limit,
      pages: Math.ceil((count || 0) / limit)
    });
  } catch (e: any) {
    console.error('[API/ORDERS/GET] Erro:', e);
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao buscar pedidos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const orderNumber = `ORD-${Date.now()}`;
    
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
    
    // Determinar banca_id
    const sessionBancaId = (session?.user as any)?.banca_id as string | undefined;
    const inferredBancaId = body.banca_id || items[0]?.banca_id || sessionBancaId;

    if (!inferredBancaId) {
      return NextResponse.json({ ok: false, error: "Banca não identificada" }, { status: 400 });
    }

    // Buscar dados da banca no Supabase
    const { data: banca, error: bancaError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, whatsapp')
      .eq('id', inferredBancaId)
      .single();

    if (bancaError || !banca) {
      console.error('[API/ORDERS/POST] Erro ao buscar banca:', bancaError);
      return NextResponse.json({ ok: false, error: "Banca não encontrada" }, { status: 404 });
    }

    // Criar pedido no Supabase (id será UUID gerado automaticamente)
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: customer.name || "Cliente",
        customer_phone: customer.phone || "",
        customer_email: customer.email || "",
        customer_address: fullAddress,
        banca_id: inferredBancaId,
        items: orderItems,
        subtotal: pricing.subtotal || 0,
        shipping_fee: pricing.shipping || 0,
        total: pricing.total || 0,
        status: "novo",
        payment_method: body.payment || "pix",
        notes: body.shippingMethod ? `Entrega: ${body.shippingMethod}` : ""
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error('[API/ORDERS/POST] Erro ao criar pedido:', orderError);
      return NextResponse.json({ ok: false, error: orderError?.message || "Erro ao criar pedido" }, { status: 500 });
    }
    
    // Log em server para inspeção
    console.log("[NOVO PEDIDO CRIADO]", { 
      id: newOrder.id, 
      orderNumber, 
      customer: customer.name, 
      total: pricing.total, 
      banca: banca.name 
    });
    
    // Enviar notificação WhatsApp para o jornaleiro (utilizando config centralizada)
    if (banca.whatsapp) {
      try {
        const config = getWhatsAppConfig();

        if (!config.isActive) {
          console.warn(`[WHATSAPP] ⚠️ Integração inativa no painel. Pedido #${orderNumber}`);
        } else if (!config.baseUrl || !config.apiKey || !config.instanceName) {
          console.warn(`[WHATSAPP] ⚠️ Configuração incompleta (baseUrl/apiKey/instanceName). Pedido #${orderNumber}`);
        } else {
          // Formatar mensagem
          const message = `🛒 *NOVO PEDIDO - ${banca.name}*\n\n` +
            `📋 *Pedido:* #${orderNumber}\n` +
            `👤 *Cliente:* ${customer.name || "Cliente"}\n` +
            `📱 *Telefone:* ${customer.phone || ""}\n\n` +
            `📦 *Produtos:*\n` +
            orderItems.map((item, i) =>
              `${i + 1}. ${item.product_name}\n   Qtd: ${item.quantity}x | Valor: R$ ${item.unit_price.toFixed(2)}`
            ).join('\n') +
            `\n\n💰 *Total:* R$ ${(pricing.total || 0).toFixed(2)}\n` +
            `🚚 *Entrega:* ${body.shippingMethod || 'Não especificado'}\n` +
            `💳 *Pagamento:* ${body.payment || 'pix'}\n` +
            (fullAddress ? `📍 *Endereço:* ${fullAddress}\n` : '') +
            (body.shippingMethod ? `📝 *Obs:* Entrega: ${body.shippingMethod}\n` : '') +
            `\n⏰ *Recebido em:* ${new Date().toLocaleString('pt-BR')}\n` +
            `\n✅ Acesse seu painel para gerenciar este pedido.`;

          // Formatar telefone da banca
          const cleanPhone = banca.whatsapp.replace(/\D/g, '');
          const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

          const response = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': config.apiKey
            },
            body: JSON.stringify({
              number: formattedPhone,
              text: message
            })
          });

          if (!response.ok) {
            const error = await response.text();
            console.warn(`[WHATSAPP] ❌ Falha ao enviar (status ${response.status}) - Pedido #${orderNumber} -> ${error}`);
          } else {
            const payloadResp = await response.json().catch(() => null);
            console.log(`[WHATSAPP] ✅ Notificação enviada para ${banca.name} (${formattedPhone}) - Pedido #${orderNumber}`, {
              messageId: payloadResp?.key?.id
            });
          }
        }
      } catch (error) {
        console.error('[WHATSAPP] ❌ Erro ao enviar notificação:', error);
      }
    } else {
      console.warn(`[WHATSAPP] ⚠️ Banca ${banca.name} não tem WhatsApp configurado`);
    }
    
    // Retornar dados do pedido com informações da banca
    return NextResponse.json({ 
      ok: true, 
      orderId: newOrder.id, // UUID do banco
      orderNumber: orderNumber, // Número de exibição
      data: {
        ...newOrder,
        banca_name: banca.name,
        banca_address: banca.address,
        banca_whatsapp: banca.whatsapp
      }
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao criar pedido" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, estimated_delivery } = body || {};
    
    // Buscar pedido atual no Supabase
    const { data: currentOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ ok: false, error: "Pedido não encontrado" }, { status: 404 });
    }
    
    const oldStatus = currentOrder.status;
    
    // Atualizar pedido no Supabase
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (estimated_delivery) updateData.estimated_delivery = estimated_delivery;

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('[API/ORDERS/PATCH] Erro ao atualizar pedido:', updateError);
      return NextResponse.json({ ok: false, error: updateError?.message || "Erro ao atualizar pedido" }, { status: 500 });
    }
    
    // Enviar notificação WhatsApp para o cliente se o status mudou
    if (status && status !== oldStatus && updatedOrder.customer_phone) {
      try {
        const config = getWhatsAppConfig();

        if (!config.isActive) {
          console.warn(`[WHATSAPP] ⚠️ Integração inativa para atualização de status. Pedido #${updatedOrder.order_number || updatedOrder.id}`);
        } else if (!config.baseUrl || !config.apiKey || !config.instanceName) {
          console.warn(`[WHATSAPP] ⚠️ Configuração incompleta (baseUrl/apiKey/instanceName) para atualização de status. Pedido #${updatedOrder.order_number || updatedOrder.id}`);
        } else {
          const statusMessages: Record<string, string> = {
            confirmado: '✅ Seu pedido foi confirmado e já estamos preparando tudo!',
            em_preparo: '📦 Seu pedido está em preparo neste momento!',
            saiu_para_entrega: '🚚 Seu pedido saiu para entrega! Fique atento ao telefone.',
            entregue: '🎉 Pedido entregue com sucesso! Obrigado pela preferência.'
          };

          let message = `📋 *Atualização do Pedido* ${updatedOrder.order_number ? `#${updatedOrder.order_number}` : ''}\n\n`;
          message += statusMessages[status] || `Status atualizado para: ${status}`;

          if (estimated_delivery) {
            const deliveryDate = new Date(estimated_delivery);
            if (!Number.isNaN(deliveryDate.getTime())) {
              message += `\n\n⏰ *Previsão de entrega:* ${deliveryDate.toLocaleString('pt-BR')}`;
            }
          }

          message += `\n\n💬 Qualquer dúvida, fale conosco pelo WhatsApp da banca!`;

          const cleanPhone = String(updatedOrder.customer_phone).replace(/\D/g, '');
          const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

          const response = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': config.apiKey
            },
            body: JSON.stringify({
              number: formattedPhone,
              text: message
            })
          });

          if (!response.ok) {
            const error = await response.text();
            console.warn(`[WHATSAPP] ❌ Falha ao enviar atualização (status ${response.status}) - Pedido #${updatedOrder.order_number || updatedOrder.id} -> ${error}`);
          } else {
            const payloadResp = await response.json().catch(() => null);
            console.log(`[WHATSAPP] ✅ Atualização enviada para cliente (${formattedPhone}) - Pedido #${updatedOrder.order_number || updatedOrder.id}`, {
              messageId: payloadResp?.key?.id,
              novoStatus: status
            });
          }
        }
      } catch (error) {
        console.error('[WHATSAPP] ❌ Erro ao enviar atualização de status:', error);
      }
    }
    
    return NextResponse.json({ ok: true, data: updatedOrder });
  } catch (e: any) {
    console.error('[API/ORDERS/PATCH] Erro:', e);
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao atualizar pedido" }, { status: 500 });
  }
}
