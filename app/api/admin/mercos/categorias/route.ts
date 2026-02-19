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

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  while (true) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 2 }));
      const wait = Math.min((body.tempo_ate_permitir_novamente || 2) * 1000, 5000);
      await sleep(wait);
      continue;
    }
    return res;
  }
}

// Kept for POST/PUT handlers that call fetchThrottled
const fetchThrottled = fetchWithRetry;

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
 * GET /api/admin/mercos/categorias
 * Params:
 *   prefix        - texto para filtrar pelo campo nome
 *   alterado_apos - timestamp ISO de início do processo (ex: "2026-02-19T14:00:00")
 *                   Mercos support: use the time you started the homologation, or 1 min before.
 *   useSandbox    - boolean (default true)
 *   companyToken  - override company token
 *
 * Strategy: GET /categorias?alterado_apos=<start>&id_maior_que=<lastId>
 * Paginate with id_maior_que until MEUSPEDIDOS_LIMITOU_REGISTROS != "1".
 * This is the correct approach per Mercos support.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = (searchParams.get('prefix') || '').trim();
    const alteradoApos = (searchParams.get('alterado_apos') || '').trim();
    const useSandbox = searchParams.get('useSandbox') !== 'false';
    const customCompanyToken = searchParams.get('companyToken') || '';

    if (!prefix) {
      return NextResponse.json({ success: false, error: 'Parâmetro prefix é obrigatório' }, { status: 400 });
    }
    if (!alteradoApos) {
      return NextResponse.json({ success: false, error: 'Parâmetro alterado_apos é obrigatório (informe o horário de início do processo)' }, { status: 400 });
    }

    const appToken = SANDBOX_APP_TOKEN;
    const companyToken = useSandbox ? (customCompanyToken || SANDBOX_COMPANY_TOKEN) : customCompanyToken;
    const baseUrl = useSandbox ? SANDBOX_BASE_URL : 'https://app.mercos.com/api/v1';
    const headers = getMercosHeaders(appToken, companyToken);

    const allCategorias: any[] = [];
    const callLog: any[] = [];
    let page = 0;

    // Paginate using alterado_apos cursor.
    // The sandbox IGNORES id_maior_que — the only working pagination is to advance
    // alterado_apos to the ultima_alteracao of the last record on each page.
    let cursor = alteradoApos;

    while (page < 50) {
      if (page > 0) await sleep(1100); // rate-limit between pages; first call is instant
      page++;
      const url = `${baseUrl}/categorias?alterado_apos=${encodeURIComponent(cursor)}`;
      const reqTs = new Date().toISOString();
      const res = await fetchThrottled(url, { headers });
      const resTs = new Date().toISOString();
      const data = await res.json().catch(() => []);
      const arr = Array.isArray(data) ? data : [];

      const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
      const totalMercos = res.headers.get('meuspedidos_qtde_total_registros');

      callLog.push({
        page,
        request: {
          timestamp: reqTs,
          method: 'GET',
          url,
          headers: { ApplicationToken: appToken, CompanyToken: companyToken },
        },
        response: {
          timestamp: resTs,
          status: res.status,
          headers: {
            MEUSPEDIDOS_LIMITOU_REGISTROS: limitou,
            meuspedidos_qtde_total_registros: totalMercos,
          },
          body: arr,
        },
      });

      for (const c of arr) allCategorias.push(c);

      // No more pages
      if (limitou !== '1' || arr.length === 0) break;

      // Advance cursor to last record's timestamp to get next page
      const lastTs = arr[arr.length - 1].ultima_alteracao.replace(' ', 'T');
      if (lastTs === cursor) break; // safety: avoid infinite loop if timestamp doesn't advance
      cursor = lastTs;
    }

    const lower = prefix.toLowerCase();
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
      categorias: encontradas.map(c => ({
        id: c.id,
        nome: c.nome,
        categoria_pai_id: c.categoria_pai_id ?? null,
        ultima_alteracao: c.ultima_alteracao,
        excluido: c.excluido,
      })),
      log: callLog,
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
    const requestTimestamp = new Date().toISOString();
    const res = await fetchThrottled(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const responseTimestamp = new Date().toISOString();

    const responseText = await res.text();
    let responseData: any = null;
    try { responseData = JSON.parse(responseText); } catch { responseData = responseText; }

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => { responseHeaders[k] = v; });

    const log = {
      request: {
        timestamp: requestTimestamp,
        method: 'POST',
        url,
        headers: { ApplicationToken: appToken, CompanyToken: companyToken, 'Content-Type': 'application/json' },
        body: payload,
      },
      response: {
        timestamp: responseTimestamp,
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseData,
      },
    };

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro Mercos API: ${res.status}`,
        details: responseData,
        status_code: res.status,
        log,
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      categoria: responseData,
      status_code: res.status,
      message: 'Categoria criada com sucesso no Mercos',
      log,
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
    const requestTimestamp = new Date().toISOString();
    const res = await fetchThrottled(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
    const responseTimestamp = new Date().toISOString();

    const responseText = await res.text();
    let responseData: any = null;
    try { responseData = JSON.parse(responseText); } catch { responseData = responseText; }

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((v, k) => { responseHeaders[k] = v; });

    const log = {
      request: {
        timestamp: requestTimestamp,
        method: 'PUT',
        url,
        headers: { ApplicationToken: appToken, CompanyToken: companyToken, 'Content-Type': 'application/json' },
        body: payload,
      },
      response: {
        timestamp: responseTimestamp,
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: responseData,
      },
    };

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `Erro Mercos API: ${res.status}`,
        details: responseData,
        status_code: res.status,
        log,
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      categoria: responseData,
      status_code: res.status,
      message: `Categoria ${id} atualizada com sucesso`,
      log,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
