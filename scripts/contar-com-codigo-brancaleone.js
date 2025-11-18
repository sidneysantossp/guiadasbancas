const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarComCodigo() {
  console.log('🔍 CONTAGEM DE PRODUTOS COM CÓDIGO - BRANCALEONE\n');
  
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
  let comCodigo = 0;
  let comCodigoAtivos = 0;
  let comCodigoInativos = 0;
  let semCodigo = 0;
  let excluidos = 0;
  let afterId = null;

  try {
    console.log('🔍 Analisando produtos...\n');
    
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
          // Produto não excluído
          if (p.codigo && p.codigo.trim() !== '') {
            comCodigo++;
            if (p.ativo === true || p.ativo === 1) {
              comCodigoAtivos++;
            } else {
              comCodigoInativos++;
            }
          } else {
            semCodigo++;
          }
        }
      }
      
      if ((i + 1) % 20 === 0) {
        console.log(`   Lote ${i + 1}: ${totalBuscados} total, ${comCodigo} com código (${comCodigoAtivos} ativos)...`);
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
  console.log(`   📦 Produtos COM CÓDIGO (não excluídos): ${comCodigo}`);
  console.log(`      ├─ ✅ Ativos: ${comCodigoAtivos}`);
  console.log(`      └─ ❌ Inativos: ${comCodigoInativos}`);
  console.log(`   📦 Produtos SEM CÓDIGO (não excluídos): ${semCodigo}`);
  console.log(`   🗑️  Excluídos: ${excluidos}`);
  console.log(`   📦 Total buscado: ${totalBuscados}\n`);

  console.log('='.repeat(80));
  console.log('\n🎯 COMPARAÇÃO COM A INTERFACE MERCOS:\n');
  console.log(`   Interface Mercos: 3.439 produtos cadastrados`);
  console.log(`   API - Com Código: ${comCodigo.toLocaleString('pt-BR')} produtos\n`);
  
  if (comCodigo > 3400 && comCodigo < 3500) {
    console.log('✅ BINGO! A interface mostra apenas produtos COM CÓDIGO!\n');
    console.log(`   Diferença: ${Math.abs(comCodigo - 3439)} produtos\n`);
  } else if (comCodigoAtivos === 3439) {
    console.log('✅ BINGO! A interface mostra apenas produtos COM CÓDIGO E ATIVOS!\n');
  } else {
    console.log(`⚠️  Diferença: ${Math.abs(comCodigo - 3439)} produtos\n`);
  }

  console.log('='.repeat(80));
  console.log('\n📊 RESUMO DETALHADO:\n');
  console.log(`   Total de produtos na API: ${totalBuscados.toLocaleString('pt-BR')}`);
  console.log(`   └─ Cadastrados (não excluídos): ${(comCodigo + semCodigo).toLocaleString('pt-BR')}`);
  console.log(`      ├─ COM código: ${comCodigo.toLocaleString('pt-BR')} (${comCodigoAtivos} ativos + ${comCodigoInativos} inativos)`);
  console.log(`      └─ SEM código: ${semCodigo.toLocaleString('pt-BR')}`);
  console.log(`   └─ Excluídos: ${excluidos.toLocaleString('pt-BR')}\n`);

  console.log('='.repeat(80));
}

contarComCodigo().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
