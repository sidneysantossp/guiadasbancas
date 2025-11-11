import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const distribuidorId = params.id;

    // Verificar status da sincronização
    const { data: syncStatus, error: syncError } = await supabaseAdmin
      .from('sync_status')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (syncError) {
      console.error('Erro ao buscar status de sincronização:', syncError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar status de sincronização' },
        { status: 500 }
      );
    }

    // Verificar contagem de produtos
    const { count: totalProdutos, error: countError } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    if (countError) {
      console.error('Erro ao contar produtos:', countError);
      return NextResponse.json(
        { success: false, error: 'Erro ao contar produtos' },
        { status: 500 }
      );
    }

    // Verificar produtos de exemplo
    const { data: produtosExemplo, error: produtosError } = await supabaseAdmin
      .from('products')
      .select('id, name, price, stock_qty, active, updated_at')
      .eq('distribuidor_id', distribuidorId)
      .order('updated_at', { ascending: false })
      .limit(5);

    if (produtosError) {
      console.error('Erro ao buscar produtos de exemplo:', produtosError);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar produtos de exemplo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      syncStatus,
      totalProdutos,
      produtosExemplo,
    });

  } catch (error: any) {
    console.error('Erro ao verificar status da sincronização:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Erro desconhecido',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
