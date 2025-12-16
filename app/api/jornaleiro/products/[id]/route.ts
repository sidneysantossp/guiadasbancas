import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

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
        categories(name),
        bancas(name)
      `)
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    }

    // Se o produto tem distribuidor_id, buscar customizações da banca e aplicar Markup
    if (product.distribuidor_id) {
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

      // Aplicar regras de prioridade: Produto > Categoria > Global
      if (markupProd && (markupProd.markup_percentual > 0 || markupProd.markup_fixo > 0)) {
        precoComMarkup = product.price * (1 + markupProd.markup_percentual / 100) + markupProd.markup_fixo;
      } else if (markupCat && (markupCat.markup_percentual > 0 || markupCat.markup_fixo > 0)) {
        precoComMarkup = product.price * (1 + markupCat.markup_percentual / 100) + markupCat.markup_fixo;
      } else if (dist) {
        if (dist.tipo_calculo === 'margem' && dist.margem_divisor > 0 && dist.margem_divisor < 1) {
          precoComMarkup = product.price / dist.margem_divisor;
        } else {
          const perc = dist.markup_global_percentual || 0;
          const fixo = dist.markup_global_fixo || 0;
          if (perc > 0 || fixo > 0) {
            precoComMarkup = product.price * (1 + perc / 100) + fixo;
          }
        }
      }

      // Buscar banca do usuário para pegar customizações
      const { data: banca } = await supabaseAdmin
        .from('bancas')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (banca) {
        // Buscar customizações específicas da banca
        const { data: customization } = await supabaseAdmin
          .from('banca_produtos_distribuidor')
          .select('*')
          .eq('banca_id', banca.id)
          .eq('product_id', id)
          .single();

        if (customization) {
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
          discount_percent: 0
        }
      });
    }

    // Se é produto de banca específica, verificar se pertence ao usuário
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

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
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { id } = context.params;
    const body = await request.json();

    // Buscar banca do usuário
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

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
      const customizationData = {
        banca_id: banca.id,
        product_id: id,
        enabled: body.active !== false,
        custom_price: body.price || null,
        custom_description: body.description || null,
        custom_pronta_entrega: body.pronta_entrega || null,
        custom_sob_encomenda: body.sob_encomenda || null,
        custom_pre_venda: body.pre_venda || null,
        custom_featured: body.featured || false,
        modificado_em: new Date().toISOString()
      };

      // Usar upsert para inserir ou atualizar customização
      const { error: customError } = await supabaseAdmin
        .from('banca_produtos_distribuidor')
        .upsert(customizationData, { 
          onConflict: 'banca_id,product_id'
        });

      if (customError) {
        console.error('Erro ao salvar customização:', customError);
        return NextResponse.json({ success: false, error: 'Erro ao salvar customização' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Customização salva com sucesso' });
    }

    // Para produtos próprios da banca, verificar se pertence ao usuário
    if (existingProduct.banca_id !== banca.id) {
      return NextResponse.json({ success: false, error: "Não autorizado a editar este produto" }, { status: 403 });
    }

    // Filtrar apenas campos válidos da tabela products
    const validFields = [
      'name', 'description', 'price', 'price_original', 'discount_percent',
      'stock_qty', 'track_stock', 'featured', 'images', 'active',
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

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
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
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

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
