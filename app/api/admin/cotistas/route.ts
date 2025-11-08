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
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabaseAdmin
      .from('cotistas')
      .select('*')
      .order('razao_social', { ascending: true })
      .limit(limit);

    if (search) {
      query = query.or(`razao_social.ilike.%${search}%,cnpj_cpf.ilike.%${search}%,codigo.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[GET COTISTAS] Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
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
