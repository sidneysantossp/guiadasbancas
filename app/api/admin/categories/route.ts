import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export type AdminCategory = {
  id: string;
  name: string;
  image: string;
  link: string; // internal route like /categoria/slug
  active: boolean;
  order: number;
};

const CATS_PATH = path.join(process.cwd(), "data", "categories.json");

async function ensureDataDir() {
  const dir = path.dirname(CATS_PATH);
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

async function readCategories(): Promise<AdminCategory[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(CATS_PATH, "utf-8").catch(()=>"[]");
    const parsed = JSON.parse(raw || "[]");
    const items = Array.isArray(parsed) ? parsed : [];
    // normalizar campos
    return items.map((c: any, i: number) => ({
      id: String(c.id ?? `cat-${Date.now()}-${i}`),
      name: String(c.name ?? ""),
      image: String(c.image ?? ""),
      link: String(c.link ?? ""),
      active: Boolean(c.active ?? true),
      order: Number(c.order ?? (i+1)),
    } as AdminCategory));
  } catch {
    return [];
  }
}

async function writeCategories(items: AdminCategory[]) {
  await ensureDataDir();
  const normalized = [...items]
    .sort((a,b)=> (a.order||0)-(b.order||0))
    .map((c, i) => ({ ...c, order: i+1 }));
  await fs.writeFile(CATS_PATH, JSON.stringify(normalized, null, 2), "utf-8");
}

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "true";
  const items = await readCategories();
  const list = includeInactive ? items : items.filter((c) => c.active);
  return NextResponse.json({ success: true, data: list.sort((a,b)=>a.order-b.order) });
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const data = body?.data as Partial<AdminCategory>;
    const items = await readCategories();
    const newItem: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: (data.name || "").toString(),
      image: (data.image || "").toString(),
      link: (data.link || "").toString().trim(),
      active: Boolean(data.active ?? true),
      order: (items.length + 1),
    };
    const updated = [...items, newItem];
    await writeCategories(updated);
    return NextResponse.json({ success: true, data: newItem });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao criar categoria" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { type, data } = body || {};
    const items = await readCategories();

    if (type === "bulk") {
      // Expect full list for reordering/edits
      const list = (Array.isArray(data) ? data : []) as AdminCategory[];
      await writeCategories(list);
      return NextResponse.json({ success: true, data: list });
    }

    const idx = items.findIndex((c) => c.id === data?.id);
    if (idx === -1) return NextResponse.json({ success: false, error: "Categoria não encontrada" }, { status: 404 });
    const updated = { ...items[idx], ...(data as AdminCategory) } as AdminCategory;
    items[idx] = updated;
    await writeCategories(items);
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    const items = await readCategories();
    const idx = items.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ success: false, error: "Categoria não encontrada" }, { status: 404 });
    items.splice(idx, 1);
    // reorder
    items.forEach((c, i) => (c.order = i + 1));
    await writeCategories(items);
    return NextResponse.json({ success: true, data: items });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Erro ao excluir categoria" }, { status: 500 });
  }
}
