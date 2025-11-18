#!/usr/bin/env node

/**
 * Script para investigar por que apenas 2 produtos de bebidas aparecem na banca
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Códigos dos produtos de bebidas
const CODIGOS_BEBIDAS = [
  '1220', '1219', '1158', '1159', '1225', '1224', '1157', '1001',
  '1283', '1230', '18152', '19321', '18266', '18267', '1236', '1280',
  '1165', '1228', '1218', '1155', '1156', '1235'
];

async function main() {
  console.log('\n🔍 INVESTIGANDO PRODUTOS DE BEBIDAS NA BANCA\n');

  // 1. Buscar categoria Bebidas
  const { data: categorias } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', 'bebidas')
    .neq('name', 'Bebidas Alcoólicas')
    .limit(1);

  if (!categorias || categorias.length === 0) {
    console.error('❌ Categoria Bebidas não encontrada');
    return;
  }

  const categoriaBebidas = categorias[0];
  console.log(`✅ Categoria: ${categoriaBebidas.name} (ID: ${categoriaBebidas.id})`);

  // 2. Buscar todos os produtos de bebidas
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id, active, distribuidor_id')
    .in('codigo_mercos', CODIGOS_BEBIDAS);

  if (error) {
    console.error('❌ Erro ao buscar produtos:', error.message);
    return;
  }

  console.log(`📦 Total de produtos de bebidas: ${produtos.length}\n`);

  // 3. Buscar distribuidores
  const distIds = [...new Set(produtos.map(p => p.distribuidor_id).filter(Boolean))];
  const { data: distribuidores } = await supabase
    .from('distribuidores')
    .select('id, nome')
    .in('id', distIds);

  const distMap = new Map();
  if (distribuidores) {
    distribuidores.forEach(d => distMap.set(d.id, d.nome));
  }

  // 4. Analisar produtos por distribuidor
  const porDistribuidor = {};
  
  for (const produto of produtos) {
    const distNome = distMap.get(produto.distribuidor_id) || 'Sem Distribuidor';
    if (!porDistribuidor[distNome]) {
      porDistribuidor[distNome] = {
        ativos: 0,
        inativos: 0,
        total: 0
      };
    }
    
    porDistribuidor[distNome].total++;
    if (produto.active) porDistribuidor[distNome].ativos++;
    else porDistribuidor[distNome].inativos++;
  }

  console.log('📊 PRODUTOS POR DISTRIBUIDOR:\n');
  for (const [dist, stats] of Object.entries(porDistribuidor)) {
    console.log(`${dist}:`);
    console.log(`   Total: ${stats.total}`);
    console.log(`   Ativos: ${stats.ativos} | Inativos: ${stats.inativos}`);
    console.log('');
  }

  // 5. Listar produtos detalhadamente
  console.log('\n📋 DETALHES DOS PRODUTOS:\n');
  
  const produtosOrdenados = produtos.sort((a, b) => {
    const distA = distMap.get(a.distribuidor_id) || '';
    const distB = distMap.get(b.distribuidor_id) || '';
    return distA.localeCompare(distB);
  });

  for (const produto of produtosOrdenados) {
    const dist = distMap.get(produto.distribuidor_id) || 'Sem Dist';
    const status = [];
    if (!produto.active) status.push('INATIVO');
    if (produto.category_id !== categoriaBebidas.id) status.push('CATEGORIA ERRADA');
    
    const statusStr = status.length > 0 ? ` ⚠️  [${status.join(', ')}]` : ' ✅';
    
    console.log(`[${produto.codigo_mercos}] ${produto.name.slice(0, 50).padEnd(50)} | ${dist}${statusStr}`);
  }

  // 6. Resumo de problemas
  const ativos = produtos.filter(p => p.active);
  const inativos = produtos.filter(p => !p.active);
  
  console.log('\n\n📊 RESUMO:');
  console.log(`   Total de produtos: ${produtos.length}`);
  console.log(`   Ativos: ${ativos.length} ✅`);
  console.log(`   Inativos: ${inativos.length} ⚠️`);
  console.log(`\n   ⚠️  Apenas produtos ATIVOS aparecem na página da banca!`);
  
  if (inativos.length > 0) {
    console.log(`\n   💡 ${inativos.length} produtos precisam ser ativados para aparecer na banca\n`);
  } else {
    console.log(`\n   🎉 Todos os produtos estão ativos!\n`);
  }
}

main().catch(console.error);
