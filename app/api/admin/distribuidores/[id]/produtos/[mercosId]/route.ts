import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

// GET /api/admin/distribuidores/:id/produtos/:mercosId
// Retorna dados individuais do produto a partir da API Mercos e o registro local (se existir)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; mercosId: string } }
) {
  try {
    const supabase = supabaseAdmin;

    // 1) Buscar o distribuidor para obter tokens
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', params.id)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // 2) Instanciar cliente Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // 3) Buscar produto na API Mercos
    const mercosId = Number(params.mercosId);
    if (Number.isNaN(mercosId)) {
      return NextResponse.json(
        { success: false, error: 'mercosId inválido' },
        { status: 400 }
      );
    }

    let mercosProduto: any | null = null;
    try {
      mercosProduto = await mercosApi.getProduto(mercosId);
    } catch (e: any) {
      // Não falhar a rota se Mercos estiver indisponível; apenas reportar
      console.error('[DEBUG] Erro ao buscar produto na Mercos:', e?.message || e);
    }

    // 4) Buscar registro local correspondente no Supabase
    const { data: localProduto, error: localError } = await supabase
      .from('products')
      .select('*')
      .eq('distribuidor_id', params.id)
      .eq('mercos_id', mercosId)
      .maybeSingle();

    if (localError) {
      console.error('[DEBUG] Erro ao consultar produto local:', localError.message);
    }

    return NextResponse.json({
      success: true,
      params,
      mercos: mercosProduto || null,
      local: localProduto || null,
    });
  } catch (error: any) {
    console.error('[DEBUG] Erro geral na rota de produto específico:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
