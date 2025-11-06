import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Buscar TODOS os usuários com nome Sidney
    const { data: profiles } = await supabaseAdmin
      .from('user_profiles')
      .select('id, email, full_name, role')
      .ilike('full_name', '%sidney%');

    // Para cada perfil, buscar a banca associada
    const results = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: banca } = await supabaseAdmin
          .from('bancas')
          .select('id, name, email, user_id')
          .eq('user_id', profile.id)
          .single();

        return {
          profile: profile,
          banca: banca || null,
          match: profile.id === banca?.user_id ? '✅' : '❌'
        };
      })
    );

    // Buscar também bancas com email que contém "sidney"
    const { data: bancasSidney } = await supabaseAdmin
      .from('bancas')
      .select('id, name, email, user_id')
      .ilike('email', '%sidney%');

    return NextResponse.json({
      total_profiles_sidney: profiles?.length || 0,
      profiles_e_bancas: results,
      bancas_com_email_sidney: bancasSidney || [],
    });

  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
