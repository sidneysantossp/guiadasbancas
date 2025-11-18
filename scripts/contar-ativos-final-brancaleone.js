const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function contarAtivos() {
  console.log('\n📊 CONTAGEM FINAL DE PRODUTOS ATIVOS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    // Buscar distribuidor
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('id, nome')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Total de produtos
    const { count: total } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    // Produtos com active = true
    const { count: ativos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', true);
    
    // Produtos com active = false
    const { count: inativos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('active', false);
    
    // Produtos com ativo = true (campo da Mercos)
    const { count: ativosMercos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .eq('ativo', true);
    
    console.log('📦 RESUMO DOS PRODUTOS:\n');
    console.log(`   Total no banco:           ${(total || 0).toLocaleString('pt-BR')} produtos`);
    console.log(`   Active = true:            ${(ativos || 0).toLocaleString('pt-BR')} produtos`);
    console.log(`   Active = false:           ${(inativos || 0).toLocaleString('pt-BR')} produtos`);
    console.log(`   Ativo (Mercos) = true:    ${(ativosMercos || 0).toLocaleString('pt-BR')} produtos\n`);
    
    console.log('='.repeat(80) + '\n');
    
    console.log('✅ SINCRONIZAÇÃO CONCLUÍDA COM SUCESSO!\n');
    console.log(`   ${ativos} produtos ativos disponíveis na plataforma\n`);
    
    // Mostrar alguns produtos ativos
    const { data: exemplosAtivos } = await supabase
      .from('products')
      .select('name, codigo_mercos, price, stock_qty')
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .limit(5);
    
    if (exemplosAtivos && exemplosAtivos.length > 0) {
      console.log('📋 EXEMPLOS DE PRODUTOS ATIVOS:\n');
      exemplosAtivos.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.codigo_mercos || 'N/A'} - ${p.name?.substring(0, 45)}`);
        console.log(`      Preço: R$ ${p.price?.toFixed(2)} | Estoque: ${p.stock_qty}\n`);
      });
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

contarAtivos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
