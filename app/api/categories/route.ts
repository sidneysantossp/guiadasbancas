import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export type PublicCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

const CATS_PATH = path.join(process.cwd(), "data", "categories.json");

export async function GET(_request: NextRequest) {
  try {
    const raw = await fs.readFile(CATS_PATH, "utf-8").catch(()=>"[]");
    const parsed = JSON.parse(raw || "[]") as Array<any>;
    const items = Array.isArray(parsed) ? parsed : [];
    const active = items.filter((c) => c.active);
    const data: PublicCategory[] = active
      .sort((a,b)=> (a.order||0)-(b.order||0))
      .map((c) => ({ id: c.id, name: c.name, image: c.image, link: c.link, order: c.order }));
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
  }
}
