import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    console.log(`[API] Buscando produtos do distribuidor: ${params.id}`);

    // Buscar produtos vinculados ao distribuidor (sem depender de 'origem')
    const { data: produtos, error } = await supabase
      .from('products')
      .select('id,name,price,stock_qty,images,mercos_id,distribuidor_id,created_at')
      .eq('distribuidor_id', params.id)
      .order('created_at', { ascending: false });

    console.log(`[API] Produtos encontrados: ${produtos?.length || 0}`);

    if (error) {
      console.error('[API] Erro ao buscar produtos:', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: produtos || [],
      total: produtos?.length || 0,
    });
  } catch (error: any) {
    console.error('[API] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
