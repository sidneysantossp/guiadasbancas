import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Endpoint para sincronização contínua
 * Executa múltiplas chamadas ao endpoint de sync até completar todos os produtos
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[SYNC-CONTINUOUS] Iniciando sincronização contínua para distribuidor ${params.id}`);
  
  try {
    const body = await request.json().catch(() => ({}));
    const maxIterations = body?.maxIterations || 50; // Máximo de iterações para evitar loops infinitos
    const delayBetweenCalls = body?.delay || 2000; // 2 segundos entre chamadas
    
    let iteration = 0;
    let totalNovos = 0;
    let totalAtualizados = 0;
    let allErrors: string[] = [];
    let completed = false;
    let lastProcessedId: number | null = null;
    
    // Fazer chamadas sucessivas até completar
    while (iteration < maxIterations && !completed) {
      iteration++;
      console.log(`[SYNC-CONTINUOUS] Iteração ${iteration}/${maxIterations}`);
      
      try {
        // Chamar o endpoint de sync otimizado
        const syncBody: any = {};
        
        // Se houver um lastProcessedId da iteração anterior, continuar de lá
        if (iteration > 1 && totalNovos + totalAtualizados > 0) {
          // O endpoint retorna lastProcessedId no response
          syncBody.lastProcessedId = lastProcessedId;
        }
        
        const syncResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/distribuidores/${params.id}/sync-full`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(syncBody),
          }
        );
        
        if (!syncResponse.ok) {
          const errorData = await syncResponse.json();
          throw new Error(errorData.error || 'Erro na sincronização');
        }
        
        const syncData = await syncResponse.json();
        
        if (syncData.success) {
          totalNovos += syncData.data.produtos_novos || 0;
          totalAtualizados += syncData.data.produtos_atualizados || 0;
          lastProcessedId = syncData.data.lastProcessedId || lastProcessedId;
          
          if (syncData.data.erros && syncData.data.erros.length > 0) {
            allErrors.push(...syncData.data.erros);
          }
          
          console.log(`[SYNC-CONTINUOUS] Iteração ${iteration}: ${syncData.data.produtos_novos} novos, ${syncData.data.produtos_atualizados} atualizados, último ID: ${lastProcessedId}`);
          
          // Verificar se completou baseado no campo do response
          if (syncData.data.completed) {
            console.log('[SYNC-CONTINUOUS] ✅ Todos os produtos foram sincronizados!');
            completed = true;
            break;
          }
          
          // Verificar se há mais produtos para processar
          if (!syncData.data.hasMore) {
            console.log('[SYNC-CONTINUOUS] ✅ Não há mais produtos para processar!');
            completed = true;
            break;
          }
          
          console.log('[SYNC-CONTINUOUS] ⏭️ Continuando para próximo lote...');
          
          // Aguardar antes da próxima iteração
          if (iteration < maxIterations && !completed) {
            await new Promise(resolve => setTimeout(resolve, delayBetweenCalls));
          }
        } else {
          throw new Error(syncData.error || 'Erro desconhecido na sincronização');
        }
      } catch (error: any) {
        console.error(`[SYNC-CONTINUOUS] Erro na iteração ${iteration}:`, error);
        allErrors.push(`Erro na iteração ${iteration}: ${error.message}`);
        
        // Se houver erro, aguardar um pouco mais antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, delayBetweenCalls * 2));
      }
    }
    
    // Buscar estatísticas finais
    const { count: totalProdutos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id);
    
    const result = {
      success: true,
      completed,
      iterations: iteration,
      totalNovos,
      totalAtualizados,
      totalProdutos,
      errors: allErrors,
      message: completed 
        ? '✅ Sincronização completa! Todos os produtos foram processados.'
        : `⚠️ Sincronização parcial. Executadas ${iteration} iterações. Execute novamente para continuar.`
    };
    
    console.log('[SYNC-CONTINUOUS] Resultado final:', result);
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('[SYNC-CONTINUOUS] Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
