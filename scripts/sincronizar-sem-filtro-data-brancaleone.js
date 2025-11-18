const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sincronizarSemFiltroData() {
  console.log('\n🔄 SINCRONIZANDO SEM FILTRO DE DATA - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Trigger sync-fast SEM filtro de data (deve pegar todos)
    console.log('🔄 Iniciando sincronização via API...\n');
    console.log('   Esta sincronização vai buscar TODOS os produtos,\n');
    console.log('   não apenas os alterados recentemente.\n');
    console.log('='.repeat(80) + '\n');
    
    const syncUrl = `http://localhost:3000/api/admin/distribuidores/${dist.id}/sync-fast`;
    
    console.log('   Enviando requisição POST...\n');
    
    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        syncProducts: true,
        fullSync: true  // Forçar sincronização completa
      })
    });
    
    if (!response.ok) {
      console.error(`   ❌ Erro HTTP: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`   Resposta: ${text.substring(0, 200)}`);
      return;
    }
    
    const result = await response.json();
    
    console.log('   ✅ Resposta recebida:\n');
    console.log(JSON.stringify(result, null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Aguardar um pouco e verificar resultado
    console.log('⏳ Aguardando 5 segundos para verificar resultado...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { count: ativosAgora } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log('📊 RESULTADO:\n');
    console.log(`   Produtos ativos no banco: ${(ativosAgora || 0).toLocaleString('pt-BR')}`);
    console.log(`   Esperado: 3.439`);
    console.log(`   Diferença: ${Math.abs(3439 - (ativosAgora || 0))}\n`);
    
    if (ativosAgora >= 3400 && ativosAgora <= 3500) {
      console.log('   ✅ SUCESSO! Número de ativos está correto!\n');
    } else {
      console.log('   ⚠️  Ainda há diferença. Aguarde a sincronização terminar.\n');
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

sincronizarSemFiltroData().then(() => {
  console.log('\n✅ Script concluído.\n');
  process.exit(0);
}).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
