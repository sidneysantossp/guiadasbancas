#!/usr/bin/env node

/**
 * Script para testar a API de produtos da banca diretamente
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BANCA_ID = 'f96f1115-ece6-46d8-a948-20424a80ece0';
const DISTRIBUIDORES_PUBLICOS = [
  '3a989c56-bbd3-4769-b076-a83483e39542', // Bambino
  '1511df09-1f4a-4e68-9f8c-05cd06be6269'  // Brancaleone
];

async function main() {
  console.log('\n🔍 TESTANDO API DE PRODUTOS DA BANCA\n');
  console.log(`Banca ID: ${BANCA_ID}\n`);

  // 1. Buscar produtos dos distribuidores públicos
  console.log('📦 Buscando produtos dos distribuidores públicos (Bambino + Brancaleone)...\n');
  
  const { data: produtosPublicos, error: pubError } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, distribuidor_id, active, category_id, categories(name)')
    .eq('active', true)
    .in('distribuidor_id', DISTRIBUIDORES_PUBLICOS)
    .order('name', { ascending: true });

  if (pubError) {
    console.error('❌ Erro ao buscar produtos públicos:', pubError.message);
    return;
  }

  console.log(`✅ Total de produtos públicos encontrados: ${produtosPublicos.length}\n`);

  // Contar por distribuidor
  const bambino = produtosPublicos.filter(p => p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[0]);
  const brancaleone = produtosPublicos.filter(p => p.distribuidor_id === DISTRIBUIDORES_PUBLICOS[1]);
  
  console.log(`   Bambino: ${bambino.length} produtos`);
  console.log(`   Brancaleone: ${brancaleone.length} produtos\n`);

  // 2. Buscar categoria Bebidas
  const { data: catBebidas } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', 'bebidas')
    .neq('name', 'Bebidas Alcoólicas')
    .limit(1);

  if (catBebidas && catBebidas.length > 0) {
    const bebidas = produtosPublicos.filter(p => p.category_id === catBebidas[0].id);
    console.log(`🥤 Produtos na categoria Bebidas: ${bebidas.length}`);
    
    if (bebidas.length > 0) {
      console.log('\n   Primeiros 10 produtos de bebidas:');
      bebidas.slice(0, 10).forEach(p => {
        console.log(`   - [${p.codigo_mercos}] ${p.name.slice(0, 50)}`);
      });
    }
  }

  // 3. Buscar customizações desta banca
  console.log('\n\n🔧 Buscando customizações da banca...\n');
  
  const productIds = produtosPublicos.map(p => p.id);
  const { data: customizacoes, error: customError } = await supabase
    .from('banca_produtos_distribuidor')
    .select('product_id, enabled, custom_price, custom_stock_enabled, custom_stock_qty')
    .eq('banca_id', BANCA_ID)
    .in('product_id', productIds);

  if (customError) {
    console.error('❌ Erro ao buscar customizações:', customError.message);
  } else {
    console.log(`📋 Customizações encontradas: ${customizacoes?.length || 0}`);
    
    if (customizacoes && customizacoes.length > 0) {
      const desabilitados = customizacoes.filter(c => c.enabled === false);
      const comEstoqueProprio = customizacoes.filter(c => c.custom_stock_enabled === true);
      const semEstoque = comEstoqueProprio.filter(c => (c.custom_stock_qty || 0) === 0);
      
      console.log(`   - Habilitados: ${customizacoes.length - desabilitados.length}`);
      console.log(`   - Desabilitados: ${desabilitados.length} ⚠️`);
      console.log(`   - Com estoque próprio: ${comEstoqueProprio.length}`);
      console.log(`   - Com estoque próprio ZERADO: ${semEstoque.length} ⚠️`);
      
      if (desabilitados.length > 0) {
        console.log('\n   ⚠️  Produtos DESABILITADOS:');
        for (const custom of desabilitados.slice(0, 10)) {
          const prod = produtosPublicos.find(p => p.id === custom.product_id);
          if (prod) {
            console.log(`   - [${prod.codigo_mercos}] ${prod.name.slice(0, 50)}`);
          }
        }
      }
      
      if (semEstoque.length > 0) {
        console.log('\n   ⚠️  Produtos com estoque próprio ZERADO:');
        for (const custom of semEstoque.slice(0, 10)) {
          const prod = produtosPublicos.find(p => p.id === custom.product_id);
          if (prod) {
            console.log(`   - [${prod.codigo_mercos}] ${prod.name.slice(0, 50)}`);
          }
        }
      }
    }
  }

  // 4. Simular filtro da API
  console.log('\n\n🎯 SIMULANDO FILTRO DA API:\n');
  
  let produtosFiltrados = produtosPublicos;
  
  if (customizacoes && customizacoes.length > 0) {
    const customMap = new Map(customizacoes.map(c => [c.product_id, c]));
    
    produtosFiltrados = produtosPublicos.filter(produto => {
      const custom = customMap.get(produto.id);
      
      // Se tem customização e está desabilitado, não mostrar
      if (custom && custom.enabled === false) return false;
      
      // Se NÃO tem customização, SEMPRE mostrar
      if (!custom) return true;
      
      // Se TEM customização com estoque próprio: verificar se qty > 0
      if (custom.custom_stock_enabled) {
        return (custom.custom_stock_qty || 0) > 0;
      }
      
      return true;
    });
  }
  
  console.log(`   Produtos que DEVERIAM aparecer: ${produtosFiltrados.length}`);
  
  const bebidasFiltradas = produtosFiltrados.filter(p => p.category_id === catBebidas[0].id);
  console.log(`   Bebidas que DEVERIAM aparecer: ${bebidasFiltradas.length}\n`);
  
  if (bebidasFiltradas.length > 0) {
    console.log('   Bebidas que devem aparecer:');
    bebidasFiltradas.forEach(p => {
      console.log(`   - [${p.codigo_mercos}] ${p.name.slice(0, 50)}`);
    });
  }
  
  console.log('');
}

main().catch(console.error);
