import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const maxDuration = 300;

/**
 * Atualiza as categorias de todos os produtos de distribuidores
 * Busca o categoria_id da Mercos e mapeia para o UUID local
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin;
    
    // Buscar todos os distribuidores ativos
    const { data: distribuidores, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('ativo', true);

    if (distError || !distribuidores) {
      return NextResponse.json({ success: false, error: 'Erro ao buscar distribuidores' }, { status: 500 });
    }

    const results: any[] = [];

    for (const distribuidor of distribuidores) {
      console.log(`[UPDATE-CAT] Processando: ${distribuidor.nome}`);
      
      // Buscar mapa de categorias do distribuidor (mercos_id -> uuid)
      const { data: distCategories } = await supabase
        .from('distribuidor_categories')
        .select('id, mercos_id')
        .eq('distribuidor_id', distribuidor.id);
      
      const categoryMap = new Map<number, string>();
      for (const cat of distCategories || []) {
        if (cat.mercos_id) {
          categoryMap.set(cat.mercos_id, cat.id);
        }
      }
      console.log(`[UPDATE-CAT] ${categoryMap.size} categorias mapeadas`);

      if (categoryMap.size === 0) {
        results.push({
          distribuidor: distribuidor.nome,
          success: false,
          error: 'Nenhuma categoria mapeada',
        });
        continue;
      }

      // Inicializar API Mercos
      const mercosApi = new MercosAPI({
        applicationToken: distribuidor.application_token,
        companyToken: distribuidor.company_token,
        baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
      });

      // Testar conexão
      const connectionTest = await mercosApi.testConnection();
      if (!connectionTest.success) {
        results.push({
          distribuidor: distribuidor.nome,
          success: false,
          error: `Falha na conexão: ${connectionTest.error}`,
        });
        continue;
      }

      // Buscar todos os produtos do distribuidor no banco
      const { data: produtosLocal } = await supabase
        .from('products')
        .select('id, mercos_id, category_id')
        .eq('distribuidor_id', distribuidor.id);

      if (!produtosLocal || produtosLocal.length === 0) {
        results.push({
          distribuidor: distribuidor.nome,
          success: true,
          message: 'Nenhum produto para atualizar',
        });
        continue;
      }

      // Criar mapa de produtos locais (mercos_id -> {id, category_id})
      const produtosMap = new Map<number, { id: string; category_id: string | null }>();
      for (const p of produtosLocal) {
        if (p.mercos_id) {
          produtosMap.set(p.mercos_id, { id: p.id, category_id: p.category_id });
        }
      }

      console.log(`[UPDATE-CAT] ${produtosMap.size} produtos locais para verificar`);

      // Buscar produtos da Mercos por paginação simples (sem alterado_apos)
      let atualizados = 0;
      let semCategoria = 0;
      let jaCorretos = 0;
      let categoriaNaoMapeada = 0;
      let pagina = 1;
      const porPagina = 500;
      let hasMore = true;

      while (hasMore) {
        const url = `${distribuidor.base_url || 'https://app.mercos.com/api/v1'}/produtos?pagina=${pagina}&por_pagina=${porPagina}`;
        
        const response = await fetch(url, {
          headers: {
            'ApplicationToken': distribuidor.application_token,
            'CompanyToken': distribuidor.company_token,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error(`[UPDATE-CAT] Erro ao buscar página ${pagina}:`, response.status);
          break;
        }

        const lote = await response.json();
        
        if (!Array.isArray(lote) || lote.length === 0) {
          hasMore = false;
          break;
        }

        console.log(`[UPDATE-CAT] Página ${pagina}: ${lote.length} produtos`);

        const updates: { id: string; category_id: string }[] = [];

        for (const produtoMercos of lote) {
          const produtoLocal = produtosMap.get(produtoMercos.id);
          if (!produtoLocal) continue;

          const mercosCatId = produtoMercos.categoria_id;
          if (!mercosCatId) {
            semCategoria++;
            continue;
          }

          const mappedCategoryId = categoryMap.get(mercosCatId);
          if (!mappedCategoryId) {
            categoriaNaoMapeada++;
            continue;
          }

          // Verificar se já está correto
          if (produtoLocal.category_id === mappedCategoryId) {
            jaCorretos++;
            continue;
          }

          updates.push({ id: produtoLocal.id, category_id: mappedCategoryId });
        }

        // Atualizar em lotes
        for (const update of updates) {
          const { error } = await supabase
            .from('products')
            .update({ category_id: update.category_id })
            .eq('id', update.id);

          if (!error) {
            atualizados++;
          }
        }

        pagina++;
        
        // Limite de segurança
        if (pagina > 100) {
          console.log(`[UPDATE-CAT] Limite de páginas atingido`);
          break;
        }
      }

      console.log(`[UPDATE-CAT] ${distribuidor.nome}: ${atualizados} atualizados, ${jaCorretos} já corretos, ${semCategoria} sem categoria`);

      results.push({
        distribuidor: distribuidor.nome,
        success: true,
        atualizados,
        ja_corretos: jaCorretos,
        sem_categoria: semCategoria,
        categoria_nao_mapeada: categoriaNaoMapeada,
      });
    }

    return NextResponse.json({
      success: true,
      executado_em: new Date().toISOString(),
      resultados: results,
    });
  } catch (error: any) {
    console.error('[UPDATE-CAT] Erro:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
