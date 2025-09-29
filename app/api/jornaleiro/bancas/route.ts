import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BANCAS_PATH = path.join(process.cwd(), "data", "bancas.json");

export type IncomingBank = {
  name: string;
  whatsapp?: string;
  images?: { cover?: string; profile?: string };
  address?: { cep?: string; street?: string; number?: string; complement?: string; neighborhood?: string; city?: string; uf?: string };
  socials?: { gmb?: string; facebook?: string; instagram?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  meta?: { location?: { lat?: number; lng?: number } };
};

export type AdminBanca = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cover: string;
  avatar?: string;
  images?: { cover?: string; avatar?: string };
  addressObj?: { cep?: string; street?: string; number?: string; complement?: string; neighborhood?: string; city?: string; uf?: string };
  location?: { lat?: number; lng?: number };
  contact?: { whatsapp?: string };
  socials?: { facebook?: string; instagram?: string; gmb?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  rating?: number;
  tags?: string[];
  payments?: string[];
  gallery?: string[];
  featured?: boolean;
  ctaUrl?: string;
  description?: string;
  categories?: string[];
  active: boolean;
  order: number;
};

async function readStore(): Promise<AdminBanca[]> {
  try {
    const raw = await fs.readFile(BANCAS_PATH, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
async function writeStore(items: AdminBanca[]) {
  await fs.mkdir(path.dirname(BANCAS_PATH), { recursive: true });
  await fs.writeFile(BANCAS_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const banks: IncomingBank[] = Array.isArray(body?.banks) ? body.banks : (body?.bank ? [body.bank] : []);
    if (!banks.length) return NextResponse.json({ ok: false, error: "Nenhuma banca enviada" }, { status: 400 });
    const store = await readStore();
    const baseOrder = store.length;

    const mapped: AdminBanca[] = banks.map((b, i) => {
      const id = `banca-${Date.now()}-${i}`;
      const cover = b.images?.cover || "";
      const avatar = b.images?.profile || "";
      const addressLine = [b.address?.street, b.address?.number].filter(Boolean).join(", ");
      return {
        id,
        name: b.name,
        address: addressLine,
        lat: b.meta?.location?.lat,
        lng: b.meta?.location?.lng,
        cover,
        avatar,
        images: { cover, avatar },
        addressObj: b.address,
        location: b.meta?.location,
        contact: { whatsapp: b.whatsapp },
        socials: { facebook: b.socials?.facebook, instagram: b.socials?.instagram, gmb: b.socials?.gmb },
        hours: b.hours,
        rating: undefined,
        tags: [],
        payments: [],
        gallery: [],
        featured: false,
        ctaUrl: undefined,
        description: undefined,
        categories: [],
        active: false, // aguardando aprovação do admin
        order: baseOrder + i + 1,
      };
    });

    const updated = [...store, ...mapped];
    await writeStore(updated);
    return NextResponse.json({ ok: true, data: mapped });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Erro ao receber cadastro" }, { status: 500 });
  }
}
