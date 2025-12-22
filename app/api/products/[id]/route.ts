import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const productId = context.params.id;

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(id, name),
        bancas(id, name, address, whatsapp, is_cotista)
      `)
      .eq('id', productId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // IMPORTANTE: Produtos de distribuidor só podem ser acessados se:
    // 1. Não têm distribuidor_id (produto próprio da banca)
    // 2. OU a banca vinculada é cotista
    // 3. OU não têm banca vinculada (produto órfão - não deveria existir)
    if (data.distribuidor_id) {
      // É produto de distribuidor - verificar se banca é cotista
      const banca = data.bancas as any;
      
      if (!banca) {
        // Produto de distribuidor sem banca válida - não deveria ser acessível publicamente
        console.warn(`[API/PRODUCTS/ID] Produto ${productId} é de distribuidor mas não tem banca válida`);
        return NextResponse.json({ error: "Produto não disponível" }, { status: 404 });
      }
      
      if (!banca.is_cotista) {
        // Banca não é cotista - não deveria ter acesso a produtos de distribuidor
        console.warn(`[API/PRODUCTS/ID] Produto ${productId} é de distribuidor mas banca ${banca.id} não é cotista`);
        return NextResponse.json({ error: "Produto não disponível" }, { status: 404 });
      }
    }

    return NextResponse.json(data);
  } catch (supaError) {
    console.error('[API/PRODUCTS/ID] Erro ao buscar do Supabase:', supaError);
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

export async function DELETE(_req: NextRequest, context: { params: { id: string } }) {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}
