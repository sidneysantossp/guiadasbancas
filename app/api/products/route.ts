import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import type { Produto } from "@/types/admin";
import { readProducts, writeProducts } from "@/lib/server/productsStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const bancaId = searchParams.get("banca_id") || "";

  let items = await readProducts();
  if (!items.length) {
    const legacy = (globalThis as any).__PRODUCTS_STORE__ as Produto[] | undefined;
    if (Array.isArray(legacy) && legacy.length) items = legacy as any;
  }
  let data = items.filter((p) =>
    (!q || (p.name || '').toLowerCase().includes(q)) &&
    (!category || p.category_id === category) &&
    (!bancaId || p.banca_id === bancaId ||
      (typeof p.banca_id === 'string' && (p.banca_id.endsWith(bancaId) || bancaId.endsWith(p.banca_id)))) &&
    (active == null ? true : (active === "true" ? p.active : !p.active))
  );

  // Fallback para dados legados criados com banca_id 'b1'
  if (bancaId && data.length === 0) {
    const legacy = items.filter((p) =>
      (!q || (p.name || '').toLowerCase().includes(q)) &&
      (!category || p.category_id === category) &&
      (p.banca_id === 'b1') &&
      (active == null ? true : (active === "true" ? p.active : !p.active))
    );
    if (legacy.length > 0) data = legacy;
  }

  return NextResponse.json({ items: data, total: data.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const id = uuid();
  const now = new Date().toISOString();
  const novo: any = {
    id,
    banca_id: body.banca_id || "b1",
    category_id: body.category_id,
    name: body.name,
    slug: (body.slug || body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    description: body.description || "",
    images: body.images || [],
    price: Number(body.price || 0),
    price_original: body.price_original ? Number(body.price_original) : undefined,
    discount_percent: body.discount_percent,
    stock_qty: body.stock_qty ?? 0,
    track_stock: !!body.track_stock,
    active: body.active ?? true,
    created_at: now,
    updated_at: now,
  };
  const items = await readProducts();
  items.unshift(novo);
  await writeProducts(items as any);
  return NextResponse.json(novo, { status: 201 });
}
