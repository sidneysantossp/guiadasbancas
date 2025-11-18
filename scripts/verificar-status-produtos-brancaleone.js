const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarStatus() {
  console.log('\n📊 VERIFICANDO STATUS DOS PRODUTOS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    // Buscar distribuidor
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('id')
      .ilike('nome', '%brancaleone%')
      .single();
    
    // Buscar todos os produtos e agrupar por status
    const { data: produtos } = await supabase
      .from('products')
      .select('status, id')
      .eq('distribuidor_id', dist.id);
    
    if (!produtos || produtos.length === 0) {
      console.log('❌ Nenhum produto encontrado!\n');
      return;
    }
    
    // Agrupar por status
    const statusMap = new Map();
    produtos.forEach(p => {
      const status = p.status || 'null';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });
    
    console.log(`📦 TOTAL DE PRODUTOS: ${produtos.length.toLocaleString('pt-BR')}\n`);
    console.log('📊 PRODUTOS POR STATUS:\n');
    
    const statusArray = Array.from(statusMap.entries())
      .sort((a, b) => b[1] - a[1]);
    
    statusArray.forEach(([status, count]) => {
      const percent = (count / produtos.length * 100).toFixed(1);
      console.log(`   ${status.padEnd(20)}: ${count.toString().padStart(5)} (${percent}%)`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Mostrar exemplos de produtos com cada status
    console.log('📋 EXEMPLOS DE PRODUTOS:\n');
    
    for (const [status] of statusArray.slice(0, 3)) {
      const { data: exemplos } = await supabase
        .from('products')
        .select('name, codigo_mercos, status')
        .eq('distribuidor_id', dist.id)
        .eq('status', status)
        .limit(3);
      
      if (exemplos && exemplos.length > 0) {
        console.log(`\n   Status: "${status}"`);
        exemplos.forEach((p, i) => {
          console.log(`      ${i + 1}. ${p.codigo_mercos || 'N/A'} - ${p.name?.substring(0, 40)}`);
        });
      }
    }
    
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarStatus().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
