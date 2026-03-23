import { NextResponse } from "next/server";
import { resolveCanonicalBancaRowById } from "@/lib/banca-canonical";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Surrogate-Control": "no-store",
  };

  try {
    const data = await resolveCanonicalBancaRowById(params.id);

    if (!data) {
      return NextResponse.json({ error: "Banca não encontrada" }, { status: 404, headers });
    }

    return NextResponse.json({ data }, { headers });
  } catch (e: any) {
    console.error('Erro ao buscar banca:', e);
    return NextResponse.json({ error: e?.message || "Erro ao buscar banca" }, { status: 500, headers });
  }
}
