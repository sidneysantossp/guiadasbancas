const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarCodigosImagens() {
  console.log('\n📊 VERIFICANDO CÓDIGOS E IMAGENS - BRANCALEONE\n');
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
    
    // Contar produtos
    const { count: total } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id);
    
    // Contar com codigo_mercos
    const { count: comCodigo } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .not('codigo_mercos', 'is', null);
    
    // Contar com imagens
    const { count: comImagens } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', dist.id)
      .not('images', 'is', null);
    
    console.log('📦 RESUMO:\n');
    console.log(`   Total de produtos:           ${(total || 0).toLocaleString('pt-BR')}`);
    console.log(`   Com codigo_mercos:           ${(comCodigo || 0).toLocaleString('pt-BR')}`);
    console.log(`   Com imagens:                 ${(comImagens || 0).toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Buscar exemplos
    const { data: exemplos } = await supabase
      .from('products')
      .select('name, codigo_mercos, images, price, active')
      .eq('distribuidor_id', dist.id)
      .eq('active', true)
      .limit(10);
    
    if (exemplos && exemplos.length > 0) {
      console.log('📋 EXEMPLOS DE PRODUTOS ATIVOS:\n');
      exemplos.forEach((p, i) => {
        const temCodigo = p.codigo_mercos ? '✅' : '❌';
        const temImagens = p.images && p.images.length > 0 ? '✅' : '❌';
        const numImagens = p.images ? p.images.length : 0;
        
        console.log(`   ${i + 1}. ${temCodigo} Código: ${p.codigo_mercos || 'SEM CÓDIGO'}`);
        console.log(`      ${temImagens} Imagens: ${numImagens} imagem(ns)`);
        console.log(`      Nome: ${p.name?.substring(0, 50)}`);
        console.log(`      Preço: R$ ${p.price?.toFixed(2)}\n`);
      });
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarCodigosImagens().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
