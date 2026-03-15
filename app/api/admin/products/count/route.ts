import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/security/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    // Total de produtos de distribuidores (ativos)
    const { count: totalDistribuidores } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('distribuidor_id', 'is', null)
      .eq('active', true);
    
    // Total de produtos próprios (de bancas)
    const { count: totalProprios } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .is('distribuidor_id', null);
    
    // Total geral
    const { count: totalGeral } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Produtos inativos de distribuidores
    const { count: totalInativos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .not('distribuidor_id', 'is', null)
      .eq('active', false);
    
    return NextResponse.json({
      success: true,
      counts: {
        distribuidores_ativos: totalDistribuidores || 0,
        distribuidores_inativos: totalInativos || 0,
        proprios: totalProprios || 0,
        total_geral: totalGeral || 0,
      }
    });
    
  } catch (error: any) {
    console.error('[COUNT-PRODUCTS] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
