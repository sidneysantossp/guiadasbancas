const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMarkupGlobal() {
  console.log('🔍 Verificando markup global dos distribuidores...\n');

  const { data: distribuidores, error } = await supabase
    .from('distribuidores')
    .select('id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo')
    .order('nome');

  if (error) {
    console.error('❌ Erro:', error);
    return;
  }

  console.log(`📊 Total de distribuidores: ${distribuidores.length}\n`);

  distribuidores.forEach(d => {
    console.log(`\n🏢 ${d.nome}`);
    console.log(`   ID: ${d.id}`);
    console.log(`   Tipo de cálculo: ${d.tipo_calculo || 'markup'}`);
    
    if (d.tipo_calculo === 'margem') {
      console.log(`   Margem: ${d.margem_percentual || 0}%`);
      console.log(`   Divisor: ${d.margem_divisor || 1}`);
    } else {
      console.log(`   Markup percentual: ${d.markup_global_percentual || 0}%`);
      console.log(`   Markup fixo: R$ ${d.markup_global_fixo || 0}`);
    }

    // Calcular exemplo
    const precoBase = 100;
    let precoFinal = precoBase;

    if (d.tipo_calculo === 'margem' && d.margem_divisor > 0 && d.margem_divisor < 1) {
      precoFinal = precoBase / d.margem_divisor;
    } else {
      const perc = d.markup_global_percentual || 0;
      const fixo = d.markup_global_fixo || 0;
      precoFinal = precoBase * (1 + perc / 100) + fixo;
    }

    console.log(`   📈 Exemplo: R$ ${precoBase.toFixed(2)} → R$ ${precoFinal.toFixed(2)}`);
  });

  console.log('\n✅ Verificação concluída!');
}

checkMarkupGlobal().catch(console.error);
