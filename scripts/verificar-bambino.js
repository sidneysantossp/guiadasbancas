const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificar() {
  console.log('🔍 INVESTIGAÇÃO DETALHADA - BAMBINO\n');
  
  // Buscar o distribuidor Bambino
  const { data: bambino } = await supabase
    .from('distribuidores')
    .select('id, nome, total_produtos')
    .ilike('nome', '%bambino%')
    .single();

  if (!bambino) {
    console.log('❌ Distribuidor Bambino não encontrado');
    return;
  }

  console.log('📦 DISTRIBUIDOR:');
  console.log(`   Nome: ${bambino.nome}`);
  console.log(`   ID: ${bambino.id}`);
  console.log(`   Total produtos (campo): ${bambino.total_produtos || 'não definido'}`);
  console.log('');

  // Contar TODOS os produtos da Bambino
  const { count: totalTodos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id);

  console.log('📊 CONTAGEM DE PRODUTOS:');
  console.log(`   Total GERAL: ${totalTodos || 0}`);

  // Contar produtos ATIVOS
  const { count: totalAtivos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true);

  console.log(`   Total ATIVOS: ${totalAtivos || 0}`);

  // Contar produtos INATIVOS
  const { count: totalInativos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', false);

  console.log(`   Total INATIVOS: ${totalInativos || 0}`);

  // Verificar se há produtos duplicados (mesmo mercos_id)
  const { data: produtos } = await supabase
    .from('products')
    .select('mercos_id, distribuidor_id')
    .eq('distribuidor_id', bambino.id);

  const mercosIds = produtos?.map(p => p.mercos_id) || [];
  const uniqueMercosIds = new Set(mercosIds);
  const duplicados = mercosIds.length - uniqueMercosIds.size;

  console.log(`   Mercos IDs únicos: ${uniqueMercosIds.size}`);
  if (duplicados > 0) {
    console.log(`   ⚠️  Duplicados encontrados: ${duplicados}`);
  }

  // Verificar origem dos produtos
  const { data: porOrigem } = await supabase
    .from('products')
    .select('origem')
    .eq('distribuidor_id', bambino.id);

  const origens = {};
  porOrigem?.forEach(p => {
    const origem = p.origem || 'sem origem';
    origens[origem] = (origens[origem] || 0) + 1;
  });

  console.log('\n📂 PRODUTOS POR ORIGEM:');
  Object.entries(origens).forEach(([origem, count]) => {
    console.log(`   ${origem}: ${count}`);
  });

  // Buscar produtos com e sem codigo_mercos
  const { count: comCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');

  const { count: semCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .or('codigo_mercos.is.null,codigo_mercos.eq.');

  console.log('\n📋 CÓDIGO MERCOS:');
  console.log(`   COM código: ${comCodigo || 0}`);
  console.log(`   SEM código: ${semCodigo || 0}`);

  // Verificar últimos produtos criados
  const { data: ultimos } = await supabase
    .from('products')
    .select('name, mercos_id, active, created_at')
    .eq('distribuidor_id', bambino.id)
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('\n🕐 ÚLTIMOS 5 PRODUTOS CRIADOS:');
  ultimos?.forEach((p, i) => {
    const data = new Date(p.created_at).toLocaleString('pt-BR');
    console.log(`   ${i + 1}. ${p.name}`);
    console.log(`      Mercos ID: ${p.mercos_id}`);
    console.log(`      Ativo: ${p.active ? 'Sim' : 'Não'}`);
    console.log(`      Criado em: ${data}`);
    console.log('');
  });

  // Verificar se há produtos de outros distribuidores
  console.log('\n🔎 VERIFICAÇÃO DE INTEGRIDADE:');
  const { data: todosDistribuidores } = await supabase
    .from('distribuidores')
    .select('id, nome');

  for (const dist of todosDistribuidores || []) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    if (count && count > 0) {
      console.log(`   ${dist.nome}: ${count} produtos`);
    }
  }

  // Verificar se o número correto é 933
  console.log('\n🎯 NÚMERO ESPERADO: 933');
  console.log(`   Diferença: ${Math.abs((totalTodos || 0) - 933)}`);
}

verificar().then(() => process.exit(0));
