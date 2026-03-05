#!/usr/bin/env node

/**
 * Seed de categorias da Bambino com hierarquia pai/filho.
 *
 * Contexto:
 * - A API Mercos /categorias está retornando 401 para os tokens atuais da Bambino.
 * - Para manter o admin funcional, este script popula distribuidor_categories
 *   com a estrutura principal/subcategoria baseada no catálogo validado.
 * - IDs Mercos conhecidos (inferidos via produtos) são preservados.
 * - Demais categorias recebem IDs negativos estáveis (sintéticos).
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// IDs Mercos inferidos a partir dos produtos (quando disponíveis)
const REAL_MERCOS_IDS = {
  'Acessórios': 3226386,
  'Adesivos Times': 2917787,
  'Baralhos': 2656079,
  'Baralhos e Cards': 2656078,
  'Cards Colecionáveis': 2892362,
  'Chicletes': 2625369,
  'Chocolates': 2625370,
  'Doces': 3459046,
  'Salgadinhos': 3077684,
  'Tabaco e Seda': 2459864,
  'Utilidades': 2513001,
};

// Estrutura principal/subcategoria solicitada para a Bambino
const CATEGORY_TREE = [
  { name: 'Bebidas', children: ['Energéticos', 'Bebidas Alcoólicas'] },
  { name: 'Bomboniere', children: ['Balas e Drops', 'Chicletes', 'Chocolates', 'Doces', 'Salgadinhos'] },
  { name: 'Brinquedos', children: ['Pelúcias', 'Livros Infantis'] },
  { name: 'Cartas', children: ['Baralhos', 'Baralhos e Cards', 'Cards Colecionáveis'] },
  { name: 'Descartáveis', children: [] },
  { name: 'Diversos', children: ['Acessórios', 'Adesivos Times', 'Utilidades'] },
  { name: 'Eletrônicos', children: ['Caixas de Som', 'Fones de Ouvido', 'Acessórios Celular', 'Capinhas Celular'] },
  { name: 'Guarda-chuva / capa de chuva', children: ['Guarda-Chuvas'] },
  { name: 'Informática', children: [] },
  { name: 'Jogos', children: ['Jogos de Cartas', 'Jogos Copag'] },
  { name: 'Miniaturas', children: ['Carrinhos', 'Blocos de Montar'] },
  { name: 'Papelaria', children: [] },
  { name: 'PET SHOP', children: [] },
  { name: 'Pilhas e baterias', children: ['Pilhas'] },
  { name: 'Pokémon', children: ['Cards Pokémon', 'Fichários Pokémon'] },
  {
    name: 'Tabacaria',
    children: [
      'Boladores',
      'Carvão Narguile',
      'Cigarros',
      'Cigarros L&M',
      'Essências',
      'Filtros',
      'Incensos',
      'Isqueiros',
      'Palheiros',
      'Piteiras',
      'Porta Cigarros',
      'Seda OCB',
      'Tabaco e Seda',
      'Tabacos Importados',
      'Trituradores',
    ],
  },
  { name: 'Telefonia', children: [] },
];

function syntheticMercosId(name) {
  // Hash determinístico simples -> inteiro negativo estável
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return -9000000 - (hash % 999999);
}

function mercosIdFor(name) {
  if (Object.prototype.hasOwnProperty.call(REAL_MERCOS_IDS, name)) {
    return REAL_MERCOS_IDS[name];
  }
  return syntheticMercosId(name);
}

async function upsertCategory({ mercosId, nome, categoriaPaiId }) {
  const payload = {
    distribuidor_id: BAMBINO_ID,
    mercos_id: mercosId,
    nome,
    categoria_pai_id: categoriaPaiId,
    ativo: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('distribuidor_categories')
    .upsert(payload, { onConflict: 'distribuidor_id,mercos_id' });

  if (error) {
    throw new Error(`Erro ao salvar categoria "${nome}" (mercos_id ${mercosId}): ${error.message}`);
  }
}

async function main() {
  console.log('\n🌱 Seed de categorias Bambino (principais + subcategorias)\n');

  const uniqueNames = new Set();
  for (const top of CATEGORY_TREE) {
    if (uniqueNames.has(top.name)) throw new Error(`Categoria duplicada: ${top.name}`);
    uniqueNames.add(top.name);
    for (const child of top.children) {
      const key = `${top.name}::${child}`;
      if (uniqueNames.has(key)) throw new Error(`Subcategoria duplicada no mesmo pai: ${child} (${top.name})`);
      uniqueNames.add(key);
    }
  }

  let createdOrUpdatedTop = 0;
  let createdOrUpdatedChildren = 0;

  for (const top of CATEGORY_TREE) {
    const topMercosId = mercosIdFor(top.name);
    await upsertCategory({
      mercosId: topMercosId,
      nome: top.name,
      categoriaPaiId: null,
    });
    createdOrUpdatedTop++;

    for (const childName of top.children) {
      const childMercosId = mercosIdFor(childName);
      await upsertCategory({
        mercosId: childMercosId,
        nome: childName,
        categoriaPaiId: topMercosId,
      });
      createdOrUpdatedChildren++;
    }
  }

  // Inativar categorias da Bambino que não fazem parte do template atual
  const allowedIds = new Set();
  for (const top of CATEGORY_TREE) {
    allowedIds.add(mercosIdFor(top.name));
    for (const child of top.children) {
      allowedIds.add(mercosIdFor(child));
    }
  }

  const { data: existing, error: existingErr } = await supabase
    .from('distribuidor_categories')
    .select('id, mercos_id, nome, ativo')
    .eq('distribuidor_id', BAMBINO_ID);

  if (existingErr) {
    throw new Error(`Erro ao buscar categorias existentes: ${existingErr.message}`);
  }

  const staleIds = (existing || [])
    .filter((row) => !allowedIds.has(Number(row.mercos_id)) && row.ativo)
    .map((row) => row.id);

  if (staleIds.length > 0) {
    const { error: deactivateErr } = await supabase
      .from('distribuidor_categories')
      .update({ ativo: false, updated_at: new Date().toISOString() })
      .in('id', staleIds);
    if (deactivateErr) {
      throw new Error(`Erro ao inativar categorias antigas: ${deactivateErr.message}`);
    }
  }

  const { data: finalRows, error: finalErr } = await supabase
    .from('distribuidor_categories')
    .select('id, mercos_id, nome, categoria_pai_id, ativo')
    .eq('distribuidor_id', BAMBINO_ID)
    .order('nome', { ascending: true });

  if (finalErr) {
    throw new Error(`Erro ao validar resultado: ${finalErr.message}`);
  }

  const activeRows = (finalRows || []).filter((r) => r.ativo);
  const topRows = activeRows.filter((r) => r.categoria_pai_id == null);
  const childRows = activeRows.filter((r) => r.categoria_pai_id != null);

  console.log(`✅ Categorias principais atualizadas: ${createdOrUpdatedTop}`);
  console.log(`✅ Subcategorias atualizadas: ${createdOrUpdatedChildren}`);
  console.log(`✅ Categorias antigas inativadas: ${staleIds.length}`);
  console.log(`📊 Total ativo final: ${activeRows.length} (${topRows.length} principais + ${childRows.length} subcategorias)\n`);
}

main().catch((err) => {
  console.error('\n❌ Falha no seed de categorias da Bambino');
  console.error(err.message || err);
  process.exit(1);
});
