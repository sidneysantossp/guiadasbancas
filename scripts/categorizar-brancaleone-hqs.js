#!/usr/bin/env node

/**
 * Script para categorizar todos os produtos da Brancaleone como "HQs e Comics"
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n🔧 CATEGORIZANDO PRODUTOS DA BRANCALEONE\n');

  // 1. Buscar distribuidor Brancaleone
  console.log('📦 Buscando distribuidor Brancaleone...');
  const { data: distribuidores, error: distError } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .ilike('nome', '%brancaleone%');

  if (distError || !distribuidores || distribuidores.length === 0) {
    console.error('❌ Distribuidor Brancaleone não encontrado');
    return;
  }

  const brancaleone = distribuidores[0];
  console.log(`✅ Encontrado: ${brancaleone.nome} (ID: ${brancaleone.id})`);

  // 2. Buscar categoria "HQs e Comics"
  console.log('\n📂 Buscando categoria "HQs e Comics"...');
  const { data: categorias, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', '%HQs e Comics%');

  if (catError || !categorias || categorias.length === 0) {
    console.error('❌ Categoria "HQs e Comics" não encontrada');
    return;
  }

  const categoria = categorias[0];
  console.log(`✅ Encontrada: ${categoria.name} (ID: ${categoria.id})`);

  // 3. Buscar produtos da Brancaleone
  console.log('\n🔍 Buscando produtos da Brancaleone...');
  const { data: produtos, error: prodError } = await supabase
    .from('products')
    .select('id, name, category_id, categories(name)')
    .eq('distribuidor_id', brancaleone.id)
    .eq('active', true);

  if (prodError) {
    console.error('❌ Erro ao buscar produtos:', prodError.message);
    return;
  }

  console.log(`✅ ${produtos.length} produtos encontrados`);

  // 4. Filtrar apenas produtos que precisam ser atualizados
  const produtosParaAtualizar = produtos.filter(p => p.category_id !== categoria.id);
  
  if (produtosParaAtualizar.length === 0) {
    console.log('\n✅ Todos os produtos já estão na categoria "HQs e Comics"!');
    return;
  }

  console.log(`\n📝 ${produtosParaAtualizar.length} produtos serão atualizados`);
  console.log('\nPrimeiros 10 produtos:');
  produtosParaAtualizar.slice(0, 10).forEach(p => {
    const currentCat = p.categories?.name || 'Sem Categoria';
    console.log(`   ${p.name.slice(0, 50).padEnd(50)} | ${currentCat} → HQs e Comics`);
  });

  // 5. Atualizar produtos
  console.log('\n🚀 Atualizando produtos...\n');
  
  let sucesso = 0;
  let erros = 0;
  
  const BATCH_SIZE = 50;
  for (let i = 0; i < produtosParaAtualizar.length; i += BATCH_SIZE) {
    const batch = produtosParaAtualizar.slice(i, i + BATCH_SIZE);
    
    for (const produto of batch) {
      const { error } = await supabase
        .from('products')
        .update({ 
          category_id: categoria.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', produto.id);

      if (error) {
        console.error(`❌ Erro ao atualizar ${produto.name}:`, error.message);
        erros++;
      } else {
        sucesso++;
      }
    }
    
    console.log(`Progresso: ${Math.min(i + BATCH_SIZE, produtosParaAtualizar.length)}/${produtosParaAtualizar.length}`);
  }

  console.log(`\n✅ Concluído!`);
  console.log(`   Atualizados: ${sucesso}`);
  console.log(`   Erros: ${erros}`);
  console.log(`   Já estavam corretos: ${produtos.length - produtosParaAtualizar.length}`);
  console.log(`\n🎉 Todos os produtos da Brancaleone agora estão em "HQs e Comics"!\n`);
}

main().catch(console.error);
