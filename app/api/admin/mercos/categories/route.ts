import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 120;

type Body = {
  prefix?: string;
  distribuidorId?: string;
  limit?: number;
  useSandbox?: boolean;
  alteradoApos?: string | null;
  page?: number;
  pageSize?: number;
};

const SANDBOX_DEFAULT_APP = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
const SANDBOX_DEFAULT_COMPANY = '4b866744-a086-11f0-ada6-5e65486a6283';
const SANDBOX_DEFAULT_URL = 'https://sandbox.mercos.com/api/v1';

const parseAlteradoApos = (value: string | null | undefined): { cursor: string | null; warning?: string } => {
  if (!value) return { cursor: null };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { cursor: null, warning: 'alterado_apos inválido, usando padrão.' };
  const now = new Date();
  if (date > now) return { cursor: null, warning: 'alterado_apos no futuro, usando padrão.' };
  return { cursor: date.toISOString() };
};

const filterCategorias = (categorias: any[], prefix: string) => {
  const lower = prefix.toLowerCase();
  let matchMode: 'startsWith' | 'includes' | 'all' = 'startsWith';
  let filtradas = categorias.filter((c) => (c?.nome || '').toLowerCase().startsWith(lower));

  if (filtradas.length === 0 && prefix) {
    matchMode = 'includes';
    filtradas = categorias.filter((c) => (c?.nome || '').toLowerCase().includes(lower));
  }

  if (filtradas.length === 0) {
    matchMode = 'all';
    filtradas = categorias;
  }

  return { filtradas, matchMode };
};

const buildLog = (params: {
  source: 'sandbox' | 'prod';
  distribuidor: { id: string; nome: string };
  prefix: string;
  alteradoApos: string | null;
  page: number;
  pageSize: number;
  matchMode: 'startsWith' | 'includes' | 'all';
  fallback: boolean;
  totalCategorias: number;
  encontrados: number;
  paginadas: any[];
  warning?: string;
}) => ({
  timestamp: new Date().toISOString(),
  source: params.source,
  distribuidor: params.distribuidor,
  request: {
    prefix: params.prefix,
    alteradoApos: params.alteradoApos,
    page: params.page,
    pageSize: params.pageSize,
    matchMode: params.matchMode,
  },
  counts: {
    total_categorias: params.totalCategorias,
    encontrados: params.encontrados,
    paginadas: params.paginadas.length,
  },
  fallback: params.fallback,
  warning: params.warning,
  pageData: params.paginadas,
});

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const prefix = (body.prefix || '').trim();
    const distribuidorId = body.distribuidorId;
    const limit = body.limit && body.limit > 0 ? Math.min(body.limit, 200) : 50;
    const useSandbox = !!body.useSandbox;
    const { cursor: alteradoApos, warning: alterWarn } = parseAlteradoApos(body.alteradoApos);
    const page = body.page && body.page > 0 ? body.page : 1;
    const pageSize = body.pageSize && body.pageSize > 0 ? Math.min(body.pageSize, 200) : 50;

    if (!prefix) {
      return NextResponse.json({ success: false, error: 'Prefixo é obrigatório' }, { status: 400 });
    }

    // Se usar sandbox, ignorar tokens do distribuidor e usar envs de sandbox
    if (useSandbox) {
      const appToken = process.env.MERCOS_SANDBOX_APPLICATION_TOKEN || process.env.MERCOS_APPLICATION_TOKEN || SANDBOX_DEFAULT_APP;
      const companyToken = process.env.MERCOS_SANDBOX_COMPANY_TOKEN || process.env.MERCOS_COMPANY_TOKEN || SANDBOX_DEFAULT_COMPANY;
      const baseUrl = process.env.MERCOS_SANDBOX_API_URL || SANDBOX_DEFAULT_URL;

      const mercos = new MercosAPI({
        applicationToken: appToken,
        companyToken,
        baseUrl,
      });

      const categorias = await mercos.getAllCategorias({ batchSize: 200, alteradoApos });
      const { filtradas, matchMode } = filterCategorias(categorias, prefix);
      const fallback = matchMode === 'all';

      // Se nada com cursor e matchMode all, tentar full fetch sem cursor
      let finalFiltradas = filtradas;
      if (fallback && alteradoApos) {
        const categoriasFull = await mercos.getAllCategorias({ batchSize: 200, alteradoApos: null });
        const second = filterCategorias(categoriasFull, prefix);
        finalFiltradas = second.filtradas;
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginadas = finalFiltradas.slice(start, end);

      return NextResponse.json({
        success: true,
        distribuidor: { id: 'sandbox', nome: 'Sandbox Mercos' },
        prefix,
        alteradoApos,
        warning: alterWarn,
        fallback,
        matchMode,
        total_categorias: categorias.length,
        encontrados: finalFiltradas.length,
        page,
        pageSize,
        totalPaginas: Math.max(1, Math.ceil(finalFiltradas.length / pageSize)),
        categorias: paginadas,
        log: buildLog({
          source: 'sandbox',
          distribuidor: { id: 'sandbox', nome: 'Sandbox Mercos' },
          prefix,
          alteradoApos,
          page,
          pageSize,
          matchMode,
          fallback,
          totalCategorias: categorias.length,
          encontrados: finalFiltradas.length,
          paginadas,
          warning: alterWarn,
        }),
      });
    }

    // Produção: usa tokens do distribuidor ativo
    const { data: distribuidores, error } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, application_token, company_token, base_url, ativo')
      .eq('ativo', true);

    if (error || !distribuidores || distribuidores.length === 0) {
      return NextResponse.json({ success: false, error: 'Nenhum distribuidor ativo encontrado' }, { status: 404 });
    }

    const dist = distribuidorId
      ? distribuidores.find((d) => d.id === distribuidorId)
      : distribuidores[0];

    if (!dist) {
      return NextResponse.json({ success: false, error: 'Distribuidor não encontrado ou inativo' }, { status: 404 });
    }

    const mercos = new MercosAPI({
      applicationToken: dist.application_token,
      companyToken: dist.company_token,
      baseUrl: dist.base_url || process.env.MERCOS_API_URL || 'https://app.mercos.com/api/v1',
    });

    const categorias = await mercos.getAllCategorias({ batchSize: 200, alteradoApos });
    const { filtradas, matchMode } = filterCategorias(categorias, prefix);
    const fallback = matchMode === 'all';

    let finalFiltradas = filtradas;
    if (fallback && alteradoApos) {
      const categoriasFull = await mercos.getAllCategorias({ batchSize: 200, alteradoApos: null });
      const second = filterCategorias(categoriasFull, prefix);
      finalFiltradas = second.filtradas;
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginadas = finalFiltradas.slice(start, end);

    return NextResponse.json({
      success: true,
      distribuidor: { id: dist.id, nome: dist.nome },
      prefix,
      warning: alterWarn,
      fallback,
      matchMode,
      alteradoApos,
      total_categorias: categorias.length,
      encontrados: finalFiltradas.length,
      page,
      pageSize,
      totalPaginas: Math.max(1, Math.ceil(finalFiltradas.length / pageSize)),
      categorias: paginadas,
      log: buildLog({
        source: 'prod',
        distribuidor: { id: dist.id, nome: dist.nome },
        prefix,
        alteradoApos,
        page,
        pageSize,
        matchMode,
        fallback,
        totalCategorias: categorias.length,
        encontrados: finalFiltradas.length,
        paginadas,
        warning: alterWarn,
      }),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Use POST' }, { status: 405 });
}
