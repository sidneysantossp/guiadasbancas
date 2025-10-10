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

    // Se o produto tem distribuidor_id, qualquer jornaleiro pode ver
    if (product.distribuidor_id) {
      return NextResponse.json({ success: true, data: product });
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

    // Atualizar produto
    const { data: updatedProduct, error } = await supabaseAdmin
      .from('products')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return NextResponse.json({ success: false, error: 'Erro ao atualizar produto' }, { status: 500 });
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
