import { NextResponse } from "next/server";
import { loadJornaleiroPartnerLandingDocument } from "@/lib/jornaleiro-partner-landing";

export async function GET() {
  const { document, updatedAt, source } = await loadJornaleiroPartnerLandingDocument();

  return NextResponse.json(
    {
      success: true,
      data: document,
      updatedAt,
      source,
    },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=300" } }
  );
}
