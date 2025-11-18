const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarPorCategoria() {
  console.log('🔍 VERIFICANDO FILTRO POR CATEGORIA - BRANCALEONE\n');
  
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
    console.log('🔍 Coletando produtos para análise...\n');
    
    let produtos = [];
    let afterId = null;
    
    for (let i = 0; i < 50; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      produtos.push(...batch);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Coletado: ${produtos.length} produtos...`);
      }
      
      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log(`\n📊 Total coletado: ${produtos.length} produtos\n`);
    console.log('='.repeat(80));
    
    const naoExcluidos = produtos.filter(p => !p.excluido);
    
    // Analisar campo categoria_id
    const comCategoria = naoExcluidos.filter(p => p.categoria_id && p.categoria_id !== null && p.categoria_id !== 0);
    const semCategoria = naoExcluidos.filter(p => !p.categoria_id || p.categoria_id === null || p.categoria_id === 0);
    
    console.log('\n📊 ANÁLISE POR CATEGORIA:\n');
    console.log(`   Não excluídos total:     ${naoExcluidos.length}`);
    console.log(`   COM categoria_id:        ${comCategoria.length}`);
    console.log(`   SEM categoria_id:        ${semCategoria.length}\n`);
    
    // Projeção
    const projecao = Math.round((comCategoria.length / naoExcluidos.length) * 95400);
    
    console.log('📊 PROJEÇÃO PARA 95.400 PRODUTOS:\n');
    console.log(`   Produtos COM categoria: ~${projecao.toLocaleString('pt-BR')}\n`);
    
    const diff = Math.abs(projecao - 3439);
    
    if (diff < 100) {
      console.log(`🎉 BINGO! A interface filtra produtos COM categoria!\n`);
      console.log(`   Diferença: ${diff} produtos\n`);
    } else if (diff < 500) {
      console.log(`✅ BOA APROXIMAÇÃO! Produtos com categoria: ~${projecao}\n`);
      console.log(`   Diferença: ${diff} produtos\n`);
    } else {
      console.log(`⚠️  Não é por categoria. Diferença muito grande: ${diff} produtos\n`);
    }
    
    console.log('='.repeat(80));
    
    // Mostrar categorias únicas
    const categorias = new Map();
    comCategoria.forEach(p => {
      categorias.set(p.categoria_id, (categorias.get(p.categoria_id) || 0) + 1);
    });
    
    console.log(`\n📊 TOTAL DE CATEGORIAS ÚNICAS: ${categorias.size}\n`);
    
    const topCategorias = Array.from(categorias.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    console.log('🏆 TOP 10 CATEGORIAS MAIS USADAS:\n');
    topCategorias.forEach(([catId, count], i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. Categoria ${catId}: ${count} produtos`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Exemplos de produtos COM categoria
    console.log('\n📋 EXEMPLOS DE PRODUTOS COM CATEGORIA:\n');
    comCategoria.slice(0, 5).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.codigo} - ${p.nome?.substring(0, 40)}`);
      console.log(`      categoria_id: ${p.categoria_id} | ativo: ${p.ativo}\n`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

verificarPorCategoria().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
