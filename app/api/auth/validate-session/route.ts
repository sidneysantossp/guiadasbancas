import { NextRequest, NextResponse } from "next/server";
import { normalizePlatformRole, readAuthenticatedUserClaims } from "@/lib/modules/auth/session";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { loadUserProfileById } from "@/lib/modules/auth/user-profiles";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);
    const userId = claims?.id;
    const email = claims?.email;

    if (!userId || !email) {
      return NextResponse.json(
        { authenticated: false },
        { headers: buildNoStoreHeaders() }
      );
    }

    const { data: profile, error: profileError } = await loadUserProfileById({
      userId,
      select:
        "id, role, full_name, phone, avatar_url, banca_id, active, email_verified, blocked, blocked_reason, blocked_at, created_at, updated_at",
    });

    if (profileError || !profile || profile.active === false) {
      return NextResponse.json(
        { authenticated: false, reason: 'profile_not_found_or_inactive' },
        { headers: buildNoStoreHeaders() }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: { id: userId, email, name: profile.full_name },
      profile: { ...profile, role: normalizePlatformRole((profile as any).role as string) },
    }, {
      headers: buildNoStoreHeaders(),
    });
  } catch (e: any) {
    return NextResponse.json(
      { authenticated: false, error: e?.message || 'Erro interno' },
      { headers: buildNoStoreHeaders() }
    );
  }
}
