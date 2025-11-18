const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function sincronizarPorCategorias() {
  console.log('\n🔄 SINCRONIZAÇÃO POR CATEGORIAS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    const apiUrl = dist.base_url || 'https://app.mercos.com/api/v1';
    const headers = {
      'ApplicationToken': dist.application_token,
      'CompanyToken': dist.company_token,
      'Content-Type': 'application/json'
    };
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // PASSO 1: Buscar todas as categorias
    console.log('📁 PASSO 1: Buscando categorias...\n');
    
    const respCat = await fetch(`${apiUrl}/categorias?limit=200`, { headers });
    const categorias = await respCat.json();
    
    console.log(`   ✅ ${categorias.length} categorias encontradas\n`);
    console.log('='.repeat(80) + '\n');
    
    // PASSO 2: Buscar produtos de cada categoria
    console.log('📦 PASSO 2: Buscando produtos por categoria...\n');
    
    let produtosUnicosTotal = new Set();
    let produtosAtivos = new Set();
    
    for (let i = 0; i < Math.min(categorias.length, 50); i++) {
      const cat = categorias[i];
      
      try {
        const url = `${apiUrl}/produtos?categoria_id=${cat.id}&limit=200`;
        const response = await fetch(url, { headers });
        
        if (!response.ok) continue;
        
        const produtos = await response.json();
        const antes = produtosUnicosTotal.size;
        
        produtos.forEach(p => {
          produtosUnicosTotal.add(p.id);
          if (p.ativo && !p.excluido) {
            produtosAtivos.add(p.id);
          }
        });
        
        const novos = produtosUnicosTotal.size - antes;
        
        if (novos > 0) {
          console.log(`   ${(i + 1).toString().padStart(2)}. ${cat.nome?.substring(0, 40).padEnd(40)} | ${produtos.length} prods | +${novos} novos | Total: ${produtosUnicosTotal.size}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        // Continuar silenciosamente
      }
    }
    
    console.log('\n' + '='.repeat(80) + '\n');
    console.log('📊 RESULTADO DA BUSCA POR CATEGORIAS:\n');
    console.log(`   Total de produtos únicos: ${produtosUnicosTotal.size}`);
    console.log(`   Produtos ativos: ${produtosAtivos.size}\n`);
    
    // Comparar com banco
    const { count: noBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    const { count: ativosNoBanco } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log('📦 COMPARAÇÃO COM O BANCO:\n');
    console.log(`   No banco (total): ${noBanco}`);
    console.log(`   No banco (ativos): ${ativosNoBanco}`);
    console.log(`   Pela API (ativos): ${produtosAtivos.size}`);
    console.log(`   Diferença ativos: ${produtosAtivos.size - ativosNoBanco}\n`);
    
    if (produtosAtivos.size >= 3400 && produtosAtivos.size <= 3500) {
      console.log('   ✅ SUCESSO! O número de ativos bate com o esperado (3.439)!\n');
      console.log('   Agora preciso sincronizar esses produtos para o banco.\n');
    } else if (produtosAtivos.size > ativosNoBanco) {
      console.log(`   ⚠️  HÁ ${produtosAtivos.size - ativosNoBanco} PRODUTOS ATIVOS QUE FALTAM!\n`);
      console.log('   Vou sincronizar esses produtos...\n');
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

sincronizarPorCategorias().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
