const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarCodigo() {
  const codigo = process.argv[2] || 'AALCA029';
  
  console.log(`🔍 BUSCANDO CÓDIGO "${codigo}" NO BANCO DE DADOS\n`);
  
  // Buscar em todos os produtos (qualquer distribuidor)
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name, mercos_id, codigo_mercos, distribuidor_id, active, images')
    .or(`codigo_mercos.ilike.%${codigo}%,name.ilike.%${codigo}%`)
    .order('name');

  if (error) {
    console.error('❌ Erro ao buscar:', error);
    return;
  }

  if (!produtos || produtos.length === 0) {
    console.log(`❌ Nenhum produto encontrado com código "${codigo}"\n`);
    
    // Tentar buscar sem case sensitive
    const { data: todosProdutos } = await supabase
      .from('products')
      .select('codigo_mercos')
      .not('codigo_mercos', 'is', null)
      .neq('codigo_mercos', '')
      .limit(100);
    
    console.log('📋 EXEMPLOS DE CÓDIGOS EXISTENTES NO BANCO:');
    todosProdutos?.slice(0, 20).forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.codigo_mercos}`);
    });
    
    return;
  }

  console.log(`✅ ENCONTRADOS ${produtos.length} PRODUTO(S):\n`);
  console.log('=' .repeat(80));

  // Buscar nomes dos distribuidores
  const distribuidorIds = [...new Set(produtos.map(p => p.distribuidor_id).filter(Boolean))];
  const { data: distribuidores } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .in('id', distribuidorIds);

  const distMap = new Map((distribuidores || []).map(d => [d.id, d.nome]));

  produtos.forEach((p, i) => {
    console.log(`\n${i + 1}. PRODUTO: ${p.name}`);
    console.log(`   🔢 Mercos ID: ${p.mercos_id}`);
    console.log(`   📦 Código Mercos: ${p.codigo_mercos || '❌ VAZIO'}`);
    console.log(`   🏢 Distribuidor: ${distMap.get(p.distribuidor_id) || 'Sem distribuidor'}`);
    console.log(`   ✅ Ativo: ${p.active ? 'Sim' : 'Não'}`);
    console.log(`   🖼️  Imagens: ${(p.images || []).length}`);
    
    if (p.images && p.images.length > 0) {
      console.log(`   📸 URLs das imagens:`);
      p.images.forEach((img, idx) => {
        console.log(`      ${idx + 1}. ${img}`);
      });
    }
  });

  console.log('\n' + '=' .repeat(80));
}

buscarCodigo().then(() => process.exit(0));
