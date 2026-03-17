import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { validateCouponSelection } from "@/lib/modules/coupons/service";
import {
  buildOrderListMeta,
  canActorAccessOrder,
  formatOrderRecord,
  formatOrderRecords,
  generateOrderNumber,
  normalizeCheckoutPayload,
  readOrderActor,
  resolveOrderActorBancaId,
} from "@/lib/modules/orders/service";
import { supabaseAdmin } from "@/lib/supabase";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const actor = readOrderActor(session);

    if (!actor) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id") || "";
    const status = searchParams.get("status") || "";
    const q = (searchParams.get("q") || "").toLowerCase();
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 100); // Máximo 100
    const page = parseInt(searchParams.get("page") || "1");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";
    const bancaIdFilter = searchParams.get("banca_id") || "";
    const countPref = (searchParams.get("count") || "planned") as 'exact' | 'planned' | 'estimated';

    // Se buscar por ID específico, retorna apenas esse pedido
    if (orderId) {
      const { data: singleOrder, error: singleError } = await supabaseAdmin
        .from('orders')
        .select('*, bancas:banca_id ( id, name, address, whatsapp )')
        .eq('id', orderId)
        .single();

      if (singleError || !singleOrder) {
        return NextResponse.json(
          { success: false, error: "Pedido não encontrado" },
          { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }

      const actorBancaId = await resolveOrderActorBancaId(actor);
      if (!canActorAccessOrder({ actor, order: singleOrder, actorBancaId })) {
        return NextResponse.json(
          { success: false, error: "Acesso negado" },
          { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }

      return NextResponse.json(
        { success: true, data: formatOrderRecord(singleOrder) },
        { headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    let userBancaId: string | undefined;
    if (actor.role === 'jornaleiro') {
      const bancaId = await resolveOrderActorBancaId(actor);

      if (!bancaId) {
        console.error('[API/ORDERS/GET] Banca não encontrada para jornaleiro:', actor.userId);
        return NextResponse.json(
          { error: "Banca não encontrada" },
          { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }
      userBancaId = bancaId;
      console.log('[API/ORDERS/GET] Jornaleiro:', actor.userId, '-> Banca:', userBancaId);
    }
    
    // Log para debug
    console.log('[API/ORDERS/GET] Role:', actor.role, '| UserId:', actor.userId, '| BancaId filtro:', userBancaId || 'N/A');
    
    // Buscar pedidos do Supabase (evitar join pesado para jornaleiro)
    const selectForAdmin = `*, bancas:banca_id ( id, name, address, whatsapp )`;
    const selectForJornaleiro = `*`;
    let query = supabaseAdmin
      .from('orders')
      .select(actor.role === 'admin' ? selectForAdmin : selectForJornaleiro, { count: countPref });

    // Filtrar por status (suporta múltiplos status separados por vírgula)
    if (status) {
      const statusList = status.split(',').map(s => s.trim()).filter(Boolean);
      if (statusList.length === 1) {
        query = query.eq('status', statusList[0]);
      } else if (statusList.length > 1) {
        query = query.in('status', statusList);
      }
    }

    // Filtrar por banca (jornaleiro só vê pedidos da própria banca)
    if (actor.role === 'jornaleiro' && userBancaId) {
      query = query.eq('banca_id', userBancaId);
    } else if (actor.role === 'cliente') {
      // Cliente só vê próprios pedidos
      query = query.eq('user_id', actor.userId);
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
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const items = formatOrderRecords(data || []);
    const pagination = buildOrderListMeta({ count, page, limit });
  
    return NextResponse.json(
      {
        items,
        ...pagination,
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (e: any) {
    console.error('[API/ORDERS/GET] Erro:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao buscar pedidos" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const actor = readOrderActor(session);
    const checkout = normalizeCheckoutPayload(body, actor?.bancaId);
    const customer = checkout.customer;
    const orderItems = checkout.orderItems;
    const fullAddress = checkout.fullAddress;
    
    // Determinar banca_id
    const inferredBancaId = checkout.inferredBancaId;

    if (!inferredBancaId) {
      return NextResponse.json(
        { ok: false, error: "Banca não identificada" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    // Buscar dados da banca no Supabase
    const { data: banca, error: bancaError } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, whatsapp')
      .eq('id', inferredBancaId)
      .single();

    if (bancaError || !banca) {
      console.error('[API/ORDERS/POST] Erro ao buscar banca:', bancaError);
      return NextResponse.json(
        { ok: false, error: "Banca não encontrada" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const normalizedSubtotal = checkout.normalizedSubtotal;
    const normalizedBaseDiscount = checkout.normalizedBaseDiscount;
    const normalizedShippingFee = checkout.normalizedShippingFee;
    const normalizedTax = checkout.normalizedTax;
    const normalizedAddons = checkout.normalizedAddons;

    let validatedCouponCode = checkout.couponCode;
    let validatedCouponDiscount = 0;

    if (validatedCouponCode) {
      const couponValidation = await validateCouponSelection({
        code: validatedCouponCode,
        sellerId: inferredBancaId,
        subtotal: normalizedSubtotal,
        shippingFee: normalizedShippingFee,
      });

      if (!couponValidation.ok || !couponValidation.result) {
        if (couponValidation.status >= 500) {
          console.warn("[API/ORDERS/POST] Falha ao validar cupom:", couponValidation.error);
        } else {
          validatedCouponCode = null;
        }
      } else {
        validatedCouponDiscount = couponValidation.result.discount.amount;
      }
    }

    const normalizedTotal = Math.max(
      0,
      normalizedSubtotal - normalizedBaseDiscount - validatedCouponDiscount + normalizedShippingFee + normalizedTax + normalizedAddons,
    );

    // Gerar número do pedido no formato: BAN-AAAA-TIMESTAMP (ex: BAN-2025-1735000000)
    // BAN = primeiras 3 letras do nome da banca (maiúsculas, sem acentos)
    // AAAA = ano atual
    // TIMESTAMP = timestamp em milissegundos (garante unicidade)
    const timestamp = Date.now();
    const orderNumber = generateOrderNumber(banca.name || "BAN", timestamp);

    // Obter user_id da sessão (para associar pedido ao cliente)
    const userId = actor?.userId || null;
    
    // Criar pedido no Supabase (id será UUID gerado automaticamente)
    const { data: newOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId, // Associar pedido ao usuário logado
        customer_name: customer.name || "Cliente",
        customer_phone: customer.phone || "",
        customer_email: customer.email || "",
        customer_address: fullAddress,
        banca_id: inferredBancaId,
        items: orderItems,
        subtotal: normalizedSubtotal,
        shipping_fee: normalizedShippingFee,
        total: normalizedTotal,
        status: "novo",
        payment_method: checkout.paymentMethod,
        notes: checkout.shippingMethod ? `Entrega: ${checkout.shippingMethod}` : "",
        discount: normalizedBaseDiscount,
        coupon_code: validatedCouponCode,
        coupon_discount: validatedCouponDiscount,
        tax: normalizedTax,
        addons_total: normalizedAddons
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error('[API/ORDERS/POST] Erro ao criar pedido:', orderError);
      return NextResponse.json(
        { ok: false, error: orderError?.message || "Erro ao criar pedido" },
        { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    // Log em server para inspeção
    console.log("[NOVO PEDIDO CRIADO]", { 
      id: newOrder.id, 
      orderNumber, 
      customer: customer.name, 
      total: checkout.pricing?.total ?? normalizedTotal,
      totalCalculado: normalizedTotal,
      banca: banca.name 
    });
    
    // Registrar histórico de criação do pedido
    try {
      await supabaseAdmin.from('order_history').insert({
        order_id: newOrder.id,
        action: 'created',
        new_value: 'novo',
        user_name: customer.name || 'Cliente',
        user_role: 'customer',
        details: 'Pedido criado pelo cliente via checkout'
      });
    } catch (err) {
      console.warn('[ORDER HISTORY] Falha ao registrar criação do pedido:', err);
    }
    
    // Enviar notificação WhatsApp para o jornaleiro (utilizando config centralizada)
    if (banca.whatsapp) {
      try {
        const config = getWhatsAppConfig();

        if (!config.isActive) {
          console.warn(`[WHATSAPP] ⚠️ Integração inativa no painel. Pedido #${orderNumber}`);
        } else if (!config.baseUrl || !config.apiKey || !config.instanceName) {
          console.warn(`[WHATSAPP] ⚠️ Configuração incompleta (baseUrl/apiKey/instanceName). Pedido #${orderNumber}`);
        } else {
          // Formatar telefone do cliente para WhatsApp
          const customerCleanPhone = (customer.phone || '').replace(/\D/g, '');
          const customerWhatsAppLink = customerCleanPhone 
            ? `https://wa.me/55${customerCleanPhone.replace(/^55/, '')}`
            : '';

          // Formatar mensagem
          const message = `🛒 *NOVO PEDIDO - ${banca.name}*\n\n` +
            `📋 *Pedido:* #${orderNumber}\n` +
            `👤 *Cliente:* ${customer.name || "Cliente"}\n` +
            `📱 *Telefone:* ${customer.phone || ""}\n` +
            (customerWhatsAppLink ? `🔗 *WhatsApp:* ${customerWhatsAppLink}\n` : '') +
            `\n📦 *Produtos:*\n` +
            orderItems.map((item, i) =>
              `${i + 1}. ${item.product_name}\n   Qtd: ${item.quantity}x | Valor: R$ ${item.unit_price.toFixed(2)}`
            ).join('\n') +
            `\n\n💰 *Total:* R$ ${normalizedTotal.toFixed(2)}\n` +
            `🚚 *Entrega:* ${checkout.shippingMethod || 'Não especificado'}\n` +
            `💳 *Pagamento:* ${checkout.paymentMethod}\n` +
            (fullAddress ? `📍 *Endereço:* ${fullAddress}\n` : '') +
            `\n⏰ *Recebido em:* ${new Date().toLocaleString('pt-BR')}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `💳 *PRÓXIMOS PASSOS:*\n` +
            `1️⃣ Clique no link do WhatsApp acima\n` +
            `2️⃣ Envie o PIX para o cliente\n` +
            `3️⃣ Aguarde o pagamento\n` +
            `4️⃣ Confirme o pedido no painel\n\n` +
            `✅ Acesse seu painel para gerenciar este pedido.`;

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
    // Registrar histórico: cópia enviada ao jornaleiro
    try {
      await supabaseAdmin.from('order_history').insert({
        order_id: newOrder.id,
        action: 'note_added',
        new_value: 'Cópia do pedido enviada ao jornaleiro via WhatsApp',
        user_name: 'Guia das Bancas',
        user_role: 'system',
        details: `Pedido encaminhado para a banca ${banca.name}`
      });
    } catch (err) {
      console.warn('[ORDER HISTORY] Falha ao registrar log de cópia ao jornaleiro:', err);
    }
    
    // 1) Enviar mensagem de boas-vindas para o CLIENTE via WhatsApp oficial da plataforma
    try {
      const config = getWhatsAppConfig();
      if (!config.isActive) {
        console.warn('[WHATSAPP] ⚠️ Integração inativa ao tentar enviar boas-vindas ao cliente');
      } else if (!config.baseUrl || !config.apiKey || !config.instanceName) {
        console.warn('[WHATSAPP] ⚠️ Configuração incompleta (baseUrl/apiKey/instanceName) para mensagem de boas-vindas');
      } else if (customer.phone) {
        const cleanCustomer = String(customer.phone).replace(/\D/g, '');
        const customerNumber = cleanCustomer.startsWith('55') ? cleanCustomer : `55${cleanCustomer}`;

        const welcomeMsg =
          `👋 Olá ${customer.name || 'cliente'}!\n` +
          `Bem-vindo ao *Guia das Bancas*. Recebemos seu pedido ${orderNumber ? `#${orderNumber}` : ''} ` +
          `e já encaminhamos para a banca *${banca.name}*.\n` +
          `Em breve você receberá a confirmação e atualizações do status por aqui.`;

        const respWelcome = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: config.apiKey },
          body: JSON.stringify({ number: customerNumber, text: welcomeMsg })
        });
        if (!respWelcome.ok) {
          console.warn('[WHATSAPP] ❌ Falha ao enviar mensagem de boas-vindas ao cliente:', await respWelcome.text());
        }

        // Registrar histórico: Mensagem de boas-vindas enviada
        await supabaseAdmin.from('order_history').insert({
          order_id: newOrder.id,
          action: 'note_added',
          new_value: 'Mensagem de boas vindas enviada!',
          user_name: 'Guia das Bancas',
          user_role: 'system',
          details: welcomeMsg
        });
      }
    } catch (err) {
      console.error('[WHATSAPP] Erro ao processar mensagem de boas-vindas:', err);
    }

    // 2) Mensagem de "pedido recebido" para o CLIENTE (logo após as boas-vindas)
    try {
      const config = getWhatsAppConfig();
      if (config.isActive && config.baseUrl && config.apiKey && config.instanceName && customer.phone) {
        const cleanCustomer = String(customer.phone).replace(/\D/g, '');
        const customerNumber = cleanCustomer.startsWith('55') ? cleanCustomer : `55${cleanCustomer}`;

        const receivedMsg =
          `🛒 Seu pedido foi recebido pela banca *${banca.name}* e está em análise! ` +
          `Em breve você receberá a confirmação e os próximos passos.`;

        const respReceived = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: config.apiKey },
          body: JSON.stringify({ number: customerNumber, text: receivedMsg })
        });
        if (!respReceived.ok) {
          console.warn('[WHATSAPP] ❌ Falha ao enviar mensagem de pedido recebido ao cliente:', await respReceived.text());
        }

        // Registrar histórico: Confirmação de recebimento enviada
        await supabaseAdmin.from('order_history').insert({
          order_id: newOrder.id,
          action: 'note_added',
          new_value: 'Confirmação de recebimento enviada ao cliente',
          user_name: banca.name,
          user_role: 'vendor',
          details: receivedMsg
        });
      }
    } catch (err) {
      console.error('[WHATSAPP] Erro ao processar mensagem de recebimento ao cliente:', err);
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
    }, { status: 200, headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao criar pedido" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const actor = readOrderActor(session);

    if (!actor) {
      return NextResponse.json(
        { ok: false, error: "Não autorizado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const body = await req.json();
    const { id, status, notes, estimated_delivery, items } = body || {};
    
    // Buscar pedido atual no Supabase
    const { data: currentOrder, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json(
        { ok: false, error: "Pedido não encontrado" },
        { status: 404, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    if (actor.role === "cliente") {
      const nextStatus = String(status || "").toLowerCase();
      const allowedCustomerStatuses = ["cancelado", "cancelled", "canceled"];

      if (currentOrder.user_id !== actor.userId) {
        return NextResponse.json(
          { ok: false, error: "Acesso negado" },
          { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }

      if (!allowedCustomerStatuses.includes(nextStatus) || notes !== undefined || estimated_delivery || items) {
        return NextResponse.json(
          { ok: false, error: "Cliente só pode cancelar o próprio pedido" },
          { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) },
        );
      }
    }

    if (actor.role === "jornaleiro") {
      const actorBancaId = await resolveOrderActorBancaId(actor);
      if (!canActorAccessOrder({ actor, order: currentOrder, actorBancaId })) {
        return NextResponse.json(
          { ok: false, error: "Acesso negado" },
          { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
        );
      }
    }
    
    // Atualizar pedido no Supabase
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (estimated_delivery) updateData.estimated_delivery = estimated_delivery;
    if (items && Array.isArray(items)) updateData.items = items;

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('[API/ORDERS/PATCH] Erro ao atualizar pedido:', updateError);
      return NextResponse.json(
        { ok: false, error: updateError?.message || "Erro ao atualizar pedido" },
        { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }
    
    // NOTA: WhatsApp é enviado pelo frontend via /api/whatsapp/status-update
    // (inclui resumo dos produtos com status individual)
    
    return NextResponse.json(
      { ok: true, data: formatOrderRecord(updatedOrder) },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (e: any) {
    console.error('[API/ORDERS/PATCH] Erro:', e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Erro ao atualizar pedido" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
