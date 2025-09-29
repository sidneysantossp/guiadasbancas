import { NextRequest, NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/server/productsStore";

const SELLER_TOKEN = "seller-token";
const SELLER_BANCA_MAP: Record<string, string> = {
  "seller-001": "banca-1758901610179",
};

function extractSellerId(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) return null;
  if (token === SELLER_TOKEN) return "seller-001";
  return null;
}

function getBancaIdForSeller(sellerId: string): string | null {
  return SELLER_BANCA_MAP[sellerId] || null;
}

export async function GET(request: NextRequest) {
  const sellerId = extractSellerId(request);
  if (!sellerId) return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  const bancaId = getBancaIdForSeller(sellerId);
  if (!bancaId) return NextResponse.json({ success: false, error: "Banca não vinculada" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const featured = searchParams.get("featured");

  const items = await readProducts();
  const data = items.filter((p) =>
    p.banca_id === bancaId &&
    (!q || (p.name || "").toLowerCase().includes(q)) &&
    (!category || p.category_id === category) &&
    (active == null ? true : (active === "true" ? p.active : !p.active)) &&
    (featured == null ? true : (featured === "true" ? p.featured : !p.featured))
  );
  return NextResponse.json({ success: true, items: data, total: data.length });
}

export async function POST(request: NextRequest) {
  const sellerId = extractSellerId(request);
  if (!sellerId) return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  const bancaId = getBancaIdForSeller(sellerId);
  if (!bancaId) return NextResponse.json({ success: false, error: "Banca não vinculada" }, { status: 400 });

  const body = await request.json();
  const now = new Date().toISOString();
  const id = `prod-${Date.now()}`;
  const novo = {
    id,
    banca_id: bancaId,
    category_id: body.category_id,
    name: body.name,
    slug: (body.slug || body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    description: body.description || "",
    images: Array.isArray(body.images) ? body.images : [],
    price: Number(body.price || 0),
    price_original: body.price_original != null ? Number(body.price_original) : undefined,
    discount_percent: body.discount_percent != null ? Number(body.discount_percent) : undefined,
    stock_qty: body.stock_qty != null ? Number(body.stock_qty) : 0,
    track_stock: !!body.track_stock,
    featured: !!body.featured,
    sob_encomenda: !!body.sob_encomenda,
    pre_venda: !!body.pre_venda,
    pronta_entrega: !!body.pronta_entrega,
    coupon_code: typeof body.coupon_code === 'string' ? body.coupon_code : undefined,
    description_full: typeof body.description_full === 'string' ? body.description_full : undefined,
    specifications: typeof body.specifications === 'string' ? body.specifications : undefined,
    gallery_images: Array.isArray(body.gallery_images) ? body.gallery_images : [],
    allow_reviews: !!body.allow_reviews,
    active: body.active ?? true,
    created_at: now,
    updated_at: now,
    rating_avg: 0,
    reviews_count: 0,
  } as any;
  const items = await readProducts();
  items.unshift(novo);
  await writeProducts(items as any);
  return NextResponse.json({ success: true, data: novo }, { status: 201 });
}
