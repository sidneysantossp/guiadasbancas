import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { readAuthenticatedUserClaims } from "@/lib/modules/auth/session";
import { supabaseAdmin } from "@/lib/supabase";

export interface AuthenticatedRequestUser {
  id: string;
  email: string | null;
}

export async function getAuthenticatedRequestUser(
  request: NextRequest
): Promise<AuthenticatedRequestUser | null> {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7).trim();
      if (token) {
        const {
          data: { user },
          error,
        } = await supabaseAdmin.auth.getUser(token);

        if (!error && user?.id) {
          return {
            id: user.id,
            email: user.email ?? null,
          };
        }
      }
    } catch {
      // fallback para sessão web
    }
  }

  try {
    const session = await auth();
    const claims = readAuthenticatedUserClaims(session);

    if (claims?.id) {
      return {
        id: claims.id,
        email: claims.email,
      };
    }
  } catch {
    // noop
  }

  return null;
}
