const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarProdutos() {
  console.log('\n📊 CONTANDO PRODUTOS SINCRONIZADOS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    // Buscar distribuidor
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .ilike('nome', '%brancaleone%')
      .single();
    
    if (!dist) {
      console.log('❌ Distribuidor Brancaleone não encontrado!\n');
      return;
    }
    
    console.log(`🏢 Distribuidor: ${dist.nome}`);
    console.log(`🆔 ID: ${dist.id}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Contar produtos
    const { count: total, error: errorTotal } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    if (errorTotal) {
      console.error('❌ Erro ao contar produtos:', errorTotal);
      return;
    }
    
    // Contar ativos
    const { count: ativos, error: errorAtivos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('status', 'active');
    
    // Contar inativos
    const { count: inativos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .neq('status', 'active');
    
    console.log('📦 PRODUTOS NO BANCO DE DADOS:\n');
    console.log(`   Total:     ${(total || 0).toLocaleString('pt-BR')} produtos`);
    console.log(`   Ativos:    ${(ativos || 0).toLocaleString('pt-BR')} produtos`);
    console.log(`   Inativos:  ${(inativos || 0).toLocaleString('pt-BR')} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    // Verificar produtos mais recentes
    const { data: recentes } = await supabase
      .from('products')
      .select('name, codigo_mercos, status, created_at')
      .eq('distribuidor_id', dist.id)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentes && recentes.length > 0) {
      console.log('📋 ÚLTIMOS 5 PRODUTOS SINCRONIZADOS:\n');
      recentes.forEach((p, i) => {
        const statusIcon = p.status === 'active' ? '✅' : '❌';
        console.log(`   ${i + 1}. ${statusIcon} ${p.codigo_mercos || 'N/A'} - ${p.name?.substring(0, 50)}`);
        console.log(`      Data: ${new Date(p.created_at).toLocaleString('pt-BR')}\n`);
      });
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

contarProdutos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
