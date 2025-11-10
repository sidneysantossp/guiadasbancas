import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// GET - Listar cotistas
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const searchDigits = (search || '').replace(/[^0-9]/g, '');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const pageSizeParam = searchParams.get('pageSize') || searchParams.get('limit') || '50';
    const pageSize = Math.min(Math.max(1, parseInt(pageSizeParam)), 2000);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseAdmin
      .from('cotistas')
      .select('*', { count: 'exact' })
      .order('razao_social', { ascending: true })
      .range(from, to);

    if (search) {
      const ors: string[] = [];
      // texto livre em razão social e código
      ors.push(`razao_social.ilike.%${search}%`);
      ors.push(`codigo.ilike.%${search}%`);
      // busca por documento com dígitos (bd armazena apenas números)
      if (searchDigits.length === 11 || searchDigits.length === 14) {
        ors.unshift(`cnpj_cpf.eq.${searchDigits}`);
      } else if (searchDigits.length >= 3) {
        ors.push(`cnpj_cpf.ilike.%${searchDigits}%`);
      }
      query = query.or(ors.join(','));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('[GET COTISTAS] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let activeCount = 0;
    let inactiveCount = 0;

    let activeQuery = supabaseAdmin
      .from('cotistas')
      .select('id', { count: 'exact', head: true })
      .eq('ativo', true);
    if (search) {
      const ors: string[] = [];
      ors.push(`razao_social.ilike.%${search}%`);
      ors.push(`codigo.ilike.%${search}%`);
      if (searchDigits.length === 11 || searchDigits.length === 14) {
        ors.unshift(`cnpj_cpf.eq.${searchDigits}`);
      } else if (searchDigits.length >= 3) {
        ors.push(`cnpj_cpf.ilike.%${searchDigits}%`);
      }
      activeQuery = activeQuery.or(ors.join(','));
    }
    const { count: aCount, error: aErr } = await activeQuery;
    if (aErr) {
      console.error('[GET COTISTAS] active count error:', aErr);
    } else {
      activeCount = aCount ?? 0;
    }

    let inactiveQuery = supabaseAdmin
      .from('cotistas')
      .select('id', { count: 'exact', head: true })
      .eq('ativo', false);
    if (search) {
      const ors: string[] = [];
      ors.push(`razao_social.ilike.%${search}%`);
      ors.push(`codigo.ilike.%${search}%`);
      if (searchDigits.length === 11 || searchDigits.length === 14) {
        ors.unshift(`cnpj_cpf.eq.${searchDigits}`);
      } else if (searchDigits.length >= 3) {
        ors.push(`cnpj_cpf.ilike.%${searchDigits}%`);
      }
      inactiveQuery = inactiveQuery.or(ors.join(','));
    }
    const { count: iCount, error: iErr } = await inactiveQuery;
    if (iErr) {
      console.error('[GET COTISTAS] inactive count error:', iErr);
    } else {
      inactiveCount = iCount ?? 0;
    }

    return NextResponse.json({ success: true, data, total: count ?? 0, page, pageSize, stats: { active: activeCount, inactive: inactiveCount } });
  } catch (error: any) {
    console.error('[GET COTISTAS] Exception:', error);
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}

// POST - Criar cotista
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('cotistas')
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error('[CREATE COTISTA] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[CREATE COTISTA] Exception:', error);
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}
