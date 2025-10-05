import { NextRequest, NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/server/productsStore";
import type { Produto } from "@/types/admin";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const productId = context.params.id;

  // Primeiro tenta buscar do Supabase
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(id, name),
        bancas(id, name, address, whatsapp)
      `)
      .eq('id', productId)
      .single();

    if (data && !error) {
      return NextResponse.json(data);
    }
  } catch (supaError) {
    console.error('[API/PRODUCTS/ID] Erro ao buscar do Supabase:', supaError);
  }

  // Fallback para arquivo JSON local (legacy)
  let items = await readProducts();
  if (!items.length) {
    const legacy = (globalThis as any).__PRODUCTS_STORE__ as Produto[] | undefined;
    if (Array.isArray(legacy) && legacy.length) items = legacy as any;
  }
  const item = items.find(p => p.id === productId);
  if (!item) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  try {
    const body = await req.json();
    let items = await readProducts();
    if (!items.length) {
      const legacy = (globalThis as any).__PRODUCTS_STORE__ as Produto[] | undefined;
      if (Array.isArray(legacy) && legacy.length) items = legacy as any;
    }
    const idx = items.findIndex((p: any) => p.id === context.params.id);
    if (idx === -1) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    const updated = { ...items[idx], ...body, id: context.params.id } as any;
    items[idx] = updated;
    await writeProducts(items as any);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao atualizar" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: { id: string } }) {
  const items = await readProducts();
  const idx = items.findIndex((p: any) => p.id === context.params.id);
  if (idx === -1) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  const removed = items.splice(idx, 1)[0];
  await writeProducts(items as any);
  return NextResponse.json({ ok: true, removed });
}
