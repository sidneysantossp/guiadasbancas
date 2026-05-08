import { NextResponse } from "next/server";
import { loadJornaleiroMarketplaceModuleEnabled } from "@/lib/jornaleiro-modules";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const marketplaceEnabled = await loadJornaleiroMarketplaceModuleEnabled();

  return NextResponse.json(
    {
      success: true,
      marketplace_enabled: marketplaceEnabled,
      modules: {
        marketplace: {
          enabled: marketplaceEnabled,
        },
      },
    },
    { headers: buildNoStoreHeaders() }
  );
}
