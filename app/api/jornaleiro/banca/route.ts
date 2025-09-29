import { NextRequest, NextResponse } from "next/server";
import { readBancas, writeBancas, type AdminBanca } from "@/lib/server/bancasStore";

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

async function loadBancaForSeller(sellerId: string): Promise<AdminBanca | null> {
  const bancaId = SELLER_BANCA_MAP[sellerId];
  if (!bancaId) return null;
  const items = await readBancas();
  return items.find((b) => b.id === bancaId || b.id.endsWith(bancaId)) || null;
}

function mergeBanca(existing: AdminBanca, incoming: Partial<AdminBanca>): AdminBanca {
  return {
    ...existing,
    ...incoming,
    cover: incoming.cover || incoming.images?.cover || existing.cover,
    avatar: incoming.avatar || incoming.images?.avatar || existing.avatar,
    images: {
      ...existing.images,
      ...incoming.images,
    },
    addressObj: {
      ...existing.addressObj,
      ...incoming.addressObj,
    },
    location: {
      ...existing.location,
      ...incoming.location,
    },
    contact: {
      ...existing.contact,
      ...incoming.contact,
    },
    socials: {
      ...existing.socials,
      ...incoming.socials,
    },
    hours: Array.isArray(incoming.hours) ? incoming.hours : existing.hours,
    payments: Array.isArray(incoming.payments) ? incoming.payments : existing.payments,
    gallery: Array.isArray(incoming.gallery) ? incoming.gallery : existing.gallery,
    categories: Array.isArray(incoming.categories) ? incoming.categories : existing.categories,
    lat: typeof incoming.lat === "number" ? incoming.lat : incoming.location?.lat ?? existing.lat,
    lng: typeof incoming.lng === "number" ? incoming.lng : incoming.location?.lng ?? existing.lng,
  };
}

export async function GET(request: NextRequest) {
  const sellerId = extractSellerId(request);
  if (!sellerId) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const banca = await loadBancaForSeller(sellerId);
  if (!banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: banca });
}

export async function PUT(request: NextRequest) {
  const sellerId = extractSellerId(request);
  if (!sellerId) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const items = await readBancas();
  const bancaId = SELLER_BANCA_MAP[sellerId];
  const idx = items.findIndex((b) => b.id === bancaId || b.id.endsWith(bancaId));
  if (idx === -1) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data = body?.data ?? body;
    const updated = mergeBanca(items[idx], data);
    items[idx] = updated;
    await writeBancas(items);
    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Erro ao atualizar banca" }, { status: 500 });
  }
}
