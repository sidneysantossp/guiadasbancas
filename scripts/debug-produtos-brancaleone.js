const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugProdutos() {
  console.log('🔍 DEBUG - ESTRUTURA DOS PRODUTOS BRANCALEONE\n');
  
  // Buscar Brancaleone
  const { data: brancaleone } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%brancaleone%')
    .single();

  console.log(`📦 Distribuidor: ${brancaleone.nome}\n`);

  const apiUrl = brancaleone.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': brancaleone.application_token,
    'CompanyToken': brancaleone.company_token,
    'Content-Type': 'application/json'
  };

  try {
    // Buscar apenas 5 produtos para análise
    console.log('🔍 Buscando primeiros 5 produtos da API...\n');
    const response = await fetch(`${apiUrl}/produtos?limit=5`, { headers });
    
    if (!response.ok) {
      console.error(`❌ Erro: ${response.status}`);
      return;
    }

    const produtos = await response.json();
    
    console.log('📊 ESTRUTURA DO PRIMEIRO PRODUTO:\n');
    console.log(JSON.stringify(produtos[0], null, 2));
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📋 CAMPOS IMPORTANTES DE CADA PRODUTO:\n');
    
    produtos.forEach((p, i) => {
      console.log(`Produto ${i + 1}:`);
      console.log(`  ID: ${p.id}`);
      console.log(`  Código: ${p.codigo || 'N/A'}`);
      console.log(`  Nome: ${p.nome || 'N/A'}`);
      console.log(`  Ativo: ${p.ativo}`);
      console.log(`  Excluido: ${p.excluido}`);
      console.log(`  Status: ${p.status || 'N/A'}`);
      console.log('');
    });

    // Agora buscar TODOS e contar com filtro correto
    console.log('='.repeat(80));
    console.log('\n🔍 Buscando TODOS os produtos...\n');
    
    let total = 0;
    let ativos = 0;
    let inativos = 0;
    let excluidos = 0;
    let afterId = null;
    
    for (let i = 0; i < 200; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const resp = await fetch(url, { headers });
      if (!resp.ok) break;

      const batch = await resp.json();
      if (!batch || batch.length === 0) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }

      for (const p of batch) {
        total++;
        if (p.excluido === true || p.excluido === 1) {
          excluidos++;
        } else if (p.ativo === true || p.ativo === 1) {
          ativos++;
        } else {
          inativos++;
        }
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Lote ${i + 1}: ${total} produtos, ${ativos} ativos...`);
      }

      if (batch.length < 200) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }
      
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n📊 RESULTADO FINAL:\n');
    console.log(`   ✅ Ativos: ${ativos}`);
    console.log(`   ❌ Inativos: ${inativos}`);
    console.log(`   🗑️  Excluídos: ${excluidos}`);
    console.log(`   📦 Total: ${total}\n`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

debugProdutos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
