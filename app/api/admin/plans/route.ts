import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Listar todos os planos
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { data, error } = await supabaseAdmin
      .from("plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS] Erro ao listar planos:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// POST - Criar novo plano
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      type = "premium",
      price = 0,
      billing_cycle = "monthly",
      features = [],
      limits = {},
      is_active = true,
      is_default = false,
      sort_order = 0,
    } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Nome e slug são obrigatórios" },
        { status: 400 }
      );
    }

    // Se for definido como padrão, remover padrão dos outros
    if (is_default) {
      await supabaseAdmin
        .from("plans")
        .update({ is_default: false })
        .neq("slug", slug);
    }

    const { data, error } = await supabaseAdmin
      .from("plans")
      .insert({
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
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS] Erro ao criar plano:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
