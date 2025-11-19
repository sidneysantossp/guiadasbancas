import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Listar favoritos do usuário
export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Buscar favoritos do usuário com informações dos produtos
    const { data: favorites, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          price,
          images,
          rating_avg,
          reviews_count
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API Favorites GET] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: favorites || [],
      count: favorites?.length || 0
    });

  } catch (error: any) {
    console.error('[API Favorites GET] Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Adicionar produto aos favoritos
export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'product_id é obrigatório' }, { status: 400 });
    }

    // Verificar se o produto existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    }

    // Adicionar aos favoritos
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: session.user.id,
        product_id
      })
      .select()
      .single();

    if (error) {
      // Se já existe, retornar sucesso mesmo assim
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ 
          success: true, 
          message: 'Produto já está nos favoritos',
          already_exists: true
        });
      }
      console.error('[API Favorites POST] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Produto adicionado aos favoritos!',
      data 
    });

  } catch (error: any) {
    console.error('[API Favorites POST] Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remover produto dos favoritos
export async function DELETE(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json({ error: 'product_id é obrigatório' }, { status: 400 });
    }

    // Remover dos favoritos
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', product_id);

    if (error) {
      console.error('[API Favorites DELETE] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Produto removido dos favoritos!' 
    });

  } catch (error: any) {
    console.error('[API Favorites DELETE] Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
