import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/debug/banca-product?banca_id=XXX&codigo=1054835
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bancaId = searchParams.get('banca_id');
    const codigo = searchParams.get('codigo');
    
    if (!bancaId || !codigo) {
      return NextResponse.json({ error: 'Parâmetros "banca_id" e "codigo" são obrigatórios' }, { status: 400 });
    }

    // 1. Buscar a banca
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('id, name, is_cotista, cotista_id, active')
      .eq('id', bancaId)
      .single();

    const isCotista = banca?.is_cotista === true || !!banca?.cotista_id;

    // 2. Buscar o produto direto do banco
    const { data: produtoDireto } = await supabaseAdmin
      .from('products')
      .select('id, name, codigo_mercos, images, banca_id, distribuidor_id, active')
      .ilike('codigo_mercos', codigo)
      .limit(5);

    // 3. Buscar produtos da banca com o filtro correto
    let produtosFiltrados: any[] = [];
    if (isCotista) {
      const { data } = await supabaseAdmin
        .from('products')
        .select('id, name, codigo_mercos, images, banca_id, distribuidor_id, active')
        .eq('active', true)
        .or(`banca_id.eq.${bancaId},distribuidor_id.not.is.null`)
        .ilike('codigo_mercos', codigo)
        .limit(5);
      produtosFiltrados = data || [];
    } else {
      const { data } = await supabaseAdmin
        .from('products')
        .select('id, name, codigo_mercos, images, banca_id, distribuidor_id, active')
        .eq('active', true)
        .eq('banca_id', bancaId)
        .ilike('codigo_mercos', codigo)
        .limit(5);
      produtosFiltrados = data || [];
    }

    return NextResponse.json({
      success: true,
      banca: {
        id: banca?.id,
        name: banca?.name,
        is_cotista: isCotista,
        active: banca?.active
      },
      produto_direto: produtoDireto?.map(p => ({
        id: p.id,
        name: p.name,
        codigo_mercos: p.codigo_mercos,
        banca_id: p.banca_id,
        distribuidor_id: p.distribuidor_id,
        active: p.active,
        images_count: Array.isArray(p.images) ? p.images.length : 0,
        first_image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        images_raw: p.images
      })),
      produtos_filtrados_pela_api: produtosFiltrados?.map(p => ({
        id: p.id,
        name: p.name,
        codigo_mercos: p.codigo_mercos,
        banca_id: p.banca_id,
        distribuidor_id: p.distribuidor_id,
        active: p.active,
        images_count: Array.isArray(p.images) ? p.images.length : 0,
        first_image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        images_raw: p.images
      })),
      debug_info: {
        query_usado_cotista: isCotista ? `or(banca_id.eq.${bancaId},distribuidor_id.not.is.null)` : `banca_id.eq.${bancaId}`,
        produtos_diretos_encontrados: produtoDireto?.length || 0,
        produtos_filtrados_encontrados: produtosFiltrados?.length || 0
      }
    });

  } catch (error: any) {
    console.error('Erro no debug:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
