import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache de 60 segundos

/**
 * API PÚBLICA para produtos (Home Page)
 * Sem autenticação, apenas produtos ativos visíveis
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const categoryName = searchParams.get("categoryName") || ""; // Busca por nome da categoria (slug)
    const distribuidor = searchParams.get("distribuidor") || "";
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 100); // Máximo 100
    const sort = searchParams.get("sort") || "name"; // Mudado de created_at para name (alfabético)
    const order = searchParams.get("order") || "asc"; // Mudado de desc para asc

    // Mapeamento de categorias pai para subcategorias (usado na home)
    const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
      'tabacaria': ['Boladores', 'Carvão Narguile', 'Charutos e Cigarrilhas', 'Cigarros', 'Essências', 'Filtros', 'Incensos', 'Isqueiros', 'Palheiros', 'Piteiras', 'Porta Cigarros', 'Seda OCB', 'Tabaco e Seda', 'Tabacos Importados', 'Trituradores'],
      'bebidas': ['Energéticos', 'Energético', 'Bebidas', 'Bebida', 'Água', 'Águas', 'Refrigerantes', 'Refrigerante', 'Sucos', 'Suco', 'Isotônicos', 'Isotônico'],
      'bomboniere': ['Balas e Drops', 'Balas a Granel', 'Biscoitos', 'Chicletes', 'Chocolates', 'Doces', 'Pirulitos', 'Salgadinhos', 'Snacks'],
      'brinquedos': ['Blocos de Montar', 'Carrinhos', 'Massinha', 'Pelúcias', 'Brinquedos', 'Livros Infantis'],
      'cartas': ['Baralhos', 'Baralhos e Cards', 'Cards Colecionáveis', 'Cards Pokémon', 'Jogos Copag', 'Jogos de Cartas'],
      'eletronicos': ['Caixas de Som', 'Fones de Ouvido', 'Informática', 'Pilhas', 'Eletrônicos'],
      'diversos': ['Acessórios', 'Acessórios Celular', 'Adesivos Times', 'Chaveiros', 'Diversos', 'Guarda-Chuvas', 'Mochilas', 'Outros', 'Papelaria', 'Utilidades', 'Figurinhas'],
      'pokemon': ['Cards Pokémon', 'Fichários Pokémon'],
      'panini': ['Colecionáveis', 'Conan', 'DC Comics', 'Disney Comics', 'Marvel Comics', 'Maurício de Sousa Produções', 'Panini Books', 'Panini Comics', 'Panini Magazines', 'Panini Partwork', 'Planet Manga'],
    };

    // Se tiver categoryName, buscar o ID da categoria primeiro
    let categoryId = category;
    let categoryIds: string[] = []; // Para buscar múltiplas subcategorias
    
    if (categoryName && !categoryId) {
      const searchName = categoryName.replace(/-/g, ' ').toLowerCase(); // "capinhas-celular" -> "capinhas celular"
      const subcategories = CATEGORY_SUBCATEGORIES[searchName];
      
      if (subcategories && subcategories.length > 0) {
        // É uma categoria pai - buscar IDs de todas as subcategorias
        console.log(`[API Public] Categoria pai "${searchName}" - buscando subcategorias: ${subcategories.join(', ')}`);
        
        // Buscar em distribuidor_categories (case-insensitive)
        const { data: distCatData } = await supabaseAdmin
          .from('distribuidor_categories')
          .select('id, nome');
        
        if (distCatData && distCatData.length > 0) {
          // Filtrar case-insensitive
          const matchedDist = distCatData.filter(c => 
            subcategories.some(sub => c.nome?.toLowerCase() === sub.toLowerCase())
          );
          if (matchedDist.length > 0) {
            categoryIds = matchedDist.map(c => c.id);
            console.log(`[API Public] Subcategorias encontradas: ${matchedDist.length} (${matchedDist.map(c => c.nome).join(', ')})`);
          }
        }
        
        // Também buscar em categories (bancas) - case-insensitive
        const { data: catData } = await supabaseAdmin
          .from('categories')
          .select('id, name');
        
        if (catData && catData.length > 0) {
          const matchedCat = catData.filter(c => 
            subcategories.some(sub => c.name?.toLowerCase() === sub.toLowerCase())
          );
          if (matchedCat.length > 0) {
            categoryIds = [...categoryIds, ...matchedCat.map(c => c.id)];
            console.log(`[API Public] + Categorias de bancas: ${matchedCat.length}`);
          }
        }
        
        console.log(`[API Public] Total de categoryIds encontrados: ${categoryIds.length}`);
      } else {
        // Busca normal por nome
        const { data: catData } = await supabaseAdmin
          .from('categories')
          .select('id, name')
          .ilike('name', `%${searchName}%`)
          .limit(1);
        
        if (catData && catData.length > 0) {
          categoryId = catData[0].id;
          console.log(`[API Public] Categoria encontrada (bancas): ${catData[0].name} -> ${categoryId}`);
        } else {
          const { data: distCatData } = await supabaseAdmin
            .from('distribuidor_categories')
            .select('id, nome')
            .ilike('nome', `%${searchName}%`)
            .limit(1);
          
          if (distCatData && distCatData.length > 0) {
            categoryId = distCatData[0].id;
            console.log(`[API Public] Categoria encontrada (distribuidores): ${distCatData[0].nome} -> ${categoryId}`);
          } else {
            console.log(`[API Public] Categoria não encontrada para: ${searchName}`);
          }
        }
      }
    }

    // Query otimizada - apenas produtos ativos
    // Se buscar por categoria específica, incluir produtos de distribuidores também
    // Isso permite que seções como Bomboniere e Bebidas funcionem na home
    const includeDistribuidor = !!(categoryId || categoryName); // Incluir distribuidores quando filtrar por categoria
    
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
        images,
        category_id,
        banca_id,
        distribuidor_id,
        created_at,
        rating_avg,
        reviews_count,
        codigo_mercos,
        pronta_entrega,
        sob_encomenda,
        pre_venda
      `)
      .eq('active', true);
    
    // Se não for busca por categoria, excluir produtos de distribuidor
    if (!includeDistribuidor) {
      query = query.is('distribuidor_id', null);
    }

    // Filtro de categoria (pode ser uma única ou múltiplas subcategorias)
    if (categoryIds.length > 0) {
      query = query.in('category_id', categoryIds);
    } else if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    // Filtro de distribuidor
    if (distribuidor) {
      query = query.eq('distribuidor_id', distribuidor);
    }

    // Ordenação
    query = query.order(sort, { ascending: order === 'asc' });
    
    // Limite
    query = query.limit(limit);

    const { data: products, error } = await query;

    if (error) {
      console.error('[API Public Products] Erro:', error);
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar produtos', items: [] },
        { status: 500 }
      );
    }

    const bancaIds = Array.from(new Set((products || []).map((p: any) => p.banca_id).filter(Boolean)));
    const bancaMap = new Map<string, any>();
    if (bancaIds.length > 0) {
      const { data: bancas } = await supabaseAdmin
        .from('bancas')
        .select('id, name, is_cotista, cotista_id, active')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    // Se buscando por categoria, incluir produtos de distribuidores (eles serão associados a cotistas no frontend)
    // Caso contrário, filtrar apenas produtos de bancas cotistas
    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);
    const filteredProducts = (products || []).filter((p: any) => {
      // Produtos de distribuidor são permitidos quando buscando por categoria
      if (p.distribuidor_id && includeDistribuidor) {
        return true;
      }
      // Produtos normais precisam ser de banca cotista
      return isActiveCotistaBanca(bancaMap.get(p.banca_id));
    });

    // Formatar produtos para o formato esperado
    const items = filteredProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price || 0,
      price_original: p.price_original || null,
      discount_percent: p.discount_percent || null,
      images: Array.isArray(p.images) ? p.images : [],
      image: Array.isArray(p.images) && p.images.length > 0 
        ? p.images[0] 
        : 'https://placehold.co/400x400/e5e7eb/666666?text=Sem+Imagem',
      category_id: p.category_id,
      banca_id: p.banca_id,
      distribuidor_id: p.distribuidor_id,
      rating_avg: p.rating_avg || null,
      reviews_count: p.reviews_count || null,
      codigo_mercos: p.codigo_mercos || null,
      pronta_entrega: p.pronta_entrega || false,
      sob_encomenda: p.sob_encomenda || false,
      pre_venda: p.pre_venda || false,
      banca_name: bancaMap.get(p.banca_id)?.name || null
    }));

    return NextResponse.json({
      success: true,
      data: items, // Formato esperado pelo TrendingProducts
      items, // Mantém compatibilidade
      total: items.length
    });

  } catch (error) {
    console.error('[API Public Products] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno', items: [] },
      { status: 500 }
    );
  }
}
