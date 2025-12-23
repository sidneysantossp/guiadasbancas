const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkBancaProdutos() {
  console.log('🔍 Buscando banca "Rua Matilde Diez"...\n');

  // Buscar banca
  const { data: bancas, error: bancaError } = await supabase
    .from('bancas')
    .select('id, name, is_cotista, cotista_id, endereco')
    .ilike('endereco', '%Matilde Diez%')
    .limit(5);

  if (bancaError) {
    console.error('❌ Erro ao buscar banca:', bancaError);
    return;
  }

  if (!bancas || bancas.length === 0) {
    console.log('❌ Banca não encontrada com endereço "Matilde Diez"');
    return;
  }

  const banca = bancas[0];
  console.log(`✅ Banca encontrada: ${banca.name}`);
  console.log(`   ID: ${banca.id}`);
  console.log(`   É cotista: ${banca.is_cotista ? 'SIM ✅' : 'NÃO ❌'}`);
  console.log(`   Cotista ID: ${banca.cotista_id || 'N/A'}`);
  console.log(`   Endereço: ${banca.endereco}\n`);

  // Buscar produtos da banca
  const { data: produtosBanca, error: prodError } = await supabase
    .from('products')
    .select('id, name, price, active, banca_id')
    .eq('banca_id', banca.id)
    .eq('active', true)
    .limit(5);

  console.log(`📦 Produtos próprios da banca: ${produtosBanca?.length || 0}`);
  if (produtosBanca && produtosBanca.length > 0) {
    produtosBanca.forEach(p => {
      console.log(`   - ${p.name}: R$ ${p.price}`);
    });
  }

  // Buscar produtos de distribuidores (se for cotista)
  if (banca.is_cotista) {
    console.log('\n📦 Buscando produtos de distribuidores...');
    
    const { data: produtosDistribuidor, error: distError } = await supabase
      .from('products')
      .select('id, name, price, active, distribuidor_id, distribuidores(nome, markup_global_percentual, markup_global_fixo, tipo_calculo)')
      .not('distribuidor_id', 'is', null)
      .eq('active', true)
      .limit(5);

    if (distError) {
      console.error('❌ Erro ao buscar produtos de distribuidores:', distError);
    } else {
      console.log(`   Total encontrado: ${produtosDistribuidor?.length || 0}`);
      if (produtosDistribuidor && produtosDistribuidor.length > 0) {
        produtosDistribuidor.forEach(p => {
          const dist = p.distribuidores;
          const precoBase = p.price;
          const markup = dist?.markup_global_percentual || 0;
          const fixo = dist?.markup_global_fixo || 0;
          const precoComMarkup = precoBase * (1 + markup / 100) + fixo;
          
          console.log(`\n   📦 ${p.name}`);
          console.log(`      Distribuidor: ${dist?.nome || 'N/A'}`);
          console.log(`      Preço base: R$ ${precoBase.toFixed(2)}`);
          console.log(`      Markup: ${markup}% + R$ ${fixo}`);
          console.log(`      Preço com markup: R$ ${precoComMarkup.toFixed(2)}`);
        });
      }
    }
  } else {
    console.log('\n❌ Banca não é cotista - não tem acesso a produtos de distribuidores');
  }

  console.log('\n✅ Verificação concluída!');
}

checkBancaProdutos().catch(console.error);
