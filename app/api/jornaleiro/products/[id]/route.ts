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

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const sellerId = extractSellerId(request);
  if (!sellerId) return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  const bancaId = getBancaIdForSeller(sellerId);
  if (!bancaId) return NextResponse.json({ success: false, error: "Banca não vinculada" }, { status: 400 });

  const { id } = context.params;
  const items = await readProducts();
  const product = items.find((p: any) => p.id === id && p.banca_id === bancaId);
  if (!product) return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });

  return NextResponse.json({ success: true, data: product });
}

export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  const sellerId = extractSellerId(request);
  if (!sellerId) return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  const bancaId = getBancaIdForSeller(sellerId);
  if (!bancaId) return NextResponse.json({ success: false, error: "Banca não vinculada" }, { status: 400 });

  try {
    const body = await request.json();
    const items = await readProducts();
    const idx = items.findIndex((p: any) => p.id === context.params.id && p.banca_id === bancaId);
    if (idx === -1) return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
    
    const updated = { ...items[idx], ...body, id: context.params.id, updated_at: new Date().toISOString() };
    items[idx] = updated;
    await writeProducts(items);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const sellerId = extractSellerId(request);
  if (!sellerId) return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  const bancaId = getBancaIdForSeller(sellerId);
  if (!bancaId) return NextResponse.json({ success: false, error: "Banca não vinculada" }, { status: 400 });

  const items = await readProducts();
  const idx = items.findIndex((p: any) => p.id === context.params.id && p.banca_id === bancaId);
  if (idx === -1) return NextResponse.json({ success: false, error: "Produto não encontrado" }, { status: 404 });
  const removed = items.splice(idx, 1)[0];
  await writeProducts(items);
  return NextResponse.json({ success: true, removed });
}
