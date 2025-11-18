#!/usr/bin/env node

/**
 * Script para remover produtos incorretos da categoria Bebidas
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Palavras-chave que DEVEM estar em Bebidas
const PALAVRAS_BEBIDAS = [
  'água', 'agua', 'energético', 'energetico', 'refrigerante', 
  'suco', 'chá', 'cha', 'café', 'cafe', 'isotônico', 'isotonico',
  'coca', 'pepsi', 'fanta', 'sprite', 'guaraná', 'guarana',
  'monster', 'red bull', 'redbull', 'sukita', 'antarctica',
  'crystal', 'guaraviton', 'limonada', 'h2o', 'h2oh'
];

// Produtos que NÃO são bebidas (mover para outras categorias)
const CATEGORIAS_DESTINO = {
  'chicle': 'Doces e Chocolates',
  'goma': 'Doces e Chocolates',
  'fita': 'Acessórios',
  'guarda chuva': 'Acessórios',
  'sombrinha': 'Acessórios',
  'palheiro': 'Outros',
  'piteira': 'Acessórios',
  'sacola': 'Acessórios',
  'isqueiro': 'Acessórios',
  'acendedor': 'Acessórios'
};

async function main() {
  console.log('\n🧹 LIMPANDO CATEGORIA BEBIDAS\n');

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

  // 2. Buscar TODOS os produtos em Bebidas
  const { data: produtos } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id')
    .eq('category_id', catBebidas[0].id)
    .eq('active', true)
    .order('name', { ascending: true });

  console.log(`📦 Total de produtos em Bebidas: ${produtos?.length || 0}\n`);

  if (!produtos || produtos.length === 0) {
    console.log('Nenhum produto encontrado');
    return;
  }

  // 3. Separar produtos corretos e incorretos
  const corretos = [];
  const incorretos = [];

  for (const produto of produtos) {
    const nomeLower = produto.name.toLowerCase();
    
    // Verificar se tem alguma palavra-chave de bebida
    const ehBebida = PALAVRAS_BEBIDAS.some(palavra => 
      nomeLower.includes(palavra.toLowerCase())
    );

    if (ehBebida) {
      corretos.push(produto);
    } else {
      incorretos.push(produto);
    }
  }

  console.log(`✅ Produtos corretos em Bebidas: ${corretos.length}`);
  console.log(`❌ Produtos INCORRETOS em Bebidas: ${incorretos.length}\n`);

  if (incorretos.length === 0) {
    console.log('🎉 Nenhum produto incorreto encontrado!\n');
    return;
  }

  // 4. Mostrar produtos incorretos
  console.log('📋 Produtos que NÃO são bebidas:\n');
  for (const produto of incorretos) {
    console.log(`   - [${produto.codigo_mercos || 'sem código'}] ${produto.name.slice(0, 70)}`);
  }

  // 5. Buscar categorias de destino
  const categoriasMap = new Map();
  
  const { data: categorias } = await supabase
    .from('categories')
    .select('id, name');

  if (categorias) {
    for (const cat of categorias) {
      categoriasMap.set(cat.name.toLowerCase(), cat.id);
    }
  }

  // 6. Categorizar e mover produtos incorretos
  console.log('\n\n🔄 MOVENDO PRODUTOS INCORRETOS:\n');

  const movimentos = {};
  
  for (const produto of incorretos) {
    const nomeLower = produto.name.toLowerCase();
    let categoriaDestino = 'Outros'; // Padrão
    
    // Verificar qual categoria de destino
    for (const [palavra, catNome] of Object.entries(CATEGORIAS_DESTINO)) {
      if (nomeLower.includes(palavra.toLowerCase())) {
        categoriaDestino = catNome;
        break;
      }
    }

    // Adicionar ao mapa de movimentos
    if (!movimentos[categoriaDestino]) {
      movimentos[categoriaDestino] = [];
    }
    movimentos[categoriaDestino].push(produto);
  }

  // 7. Executar movimentos
  for (const [catNome, prods] of Object.entries(movimentos)) {
    const catId = categoriasMap.get(catNome.toLowerCase());
    
    if (!catId) {
      console.log(`⚠️  Categoria "${catNome}" não encontrada no banco - pulando ${prods.length} produtos`);
      continue;
    }

    const prodIds = prods.map(p => p.id);
    
    const { data: updated, error } = await supabase
      .from('products')
      .update({ category_id: catId })
      .in('id', prodIds)
      .select();

    if (error) {
      console.error(`❌ Erro ao mover para "${catNome}":`, error.message);
    } else {
      console.log(`✅ ${updated?.length || 0} produtos movidos para "${catNome}"`);
      
      // Mostrar alguns produtos movidos
      if (prods.length <= 5) {
        prods.forEach(p => {
          console.log(`     - ${p.name.slice(0, 60)}`);
        });
      } else {
        prods.slice(0, 3).forEach(p => {
          console.log(`     - ${p.name.slice(0, 60)}`);
        });
        console.log(`     ... e mais ${prods.length - 3}`);
      }
    }
    console.log('');
  }

  // 8. Verificar resultado final
  const { data: finalBebidas } = await supabase
    .from('products')
    .select('id, name')
    .eq('category_id', catBebidas[0].id)
    .eq('active', true);

  console.log(`\n📊 RESULTADO FINAL: ${finalBebidas?.length || 0} produtos em Bebidas\n`);
}

main().catch(console.error);
