import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 300;

const CRON_BUDGET_MS = 260_000;
const LOCK_STALE_MS = 10 * 60 * 1000;
const DEFAULT_MAX_DISTRIBUIDORES = 5;
const DEFAULT_BATCHES_PER_DISTRIBUIDOR = 2;
const DEFAULT_BATCH_SIZE = 200;
const SYNC_STATUS_ID_PREFIX = 'sync_';

type SyncStatusRow = {
  id: string;
  distribuidor_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  last_processed_id: number | null;
  last_processed_date: string | null;
  total_processed: number;
  errors: unknown;
  updated_at: string | null;
  last_run_at: string | null;
};

type DistribuidorRow = {
  id: string;
  nome: string;
  ativo: boolean;
  base_url: string | null;
  application_token: string | null;
  company_token: string | null;
  mercos_application_token: string | null;
  mercos_company_token: string | null;
  ultima_sincronizacao: string | null;
};

type ProcessBatchResult = {
  processed: number;
  created: number;
  updated: number;
  deleted: number;
  latestTimestamp: string | null;
  hasMore: boolean;
  nextCursorDate: string | null;
  nextCursorId: number | null;
};

function isoNow(): string {
  return new Date().toISOString();
}

function syncStatusId(distribuidorId: string): string {
  return `${SYNC_STATUS_ID_PREFIX}${distribuidorId}`;
}

function clampInt(
  raw: string | null,
  min: number,
  max: number,
  fallback: number
): number {
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function bumpIsoSecond(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Date(d.getTime() + 1000).toISOString();
}

function toStringErrors(errors: unknown): string[] {
  if (Array.isArray(errors)) {
    return errors
      .map((e) => (typeof e === 'string' ? e : JSON.stringify(e)))
      .slice(-50);
  }
  return [];
}

async function ensureSyncStatusRow(distribuidorId: string): Promise<SyncStatusRow> {
  const id = syncStatusId(distribuidorId);
  await supabaseAdmin.from('sync_status').upsert(
    {
      id,
      distribuidor_id: distribuidorId,
      status: 'pending',
      total_processed: 0,
      errors: [],
    },
    { onConflict: 'id', ignoreDuplicates: true }
  );

  const { data, error } = await supabaseAdmin
    .from('sync_status')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error(`Falha ao carregar sync_status (${distribuidorId})`);
  }

  return data as SyncStatusRow;
}

async function acquireLock(distribuidorId: string): Promise<{ acquired: boolean; row: SyncStatusRow }> {
  const row = await ensureSyncStatusRow(distribuidorId);
  const staleThreshold = Date.now() - LOCK_STALE_MS;
  const updatedAtMs = row.updated_at ? new Date(row.updated_at).getTime() : 0;
  const locked = row.status === 'in_progress' && updatedAtMs > staleThreshold;
  if (locked) {
    return { acquired: false, row };
  }

  const now = isoNow();
  let updateQuery = supabaseAdmin
    .from('sync_status')
    .update({
      status: 'in_progress',
      last_run_at: now,
      updated_at: now,
    })
    .eq('id', row.id);

  if (row.updated_at) {
    updateQuery = updateQuery.eq('updated_at', row.updated_at);
  }

  const { data: lockedRow, error } = await updateQuery.select('*').maybeSingle();
  if (error) {
    throw new Error(`Falha ao adquirir lock (${distribuidorId}): ${error.message}`);
  }

  if (!lockedRow) {
    return { acquired: false, row };
  }

  return { acquired: true, row: lockedRow as SyncStatusRow };
}

async function saveStatus(
  rowId: string,
  patch: Partial<Pick<SyncStatusRow, 'status' | 'last_processed_id' | 'last_processed_date' | 'total_processed' | 'errors' | 'last_run_at'>>
) {
  const payload: Record<string, unknown> = {
    updated_at: isoNow(),
    ...patch,
  };

  const { error } = await supabaseAdmin
    .from('sync_status')
    .update(payload)
    .eq('id', rowId);

  if (error) {
    throw new Error(`Falha ao atualizar sync_status: ${error.message}`);
  }
}

async function buildCategoryMap(distribuidorId: string): Promise<Map<number, string>> {
  const { data: distRows, error: distError } = await supabaseAdmin
    .from('distribuidor_categories')
    .select('mercos_id')
    .eq('distribuidor_id', distribuidorId)
    .eq('ativo', true);

  if (distError) {
    throw new Error(`Falha ao carregar categorias do distribuidor (${distribuidorId}): ${distError.message}`);
  }

  const mercosIds = Array.from(
    new Set(
      (distRows || [])
        .map((row: any) => Number(row?.mercos_id))
        .filter((mercosId) => Number.isFinite(mercosId))
    )
  );

  if (mercosIds.length === 0) {
    return new Map<number, string>();
  }

  const { data: globalRows, error: globalError } = await supabaseAdmin
    .from('categories')
    .select('id, mercos_id')
    .eq('active', true)
    .in('mercos_id', mercosIds);

  if (globalError) {
    throw new Error(`Falha ao carregar categorias globais (${distribuidorId}): ${globalError.message}`);
  }

  const map = new Map<number, string>();
  for (const row of globalRows || []) {
    if (row?.mercos_id !== null && row?.mercos_id !== undefined && row?.id) {
      map.set(Number(row.mercos_id), row.id as string);
    }
  }
  return map;
}

async function processOneMercosBatch(
  mercosApi: MercosAPI,
  distribuidor: DistribuidorRow,
  categoryMap: Map<number, string>,
  cursorDate: string | null,
  cursorId: number | null,
  batchSize: number
): Promise<ProcessBatchResult> {
  const { produtos, limited } = await mercosApi.getBatchProdutosByAlteracao({
    alteradoApos: cursorDate,
    afterId: cursorId,
    limit: batchSize,
    orderDirection: 'asc',
  });

  if (!produtos.length) {
    return {
      processed: 0,
      created: 0,
      updated: 0,
      deleted: 0,
      latestTimestamp: cursorDate,
      hasMore: false,
      nextCursorDate: cursorDate,
      nextCursorId: null,
    };
  }

  const mercosIds = produtos.map((p) => p.id);
  const { data: existingRows } = await supabaseAdmin
    .from('products')
    .select('id, mercos_id, images, category_id')
    .eq('distribuidor_id', distribuidor.id)
    .in('mercos_id', mercosIds);

  const existingByMercosId = new Map<number, { id: string; images: unknown; category_id: string | null }>(
    (existingRows || []).map((r: any) => [
      Number(r.mercos_id),
      { id: r.id as string, images: r.images, category_id: r.category_id as string | null },
    ])
  );

  const toDeleteIds: string[] = [];
  const toInsertPayload: any[] = [];
  const toUpdatePayload: Array<{ id: string; data: any }> = [];
  let created = 0;
  let updated = 0;

  for (const produto of produtos) {
    const existing = existingByMercosId.get(produto.id);

    if (produto.excluido) {
      if (existing?.id) {
        toDeleteIds.push(existing.id);
      }
      continue;
    }

    const mappedCategoryId = produto.categoria_id ? categoryMap.get(Number(produto.categoria_id)) || null : null;
    const existingImages = existing?.images;
    const hasExistingImages = Array.isArray(existingImages) && existingImages.length > 0;
    const finalCategoryId = mappedCategoryId || null;
    const isActive = !produto.excluido && produto.ativo !== false;

    const payload = {
      name: produto.nome,
      description: produto.observacoes || '',
      price: produto.preco_tabela,
      stock_qty: produto.saldo_estoque || 0,
      images: hasExistingImages ? existingImages : [],
      banca_id: null,
      distribuidor_id: distribuidor.id,
      mercos_id: produto.id,
      codigo_mercos: produto.codigo || null,
      category_id: finalCategoryId,
      categoria_mercos: produto.categoria_id || null,
      origem: 'mercos',
      sincronizado_em: isoNow(),
      track_stock: true,
      sob_encomenda: false,
      pre_venda: false,
      pronta_entrega: true,
      active: isActive,
      ativo: isActive,
      excluido: false,
      updated_at: isoNow(),
    };

    if (existing) {
      toUpdatePayload.push({ id: existing.id, data: payload });
      updated++;
    } else {
      toInsertPayload.push(payload);
      created++;
    }
  }

  if (toDeleteIds.length > 0) {
    await supabaseAdmin.from('products').delete().in('id', toDeleteIds);
  }

  if (toInsertPayload.length > 0) {
    const { error: insertError } = await supabaseAdmin
      .from('products')
      .insert(toInsertPayload);
    if (insertError) {
      const isDuplicateError =
        insertError.code === '23505' ||
        (insertError.message || '').toLowerCase().includes('duplicate') ||
        (insertError.message || '').toLowerCase().includes('unique');

      if (!isDuplicateError) {
        throw new Error(`Erro ao inserir produtos: ${insertError.message}`);
      }

      // Fallback: em caso de duplicidade corrida, tenta item a item e segue.
      for (const payload of toInsertPayload) {
        const { error: singleInsertError } = await supabaseAdmin
          .from('products')
          .insert(payload);
        if (singleInsertError) {
          const singleDuplicate =
            singleInsertError.code === '23505' ||
            (singleInsertError.message || '').toLowerCase().includes('duplicate') ||
            (singleInsertError.message || '').toLowerCase().includes('unique');
          if (!singleDuplicate) {
            throw new Error(`Erro ao inserir produto individual: ${singleInsertError.message}`);
          }
        }
      }
    }
  }

  if (toUpdatePayload.length > 0) {
    const UPDATE_CONCURRENCY = 10;
    for (let i = 0; i < toUpdatePayload.length; i += UPDATE_CONCURRENCY) {
      const chunk = toUpdatePayload.slice(i, i + UPDATE_CONCURRENCY);
      const results = await Promise.allSettled(
        chunk.map(async (item) => {
          const { error } = await supabaseAdmin
            .from('products')
            .update(item.data)
            .eq('id', item.id);
          if (error) throw error;
        })
      );
      const failed = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
      if (failed) {
        throw new Error(`Erro ao atualizar produtos existentes: ${failed.reason?.message || failed.reason}`);
      }
    }
  }

  const sorted = [...produtos].sort((a, b) => {
    const ta = (a.ultima_alteracao || '').toString();
    const tb = (b.ultima_alteracao || '').toString();
    if (ta < tb) return -1;
    if (ta > tb) return 1;
    return a.id - b.id;
  });
  const last = sorted[sorted.length - 1];
  const latestTimestamp = (last?.ultima_alteracao || cursorDate || null) as string | null;
  let nextCursorDate = latestTimestamp;
  let nextCursorId = last?.id ? Number(last.id) : null;
  const hasMore = limited && produtos.length > 0;

  if (hasMore && nextCursorDate === cursorDate && nextCursorId === cursorId) {
    nextCursorDate = bumpIsoSecond(nextCursorDate);
    nextCursorId = null;
  }

  if (!hasMore) {
    nextCursorId = null;
  }

  return {
    processed: produtos.length,
    created,
    updated,
    deleted: toDeleteIds.length,
    latestTimestamp,
    hasMore,
    nextCursorDate,
    nextCursorId,
  };
}

async function runDistribuidorChunk(
  distribuidor: DistribuidorRow,
  options: {
    forceFullSync: boolean;
    maxBatches: number;
    batchSize: number;
  }
) {
  const lock = await acquireLock(distribuidor.id);
  if (!lock.acquired) {
    return {
      distribuidor: distribuidor.nome,
      success: true,
      skipped: true,
      reason: 'lock_em_uso',
    };
  }

  const statusRow = lock.row;
  const previousErrors = toStringErrors(statusRow.errors);
  const categoryMap = await buildCategoryMap(distribuidor.id);

  const appToken = distribuidor.mercos_application_token || distribuidor.application_token;
  const companyToken = distribuidor.mercos_company_token || distribuidor.company_token;
  if (!appToken || !companyToken) {
    await saveStatus(statusRow.id, {
      status: 'failed',
      errors: [...previousErrors, 'Tokens Mercos não configurados'].slice(-50),
    });
    return {
      distribuidor: distribuidor.nome,
      success: false,
      error: 'Tokens Mercos não configurados',
    };
  }

  const mercosApi = new MercosAPI({
    applicationToken: appToken,
    companyToken,
    baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
  });

  const connection = await mercosApi.testConnection();
  if (!connection.success) {
    await saveStatus(statusRow.id, {
      status: 'failed',
      errors: [...previousErrors, `Falha de conexão Mercos: ${connection.error || 'erro desconhecido'}`].slice(-50),
    });
    return {
      distribuidor: distribuidor.nome,
      success: false,
      error: connection.error || 'Falha de conexão Mercos',
    };
  }

  let cursorDate = options.forceFullSync
    ? null
    : (statusRow.last_processed_date || distribuidor.ultima_sincronizacao || null);
  let cursorId = options.forceFullSync
    ? null
    : (statusRow.last_processed_id || null);

  let processed = 0;
  let created = 0;
  let updated = 0;
  let deleted = 0;
  let batches = 0;
  let hasMore = false;
  let latestTimestamp: string | null = cursorDate;

  try {
    for (let i = 0; i < options.maxBatches; i++) {
      const batch = await processOneMercosBatch(
        mercosApi,
        distribuidor,
        categoryMap,
        cursorDate,
        cursorId,
        options.batchSize
      );

      batches++;
      processed += batch.processed;
      created += batch.created;
      updated += batch.updated;
      deleted += batch.deleted;
      latestTimestamp = batch.latestTimestamp || latestTimestamp;
      hasMore = batch.hasMore;
      cursorDate = batch.nextCursorDate;
      cursorId = batch.nextCursorId;

      if (!batch.hasMore || batch.processed === 0) {
        break;
      }
    }

    const totalProcessed = (statusRow.total_processed || 0) + processed;
    const finalStatus: SyncStatusRow['status'] = hasMore ? 'pending' : 'completed';
    await saveStatus(statusRow.id, {
      status: finalStatus,
      last_processed_date: cursorDate,
      last_processed_id: cursorId,
      total_processed: totalProcessed,
      errors: previousErrors,
      last_run_at: isoNow(),
    });

    if (!hasMore && latestTimestamp) {
      const { count: totalAtivos } = await supabaseAdmin
        .from('products')
        .select('*', { head: true, count: 'exact' })
        .eq('distribuidor_id', distribuidor.id)
        .eq('active', true);

      await supabaseAdmin
        .from('distribuidores')
        .update({
          ultima_sincronizacao: latestTimestamp,
          total_produtos: totalAtivos || 0,
        })
        .eq('id', distribuidor.id);
    }

    return {
      distribuidor: distribuidor.nome,
      success: true,
      skipped: false,
      batches,
      processed,
      created,
      updated,
      deleted,
      has_more: hasMore,
      cursor_date: cursorDate,
      cursor_id: cursorId,
      categorias_mapeadas: categoryMap.size,
    };
  } catch (error: any) {
    const errMsg = error?.message || 'Erro desconhecido durante sync chunk';
    await saveStatus(statusRow.id, {
      status: 'failed',
      errors: [...previousErrors, errMsg].slice(-50),
      last_processed_date: cursorDate,
      last_processed_id: cursorId,
      total_processed: (statusRow.total_processed || 0) + processed,
      last_run_at: isoNow(),
    });
    return {
      distribuidor: distribuidor.nome,
      success: false,
      skipped: false,
      error: errMsg,
      processed,
      created,
      updated,
      deleted,
      cursor_date: cursorDate,
      cursor_id: cursorId,
    };
  }
}

/**
 * Cron robusto em modo "chunked + checkpoint + lock".
 * Cada execução processa poucos lotes por distribuidor e retoma na próxima chamada.
 */
export async function POST(request: NextRequest) {
  const startedAt = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isProduction = process.env.NODE_ENV === 'production';
    const secretFromQuery =
      searchParams.get('cron_secret') ||
      searchParams.get('secret') ||
      searchParams.get('token');

    if (isProduction && !cronSecret) {
      return NextResponse.json(
        { success: false, error: 'CRON_SECRET não configurado em produção' },
        { status: 500 }
      );
    }

    const hasValidAuth = cronSecret
      ? authHeader === `Bearer ${cronSecret}` || secretFromQuery === cronSecret
      : true;

    if (!hasValidAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const forceFullSync = searchParams.get('full') === 'true';
    const maxDistribuidores = clampInt(
      searchParams.get('max_distribuidores'),
      1,
      20,
      DEFAULT_MAX_DISTRIBUIDORES
    );
    const maxBatches = clampInt(
      searchParams.get('batches'),
      1,
      10,
      DEFAULT_BATCHES_PER_DISTRIBUIDOR
    );
    const batchSize = clampInt(
      searchParams.get('batch_size'),
      50,
      200,
      DEFAULT_BATCH_SIZE
    );

    const { data: distribuidores, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select(
        'id, nome, ativo, base_url, application_token, company_token, mercos_application_token, mercos_company_token, ultima_sincronizacao'
      )
      .eq('ativo', true)
      .order('updated_at', { ascending: true })
      .limit(maxDistribuidores);

    if (distError || !distribuidores) {
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar distribuidores ativos' },
        { status: 500 }
      );
    }

    const resultados: any[] = [];

    for (const distribuidor of distribuidores as DistribuidorRow[]) {
      if ((Date.now() - startedAt) > CRON_BUDGET_MS) {
        resultados.push({
          distribuidor: distribuidor.nome,
          success: true,
          skipped: true,
          reason: 'budget_excedido',
        });
        continue;
      }

      const res = await runDistribuidorChunk(distribuidor, {
        forceFullSync,
        maxBatches,
        batchSize,
      });
      resultados.push(res);
    }

    const sucesso = resultados.filter((r) => r.success && !r.skipped).length;
    const falhas = resultados.filter((r) => !r.success).length;
    const pulados = resultados.filter((r) => r.skipped).length;

    return NextResponse.json({
      success: falhas === 0,
      mode: 'chunked',
      executado_em: isoNow(),
      config: {
        force_full: forceFullSync,
        max_distribuidores: maxDistribuidores,
        max_batches: maxBatches,
        batch_size: batchSize,
      },
      resumo: {
        total_distribuidores: distribuidores.length,
        sucesso,
        falhas,
        pulados,
        tempo_execucao_ms: Date.now() - startedAt,
      },
      resultados,
    }, { status: falhas > 0 ? 207 : 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro inesperado no cron de sincronização' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
