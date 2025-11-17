const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarCodigos() {
  console.log('🔍 VERIFICAÇÃO DE CÓDIGOS - BAMBINO\n');
  
  // Buscar o distribuidor Bambino
  const { data: bambino } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .ilike('nome', '%bambino%')
    .single();

  if (!bambino) {
    console.log('❌ Distribuidor Bambino não encontrado');
    return;
  }

  console.log(`📦 Distribuidor: ${bambino.nome}`);
  console.log(`🆔 ID: ${bambino.id}\n`);

  // Contar produtos ativos
  const { count: totalAtivos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true);

  // Contar produtos COM codigo_mercos
  const { count: comCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');

  // Contar produtos SEM codigo_mercos
  const { count: semCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .or('codigo_mercos.is.null,codigo_mercos.eq.');

  // Contar apenas ativos COM código
  const { count: ativosComCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');

  // Contar apenas ativos SEM código
  const { count: ativosSemCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true)
    .or('codigo_mercos.is.null,codigo_mercos.eq.');

  console.log('📊 ESTATÍSTICAS GERAIS:');
  console.log(`   📦 Total produtos ativos: ${totalAtivos || 0}`);
  console.log(`   ✅ Com codigo_mercos: ${comCodigo || 0}`);
  console.log(`   ❌ Sem codigo_mercos: ${semCodigo || 0}`);
  console.log('');

  console.log('📊 ESTATÍSTICAS (APENAS ATIVOS):');
  console.log(`   ✅ Ativos COM codigo_mercos: ${ativosComCodigo || 0}`);
  console.log(`   ❌ Ativos SEM codigo_mercos: ${ativosSemCodigo || 0}`);
  
  if (ativosComCodigo && totalAtivos) {
    const percentual = Math.round((ativosComCodigo / totalAtivos) * 100);
    console.log(`   📈 Percentual com código: ${percentual}%`);
  }
  console.log('');

  // Buscar exemplos de produtos COM código
  const { data: exemplosCom } = await supabase
    .from('products')
    .select('id, name, mercos_id, codigo_mercos, active')
    .eq('distribuidor_id', bambino.id)
    .eq('active', true)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '')
    .limit(10);

  if (exemplosCom && exemplosCom.length > 0) {
    console.log('✅ EXEMPLOS DE PRODUTOS COM CÓDIGO:');
    exemplosCom.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      Código: ${p.codigo_mercos}`);
      console.log(`      Mercos ID: ${p.mercos_id}`);
      console.log('');
    });
  }

  // Buscar exemplos de produtos SEM código
  const { data: exemplosSem } = await supabase
    .from('products')
    .select('id, name, mercos_id, codigo_mercos, active')
    .eq('distribuidor_id', bambino.id)
    .eq('active', true)
    .or('codigo_mercos.is.null,codigo_mercos.eq.')
    .limit(10);

  if (exemplosSem && exemplosSem.length > 0) {
    console.log('❌ EXEMPLOS DE PRODUTOS SEM CÓDIGO:');
    exemplosSem.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
      console.log(`      Código: ${p.codigo_mercos || 'VAZIO'}`);
      console.log(`      Mercos ID: ${p.mercos_id}`);
      console.log('');
    });
  }

  // Verificar data da última sincronização
  const { data: ultimaSync } = await supabase
    .from('products')
    .select('sincronizado_em')
    .eq('distribuidor_id', bambino.id)
    .order('sincronizado_em', { ascending: false })
    .limit(1)
    .single();

  if (ultimaSync?.sincronizado_em) {
    const data = new Date(ultimaSync.sincronizado_em);
    console.log(`🕐 ÚLTIMA SINCRONIZAÇÃO: ${data.toLocaleString('pt-BR')}`);
  }

  console.log('\n' + '='.repeat(80));
  
  if (ativosComCodigo === 0) {
    console.log('\n⚠️  ATENÇÃO: Nenhum produto ativo tem codigo_mercos!');
    console.log('💡 SOLUÇÃO: Fazer uma nova sincronização para popular os códigos.');
  } else if (ativosComCodigo === totalAtivos) {
    console.log('\n✅ PERFEITO: Todos os produtos ativos têm codigo_mercos preenchido!');
  } else {
    console.log(`\n⚠️  PARCIAL: ${ativosComCodigo} de ${totalAtivos} produtos têm código.`);
    console.log('💡 SOLUÇÃO: Alguns produtos podem não ter código na API Mercos.');
  }
}

verificarCodigos().then(() => process.exit(0));
