import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const productId = context.params.id;
  
  // Pegar banca_id da query string (quando produto é acessado do perfil de uma banca)
  const { searchParams } = new URL(req.url);
  const bancaIdFromQuery = searchParams.get('banca');

  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(id, name),
        bancas(id, name, address, whatsapp, is_cotista, cotista_id, active)
      `)
      .eq('id', productId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    const isActiveCotistaBanca = (b: any) => (b?.is_cotista === true || !!b?.cotista_id);

    // Produtos próprios só são públicos se a banca for cotista ativa
    if (!data.distribuidor_id) {
      if (!isActiveCotistaBanca(data.bancas)) {
        return NextResponse.json({ error: "Produto não disponível" }, { status: 404 });
      }
    }

    // Produtos de distribuidor são públicos - podem ser vendidos por qualquer banca cotista
    // A associação com a banca específica é feita no momento da compra
    if (data.distribuidor_id) {
      console.log(`[API/PRODUCTS/ID] Produto ${productId} de distribuidor - acesso público permitido`);
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
