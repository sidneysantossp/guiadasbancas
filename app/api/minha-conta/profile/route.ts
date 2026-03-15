import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

function normalizeCpf(value: string | null | undefined) {
  if (!value) return "";
  return value.replace(/\D+/g, "").slice(0, 11);
}

function isValidCpf(cpf: string) {
  if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += parseInt(cpf.charAt(index), 10) * (10 - index);
  }

  let remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9), 10)) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += parseInt(cpf.charAt(index), 10) * (11 - index);
  }

  remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  return remainder === parseInt(cpf.charAt(10), 10);
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
    cpf: normalizeCpf(profile?.cpf),
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
    const cpf = normalizeCpf(body?.cpf);
    const avatarUrl = typeof body?.avatar_url === "string" ? body.avatar_url.trim() : "";

    if (!fullName) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    if (cpf && !isValidCpf(cpf)) {
      return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
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
