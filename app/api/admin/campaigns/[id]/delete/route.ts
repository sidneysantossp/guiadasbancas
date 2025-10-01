import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// DELETE - Excluir campanha
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

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
