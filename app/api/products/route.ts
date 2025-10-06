import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import type { Produto } from "@/types/admin";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

const CATEGORIA_DISTRIBUIDORES_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const DEFAULT_PRODUCT_IMAGE = 'https://cdn1.staticpanvel.com.br/produtos/15/produto-sem-imagem.jpg';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // SEGURANÇA: Verificar autenticação
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userRole = (session?.user as any)?.role as string | undefined;
    const userId = (session?.user as any)?.id as string | undefined;
    
    // SEGURANÇA: Verificar role válido
    if (!userRole || !['admin', 'jornaleiro'].includes(userRole)) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const category = searchParams.get("category") || "";
    const active = searchParams.get("active");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100); // Máximo 100
    let bancaId = searchParams.get("banca_id") || "";

    // SEGURANÇA: Para jornaleiros, forçar filtro pela própria banca
    if (userRole === 'jornaleiro') {
      const { data: bancaData } = await supabaseAdmin
        .from('bancas')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (!bancaData) {
        return NextResponse.json({ error: "Banca não encontrada" }, { status: 404 });
      }
      bancaId = bancaData.id;
    }

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(name),
        bancas(name)
      `);

    // Aplicar filtros
    if (q) {
      query = query.ilike('name', `%${q}%`);
    }
    if (category) {
      query = query.eq('category_id', category);
    }
    if (bancaId) {
      query = query.eq('banca_id', bancaId);
    }
    if (active !== null) {
      // Assumindo que produtos ativos são aqueles com estoque ou sem controle de estoque
      if (active === "true") {
        query = query.or('track_stock.eq.false,stock_qty.gt.0');
      } else {
        query = query.eq('track_stock', true).eq('stock_qty', 0);
      }
    }

    // Aplicar limite
    query = query.limit(limit);
    
    const { data, error } = await query.order('created_at', { ascending: false});
    
    let allData = data || [];
    
    // Se filtrar por banca_id, incluir produtos de distribuidor
    if (bancaId && !error) {
      // Buscar TODOS os produtos de distribuidor
      const { data: todosProdutosDistribuidor } = await supabaseAdmin
        .from('products')
        .select(`
          *,
          categories(name),
          bancas(name)
        `)
        .not('distribuidor_id', 'is', null);

      if (todosProdutosDistribuidor && todosProdutosDistribuidor.length > 0) {
        // Buscar customizações desta banca (se houver)
        const { data: customizacoes } = await supabaseAdmin
          .from('banca_produtos_distribuidor')
          .select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda')
          .eq('banca_id', bancaId);

        // Mapear customizações por product_id
        const customMap = new Map(
          (customizacoes || []).map(c => [c.product_id, c])
        );

        // Aplicar customizações e filtrar desabilitados
        const produtosCustomizados = todosProdutosDistribuidor
          .filter(produto => {
            const custom = customMap.get(produto.id);
            return !custom || custom.enabled !== false;
          })
          .map(produto => {
            const custom = customMap.get(produto.id);
            
            // Garantir que há uma imagem
            let images = produto.images || [];
            if (!Array.isArray(images) || images.length === 0) {
              images = [DEFAULT_PRODUCT_IMAGE];
            }
            
            return {
              ...produto,
              images,
              price: custom?.custom_price || produto.price,
              description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
              pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
              sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
              pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
              category_id: CATEGORIA_DISTRIBUIDORES_ID,
              is_distribuidor: true,
            };
          });

        allData = [...allData, ...produtosCustomizados];
      }
    }

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return NextResponse.json({ items: [], total: 0 });
    }

    // Transformar dados para o formato esperado
    const items = allData?.map(product => ({
      id: product.id,
      banca_id: product.banca_id,
      category_id: product.category_id,
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      description: product.description,
      description_full: product.description_full,
      price: product.price,
      price_original: product.price_original,
      discount_percent: product.discount_percent,
      images: product.images || [],
      gallery_images: product.gallery_images || [],
      specifications: product.specifications,
      rating_avg: product.rating_avg,
      reviews_count: product.reviews_count || 0,
      stock_qty: product.stock_qty,
      track_stock: product.track_stock,
      sob_encomenda: product.sob_encomenda,
      pre_venda: product.pre_venda,
      pronta_entrega: product.pronta_entrega,
      active: product.track_stock ? (product.stock_qty || 0) > 0 : true,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || [];

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    return NextResponse.json({ items: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const productData = {
      banca_id: body.banca_id,
      category_id: body.category_id || null,
      name: body.name,
      description: body.description || null,
      description_full: body.description_full || null,
      price: Number(body.price || 0),
      price_original: body.price_original ? Number(body.price_original) : null,
      discount_percent: body.discount_percent || null,
      images: body.images || null,
      gallery_images: body.gallery_images || null,
      specifications: body.specifications || null,
      rating_avg: body.rating_avg || null,
      reviews_count: body.reviews_count || 0,
      stock_qty: body.stock_qty || null,
      track_stock: !!body.track_stock,
      sob_encomenda: !!body.sob_encomenda,
      pre_venda: !!body.pre_venda,
      pronta_entrega: body.pronta_entrega !== false
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro na criação de produto:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
