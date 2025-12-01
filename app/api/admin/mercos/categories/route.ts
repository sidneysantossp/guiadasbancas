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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const prefix = (body.prefix || '').trim();
    const distribuidorId = body.distribuidorId;
    const limit = body.limit && body.limit > 0 ? Math.min(body.limit, 200) : 50;
    const useSandbox = !!body.useSandbox;
    const alteradoApos = body.alteradoApos || null;
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
      const filtradas = categorias.filter((c) => (c?.nome || '').toLowerCase().startsWith(prefix.toLowerCase()));

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginadas = filtradas.slice(start, end);

      return NextResponse.json({
        success: true,
        distribuidor: { id: 'sandbox', nome: 'Sandbox Mercos' },
        prefix,
        alteradoApos,
        total_categorias: categorias.length,
        encontrados: filtradas.length,
        page,
        pageSize,
        totalPaginas: Math.max(1, Math.ceil(filtradas.length / pageSize)),
        categorias: paginadas,
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
    const filtradas = categorias.filter((c) => (c?.nome || '').toLowerCase().startsWith(prefix.toLowerCase()));

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginadas = filtradas.slice(start, end);

    return NextResponse.json({
      success: true,
      distribuidor: { id: dist.id, nome: dist.nome },
      prefix,
      alteradoApos,
      total_categorias: categorias.length,
      encontrados: filtradas.length,
      page,
      pageSize,
      totalPaginas: Math.max(1, Math.ceil(filtradas.length / pageSize)),
      categorias: paginadas,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Use POST' }, { status: 405 });
}
