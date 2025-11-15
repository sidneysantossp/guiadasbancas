import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function verifyAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("Authorization");
  return authHeader === "Bearer admin-token";
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID do usuário é obrigatório" }, { status: 400 });
    }

    console.log('[BLOCK] Iniciando bloqueio do usuário:', userId);

    // Verificar se o usuário existe
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, full_name')
      .eq('id', userId)
      .single();

    if (fetchError || !existingUser) {
      console.error('[BLOCK] Usuário não encontrado:', fetchError);
      return NextResponse.json({ success: false, error: 'Usuário não encontrado' }, { status: 404 });
    }

    console.log('[BLOCK] Usuário encontrado para bloqueio:', existingUser.full_name);

    // Marcar perfil como bloqueado
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        blocked: true, 
        blocked_reason: reason || 'Bloqueado pelo administrador',
        blocked_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
      console.error('[BLOCK] Erro ao bloquear perfil:', profileError);
      return NextResponse.json({ success: false, error: 'Erro ao bloquear perfil' }, { status: 500 });
    }

    // Desativar todas as bancas do usuário
    const { error: bancaError } = await supabaseAdmin
      .from('bancas')
      .update({ active: false })
      .eq('user_id', userId);

    if (bancaError) {
      console.warn('[BLOCK] Aviso: Não foi possível desativar bancas:', bancaError);
    }

    console.log('[BLOCK] ✅ Usuário bloqueado com sucesso:', existingUser.full_name);
    return NextResponse.json({ 
      success: true, 
      message: 'Usuário bloqueado com sucesso. Ele não poderá mais fazer login.' 
    });

  } catch (error) {
    console.error('Block user API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "ID do usuário é obrigatório" }, { status: 400 });
    }

    console.log('[UNBLOCK] Iniciando desbloqueio do usuário:', userId);

    // Desbloquear perfil
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        blocked: false, 
        blocked_reason: null,
        blocked_at: null
      })
      .eq('id', userId);

    if (profileError) {
      console.error('[UNBLOCK] Erro ao desbloquear perfil:', profileError);
      return NextResponse.json({ success: false, error: 'Erro ao desbloquear perfil' }, { status: 500 });
    }

    console.log('[UNBLOCK] ✅ Usuário desbloqueado com sucesso');
    return NextResponse.json({ 
      success: true, 
      message: 'Usuário desbloqueado com sucesso. Ele pode fazer login novamente.' 
    });

  } catch (error) {
    console.error('Unblock user API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 });
  }
}
