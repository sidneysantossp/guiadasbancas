#!/usr/bin/env node

/**
 * Script para recategorizar produtos específicos:
 * - Balão: Acessórios → Outros
 * - Bala: Bomboniere → Doces e Chocolates
 * - Amendoim: Bomboniere → Snacks e Salgadinhos
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n🔧 RECATEGORIZANDO BALÃO, BALA E AMENDOIM\n');

  // 1. Buscar categorias
  console.log('📂 Buscando categorias...');
  const { data: categorias, error: catError } = await supabase
    .from('categories')
    .select('id, name');

  if (catError || !categorias) {
    console.error('❌ Erro ao buscar categorias');
    return;
  }

  const catDoces = categorias.find(c => c.name.toLowerCase().includes('doces e chocolates'));
  const catSnacks = categorias.find(c => c.name.toLowerCase().includes('snacks'));
  const catOutros = categorias.find(c => c.name.toLowerCase() === 'outros');

  if (!catDoces || !catSnacks || !catOutros) {
    console.error('❌ Categorias necessárias não encontradas');
    console.log('Disponíveis:', categorias.map(c => c.name).join(', '));
    return;
  }

  console.log(`✅ Doces e Chocolates: ${catDoces.id}`);
  console.log(`✅ Snacks e Salgadinhos: ${catSnacks.id}`);
  console.log(`✅ Outros: ${catOutros.id}`);

  let totalAtualizados = 0;

  // 2. BALÃO: mover para Outros
  console.log('\n🎈 Recategorizando BALÕES...');
  const { data: baloes, error: balaoError } = await supabase
    .from('products')
    .select('id, name, category_id, categories(name)')
    .ilike('name', '%BALÃO%')
    .eq('active', true);

  if (balaoError) {
    console.error('❌ Erro ao buscar balões:', balaoError.message);
  } else if (baloes && baloes.length > 0) {
    console.log(`   Encontrados ${baloes.length} produtos com BALÃO`);
    
    for (const produto of baloes) {
      if (produto.category_id !== catOutros.id) {
        const catAtual = produto.categories?.name || 'Sem Categoria';
        console.log(`   ${produto.name.slice(0, 60)} | ${catAtual} → Outros`);
        
        const { error } = await supabase
          .from('products')
          .update({ 
            category_id: catOutros.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', produto.id);

        if (!error) totalAtualizados++;
      }
    }
  }

  // 3. BALA: mover para Doces e Chocolates
  console.log('\n🍬 Recategorizando BALAS...');
  const { data: balas, error: balaError } = await supabase
    .from('products')
    .select('id, name, category_id, categories(name)')
    .or('name.ilike.%BALA%,name.ilike.%CHICLETE%,name.ilike.%GOMA DE MASCAR%')
    .eq('active', true);

  if (balaError) {
    console.error('❌ Erro ao buscar balas:', balaError.message);
  } else if (balas && balas.length > 0) {
    console.log(`   Encontrados ${balas.length} produtos de bala/chiclete`);
    
    for (const produto of balas) {
      if (produto.category_id !== catDoces.id) {
        const catAtual = produto.categories?.name || 'Sem Categoria';
        console.log(`   ${produto.name.slice(0, 60)} | ${catAtual} → Doces`);
        
        const { error } = await supabase
          .from('products')
          .update({ 
            category_id: catDoces.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', produto.id);

        if (!error) totalAtualizados++;
      }
    }
  }

  // 4. AMENDOIM: mover para Snacks
  console.log('\n🥜 Recategorizando AMENDOIM...');
  const { data: amendoins, error: amendoimError } = await supabase
    .from('products')
    .select('id, name, category_id, categories(name)')
    .ilike('name', '%AMENDOIM%')
    .eq('active', true);

  if (amendoimError) {
    console.error('❌ Erro ao buscar amendoim:', amendoimError.message);
  } else if (amendoins && amendoins.length > 0) {
    console.log(`   Encontrados ${amendoins.length} produtos com AMENDOIM`);
    
    for (const produto of amendoins) {
      if (produto.category_id !== catSnacks.id) {
        const catAtual = produto.categories?.name || 'Sem Categoria';
        console.log(`   ${produto.name.slice(0, 60)} | ${catAtual} → Snacks`);
        
        const { error } = await supabase
          .from('products')
          .update({ 
            category_id: catSnacks.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', produto.id);

        if (!error) totalAtualizados++;
      }
    }
  }

  console.log(`\n✅ Recategorização concluída!`);
  console.log(`   Total de produtos atualizados: ${totalAtualizados}\n`);
}

main().catch(console.error);
