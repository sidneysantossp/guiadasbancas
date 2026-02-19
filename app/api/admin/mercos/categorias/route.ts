import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
const SANDBOX_COMPANY_TOKEN = '4b866744-a086-11f0-ada6-5e65486a6283';
const SANDBOX_BASE_URL = 'https://sandbox.mercos.com/api/v1';

function getMercosHeaders(appToken: string, companyToken: string) {
  return {
    'ApplicationToken': appToken,
    'CompanyToken': companyToken,
    'Content-Type': 'application/json',
  };
}

// Global request queue: Mercos sandbox allows ~1 req/s
let lastRequestTime = 0;
async function fetchThrottled(url: string, options: RequestInit): Promise<Response> {
  while (true) {
    const now = Date.now();
    const elapsed = now - lastRequestTime;
    if (elapsed < 1100) await new Promise(r => setTimeout(r, 1100 - elapsed));
    lastRequestTime = Date.now();
    const res = await fetch(url, options);
    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 2 }));
      const wait = Math.min((body.tempo_ate_permitir_novamente || 2) * 1000, 5000);
      await new Promise(r => setTimeout(r, wait));
      lastRequestTime = Date.now();
      continue;
    }
    return res;
  }
}

/**
 * Scan all categories from startDate to now.
 * When a page returns results, advance cursor to last record's timestamp.
 * When a page returns 0, jump forward exponentially (1s → 1min → 1h → 1day)
 * until we find more records or pass the current time.
 * Returns true (and stops) as soon as prefix is found.
 */
async function scanFrom(
  baseUrl: string,
  headers: Record<string, string>,
  startDate: string,
  seenIds: Set<number>,
  out: any[],
  prefix: string,
  deadline: number
): Promise<boolean> {
  let cursor = startDate;
  const nowTs = new Date().toISOString().slice(0, 19);
  // Jump sizes in seconds when we get 0 results: 1s, 60s, 3600s, 86400s
  const jumpSizes = [1, 60, 3600, 86400];
  let jumpIdx = 0;
  let page = 0;

  while (page < 200) {
    if (Date.now() > deadline) break;
    if (cursor > nowTs) break; // past current time, nothing more to find

    page++;
    const urlStr = `${baseUrl}/categorias?alterado_apos=${encodeURIComponent(cursor)}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
    const res = await fetchThrottled(urlStr, { headers });
    if (!res.ok) break;
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];

    if (arr.length === 0) {
      // No results — jump forward
      const d = new Date(cursor + 'Z');
      d.setSeconds(d.getSeconds() + jumpSizes[jumpIdx]);
      const next = d.toISOString().slice(0, 19);
      // Escalate jump size for next empty response
      if (jumpIdx < jumpSizes.length - 1) jumpIdx++;
      cursor = next;
      continue;
    }

    // Got results — reset jump size
    jumpIdx = 0;
    for (const c of arr) {
      if (!seenIds.has(c.id)) { seenIds.add(c.id); out.push(c); }
    }
    if (out.some(c => (c.nome || '').toLowerCase().includes(prefix))) return true;

    const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
    const last = arr[arr.length - 1];
    const lastTs = last.ultima_alteracao.replace(' ', 'T');

    if (!limitou) {
      // No more pages after this — jump past last record
      const d = new Date(lastTs + 'Z');
      d.setSeconds(d.getSeconds() + 1);
      cursor = d.toISOString().slice(0, 19);
      jumpIdx = 0;
    } else {
      // More pages — use exact last timestamp as next cursor
      cursor = lastTs;
    }
  }
  return false;
}

/**
 * GET /api/admin/mercos/categorias?prefix=xxx&useSandbox=true&companyToken=xxx
 * Busca categorias pelo prefixo do nome (Etapa 1 - GET)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = (searchParams.get('prefix') || '').trim();
    const useSandbox = searchParams.get('useSandbox') !== 'false';
    const customCompanyToken = searchParams.get('companyToken') || '';
    const idParam = searchParams.get('id') || '';

    if (!prefix) {
      return NextResponse.json({ success: false, error: 'Parâmetro prefix é obrigatório' }, { status: 400 });
    }

    const appToken = SANDBOX_APP_TOKEN;
    const companyToken = useSandbox ? (customCompanyToken || SANDBOX_COMPANY_TOKEN) : customCompanyToken;
    const baseUrl = useSandbox ? SANDBOX_BASE_URL : 'https://app.mercos.com/api/v1';
    const headers = getMercosHeaders(appToken, companyToken);

    const seenIds = new Set<number>();
    const allCategorias: any[] = [];
    const lower = prefix.toLowerCase();
    let scanCompleto = false;

    // Deadline: 50s from now (Vercel limit is 60s)
    const deadline = Date.now() + 50_000;

    const foundInList = () => allCategorias.some(c => (c.nome || '').toLowerCase().includes(lower));

    // Helper: single fetch for a given alterado_apos cursor (no pagination)
    async function fetchCursor(cursor: string): Promise<any[]> {
      const res = await fetchThrottled(
        `${baseUrl}/categorias?alterado_apos=${encodeURIComponent(cursor)}`,
        { headers }
      );
      if (!res.ok) return [];
      const data = await res.json().catch(() => []);
      return Array.isArray(data) ? data : [];
    }

    function addAll(arr: any[]) {
      for (const c of arr) {
        if (!seenIds.has(c.id)) { seenIds.add(c.id); allCategorias.push(c); }
      }
    }

    // 1. Direct ID fetch (instant)
    if (idParam) {
      const directRes = await fetchThrottled(`${baseUrl}/categorias/${idParam}`, { headers });
      if (directRes.ok) {
        const directCat = await directRes.json();
        if (directCat?.id && !seenIds.has(directCat.id)) {
          seenIds.add(directCat.id);
          allCategorias.push(directCat);
        }
      }
    }

    // 2. Fast path: check today and last 7 days (~8 calls, ~10s)
    if (!foundInList()) {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      for (let daysAgo = 0; daysAgo <= 7 && !foundInList() && Date.now() < deadline; daysAgo++) {
        const d = new Date(now);
        d.setDate(d.getDate() - daysAgo);
        const cursor = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00`;
        addAll(await fetchCursor(cursor));
      }
    }

    // 3. Full scan from 2025-01-01 if still not found and time permits
    if (!foundInList() && Date.now() < deadline) {
      await scanFrom(baseUrl, headers, '2025-01-01T00:00:00', seenIds, allCategorias, lower, deadline);
      scanCompleto = Date.now() < deadline; // true = completed before deadline
    } else if (foundInList()) {
      scanCompleto = true;
    }

    let encontradas = allCategorias.filter(c => (c.nome || '').toLowerCase().startsWith(lower));
    let matchMode = 'startsWith';

    if (encontradas.length === 0) {
      encontradas = allCategorias.filter(c => (c.nome || '').toLowerCase().includes(lower));
      matchMode = 'includes';
    }

    return NextResponse.json({
      success: true,
      total_categorias: allCategorias.length,
      encontradas: encontradas.length,
      matchMode,
      scan_completo: scanCompleto,
      categorias: encontradas.map(c => ({
        id: c.id,
        nome: c.nome,
        categoria_pai_id: c.categoria_pai_id ?? null,
        ultima_alteracao: c.ultima_alteracao,
        excluido: c.excluido,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/mercos/categorias
 * Cria uma nova categoria no Mercos Sandbox (Etapa 2 - POST)
 * Body: { nome: string, categoria_pai_id?: number, useSandbox?: boolean, companyToken?: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, categoria_pai_id, useSandbox = true, companyToken: customCompanyToken } = body;

    if (!nome || !nome.trim()) {
      return NextResponse.json({ success: false, error: 'Campo nome é obrigatório' }, { status: 400 });
    }

    const appToken = SANDBOX_APP_TOKEN;
    const companyToken = useSandbox ? (customCompanyToken || SANDBOX_COMPANY_TOKEN) : customCompanyToken;
    const baseUrl = useSandbox ? SANDBOX_BASE_URL : 'https://app.mercos.com/api/v1';

    const headers = getMercosHeaders(appToken, companyToken);
    const payload: any = { nome: nome.trim() };
    if (categoria_pai_id) payload.categoria_pai_id = categoria_pai_id;

    const url = `${baseUrl}/categorias`;
    const res = await fetchThrottled(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let responseData: any = null;
    try { responseData = JSON.parse(responseText); } catch { responseData = responseText; }

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro Mercos API: ${res.status}`,
        details: responseData,
        status_code: res.status,
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      categoria: responseData,
      status_code: res.status,
      message: 'Categoria criada com sucesso no Mercos',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/mercos/categorias
 * Edita uma categoria existente no Mercos Sandbox (Etapa 3 - PUT)
 * Body: { id: number, nome: string, useSandbox?: boolean, companyToken?: string }
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nome, useSandbox = true, companyToken: customCompanyToken } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Campo id é obrigatório' }, { status: 400 });
    }
    if (!nome || !nome.trim()) {
      return NextResponse.json({ success: false, error: 'Campo nome é obrigatório' }, { status: 400 });
    }

    const appToken = SANDBOX_APP_TOKEN;
    const companyToken = useSandbox ? (customCompanyToken || SANDBOX_COMPANY_TOKEN) : customCompanyToken;
    const baseUrl = useSandbox ? SANDBOX_BASE_URL : 'https://app.mercos.com/api/v1';

    const headers = getMercosHeaders(appToken, companyToken);
    const payload = { nome: nome.trim() };

    const url = `${baseUrl}/categorias/${id}`;
    const res = await fetchThrottled(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let responseData: any = null;
    try { responseData = JSON.parse(responseText); } catch { responseData = responseText; }

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro Mercos API: ${res.status}`,
        details: responseData,
        status_code: res.status,
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      categoria: responseData,
      status_code: res.status,
      message: `Categoria ${id} atualizada com sucesso`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
