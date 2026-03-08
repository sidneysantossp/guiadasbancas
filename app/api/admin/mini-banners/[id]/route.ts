import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;
    const id = params.id;
    const body = await request.json();
    const payload: any = {};
    if (typeof body.image_url === 'string') payload.image_url = body.image_url;
    if (typeof body.display_order === 'number') payload.display_order = body.display_order;
    if (typeof body.active === 'boolean') payload.active = body.active;

    const { data, error } = await supabaseAdmin
      .from("mini_banners")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;
    const id = params.id;
    const { error } = await supabaseAdmin
      .from("mini_banners")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro ao excluir" }, { status: 500 });
  }
}
