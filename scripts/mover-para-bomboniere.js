#!/usr/bin/env node

/**
 * Script para mover produtos específicos para a categoria Bomboniere
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Códigos dos produtos que devem estar em Bomboniere
const CODIGOS_BOMBONIERE = [
  '1179', 'JJ4230', 'JJ4049', 'JJ4261', 'JJ4124', 'JJ4155', 'JJ4186', '1176',
  'JJ4087', '1180', 'JJ5220', '1178', '1054835', '1325263', '1163407', '1044591',
  '1324075', '1099065', '1028065', '812122', '807906', '967563', '604833',
  '1076219', '1085891', '1091212', '1091229', '964265', '1117011', '1129304',
  '50419', '50420', '50429', '50430', '50421', '50422', '50427', '50428',
  '974899', '1074215', '1090970', '1142556', '874953', '874939', '874960',
  '904957', '904940', '1195026', '1039757', '1131475', '1131468', '50602',
  '50601', 'JJ4919', '322003', '321891', '779951', '1258578', '779913',
  '794145', '322256', '322263', '20807-1', '20802-1', '20809-1', '21103-1',
  '324243', '324236', '1230642', '958950', '958967', '958974', '958936',
  '958943', '1128116', '795906', '585095', '694841', '913232', '1040128',
  '1039511', '1039504', '1039528', '1043495', '20903-1', '20707-1', '20702-1',
  '50316', '50315', '1119', '50322', '50321', '50311', '50312', '50314',
  '50320', '50324', '50323', '50313', '1291148', '1290912', '321853',
  '525787', '1152876', '1187762', '738187', 'DOC010', 'DOC008', '1127829',
  '1127836', '1127713', '851022', '1127706', '851145', '1127683', '850995',
  '1127690', '1079210', '851015', '939904', '1261066', '325226', '325219',
  'DOC013', '1077247', 'JJ4285', 'JJ4308', 'JJ4865', 'JJ4971', '104555',
  'DOC006', '1253474', '1252378', '1252385', '690447', '1227956', '1231229',
  'DOC014'
];

async function main() {
  console.log('\n🍬 MOVENDO PRODUTOS PARA BOMBONIERE\n');
  console.log(`Total de códigos fornecidos: ${CODIGOS_BOMBONIERE.length}\n`);

  // 1. Buscar categoria Bomboniere
  const { data: catBomboniere, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .ilike('name', '%bomboniere%')
    .limit(1);

  if (catError || !catBomboniere || catBomboniere.length === 0) {
    console.error('❌ Categoria Bomboniere não encontrada');
    if (catError) console.error('Erro:', catError.message);
    return;
  }

  console.log(`✅ Categoria: ${catBomboniere[0].name} (${catBomboniere[0].id})\n`);

  // 2. Buscar produtos pelos códigos
  const { data: produtos, error: prodError } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, category_id, categories(name)')
    .in('codigo_mercos', CODIGOS_BOMBONIERE);

  if (prodError) {
    console.error('❌ Erro ao buscar produtos:', prodError.message);
    return;
  }

  if (!produtos || produtos.length === 0) {
    console.log('❌ Nenhum produto encontrado com esses códigos');
    return;
  }

  console.log(`📦 Produtos encontrados: ${produtos.length}/${CODIGOS_BOMBONIERE.length}\n`);

  // 3. Separar produtos que já estão em Bomboniere dos que precisam ser movidos
  const jaNaBomboniere = produtos.filter(p => p.category_id === catBomboniere[0].id);
  const aMover = produtos.filter(p => p.category_id !== catBomboniere[0].id);

  console.log(`✅ Já em Bomboniere: ${jaNaBomboniere.length}`);
  console.log(`🔄 A mover: ${aMover.length}\n`);

  if (aMover.length === 0) {
    console.log('🎉 Todos os produtos já estão na categoria Bomboniere!\n');
    return;
  }

  // 4. Agrupar por categoria atual
  const porCategoria = {};
  for (const produto of aMover) {
    const catAtual = produto.categories?.name || 'Sem Categoria';
    if (!porCategoria[catAtual]) {
      porCategoria[catAtual] = [];
    }
    porCategoria[catAtual].push(produto);
  }

  console.log('📋 Produtos a mover por categoria atual:\n');
  for (const [cat, prods] of Object.entries(porCategoria)) {
    console.log(`   ${cat}: ${prods.length} produtos`);
  }

  console.log('\n🔄 Movendo produtos...\n');

  // 5. Mover produtos
  const produtoIds = aMover.map(p => p.id);
  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update({ category_id: catBomboniere[0].id })
    .in('id', produtoIds)
    .select();

  if (updateError) {
    console.error('❌ Erro ao atualizar:', updateError.message);
    return;
  }

  console.log(`✅ ${updated?.length || 0} produtos movidos para Bomboniere!\n`);

  // 6. Mostrar alguns exemplos de produtos movidos
  console.log('Exemplos de produtos movidos:\n');
  aMover.slice(0, 10).forEach(p => {
    const catAnterior = p.categories?.name || 'Sem Categoria';
    console.log(`   [${p.codigo_mercos}] ${p.name.slice(0, 50)}`);
    console.log(`   └─ ${catAnterior} → Bomboniere\n`);
  });

  if (aMover.length > 10) {
    console.log(`   ... e mais ${aMover.length - 10} produtos\n`);
  }

  // 7. Verificar códigos não encontrados
  const codigosEncontrados = produtos.map(p => p.codigo_mercos);
  const naoEncontrados = CODIGOS_BOMBONIERE.filter(c => !codigosEncontrados.includes(c));

  if (naoEncontrados.length > 0) {
    console.log(`⚠️  ${naoEncontrados.length} códigos NÃO encontrados no banco:\n`);
    naoEncontrados.slice(0, 20).forEach(c => {
      console.log(`   - ${c}`);
    });
    if (naoEncontrados.length > 20) {
      console.log(`   ... e mais ${naoEncontrados.length - 20}`);
    }
    console.log('');
  }

  console.log('✅ Processo concluído!\n');
}

main().catch(console.error);
