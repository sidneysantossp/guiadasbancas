import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

export const dynamic = 'force-dynamic';

// GET /api/jornaleiro/notificacoes
// Lista notificações do jornaleiro: pedidos recentes e produtos novos (para cotistas)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;
    const userId = session.user.id;

    // Buscar banca do jornaleiro
    const banca = await getActiveBancaRowForUser(userId, 'id, user_id, is_cotista, cotista_id');

    if (!banca) {
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    const notifications: any[] = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Buscar pedidos recentes (últimos 7 dias)
    const { data: pedidosRecentes } = await supabase
      .from('orders')
      .select('id, customer_name, status, total, created_at, updated_at')
      .eq('banca_id', banca.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    // Adicionar notificações de pedidos
    (pedidosRecentes || []).forEach((pedido: any) => {
      const statusLabels: Record<string, string> = {
        'pending': 'Novo pedido aguardando',
        'confirmed': 'Pedido confirmado',
        'preparing': 'Pedido em preparação',
        'ready': 'Pedido pronto para entrega',
        'delivered': 'Pedido entregue',
        'cancelled': 'Pedido cancelado'
      };
      
      const statusLabel = statusLabels[pedido.status] || 'Atualização de pedido';
      const isPending = pedido.status === 'pending';
      
      notifications.push({
        id: `pedido_${pedido.id}`,
        type: 'pedido',
        title: statusLabel,
        message: `Pedido de ${pedido.customer_name} - R$ ${pedido.total?.toFixed(2) || '0.00'}`,
        order_id: pedido.id,
        customer_name: pedido.customer_name,
        status: pedido.status,
        total: pedido.total,
        read: !isPending, // Pedidos pendentes são marcados como não lidos
        created_at: pedido.created_at,
        priority: isPending ? 1 : 2 // Pedidos pendentes têm prioridade
      });
    });

    // 2. Para cotistas: buscar produtos novos de distribuidores
    if (banca.is_cotista && banca.cotista_id) {
      const { data: novosProdutos } = await supabase
        .from('products')
        .select('id, name, created_at, distribuidor_id')
        .not('distribuidor_id', 'is', null)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      // Buscar nomes de distribuidores
      const distIds = Array.from(new Set((novosProdutos || []).map(p => p.distribuidor_id).filter(Boolean)));
      let distMap = new Map<string, string>();
      if (distIds.length > 0) {
        const { data: distRows } = await supabase
          .from('distribuidores')
          .select('id, name')
          .in('id', distIds as any);
        distMap = new Map((distRows || []).map((d: any) => [d.id, d.name]));
      }

      // Adicionar notificações de produtos novos
      (novosProdutos || []).forEach((produto: any) => {
        const distribuidorNome = distMap.get(produto.distribuidor_id) || 'Distribuidor';
        
        notifications.push({
          id: `novo_${produto.id}`,
          type: 'novo_produto',
          title: 'Novo produto disponível',
          message: `"${produto.name}" foi adicionado ao catálogo`,
          product_id: produto.id,
          product_name: produto.name,
          distribuidor_nome: distribuidorNome,
          read: false,
          created_at: produto.created_at,
          priority: 3
        });
      });
    }

    // 3. Buscar mensagens/avisos do admin (tabela notifications se existir)
    try {
      const { data: adminNotifications } = await supabase
        .from('notifications')
        .select('id, type, payload, created_at')
        .or(`banca_id.eq.${banca.id},banca_id.is.null`)
        .eq('channel', 'inapp')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      (adminNotifications || []).forEach((notif: any) => {
        const payload = notif.payload || {};
        notifications.push({
          id: `admin_${notif.id}`,
          type: 'admin_message',
          title: payload.title || 'Mensagem do Sistema',
          message: payload.message || payload.body || 'Nova notificação',
          read: false,
          created_at: notif.created_at,
          priority: 0 // Alta prioridade para mensagens do admin
        });
      });
    } catch (e) {
      // Tabela notifications pode não existir, ignorar erro
      console.log('[NOTIFICACOES] Tabela notifications não encontrada ou vazia');
    }

    // Ordenar por prioridade e data
    notifications.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json({
      success: true,
      notifications: notifications.slice(0, 30), // Limitar a 30
      total: notifications.length,
    });
  } catch (error: any) {
    console.error('[API] Erro ao buscar notificações:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
