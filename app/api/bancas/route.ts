import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const BANCAS_PATH = path.join(process.cwd(), "data", "bancas.json");
type StoreBanca = { id: string; name: string; address?: string; lat?: number; lng?: number; cover: string; avatar?: string; description?: string; categories?: string[]; active: boolean; order: number };

async function readStore(): Promise<StoreBanca[]> {
  try {
    const raw = await fs.readFile(BANCAS_PATH, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const radiusKm = url.searchParams.get("radiusKm");

    let list = (await readStore()).filter((b) => b.active).sort((a, b) => a.order - b.order);

    if (lat && lng && radiusKm) {
      const la = parseFloat(lat);
      const ln = parseFloat(lng);
      const r = parseFloat(radiusKm);
      if (!Number.isNaN(la) && !Number.isNaN(ln) && !Number.isNaN(r)) {
        const degLat = r / 111; // approx degrees per km
        const degLng = r / (111 * Math.cos((la * Math.PI) / 180));
        list = list.filter(
          (b) => typeof b.lat === 'number' && typeof b.lng === 'number' && b.lat >= la - degLat && b.lat <= la + degLat && b.lng >= ln - degLng && b.lng <= ln + degLng
        );
      }
    }

    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao listar bancas" }, { status: 500 });
  }
}

// POST desabilitado na API pública; criação é via /api/admin/bancas
