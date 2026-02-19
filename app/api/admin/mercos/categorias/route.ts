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

async function fetchWithThrottle(url: string, options: RequestInit): Promise<Response> {
  while (true) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
      const wait = (body.tempo_ate_permitir_novamente || 5) * 1000;
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    return res;
  }
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

    if (!prefix) {
      return NextResponse.json({ success: false, error: 'Parâmetro prefix é obrigatório' }, { status: 400 });
    }

    const appToken = SANDBOX_APP_TOKEN;
    const companyToken = useSandbox ? (customCompanyToken || SANDBOX_COMPANY_TOKEN) : customCompanyToken;
    const baseUrl = useSandbox ? SANDBOX_BASE_URL : 'https://app.mercos.com/api/v1';

    const headers = getMercosHeaders(appToken, companyToken);

    let allCategorias: any[] = [];
    let dataInicial = '2000-01-01T00:00:00';
    let lastId: number | null = null;
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < 100) {
      pageCount++;
      let urlStr = `${baseUrl}/categorias?alterado_apos=${encodeURIComponent(dataInicial)}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
      if (lastId) urlStr += `&id_maior_que=${lastId}`;
      const res = await fetchWithThrottle(urlStr, { headers });

      if (!res.ok) {
        const text = await res.text();
        return NextResponse.json({
          success: false,
          error: `Erro Mercos API: ${res.status}`,
          details: text,
        }, { status: res.status });
      }

      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      allCategorias = [...allCategorias, ...arr];

      const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      if (limitou && arr.length > 0) {
        const last = arr[arr.length - 1];
        dataInicial = last.ultima_alteracao;
        lastId = last.id;
      } else {
        hasMore = false;
      }
    }

    const lower = prefix.toLowerCase();
    let encontradas = allCategorias.filter(c => (c.nome || '').toLowerCase().startsWith(lower));
    let matchMode = 'startsWith';

    if (encontradas.length === 0) {
      encontradas = allCategorias.filter(c => (c.nome || '').toLowerCase().includes(lower));
      matchMode = 'includes';
    }

    // If still nothing found, try fetching by ID directly (sandbox workaround)
    // The sandbox only exposes 2 records via pagination but allows GET by ID
    if (encontradas.length === 0) {
      const idParam = searchParams.get('id');
      if (idParam) {
        const directRes = await fetchWithThrottle(`${baseUrl}/categorias/${idParam}`, { headers });
        if (directRes.ok) {
          const directCat = await directRes.json();
          if (directCat && (directCat.nome || '').toLowerCase().includes(lower)) {
            encontradas = [directCat];
            matchMode = 'directId';
          }
        }
      }
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
