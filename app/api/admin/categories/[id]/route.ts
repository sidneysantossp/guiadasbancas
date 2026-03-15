import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Categoria nao encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[admin/categories/:id][GET]", error);
    return NextResponse.json({ success: false, error: "Erro ao carregar categoria" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) updateData.name = String(body.name || "").trim();
    if (body.image !== undefined) updateData.image = String(body.image || "");
    if (body.link !== undefined) updateData.link = String(body.link || "").trim();
    if (body.active !== undefined) updateData.active = Boolean(body.active);
    if (body.visible !== undefined) updateData.visible = Boolean(body.visible);
    if (body.order !== undefined) updateData.order = Number(body.order) || 0;
    if (body.parent_category_id !== undefined) updateData.parent_category_id = body.parent_category_id || null;
    if (body.jornaleiroStatus !== undefined) updateData.jornaleiro_status = body.jornaleiroStatus;
    if (body.jornaleiroBancas !== undefined) {
      updateData.jornaleiro_bancas = Array.isArray(body.jornaleiroBancas) ? body.jornaleiroBancas : [];
    }

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Erro ao atualizar categoria" }, { status: 500 });
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/buscar", "page");
      revalidatePath("/categorias", "page");
      revalidatePath("/api/categories", "page");
    } catch (revalidateError) {
      console.warn("[admin/categories/:id][PUT] revalidate", revalidateError);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[admin/categories/:id][PUT]", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await context.params;
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ success: false, error: "Erro ao excluir categoria" }, { status: 500 });
    }

    try {
      revalidatePath("/", "page");
      revalidatePath("/buscar", "page");
      revalidatePath("/categorias", "page");
      revalidatePath("/api/categories", "page");
    } catch (revalidateError) {
      console.warn("[admin/categories/:id][DELETE] revalidate", revalidateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[admin/categories/:id][DELETE]", error);
    return NextResponse.json({ success: false, error: "Erro ao excluir categoria" }, { status: 500 });
  }
}
