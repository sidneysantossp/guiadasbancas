import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { MercosAPI } from "@/lib/mercos-api";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Endpoint de diagnóstico para verificar categorias da Mercos
 * Compara o que está no banco com o que a API Mercos retorna
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const distribuidorId = context.params.id;
    
    if (!distribuidorId) {
      return NextResponse.json({ error: "ID do distribuidor é obrigatório" }, { status: 400 });
    }

    // 1. Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, mercos_application_token, mercos_company_token')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({ 
        error: "Distribuidor não encontrado",
        details: distError?.message 
      }, { status: 404 });
    }

    // 2. Buscar categorias do banco
    const { data: categoriasDB, error: catError } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome, mercos_id, categoria_pai_id, ativo, updated_at')
      .eq('distribuidor_id', distribuidorId)
      .order('nome', { ascending: true });

    if (catError) {
      return NextResponse.json({ 
        error: "Erro ao buscar categorias do banco",
        details: catError.message 
      }, { status: 500 });
    }

    // 3. Estatísticas do banco
    const dbStats = {
      total: categoriasDB?.length || 0,
      com_pai: categoriasDB?.filter(c => c.categoria_pai_id != null).length || 0,
      sem_pai: categoriasDB?.filter(c => c.categoria_pai_id == null).length || 0,
      ativos: categoriasDB?.filter(c => c.ativo).length || 0,
      inativos: categoriasDB?.filter(c => !c.ativo).length || 0,
    };

    // 4. Verificar se tem tokens Mercos
    const hasTokens = !!(distribuidor.mercos_application_token && distribuidor.mercos_company_token);
    
    let mercosData: any = null;
    let mercosStats: any = null;
    let comparacao: any = null;

    if (hasTokens) {
      try {
        // 5. Buscar categorias da API Mercos
        const mercosApi = new MercosAPI({
          applicationToken: distribuidor.mercos_application_token!,
          companyToken: distribuidor.mercos_company_token!,
        });

        const categoriasMercos = await mercosApi.getAllCategorias({ 
          batchSize: 200, 
          alteradoApos: '2020-01-01T00:00:00' 
        });

        // 6. Estatísticas da Mercos
        mercosStats = {
          total: categoriasMercos.length,
          com_pai: categoriasMercos.filter((c: any) => c.categoria_pai_id != null).length,
          sem_pai: categoriasMercos.filter((c: any) => c.categoria_pai_id == null).length,
          ativos: categoriasMercos.filter((c: any) => !c.excluido).length,
          excluidos: categoriasMercos.filter((c: any) => c.excluido).length,
        };

        // 7. Amostra das categorias Mercos (primeiras 10)
        mercosData = {
          amostra: categoriasMercos.slice(0, 10).map((c: any) => ({
            id: c.id,
            nome: c.nome,
            categoria_pai_id: c.categoria_pai_id,
            excluido: c.excluido,
            ultima_alteracao: c.ultima_alteracao,
          })),
          todas_com_pai: categoriasMercos
            .filter((c: any) => c.categoria_pai_id != null)
            .map((c: any) => ({
              id: c.id,
              nome: c.nome,
              categoria_pai_id: c.categoria_pai_id,
            })),
        };

        // 8. Comparar nomes: banco vs Mercos
        const mercosNomes = new Map(categoriasMercos.map((c: any) => [c.id, c.nome]));
        const dbNomes = new Map((categoriasDB || []).map(c => [c.mercos_id, c.nome]));
        
        const diferencas: any[] = [];
        for (const [mercosId, mercosNome] of mercosNomes) {
          const dbNome = dbNomes.get(mercosId);
          if (dbNome && dbNome !== mercosNome) {
            diferencas.push({
              mercos_id: mercosId,
              nome_banco: dbNome,
              nome_mercos: mercosNome,
              status: 'NOME_DIFERENTE'
            });
          } else if (!dbNome) {
            diferencas.push({
              mercos_id: mercosId,
              nome_banco: null,
              nome_mercos: mercosNome,
              status: 'FALTA_NO_BANCO'
            });
          }
        }

        // Categorias no banco mas não na Mercos
        for (const cat of (categoriasDB || [])) {
          if (!mercosNomes.has(cat.mercos_id)) {
            diferencas.push({
              mercos_id: cat.mercos_id,
              nome_banco: cat.nome,
              nome_mercos: null,
              status: 'FALTA_NA_MERCOS'
            });
          }
        }

        comparacao = {
          total_diferencas: diferencas.length,
          nomes_diferentes: diferencas.filter(d => d.status === 'NOME_DIFERENTE').length,
          faltam_no_banco: diferencas.filter(d => d.status === 'FALTA_NO_BANCO').length,
          faltam_na_mercos: diferencas.filter(d => d.status === 'FALTA_NA_MERCOS').length,
          detalhes: diferencas,
        };

      } catch (mercosError: any) {
        mercosData = {
          error: "Erro ao conectar com Mercos",
          details: mercosError.message,
        };
      }
    }

    // 9. Hierarquia atual no banco
    const hierarquiaDB: Record<string, string[]> = {};
    const categoriasStandalone: string[] = [];
    
    const catByMercosId = new Map((categoriasDB || []).map(c => [c.mercos_id, c]));
    
    for (const cat of (categoriasDB || [])) {
      if (cat.categoria_pai_id != null) {
        const pai = catByMercosId.get(cat.categoria_pai_id);
        if (pai) {
          if (!hierarquiaDB[pai.nome]) hierarquiaDB[pai.nome] = [];
          hierarquiaDB[pai.nome].push(cat.nome);
        } else {
          categoriasStandalone.push(cat.nome);
        }
      } else {
        // Verificar se é pai de alguém
        const ehPai = (categoriasDB || []).some(c => c.categoria_pai_id === cat.mercos_id);
        if (!ehPai) {
          categoriasStandalone.push(cat.nome);
        }
      }
    }

    return NextResponse.json({
      success: true,
      distribuidor: {
        id: distribuidor.id,
        nome: distribuidor.nome,
        has_mercos_tokens: hasTokens,
      },
      banco: {
        stats: dbStats,
        categorias: categoriasDB?.map(c => ({
          id: c.id,
          nome: c.nome,
          mercos_id: c.mercos_id,
          categoria_pai_id: c.categoria_pai_id,
          ativo: c.ativo,
        })),
        hierarquia: Object.keys(hierarquiaDB).length > 0 ? hierarquiaDB : null,
        standalone: categoriasStandalone,
      },
      mercos: hasTokens ? {
        stats: mercosStats,
        data: mercosData,
      } : {
        error: "Tokens Mercos não configurados",
        solucao: "Configure mercos_application_token e mercos_company_token no distribuidor"
      },
      comparacao: comparacao,
      recomendacoes: gerarRecomendacoes(dbStats, mercosStats, comparacao, hasTokens),
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      }
    });

  } catch (error: any) {
    console.error('[DIAGNOSTICO] Erro:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

function gerarRecomendacoes(
  dbStats: any, 
  mercosStats: any, 
  comparacao: any, 
  hasTokens: boolean
): string[] {
  const recomendacoes: string[] = [];

  if (!hasTokens) {
    recomendacoes.push("⚠️ CRÍTICO: Configure os tokens Mercos no distribuidor para habilitar sincronização");
  }

  if (dbStats.com_pai === 0) {
    recomendacoes.push("⚠️ Nenhuma categoria tem hierarquia (categoria_pai_id). A API Mercos pode não estar retornando esse campo ou a sincronização não está capturando.");
  }

  if (comparacao?.nomes_diferentes > 0) {
    recomendacoes.push(`🔄 ${comparacao.nomes_diferentes} categorias com nomes diferentes entre banco e Mercos. Execute uma re-sincronização.`);
  }

  if (comparacao?.faltam_no_banco > 0) {
    recomendacoes.push(`➕ ${comparacao.faltam_no_banco} categorias existem na Mercos mas faltam no banco. Execute uma sincronização completa.`);
  }

  if (comparacao?.faltam_na_mercos > 0) {
    recomendacoes.push(`🗑️ ${comparacao.faltam_na_mercos} categorias existem no banco mas não na Mercos. Podem ter sido excluídas.`);
  }

  if (mercosStats?.com_pai > 0 && dbStats.com_pai === 0) {
    recomendacoes.push("🔗 A Mercos retorna categorias com hierarquia, mas o banco não tem. Verifique o processo de sincronização.");
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push("✅ Tudo parece estar sincronizado corretamente!");
  }

  return recomendacoes;
}
