const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function limparInativos() {
  console.log('🧹 LIMPEZA DE PRODUTOS INATIVOS - BAMBINO\n');
  
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

  console.log(`📦 Distribuidor: ${bambino.nome}`);
  console.log(`🆔 ID: ${bambino.id}`);
  console.log(`📊 Total produtos (campo): ${bambino.total_produtos || 'não definido'}\n`);

  // Contar produtos ativos e inativos
  const { count: totalAtivos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true);

  const { count: totalInativos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', false);

  console.log('📊 SITUAÇÃO ATUAL:');
  console.log(`   ✅ Produtos ATIVOS: ${totalAtivos || 0}`);
  console.log(`   ❌ Produtos INATIVOS: ${totalInativos || 0}`);
  console.log(`   📦 Total: ${(totalAtivos || 0) + (totalInativos || 0)}\n`);

  if (!totalInativos || totalInativos === 0) {
    console.log('✨ Não há produtos inativos para limpar!');
    return;
  }

  // Buscar produtos inativos
  const { data: inativos, error } = await supabase
    .from('products')
    .select('id, name, mercos_id, created_at')
    .eq('distribuidor_id', bambino.id)
    .eq('active', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao buscar produtos inativos:', error);
    return;
  }

  console.log(`🗑️  ${inativos.length} produtos inativos a deletar\n`);

  // Mostrar exemplos
  console.log('📋 EXEMPLOS DE PRODUTOS INATIVOS:');
  inativos.slice(0, 10).forEach((prod, i) => {
    console.log(`   ${i + 1}. ${prod.name}`);
    console.log(`      Mercos ID: ${prod.mercos_id}`);
    console.log(`      Criado em: ${new Date(prod.created_at).toLocaleString('pt-BR')}`);
    console.log('');
  });

  // Perguntar confirmação
  const confirmar = process.argv.includes('--confirm');
  
  if (!confirmar) {
    console.log('⚠️  MODO DE SIMULAÇÃO (DRY RUN)');
    console.log('⚠️  Nenhuma alteração foi feita no banco de dados.');
    console.log('\n💡 Para executar a limpeza de verdade, rode:');
    console.log('   node scripts/limpar-inativos-bambino.js --confirm\n');
    return;
  }

  // CONFIRMADO - Deletar inativos
  console.log('\n🚀 INICIANDO LIMPEZA...\n');
  
  const idsParaDeletar = inativos.map(p => p.id);
  const batchSize = 100;
  let deletados = 0;

  for (let i = 0; i < idsParaDeletar.length; i += batchSize) {
    const batch = idsParaDeletar.slice(i, i + batchSize);
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .in('id', batch);
    
    if (deleteError) {
      console.error(`❌ Erro ao deletar batch ${Math.floor(i / batchSize) + 1}:`, deleteError);
    } else {
      deletados += batch.length;
      console.log(`✅ Deletados ${deletados}/${idsParaDeletar.length} produtos...`);
    }
  }

  console.log(`\n✨ LIMPEZA CONCLUÍDA!`);
  console.log(`   🗑️  ${deletados} produtos inativos removidos`);

  // Contar apenas produtos ativos agora
  const { count: novoTotal } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true);

  // Atualizar campo total_produtos do distribuidor
  const { error: updateError } = await supabase
    .from('distribuidores')
    .update({ total_produtos: novoTotal })
    .eq('id', bambino.id);

  if (!updateError) {
    console.log(`   📊 Campo total_produtos atualizado: ${novoTotal}`);
  }

  // Verificar resultado final
  const { count: totalFinal } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id);

  console.log('\n📊 RESULTADO FINAL:');
  console.log(`   ✅ Produtos ATIVOS: ${novoTotal}`);
  console.log(`   ❌ Produtos INATIVOS: 0`);
  console.log(`   📦 Total: ${totalFinal}`);
}

limparInativos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
