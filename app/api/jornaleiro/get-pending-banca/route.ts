import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET - Buscar dados da banca pendente do Supabase
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    console.log('🔍 [get-pending-banca] Buscando dados para user:', session.user.id);

    const { data, error } = await supabaseAdmin
      .from('jornaleiro_pending_banca')
      .select('banca_data')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      // Se a tabela não existir, retornar vazio
      if (error.code === '42P01') {
        console.warn('⚠️ [get-pending-banca] Tabela não existe');
        return NextResponse.json({ success: false, banca_data: null });
      }
      console.error('❌ [get-pending-banca] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.log('ℹ️ [get-pending-banca] Nenhum dado pendente encontrado');
      return NextResponse.json({ success: false, banca_data: null });
    }

    console.log('✅ [get-pending-banca] Dados encontrados');
    return NextResponse.json({ 
      success: true, 
      banca_data: data.banca_data 
    });

  } catch (error: any) {
    console.error('❌ [get-pending-banca] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE - Limpar dados da banca pendente após criar a banca
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    console.log('🗑️ [get-pending-banca] Removendo dados para user:', session.user.id);

    const { error } = await supabaseAdmin
      .from('jornaleiro_pending_banca')
      .delete()
      .eq('user_id', session.user.id);

    if (error && error.code !== '42P01') {
      console.error('❌ [get-pending-banca] Erro ao deletar:', error);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ [get-pending-banca] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
