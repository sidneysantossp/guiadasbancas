import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export type AdminCategory = {
  id: string;
  name: string;
  image: string;
  link: string; // internal route like /categoria/slug
  active: boolean;
  order: number;
};

async function readCategories(): Promise<AdminCategory[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('order', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      image: cat.image || '',
      link: cat.link,
      active: cat.active,
      order: cat.order
    }));
  } catch {
    return [];
  }
}

async function writeCategories(items: AdminCategory[]) {
  // Não usado mais - mantido para compatibilidade
  console.warn('writeCategories deprecated - use individual category operations');
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
      link: (data.link || "").toString(),
      active: Boolean(data.active ?? true),
      order: items.length + 1,
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
      await writeCategories(data as AdminCategory[]);
      return NextResponse.json({ success: true, data });
    }

    const idx = items.findIndex((c) => c.id === data?.id);
    if (idx === -1) return NextResponse.json({ success: false, error: "Categoria não encontrada" }, { status: 404 });
    items[idx] = { ...items[idx], ...(data as AdminCategory) };
    await writeCategories(items);
    return NextResponse.json({ success: true, data: items[idx] });
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
