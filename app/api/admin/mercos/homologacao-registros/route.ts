import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

/**
 * GET /api/admin/mercos/homologacao-registros?companyToken=xxx
 * Retorna todos os registros salvos na tabela mercos_homologacao_registros
 * para o companyToken informado, ordenados por mercos_id.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyToken = (searchParams.get('companyToken') || '').trim();

    if (!companyToken) {
      return NextResponse.json({ success: false, error: 'companyToken é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('mercos_homologacao_registros')
      .select('mercos_id, nome, categoria_pai_id, ultima_alteracao, excluido, alterado_apos, criado_em')
      .eq('company_token', companyToken)
      .order('criado_em', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      total: data?.length ?? 0,
      registros: data ?? [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/mercos/homologacao-registros?companyToken=xxx
 * Limpa todos os registros salvos para o companyToken (para reiniciar homologação).
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyToken = (searchParams.get('companyToken') || '').trim();

    if (!companyToken) {
      return NextResponse.json({ success: false, error: 'companyToken é obrigatório' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('mercos_homologacao_registros')
      .delete()
      .eq('company_token', companyToken);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, mensagem: 'Registros de homologação removidos.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
