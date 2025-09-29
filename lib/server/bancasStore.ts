import { promises as fs } from "fs";
import path from "path";

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

const BANCAS_PATH = path.join(process.cwd(), "data", "bancas.json");

export async function readBancas(): Promise<AdminBanca[]> {
  try {
    const raw = await fs.readFile(BANCAS_PATH, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeBancas(items: AdminBanca[]) {
  await fs.mkdir(path.dirname(BANCAS_PATH), { recursive: true });
  await fs.writeFile(BANCAS_PATH, JSON.stringify(items, null, 2), "utf-8");
}
