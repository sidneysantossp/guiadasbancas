import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { loadDistributorPricingContext } from '@/lib/modules/products/service';

const CATEGORIA_DISTRIBUIDORES_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const PRODUCT_FETCH_BATCH_SIZE = 1000;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchProductRows(buildQuery: () => any): Promise<any[]> {
  const rows: any[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await buildQuery().range(
      offset,
      offset + PRODUCT_FETCH_BATCH_SIZE - 1
    );

    if (error) {
      throw error;
    }

    const batch = data || [];
    rows.push(...batch);

    if (batch.length < PRODUCT_FETCH_BATCH_SIZE) {
      break;
    }

    offset += batch.length;
  }

  return rows;
}

function canShowMarketplaceCatalog(banca: { active?: boolean | null } | null | undefined) {
  return Boolean(banca?.active !== false);
}

// GET /api/bancas/:id/produtos-completo
// Retorna produtos próprios + produtos de distribuidor habilitados
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;
    const bancaId = params.id;

    const { data: banca, error: bancaError } = await supabase
      .from('bancas')
      .select('id, active, approved, is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    if (bancaError) {
      console.error('[API] Erro ao buscar banca:', bancaError);
      return NextResponse.json(
        { success: false, error: bancaError.message },
        { status: 500 }
      );
    }

    const partnerLinked = banca?.is_cotista === true || Boolean(banca?.cotista_id);

    if (!canShowMarketplaceCatalog(banca)) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: false,
        partner_catalog_access: false,
        data: [],
        total: 0,
        stats: {
          proprios: 0,
          distribuidores: 0,
        },
      });
    }

    // 1. Buscar produtos próprios da banca
    const produtosProprios = await fetchProductRows(() =>
      supabase
        .from('products')
        .select('*')
        .eq('banca_id', bancaId)
        .eq('active', true)
        .is('distribuidor_id', null)
        .order('name', { ascending: true })
    );

    const produtosPropriosExpostos = produtosProprios || [];

    // 2. Buscar produtos de distribuidor para qualquer banca publicada.
    let produtosDistribuidor: any[] = [];

    const produtosBase = await fetchProductRows(() =>
      supabase
        .from('products')
        .select('*')
        .not('distribuidor_id', 'is', null)
        .eq('active', true)
        .gt('stock_qty', 0)
        .order('name', { ascending: true })
    );

    if (produtosBase && produtosBase.length > 0) {
      const { customMap, calculateDistributorPrice } = await loadDistributorPricingContext<{
        product_id: string;
        enabled: boolean | null;
        custom_price: number | null;
        custom_description: string | null;
        custom_status: string | null;
        custom_pronta_entrega: boolean | null;
        custom_sob_encomenda: boolean | null;
        custom_pre_venda: boolean | null;
      }>({
        products: (produtosBase || []) as any[],
        customFields: 'product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda',
        customBancaId: bancaId,
        includeAllBancaCustomizationsWhenLarge: true,
      });

      // Combinar dados base com customizações
      produtosDistribuidor = (produtosBase || []).map(produto => {
        const custom = customMap.get(produto.id);
        if (custom?.enabled === false) return null;
        const effectivePrice = custom?.custom_price != null
          ? Number(custom.custom_price)
          : calculateDistributorPrice(produto);
        
        return {
          ...produto,
          // Aplicar customizações
          price: effectivePrice,
          description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
          status: custom?.custom_status || 'available',
          pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
          sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
          pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
          // Adicionar à categoria de distribuidores
          category_id: CATEGORIA_DISTRIBUIDORES_ID,
          // Flag para identificar origem
          is_distribuidor: true,
        };
      }).filter(Boolean);
    }

    // 4. Combinar todos os produtos
    const todosProdutos = [
      ...produtosPropriosExpostos.map(p => ({ ...p, is_distribuidor: false })),
      ...produtosDistribuidor,
    ];

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: partnerLinked,
      partner_linked: partnerLinked,
      can_access_distributor_catalog: true,
      partner_catalog_access: true,
      data: todosProdutos,
      total: todosProdutos.length,
      stats: {
        proprios: produtosPropriosExpostos.length,
        distribuidores: produtosDistribuidor.length,
      },
    });
  } catch (error: any) {
    console.error('[API] Erro ao buscar produtos:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
