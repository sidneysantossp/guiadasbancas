import { NextRequest, NextResponse } from "next/server";
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

  return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

export async function DELETE(_req: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
