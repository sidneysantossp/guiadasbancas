import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: categorias, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', params.id)
      .order('nome', { ascending: true });

    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categorias || []
    });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
