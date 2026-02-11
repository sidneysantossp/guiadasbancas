import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

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
      
      // 1. Calcular preço com Markup
      let precoComMarkup = product.price;

      // Buscar regras de markup
      const [
        { data: dist },
        { data: markupCat },
        { data: markupProd }
      ] = await Promise.all([
        supabaseAdmin
          .from('distribuidores')
          .select('markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo')
          .eq('id', product.distribuidor_id)
          .single(),
        product.category_id ? supabaseAdmin
          .from('distribuidor_markup_categorias')
          .select('markup_percentual, markup_fixo')
          .eq('distribuidor_id', product.distribuidor_id)
          .eq('category_id', product.category_id)
          .single() : { data: null },
        supabaseAdmin
          .from('distribuidor_markup_produtos')
          .select('markup_percentual, markup_fixo')
          .eq('distribuidor_id', product.distribuidor_id)
          .eq('product_id', id)
          .single()
      ]);

      console.log('[PRODUCT_GET] Regras de Markup encontradas:', {
        dist: dist ? 'Sim' : 'Não',
        markupCat: markupCat ? `Sim (${markupCat.markup_percentual}%)` : 'Não',
        markupProd: markupProd ? `Sim (${markupProd.markup_percentual}%)` : 'Não',
        precoBase: product.price
      });

      // Aplicar regras de prioridade: Produto > Categoria > Global
      if (markupProd) {
        const mpPerc = Number(markupProd.markup_percentual || 0);
        const mpFixo = Number(markupProd.markup_fixo || 0);
        if (mpPerc > 0 || mpFixo > 0) {
          precoComMarkup = product.price * (1 + mpPerc / 100) + mpFixo;
          console.log(`[PRODUCT_GET] Aplicado Markup Produto: ${precoComMarkup}`);
        }
      } 
      
      // Se não aplicou markup de produto, tenta categoria
      if (precoComMarkup === product.price && markupCat) {
        const mcPerc = Number(markupCat.markup_percentual || 0);
        const mcFixo = Number(markupCat.markup_fixo || 0);
        if (mcPerc > 0 || mcFixo > 0) {
          precoComMarkup = product.price * (1 + mcPerc / 100) + mcFixo;
          console.log(`[PRODUCT_GET] Aplicado Markup Categoria: ${precoComMarkup}`);
        }
      }
      
      // Se não aplicou produto nem categoria, tenta global
      if (precoComMarkup === product.price && dist) {
        const margemDivisor = Number(dist.margem_divisor || 1);
        
        if (dist.tipo_calculo === 'margem' && margemDivisor > 0 && margemDivisor < 1) {
          precoComMarkup = product.price / margemDivisor;
          console.log(`[PRODUCT_GET] Aplicado Margem Global: ${precoComMarkup}`);
        } else {
          const perc = Number(dist.markup_global_percentual || 0);
          const fixo = Number(dist.markup_global_fixo || 0);
          
          if (perc > 0 || fixo > 0) {
            precoComMarkup = product.price * (1 + perc / 100) + fixo;
            console.log(`[PRODUCT_GET] Aplicado Markup Global (${perc}% + ${fixo}): ${precoComMarkup}`);
          } else {
            console.log('[PRODUCT_GET] Distribuidor sem markup global configurado');
          }
        }
      }

      // Buscar banca do usuário para pegar customizações
      const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

      if (banca) {
        // Buscar customizações específicas da banca
        const { data: customization } = await supabaseAdmin
          .from('banca_produtos_distribuidor')
          .select('*')
          .eq('banca_id', banca.id)
          .eq('product_id', id)
          .single();

        if (customization) {
          console.log('[PRODUCT_GET] Customização encontrada:', customization);
          const finalPrice = customization.custom_price || precoComMarkup;
          const originalPrice = precoComMarkup;
          
          // Calcular desconto dinamicamente pois não salvamos na tabela de customização
          let computedDiscount = 0;
          if (originalPrice > finalPrice && originalPrice > 0) {
             computedDiscount = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
          }

          const responseData = {
            ...product,
            // Se tem preço customizado, usa ele como price.
            // O preço "original" (base de cálculo para visualização) será o precoComMarkup
            price: finalPrice, 
            price_original: originalPrice,
            cost_price: product.price, // Adicionar explicitamente o custo base
            discount_percent: computedDiscount,
            
            // Outros campos customizados
            description: product.description + (customization.custom_description ? `\n\n${customization.custom_description}` : ''),
            pronta_entrega: customization.custom_pronta_entrega ?? product.pronta_entrega,
            sob_encomenda: customization.custom_sob_encomenda ?? product.sob_encomenda,
            pre_venda: customization.custom_pre_venda ?? product.pre_venda,
            active: customization.enabled !== false,
            featured: customization.custom_featured ?? product.featured,
          };
          
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
      console.log('Produto do distribuidor - salvando customização:', {
        product_id: id,
        featured: body.featured,
        body_keys: Object.keys(body)
      });
      
      // Para produtos do distribuidor, salvar customizações na tabela específica
      // Verificar se já existe customização
      const { data: existing } = await supabaseAdmin
        .from('banca_produtos_distribuidor')
        .select('id')
        .eq('banca_id', banca.id)
        .eq('product_id', id)
        .single();

      // Montar dados de atualização
      const updateData: Record<string, any> = {
        enabled: body.active !== false
      };
      
      if (body.price !== undefined) updateData.custom_price = body.price;
      if (body.description !== undefined) updateData.custom_description = body.description;
      if (body.pronta_entrega !== undefined) updateData.custom_pronta_entrega = body.pronta_entrega;
      if (body.sob_encomenda !== undefined) updateData.custom_sob_encomenda = body.sob_encomenda;
      if (body.pre_venda !== undefined) updateData.custom_pre_venda = body.pre_venda;
      if (body.featured !== undefined) updateData.custom_featured = body.featured;

      console.log('[PATCH] Salvando customização do distribuidor:', { existing: !!existing, updateData });

      let customError;
      if (existing) {
        // Atualizar customização existente
        const { error } = await supabaseAdmin
          .from('banca_produtos_distribuidor')
          .update(updateData)
          .eq('id', existing.id);
        customError = error;
      } else {
        // Criar nova customização
        const { error } = await supabaseAdmin
          .from('banca_produtos_distribuidor')
          .insert([{
            banca_id: banca.id,
            product_id: id,
            ...updateData
          }]);
        customError = error;
      }

      if (customError) {
        console.error('Erro ao salvar customização:', customError);
        return NextResponse.json({ success: false, error: 'Erro ao salvar customização: ' + customError.message }, { status: 500 });
      }

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
