import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/admin/distribuidores/:id/produtos/debug
// Retorna contagem e amostras locais de products para investigação
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;

    // 1) Distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
      .single();

    // 2) Contagem total de produtos deste distribuidor
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id);

    // 3) Amostra
    const { data: sample, error: sampleError } = await supabase
      .from('products')
      .select('*')
      .eq('distribuidor_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      params,
      distribuidor,
      errors: {
        distribuidor: distError?.message || null,
        count: countError?.message || null,
        sample: sampleError?.message || null,
      },
      total: count ?? 0,
      sample: sample || [],
      sample_keys: sample && sample.length > 0 ? Object.keys(sample[0]) : [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
