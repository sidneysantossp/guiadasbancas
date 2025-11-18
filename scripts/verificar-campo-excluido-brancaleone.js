const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarCampoExcluido() {
  console.log('\n🔍 VERIFICANDO CAMPO "excluido" - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    // Buscar alguns produtos para ver os valores
    const { data: produtos, error: prodError } = await supabase
      .from('products')
      .select('id, name, codigo_mercos, ativo, excluido, active, stock_qty')
      .eq('distribuidor_id', dist.id)
      .limit(20);
    
    if (prodError) {
      console.error('❌ Erro ao buscar produtos:', prodError.message);
      return;
    }
    
    if (!produtos || produtos.length === 0) {
      console.log('❌ Nenhum produto encontrado\n');
      return;
    }
    
    console.log('📋 PRIMEIROS 20 PRODUTOS:\n');
    
    let comExcluidoTrue = 0;
    let comExcluidoFalse = 0;
    let comExcluidoNull = 0;
    
    produtos.forEach((p, i) => {
      if (i < 10) {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${p.codigo_mercos || 'SEM'} - ${p.name?.substring(0, 40)}`);
        console.log(`       ativo: ${p.ativo} | excluido: ${p.excluido} | active: ${p.active}\n`);
      }
      
      if (p.excluido === true) comExcluidoTrue++;
      else if (p.excluido === false) comExcluidoFalse++;
      else comExcluidoNull++;
    });
    
    console.log('='.repeat(80) + '\n');
    console.log('📊 ANÁLISE DO CAMPO "excluido" (amostra de 20):\n');
    console.log(`   excluido = true: ${comExcluidoTrue}`);
    console.log(`   excluido = false: ${comExcluidoFalse}`);
    console.log(`   excluido = null/undefined: ${comExcluidoNull}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Contar no banco inteiro
    const { count: totalTrue } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('excluido', true);
    
    const { count: totalFalse } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('excluido', false);
    
    const { count: totalNull } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .is('excluido', null);
    
    const { count: totalGeral } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    console.log('📊 CONTAGEM TOTAL NO BANCO:\n');
    console.log(`   excluido = true: ${(totalTrue || 0).toLocaleString('pt-BR')}`);
    console.log(`   excluido = false: ${(totalFalse || 0).toLocaleString('pt-BR')}`);
    console.log(`   excluido IS NULL: ${(totalNull || 0).toLocaleString('pt-BR')}`);
    console.log(`   Total geral: ${(totalGeral || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Se a maioria é NULL, vamos considerar NULL como "não excluído"
    if (totalNull > 0 && totalNull > totalTrue) {
      console.log('💡 CONCLUSÃO:\n');
      console.log(`   O campo "excluido" está como NULL na maioria dos produtos.`);
      console.log(`   Vamos considerar NULL como "não excluído".\n`);
      
      const { count: ativosNaoExcluidosNullable } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', dist.id)
        .eq('ativo', true)
        .or('excluido.is.null,excluido.eq.false');
      
      console.log(`   Produtos com ativo=true e (excluido=false OU excluido IS NULL):`);
      console.log(`   ${(ativosNaoExcluidosNullable || 0).toLocaleString('pt-BR')} produtos\n`);
      
      if (ativosNaoExcluidosNullable >= 3400 && ativosNaoExcluidosNullable <= 3500) {
        console.log(`   ✅ ISSO BATE COM OS 3.439 ESPERADOS!\n`);
      }
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarCampoExcluido().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
