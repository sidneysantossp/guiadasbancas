const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarExcluido() {
  console.log('\n🔍 VERIFICANDO CAMPO "excluido" PÓS-SINCRONIZAÇÃO\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    // Buscar um produto para ver se o campo excluido existe
    const { data: produtos, error } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, ativo, excluido, active')
      .eq('distribuidor_id', dist.id)
      .limit(10);
    
    if (error) {
      if (error.message.includes('column') && error.message.includes('excluido')) {
        console.log('❌ CAMPO "excluido" NÃO EXISTE NA TABELA!\n');
        console.log('   O campo precisa ser adicionado à tabela products.\n');
        console.log('='.repeat(80) + '\n');
        console.log('📝 EXECUTE NO SUPABASE SQL EDITOR:\n');
        console.log('ALTER TABLE products ADD COLUMN excluido BOOLEAN DEFAULT FALSE;\n');
        console.log('CREATE INDEX idx_products_excluido ON products(excluido);\n');
        return;
      }
      console.error('❌ Erro:', error.message);
      return;
    }
    
    console.log('✅ Campo "excluido" existe!\n');
    console.log('📋 PRIMEIROS 10 PRODUTOS:\n');
    
    produtos.forEach((p, i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${p.codigo_mercos || 'SEM CÓD'} - ${p.name?.substring(0, 40)}`);
      console.log(`       ativo: ${p.ativo} | excluido: ${p.excluido} | active: ${p.active}\n`);
    });
    
    console.log('='.repeat(80) + '\n');
    
    // Contar por status
    const { count: comExcluido } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('excluido', true);
    
    const { count: semExcluido } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('excluido', false);
    
    const { count: ativosNaoExcluidos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('excluido', false);
    
    console.log('📊 CONTAGEM POR STATUS:\n');
    console.log(`   Excluídos (excluido=true): ${(comExcluido || 0).toLocaleString('pt-BR')}`);
    console.log(`   Não excluídos (excluido=false): ${(semExcluido || 0).toLocaleString('pt-BR')}`);
    console.log(`   Ativos não excluídos (ativo=true, excluido=false): ${(ativosNaoExcluidos || 0).toLocaleString('pt-BR')}\n`);
    
    if (ativosNaoExcluidos && ativosNaoExcluidos >= 3400 && ativosNaoExcluidos <= 3500) {
      console.log('   ✅ NÚMERO DE ATIVOS NÃO EXCLUÍDOS BATE COM O ESPERADO!\n');
      console.log('   O campo "active" precisa ser recalculado para refletir isto.\n');
    } else {
      console.log(`   ⚠️  Esperado: 3.439 | Diferença: ${Math.abs(3439 - (ativosNaoExcluidos || 0))}\n`);
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarExcluido().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
