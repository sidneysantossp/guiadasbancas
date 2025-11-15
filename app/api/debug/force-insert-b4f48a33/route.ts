import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const distribuidorId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // Dados exatos da categoria b4f48a33 conforme a Mercos
    const categoria = {
      distribuidor_id: distribuidorId,
      mercos_id: 305651,
      nome: 'b4f48a33',
      categoria_pai_id: null,
      ativo: true,
      created_at: '2025-10-31T01:28:57.000Z',
      updated_at: new Date().toISOString()
    };

    console.log('[FORCE-INSERT] Inserindo categoria b4f48a33:', categoria);

    // Upsert da categoria específica
    const { data, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .upsert(categoria, { onConflict: 'distribuidor_id,mercos_id' })
      .select('*')
      .single();

    if (error) {
      console.error('[FORCE-INSERT] Erro no upsert:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    console.log('[FORCE-INSERT] Categoria inserida com sucesso:', data);

    // Verificar se realmente foi inserida
    const { data: verificacao } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .eq('mercos_id', 305651)
      .single();

    return NextResponse.json({
      success: true,
      message: 'Categoria b4f48a33 inserida com sucesso!',
      categoria: data,
      verificacao: verificacao
    });

  } catch (error: any) {
    console.error('[FORCE-INSERT] Erro fatal:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
