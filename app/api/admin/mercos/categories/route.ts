import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 120;

type Body = {
  prefix?: string;
  distribuidorId?: string;
  limit?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const prefix = (body.prefix || '').trim();
    const distribuidorId = body.distribuidorId;
    const limit = body.limit && body.limit > 0 ? Math.min(body.limit, 200) : 50;

    if (!prefix) {
      return NextResponse.json({ success: false, error: 'Prefixo é obrigatório' }, { status: 400 });
    }

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
      baseUrl: dist.base_url || 'https://app.mercos.com/api/v1',
    });

    const categorias = await mercos.getAllCategorias();
    const filtradas = categorias.filter((c) => (c?.nome || '').toLowerCase().startsWith(prefix.toLowerCase()));

    return NextResponse.json({
      success: true,
      distribuidor: { id: dist.id, nome: dist.nome },
      prefix,
      total_categorias: categorias.length,
      encontrados: filtradas.length,
      categorias: filtradas.slice(0, limit),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Use POST' }, { status: 405 });
}
