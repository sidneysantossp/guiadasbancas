const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function limparESincronizar() {
  console.log('\n🧹 LIMPEZA E SINCRONIZAÇÃO COMPLETA - BRANCALEONE\n');
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
    
    // ETAPA 1: Deletar todos os produtos
    console.log('🗑️  ETAPA 1: Deletando todos os produtos...\n');
    
    const { error: deleteError, count } = await supabase
      .from('products')
      .delete()
      .eq('distribuidor_id', dist.id);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError.message);
      return;
    }
    
    console.log(`   ✅ ${count || 'Todos os'} produtos deletados\n`);
    console.log('='.repeat(80) + '\n');
    
    // ETAPA 2: Aguardar um pouco
    console.log('⏳ Aguardando 3 segundos...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // ETAPA 3: Iniciar sincronização
    console.log('🔄 ETAPA 2: Iniciando sincronização via API...\n');
    
    const syncUrl = `http://localhost:3000/api/admin/distribuidores/${dist.id}/sync-fast`;
    
    console.log(`   URL: ${syncUrl}\n`);
    console.log('   Enviando requisição...\n');
    
    const response = await fetch(syncUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer admin-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ syncProducts: true })
    });
    
    if (!response.ok) {
      console.error(`   ❌ Erro HTTP: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`   Resposta: ${text.substring(0, 200)}`);
      return;
    }
    
    console.log('   ✅ Sincronização iniciada com sucesso!\n');
    console.log('   ⏳ Aguarde a sincronização terminar (pode levar 5-10 minutos)...\n');
    console.log('='.repeat(80) + '\n');
    console.log('💡 PRÓXIMOS PASSOS:\n');
    console.log('   1. Aguarde os logs de sincronização no terminal do servidor');
    console.log('   2. Quando terminar, execute: node scripts/contar-ativos-final-brancaleone.js');
    console.log('   3. Verifique se o número de ativos está correto (3.439)\n');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

limparESincronizar().then(() => {
  console.log('\n✅ Script concluído. Aguarde a sincronização terminar.\n');
  process.exit(0);
}).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
