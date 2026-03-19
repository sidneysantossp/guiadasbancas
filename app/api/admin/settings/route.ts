import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Listar configurações
export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const keys = searchParams.get("keys")?.split(",");

    let query = supabaseAdmin.from("system_settings").select("*");
    
    if (keys && keys.length > 0) {
      query = query.in("key", keys);
    }

    const { data, error } = await query.order("key");

    if (error) throw error;

    // Mascarar valores secretos
    const maskedData = data?.map((setting) => ({
      ...setting,
      value: setting.is_secret && setting.value 
        ? "••••••••" + setting.value.slice(-4) 
        : setting.value,
    }));

    return NextResponse.json(
      { success: true, data: maskedData },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    console.error("[API/ADMIN/SETTINGS] Erro ao listar:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}

// POST - Criar ou atualizar configuração
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const { key, value, description, is_secret } = body;

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Key é obrigatória" },
        { status: 400 }
      );
    }

    let normalizedValue = value;

    if (
      key === "subscription_overdue_grace_days" ||
      key === "premium_launch_slots" ||
      key === "subscription_trial_days_paid"
    ) {
      const parsed = Number(value);

      if (!Number.isInteger(parsed) || parsed < 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              key === "subscription_overdue_grace_days"
                ? "Os dias de carência devem ser um número inteiro igual ou maior que zero"
                : key === "subscription_trial_days_paid"
                  ? "Os dias de degustação devem ser um número inteiro igual ou maior que zero"
                : "A quantidade de vagas promocionais deve ser um número inteiro igual ou maior que zero",
          },
          { status: 400 }
        );
      }

      normalizedValue = String(parsed);
    }

    if (key === "premium_launch_price") {
      const parsed = Number(value);

      if (!Number.isFinite(parsed) || parsed <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "O preço promocional deve ser um número maior que zero",
          },
          { status: 400 }
        );
      }

      normalizedValue = String(parsed);
    }

    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .upsert(
        {
          key,
          value: normalizedValue,
          description,
          is_secret,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (error: any) {
    console.error("[API/ADMIN/SETTINGS] Erro ao salvar:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
