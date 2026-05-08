import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  normalizeBrazilianDocument,
  validateBrazilianDocument,
} from "@/lib/documents";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  avatar_url?: string | null;
};

function buildUnauthorizedResponse() {
  return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
}

function normalizePhone(value: string | null | undefined) {
  if (!value) return "";
  return value.trim();
}

function normalizeDocument(value: string | null | undefined) {
  if (!value) return "";
  return normalizeBrazilianDocument(value);
}

async function getAuthenticatedUser() {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) return null;

  return {
    userId: user.id,
    email: user.email || "",
    name: user.name || "",
    avatarUrl: user.avatar_url || "",
  };
}

function serializeProfile(profile: any, sessionUser: Awaited<ReturnType<typeof getAuthenticatedUser>>) {
  return {
    id: profile?.id || sessionUser?.userId || "",
    email: profile?.email || sessionUser?.email || "",
    full_name: profile?.full_name || sessionUser?.name || "",
    phone: normalizePhone(profile?.phone),
    cpf: normalizeDocument(profile?.cpf),
    avatar_url: profile?.avatar_url || sessionUser?.avatarUrl || "",
    created_at: profile?.created_at || null,
    updated_at: profile?.updated_at || null,
    email_editable: false,
  };
}

export async function GET() {
  try {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) return buildUnauthorizedResponse();

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email, full_name, phone, cpf, avatar_url, created_at, updated_at")
      .eq("id", sessionUser.userId)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    let hasDefaultAddress = false;
    try {
      const { data: defaultAddress } = await supabaseAdmin
        .from("customer_addresses")
        .select("id")
        .eq("user_id", sessionUser.userId)
        .eq("is_default", true)
        .limit(1)
        .maybeSingle();

      hasDefaultAddress = Boolean(defaultAddress?.id);
    } catch (addressError) {
      console.warn("[API Minha Conta Profile] Meta de enderecos indisponivel:", addressError);
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: serializeProfile(profile, sessionUser),
        meta: {
          has_default_address: hasDefaultAddress,
        },
      },
    });
  } catch (error: any) {
    console.error("[API Minha Conta Profile] Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: error?.message || "Não foi possível carregar o perfil da conta" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sessionUser = await getAuthenticatedUser();
    if (!sessionUser) return buildUnauthorizedResponse();

    const body = await request.json();
    const fullName = typeof body?.full_name === "string" ? body.full_name.trim() : "";
    const phone = normalizePhone(body?.phone);
    const cpf = normalizeDocument(body?.cpf);
    const avatarUrl = typeof body?.avatar_url === "string" ? body.avatar_url.trim() : "";

    if (!fullName) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const documentValidation = validateBrazilianDocument(cpf);
    if (cpf && documentValidation) {
      return NextResponse.json({ error: documentValidation }, { status: 400 });
    }

    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from("user_profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        cpf: cpf || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      } as any)
      .eq("id", sessionUser.userId)
      .select("id, email, full_name, phone, cpf, avatar_url, created_at, updated_at")
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: serializeProfile(updatedProfile, sessionUser),
      },
    });
  } catch (error: any) {
    console.error("[API Minha Conta Profile] Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: error?.message || "Não foi possível atualizar o perfil da conta" },
      { status: 500 },
    );
  }
}
