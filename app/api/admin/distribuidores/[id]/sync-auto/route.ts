import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Sincronização Automática Contínua
 * Executa múltiplas chamadas ao sync-fast até completar TODOS os produtos
 */
export const maxDuration = 300; // 5 minutos

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  console.log(`[SYNC-AUTO] ===== SINCRONIZAÇÃO AUTOMÁTICA INICIADA =====`);
  console.log(`[SYNC-AUTO] Distribuidor ID: ${params.id}`);
  
  try {
    const distribuidorId = params.id;
    const MAX_ITERATIONS = 20; // Máximo de 20 iterações (segurança)
    const DELAY_BETWEEN_CALLS = 1000; // 1 segundo entre chamadas
    const MAX_EXECUTION_TIME = 270; // 4.5 minutos (deixa margem de segurança)
    
    let iteration = 0;
    let totalNovos = 0;
    let totalIgnorados = 0;
    let allErrors: string[] = [];
    let lastBatchSize = 0;
    let consecutiveEmptyBatches = 0;
    
    // Buscar dados do distribuidor
    const { data: distribuidor } = await supabaseAdmin
      .from('distribuidores')
      .select('nome')
      .eq('id', distribuidorId)
      .single();
    
    console.log(`[SYNC-AUTO] Distribuidor: ${distribuidor?.nome || 'Desconhecido'}`);
    
    // Loop de sincronização
    while (iteration < MAX_ITERATIONS) {
      iteration++;
      
      // Verificar timeout
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds >= MAX_EXECUTION_TIME) {
        console.log('[SYNC-AUTO] ⚠️ Timeout alcançado, finalizando...');
        allErrors.push('⏱️ Timeout alcançado. Execute novamente para continuar.');
        break;
      }
      
      console.log(`[SYNC-AUTO] ===== Iteração ${iteration}/${MAX_ITERATIONS} =====`);
      
      try {
        // Chamar sync-fast
        const syncResponse = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/distribuidores/${distribuidorId}/sync-fast`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!syncResponse.ok) {
          const errorText = await syncResponse.text();
          throw new Error(`HTTP ${syncResponse.status}: ${errorText.slice(0, 200)}`);
        }
        
        const syncData = await syncResponse.json();
        
        if (!syncData.success) {
          throw new Error(syncData.error || 'Erro desconhecido na sincronização');
        }
        
        const novos = syncData.data?.produtos_novos || 0;
        const ignorados = syncData.data?.produtos_atualizados || 0; // sync-fast usa este campo para ignorados
        const totalProcessado = syncData.data?.produtos_total || 0;
        
        totalNovos += novos;
        totalIgnorados += ignorados;
        lastBatchSize = totalProcessado;
        
        console.log(`[SYNC-AUTO] Iteração ${iteration}: ${novos} novos | ${ignorados} ignorados | ${totalProcessado} processados`);
        
        // Adicionar erros se houver
        if (syncData.data?.erros && syncData.data.erros.length > 0) {
          allErrors.push(...syncData.data.erros);
        }
        
        // Verificar se não há mais produtos novos
        if (novos === 0) {
          consecutiveEmptyBatches++;
          console.log(`[SYNC-AUTO] Nenhum produto novo nesta iteração (${consecutiveEmptyBatches}/3)`);
          
          // Se 3 iterações consecutivas sem produtos novos, considerar completo
          if (consecutiveEmptyBatches >= 3) {
            console.log('[SYNC-AUTO] ✅ 3 iterações sem produtos novos. Sincronização completa!');
            break;
          }
        } else {
          consecutiveEmptyBatches = 0; // Reset contador
        }
        
        // Se processou menos que o batch size esperado, pode ter terminado
        if (totalProcessado < 100) {
          console.log('[SYNC-AUTO] ✅ Batch pequeno detectado. Provavelmente chegou ao fim.');
          break;
        }
        
        // Aguardar antes da próxima iteração
        if (iteration < MAX_ITERATIONS) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS));
        }
        
      } catch (error: any) {
        console.error(`[SYNC-AUTO] ❌ Erro na iteração ${iteration}:`, error);
        allErrors.push(`Erro na iteração ${iteration}: ${error.message}`);
        
        // Se erro crítico, aguardar mais tempo antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CALLS * 3));
      }
    }
    
    // Buscar estatísticas finais
    const { count: totalAtivos } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);
    
    const { count: totalGeral } = await supabaseAdmin
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);
    
    const tempoTotal = ((Date.now() - startTime) / 1000).toFixed(1);
    const completed = consecutiveEmptyBatches >= 3 || iteration >= MAX_ITERATIONS;
    
    console.log(`[SYNC-AUTO] ===== FINALIZADO =====`);
    console.log(`[SYNC-AUTO] Iterações: ${iteration}`);
    console.log(`[SYNC-AUTO] Novos: ${totalNovos}`);
    console.log(`[SYNC-AUTO] Ignorados: ${totalIgnorados}`);
    console.log(`[SYNC-AUTO] Total no banco: ${totalGeral} (${totalAtivos} ativos)`);
    console.log(`[SYNC-AUTO] Tempo: ${tempoTotal}s`);
    
    return NextResponse.json({
      success: true,
      data: {
        completed,
        iterations: iteration,
        produtos_novos: totalNovos,
        produtos_ignorados: totalIgnorados,
        total_ativos: totalAtivos || 0,
        total_geral: totalGeral || 0,
        tempo_execucao: `${tempoTotal}s`,
        erros: allErrors,
        message: completed
          ? `✅ Sincronização completa! ${totalNovos} produtos novos inseridos em ${iteration} iterações.`
          : `⚠️ Sincronização parcial. ${totalNovos} produtos novos em ${iteration} iterações. Execute novamente para continuar.`
      }
    });
    
  } catch (error: any) {
    console.error('[SYNC-AUTO] ❌ Erro geral:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}
