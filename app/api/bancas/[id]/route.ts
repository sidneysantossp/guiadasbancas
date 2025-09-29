import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BANCAS_PATH = path.join(process.cwd(), "data", "bancas.json");

type StoreBanca = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cover: string;
  avatar?: string;
  description?: string;
  categories?: string[];
  active: boolean;
  order: number;
  images?: { cover?: string; avatar?: string };
  addressObj?: { cep?: string; street?: string; number?: string; complement?: string; neighborhood?: string; city?: string; uf?: string };
  location?: { lat?: number; lng?: number };
  contact?: { whatsapp?: string };
  socials?: { facebook?: string; instagram?: string; gmb?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
};

async function readStore(): Promise<StoreBanca[]> {
  try {
    const raw = await fs.readFile(BANCAS_PATH, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const list = await readStore();
    const found = list.find((b) => b.id === params.id);
    if (!found) return NextResponse.json({ error: "Banca não encontrada" }, { status: 404 });
    return NextResponse.json(found);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao buscar banca" }, { status: 500 });
  }
}
