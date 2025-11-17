const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function limparDuplicatas() {
  console.log('🧹 LIMPEZA DE DUPLICATAS - BAMBINO\n');
  
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

  // Buscar TODOS os produtos da Bambino
  const { data: todosProdutos, error } = await supabase
    .from('products')
    .select('id, mercos_id, name, active, created_at, updated_at')
    .eq('distribuidor_id', bambino.id)
    .order('mercos_id')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    return;
  }

  console.log(`📊 Total de produtos no banco: ${todosProdutos.length}`);

  // Agrupar por mercos_id
  const porMercosId = new Map();
  
  todosProdutos.forEach(produto => {
    if (!porMercosId.has(produto.mercos_id)) {
      porMercosId.set(produto.mercos_id, []);
    }
    porMercosId.get(produto.mercos_id).push(produto);
  });

  console.log(`🔢 Mercos IDs únicos: ${porMercosId.size}`);

  // Identificar duplicatas
  const duplicatas = [];
  const manter = [];
  
  porMercosId.forEach((produtos, mercosId) => {
    if (produtos.length > 1) {
      // Tem duplicatas! Ordenar por data de atualização (mais recente primeiro)
      const ordenados = produtos.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at);
        const dateB = new Date(b.updated_at || b.created_at);
        return dateB - dateA;
      });
      
      // Primeiro da lista é o mais recente - manter
      manter.push(ordenados[0]);
      
      // Resto são duplicatas - deletar
      for (let i = 1; i < ordenados.length; i++) {
        duplicatas.push(ordenados[i]);
      }
    } else {
      // Produto único - manter
      manter.push(produtos[0]);
    }
  });

  console.log(`✅ Produtos únicos a manter: ${manter.length}`);
  console.log(`🗑️  Duplicatas a deletar: ${duplicatas.length}\n`);

  if (duplicatas.length === 0) {
    console.log('✨ Não há duplicatas para limpar!');
    return;
  }

  // Mostrar exemplos de duplicatas
  console.log('📋 EXEMPLOS DE DUPLICATAS A DELETAR:');
  duplicatas.slice(0, 5).forEach((dup, i) => {
    console.log(`   ${i + 1}. ${dup.name}`);
    console.log(`      Mercos ID: ${dup.mercos_id}`);
    console.log(`      Criado em: ${new Date(dup.created_at).toLocaleString('pt-BR')}`);
    console.log('');
  });

  // Perguntar confirmação (via argumento --confirm)
  const confirmar = process.argv.includes('--confirm');
  
  if (!confirmar) {
    console.log('⚠️  MODO DE SIMULAÇÃO (DRY RUN)');
    console.log('⚠️  Nenhuma alteração foi feita no banco de dados.');
    console.log('\n💡 Para executar a limpeza de verdade, rode:');
    console.log('   node scripts/limpar-duplicatas-bambino.js --confirm\n');
    
    // Estatísticas por status
    const duplicatasAtivas = duplicatas.filter(d => d.active).length;
    const duplicatasInativas = duplicatas.filter(d => !d.active).length;
    
    console.log('📊 ESTATÍSTICAS DAS DUPLICATAS:');
    console.log(`   Ativas: ${duplicatasAtivas}`);
    console.log(`   Inativas: ${duplicatasInativas}`);
    
    return;
  }

  // CONFIRMADO - Deletar duplicatas
  console.log('\n🚀 INICIANDO LIMPEZA...\n');
  
  const idsParaDeletar = duplicatas.map(d => d.id);
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
  console.log(`   🗑️  ${deletados} duplicatas removidas`);
  console.log(`   ✅ ${manter.length} produtos únicos mantidos`);

  // Atualizar campo total_produtos do distribuidor
  const { error: updateError } = await supabase
    .from('distribuidores')
    .update({ total_produtos: manter.length })
    .eq('id', bambino.id);

  if (!updateError) {
    console.log(`   📊 Campo total_produtos atualizado: ${manter.length}`);
  }

  // Verificar resultado final
  const { count: novoTotal } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id);

  const { count: totalAtivos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true);

  console.log('\n📊 RESULTADO FINAL:');
  console.log(`   Total de produtos: ${novoTotal}`);
  console.log(`   Produtos ativos: ${totalAtivos}`);
  console.log(`   Produtos inativos: ${novoTotal - totalAtivos}`);
}

limparDuplicatas().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
