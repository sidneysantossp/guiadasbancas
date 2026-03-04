import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = params.categoryId;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 20);
    const excludeId = searchParams.get("exclude") || "";
    const bancaId = searchParams.get("banca") || "";

    // Buscar produtos da mesma categoria
    // Incluir produtos de distribuidores para ter mais variedade
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        codigo_mercos,
        category_id,
        active,
        distribuidor_id,
        banca_id
      `)
      .eq('category_id', categoryId)
      .eq('active', true)
      .limit(limit);

    // Excluir produto atual se especificado
    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
    }

    const bancaIds = Array.from(new Set((data || []).map((p: any) => p.banca_id).filter(Boolean)));
    const bancaMap = new Map<string, any>();
    if (bancaIds.length > 0) {
      const { data: bancas } = await supabaseAdmin
        .from('bancas')
        .select('id, is_cotista, cotista_id, active')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);

    // Resolver preço de venda para produtos de distribuidor
    const distribuidorProducts = (data || []).filter((p: any) => p.distribuidor_id);
    const distribuidorIds = Array.from(new Set(distribuidorProducts.map((p: any) => p.distribuidor_id)));
    const relatedProductIds = distribuidorProducts.map((p: any) => p.id);

    const [distRes, markupProdRes, markupCatRes, customRes] = await Promise.all([
      distribuidorIds.length > 0
        ? supabaseAdmin
            .from('distribuidores')
            .select('id, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_divisor')
            .in('id', distribuidorIds)
        : Promise.resolve({ data: [] as any[] }),
      distribuidorIds.length > 0 && relatedProductIds.length > 0
        ? supabaseAdmin
            .from('distribuidor_markup_produtos')
            .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
            .in('distribuidor_id', distribuidorIds)
            .in('product_id', relatedProductIds)
        : Promise.resolve({ data: [] as any[] }),
      distribuidorIds.length > 0
        ? supabaseAdmin
            .from('distribuidor_markup_categorias')
            .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
            .in('distribuidor_id', distribuidorIds)
            .in('category_id', [categoryId])
        : Promise.resolve({ data: [] as any[] }),
      bancaId && relatedProductIds.length > 0
        ? supabaseAdmin
            .from('banca_produtos_distribuidor')
            .select('product_id, enabled, custom_price')
            .eq('banca_id', bancaId)
            .in('product_id', relatedProductIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const distMap = new Map((distRes.data || []).map((d: any) => [d.id, d]));
    const markupProdMap = new Map((markupProdRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.product_id}`, m]));
    const markupCatMap = new Map((markupCatRes.data || []).map((m: any) => [`${m.distribuidor_id}:${m.category_id}`, m]));
    const customMap = new Map((customRes.data || []).map((c: any) => [c.product_id, c]));

    const calcularPrecoVendaDistribuidor = (product: any): number => {
      const precoBase = Number(product.price || 0);
      const dist = distMap.get(product.distribuidor_id);
      if (!dist) return precoBase;

      const mp = markupProdMap.get(`${product.distribuidor_id}:${product.id}`);
      if (mp && (Number(mp.markup_percentual || 0) > 0 || Number(mp.markup_fixo || 0) > 0)) {
        return Math.round((precoBase * (1 + Number(mp.markup_percentual || 0) / 100) + Number(mp.markup_fixo || 0)) * 100) / 100;
      }

      const mc = markupCatMap.get(`${product.distribuidor_id}:${product.category_id}`);
      if (mc && (Number(mc.markup_percentual || 0) > 0 || Number(mc.markup_fixo || 0) > 0)) {
        return Math.round((precoBase * (1 + Number(mc.markup_percentual || 0) / 100) + Number(mc.markup_fixo || 0)) * 100) / 100;
      }

      if (dist.tipo_calculo === 'margem') {
        const divisor = Number(dist.margem_divisor || 1);
        if (divisor > 0 && divisor < 1) {
          return Math.round((precoBase / divisor) * 100) / 100;
        }
      }

      const perc = Number(dist.markup_global_percentual || 0);
      const fixo = Number(dist.markup_global_fixo || 0);
      if (perc > 0 || fixo > 0) {
        return Math.round((precoBase * (1 + perc / 100) + fixo) * 100) / 100;
      }
      return precoBase;
    };

    // Filtrar produtos com imagem (produtos de distribuidor ou de banca cotista)
    const filteredProducts = (data || [])
      .filter(product => product.images && product.images.length > 0)
      .filter(product => product.distribuidor_id || isActiveCotistaBanca(bancaMap.get(product.banca_id)))
      .filter((product: any) => {
        if (!product.distribuidor_id || !bancaId) return true;
        const custom = customMap.get(product.id);
        return custom?.enabled !== false;
      })
      .map(product => ({
        id: product.id,
        name: product.name || 'Produto',
        price: (() => {
          if (!product.distribuidor_id) return Number(product.price || 0);
          const custom = bancaId ? customMap.get(product.id) : null;
          if (custom?.custom_price != null) return Number(custom.custom_price);
          return calcularPrecoVendaDistribuidor(product);
        })(),
        image: Array.isArray(product.images) ? product.images[0] : product.images,
        codigo_mercos: product.codigo_mercos,
      }));

    return NextResponse.json({
      success: true,
      data: filteredProducts
    });

  } catch (error: any) {
    console.error('Erro na API de produtos relacionados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
