import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// GET - Buscar campanha específica
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        *,
        products (
          id,
          name,
          description,
          price,
          price_original,
          discount_percent,
          images,
          rating_avg,
          reviews_count,
          pronta_entrega,
          sob_encomenda,
          pre_venda,
          bancas (
            id,
            name,
            cover_image
          )
        )
      `)
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Campanha não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// PUT - Aprovar/Rejeitar campanha
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { status, admin_message, rejection_reason } = body;

    const updateData: any = {
      status,
      admin_message,
      updated_at: new Date().toISOString()
    };

    if (status === 'approved') {
      updateData.status = 'active'; // Campanhas aprovadas ficam ativas automaticamente
      updateData.approved_at = new Date().toISOString();
      updateData.rejection_reason = null;
    } else if (status === 'rejected') {
      updateData.rejected_at = new Date().toISOString();
      updateData.rejection_reason = rejection_reason;
    }

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: "Erro ao atualizar campanha" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
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
      return NextResponse.json({ success: false, error: "Erro ao excluir campanha" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Campanha excluída com sucesso" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
