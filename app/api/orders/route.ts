import { NextRequest, NextResponse } from "next/server";
import { sendOrderWhatsAppNotification, sendStatusWhatsAppUpdate, type OrderWhatsAppData } from "@/lib/whatsapp";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

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
    // SEGURANÇA: Verificar autenticação
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userRole = (session?.user as any)?.role as string | undefined;
    const userId = (session?.user as any)?.id as string | undefined;
    
    // SEGURANÇA: Verificar role válido (cliente pode ver próprios pedidos)
    if (!userRole || !['admin', 'jornaleiro', 'cliente'].includes(userRole)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
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
        return NextResponse.json({ success: false, error: "Pedido não encontrado" }, { status: 404 });
      }

      // Verificar permissão: cliente só vê próprio pedido, jornaleiro só da própria banca
      if (userRole === 'cliente' && singleOrder.user_id !== userId) {
        return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
      }

      if (userRole === 'jornaleiro') {
        const bancaData = await getActiveBancaRowForUser(userId, 'id, user_id');
        
        if (!bancaData || singleOrder.banca_id !== bancaData.id) {
          return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
        }
      }

      return NextResponse.json({ success: true, data: singleOrder });
    }

    // SEGURANÇA: Para jornaleiros, buscar banca_id do usuário
    let userBancaId: string | undefined;
    if (userRole === 'jornaleiro') {
      const bancaData = await getActiveBancaRowForUser(userId, 'id, user_id');
      
      if (!bancaData) {
        console.error('[API/ORDERS/GET] Banca não encontrada para jornaleiro:', userId);
        return NextResponse.json({ error: "Banca não encontrada" }, { status: 404 });
      }
      userBancaId = bancaData.id;
      console.log('[API/ORDERS/GET] Jornaleiro:', userId, '-> Banca:', userBancaId);
    }
    
    // Log para debug
    console.log('[API/ORDERS/GET] Role:', userRole, '| UserId:', userId, '| BancaId filtro:', userBancaId || 'N/A');
    
    // Buscar pedidos do Supabase (evitar join pesado para jornaleiro)
    const selectForAdmin = `*, bancas:banca_id ( id, name, address, whatsapp )`;
    const selectForJornaleiro = `*`;
    let query = supabaseAdmin
      .from('orders')
      .select(userRole === 'admin' ? selectForAdmin : selectForJornaleiro, { count: countPref });

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
    if (userRole === 'jornaleiro' && userBancaId) {
      query = query.eq('banca_id', userBancaId);
    } else if (userRole === 'cliente' && userId) {
      // Cliente só vê próprios pedidos
      query = query.eq('user_id', userId);
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
      estimated_delivery: order.estimated_delivery,
      discount: order.discount ? Number(order.discount) : 0,
      coupon_code: order.coupon_code || null,
      coupon_discount: order.coupon_discount ? Number(order.coupon_discount) : 0,
      tax: order.tax ? Number(order.tax) : 0,
      addons_total: order.addons_total ? Number(order.addons_total) : 0
    }));
  
    return NextResponse.json(
      { 
        items, 
        total: count || 0, 
        page, 
        limit,
        pages: Math.ceil((count || 0) / limit)
      },
      { headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' } }
    );
  } catch (e: any) {
    console.error('[API/ORDERS/GET] Erro:', e);
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao buscar pedidos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    
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

    // Gerar número do pedido no formato: BAN-AAAA-TIMESTAMP (ex: BAN-2025-1735000000)
    // BAN = primeiras 3 letras do nome da banca (maiúsculas, sem acentos)
    // AAAA = ano atual
    // TIMESTAMP = timestamp em milissegundos (garante unicidade)
    const bancaPrefix = (banca.name || 'BAN')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-zA-Z]/g, '') // Remove caracteres especiais
      .substring(0, 3)
      .toUpperCase()
      .padEnd(3, 'X'); // Garante 3 caracteres
    
    const currentYear = new Date().getFullYear();
    const timestamp = Date.now();
    const orderNumber = `${bancaPrefix}-${currentYear}-${timestamp}`;

    // Obter user_id da sessão (para associar pedido ao cliente)
    const userId = session?.user?.id || (session?.user as any)?.id || null;
    
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
        subtotal: pricing.subtotal || 0,
        shipping_fee: pricing.shipping || 0,
        total: pricing.total || 0,
        status: "novo",
        payment_method: body.payment || "pix",
        notes: body.shippingMethod ? `Entrega: ${body.shippingMethod}` : "",
        discount: pricing.discount || 0,
        coupon_code: body.coupon || null,
        coupon_discount: pricing.couponDiscount || 0,
        tax: pricing.tax || 0,
        addons_total: pricing.addons || 0
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
            `\n\n💰 *Total:* R$ ${(pricing.total || 0).toFixed(2)}\n` +
            `🚚 *Entrega:* ${body.shippingMethod || 'Não especificado'}\n` +
            `💳 *Pagamento:* ${body.payment || 'pix'}\n` +
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
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao criar pedido" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes, estimated_delivery, items } = body || {};
    
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
    if (items && Array.isArray(items)) updateData.items = items;

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
    
    // NOTA: WhatsApp é enviado pelo frontend via /api/whatsapp/status-update
    // (inclui resumo dos produtos com status individual)
    
    return NextResponse.json({ ok: true, data: updatedOrder });
  } catch (e: any) {
    console.error('[API/ORDERS/PATCH] Erro:', e);
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao atualizar pedido" }, { status: 500 });
  }
}
