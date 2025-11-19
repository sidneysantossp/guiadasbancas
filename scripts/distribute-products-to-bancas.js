const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function distributeProducts() {
  try {
    console.log('🔄 Distribuindo produtos entre bancas...\n');

    // Buscar bancas ativas
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, name')
      .eq('active', true);

    if (bancasError || !bancas || bancas.length === 0) {
      console.error('❌ Erro ao buscar bancas ou nenhuma banca ativa');
      return;
    }

    console.log(`✅ Bancas ativas encontradas: ${bancas.length}`);
    bancas.forEach((b, i) => console.log(`   ${i + 1}. ${b.name} (${b.id})`));
    console.log('');

    // Buscar produtos SEM banca_id
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, category_id')
      .is('banca_id', null)
      .eq('active', true);

    if (prodError) {
      console.error('❌ Erro ao buscar produtos:', prodError.message);
      return;
    }

    if (!products || products.length === 0) {
      console.log('✅ Todos os produtos já estão associados a bancas!');
      return;
    }

    console.log(`📦 Produtos sem banca encontrados: ${products.length}\n`);

    // Distribuir de forma round-robin (alternada)
    let updated = 0;
    let errors = 0;

    console.log('🔄 Atualizando produtos...\n');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const bancaIndex = i % bancas.length; // Distribui alternadamente
      const banca = bancas[bancaIndex];

      const { error: updateError } = await supabase
        .from('products')
        .update({ banca_id: banca.id })
        .eq('id', product.id);

      if (updateError) {
        console.error(`   ❌ Erro ao atualizar ${product.name}: ${updateError.message}`);
        errors++;
      } else {
        updated++;
        if (updated % 100 === 0) {
          console.log(`   ✅ ${updated} produtos atualizados...`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ CONCLUÍDO!`);
    console.log(`   Total atualizado: ${updated}`);
    console.log(`   Erros: ${errors}`);
    console.log(`   Distribuição: ~${Math.ceil(updated / bancas.length)} produtos por banca\n`);

    // Verificar distribuição final
    console.log('📊 Verificando distribuição final...\n');

    for (const banca of bancas) {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('banca_id', banca.id)
        .eq('active', true);

      console.log(`   ${banca.name}: ${count || 0} produtos`);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Perguntar confirmação
console.log('⚠️  ATENÇÃO: Este script vai distribuir TODOS os produtos sem banca_id entre as bancas ativas.');
console.log('   Isso é IRREVERSÍVEL sem backup do banco de dados!\n');
console.log('Digite "SIM" para continuar ou qualquer outra tecla para cancelar:\n');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('', (answer) => {
  if (answer.trim().toUpperCase() === 'SIM') {
    distributeProducts().then(() => {
      readline.close();
      process.exit(0);
    });
  } else {
    console.log('\n❌ Operação cancelada.');
    readline.close();
    process.exit(0);
  }
});
