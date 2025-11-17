const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarCodigos() {
  // Primeiro, buscar o distribuidor Bambino
  const { data: bambino } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .ilike('nome', '%bambino%')
    .single();

  if (!bambino) {
    console.log('❌ Distribuidor Bambino não encontrado');
    return;
  }

  console.log(`🔍 Buscando produtos do distribuidor: ${bambino.nome}`);
  console.log(`📦 Distribuidor ID: ${bambino.id}\n`);
  
  // Buscar produtos COM codigo_mercos da Bambino
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, mercos_id, distribuidor_id')
    .eq('distribuidor_id', bambino.id)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '')
    .limit(30)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro:', error);
    return;
  }

  if (!produtos || produtos.length === 0) {
    console.log('❌ Nenhum produto da Bambino tem codigo_mercos preenchido!\n');
  } else {
    console.log(`✅ Encontrados ${produtos.length} produtos com codigo_mercos:\n`);

    // Buscar nomes dos distribuidores
    const distribuidorIds = [...new Set(produtos.map(p => p.distribuidor_id).filter(Boolean))];
    const { data: distribuidores } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .in('id', distribuidorIds);

    const distMap = new Map((distribuidores || []).map(d => [d.id, d.nome]));

    // Mostrar produtos
    produtos.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   📦 Código Mercos: ${p.codigo_mercos}`);
      console.log(`   🔢 Mercos ID: ${p.mercos_id}`);
      console.log(`   🏢 Distribuidor: ${distMap.get(p.distribuidor_id) || 'Sem distribuidor'}`);
      console.log('');
    });
  }

  // Buscar produtos SEM codigo_mercos da Bambino
  const { data: semCodigo, error: error2 } = await supabase
    .from('products')
    .select('id, name, mercos_id')
    .eq('distribuidor_id', bambino.id)
    .or('codigo_mercos.is.null,codigo_mercos.eq.')
    .limit(20);

  if (!error2 && semCodigo && semCodigo.length > 0) {
    console.log(`\n⚠️  Produtos da Bambino SEM codigo_mercos: ${semCodigo.length}`);
    console.log('\nExemplos:');
    semCodigo.slice(0, 10).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      Mercos ID: ${p.mercos_id}`);
      console.log('');
    });
  }
  
  // Contar totais
  const { count: totalComCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');
    
  const { count: totalSemCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .or('codigo_mercos.is.null,codigo_mercos.eq.');
    
  console.log('\n📊 ESTATÍSTICAS DA BAMBINO:');
  console.log(`   ✅ Produtos COM codigo_mercos: ${totalComCodigo || 0}`);
  console.log(`   ❌ Produtos SEM codigo_mercos: ${totalSemCodigo || 0}`);
  console.log(`   📦 Total de produtos: ${(totalComCodigo || 0) + (totalSemCodigo || 0)}`);
  
  if (totalComCodigo && totalSemCodigo) {
    const percentual = Math.round((totalComCodigo / (totalComCodigo + totalSemCodigo)) * 100);
    console.log(`   📈 Percentual com código: ${percentual}%`);
  }
}

buscarCodigos().then(() => process.exit(0));
