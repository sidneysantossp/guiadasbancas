import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    const userId = (session as any)?.user?.id as string | undefined;
    const email = (session as any)?.user?.email as string | undefined;

    if (!userId || !email) {
      return NextResponse.json({ authenticated: false }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      });
    }

    // Backward-compatible: alguns ambientes podem não ter a coluna `jornaleiro_access_level` ainda.
    const baseSelect =
      "id, role, full_name, phone, avatar_url, banca_id, active, email_verified, blocked, blocked_reason, blocked_at, created_at, updated_at";
    const extendedSelect = `${baseSelect}, jornaleiro_access_level`;

    let profile: any = null;
    let profileError: any = null;

    const primary = await supabaseAdmin
      .from("user_profiles")
      .select(extendedSelect)
      .eq("id", userId)
      .maybeSingle();

    profile = primary.data;
    profileError = primary.error;

    if (
      profileError &&
      (profileError.code === "42703" || /jornaleiro_access_level/i.test(profileError.message || ""))
    ) {
      const fallback = await supabaseAdmin
        .from("user_profiles")
        .select(baseSelect)
        .eq("id", userId)
        .maybeSingle();

      profile = fallback.data;
      profileError = fallback.error;
    }

    if (profileError || !profile || profile.active === false) {
      return NextResponse.json({ authenticated: false, reason: 'profile_not_found_or_inactive' }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      });
    }

    const rawRole = (profile as any).role as string | undefined;
    const normalizedRole = rawRole === 'admin'
      ? 'admin'
      : (rawRole === 'jornaleiro' || rawRole === 'seller')
        ? 'jornaleiro'
        : 'cliente';

    return NextResponse.json({
      authenticated: true,
      user: { id: userId, email, name: profile.full_name },
      profile: { ...profile, role: normalizedRole },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ authenticated: false, error: e?.message || 'Erro interno' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  }
}
