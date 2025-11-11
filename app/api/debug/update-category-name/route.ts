import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { distribuidorId, mercosId, newName } = await request.json();

    if (!distribuidorId || !mercosId || !newName) {
      return NextResponse.json({ success: false, error: 'Parâmetros obrigatórios: distribuidorId, mercosId, newName' }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .update({ nome: newName, updated_at: new Date().toISOString() })
      .eq('distribuidor_id', distribuidorId)
      .eq('mercos_id', mercosId)
      .select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: updated?.[0] || null });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
