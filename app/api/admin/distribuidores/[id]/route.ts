import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    // Buscar dados do distribuidor
    const { data, error } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    // Buscar count REAL de produtos no banco (TODOS: ativos + inativos)
    const { count: produtosCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id);

    if (countError) {
      console.error('[API] Erro ao contar produtos:', countError);
    }

    // Retornar com count real atualizado
    return NextResponse.json({
      success: true,
      data: {
        ...data,
        total_produtos: produtosCount || 0, // Substituir pelo count real do banco
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();

    const { data, error } = await supabase
      .from('distribuidores')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    const { error } = await supabase
      .from('distribuidores')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Distribuidor excluído com sucesso',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
