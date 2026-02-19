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

async function fetchWithThrottle(url: string, options: RequestInit, maxWaitMs = 3000): Promise<Response> {
  while (true) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 3 }));
      const wait = Math.min((body.tempo_ate_permitir_novamente || 3) * 1000, maxWaitMs);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    return res;
  }
}

/**
 * Fetch categories from a given date window, advancing cursor by +1s each page.
 * Stops early if prefix is found. Returns true if prefix was found.
 */
async function fetchWindow(
  baseUrl: string,
  headers: Record<string, string>,
  startDate: string,
  seenIds: Set<number>,
  out: any[],
  prefix: string,
  deadline: number
): Promise<boolean> {
  let cursor = startDate;
  let page = 0;
  while (page < 60) {
    if (Date.now() > deadline) break;
    page++;
    const urlStr = `${baseUrl}/categorias?alterado_apos=${encodeURIComponent(cursor)}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
    const res = await fetchWithThrottle(urlStr, { headers });
    if (!res.ok) break;
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    if (arr.length === 0) break;
    let addedNew = false;
    for (const c of arr) {
      if (!seenIds.has(c.id)) {
        seenIds.add(c.id);
        out.push(c);
        addedNew = true;
      }
    }
    // Check if prefix found so far
    const found = out.some(c => (c.nome || '').toLowerCase().includes(prefix));
    if (found) return true;
    const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
    if (!limitou || !addedNew) break;
    const last = arr[arr.length - 1];
    const d = new Date(last.ultima_alteracao.replace(' ', 'T') + 'Z');
    d.setSeconds(d.getSeconds() + 1);
    const next = d.toISOString().slice(0, 19);
    if (next <= cursor) break;
    cursor = next;
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

    // Deadline: 45s from now (Vercel limit is 60s, leave buffer)
    const deadline = Date.now() + 45_000;

    // The sandbox returns different records per date window.
    // Key windows discovered empirically: today, this year, 2025-01-01, 2000-01-01.
    // We stop early as soon as the prefix is found.
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = String(now.getMonth() + 1).padStart(2, '0');
    const thisDay = String(now.getDate()).padStart(2, '0');

    const windows = [
      `${thisYear}-${thisMonth}-${thisDay}T00:00:00`,
      `${thisYear}-01-01T00:00:00`,
      `${thisYear - 1}-01-01T00:00:00`,
      '2025-11-01T00:00:00',
      '2025-01-01T00:00:00',
      '2000-01-01T00:00:00',
    ];

    // Try direct ID fetch first (fastest path)
    if (idParam) {
      const directRes = await fetchWithThrottle(`${baseUrl}/categorias/${idParam}`, { headers });
      if (directRes.ok) {
        const directCat = await directRes.json();
        if (directCat?.id && !seenIds.has(directCat.id)) {
          seenIds.add(directCat.id);
          allCategorias.push(directCat);
        }
      }
    }

    // Fetch windows sequentially, stop early if prefix found
    for (const w of windows) {
      if (Date.now() > deadline) break;
      const found = await fetchWindow(baseUrl, headers, w, seenIds, allCategorias, lower, deadline);
      if (found) break;
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
    const res = await fetchWithThrottle(url, {
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
    const res = await fetchWithThrottle(url, {
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
