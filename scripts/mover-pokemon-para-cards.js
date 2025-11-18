#!/usr/bin/env node

/**
 * Script para mover produtos Pokémon para a categoria Cards e Colecionáveis
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Códigos dos produtos Pokémon que devem estar em Cards e Colecionáveis
const CODIGOS_POKEMON = [
  '35576',   // Box Pokémon Mega Lucário
  '35865D',  // Deck Baralho Batalha: Mega DIANCIE
  '35865G',  // Deck Baralho Batalha: Mega GENGAR
  '35862',   // Pokemon EV6 - Box Mega Latias Ex
  '35868',   // Pokémon Mega Evolução - Fezandipiti EX
  '35659',   // Pokémon Mega Evolução - ME1 - Blister QUADRUPLO
  '35657',   // Pokémon Mega Evolução - ME1 - Blister TRIPLO
  '35678',   // Pokémon Mega Evolução - ME2 - Fogo Fantasmagórico - Blister QUADRUPLO
  '35676',   // Pokémon Mega Evolução - ME2 - Fogo Fantasmagórico - Blister TRIPLO
  '35674',   // Pokémon Mega Evolução - ME2 - Fogo Fantasmagórico - Blister UNITÁRIO
  '35671',   // Pokémon Mega Evolução - ME2 - Fogo Fantasmagórico - Display 36 BOOSTER
  '35684'    // Pokémon Mega Evolução - ME2 - Fogo Fantasmagórico - MINI Display 18 Booster
];

async function main() {
  console.log('\n🎴 MOVENDO PRODUTOS POKÉMON PARA CARDS E COLECIONÁVEIS\n');
  console.log(`Total de códigos fornecidos: ${CODIGOS_POKEMON.length}\n`);

  // 1. Buscar categoria Cards e Colecionáveis
  const { data: catCards, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', '%cards%colecion%')
    .limit(1);

  if (catError || !catCards || catCards.length === 0) {
    console.error('❌ Categoria Cards e Colecionáveis não encontrada');
    if (catError) console.error('Erro:', catError.message);
    return;
  }

  console.log(`✅ Categoria: ${catCards[0].name} (${catCards[0].id})\n`);

  // 2. Buscar produtos pelos códigos
  const { data: produtos, error: prodError } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id, categories(name)')
    .in('codigo_mercos', CODIGOS_POKEMON);

  if (prodError) {
    console.error('❌ Erro ao buscar produtos:', prodError.message);
    return;
  }

  if (!produtos || produtos.length === 0) {
    console.log('❌ Nenhum produto encontrado com esses códigos');
    return;
  }

  console.log(`📦 Produtos encontrados: ${produtos.length}/${CODIGOS_POKEMON.length}\n`);

  // 3. Separar produtos que já estão em Cards dos que precisam ser movidos
  const jaEmCards = produtos.filter(p => p.category_id === catCards[0].id);
  const aMover = produtos.filter(p => p.category_id !== catCards[0].id);

  console.log(`✅ Já em Cards e Colecionáveis: ${jaEmCards.length}`);
  console.log(`🔄 A mover: ${aMover.length}\n`);

  if (aMover.length === 0) {
    console.log('🎉 Todos os produtos já estão na categoria Cards e Colecionáveis!\n');
    return;
  }

  // 4. Mostrar produtos que serão movidos
  console.log('📋 Produtos que serão movidos:\n');
  for (const produto of aMover) {
    const catAtual = produto.categories?.name || 'Sem Categoria';
    console.log(`   [${produto.codigo_mercos}] ${produto.name.slice(0, 60)}`);
    console.log(`   └─ ${catAtual} → Cards e Colecionáveis\n`);
  }

  console.log('🔄 Movendo produtos...\n');

  // 5. Mover produtos
  const produtoIds = aMover.map(p => p.id);
  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update({ category_id: catCards[0].id })
    .in('id', produtoIds)
    .select();

  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError.message);
    return;
  }

  console.log(`✅ ${updated?.length || 0} produtos movidos para Cards e Colecionáveis!\n`);

  // 6. Verificar códigos não encontrados
  const codigosEncontrados = produtos.map(p => p.codigo_mercos);
  const naoEncontrados = CODIGOS_POKEMON.filter(c => !codigosEncontrados.includes(c));

  if (naoEncontrados.length > 0) {
    console.log(`⚠️  ${naoEncontrados.length} códigos NÃO encontrados no banco:\n`);
    naoEncontrados.forEach(c => {
      console.log(`   - ${c}`);
    });
    console.log('');
  }

  console.log('✅ Processo concluído!\n');
}

main().catch(console.error);
