import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;

    // Buscar distribuidores
    const { data: distribuidores, error } = await supabase
      .from('distribuidores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!distribuidores || distribuidores.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Para cada distribuidor, contar apenas produtos ATIVOS
    const distribuidoresComTotais = await Promise.all(
      distribuidores.map(async (dist) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('distribuidor_id', dist.id)
          .eq('active', true); // Apenas produtos ativos na plataforma

        return {
          ...dist,
          // total_produtos reflete apenas produtos ATIVOS
          total_produtos: count ?? 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: distribuidoresComTotais,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;
    const body = await request.json();

    const { nome, application_token, company_token, ativo } = body;

    if (!nome || !application_token || !company_token) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('distribuidores')
      .insert([
        {
          nome,
          application_token,
          company_token,
          ativo: ativo !== undefined ? ativo : true,
        },
      ])
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
