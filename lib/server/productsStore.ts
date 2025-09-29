import { promises as fs } from "fs";
import path from "path";

export type ProdutoItem = {
  id: string;
  banca_id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string;
  images?: string[];
  price: number;
  price_original?: number;
  discount_percent?: number;
  stock_qty?: number;
  track_stock?: boolean;
  featured?: boolean;
  active: boolean;
  rating_avg?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
  coupon_code?: string;
};

const PRODUCTS_PATH = path.join(process.cwd(), "data", "products.json");

export async function readProducts(): Promise<ProdutoItem[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeProducts(items: ProdutoItem[]) {
  await fs.mkdir(path.dirname(PRODUCTS_PATH), { recursive: true });
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(items, null, 2), "utf-8");
}
