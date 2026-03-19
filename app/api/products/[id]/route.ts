import { NextRequest, NextResponse } from "next/server";
import { getPublishedDistributorCatalogBancas, isPublishedMarketplaceBanca } from "@/lib/public-banca-access";
import { supabaseAdmin } from "@/lib/supabase";
import {
  applyDistributorProductCustomization,
  calculateDistributorProductMarkup,
  loadDistributorProductCustomization,
} from "@/lib/modules/products/service";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const productId = context.params.id;
  
  // Pegar banca_id da query string (quando produto é acessado do perfil de uma banca)
  const { searchParams } = new URL(req.url);
  const bancaIdFromQuery = searchParams.get('banca');

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        bancas(id, name, address, whatsapp, active, approved)
      `)
      .eq('id', productId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Resolver nome da categoria sem FK join (FK foi removida)
    if (data.category_id) {
      const { data: distCat } = await supabaseAdmin.from('distribuidor_categories').select('id, nome').eq('id', data.category_id).single();
      if (distCat) {
        (data as any).categories = { id: distCat.id, name: distCat.nome };
      } else {
        const { data: bancaCat } = await supabaseAdmin.from('categories').select('id, name').eq('id', data.category_id).single();
        if (bancaCat) {
          (data as any).categories = bancaCat;
        }
      }
    }

    // Produtos próprios só são públicos se a banca estiver publicada no marketplace
    if (!data.distribuidor_id) {
      if (!isPublishedMarketplaceBanca(data.bancas)) {
        return NextResponse.json({ error: "Produto não disponível" }, { status: 404 });
      }
    }

    // Produtos de distribuidor: aplicar markup completo antes de retornar
    if (data.distribuidor_id) {
      const precoBase = data.price || 0;
      const precoFinal = await calculateDistributorProductMarkup({
        productId,
        distribuidorId: data.distribuidor_id,
        categoryId: data.category_id,
        basePrice: precoBase,
      });

      // Atualizar preço no objeto de retorno
      data.price = Math.round(precoFinal * 100) / 100;
      data.cost_price = precoBase;
      
      // Para produtos de distribuidor, usar a banca especificada na query (se fornecida e válida)
      if (bancaIdFromQuery) {
        const bancasElegiveis = await getPublishedDistributorCatalogBancas();
        const bancaOverride = bancasElegiveis.find((banca) => banca.id === bancaIdFromQuery) || null;
        
        if (bancaOverride) {
          // Verificar customização da banca para esse produto
          const customizacao = await loadDistributorProductCustomization({
            bancaId: bancaIdFromQuery,
            productId,
          });

          // Produto desabilitado explicitamente para essa banca
          if (customizacao?.enabled === false) {
            return NextResponse.json({ error: "Produto não disponível para esta banca" }, { status: 404 });
          }

          Object.assign(
            data,
            applyDistributorProductCustomization({
              product: data,
              markupPrice: precoFinal,
              customization: customizacao,
            })
          );

          // Usar a banca da query
          data.bancas = bancaOverride;
          data.banca_id = bancaOverride.id;
          console.log(`[API/PRODUCTS/ID] Usando banca da query: ${bancaOverride.name}`);
        }
      }
    }

    return NextResponse.json(data);
  } catch (supaError) {
    console.error('[API/PRODUCTS/ID] Erro ao buscar do Supabase:', supaError);
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

export async function DELETE(_req: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
