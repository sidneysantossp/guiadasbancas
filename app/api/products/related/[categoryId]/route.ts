import { NextResponse, NextRequest } from "next/server";
import { isPublishedMarketplaceBanca } from "@/lib/public-banca-access";
import { supabaseAdmin } from "@/lib/supabase";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";

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
        .select('id, active, approved')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    // Resolver preço de venda para produtos de distribuidor
    const distribuidorProducts = (data || []).filter((p: any) => p.distribuidor_id);
    const { customMap, calculateDistributorPrice } = await loadDistributorPricingContext<{
      product_id: string;
      enabled: boolean | null;
      custom_price: number | null;
    }>({
      products: distribuidorProducts,
      customFields: bancaId ? 'product_id, enabled, custom_price' : null,
      customBancaId: bancaId || null,
    });

    // Filtrar produtos com imagem (produtos de distribuidor ou de banca publicada)
    const filteredProducts = (data || [])
      .filter(product => product.images && product.images.length > 0)
      .filter(product => product.distribuidor_id || isPublishedMarketplaceBanca(bancaMap.get(product.banca_id)))
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
          return calculateDistributorPrice(product);
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
