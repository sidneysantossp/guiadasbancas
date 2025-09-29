import { NextRequest, NextResponse } from "next/server";
import { readProducts, type ProdutoItem } from "@/lib/server/productsStore";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    let items: ProdutoItem[] = await readProducts();
    if (!items.length) {
      const legacy = (globalThis as any).__PRODUCTS_STORE__ as ProdutoItem[] | undefined;
      if (Array.isArray(legacy) && legacy.length) items = legacy;
    }
    const products = items.filter(p => p.banca_id === bancaId && p.active !== false).slice(0, 12);
    return NextResponse.json({ success: true, data: products });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Erro ao buscar produtos da banca" }, { status: 500 });
  }
}
