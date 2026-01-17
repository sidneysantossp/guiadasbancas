import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const revalidate = 60;
export const dynamic = 'force-dynamic';

/**
 * API para buscar hierarquia de categorias de uma banca cotista
 * Retorna hierarquia baseada em NOMES das categorias (não IDs)
 * O frontend filtra baseado nas categorias que existem nos produtos
 */
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    const supabase = supabaseAdmin;

    // 1. Verificar se a banca é cotista
    const { data: banca } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    const isCotista = (banca?.is_cotista === true || !!banca?.cotista_id);

    if (!isCotista) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: false,
        categories: [],
        hierarchy: {},
        standalone: []
      });
    }

    // 2. Buscar distribuidores que têm produtos
    const { data: products } = await supabase
      .from('products')
      .select('distribuidor_id')
      .not('distribuidor_id', 'is', null);

    const distribuidorIds = [...new Set((products || []).map(p => p.distribuidor_id).filter(Boolean))];

    if (distribuidorIds.length === 0) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: isCotista,
        categories: [],
        hierarchy: {},
        standalone: []
      });
    }

    console.log(`[CATEGORIES-API] Banca ${bancaId} é cotista de ${distribuidorIds.length} distribuidores`);

    // 3. Buscar TODAS as categorias dos distribuidores (com hierarquia)
    const { data: allCategories } = await supabase
      .from('distribuidor_categories')
      .select('id, nome, mercos_id, categoria_pai_id, ativo')
      .in('distribuidor_id', distribuidorIds)
      .eq('ativo', true);

    if (!allCategories || allCategories.length === 0) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: isCotista,
        categories: [],
        hierarchy: {},
        standalone: []
      });
    }

    // 4. Construir mapa por mercos_id para lookup de pais
    const categoryByMercosId = new Map(allCategories.map(c => [c.mercos_id, c]));

    // 5. Construir hierarquia baseada em NOMES
    const hierarchy: Record<string, string[]> = {};
    const standaloneCategories: string[] = [];
    const processedNames = new Set<string>();

    for (const cat of allCategories) {
      // Evitar duplicatas por nome
      if (processedNames.has(cat.nome)) continue;
      processedNames.add(cat.nome);

      if (cat.categoria_pai_id != null) {
        // Tem pai - buscar pelo mercos_id
        const parentCat = categoryByMercosId.get(cat.categoria_pai_id);
        if (parentCat) {
          if (!hierarchy[parentCat.nome]) {
            hierarchy[parentCat.nome] = [];
          }
          if (!hierarchy[parentCat.nome].includes(cat.nome)) {
            hierarchy[parentCat.nome].push(cat.nome);
          }
        } else {
          // Pai não encontrado, standalone
          if (!standaloneCategories.includes(cat.nome)) {
            standaloneCategories.push(cat.nome);
          }
        }
      } else {
        // Sem pai - verificar se é pai de outras
        const isParent = allCategories.some(c => c.categoria_pai_id === cat.mercos_id);
        if (!isParent) {
          if (!standaloneCategories.includes(cat.nome)) {
            standaloneCategories.push(cat.nome);
          }
        }
      }
    }

    // 6. Ordenar
    for (const parent of Object.keys(hierarchy)) {
      hierarchy[parent].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    }
    standaloneCategories.sort((a, b) => a.localeCompare(b, 'pt-BR'));

    // 7. Lista flat de todas as categorias
    const flatCategories = [...new Set([
      ...Object.keys(hierarchy),
      ...Object.values(hierarchy).flat(),
      ...standaloneCategories
    ])].sort((a, b) => a.localeCompare(b, 'pt-BR'));

    console.log(`[CATEGORIES-API] Retornando ${Object.keys(hierarchy).length} grupos e ${standaloneCategories.length} standalone`);

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: isCotista,
      categories: flatCategories,
      hierarchy,
      standalone: standaloneCategories,
      total_categories: flatCategories.length
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });

  } catch (error: any) {
    console.error('Erro ao buscar categorias da banca:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
