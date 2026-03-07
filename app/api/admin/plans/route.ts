import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminAuth } from "@/lib/security/admin-auth";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = "force-dynamic";

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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS] Erro ao listar planos:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API/ADMIN/PLANS] Erro ao criar plano:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
