import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    console.log('[FORCE-INSERT] 🔧 Forçando inserção de categoria para homologação...');
    
    // Categoria super visível que aparecerá primeiro
    const homologacaoCategory = {
      distribuidor_id: brancaleoneId,
      mercos_id: 888888,
      nome: '!HOMOLOGACAO_FINAL_MERCOS',
      categoria_pai_id: null,
      ativo: true
    };
    
    // 1. Deletar se já existe
    await supabaseAdmin
      .from('distribuidor_categories')
      .delete()
      .eq('distribuidor_id', brancaleoneId)
      .eq('mercos_id', 888888);
    
    // 2. Inserir nova categoria
    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('distribuidor_categories')
      .insert(homologacaoCategory)
      .select();
    
    if (insertError) {
      console.error('[FORCE-INSERT] ❌ Erro ao inserir:', insertError);
      return NextResponse.json({
        success: false,
        error: insertError.message
      }, { status: 500 });
    }
    
    console.log('[FORCE-INSERT] ✅ Categoria inserida:', insertResult[0].nome);
    
    // 3. Verificar se aparece na consulta
    const { data: verificacao, count } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('nome, mercos_id', { count: 'exact' })
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(10);
    
    const encontrada = verificacao?.find(cat => cat.nome.includes('HOMOLOGACAO_FINAL'));
    
    return NextResponse.json({
      success: true,
      message: 'Categoria inserida com sucesso',
      categoria_inserida: {
        id: insertResult[0].id,
        nome: insertResult[0].nome,
        mercos_id: insertResult[0].mercos_id
      },
      verificacao: {
        total_categorias: count,
        categoria_encontrada_na_consulta: !!encontrada,
        primeiras_10: verificacao?.map((cat, index) => ({
          posicao: index + 1,
          nome: cat.nome,
          mercos_id: cat.mercos_id
        }))
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error: any) {
    console.error('[FORCE-INSERT] ❌ Erro geral:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
