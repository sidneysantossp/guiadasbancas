const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sincronizarCompleto() {
  console.log('\n🔄 SINCRONIZAÇÃO COMPLETA - MÚLTIPLAS CHAMADAS\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}`);
    console.log(`🆔 ID: ${dist.id}\n`);
    console.log('='.repeat(80) + '\n');
    
    const url = `http://localhost:3000/api/admin/distribuidores/${dist.id}/sync-fast`;
    const maxChamadas = 20; // Limite de segurança
    let chamada = 0;
    let totalNovos = 0;
    let totalIgnorados = 0;
    
    console.log('🔄 Iniciando sincronização incremental...\n');
    console.log('   Cada chamada processa ~7.000 produtos');
    console.log('   Continuará até não haver mais produtos novos\n');
    console.log('='.repeat(80) + '\n');
    
    while (chamada < maxChamadas) {
      chamada++;
      
      console.log(`📞 Chamada ${chamada}/${maxChamadas}...\n`);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer admin-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ syncProducts: true })
        });
        
        if (!response.ok) {
          console.log(`   ❌ Erro HTTP: ${response.status}\n`);
          break;
        }
        
        const data = await response.json();
        
        if (!data.success) {
          console.log(`   ❌ Erro: ${data.error || 'Desconhecido'}\n`);
          break;
        }
        
        const novos = data.data?.produtos_novos || 0;
        const ignorados = data.data?.produtos_ignorados || 0;
        const total = data.data?.total_no_banco || 0;
        const tempo = data.data?.tempo_execucao || '?';
        
        totalNovos += novos;
        totalIgnorados += ignorados;
        
        console.log(`   ✅ Concluída em ${tempo}`);
        console.log(`   🆕 Novos: ${novos}`);
        console.log(`   ⏭️  Ignorados: ${ignorados}`);
        console.log(`   📦 Total no banco: ${total}\n`);
        
        // Se não houver novos produtos, terminou
        if (novos === 0) {
          console.log('   ✅ Nenhum produto novo. Sincronização completa!\n');
          break;
        }
        
        // Aguardar 2 segundos entre chamadas
        if (chamada < maxChamadas) {
          console.log('   ⏳ Aguardando 2 segundos...\n');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`   💥 Erro: ${error.message}\n`);
        break;
      }
    }
    
    console.log('='.repeat(80) + '\n');
    console.log('📊 RESULTADO FINAL:\n');
    console.log(`   Total de chamadas: ${chamada}`);
    console.log(`   Produtos novos inseridos: ${totalNovos}`);
    console.log(`   Produtos ignorados (já existiam): ${totalIgnorados}\n`);
    
    // Verificar contagem final
    const { count: ativosFinais } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log('📦 CONTAGEM FINAL:\n');
    console.log(`   Produtos ativos: ${(ativosFinais || 0).toLocaleString('pt-BR')}`);
    console.log(`   Esperado: 3.439\n`);
    
    if (ativosFinais >= 3400 && ativosFinais <= 3500) {
      console.log('   ✅ SUCESSO! Número de ativos está correto!\n');
    } else {
      console.log(`   ⚠️  Diferença: ${Math.abs(3439 - (ativosFinais || 0))} produtos\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

sincronizarCompleto().then(() => {
  console.log('\n✅ Script concluído.\n');
  process.exit(0);
}).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
