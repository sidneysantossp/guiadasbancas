import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/jornaleiro/notificacoes
// Lista notificações do jornaleiro sobre produtos de distribuidores
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
    const { data: banca } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id')
      .eq('user_id', userId)
      .single();

    if (!banca) {
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    // Se não for cotista, retornar lista vazia
    if (!banca.is_cotista || !banca.cotista_id) {
      return NextResponse.json({
        success: true,
        notifications: [],
        message: 'Apenas cotistas recebem notificações sobre produtos de distribuidores'
      });
    }

    // Buscar produtos novos dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: novosProdutos } = await supabase
      .from('products')
      .select('id, name, created_at, distribuidor_id')
      .not('distribuidor_id', 'is', null)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(20);

    // Buscar nomes de distribuidores separadamente
    const distIds = Array.from(new Set((novosProdutos || []).map(p => p.distribuidor_id).filter(Boolean)));
    let distMap = new Map<string, string>();
    if (distIds.length > 0) {
      const { data: distRows } = await supabase
        .from('distribuidores')
        .select('id, name')
        .in('id', distIds as any);
      distMap = new Map((distRows || []).map((d: any) => [d.id, d.name]));
    }

    // Gerar notificações para produtos novos
    const notifications = (novosProdutos || []).map((produto: any) => {
      const distribuidorNome = distMap.get(produto.distribuidor_id) || 'Distribuidor';
      
      return {
        id: `novo_${produto.id}`,
        type: 'novo_produto' as const,
        title: 'Novo produto disponível',
        message: `"${produto.name}" foi adicionado ao catálogo`,
        product_id: produto.id,
        product_name: produto.name,
        distribuidor_nome: distribuidorNome,
        read: false, // Por padrão não lido
        created_at: produto.created_at
      };
    });

    return NextResponse.json({
      success: true,
      notifications,
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
