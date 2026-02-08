import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/**
 * POST /api/admin/distribuidores/backfill-categories
 * 
 * Backfill category_id para produtos de distribuidores que estão com category_id = null.
 * Usa o mercos_id do produto + categoria_id da API Mercos para mapear.
 * 
 * Requer que a FK constraint products_category_id_fkey já tenha sido removida.
 */
export async function POST(request: NextRequest) {
  try {
    // Buscar todos os distribuidores ativos
    const { data: distribuidores } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, application_token, company_token, base_url')
      .eq('ativo', true);

    if (!distribuidores || distribuidores.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum distribuidor ativo encontrado' });
    }

    const results: any[] = [];

    for (const distribuidor of distribuidores) {
      console.log(`[BACKFILL] Processando distribuidor: ${distribuidor.nome}`);

      // 1. Carregar mapeamento de categorias (mercos_id → UUID)
      const { data: distCategories } = await supabaseAdmin
        .from('distribuidor_categories')
        .select('id, mercos_id, nome')
        .eq('distribuidor_id', distribuidor.id);

      const categoryMap = new Map<number, { id: string; nome: string }>();
      for (const cat of distCategories || []) {
        if (cat.mercos_id) {
          categoryMap.set(cat.mercos_id, { id: cat.id, nome: cat.nome });
        }
      }
      console.log(`[BACKFILL] ${categoryMap.size} categorias mapeadas para ${distribuidor.nome}`);

      if (categoryMap.size === 0) {
        results.push({ distribuidor: distribuidor.nome, status: 'skipped', reason: 'Sem categorias mapeadas' });
        continue;
      }

      // 2. Buscar produtos sem category_id
      const { data: produtosSemCategoria, count } = await supabaseAdmin
        .from('products')
        .select('id, mercos_id, name', { count: 'exact' })
        .eq('distribuidor_id', distribuidor.id)
        .is('category_id', null)
        .not('mercos_id', 'is', null)
        .limit(10000);

      console.log(`[BACKFILL] ${produtosSemCategoria?.length || 0} produtos sem categoria (total: ${count})`);

      if (!produtosSemCategoria || produtosSemCategoria.length === 0) {
        results.push({ distribuidor: distribuidor.nome, status: 'ok', reason: 'Todos os produtos já têm categoria' });
        continue;
      }

      // 3. Buscar categoria_id de cada produto via API Mercos (em lotes)
      const baseUrl = distribuidor.base_url || 'https://app.mercos.com/api/v1';
      const headers: Record<string, string> = {
        'ApplicationToken': distribuidor.application_token,
        'CompanyToken': distribuidor.company_token,
        'Content-Type': 'application/json',
      };

      let totalAtualizado = 0;
      let totalSemMapeamento = 0;
      let totalErros = 0;
      let alteradoApos = '2020-01-01T00:00:00';
      let hasMore = true;
      let pageCount = 0;
      const MAX_PAGES = 100;

      // Criar mapa mercos_id → product.id para lookup rápido
      const productMap = new Map<number, string>();
      for (const p of produtosSemCategoria) {
        if (p.mercos_id) productMap.set(p.mercos_id as number, p.id);
      }

      // Buscar todos os produtos da Mercos para obter categoria_id
      while (hasMore && pageCount < MAX_PAGES) {
        pageCount++;
        const qp = new URLSearchParams();
        qp.append('alterado_apos', alteradoApos);
        qp.append('limit', '200');
        qp.append('order_by', 'ultima_alteracao');
        qp.append('order_direction', 'asc');

        const url = `${baseUrl}/produtos?${qp.toString()}`;
        
        try {
          const res = await fetch(url, { headers });
          
          if (res.status === 429) {
            const throttle = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
            await new Promise(r => setTimeout(r, (throttle.tempo_ate_permitir_novamente || 5) * 1000));
            pageCount--; // Não contar como página
            continue;
          }

          if (!res.ok) break;

          const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
          const raw = await res.json();
          const data = (raw && typeof raw === 'object' && 'data' in raw && Array.isArray(raw.data)) ? raw.data : raw;
          const produtos = Array.isArray(data) ? data : [];

          if (produtos.length === 0) { hasMore = false; break; }

          // Processar produtos que precisam de categoria
          const updates: { id: string; category_id: string }[] = [];
          
          for (const p of produtos) {
            const productId = productMap.get(p.id);
            if (!productId) continue; // Produto já tem categoria ou não existe

            const catInfo = p.categoria_id ? categoryMap.get(p.categoria_id) : null;
            if (catInfo) {
              updates.push({ id: productId, category_id: catInfo.id });
              productMap.delete(p.id); // Remover do mapa para não processar de novo
            } else {
              totalSemMapeamento++;
            }
          }

          // Atualizar em lote
          if (updates.length > 0) {
            for (let i = 0; i < updates.length; i += 50) {
              const batch = updates.slice(i, i + 50);
              const promises = batch.map(u =>
                supabaseAdmin.from('products').update({ category_id: u.category_id }).eq('id', u.id)
              );
              const results = await Promise.allSettled(promises);
              totalAtualizado += results.filter(r => r.status === 'fulfilled').length;
              totalErros += results.filter(r => r.status === 'rejected').length;
            }
          }

          // Avançar paginação
          if (limitou && produtos.length > 0) {
            produtos.sort((a: any, b: any) => ((a.ultima_alteracao || '').toString()).localeCompare((b.ultima_alteracao || '').toString()));
            alteradoApos = produtos[produtos.length - 1]?.ultima_alteracao || alteradoApos;
          } else {
            hasMore = false;
          }

          // Se não há mais produtos sem categoria, parar
          if (productMap.size === 0) {
            console.log(`[BACKFILL] Todos os produtos sem categoria foram processados`);
            hasMore = false;
          }
        } catch (err: any) {
          console.error(`[BACKFILL] Erro na página ${pageCount}:`, err.message);
          totalErros++;
          break;
        }
      }

      console.log(`[BACKFILL] ${distribuidor.nome}: ${totalAtualizado} atualizados, ${totalSemMapeamento} sem mapeamento, ${totalErros} erros`);
      results.push({
        distribuidor: distribuidor.nome,
        status: 'done',
        atualizado: totalAtualizado,
        sem_mapeamento: totalSemMapeamento,
        erros: totalErros,
        restantes_sem_categoria: productMap.size,
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('[BACKFILL] Erro:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
