import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Endpoint para limpar produtos do distribuidor
 * Remove todos os produtos sincronizados para permitir nova sincronização
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('[CLEANUP] Limpando produtos do distribuidor', params.id);
  
  try {
    const supabase = supabaseAdmin;
    const distribuidorId = params.id;
    
    // 1. Contar produtos antes da limpeza
    const { count: beforeCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    console.log(`[CLEANUP] Produtos encontrados: ${beforeCount}`);

    // 2. Deletar todos os produtos do distribuidor
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('distribuidor_id', distribuidorId);

    if (deleteError) {
      console.error('[CLEANUP] Erro ao deletar produtos:', deleteError);
      return NextResponse.json({
        success: false,
        error: 'Erro ao deletar produtos',
        details: deleteError,
      }, { status: 500 });
    }

    // 3. Contar produtos depois da limpeza
    const { count: afterCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    console.log(`[CLEANUP] Produtos após limpeza: ${afterCount}`);

    // 4. Resetar contador no distribuidor
    await supabase
      .from('distribuidores')
      .update({
        total_produtos: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', distribuidorId);

    return NextResponse.json({
      success: true,
      message: 'Produtos limpos com sucesso!',
      produtosRemovidos: beforeCount || 0,
      produtosRestantes: afterCount || 0,
    });

  } catch (error: any) {
    console.error('[CLEANUP] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
