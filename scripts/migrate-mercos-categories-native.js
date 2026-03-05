#!/usr/bin/env node

/**
 * Migração completa para categorias/subcategorias nativas da Mercos
 * para Bambino e Brancaleone + validação de produtos por categoria.
 *
 * Etapas:
 * 1) Snapshot pré-migração (categorias + mapeamento de produtos)
 * 2) Sync distribuidor_categories direto da Mercos (com desativação de stale)
 * 3) Sync categories (global) a partir dos dois distribuidores
 * 4) Recategorização de products com base na categoria oficial da Mercos
 * 5) Validação final + trigger de sync cron para homologação
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DISTRIBUIDORES_TARGET = [
  '3a989c56-bbd3-4769-b076-a83483e39542', // Bambino
  '1511df09-1f4a-4e68-9f8c-05cd06be6269', // Brancaleone
];

const BACKUPS_DIR = path.resolve(process.cwd(), 'backups');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toFileTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

function slugify(value) {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeIso(iso) {
  if (!iso) return null;
  return String(iso).replace(' ', 'T');
}

function bumpIsoSecond(iso) {
  if (!iso) return iso;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Date(d.getTime() + 1000).toISOString();
}

function parseMercosArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object' && Array.isArray(raw.data)) return raw.data;
  return [];
}

function toNullableNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function fetchWith429(url, options = {}) {
  while (true) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
      const waitSeconds = Math.max(1, Number(body?.tempo_ate_permitir_novamente) || 5);
      console.log(`   ⏳ 429 recebido. Aguardando ${waitSeconds}s...`);
      await sleep(waitSeconds * 1000);
      continue;
    }
    return res;
  }
}

async function fetchMercosAll(resource, distribuidor) {
  const baseUrl = (distribuidor.base_url || 'https://app.mercos.com/api/v1').replace(/\/$/, '');
  const appToken = distribuidor.mercos_application_token || distribuidor.application_token;
  const companyToken = distribuidor.mercos_company_token || distribuidor.company_token;

  if (!appToken || !companyToken) {
    throw new Error(`Tokens da Mercos ausentes para ${distribuidor.nome}`);
  }

  const headers = {
    ApplicationToken: appToken,
    CompanyToken: companyToken,
    'Content-Type': 'application/json',
  };

  const all = [];
  let cursorDate = '2020-01-01T00:00:00';
  let cursorId = null;
  let page = 1;

  while (page <= 1000) {
    const qp = new URLSearchParams();
    qp.set('alterado_apos', cursorDate);
    qp.set('limit', '200');
    qp.set('order_by', 'ultima_alteracao');
    qp.set('order_direction', 'asc');
    if (cursorId !== null) qp.set('id_maior_que', String(cursorId));

    const url = `${baseUrl}/${resource}?${qp.toString()}`;
    const res = await fetchWith429(url, { headers });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Mercos ${resource} HTTP ${res.status}: ${body.slice(0, 300)}`);
    }

    const raw = await res.json().catch(() => []);
    const arr = parseMercosArray(raw);
    all.push(...arr);

    const limited = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
    if (!limited || arr.length === 0) {
      break;
    }

    const last = arr[arr.length - 1];
    const nextDateRaw = normalizeIso(last?.ultima_alteracao) || cursorDate;
    const nextId = Number(last?.id);

    if (!Number.isFinite(nextId)) {
      cursorDate = bumpIsoSecond(nextDateRaw);
      cursorId = null;
    } else if (nextDateRaw === cursorDate && cursorId === nextId) {
      cursorDate = bumpIsoSecond(nextDateRaw);
      cursorId = null;
    } else {
      cursorDate = nextDateRaw;
      cursorId = nextId;
    }

    page += 1;
  }

  return all;
}

async function getDistribuidores(ids) {
  const { data, error } = await supabase
    .from('distribuidores')
    .select(
      'id, nome, base_url, application_token, company_token, mercos_application_token, mercos_company_token'
    )
    .in('id', ids);

  if (error) {
    throw new Error(`Erro ao carregar distribuidores: ${error.message}`);
  }

  return data || [];
}

async function fetchAllProductsByDistribuidor(distribuidorId) {
  const rows = [];
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('products')
      .select('id, mercos_id, category_id, categoria_mercos, active, excluido, distribuidor_id')
      .eq('distribuidor_id', distribuidorId)
      .order('id', { ascending: true })
      .range(from, to);

    if (error) {
      throw new Error(`Erro ao carregar products (${distribuidorId}): ${error.message}`);
    }

    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
    from += pageSize;
  }

  return rows;
}

async function snapshotBefore(distribuidores, ts) {
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });

  const snapshot = {
    generated_at: new Date().toISOString(),
    distribuidores: [],
    categories_global_mercos: [],
  };

  for (const dist of distribuidores) {
    const { data: distCats, error: distCatsError } = await supabase
      .from('distribuidor_categories')
      .select('id, mercos_id, nome, categoria_pai_id, ativo, distribuidor_id')
      .eq('distribuidor_id', dist.id);

    if (distCatsError) {
      throw new Error(`Erro snapshot distribuidor_categories (${dist.nome}): ${distCatsError.message}`);
    }

    const products = await fetchAllProductsByDistribuidor(dist.id);

    snapshot.distribuidores.push({
      id: dist.id,
      nome: dist.nome,
      distribuidor_categories: distCats || [],
      products_category_mapping: products,
    });
  }

  const { data: globalCats, error: globalError } = await supabase
    .from('categories')
    .select(
      'id, mercos_id, name, parent_category_id, active, visible, order, image, link, jornaleiro_status, jornaleiro_bancas'
    )
    .not('mercos_id', 'is', null);

  if (globalError) {
    throw new Error(`Erro snapshot categories global: ${globalError.message}`);
  }

  snapshot.categories_global_mercos = globalCats || [];

  const file = path.join(BACKUPS_DIR, `mercos-categories-snapshot-before-${ts}.json`);
  fs.writeFileSync(file, JSON.stringify(snapshot, null, 2));
  return file;
}

async function syncDistribuidorCategories(distribuidor, mercosCategorias) {
  const activeMercos = mercosCategorias.filter((c) => !c.excluido && Number.isFinite(Number(c.id)));
  const activeSet = new Set(activeMercos.map((c) => Number(c.id)));

  const { data: existingRows, error: existingError } = await supabase
    .from('distribuidor_categories')
    .select('id, mercos_id, ativo')
    .eq('distribuidor_id', distribuidor.id);

  if (existingError) {
    throw new Error(`Erro ao carregar categorias existentes (${distribuidor.nome}): ${existingError.message}`);
  }

  const existingByMercos = new Map(
    (existingRows || [])
      .filter((r) => r.mercos_id !== null && r.mercos_id !== undefined)
      .map((r) => [Number(r.mercos_id), r])
  );

  const payload = activeMercos.map((c) => ({
    distribuidor_id: distribuidor.id,
    mercos_id: Number(c.id),
    nome: c.nome || `Categoria ${c.id}`,
    categoria_pai_id: c.categoria_pai_id ? Number(c.categoria_pai_id) : null,
    ativo: true,
    updated_at: new Date().toISOString(),
  }));

  for (const chunk of chunkArray(payload, 500)) {
    const { error } = await supabase
      .from('distribuidor_categories')
      .upsert(chunk, { onConflict: 'distribuidor_id,mercos_id' });
    if (error) {
      throw new Error(`Erro no upsert distribuidor_categories (${distribuidor.nome}): ${error.message}`);
    }
  }

  const staleIds = (existingRows || [])
    .filter((row) => row.ativo === true && !activeSet.has(Number(row.mercos_id)))
    .map((row) => row.id);

  if (staleIds.length > 0) {
    for (const chunk of chunkArray(staleIds, 500)) {
      const { error } = await supabase
        .from('distribuidor_categories')
        .update({ ativo: false, updated_at: new Date().toISOString() })
        .in('id', chunk);
      if (error) {
        throw new Error(`Erro ao desativar stale categories (${distribuidor.nome}): ${error.message}`);
      }
    }
  }

  let inserted = 0;
  let updated = 0;
  for (const row of payload) {
    if (existingByMercos.has(Number(row.mercos_id))) updated += 1;
    else inserted += 1;
  }

  return {
    distribuidor: distribuidor.nome,
    total_mercos_recebidas: mercosCategorias.length,
    total_ativas_mercos: payload.length,
    inserted,
    updated,
    stale_desativadas: staleIds.length,
    active_mercos_ids: activeSet,
  };
}

function pickMostFrequent(map, fallback = null) {
  let bestKey = fallback;
  let bestCount = -1;
  for (const [key, count] of map.entries()) {
    if (count > bestCount) {
      bestKey = key;
      bestCount = count;
    }
  }
  return bestKey;
}

function scoreGlobalCategory(row) {
  let score = 0;
  if (row?.active) score += 3;
  if (row?.visible) score += 2;
  if (typeof row?.image === 'string' && row.image.trim().length > 0) score += 2;
  if (typeof row?.link === 'string' && row.link.trim().length > 0) score += 1;
  if (typeof row?.order === 'number' && row.order < 900) score += 1;
  return score;
}

async function syncGlobalCategories(distribuidorIds) {
  const { data: distCats, error: distCatsError } = await supabase
    .from('distribuidor_categories')
    .select('mercos_id, nome, categoria_pai_id, distribuidor_id')
    .in('distribuidor_id', distribuidorIds)
    .eq('ativo', true)
    .gt('mercos_id', 0);

  if (distCatsError) {
    throw new Error(`Erro ao carregar distribuidor_categories ativos: ${distCatsError.message}`);
  }

  const aggregate = new Map();
  for (const row of distCats || []) {
    const mercosId = Number(row.mercos_id);
    if (!Number.isFinite(mercosId) || mercosId <= 0) continue;

    if (!aggregate.has(mercosId)) {
      aggregate.set(mercosId, {
        mercos_id: mercosId,
        nameVotes: new Map(),
        parentVotes: new Map(),
      });
    }

    const bag = aggregate.get(mercosId);
    const nome = (row.nome || `Categoria ${mercosId}`).trim();
    bag.nameVotes.set(nome, (bag.nameVotes.get(nome) || 0) + 1);

    if (row.categoria_pai_id !== null && row.categoria_pai_id !== undefined) {
      const parent = Number(row.categoria_pai_id);
      if (Number.isFinite(parent) && parent > 0) {
        bag.parentVotes.set(parent, (bag.parentVotes.get(parent) || 0) + 1);
      }
    }
  }

  const targetMercosIds = Array.from(aggregate.keys());
  const targetSet = new Set(targetMercosIds);

  const { data: existingGlobal, error: existingGlobalError } = await supabase
    .from('categories')
    .select(
      'id, mercos_id, name, image, link, visible, order, active, parent_category_id, updated_at, jornaleiro_status, jornaleiro_bancas'
    )
    .not('mercos_id', 'is', null);

  if (existingGlobalError) {
    throw new Error(`Erro ao carregar categories global: ${existingGlobalError.message}`);
  }

  const existingByMercos = new Map();
  for (const row of existingGlobal || []) {
    const mercosId = Number(row.mercos_id);
    if (!Number.isFinite(mercosId)) continue;
    if (!existingByMercos.has(mercosId)) existingByMercos.set(mercosId, []);
    existingByMercos.get(mercosId).push(row);
  }

  const duplicatesToDisable = [];
  const nowIso = new Date().toISOString();
  const upsertPayload = [];
  const hierarchyByCategoryId = new Map();
  const mercosToCategoryId = new Map();

  for (const mercosId of targetMercosIds) {
    const bag = aggregate.get(mercosId);
    const nomeEscolhido = pickMostFrequent(bag.nameVotes, `Categoria ${mercosId}`);
    const parentMercos = pickMostFrequent(bag.parentVotes, null);

    const existingRows = (existingByMercos.get(mercosId) || []).slice();
    existingRows.sort((a, b) => {
      const score = scoreGlobalCategory(b) - scoreGlobalCategory(a);
      if (score !== 0) return score;
      return String(b.updated_at || '').localeCompare(String(a.updated_at || ''));
    });

    const canonical = existingRows[0];
    const duplicates = existingRows.slice(1);
    duplicatesToDisable.push(...duplicates.map((row) => row.id));

    const id = canonical?.id || crypto.randomUUID();
    const link = canonical?.link || `/categorias/${slugify(nomeEscolhido) || 'categoria'}`;

    upsertPayload.push({
      id,
      mercos_id: mercosId,
      name: nomeEscolhido,
      image: canonical?.image || '',
      link,
      visible: canonical?.visible ?? true,
      order: typeof canonical?.order === 'number' ? canonical.order : 999,
      active: true,
      jornaleiro_status: canonical?.jornaleiro_status || 'all',
      jornaleiro_bancas: Array.isArray(canonical?.jornaleiro_bancas) ? canonical.jornaleiro_bancas : [],
      ultima_sincronizacao: nowIso,
      updated_at: nowIso,
      ...(canonical ? {} : { created_at: nowIso }),
    });

    mercosToCategoryId.set(mercosId, id);
    hierarchyByCategoryId.set(id, parentMercos);
  }

  for (const chunk of chunkArray(upsertPayload, 500)) {
    const { error } = await supabase
      .from('categories')
      .upsert(chunk, { onConflict: 'id' });
    if (error) {
      throw new Error(`Erro no upsert categories global: ${error.message}`);
    }
  }

  // Atualizar hierarquia pai/filho
  const hierarchyUpdates = [];
  for (const [categoryId, parentMercos] of hierarchyByCategoryId.entries()) {
    const parentCategoryId =
      parentMercos !== null && parentMercos !== undefined
        ? mercosToCategoryId.get(Number(parentMercos)) || null
        : null;

    hierarchyUpdates.push({ id: categoryId, parent_category_id: parentCategoryId });
  }

  for (const update of hierarchyUpdates) {
    const { error } = await supabase
      .from('categories')
      .update({ parent_category_id: update.parent_category_id, updated_at: nowIso })
      .eq('id', update.id);
    if (error) {
      throw new Error(`Erro ao atualizar hierarquia de categories: ${error.message}`);
    }
  }

  // Desativar categorias globais Mercos fora do conjunto atual (stale)
  const staleGlobalIds = (existingGlobal || [])
    .filter((row) => {
      const mercosId = Number(row.mercos_id);
      return Number.isFinite(mercosId) && !targetSet.has(mercosId) && row.active === true;
    })
    .map((row) => row.id);

  if (staleGlobalIds.length > 0) {
    for (const chunk of chunkArray(staleGlobalIds, 500)) {
      const { error } = await supabase
        .from('categories')
        .update({
          active: false,
          visible: false,
          parent_category_id: null,
          updated_at: nowIso,
        })
        .in('id', chunk);
      if (error) {
        throw new Error(`Erro ao desativar categories stale: ${error.message}`);
      }
    }
  }

  if (duplicatesToDisable.length > 0) {
    for (const chunk of chunkArray(Array.from(new Set(duplicatesToDisable)), 500)) {
      const { error } = await supabase
        .from('categories')
        .update({
          active: false,
          visible: false,
          parent_category_id: null,
          updated_at: nowIso,
        })
        .in('id', chunk);
      if (error) {
        throw new Error(`Erro ao desativar categories duplicadas: ${error.message}`);
      }
    }
  }

  return {
    total_dist_categories_ativas: (distCats || []).length,
    total_global_target: targetMercosIds.length,
    stale_global_desativadas: staleGlobalIds.length,
    duplicated_global_desativadas: Array.from(new Set(duplicatesToDisable)).length,
    mercos_to_category_id: mercosToCategoryId,
  };
}

async function recategorizeProductsByMercos(distribuidor, mercosToCategoryId) {
  const mercosProducts = await fetchMercosAll('produtos', distribuidor);
  const mercosById = new Map();
  for (const p of mercosProducts) {
    if (Number.isFinite(Number(p?.id))) {
      mercosById.set(Number(p.id), p);
    }
  }

  const localProducts = await fetchAllProductsByDistribuidor(distribuidor.id);
  const groupedUpdates = new Map();
  const missingGlobalCategoryMercos = new Set();
  let notFoundInMercos = 0;
  let inspected = 0;
  let mismatches = 0;

  for (const product of localProducts) {
    const mercosProductId = Number(product.mercos_id);
    if (!Number.isFinite(mercosProductId)) continue;

    inspected += 1;
    const mercosProduct = mercosById.get(mercosProductId);
    if (!mercosProduct) {
      notFoundInMercos += 1;
      continue;
    }

    const expectedCategoriaMercos = toNullableNumber(mercosProduct.categoria_id);
    const expectedCategoryId =
      expectedCategoriaMercos !== null
        ? mercosToCategoryId.get(expectedCategoriaMercos) || null
        : null;

    if (expectedCategoriaMercos !== null && !expectedCategoryId) {
      missingGlobalCategoryMercos.add(expectedCategoriaMercos);
    }

    const currentCategoriaMercos = toNullableNumber(product.categoria_mercos);
    const currentCategoryId = product.category_id || null;

    const differs =
      currentCategoriaMercos !== expectedCategoriaMercos || currentCategoryId !== expectedCategoryId;

    if (!differs) continue;
    mismatches += 1;

    const key = `${expectedCategoryId || 'null'}|${expectedCategoriaMercos || 'null'}`;
    if (!groupedUpdates.has(key)) {
      groupedUpdates.set(key, {
        category_id: expectedCategoryId,
        categoria_mercos: expectedCategoriaMercos,
        ids: [],
      });
    }
    groupedUpdates.get(key).ids.push(product.id);
  }

  let updated = 0;
  let updateGroups = 0;
  const nowIso = new Date().toISOString();

  for (const group of groupedUpdates.values()) {
    updateGroups += 1;
    const ids = group.ids || [];
    for (const chunk of chunkArray(ids, 500)) {
      const { error } = await supabase
        .from('products')
        .update({
          category_id: group.category_id,
          categoria_mercos: group.categoria_mercos,
          updated_at: nowIso,
        })
        .in('id', chunk);

      if (error) {
        throw new Error(`Erro recategorizando products (${distribuidor.nome}): ${error.message}`);
      }
      updated += chunk.length;
    }
  }

  return {
    distribuidor: distribuidor.nome,
    mercos_products_total: mercosProducts.length,
    local_products_total: localProducts.length,
    inspected_with_mercos_id: inspected,
    not_found_in_mercos: notFoundInMercos,
    mismatches_before_fix: mismatches,
    updated_products: updated,
    update_groups: updateGroups,
    missing_global_category_mercos_ids: Array.from(missingGlobalCategoryMercos).sort((a, b) => a - b),
    mercos_by_id: mercosById,
  };
}

async function validateProductsConsistency(distribuidor, mercosById, mercosToCategoryId) {
  const localProducts = await fetchAllProductsByDistribuidor(distribuidor.id);

  let activeLocal = 0;
  let activeWithMercosId = 0;
  let mismatches = 0;
  let semCategoriaMercos = 0;
  let semCategoryIdGlobal = 0;
  let notFoundInMercos = 0;

  for (const product of localProducts) {
    if (product.active !== true) continue;
    activeLocal += 1;

    const mercosProductId = Number(product.mercos_id);
    if (!Number.isFinite(mercosProductId)) continue;
    activeWithMercosId += 1;

    const mercosProduct = mercosById.get(mercosProductId);
    if (!mercosProduct) {
      notFoundInMercos += 1;
      continue;
    }

    const expectedCategoriaMercos = toNullableNumber(mercosProduct.categoria_id);
    const expectedCategoryId =
      expectedCategoriaMercos !== null
        ? mercosToCategoryId.get(expectedCategoriaMercos) || null
        : null;

    const currentCategoriaMercos = toNullableNumber(product.categoria_mercos);
    const currentCategoryId = product.category_id || null;

    if (expectedCategoriaMercos === null) semCategoriaMercos += 1;
    if (expectedCategoryId === null) semCategoryIdGlobal += 1;

    if (currentCategoriaMercos !== expectedCategoriaMercos || currentCategoryId !== expectedCategoryId) {
      mismatches += 1;
    }
  }

  return {
    distribuidor: distribuidor.nome,
    active_local_products: activeLocal,
    active_with_mercos_id: activeWithMercosId,
    mismatches_after_fix: mismatches,
    mercos_without_category: semCategoriaMercos,
    without_global_category_mapping: semCategoryIdGlobal,
    not_found_in_mercos: notFoundInMercos,
  };
}

async function runCronSyncValidation() {
  const base = 'http://localhost:3000/api/cron/sync-mercos';
  const runs = [];

  // 1a rodada full=true para resetar cursor
  const firstUrl = `${base}?full=true&max_distribuidores=5&batches=10&batch_size=200`;
  const firstRes = await fetch(firstUrl, { method: 'POST' });
  const firstJson = await firstRes.json().catch(() => ({}));
  runs.push({
    url: firstUrl,
    status: firstRes.status,
    success: firstJson?.success ?? false,
    resumo: firstJson?.resumo || null,
    resultados: firstJson?.resultados || [],
  });

  // Rodadas adicionais em modo incremental até zerar has_more
  for (let i = 0; i < 6; i++) {
    const hasMore = (runs[runs.length - 1]?.resultados || []).some((r) => r?.has_more === true);
    if (!hasMore) break;

    await sleep(1200);
    const url = `${base}?max_distribuidores=5&batches=10&batch_size=200`;
    const res = await fetch(url, { method: 'POST' });
    const json = await res.json().catch(() => ({}));
    runs.push({
      url,
      status: res.status,
      success: json?.success ?? false,
      resumo: json?.resumo || null,
      resultados: json?.resultados || [],
    });
  }

  return runs;
}

async function main() {
  const ts = toFileTimestamp();
  const report = {
    started_at: new Date().toISOString(),
    snapshot_before_file: null,
    distribuidor_categories_sync: [],
    global_categories_sync: null,
    product_recategorization: [],
    product_validation_after: [],
    cron_sync_runs: [],
    finished_at: null,
  };

  console.log('\n════════════════════════════════════════════════════════════');
  console.log(' MIGRAÇÃO MERCOS NATIVA - CATEGORIAS E PRODUTOS');
  console.log('════════════════════════════════════════════════════════════\n');

  const distribuidores = await getDistribuidores(DISTRIBUIDORES_TARGET);
  if (distribuidores.length !== DISTRIBUIDORES_TARGET.length) {
    throw new Error('Nem todos os distribuidores alvo foram encontrados.');
  }

  console.log('1) Gerando snapshot pré-migração...');
  const snapshotFile = await snapshotBefore(distribuidores, ts);
  report.snapshot_before_file = snapshotFile;
  console.log(`   ✅ Snapshot salvo em: ${snapshotFile}\n`);

  const activeSetsByDistribuidor = new Map();

  console.log('2) Sincronizando distribuidor_categories com Mercos (2 fornecedores)...');
  for (const dist of distribuidores) {
    console.log(`   ↳ ${dist.nome}: buscando /categorias na Mercos...`);
    const mercosCats = await fetchMercosAll('categorias', dist);
    const syncResult = await syncDistribuidorCategories(dist, mercosCats);
    activeSetsByDistribuidor.set(dist.id, syncResult.active_mercos_ids);
    report.distribuidor_categories_sync.push({
      ...syncResult,
      active_mercos_ids_count: syncResult.active_mercos_ids.size,
    });
    console.log(
      `     ✅ ativas=${syncResult.total_ativas_mercos} | inserted=${syncResult.inserted} | updated=${syncResult.updated} | stale_desativadas=${syncResult.stale_desativadas}`
    );
  }
  console.log('');

  console.log('3) Sincronizando categories (global) com base nos dois distribuidores...');
  const globalResult = await syncGlobalCategories(distribuidores.map((d) => d.id));
  report.global_categories_sync = {
    ...globalResult,
    mercos_to_category_id_count: globalResult.mercos_to_category_id.size,
  };
  console.log(
    `   ✅ target=${globalResult.total_global_target} | stale_desativadas=${globalResult.stale_global_desativadas} | duplicadas_desativadas=${globalResult.duplicated_global_desativadas}\n`
  );

  console.log('4) Recategorizando produtos conforme categoria oficial da Mercos...');
  const mercosByDist = new Map();
  for (const dist of distribuidores) {
    console.log(`   ↳ ${dist.nome}: buscando /produtos na Mercos e corrigindo mapeamento local...`);
    const recat = await recategorizeProductsByMercos(dist, globalResult.mercos_to_category_id);
    report.product_recategorization.push({
      ...recat,
      mercos_by_id_size: recat.mercos_by_id.size,
    });
    mercosByDist.set(dist.id, recat.mercos_by_id);
    console.log(
      `     ✅ mismatches_corrigidos=${recat.updated_products} | not_found_in_mercos=${recat.not_found_in_mercos} | missing_global_map=${recat.missing_global_category_mercos_ids.length}`
    );
  }
  console.log('');

  console.log('5) Validação final de produtos x categorias...');
  for (const dist of distribuidores) {
    const validation = await validateProductsConsistency(
      dist,
      mercosByDist.get(dist.id) || new Map(),
      globalResult.mercos_to_category_id
    );
    report.product_validation_after.push(validation);
    console.log(
      `   ↳ ${dist.nome}: active=${validation.active_local_products} | mismatches_after_fix=${validation.mismatches_after_fix}`
    );
  }
  console.log('');

  console.log('6) Rodando sync final (endpoint /api/cron/sync-mercos) para homologação...');
  try {
    const cronRuns = await runCronSyncValidation();
    report.cron_sync_runs = cronRuns;
    const last = cronRuns[cronRuns.length - 1] || {};
    const hasMore = (last.resultados || []).some((r) => r?.has_more === true);
    console.log(
      `   ✅ execuções=${cronRuns.length} | último_status=${last.status || 'n/a'} | has_more=${hasMore}`
    );
  } catch (error) {
    report.cron_sync_runs = [{ error: error?.message || String(error) }];
    console.log(`   ⚠️ Não foi possível executar sync final via endpoint local: ${error?.message || error}`);
  }

  report.finished_at = new Date().toISOString();

  const reportFile = path.join(BACKUPS_DIR, `mercos-categories-migration-report-${ts}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  console.log('\n════════════════════════════════════════════════════════════');
  console.log(' MIGRAÇÃO CONCLUÍDA');
  console.log('════════════════════════════════════════════════════════════');
  console.log(`Snapshot pré-migração: ${report.snapshot_before_file}`);
  console.log(`Relatório final:       ${reportFile}\n`);
}

main().catch((error) => {
  console.error('\n❌ Falha na migração Mercos nativa');
  console.error(error?.message || error);
  process.exit(1);
});
