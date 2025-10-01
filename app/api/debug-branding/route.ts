import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing branding table...');
    
    // 1. Verificar dados existentes
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('branding')
      .select('*');

    console.log('Existing branding data:', { existing, existingError });

    // 2. Tentar inserir um registro de teste
    const testData = {
      id: '00000000-0000-0000-0000-000000000001',
      logo_url: 'data:image/png;base64,test123',
      logo_alt: 'Test Logo',
      site_name: 'Test Site',
      primary_color: '#ff0000',
      secondary_color: '#00ff00',
      favicon: '/test.ico',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('branding')
      .upsert(testData, { onConflict: 'id' })
      .select();

    console.log('Insert/upsert result:', { insertData, insertError });

    // 3. Verificar se foi salvo
    const { data: afterInsert, error: afterError } = await supabaseAdmin
      .from('branding')
      .select('*');

    console.log('After insert:', { afterInsert, afterError });

    return NextResponse.json({
      success: true,
      existing: { data: existing, error: existingError },
      insert: { data: insertData, error: insertError },
      afterInsert: { data: afterInsert, error: afterError },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
