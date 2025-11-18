#!/usr/bin/env node

/**
 * Script para mover produtos com "PILHA" da categoria Bebidas para Acessórios
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\n🔧 MOVENDO PILHAS PARA ACESSÓRIOS\n');

  // 1. Buscar categoria Bebidas
  const { data: catBebidas } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', 'bebidas')
    .neq('name', 'Bebidas Alcoólicas')
    .limit(1);

  if (!catBebidas || catBebidas.length === 0) {
    console.error('❌ Categoria Bebidas não encontrada');
    return;
  }

  // 2. Buscar categoria Acessórios
  const { data: catAcessorios } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', 'acess%')
    .limit(1);

  if (!catAcessorios || catAcessorios.length === 0) {
    console.error('❌ Categoria Acessórios não encontrada');
    return;
  }

  console.log(`✅ Categoria Origem: ${catBebidas[0].name} (${catBebidas[0].id})`);
  console.log(`✅ Categoria Destino: ${catAcessorios[0].name} (${catAcessorios[0].id})\n`);

  // 3. Buscar produtos com "PILHA" na categoria Bebidas
  const { data: pilhas, error } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id')
    .eq('category_id', catBebidas[0].id)
    .ilike('name', '%pilha%');

  if (error) {
    console.error('❌ Erro ao buscar pilhas:', error.message);
    return;
  }

  if (!pilhas || pilhas.length === 0) {
    console.log('✅ Nenhuma pilha encontrada na categoria Bebidas');
    return;
  }

  console.log(`📦 Produtos com "PILHA" encontrados em Bebidas: ${pilhas.length}\n`);

  // 4. Mostrar produtos que serão movidos
  console.log('Produtos que serão movidos:\n');
  for (const produto of pilhas) {
    console.log(`   - [${produto.codigo_mercos || 'sem código'}] ${produto.name}`);
  }

  console.log('\n🔄 Movendo produtos...\n');

  // 5. Atualizar categoria
  const produtoIds = pilhas.map(p => p.id);
  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update({ category_id: catAcessorios[0].id })
    .in('id', produtoIds)
    .select();

  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError.message);
    return;
  }

  console.log(`✅ ${updated?.length || 0} produtos movidos para Acessórios!\n`);

  // 6. Verificar bebidas restantes
  const { data: bebidasRestantes } = await supabase
    .from('products')
    .select('id, name, codigo_mercos')
    .eq('category_id', catBebidas[0].id)
    .in('distribuidor_id', [
      '3a989c56-bbd3-4769-b076-a83483e39542', // Bambino
      '1511df09-1f4a-4e68-9f8c-05cd06be6269'  // Brancaleone
    ])
    .order('name', { ascending: true });

  console.log(`📊 Produtos em Bebidas após a limpeza: ${bebidasRestantes?.length || 0}\n`);

  if (bebidasRestantes && bebidasRestantes.length > 0) {
    console.log('Primeiros 20 produtos em Bebidas:\n');
    bebidasRestantes.slice(0, 20).forEach(p => {
      console.log(`   - [${p.codigo_mercos || 'sem código'}] ${p.name.slice(0, 60)}`);
    });
  }

  console.log('');
}

main().catch(console.error);
