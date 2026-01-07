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

    // Produtos de distribuidor: aplicar markup antes de retornar
    if (data.distribuidor_id) {
      console.log(`[API/PRODUCTS/ID] Produto ${productId} de distribuidor - aplicando markup`);
      
      // Buscar markup do distribuidor
      const { data: dist } = await supabaseAdmin
        .from('distribuidores')
        .select('markup_global_percentual, markup_global_fixo')
        .eq('id', data.distribuidor_id)
        .single();

      if (dist) {
        const precoBase = data.price || 0;
        const perc = Number(dist.markup_global_percentual || 0);
        const fixo = Number(dist.markup_global_fixo || 0);
        
        if (perc > 0 || fixo > 0) {
          const precoComMarkup = precoBase * (1 + perc / 100) + fixo;
          console.log(`[API/PRODUCTS/ID] Markup aplicado: ${precoBase} -> ${precoComMarkup} (${perc}% + R$${fixo})`);
          
          // Atualizar preço no objeto de retorno
          data.price = Math.round(precoComMarkup * 100) / 100; // Arredondar para 2 casas
          data.cost_price = precoBase; // Guardar preço base para referência
        }
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
