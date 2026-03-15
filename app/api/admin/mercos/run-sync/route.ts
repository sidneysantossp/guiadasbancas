import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const full = body?.full === true;
    const targetUrl = new URL(`/api/cron/sync-mercos${full ? "?full=true" : ""}`, request.url);

    const headers = new Headers();
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      headers.set("Authorization", `Bearer ${cronSecret}`);
    }

    const response = await fetch(targetUrl.toString(), {
      method: "POST",
      headers,
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return NextResponse.json(data ?? { success: response.ok }, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao disparar sync manual do Mercos" },
      { status: 500 }
    );
  }
}
