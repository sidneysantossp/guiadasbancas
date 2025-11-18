const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function limparERessincronizar() {
  console.log('\n🧹 LIMPANDO PRODUTOS E PREPARANDO RESSINCRONIZAÇÃO - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    // Buscar distribuidor
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Contar produtos antes
    const { count: antes } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    console.log(`📊 ANTES DA LIMPEZA:\n`);
    console.log(`   Produtos no banco: ${(antes || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Deletar todos os produtos do distribuidor
    console.log('🗑️  DELETANDO produtos antigos...\n');
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('distribuidor_id', dist.id);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError.message);
      return;
    }
    
    console.log('✅ Produtos deletados com sucesso!\n');
    console.log('='.repeat(80) + '\n');
    
    // Verificar limpeza
    const { count: depois } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    console.log(`📊 APÓS LIMPEZA:\n`);
    console.log(`   Produtos no banco: ${(depois || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    console.log('✅ BANCO LIMPO!\n');
    console.log('💡 Agora execute a sincronização novamente:\n');
    console.log('   curl -X POST "http://localhost:3000/api/admin/distribuidores/1511df09-1f4a-4e68-9f8c-05cd06be6269/sync-fast" \\');
    console.log('     -H "Authorization: Bearer admin-token" \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"syncProducts": true}\'\n');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

limparERessincronizar().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
