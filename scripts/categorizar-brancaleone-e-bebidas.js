#!/usr/bin/env node

/**
 * Script para:
 * 1. Categorizar todos os produtos da Brancaleone como "HQs e Comics"
 * 2. Categorizar produtos específicos de bebidas como "Bebidas"
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Códigos dos produtos de bebidas que devem ser categorizados como "Bebidas"
const CODIGOS_BEBIDAS = [
  '1220', '1219', '1158', '1159', '1225', '1224', '1157', '1001',
  '1283', '1230', '18152', '19321', '18266', '18267', '1236', '1280',
  '1165', '1228', '1218', '1155', '1156', '1235'
];

async function main() {
  console.log('\n🔧 CATEGORIZANDO PRODUTOS DA BRANCALEONE E BEBIDAS\n');

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

  // 2. Buscar categorias
  console.log('\n📂 Buscando categorias...');
  const { data: categorias, error: catError } = await supabase
    .from('categories')
    .select('id, name');

  if (catError || !categorias) {
    console.error('❌ Erro ao buscar categorias');
    return;
  }

  const categoriaHQs = categorias.find(c => c.name.toLowerCase().includes('hqs e comics'));
  const categoriaBebidas = categorias.find(c => c.name.toLowerCase() === 'bebidas');

  if (!categoriaHQs || !categoriaBebidas) {
    console.error('❌ Categorias não encontradas');
    return;
  }

  console.log(`✅ HQs e Comics: ${categoriaHQs.name} (ID: ${categoriaHQs.id})`);
  console.log(`✅ Bebidas: ${categoriaBebidas.name} (ID: ${categoriaBebidas.id})`);

  // 3. PASSO 1: Categorizar todos os produtos da Brancaleone como HQs e Comics
  console.log('\n🎨 PASSO 1: Categorizando Brancaleone como HQs e Comics...');
  const { data: produtosBrancaleone, error: prodError } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id')
    .eq('distribuidor_id', brancaleone.id)
    .eq('active', true);

  if (prodError) {
    console.error('❌ Erro ao buscar produtos:', prodError.message);
    return;
  }

  console.log(`✅ ${produtosBrancaleone.length} produtos da Brancaleone encontrados`);

  const produtosParaAtualizarHQs = produtosBrancaleone.filter(p => p.category_id !== categoriaHQs.id);
  console.log(`📝 ${produtosParaAtualizarHQs.length} produtos serão atualizados para HQs e Comics`);

  let sucessoHQs = 0;
  let errosHQs = 0;

  const BATCH_SIZE = 50;
  for (let i = 0; i < produtosParaAtualizarHQs.length; i += BATCH_SIZE) {
    const batch = produtosParaAtualizarHQs.slice(i, i + BATCH_SIZE);
    
    for (const produto of batch) {
      const { error } = await supabase
        .from('products')
        .update({ 
          category_id: categoriaHQs.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', produto.id);

      if (error) {
        console.error(`❌ Erro ao atualizar ${produto.name}:`, error.message);
        errosHQs++;
      } else {
        sucessoHQs++;
      }
    }
    
    console.log(`Progresso HQs: ${Math.min(i + BATCH_SIZE, produtosParaAtualizarHQs.length)}/${produtosParaAtualizarHQs.length}`);
  }

  console.log(`✅ Passo 1 concluído: ${sucessoHQs} produtos em HQs e Comics`);

  // 4. PASSO 2: Categorizar produtos específicos como Bebidas
  console.log('\n🥤 PASSO 2: Categorizando produtos de Bebidas...');
  
  const { data: produtosBebidas, error: bebidasError } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id')
    .in('codigo_mercos', CODIGOS_BEBIDAS)
    .eq('active', true);

  if (bebidasError) {
    console.error('❌ Erro ao buscar produtos de bebidas:', bebidasError.message);
    return;
  }

  console.log(`✅ ${produtosBebidas.length} produtos de bebidas encontrados`);
  
  if (produtosBebidas.length > 0) {
    console.log('\nProdutos que serão categorizados como Bebidas:');
    produtosBebidas.forEach(p => {
      console.log(`   [${p.codigo_mercos}] ${p.name}`);
    });
  }

  const produtosParaAtualizarBebidas = produtosBebidas.filter(p => p.category_id !== categoriaBebidas.id);
  console.log(`\n📝 ${produtosParaAtualizarBebidas.length} produtos serão atualizados para Bebidas`);

  let sucessoBebidas = 0;
  let errosBebidas = 0;

  for (const produto of produtosParaAtualizarBebidas) {
    const { error } = await supabase
      .from('products')
      .update({ 
        category_id: categoriaBebidas.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', produto.id);

    if (error) {
      console.error(`❌ Erro ao atualizar ${produto.name}:`, error.message);
      errosBebidas++;
    } else {
      sucessoBebidas++;
    }
  }

  console.log(`✅ Passo 2 concluído: ${sucessoBebidas} produtos em Bebidas`);

  // 5. Resumo final
  console.log(`\n📊 RESUMO FINAL:`);
  console.log(`   Brancaleone → HQs e Comics: ${sucessoHQs} atualizados`);
  console.log(`   Produtos específicos → Bebidas: ${sucessoBebidas} atualizados`);
  console.log(`   Erros: ${errosHQs + errosBebidas}`);
  console.log(`\n🎉 Categorização concluída!\n`);
}

main().catch(console.error);
