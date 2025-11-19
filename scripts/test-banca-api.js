const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBancaAPI() {
  try {
    console.log('🧪 Testando busca de bancas...\n');

    // Pegar uma banca ativa qualquer
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, name')
      .eq('active', true)
      .limit(3);

    if (bancasError || !bancas || bancas.length === 0) {
      console.error('❌ Erro ao buscar bancas:', bancasError?.message);
      return;
    }

    console.log(`✅ Bancas encontradas no Supabase: ${bancas.length}\n`);

    // Testar API para cada banca
    for (const banca of bancas) {
      console.log(`\n📍 Testando banca: ${banca.name}`);
      console.log(`   ID: ${banca.id}`);

      // Simular chamada da API
      const { data: bancaData, error } = await supabase
        .from('bancas')
        .select('*')
        .eq('id', banca.id)
        .single();

      if (error || !bancaData) {
        console.log(`   ❌ Erro ao buscar: ${error?.message}`);
      } else {
        console.log(`   ✅ Nome: ${bancaData.name}`);
        console.log(`   ✅ Avatar: ${bancaData.avatar ? 'Sim' : 'Não'}`);
        console.log(`   ✅ Ativo: ${bancaData.active ? 'Sim' : 'Não'}`);
        
        // Contar produtos dessa banca
        const { count } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('banca_id', banca.id)
          .eq('active', true);

        console.log(`   ✅ Produtos: ${count || 0}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Teste concluído!');
    console.log('\nPROXIMO PASSO:');
    console.log('1. Deploy em andamento (2-3 min)');
    console.log('2. Limpe o cache: Ctrl + Shift + R');
    console.log('3. Acesse qualquer produto');
    console.log('4. Veja o nome REAL da banca!\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testBancaAPI();
