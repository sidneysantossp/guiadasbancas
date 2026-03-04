import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Sem cache - garantir dados frescos
export const fetchCache = 'force-no-store';

const API_VERSION = '2026-02-10-v3';

type CategoryLookupCache = {
  allDistCats: Array<{ id: string; nome: string }>;
  allBancaCats: Array<{ id: string; name: string }>;
  expiresAt: number;
};

const CATEGORY_LOOKUP_TTL_MS = 5 * 60 * 1000;
let categoryLookupCache: CategoryLookupCache | null = null;
let categoryLookupPromise: Promise<{
  allDistCats: Array<{ id: string; nome: string }>;
  allBancaCats: Array<{ id: string; name: string }>;
}> | null = null;

async function getCategoryLookups() {
  const now = Date.now();
  if (categoryLookupCache && categoryLookupCache.expiresAt > now) {
    return {
      allDistCats: categoryLookupCache.allDistCats,
      allBancaCats: categoryLookupCache.allBancaCats,
    };
  }

  if (!categoryLookupPromise) {
    categoryLookupPromise = (async () => {
      const [distRes, bancaRes] = await Promise.all([
        supabaseAdmin.from('distribuidor_categories').select('id, nome'),
        supabaseAdmin.from('categories').select('id, name'),
      ]);

      const allDistCats = Array.isArray(distRes.data) ? (distRes.data as Array<{ id: string; nome: string }>) : [];
      const allBancaCats = Array.isArray(bancaRes.data) ? (bancaRes.data as Array<{ id: string; name: string }>) : [];

      categoryLookupCache = {
        allDistCats,
        allBancaCats,
        expiresAt: Date.now() + CATEGORY_LOOKUP_TTL_MS,
      };

      return { allDistCats, allBancaCats };
    })().finally(() => {
      categoryLookupPromise = null;
    });
  }

  return categoryLookupPromise;
}

/**
 * API PÚBLICA para produtos (Home Page)
 * Sem autenticação, apenas produtos ativos visíveis
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Debug: retornar versão se solicitado
    if (searchParams.get("_version") === "1") {
      return NextResponse.json({ version: API_VERSION });
    }
    
    const category = searchParams.get("category") || "";
    const categoryName = searchParams.get("categoryName") || ""; // Busca por nome da categoria (slug)
    const distribuidor = searchParams.get("distribuidor") || "";
    const bancaId = searchParams.get("banca_id") || ""; // Opcional: resolve preço customizado para uma banca específica
    const subSlug = searchParams.get("sub") || ""; // Subcategoria específica do mega menu
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 500); // Máximo 500 (categorias podem ter muitos produtos)
    const sort = searchParams.get("sort") || "name"; // Mudado de created_at para name (alfabético)
    const order = searchParams.get("order") || "asc"; // Mudado de desc para asc
    const userLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat") as string) : null;
    const userLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng") as string) : null;
    const hasUserLocation = Number.isFinite(userLat) && Number.isFinite(userLng);

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
      'marvel-comics': ['Marvel Comics', 'Marvel'],
      'dc-comics': ['DC Comics'],
      'disney-comics': ['Disney Comics', 'Disney'],
      'panini-books': ['Panini Books'],
      'panini-comics': ['Panini Comics'],
      'panini-magazines': ['Panini Magazines'],
      'panini-partwork': ['Panini Partwork'],
      'planet-manga': ['Planet Manga', 'Mangá', 'Mangás'],
      'mauricio-de-sousa-producoes': ['Maurício de Sousa Produções', 'Maurício de Sousa'],
      'independentes': ['Independentes'],
      'panini-collections': ['Colecionáveis'],
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

    // Se tiver categoryName, resolver IDs e termos de busca por nome
    let categoryId = category;
    let categoryIds: string[] = [];
    let nameSearchTerms: string[] = []; // Termos para buscar por nome do produto (OR entre eles)
    
    // Carregar dicionários de categorias com cache em memória (evita repetir essa leitura a cada seção da Home)
    const { allDistCats, allBancaCats } = await getCategoryLookups();

    const categoryNameById = new Map<string, string>();
    (allDistCats || []).forEach((cat: any) => {
      if (cat?.id && cat?.nome) categoryNameById.set(cat.id, cat.nome);
    });
    (allBancaCats || []).forEach((cat: any) => {
      if (cat?.id && cat?.name) categoryNameById.set(cat.id, cat.name);
    });
    
    if (categoryName && !categoryId) {
      let searchName = categoryName.replace(/-/g, ' ').toLowerCase();
      // Resolver alias do mega menu (ex: cigarros → tabacaria)
      const resolvedName = SLUG_ALIASES[searchName] || searchName;

      // Se tiver sub, buscar apenas a subcategoria específica
      const subCategoryNames = subSlug ? SUB_SLUG_TO_NAMES[subSlug.toLowerCase()] : null;
      const subcategories = subCategoryNames || CATEGORY_SUBCATEGORIES[resolvedName];
      
      if (subcategories && subcategories.length > 0) {
        const label = subSlug ? `subcategoria "${subSlug}"` : `categoria pai "${resolvedName}"`;
        console.log(`[API Public] ${label} - buscando: ${subcategories.join(', ')}`);
        
        // Buscar IDs em distribuidor_categories (case-insensitive)
        if (allDistCats && allDistCats.length > 0) {
          const matchedDist = allDistCats.filter(c => 
            subcategories.some(s => c.nome?.toLowerCase() === s.toLowerCase())
          );
          if (matchedDist.length > 0) {
            categoryIds = matchedDist.map(c => c.id);
          }
        }
        
        // Buscar IDs em categories (bancas) - case-insensitive
        if (allBancaCats && allBancaCats.length > 0) {
          const matchedCat = allBancaCats.filter(c => 
            subcategories.some(s => c.name?.toLowerCase() === s.toLowerCase())
          );
          if (matchedCat.length > 0) {
            categoryIds = [...categoryIds, ...matchedCat.map(c => c.id)];
          }
        }
        
        // Busca por nome para cobrir produtos sem category_id
        nameSearchTerms = subcategories.map(s => s.toLowerCase());
        // Só adicionar nome da categoria pai quando NÃO for busca por subcategoria específica
        // (evita que "bebida" match "LIVRARIA DE BEBIDAS" ao buscar "cerveja")
        if (!subSlug) {
          if (!nameSearchTerms.includes(resolvedName)) {
            nameSearchTerms.push(resolvedName);
          }
          // Adicionar singular (remover 's' final) para cobrir variações
          const singular = resolvedName.endsWith('s') ? resolvedName.slice(0, -1) : null;
          if (singular && !nameSearchTerms.includes(singular)) {
            nameSearchTerms.push(singular);
          }
        }
        
        console.log(`[API Public] categoryIds: ${categoryIds.length}, nameSearchTerms: ${nameSearchTerms.length}`);
      } else {
        // Busca normal por nome - tentar encontrar a categoria exata
        const matchedCat = allBancaCats?.find(c => c.name?.toLowerCase().includes(resolvedName));
        if (matchedCat) {
          categoryId = matchedCat.id;
        }
        const matchedDist = allDistCats?.find(c => c.nome?.toLowerCase().includes(resolvedName));
        if (matchedDist) {
          categoryIds = [matchedDist.id];
        }
        // Também buscar por nome do produto como fallback
        nameSearchTerms = [resolvedName];
        console.log(`[API Public] Busca simples: categoryId=${categoryId || 'none'}, categoryIds=${categoryIds.length}, nome="${resolvedName}"`);
      }
    }

    // Query - apenas produtos ativos
    const includeDistribuidor = !!(categoryId || categoryName || categoryIds.length > 0);
    
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

    // Filtro combinado: category_id OR nome do produto
    // Usa OR para cobrir produtos COM e SEM category_id preenchido
    if (categoryIds.length > 0 || categoryId || nameSearchTerms.length > 0) {
      const orParts: string[] = [];
      
      // Filtrar por category_id (quando preenchido nos produtos)
      if (categoryIds.length > 0) {
        orParts.push(`category_id.in.(${categoryIds.join(',')})`);
      }
      if (categoryId) {
        orParts.push(`category_id.eq.${categoryId}`);
      }
      
      // Filtrar por nome do produto (cobre produtos sem category_id)
      for (const term of nameSearchTerms) {
        orParts.push(`name.ilike.%${term}%`);
      }
      
      if (orParts.length > 0) {
        query = query.or(orParts.join(','));
        console.log(`[API Public] OR filter: ${orParts.length} parts`);
      }
    }

    // Filtro de distribuidor
    if (distribuidor) {
      query = query.eq('distribuidor_id', distribuidor);
    }

    // Ordenação
    query = query.order(sort, { ascending: order === 'asc' });
    
    // Buscar uma janela maior para conseguir intercalar por banca próxima
    const fetchLimit = hasUserLocation
      ? Math.min(Math.max(limit * 5, limit), 240)
      : Math.min(Math.max(limit * 3, limit), 180);
    query = query.limit(fetchLimit);

    const { data: products, error } = await query;

    console.log(`[API Public] Query retornou ${products?.length || 0} produtos brutos (categoryIds: ${categoryIds.length}, categoryId: ${categoryId || 'none'}, nameSearchTerms: ${nameSearchTerms.length}, includeDistribuidor: ${includeDistribuidor})`);

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
        .select('id, name, is_cotista, cotista_id, active, lat, lng')
        .in('id', bancaIds);
      (bancas || []).forEach((b: any) => bancaMap.set(b.id, b));
    }

    // Bancas cotistas candidatas para distribuir produtos de distribuidor sem banca_id
    const { data: cotistaBancasData } = await supabaseAdmin
      .from('bancas')
      .select('id, name, is_cotista, cotista_id, active, lat, lng')
      .eq('active', true)
      .or('is_cotista.eq.true,cotista_id.not.is.null')
      .not('lat', 'is', null)
      .not('lng', 'is', null)
      .limit(80);

    const cotistaBancas = (cotistaBancasData || []).filter((b: any) => b?.id);
    const sortedCotistaBancas = [...cotistaBancas].map((b: any) => {
      if (!hasUserLocation) return { ...b, distance: null };
      const lat = Number(b.lat);
      const lng = Number(b.lng);
      const distance = Number.isFinite(lat) && Number.isFinite(lng)
        ? calculateDistance(userLat as number, userLng as number, lat, lng)
        : null;
      return { ...b, distance };
    });

    if (hasUserLocation) {
      sortedCotistaBancas.sort((a: any, b: any) => {
        const da = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
        const db = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
        return da - db;
      });
    } else {
      sortedCotistaBancas.sort(() => Math.random() - 0.5);
    }

    // Se buscando por categoria, incluir produtos de distribuidores
    // Caso contrário, manter apenas produtos de bancas cotistas
    const isCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);
    const filteredProducts = (products || []).filter((p: any) => {
      if (p.distribuidor_id && includeDistribuidor) return true;
      return isCotistaBanca(bancaMap.get(p.banca_id));
    });

    // Buscar regras de preço de distribuidores (produto > categoria > global)
    const distribuidorIds = Array.from(new Set(
      filteredProducts.filter((p: any) => p.distribuidor_id).map((p: any) => p.distribuidor_id)
    ));
    const distribuidorMap = new Map<string, any>();
    const markupProdMap = new Map<string, { perc: number; fixo: number }>();
    const markupCatMap = new Map<string, { perc: number; fixo: number }>();
    const customMap = new Map<string, { enabled: boolean | null; custom_price: number | null }>();

    if (distribuidorIds.length > 0) {
      const distribuidorProducts = filteredProducts.filter((p: any) => p.distribuidor_id);
      const productIds = Array.from(new Set(distribuidorProducts.map((p: any) => p.id)));
      const categoryIds = Array.from(new Set(distribuidorProducts.map((p: any) => p.category_id).filter(Boolean)));
      const candidateBancaIds = bancaId
        ? [bancaId]
        : Array.from(new Set([
            ...bancaIds,
            ...sortedCotistaBancas.slice(0, 40).map((b: any) => b.id).filter(Boolean),
          ]));

      const [distRes, markupProdRes, markupCatRes, customRes] = await Promise.all([
        supabaseAdmin
          .from('distribuidores')
          .select('id, tipo_calculo, markup_global_percentual, markup_global_fixo, margem_divisor')
          .in('id', distribuidorIds),
        productIds.length > 0
          ? supabaseAdmin
              .from('distribuidor_markup_produtos')
              .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
              .in('distribuidor_id', distribuidorIds)
              .in('product_id', productIds)
          : Promise.resolve({ data: [] as any[] }),
        categoryIds.length > 0
          ? supabaseAdmin
              .from('distribuidor_markup_categorias')
              .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
              .in('distribuidor_id', distribuidorIds)
              .in('category_id', categoryIds)
          : Promise.resolve({ data: [] as any[] }),
        productIds.length > 0 && candidateBancaIds.length > 0
          ? supabaseAdmin
              .from('banca_produtos_distribuidor')
              .select('product_id, banca_id, enabled, custom_price')
              .in('product_id', productIds)
              .in('banca_id', candidateBancaIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      (distRes.data || []).forEach((d: any) => {
        distribuidorMap.set(d.id, d);
      });
      (markupProdRes.data || []).forEach((m: any) => {
        markupProdMap.set(`${m.distribuidor_id}:${m.product_id}`, {
          perc: Number(m.markup_percentual || 0),
          fixo: Number(m.markup_fixo || 0),
        });
      });
      (markupCatRes.data || []).forEach((m: any) => {
        markupCatMap.set(`${m.distribuidor_id}:${m.category_id}`, {
          perc: Number(m.markup_percentual || 0),
          fixo: Number(m.markup_fixo || 0),
        });
      });
      (customRes.data || []).forEach((c: any) => {
        customMap.set(`${c.banca_id}:${c.product_id}`, {
          enabled: c.enabled,
          custom_price: c.custom_price,
        });
      });
    }

    const calcularPrecoVendaDistribuidor = (p: any): number => {
      const precoBase = Number(p.price || 0);
      if (!p.distribuidor_id) return precoBase;

      const dist = distribuidorMap.get(p.distribuidor_id);
      if (!dist) return precoBase;

      const markupProd = markupProdMap.get(`${p.distribuidor_id}:${p.id}`);
      if (markupProd && (markupProd.perc > 0 || markupProd.fixo > 0)) {
        return Math.round((precoBase * (1 + markupProd.perc / 100) + markupProd.fixo) * 100) / 100;
      }

      const markupCat = markupCatMap.get(`${p.distribuidor_id}:${p.category_id}`);
      if (markupCat && (markupCat.perc > 0 || markupCat.fixo > 0)) {
        return Math.round((precoBase * (1 + markupCat.perc / 100) + markupCat.fixo) * 100) / 100;
      }

      const tipoCalculo = dist.tipo_calculo || 'markup';
      if (tipoCalculo === 'margem') {
        const divisor = Number(dist.margem_divisor || 1);
        if (divisor > 0 && divisor < 1) {
          return Math.round((precoBase / divisor) * 100) / 100;
        }
      }

      const perc = Number(dist.markup_global_percentual || 0);
      const fixo = Number(dist.markup_global_fixo || 0);
      if (perc > 0 || fixo > 0) {
        return Math.round((precoBase * (1 + perc / 100) + fixo) * 100) / 100;
      }

      return precoBase;
    };

    const isActiveBanca = (b: any) => b?.active !== false;
    let bancaRotationIndex = 0;

    // Formatar produtos e resolver banca por proximidade (quando aplicável)
    const formatted = filteredProducts.map((p: any) => {
      let bancaData = p?.banca_id ? bancaMap.get(p.banca_id) : null;

      // Produtos de distribuidor: distribuir entre bancas cotistas próximas
      // (na Home queremos variedade por proximidade, exceto quando banca_id é forçada na query)
      if (p.distribuidor_id && !bancaId && sortedCotistaBancas.length > 0) {
        bancaData = sortedCotistaBancas[bancaRotationIndex % sortedCotistaBancas.length];
        bancaRotationIndex++;
      }

      if (bancaData && !isActiveBanca(bancaData)) {
        return null;
      }

      const resolvedBancaId = bancaId || bancaData?.id || p.banca_id || null;

      let finalPrice = Number(p.price || 0);
      if (p.distribuidor_id) {
        finalPrice = calcularPrecoVendaDistribuidor(p);
        const custom = resolvedBancaId ? customMap.get(`${resolvedBancaId}:${p.id}`) : null;
        if (custom?.enabled === false) {
          return null;
        }
        if (typeof custom?.custom_price === 'number') {
          finalPrice = Number(custom.custom_price);
        }
      }
      finalPrice = Math.round(finalPrice * 100) / 100;

      const bancaLat = bancaData?.lat != null ? Number(bancaData.lat) : null;
      const bancaLng = bancaData?.lng != null ? Number(bancaData.lng) : null;
      let distance: number | null = typeof bancaData?.distance === 'number' ? bancaData.distance : null;
      if (distance == null && hasUserLocation && Number.isFinite(bancaLat) && Number.isFinite(bancaLng)) {
        distance = calculateDistance(userLat as number, userLng as number, bancaLat as number, bancaLng as number);
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
        category_name: p.category_id ? (categoryNameById.get(p.category_id) || null) : null,
        banca_id: resolvedBancaId,
        distribuidor_id: p.distribuidor_id,
        rating_avg: p.rating_avg || null,
        reviews_count: p.reviews_count || null,
        codigo_mercos: p.codigo_mercos || null,
        pronta_entrega: p.pronta_entrega || false,
        sob_encomenda: p.sob_encomenda || false,
        pre_venda: p.pre_venda || false,
        banca_name: bancaData?.name || bancaMap.get(p.banca_id)?.name || null,
        distance,
      };
    }).filter(Boolean) as any[];

    // Intercalar produtos por banca para evitar concentração em uma única banca
    const productsByBanca = new Map<string, any[]>();
    for (const item of formatted) {
      const key = item?.banca_id || 'sem-banca';
      if (!productsByBanca.has(key)) productsByBanca.set(key, []);
      productsByBanca.get(key)!.push(item);
    }

    const bancaGroups = Array.from(productsByBanca.entries()).map(([bancaGroupId, groupItems]) => {
      const avgDistance = groupItems.reduce((acc, it) => {
        const d = typeof it.distance === 'number' ? it.distance : 9999;
        return acc + d;
      }, 0) / Math.max(1, groupItems.length);
      return { bancaGroupId, groupItems, avgDistance };
    }).sort((a, b) => a.avgDistance - b.avgDistance);

    const interleaved: any[] = [];
    const maxGroupSize = bancaGroups.length > 0 ? Math.max(...bancaGroups.map((g) => g.groupItems.length)) : 0;
    for (let i = 0; i < maxGroupSize; i++) {
      for (const group of bancaGroups) {
        if (i < group.groupItems.length) {
          interleaved.push(group.groupItems[i]);
        }
      }
    }

    const deduplicated: any[] = [];
    const seenProductIds = new Set<string>();
    for (const item of interleaved) {
      if (seenProductIds.has(item.id)) continue;
      seenProductIds.add(item.id);
      deduplicated.push(item);
    }

    const items = deduplicated.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: items,
      items,
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

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
