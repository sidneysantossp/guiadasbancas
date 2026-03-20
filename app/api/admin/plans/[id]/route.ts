import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { normalizeAdminPlanPayload } from "@/lib/modules/admin/plan-validation";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Buscar plano por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS/ID] Erro ao buscar plano:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// PUT - Atualizar plano
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const normalized = normalizeAdminPlanPayload(body, { partial: true });

    if (!normalized.ok) {
      return NextResponse.json(
        { success: false, error: normalized.error },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const {
      name,
      slug,
      description,
      type,
      price,
      billing_cycle,
      features,
      limits,
      is_active,
      is_default,
      sort_order,
    } = normalized.data;

    // Se for definido como padrão, remover padrão dos outros
    if (is_default) {
      await supabaseAdmin
        .from("plans")
        .update({ is_default: false })
        .neq("id", id);
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (type !== undefined) updateData.type = type;
    if (price !== undefined) updateData.price = price;
    if (billing_cycle !== undefined) updateData.billing_cycle = billing_cycle;
    if (features !== undefined) updateData.features = features;
    if (limits !== undefined) updateData.limits = limits;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (is_default !== undefined) updateData.is_default = is_default;
    if (sort_order !== undefined) updateData.sort_order = sort_order;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("plans")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS/ID] Erro ao atualizar plano:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// DELETE - Excluir plano
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;

    // Verificar se há assinaturas ativas
    const { count } = await supabaseAdmin
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("plan_id", id)
      .in("status", ["active", "trial"]);

    if (count && count > 0) {
      return NextResponse.json(
        { success: false, error: `Não é possível excluir. ${count} assinatura(s) ativa(s) neste plano.` },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const { data: currentPlan, error: currentPlanError } = await supabaseAdmin
      .from("plans")
      .select("id, is_default")
      .eq("id", id)
      .maybeSingle();

    if (currentPlanError) throw currentPlanError;

    if (currentPlan?.is_default) {
      return NextResponse.json(
        { success: false, error: "Não é possível excluir o plano padrão da plataforma." },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const { error } = await supabaseAdmin
      .from("plans")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Plano excluído" },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS/ID] Erro ao excluir plano:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
