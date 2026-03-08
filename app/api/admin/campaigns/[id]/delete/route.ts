import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// DELETE - Excluir campanha
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { error } = await supabaseAdmin
      .from('campaigns')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete campaign error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao excluir campanha' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete campaign API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
