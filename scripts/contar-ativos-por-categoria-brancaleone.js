const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarAtivosPorCategoria() {
  console.log('🔍 CONTANDO PRODUTOS ATIVOS POR CATEGORIA - BRANCALEONE\n');
  
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  try {
    console.log('🔍 Coletando TODOS os produtos...\n');
    
    let produtos = [];
    let afterId = null;
    
    for (let i = 0; i < 200; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }

      produtos.push(...batch);
      
      if ((i + 1) % 20 === 0) {
        console.log(`   Coletado: ${produtos.length} produtos...`);
      }
      
      if (batch.length < 200) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }
      
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n📊 Total coletado: ${produtos.length} produtos\n`);
    console.log('='.repeat(80));
    
    const naoExcluidos = produtos.filter(p => !p.excluido);
    
    // Agrupar por categoria e contar ativos
    const categoriaStats = new Map();
    
    naoExcluidos.forEach(p => {
      const catId = p.categoria_id || 'sem_categoria';
      
      if (!categoriaStats.has(catId)) {
        categoriaStats.set(catId, { total: 0, ativos: 0, inativos: 0 });
      }
      
      const stats = categoriaStats.get(catId);
      stats.total++;
      
      if (p.ativo === true) {
        stats.ativos++;
      } else {
        stats.inativos++;
      }
    });
    
    console.log('\n📊 PRODUTOS POR CATEGORIA (ordenado por total):\n');
    
    const categoriasOrdenadas = Array.from(categoriaStats.entries())
      .sort((a, b) => b[1].total - a[1].total);
    
    categoriasOrdenadas.forEach(([catId, stats], i) => {
      const catLabel = catId === 'sem_categoria' ? 'SEM CATEGORIA' : `Categoria ${catId}`;
      const match = stats.total > 3400 && stats.total < 3500 ? ' ✅ MATCH!' : '';
      
      console.log(`   ${(i + 1).toString().padStart(2)}. ${catLabel}`);
      console.log(`       Total: ${stats.total.toString().padStart(5)} | Ativos: ${stats.ativos.toString().padStart(4)} | Inativos: ${stats.inativos.toString().padStart(5)}${match}`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Encontrar categoria com ~3439 produtos
    console.log('\n🎯 PROCURANDO CATEGORIA COM ~3.439 PRODUTOS:\n');
    
    categoriasOrdenadas.forEach(([catId, stats]) => {
      const diff = Math.abs(stats.total - 3439);
      
      if (diff < 100) {
        const catLabel = catId === 'sem_categoria' ? 'SEM CATEGORIA' : `Categoria ${catId}`;
        console.log(`   🎉 ENCONTRADO! ${catLabel}`);
        console.log(`      Total de produtos: ${stats.total}`);
        console.log(`      Ativos: ${stats.ativos}`);
        console.log(`      Inativos: ${stats.inativos}`);
        console.log(`      Diferença: ${diff} produtos\n`);
      }
    });
    
    console.log('='.repeat(80));
    
    // Resumo final
    console.log('\n📊 RESUMO FINAL:\n');
    console.log(`   Total de produtos não-excluídos: ${naoExcluidos.toLocaleString('pt-BR')}`);
    console.log(`   Total de categorias: ${categoriaStats.size}`);
    console.log(`   Total de produtos ativos (todos): ${naoExcluidos.filter(p => p.ativo === true).length}\n`);
    
    console.log('💡 CONCLUSÃO:\n');
    console.log('   A interface da Mercos pode estar mostrando:');
    console.log('   1. Uma categoria específica filtrada');
    console.log('   2. Produtos de um fornecedor específico');
    console.log('   3. Produtos com algum campo específico preenchido\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

contarAtivosPorCategoria().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
