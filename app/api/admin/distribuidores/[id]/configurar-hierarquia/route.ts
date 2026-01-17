import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

/**
 * Configura hierarquia de categorias manualmente para um distribuidor
 * POST: Aplica configuração de hierarquia
 * GET: Retorna configuração atual
 */

// Hierarquia padrão para Bambino Distribuidora
const BAMBINO_HIERARCHY: Record<string, string[]> = {
  'Tabacaria': [
    'Boladores',
    'Carvão Narguile', 
    'Cigarros',
    'Cigarros L&M',
    'Essências',
    'Filtros',
    'Incensos',
    'Isqueiros',
    'Palheiros',
    'Piteiras',
    'Porta Cigarros',
    'Seda OCB',
    'Tabaco e Seda',
    'Tabacos Importados',
    'Trituradores',
  ],
  'Bomboniere': [
    'Balas e Drops',
    'Chicletes',
    'Chocolates',
    'Doces',
    'Salgadinhos',
  ],
  'Bebidas': [
    'Energéticos',
  ],
  'Eletrônicos': [
    'Caixas de Som',
    'Fones de Ouvido',
    'Pilhas',
    'Acessórios Celular',
    'Capinhas Celular',
  ],
  'Cartas e Jogos': [
    'Baralhos',
    'Baralhos e Cards',
    'Cards Colecionáveis',
    'Jogos de Cartas',
    'Cartas',
  ],
  'Brinquedos': [
    'Pelúcias',
    'Livros Infantis',
  ],
  'Diversos': [
    'Acessórios',
    'Adesivos Times',
    'Utilidades',
  ],
};

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const distribuidorId = context.params.id;
    
    // Verificar se é Bambino
    const { data: distribuidor } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome')
      .eq('id', distribuidorId)
      .single();

    if (!distribuidor) {
      return NextResponse.json({ error: "Distribuidor não encontrado" }, { status: 404 });
    }

    // Buscar todas as categorias do distribuidor
    const { data: categorias, error: catError } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome, mercos_id, categoria_pai_id')
      .eq('distribuidor_id', distribuidorId);

    if (catError) {
      return NextResponse.json({ error: catError.message }, { status: 500 });
    }

    const categoriaByNome = new Map(categorias?.map(c => [c.nome, c]) || []);
    const results: any[] = [];
    let created = 0;
    let updated = 0;

    // Usar hierarquia Bambino (pode ser expandido para outros distribuidores)
    const hierarchy = BAMBINO_HIERARCHY;

    // Para cada categoria pai na hierarquia
    for (const [parentName, subcategories] of Object.entries(hierarchy)) {
      let parentCat = categoriaByNome.get(parentName);
      
      // Se categoria pai não existe, criar
      if (!parentCat) {
        // Gerar um mercos_id único para categorias criadas manualmente (negativo para distinguir)
        const newMercosId = -Math.abs(Date.now() % 1000000 + Math.random() * 1000);
        
        const { data: newParent, error: createError } = await supabaseAdmin
          .from('distribuidor_categories')
          .insert({
            distribuidor_id: distribuidorId,
            nome: parentName,
            mercos_id: Math.floor(newMercosId),
            categoria_pai_id: null,
            ativo: true,
          })
          .select()
          .single();

        if (createError) {
          results.push({ action: 'create_parent', nome: parentName, error: createError.message });
          continue;
        }

        parentCat = newParent;
        created++;
        results.push({ action: 'created_parent', nome: parentName, id: newParent.id, mercos_id: newParent.mercos_id });
      }

      // Verificar se parentCat existe antes de continuar
      if (!parentCat) {
        results.push({ action: 'skip_parent', nome: parentName, error: 'Não foi possível criar/encontrar categoria pai' });
        continue;
      }

      // Atualizar subcategorias para apontar para o pai
      for (const subName of subcategories) {
        const subCat = categoriaByNome.get(subName);
        
        if (subCat && subCat.categoria_pai_id !== parentCat.mercos_id) {
          const { error: updateError } = await supabaseAdmin
            .from('distribuidor_categories')
            .update({ categoria_pai_id: parentCat.mercos_id })
            .eq('id', subCat.id);

          if (updateError) {
            results.push({ action: 'update_sub', nome: subName, parent: parentName, error: updateError.message });
          } else {
            updated++;
            results.push({ action: 'updated_sub', nome: subName, parent: parentName, parent_mercos_id: parentCat.mercos_id });
          }
        } else if (!subCat) {
          results.push({ action: 'not_found', nome: subName, parent: parentName });
        }
      }
    }

    return NextResponse.json({
      success: true,
      distribuidor: distribuidor.nome,
      summary: {
        parents_created: created,
        subcategories_updated: updated,
      },
      details: results,
    });

  } catch (error: any) {
    console.error('[HIERARQUIA] Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const distribuidorId = context.params.id;

    // Buscar categorias com hierarquia
    const { data: categorias, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome, mercos_id, categoria_pai_id, ativo')
      .eq('distribuidor_id', distribuidorId)
      .order('nome');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Organizar em hierarquia
    const catByMercosId = new Map(categorias?.map(c => [c.mercos_id, c]) || []);
    const hierarchy: Record<string, { parent: any; children: any[] }> = {};
    const standalone: any[] = [];

    for (const cat of categorias || []) {
      if (cat.categoria_pai_id != null) {
        const parent = catByMercosId.get(cat.categoria_pai_id);
        if (parent) {
          if (!hierarchy[parent.nome]) {
            hierarchy[parent.nome] = { parent, children: [] };
          }
          hierarchy[parent.nome].children.push(cat);
        } else {
          standalone.push({ ...cat, note: 'pai_nao_encontrado' });
        }
      } else {
        // Verificar se é pai de alguém
        const isParent = categorias?.some(c => c.categoria_pai_id === cat.mercos_id);
        if (!isParent) {
          standalone.push(cat);
        }
      }
    }

    return NextResponse.json({
      success: true,
      hierarchy,
      standalone,
      stats: {
        total: categorias?.length || 0,
        grupos: Object.keys(hierarchy).length,
        standalone: standalone.length,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
