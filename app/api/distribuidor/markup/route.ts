import { NextRequest, NextResponse } from 'next/server';
import { requireDistribuidorAccess } from '@/lib/security/distribuidor-auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET - Buscar configurações de markup do distribuidor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    // Buscar configuração global do distribuidor
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo')
      .eq('id', distribuidorId)
      .single();

    if (distError) {
      console.error('[Markup] Erro ao buscar distribuidor:', distError);
      return NextResponse.json(
        { success: false, error: 'Distribuidor não encontrado' },
        { status: 404 }
      );
    }

    // Buscar markups por categoria (sem FK join - FK foi removida)
    const { data: markupCategorias } = await supabaseAdmin
      .from('distribuidor_markup_categorias')
      .select('id, category_id, markup_percentual, markup_fixo')
      .eq('distribuidor_id', distribuidorId);

    // Buscar markups por produto
    const { data: markupProdutos } = await supabaseAdmin
      .from('distribuidor_markup_produtos')
      .select(`
        id,
        product_id,
        markup_percentual,
        markup_fixo,
        products(id, name, codigo_mercos, price)
      `)
      .eq('distribuidor_id', distribuidorId);

    // Buscar categorias disponíveis (distribuidor_categories + categories)
    const [{ data: distCatsMarkup }, { data: bancaCatsMarkup }] = await Promise.all([
      supabaseAdmin.from('distribuidor_categories').select('id, nome').eq('distribuidor_id', distribuidorId),
      supabaseAdmin.from('categories').select('id, name').eq('active', true).order('name'),
    ]);
    const catNameMap = new Map<string, string>();
    for (const c of distCatsMarkup || []) catNameMap.set(c.id, c.nome);
    for (const c of bancaCatsMarkup || []) catNameMap.set(c.id, c.name);

    // Combinar categorias disponíveis para seleção
    const categoriasDisponiveis = [
      ...(distCatsMarkup || []).map((c: any) => ({ id: c.id, name: c.nome })),
      ...(bancaCatsMarkup || []).map((c: any) => ({ id: c.id, name: c.name })),
    ].sort((a, b) => a.name.localeCompare(b.name));

    // Contar total de produtos do distribuidor (ativos e inativos)
    const { count: totalProdutos } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    return NextResponse.json({
      success: true,
      data: {
        global: {
          markup_percentual: distribuidor.markup_global_percentual || 0,
          markup_fixo: distribuidor.markup_global_fixo || 0,
          margem_percentual: distribuidor.margem_percentual || 0,
          margem_divisor: distribuidor.margem_divisor || 1,
          tipo_calculo: distribuidor.tipo_calculo || 'markup',
        },
        categorias: (markupCategorias || []).map((m: any) => ({
          id: m.id,
          category_id: m.category_id,
          category_name: catNameMap.get(m.category_id) || 'Categoria',
          markup_percentual: m.markup_percentual || 0,
          markup_fixo: m.markup_fixo || 0,
        })),
        produtos: (markupProdutos || []).map((m: any) => ({
          id: m.id,
          product_id: m.product_id,
          product_name: m.products?.name || 'Produto',
          product_codigo: m.products?.codigo_mercos || '',
          product_price: m.products?.price ?? null,
          markup_percentual: m.markup_percentual || 0,
          markup_fixo: m.markup_fixo || 0,
        })),
        categorias_disponiveis: categoriasDisponiveis || [],
        total_produtos: totalProdutos || 0,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[Markup] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Salvar configurações de markup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { distribuidor_id, tipo, ...dados } = body;
    const authError = await requireDistribuidorAccess(request, distribuidor_id);
    if (authError) return authError;

    console.log('[Markup] Salvando markup:', { distribuidor_id, tipo, dados });

    switch (tipo) {
      case 'global': {
        // Atualizar markup global do distribuidor
        const { error } = await supabaseAdmin
          .from('distribuidores')
          .update({
            markup_global_percentual: dados.markup_percentual || 0,
            markup_global_fixo: dados.markup_fixo || 0,
            margem_percentual: dados.margem_percentual || 0,
            margem_divisor: dados.margem_divisor || 1,
            tipo_calculo: dados.tipo_calculo || 'markup',
          })
          .eq('id', distribuidor_id);

        if (error) throw error;
        break;
      }

      case 'categoria': {
        // Upsert markup de categoria
        const { error } = await supabaseAdmin
          .from('distribuidor_markup_categorias')
          .upsert({
            distribuidor_id,
            category_id: dados.category_id,
            markup_percentual: dados.markup_percentual || 0,
            markup_fixo: dados.markup_fixo || 0,
          }, {
            onConflict: 'distribuidor_id,category_id',
          });

        if (error) throw error;
        break;
      }

      case 'produto': {
        // Upsert markup de produto
        const { error } = await supabaseAdmin
          .from('distribuidor_markup_produtos')
          .upsert({
            distribuidor_id,
            product_id: dados.product_id,
            markup_percentual: dados.markup_percentual || 0,
            markup_fixo: dados.markup_fixo || 0,
          }, {
            onConflict: 'distribuidor_id,product_id',
          });

        if (error) throw error;
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Tipo de markup inválido' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[Markup] Erro ao salvar:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remover markup específico (categoria ou produto)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const id = searchParams.get('id');
    const distribuidorId = searchParams.get('distribuidor_id');

    if (!tipo || !id) {
      return NextResponse.json(
        { success: false, error: 'Tipo e ID são obrigatórios' },
        { status: 400 }
      );
    }

    const authError = await requireDistribuidorAccess(request, distribuidorId);
    if (authError) return authError;

    const tabela = tipo === 'categoria' 
      ? 'distribuidor_markup_categorias' 
      : 'distribuidor_markup_produtos';

    let query = supabaseAdmin
      .from(tabela)
      .delete()
      .eq('id', id);

    if (distribuidorId) {
      query = query.eq('distribuidor_id', distribuidorId);
    }

    const { error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[Markup] Erro ao deletar:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
