import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { companyToken, distribuidorId } = await request.json();
    
    console.log('==================================================');
    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Sincronizando categorias do SANDBOX');
    console.log('[SYNC-SANDBOX-CATEGORIES] Distribuidor ID:', distribuidorId);

    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    
    if (!companyToken) {
      return NextResponse.json({
        success: false,
        error: 'Company Token do SANDBOX é obrigatório'
      }, { status: 400 });
    }

    if (!distribuidorId) {
      return NextResponse.json({
        success: false,
        error: 'ID do distribuidor é obrigatório'
      }, { status: 400 });
    }

    // Buscar TODAS as categorias do SANDBOX com paginação adequada
    let allCategorias: any[] = [];
    let afterId = null;
    let hasMore = true;
    let pageCount = 0;
    const LIMIT = 100; // Limite por página

    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Iniciando paginação por ID...');

    while (hasMore && pageCount < 50) {
      pageCount++;
      
      // Construir endpoint com paginação por ID
      let endpoint = `/categorias?limit=${LIMIT}&order_by=id&order_direction=asc`;
      if (afterId) {
        endpoint += `&after_id=${afterId}`;
      }
      
      console.log(`[SYNC-SANDBOX-CATEGORIES] 📄 Página ${pageCount} (after_id: ${afterId || 'início'})`);
      
      const url = `https://sandbox.mercos.com/api/v1${endpoint}`;
      const headers = {
        'ApplicationToken': SANDBOX_APP_TOKEN,
        'CompanyToken': companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        console.log(`[SYNC-SANDBOX-CATEGORIES] ⏳ Throttling: aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SYNC-SANDBOX-CATEGORIES] ❌ Erro:', errorText);
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      
      console.log(`[SYNC-SANDBOX-CATEGORIES] 📦 Recebidas ${categoriasArray.length} categorias nesta página`);
      
      if (categoriasArray.length === 0) {
        console.log('[SYNC-SANDBOX-CATEGORIES] ✅ Nenhuma categoria retornada - fim da paginação');
        hasMore = false;
        break;
      }
      
      allCategorias = [...allCategorias, ...categoriasArray];

      // Verificar se há mais páginas
      if (categoriasArray.length < LIMIT) {
        console.log('[SYNC-SANDBOX-CATEGORIES] ✅ Última página alcançada (menos que o limite)');
        hasMore = false;
      } else {
        // Usar o ID da última categoria para próxima página
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        afterId = ultimaCategoria.id;
        console.log(`[SYNC-SANDBOX-CATEGORIES] ➡️ Próxima página: after_id=${afterId}`);
      }

      // Pequena pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`[SYNC-SANDBOX-CATEGORIES] 📊 Total categorias: ${allCategorias.length}`);

    // Inserir categorias no banco
    let inseridas = 0;
    let atualizadas = 0;
    let erros = 0;

    for (const cat of allCategorias) {
      try {
        // Verificar se já existe
        const { data: existing } = await supabaseAdmin
          .from('distribuidor_categories')
          .select('id')
          .eq('distribuidor_id', distribuidorId)
          .eq('mercos_id', cat.id)
          .single();

        if (existing) {
          // Atualizar
          const { error: updateError } = await supabaseAdmin
            .from('distribuidor_categories')
            .update({
              nome: cat.nome,
              categoria_pai_id: cat.categoria_pai_id,
              ativo: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', existing.id);

          if (updateError) {
            console.error('[SYNC-SANDBOX-CATEGORIES] Erro ao atualizar:', updateError);
            erros++;
          } else {
            atualizadas++;
          }
        } else {
          // Inserir
          const { error: insertError } = await supabaseAdmin
            .from('distribuidor_categories')
            .insert({
              distribuidor_id: distribuidorId,
              mercos_id: cat.id,
              nome: cat.nome,
              categoria_pai_id: cat.categoria_pai_id,
              ativo: true
            });

          if (insertError) {
            console.error('[SYNC-SANDBOX-CATEGORIES] Erro ao inserir:', insertError);
            erros++;
          } else {
            inseridas++;
          }
        }
      } catch (err) {
        console.error('[SYNC-SANDBOX-CATEGORIES] Erro:', err);
        erros++;
      }
    }

    console.log(`[SYNC-SANDBOX-CATEGORIES] ✅ Inseridas: ${inseridas}`);
    console.log(`[SYNC-SANDBOX-CATEGORIES] ✅ Atualizadas: ${atualizadas}`);
    console.log(`[SYNC-SANDBOX-CATEGORIES] ❌ Erros: ${erros}`);

    return NextResponse.json({
      success: true,
      resultado: {
        total_mercos: allCategorias.length,
        inseridas,
        atualizadas,
        erros
      }
    });

  } catch (error: any) {
    console.error('[SYNC-SANDBOX-CATEGORIES] ❌ ERRO FATAL:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error.stack
      },
      { status: 500 }
    );
  }
}
