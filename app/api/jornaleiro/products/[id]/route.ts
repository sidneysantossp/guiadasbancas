import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import {
  applyDistributorProductCustomization,
  buildDistributorProductCustomizationInput,
  calculateDistributorProductMarkup,
  loadDistributorProductCustomization,
  saveDistributorProductCustomization,
} from "@/lib/modules/products/service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { id } = context.params;

    // Buscar o produto por ID
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        bancas(name)
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    // Se o produto tem distribuidor_id, buscar customizações da banca e aplicar Markup
    if (product.distribuidor_id) {
      console.log(`[PRODUCT_GET] Produto ${id} é de distribuidor (${product.distribuidor_id})`);
      const precoComMarkup = await calculateDistributorProductMarkup({
        productId: id,
        distribuidorId: product.distribuidor_id,
        categoryId: product.category_id,
        basePrice: Number(product.price || 0),
      });

      // Buscar banca do usuário para pegar customizações
      const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

      if (banca) {
        const entitlements = await resolveBancaPlanEntitlements(banca);
        if (!entitlements.canAccessDistributorCatalog) {
          return NextResponse.json(
            { success: false, error: "Seu plano atual não permite acessar produtos do catálogo de distribuidores." },
            { status: 403 }
          );
        }

        // Buscar customizações específicas da banca
        const customization = await loadDistributorProductCustomization({
          bancaId: banca.id,
          productId: id,
        });

        if (customization) {
          console.log('[PRODUCT_GET] Customização encontrada:', customization);
          const responseData = applyDistributorProductCustomization({
            product,
            markupPrice: precoComMarkup,
            customization,
          });
          
          return NextResponse.json({ success: true, data: responseData });
        }
      }
      
      // Sem customização: retorna preço com markup como preço principal
      return NextResponse.json({ 
        success: true, 
        data: {
          ...product,
          price: precoComMarkup,
          price_original: null, // ou precoComMarkup, mas o front trata null como "sem customização"
          cost_price: product.price, // Adicionar explicitamente o custo base
          discount_percent: 0
        }
      });
    }

    // Se é produto de banca específica, verificar se pertence ao usuário
    const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

    if (!banca || product.banca_id !== banca.id) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    console.log('[PATCH] Iniciando atualização de produto...');
    
    const session = await auth();
    console.log('[PATCH] Session:', session?.user?.id ? 'OK' : 'NULL');
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { id } = context.params;
    console.log('[PATCH] Product ID:', id);
    
    let body;
    try {
      body = await request.json();
      console.log('[PATCH] Body recebido:', Object.keys(body));
    } catch (parseError) {
      console.error('[PATCH] Erro ao parsear body:', parseError);
      return NextResponse.json({ success: false, error: "Erro ao processar requisição" }, { status: 400 });
    }

    // Buscar banca do usuário
    const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    // Verificar se o produto existe e pertence à banca
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('id, banca_id, distribuidor_id')
      .eq('id', id)
      .single();

    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    // Se é produto do distribuidor, permitir apenas customizações de preço
    if (existingProduct.distribuidor_id) {
      const entitlements = await resolveBancaPlanEntitlements(banca);
      if (!entitlements.canAccessDistributorCatalog) {
        return NextResponse.json(
          { success: false, error: "Seu plano atual não permite editar produtos do catálogo de distribuidores." },
          { status: 403 }
        );
      }

      console.log('Produto do distribuidor - salvando customização:', {
        product_id: id,
        featured: body.featured,
        body_keys: Object.keys(body)
      });
      
      const customizationInput = buildDistributorProductCustomizationInput(body, {
        defaultEnabled: body.active !== false,
        useProductEditorAliases: true,
      });

      console.log('[PATCH] Salvando customização do distribuidor:', {
        customizationInput,
      });

      await saveDistributorProductCustomization({
        bancaId: banca.id,
        productId: id,
        input: customizationInput,
      });

      return NextResponse.json({ success: true, message: 'Customização salva com sucesso' });
    }

    // Para produtos próprios da banca, verificar se pertence ao usuário
    if (existingProduct.banca_id !== banca.id) {
      return NextResponse.json({ success: false, error: "Não autorizado a editar este produto" }, { status: 403 });
    }

    // Filtrar apenas campos válidos da tabela products
    const validFields = [
      'name', 'description', 'description_full', 'specifications',
      'price', 'price_original', 'discount_percent',
      'stock_qty', 'track_stock', 'images', 'active', 'featured',
      'sob_encomenda', 'pre_venda', 'pronta_entrega', 'category_id'
    ];
    
    const updateData: Record<string, any> = {};
    for (const key of validFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    // Auto-desativar produto quando estoque chega a zero
    if (
      Object.prototype.hasOwnProperty.call(updateData, 'stock_qty') &&
      Number(updateData.stock_qty) === 0
    ) {
      updateData.active = false;
    }

    updateData.updated_at = new Date().toISOString();

    console.log('[PATCH] Atualizando produto:', { id, updateData });

    // Atualizar produto
    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return NextResponse.json({ success: false, error: 'Erro ao atualizar produto: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedProduct });

  } catch (error: any) {
    console.error('[PATCH] Erro ao atualizar produto:', error);
    console.error('[PATCH] Stack:', error?.stack);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno: ' + (error?.message || 'desconhecido'),
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { id } = context.params;

    // Buscar banca do usuário
    const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    // Verificar se o produto existe e pertence à banca
    const { data: existingProduct } = await supabaseAdmin
      .from('products')
      .select('id, banca_id, distribuidor_id')
      .eq('id', id)
      .single();

    if (!existingProduct) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    // Só pode deletar produtos da própria banca (não produtos do distribuidor)
    if (existingProduct.banca_id !== banca.id || existingProduct.distribuidor_id) {
      return NextResponse.json({ success: false, error: "Não autorizado a deletar este produto" }, { status: 403 });
    }

    // Deletar produto
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      return NextResponse.json({ success: false, error: 'Erro ao deletar produto' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Produto deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}
