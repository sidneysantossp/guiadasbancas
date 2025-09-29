import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const BANCAS_FILE = path.join(DATA_DIR, "bancas.db.json");

export type BancaRecord = {
  id: string;
  name: string;
  cep: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  categories?: string[];
  coverImage?: string;
  createdAt: string;
};

export async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BANCAS_FILE);
  } catch {
    await fs.writeFile(BANCAS_FILE, "[]", "utf8");
  }
}

export async function readBancas(): Promise<BancaRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(BANCAS_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function writeBancas(list: BancaRecord[]) {
  await ensureDataFile();
  await fs.writeFile(BANCAS_FILE, JSON.stringify(list, null, 2), "utf8");
}
