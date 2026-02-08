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
    const subSlug = searchParams.get("sub") || ""; // Subcategoria específica do mega menu
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 500); // Máximo 500 (categorias podem ter muitos produtos)
    const sort = searchParams.get("sort") || "name"; // Mudado de created_at para name (alfabético)
    const order = searchParams.get("order") || "asc"; // Mudado de desc para asc

    // Aliases de slug do mega menu → chave do mapeamento
    const SLUG_ALIASES: Record<string, string> = {
      'cigarros': 'tabacaria',
      'snacks': 'bomboniere',
      'quadrinhos': 'panini',
      'jogos': 'cartas',
      'presentes': 'diversos',
      'acessorios': 'diversos',
    };

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
      'panini': ['Colecionáveis', 'Conan', 'DC Comics', 'Disney Comics', 'Marvel Comics', 'Maurício de Sousa Produções', 'Panini Books', 'Panini Comics', 'Panini Magazines', 'Panini Partwork', 'Planet Manga', 'HQs', 'HQ', 'Comics', 'Quadrinhos', 'Mangás', 'Manga', 'Graphic Novels', 'Graphic Novel', 'Revistas', 'Gibis', 'Gibi'],
      'marvel': ['Marvel Comics', 'Marvel', 'Vingadores', 'Avengers', 'Homem-Aranha', 'Spider-Man', 'X-Men', 'Deadpool', 'Wolverine', 'Thor', 'Hulk', 'Homem de Ferro', 'Iron Man', 'Capitão América', 'Captain America'],
      'manga': ['Planet Manga', 'Mangá', 'Mangás', 'Manga', 'Anime', 'Naruto', 'One Piece', 'Dragon Ball', 'Demon Slayer', 'Jujutsu Kaisen', 'My Hero Academia', 'Attack on Titan', 'Death Note', 'Bleach', 'Hunter x Hunter'],
      'mauricio': ['Maurício de Sousa Produções', 'Maurício de Sousa', 'Turma da Mônica', 'Mônica', 'Cebolinha', 'Cascão', 'Magali', 'Chico Bento', 'Pelezinho', 'Horácio', 'Astronauta', 'Piteco'],
    };

    // Mapeamento de slug de subcategoria → nomes de categoria no banco
    const SUB_SLUG_TO_NAMES: Record<string, string[]> = {
      // Tabacaria
      'cigarros': ['Cigarros'],
      'charutos': ['Charutos e Cigarrilhas', 'Charutos'],
      'tabaco': ['Tabaco e Seda', 'Tabacos Importados', 'Tabaco'],
      'essencias': ['Essências'],
      'narguile': ['Carvão Narguile', 'Narguilé'],
      'seda-papel': ['Seda OCB', 'Seda', 'Papel'],
      'isqueiros': ['Isqueiros'],
      // Bebidas
      'cerveja': ['Cerveja', 'Cervejas'],
      'refrigerante': ['Refrigerante', 'Refrigerantes'],
      'energetico': ['Energéticos', 'Energético'],
      'agua': ['Água', 'Águas'],
      'suco': ['Suco', 'Sucos'],
      'destilados': ['Destilados'],
      'vinho': ['Vinho', 'Vinhos'],
      'cafe': ['Café'],
      'cha': ['Chá', 'Chás'],
      // Snacks
      'chocolates': ['Chocolates'],
      'balas-chicletes': ['Balas e Drops', 'Chicletes', 'Balas a Granel'],
      'salgadinhos': ['Salgadinhos', 'Snacks'],
      'biscoitos': ['Biscoitos'],
      'amendoins-castanhas': ['Amendoins', 'Castanhas'],
      // Panini / HQs
      'figurinhas': ['Figurinhas', 'Colecionáveis'],
      'albuns': ['Álbuns'],
      'cards-colecao': ['Cards Colecionáveis'],
      'mangas': ['Planet Manga', 'Mangá', 'Mangás'],
      'quadrinhos': ['Quadrinhos', 'HQs', 'Gibis', 'Comics', 'Panini Comics'],
      'graphic-novels': ['Graphic Novels', 'Graphic Novel'],
      'marvel': ['Marvel Comics', 'Marvel'],
      'dc-comics': ['DC Comics'],
      // Jogos & Cards
      'pokemon-tcg': ['Cards Pokémon'],
      'yugioh': ['Yu-Gi-Oh'],
      'magic': ['Magic'],
      // Brinquedos
      'miniaturas': ['Miniaturas'],
      'pelucias': ['Pelúcias'],
      'colecionaveis': ['Colecionáveis'],
      // Presentes
      'utilidades': ['Utilidades'],
      'chaveiros': ['Chaveiros'],
      // Papelaria
      'canetas': ['Canetas'],
      'cadernos': ['Cadernos'],
      'material-escolar': ['Material Escolar', 'Papelaria'],
      'adesivos': ['Adesivos', 'Adesivos Times'],
    };

    // Se tiver categoryName, buscar o ID da categoria primeiro
    let categoryId = category;
    let categoryIds: string[] = []; // Para buscar múltiplas subcategorias
    let nameSearchTerm = ''; // Busca adicional por nome do produto
    
    // Carregar ambas as tabelas de categorias uma só vez
    const { data: allDistCats } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome');
    const { data: allBancaCats } = await supabaseAdmin
      .from('categories')
      .select('id, name');
    
    if (categoryName && !categoryId) {
      let searchName = categoryName.replace(/-/g, ' ').toLowerCase();
      // Resolver alias do mega menu (ex: cigarros → tabacaria)
      const resolvedName = SLUG_ALIASES[searchName] || searchName;

      // Se tiver sub, buscar apenas a subcategoria específica
      const subSearchName = subSlug ? subSlug.replace(/-/g, ' ').toLowerCase() : '';
      const subCategoryNames = subSlug ? SUB_SLUG_TO_NAMES[subSlug.toLowerCase()] : null;

      const subcategories = subCategoryNames || CATEGORY_SUBCATEGORIES[resolvedName];
      
      if (subcategories && subcategories.length > 0) {
        const label = subSlug ? `subcategoria "${subSlug}"` : `categoria pai "${resolvedName}"`;
        console.log(`[API Public] ${label} - buscando: ${subcategories.join(', ')}`);
        
        // Buscar em distribuidor_categories (case-insensitive)
        if (allDistCats && allDistCats.length > 0) {
          const matchedDist = allDistCats.filter(c => 
            subcategories.some(s => c.nome?.toLowerCase() === s.toLowerCase())
          );
          if (matchedDist.length > 0) {
            categoryIds = matchedDist.map(c => c.id);
            console.log(`[API Public] Subcategorias distribuidor: ${matchedDist.length} (${matchedDist.map(c => c.nome).join(', ')})`);
          }
        }
        
        // Também buscar em categories (bancas) - case-insensitive
        if (allBancaCats && allBancaCats.length > 0) {
          const matchedCat = allBancaCats.filter(c => 
            subcategories.some(s => c.name?.toLowerCase() === s.toLowerCase())
          );
          if (matchedCat.length > 0) {
            categoryIds = [...categoryIds, ...matchedCat.map(c => c.id)];
            console.log(`[API Public] + Categorias bancas: ${matchedCat.length}`);
          }
        }
        
        // Se buscando subcategoria e não encontrou, usar categoria pai + filtro por nome
        if (subSlug && categoryIds.length === 0) {
          // Buscar a categoria pai (ex: "Tabacaria", "Bebidas")
          const parentSubcats = CATEGORY_SUBCATEGORIES[resolvedName];
          if (parentSubcats) {
            // Buscar IDs da categoria pai nas duas tabelas
            if (allBancaCats) {
              const parentCat = allBancaCats.find(c => c.name?.toLowerCase() === resolvedName);
              if (parentCat) {
                categoryIds = [parentCat.id];
                console.log(`[API Public] Usando categoria pai "${parentCat.name}" + filtro por nome "${subSearchName}"`);
              }
            }
          }
          nameSearchTerm = subSearchName;
          console.log(`[API Public] Subcategoria não encontrada em categorias, filtrará por nome: "${nameSearchTerm}"`);
        }
        
        console.log(`[API Public] Total de categoryIds encontrados: ${categoryIds.length}`);
      } else {
        // Busca normal por nome - tentar encontrar a categoria exata
        const matchedCat = allBancaCats?.find(c => c.name?.toLowerCase().includes(resolvedName));
        if (matchedCat) {
          categoryId = matchedCat.id;
          console.log(`[API Public] Categoria encontrada (bancas): ${matchedCat.name} -> ${categoryId}`);
        } else {
          const matchedDist = allDistCats?.find(c => c.nome?.toLowerCase().includes(resolvedName));
          if (matchedDist) {
            categoryId = matchedDist.id;
            console.log(`[API Public] Categoria encontrada (distribuidores): ${matchedDist.nome} -> ${categoryId}`);
          } else {
            // Fallback: buscar por nome do produto
            nameSearchTerm = resolvedName;
            console.log(`[API Public] Categoria não encontrada, buscará por nome: "${nameSearchTerm}"`);
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
    
    // Filtro por nome do produto (usado quando sub especificado mas subcategoria não existe no DB)
    // Pode ser combinado com filtro de categoria pai (ex: Tabacaria + "tabaco" no nome)
    if (nameSearchTerm) {
      query = query.ilike('name', `%${nameSearchTerm}%`);
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

    console.log(`[API Public] Query retornou ${products?.length || 0} produtos brutos (categoryIds: ${categoryIds.length}, categoryId: ${categoryId || 'none'}, nameSearch: "${nameSearchTerm}", includeDistribuidor: ${includeDistribuidor})`);

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

    // Buscar markups de distribuidores para aplicar nos preços
    const distribuidorIds = Array.from(new Set(
      filteredProducts.filter((p: any) => p.distribuidor_id).map((p: any) => p.distribuidor_id)
    ));
    const markupMap = new Map<string, { perc: number; fixo: number }>();
    
    if (distribuidorIds.length > 0) {
      const { data: distribuidores } = await supabaseAdmin
        .from('distribuidores')
        .select('id, markup_global_percentual, markup_global_fixo')
        .in('id', distribuidorIds);
      
      (distribuidores || []).forEach((d: any) => {
        markupMap.set(d.id, {
          perc: Number(d.markup_global_percentual || 0),
          fixo: Number(d.markup_global_fixo || 0)
        });
      });
    }

    // Formatar produtos para o formato esperado (aplicando markup para produtos de distribuidor)
    const items = filteredProducts.map((p: any) => {
      let finalPrice = p.price || 0;
      
      // Aplicar markup se for produto de distribuidor
      if (p.distribuidor_id && markupMap.has(p.distribuidor_id)) {
        const markup = markupMap.get(p.distribuidor_id)!;
        if (markup.perc > 0 || markup.fixo > 0) {
          finalPrice = finalPrice * (1 + markup.perc / 100) + markup.fixo;
          finalPrice = Math.round(finalPrice * 100) / 100; // Arredondar para 2 casas
        }
      }
      
      return {
        id: p.id,
        name: p.name,
        price: finalPrice,
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
      };
    });

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
