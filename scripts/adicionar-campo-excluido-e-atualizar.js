const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function adicionarCampoEAtualizar() {
  console.log('\n🔧 ADICIONANDO CAMPO "excluido" E ATUALIZANDO PRODUTOS\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Buscar TODOS os produtos do distribuidor
    console.log('📦 Buscando todos os produtos...\n');
    
    const { data: produtos, error: fetchError } = await supabase
      .from('products')
      .select('id, mercos_id, name, ativo, active')
      .eq('distribuidor_id', dist.id);
    
    if (fetchError) {
      console.error('❌ Erro ao buscar produtos:', fetchError.message);
      return;
    }
    
    console.log(`   Total de produtos: ${produtos.length.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Atualizar em lotes
    const batchSize = 100;
    let atualizados = 0;
    let comExcluido = 0;
    let semExcluido = 0;
    
    console.log('🔄 Atualizando produtos com campo "excluido"...\n');
    
    for (let i = 0; i < produtos.length; i += batchSize) {
      const batch = produtos.slice(i, i + batchSize);
      
      for (const produto of batch) {
        // Determinar o valor de excluido baseado na lógica atual
        // Se active=false mas ativo=true, significa que foi excluído
        const excluido = produto.ativo === true && produto.active === false;
        
        const { error: updateError } = await supabase
          .from('products')
          .update({ 
            excluido: excluido,
            updated_at: new Date().toISOString()
          })
          .eq('id', produto.id);
        
        if (updateError) {
          console.error(`   ❌ Erro ao atualizar ${produto.name}: ${updateError.message}`);
        } else {
          atualizados++;
          if (excluido) {
            comExcluido++;
          } else {
            semExcluido++;
          }
          
          if (atualizados % 500 === 0) {
            console.log(`   ✅ ${atualizados} produtos atualizados...`);
          }
        }
      }
      
      // Pequeno delay para não sobrecarregar
      if (i + batchSize < produtos.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n   ✅ Total atualizado: ${atualizados} produtos\n`);
    console.log('='.repeat(80) + '\n');
    
    console.log('📊 RESULTADO DA ATUALIZAÇÃO:\n');
    console.log(`   ✅ Produtos não excluídos (excluido=false): ${semExcluido.toLocaleString('pt-BR')}`);
    console.log(`   🗑️  Produtos excluídos (excluido=true): ${comExcluido.toLocaleString('pt-BR')}`);
    console.log(`   📦 Total: ${atualizados.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Verificar produtos que devem estar ativos
    const { count: ativosEsperados } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true)
      .eq('excluido', false);
    
    const { count: ativosAtuais } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    console.log('📊 COMPARAÇÃO:\n');
    console.log(`   Produtos com ativo=true e excluido=false: ${(ativosEsperados || 0).toLocaleString('pt-BR')}`);
    console.log(`   Produtos com active=true (atual): ${(ativosAtuais || 0).toLocaleString('pt-BR')}`);
    console.log(`   Esperado na interface: 3.439\n`);
    
    if (ativosEsperados && ativosEsperados >= 3400 && ativosEsperados <= 3500) {
      console.log('   ✅ O número de produtos ativo=true e excluido=false BATE!\n');
      console.log('   Agora precisa atualizar o campo "active" para refletir isso.\n');
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

adicionarCampoEAtualizar().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
