#!/usr/bin/env node
/* eslint-disable no-console */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[IMPORT] Variaveis Supabase nao encontradas em .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const DEFAULT_DISTRIBUIDOR_ID = '3a989c56-bbd3-4769-b076-a83483e39542'; // Bambino
const DEFAULT_SECTION_KEY = 'most_sold_bambino';
const DEFAULT_XLS_PATH = '/Users/trabalho/Downloads/ClassificacaoABC bambino fevereiro-DESKTOP-DABIP9C.xls';

function norm(value) {
  return String(value || '').trim().toLowerCase();
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    apply: args.includes('--apply'),
    section: DEFAULT_SECTION_KEY,
    distribuidor: DEFAULT_DISTRIBUIDOR_ID,
    file: DEFAULT_XLS_PATH,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--section' && args[i + 1]) options.section = args[i + 1];
    if (arg === '--distribuidor' && args[i + 1]) options.distribuidor = args[i + 1];
    if (arg === '--file' && args[i + 1]) options.file = args[i + 1];
  }

  return options;
}

function loadSheetRows(filePath) {
  const wb = xlsx.readFile(filePath, { cellDates: false });
  const sh = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sh, { header: 1, defval: '' });

  const parsed = [];
  for (const row of rows) {
    const idProduto = row[0];
    const nome = row[1];
    const ordem = Number(row[2]);

    if ((idProduto === '' || idProduto == null) || !Number.isFinite(ordem) || ordem <= 0) {
      continue;
    }

    parsed.push({
      idProduto: String(idProduto).trim(),
      nome: String(nome || '').trim(),
      ordem,
    });
  }

  parsed.sort((a, b) => a.ordem - b.ordem);
  return parsed;
}

async function fetchDistributorProducts(distribuidorId) {
  const pageSize = 1000;
  let from = 0;
  const all = [];

  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, active, distribuidor_id, codigo_mercos, mercos_id')
      .eq('distribuidor_id', distribuidorId)
      .range(from, from + pageSize - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    all.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return all.filter((product) => product.active !== false);
}

function matchSheetToProducts(sheetRows, activeProducts) {
  const byCodigo = new Map();

  for (const product of activeProducts) {
    const code = norm(product.codigo_mercos);
    if (code && !byCodigo.has(code)) {
      byCodigo.set(code, product);
    }
  }

  const matched = [];
  const unmatched = [];
  const usedProductIds = new Set();

  for (const row of sheetRows) {
    const code = norm(row.idProduto);
    const product = byCodigo.get(code);

    if (!product) {
      unmatched.push(row);
      continue;
    }

    if (usedProductIds.has(product.id)) {
      continue;
    }

    usedProductIds.add(product.id);
    matched.push({
      ordem: row.ordem,
      idProduto: row.idProduto,
      nomePlanilha: row.nome,
      product_id: product.id,
      product_name: product.name,
      codigo_mercos: product.codigo_mercos,
    });
  }

  matched.sort((a, b) => a.ordem - b.ordem);
  return { matched, unmatched };
}

async function replaceFeaturedSection(sectionKey, matchedRows) {
  const { error: deleteError } = await supabase
    .from('featured_products')
    .delete()
    .eq('section_key', sectionKey);

  if (deleteError) throw deleteError;

  if (matchedRows.length === 0) return;

  const payload = matchedRows.map((row) => ({
    section_key: sectionKey,
    product_id: row.product_id,
    label: null,
    order_index: row.ordem,
    active: true,
  }));

  const batchSize = 200;
  for (let i = 0; i < payload.length; i += batchSize) {
    const batch = payload.slice(i, i + batchSize);
    const { error: insertError } = await supabase
      .from('featured_products')
      .insert(batch);
    if (insertError) throw insertError;
  }
}

function saveReport(report) {
  const reportsDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  const reportPath = path.join(reportsDir, 'bambino-priority-import-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  return reportPath;
}

async function main() {
  const options = parseArgs();

  console.log('[IMPORT] Arquivo:', options.file);
  console.log('[IMPORT] Distribuidor:', options.distribuidor);
  console.log('[IMPORT] Section key:', options.section);
  console.log('[IMPORT] Modo:', options.apply ? 'APPLY (escreve no banco)' : 'DRY-RUN');

  const sheetRows = loadSheetRows(options.file);
  const activeProducts = await fetchDistributorProducts(options.distribuidor);
  const { matched, unmatched } = matchSheetToProducts(sheetRows, activeProducts);

  const report = {
    generated_at: new Date().toISOString(),
    options,
    sheet_total: sheetRows.length,
    active_products_distribuidor: activeProducts.length,
    matched_total: matched.length,
    unmatched_total: unmatched.length,
    first_matched: matched.slice(0, 20),
    first_unmatched: unmatched.slice(0, 30),
  };

  const reportPath = saveReport(report);
  console.log('[IMPORT] Relatorio salvo em:', reportPath);
  console.log('[IMPORT] Match:', `${matched.length}/${sheetRows.length}`);

  if (!options.apply) {
    console.log('[IMPORT] Dry-run concluido. Use --apply para gravar na tabela featured_products.');
    return;
  }

  await replaceFeaturedSection(options.section, matched);
  console.log('[IMPORT] Secao atualizada com sucesso:', options.section);
  console.log('[IMPORT] Itens inseridos:', matched.length);
}

main().catch((error) => {
  console.error('[IMPORT] Falha:', error?.message || error);
  process.exit(1);
});
