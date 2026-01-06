import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST - Salvar dados da banca pendente no Supabase
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    const { banca_data } = body;

    if (!banca_data) {
      return NextResponse.json({ error: 'Dados da banca são obrigatórios' }, { status: 400 });
    }

    console.log('💾 [save-pending-banca] Salvando dados para user:', session.user.id);

    // Usar upsert para evitar duplicatas
    const { error } = await supabaseAdmin
      .from('jornaleiro_pending_banca')
      .upsert({
        user_id: session.user.id,
        banca_data: banca_data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      // Se a tabela não existir, logar mas não falhar
      if (error.code === '42P01') {
        console.warn('⚠️ [save-pending-banca] Tabela não existe ainda');
        return NextResponse.json({ success: true, warning: 'Tabela não existe' });
      }
      console.error('❌ [save-pending-banca] Erro:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ [save-pending-banca] Dados salvos com sucesso');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ [save-pending-banca] Erro:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
