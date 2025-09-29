import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    console.log('🔍 Testando conexão com Supabase...');
    
    // Teste de conexão simples
    const { data, error } = await supabaseAdmin
      .from('branding')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro na conexão:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error 
      }, { status: 500 });
    }

    console.log('✅ Conexão bem-sucedida!');
    
    // Teste de inserção/atualização
    const { data: upsertData, error: upsertError } = await supabaseAdmin
      .from('branding')
      .upsert({
        logo_url: null,
        logo_alt: 'Guia das Bancas',
        site_name: 'Guia das Bancas',
        primary_color: '#ff5c00',
        secondary_color: '#ff7a33',
        favicon: '/favicon.svg'
      })
      .select();

    if (upsertError) {
      console.error('❌ Erro na inserção:', upsertError);
      return NextResponse.json({ 
        success: false, 
        error: upsertError.message,
        details: upsertError 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando!',
      data: {
        existing: data,
        upserted: upsertData
      }
    });

  } catch (error) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      details: error 
    }, { status: 500 });
  }
}
