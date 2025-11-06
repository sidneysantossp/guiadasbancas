import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // 1. Buscar todos os perfis SEM banca_id mas que são jornaleiros
    const { data: profilesWithoutBanca } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, role')
      .eq('role', 'jornaleiro')
      .is('banca_id', null);

    if (!profilesWithoutBanca || profilesWithoutBanca.length === 0) {
      return NextResponse.json({
        message: 'Nenhum perfil sem banca encontrado',
        profiles_sem_banca: 0,
      });
    }

    const results = [];

    // 2. Para cada perfil, buscar se existe uma banca com o user_id dele
    for (const profile of profilesWithoutBanca) {
      const { data: banca } = await supabaseAdmin
        .from('bancas')
        .select('id, name, email')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (banca) {
        // 3. Se encontrou a banca, fazer a vinculação
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ banca_id: banca.id })
          .eq('id', profile.id);

        results.push({
          profile_id: profile.id,
          profile_name: profile.full_name,
          profile_email: profile.email,
          banca_id: banca.id,
          banca_name: banca.name,
          status: updateError ? '❌ ERRO' : '✅ VINCULADO',
          error: updateError?.message || null,
        });
      } else {
        results.push({
          profile_id: profile.id,
          profile_name: profile.full_name,
          profile_email: profile.email,
          banca_id: null,
          banca_name: null,
          status: '⚠️  SEM BANCA',
          error: 'Perfil de jornaleiro mas não existe banca associada',
        });
      }
    }

    return NextResponse.json({
      message: 'Correção executada',
      total_profiles_verificados: profilesWithoutBanca.length,
      results: results,
      summary: {
        vinculados: results.filter(r => r.status === '✅ VINCULADO').length,
        sem_banca: results.filter(r => r.status === '⚠️  SEM BANCA').length,
        erros: results.filter(r => r.status === '❌ ERRO').length,
      }
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
