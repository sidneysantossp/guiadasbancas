// Script para verificar produtos com codigo_mercos
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkCodigoMercos() {
  console.log('🔍 Verificando produtos com codigo_mercos...\n');
  
  // Contar produtos COM codigo_mercos
  const { count: comCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');
  
  // Contar produtos SEM codigo_mercos
  const { count: semCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null)
    .or('codigo_mercos.is.null,codigo_mercos.eq.');
  
  // Total de produtos de distribuidores
  const { count: total } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('distribuidor_id', 'is', null);
  
  console.log('📊 RESULTADO:');
  console.log(`   Total de produtos: ${total}`);
  console.log(`   COM codigo_mercos: ${comCodigo} (${((comCodigo/total)*100).toFixed(1)}%)`);
  console.log(`   SEM codigo_mercos: ${semCodigo} (${((semCodigo/total)*100).toFixed(1)}%)`);
  console.log('');
  
  // Buscar alguns exemplos COM codigo_mercos
  const { data: exemplos } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, mercos_id')
    .not('distribuidor_id', 'is', null)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '')
    .limit(10);
  
  if (exemplos && exemplos.length > 0) {
    console.log('📝 EXEMPLOS DE PRODUTOS COM CÓDIGO:');
    exemplos.forEach(p => {
      console.log(`   ${p.codigo_mercos} - ${p.name.substring(0, 50)}`);
    });
    console.log('');
  }
  
  // Buscar alguns exemplos SEM codigo_mercos
  const { data: semCodigoExemplos } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, mercos_id')
    .not('distribuidor_id', 'is', null)
    .or('codigo_mercos.is.null,codigo_mercos.eq.')
    .limit(5);
  
  if (semCodigoExemplos && semCodigoExemplos.length > 0) {
    console.log('⚠️  EXEMPLOS DE PRODUTOS SEM CÓDIGO:');
    semCodigoExemplos.forEach(p => {
      console.log(`   mercos_id: ${p.mercos_id} - ${p.name.substring(0, 50)}`);
    });
    console.log('');
  }
  
  if (semCodigo > 0) {
    console.log('⚠️  ATENÇÃO:');
    console.log(`   ${semCodigo} produtos NÃO TÊM codigo_mercos preenchido!`);
    console.log('   Esses produtos NÃO PODEM ser vinculados por nome de arquivo.');
    console.log('   Solução: Preencher o campo codigo_mercos na sincronização.');
  } else {
    console.log('✅ PERFEITO! Todos os produtos têm codigo_mercos preenchido!');
  }
}

checkCodigoMercos().catch(console.error);
