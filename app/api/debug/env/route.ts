import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const red = (s: string) => (s ? `${s.slice(0, 6)}...len:${s.length}` : "MISSING");

  let restStatus: { ok: boolean; status?: number; error?: string } = { ok: false };
  try {
    if (supabaseUrl) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "GET",
        headers: { apikey: anon || service },
      });
      restStatus = { ok: res.ok, status: res.status };
    } else {
      restStatus = { ok: false, error: "NO_URL" };
    }
  } catch (e: any) {
    restStatus = { ok: false, error: e?.message || "fetch failed" };
  }

  return NextResponse.json({
    env: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: red(anon),
      SUPABASE_SERVICE_ROLE_KEY: red(service),
    },
    rest: restStatus,
    hint:
      "Se as variáveis estiverem MISSING, reinicie o servidor. Se rest.ok=false e status ausente, há bloqueio de rede/DNS/SSL.",
  });
}
