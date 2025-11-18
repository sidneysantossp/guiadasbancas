const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarCadastrados() {
  console.log('🔍 CONTAGEM DE PRODUTOS CADASTRADOS - BRANCALEONE\n');
  console.log('   (Cadastrados = não excluídos, podem estar ativos ou inativos)\n');
  
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

  let totalBuscados = 0;
  let cadastrados = 0; // não excluídos
  let ativos = 0;
  let inativos = 0;
  let excluidos = 0;
  let afterId = null;

  try {
    console.log('🔍 Buscando produtos da API Mercos...\n');
    
    for (let i = 0; i < 200; i++) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`❌ Erro: ${response.status}`);
        break;
      }

      const batch = await response.json();
      
      if (!batch || batch.length === 0) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }

      for (const p of batch) {
        totalBuscados++;
        
        if (p.excluido === true || p.excluido === 1) {
          excluidos++;
        } else {
          // Não excluído = "cadastrado" na interface Mercos
          cadastrados++;
          
          if (p.ativo === true || p.ativo === 1) {
            ativos++;
          } else {
            inativos++;
          }
        }
      }
      
      if ((i + 1) % 20 === 0) {
        console.log(`   Lote ${i + 1}: ${totalBuscados} total, ${cadastrados} cadastrados (${ativos} ativos + ${inativos} inativos)...`);
      }

      if (batch.length < 200) {
        console.log(`   ✅ Fim dos produtos (lote ${i + 1})\n`);
        break;
      }
      
      afterId = batch[batch.length - 1].id;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 RESULTADO FINAL:\n');
  console.log(`   📦 CADASTRADOS (não excluídos): ${cadastrados}`);
  console.log(`      ├─ ✅ Ativos: ${ativos}`);
  console.log(`      └─ ❌ Inativos: ${inativos}`);
  console.log(`   🗑️  Excluídos: ${excluidos}`);
  console.log(`   📦 Total buscado: ${totalBuscados}\n`);

  console.log('='.repeat(80));
  console.log('\n🎯 COMPARAÇÃO COM A INTERFACE MERCOS:\n');
  console.log(`   Interface Mercos: 3.439 produtos cadastrados`);
  console.log(`   API Mercos:       ${cadastrados.toLocaleString('pt-BR')} produtos cadastrados\n`);
  
  if (cadastrados > 3439 * 0.95 && cadastrados < 3439 * 1.05) {
    console.log('✅ NÚMEROS BATEM! (~5% de margem)\n');
  } else if (cadastrados === 3439) {
    console.log('✅ NÚMEROS BATEM EXATAMENTE!\n');
  } else if (cadastrados < 3439) {
    console.log(`⚠️  API tem ${3439 - cadastrados} produtos A MENOS que a interface\n`);
  } else {
    console.log(`⚠️  API tem ${cadastrados - 3439} produtos A MAIS que a interface\n`);
  }

  console.log('='.repeat(80));
}

contarCadastrados().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
