const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarProdutos() {
  console.log('🔍 BUSCANDO PRODUTOS DA BAMBINO PARA COMPARAR\n');
  
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

  // Buscar 10 produtos ATIVOS da Bambino
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name, mercos_id, codigo_mercos, images')
    .eq('distribuidor_id', bambino.id)
    .eq('active', true)
    .order('name')
    .limit(10);

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    return;
  }

  if (!produtos || produtos.length === 0) {
    console.log('❌ Nenhum produto encontrado');
    return;
  }

  console.log(`✅ Encontrados ${produtos.length} produtos ativos\n`);
  console.log('=' .repeat(80));
  console.log('\n📋 PRODUTOS DA BAMBINO PARA COMPARAR NA MERCOS:\n');

  produtos.forEach((p, i) => {
    console.log(`${i + 1}. NOME: ${p.name}`);
    console.log(`   🔢 MERCOS ID: ${p.mercos_id}`);
    console.log(`   📦 CÓDIGO MERCOS (nosso banco): ${p.codigo_mercos || '❌ VAZIO'}`);
    console.log(`   🖼️  IMAGENS (nosso banco): ${(p.images || []).length}`);
    console.log('');
  });

  console.log('=' .repeat(80));
  console.log('\n💡 INSTRUÇÕES PARA COMPARAR NA MERCOS:\n');
  console.log('1. Acesse a conta Bambino na plataforma Mercos');
  console.log('2. Vá em "Produtos"');
  console.log('3. Busque por um dos MERCOS IDs acima (ex: ' + produtos[0].mercos_id + ')');
  console.log('4. Verifique se o produto tem:');
  console.log('   - ✅ Campo "Código" preenchido');
  console.log('   - 🖼️  Imagens cadastradas');
  console.log('5. Anote quantos produtos TÊM código e quantos NÃO TÊM\n');

  // Estatísticas
  const comImagem = produtos.filter(p => (p.images || []).length > 0).length;
  const semImagem = produtos.length - comImagem;

  console.log('📊 ESTATÍSTICAS DESTES 10 PRODUTOS:');
  console.log(`   🖼️  Com imagem no nosso banco: ${comImagem}`);
  console.log(`   ❌ Sem imagem no nosso banco: ${semImagem}`);
  console.log(`   📦 Com codigo_mercos: 0 (todos vazios)`);
}

buscarProdutos().then(() => process.exit(0));
