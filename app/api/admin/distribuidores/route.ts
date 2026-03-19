import { NextRequest, NextResponse } from 'next/server';
import { buildNoStoreHeaders } from '@/lib/modules/http/no-store';
import { getAdminDistribuidoresList } from '@/lib/modules/distribuidor/admin';
import { requireAdminAuth } from '@/lib/security/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const distribuidores = await getAdminDistribuidoresList();

    return NextResponse.json({
      success: true,
      data: distribuidores,
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const supabase = supabaseAdmin;
    const body = await request.json();

    const { nome, application_token, company_token, ativo } = body;

    if (!nome || !application_token || !company_token) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('distribuidores')
      .insert([
        {
          nome,
          application_token,
          company_token,
          ativo: ativo !== undefined ? ativo : true,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
