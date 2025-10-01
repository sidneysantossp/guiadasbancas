import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // 1. Testar conexão básica
    const { data: testData, error: testError } = await supabaseAdmin
      .from('branding')
      .select('*')
      .limit(1);

    console.log('Supabase test result:', { testData, testError });

    // 2. Tentar inserir/atualizar registro
    const { data: upsertData, error: upsertError } = await supabaseAdmin
      .from('branding')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        logo_url: null,
        logo_alt: 'Guia das Bancas',
        site_name: 'Guia das Bancas',
        primary_color: '#ff5c00',
        secondary_color: '#ff7a33',
        favicon: '/favicon.svg',
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select();

    console.log('Upsert result:', { upsertData, upsertError });

    return NextResponse.json({
      success: true,
      testData,
      testError,
      upsertData,
      upsertError,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
