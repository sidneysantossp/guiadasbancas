import { NextRequest, NextResponse } from 'next/server';
import { getDistribuidorAccessibleBancas } from '@/lib/distribuidor-access';
import { requireAdminAuth } from '@/lib/security/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

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

    // Buscar count REAL de produtos ATIVOS no banco
    const { count: produtosCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id)
      .eq('active', true); // Apenas produtos ativos na plataforma

    if (countError) {
      console.error('[API] Erro ao contar produtos:', countError);
    }

    const [categoriasResponse, produtosResponse, accessibleBancas] = await Promise.all([
      supabase
        .from('distribuidor_categories')
        .select('id, nome, updated_at')
        .eq('distribuidor_id', params.id)
        .order('nome', { ascending: true }),
      supabase
        .from('products')
        .select('id, name, price, active, sincronizado_em, mercos_id, codigo_mercos, created_at')
        .eq('distribuidor_id', params.id)
        .order('created_at', { ascending: false })
        .limit(8),
      getDistribuidorAccessibleBancas(),
    ]);

    if (categoriasResponse.error) {
      throw categoriasResponse.error;
    }

    if (produtosResponse.error) {
      throw produtosResponse.error;
    }

    const accessibleBancasCount = accessibleBancas.length;
    const latestSyncCutoff = new Date();
    latestSyncCutoff.setDate(latestSyncCutoff.getDate() - 1);

    const recentProducts = (produtosResponse.data || []) as Array<{
      id: string;
      name: string | null;
      price: number | null;
      active: boolean | null;
      sincronizado_em: string | null;
      mercos_id: number | null;
      codigo_mercos?: string | null;
      created_at: string | null;
    }>;

    const synced24h = recentProducts.filter(
      (item) => item.sincronizado_em && new Date(item.sincronizado_em) >= latestSyncCutoff
    ).length;

    // Retornar com count real de produtos ATIVOS
    return NextResponse.json({
      success: true,
      data: {
        ...data,
        total_produtos: produtosCount || 0, // Apenas produtos ATIVOS
        total_categorias: categoriasResponse.data?.length || 0,
        bancas_com_acesso: accessibleBancasCount,
        produtos_sincronizados_24h: synced24h,
        categorias_recentes: (categoriasResponse.data || []).slice(0, 8),
        produtos_recentes: recentProducts,
        bancas_relevantes: accessibleBancas.slice(0, 8).map((banca) => ({
          id: banca.id,
          name: banca.name,
          plan_type: banca.plan_type,
          is_legacy_cotista_linked: banca.is_legacy_cotista_linked,
        })),
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
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

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
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

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
