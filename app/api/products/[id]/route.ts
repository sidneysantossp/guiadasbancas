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

    // Produtos de distribuidor: aplicar markup completo antes de retornar
    if (data.distribuidor_id) {
      console.log(`[API/PRODUCTS/ID] Produto ${productId} de distribuidor - aplicando markup`);
      
      // Buscar markup completo do distribuidor (global, categoria, produto)
      const [distRes, markupProdRes, markupCatRes] = await Promise.all([
        supabaseAdmin
          .from('distribuidores')
          .select('markup_global_percentual, markup_global_fixo, margem_divisor, tipo_calculo')
          .eq('id', data.distribuidor_id)
          .single(),
        supabaseAdmin
          .from('distribuidor_markup_produtos')
          .select('markup_percentual, markup_fixo')
          .eq('distribuidor_id', data.distribuidor_id)
          .eq('product_id', productId)
          .single(),
        data.category_id ? supabaseAdmin
          .from('distribuidor_markup_categorias')
          .select('markup_percentual, markup_fixo')
          .eq('distribuidor_id', data.distribuidor_id)
          .eq('category_id', data.category_id)
          .single() : Promise.resolve({ data: null })
      ]);

      const dist = distRes.data;
      const markupProd = markupProdRes.data;
      const markupCat = markupCatRes.data;
      const precoBase = data.price || 0;
      let precoFinal = precoBase;

      // 1. Prioridade: Markup por Produto
      if (markupProd) {
        const perc = Number(markupProd.markup_percentual || 0);
        const fixo = Number(markupProd.markup_fixo || 0);
        precoFinal = precoBase * (1 + perc / 100) + fixo;
        console.log(`[API/PRODUCTS/ID] Markup PRODUTO aplicado: ${precoBase} -> ${precoFinal}`);
      }
      // 2. Prioridade: Markup por Categoria
      else if (markupCat) {
        const perc = Number(markupCat.markup_percentual || 0);
        const fixo = Number(markupCat.markup_fixo || 0);
        precoFinal = precoBase * (1 + perc / 100) + fixo;
        console.log(`[API/PRODUCTS/ID] Markup CATEGORIA aplicado: ${precoBase} -> ${precoFinal}`);
      }
      // 3. Prioridade: Markup Global (com suporte a margem/divisor)
      else if (dist) {
        const tipoCalculo = dist.tipo_calculo || 'markup';
        if (tipoCalculo === 'margem') {
          const divisor = Number(dist.margem_divisor || 1);
          if (divisor > 0 && divisor < 1) {
            precoFinal = precoBase / divisor;
            console.log(`[API/PRODUCTS/ID] Markup MARGEM aplicado: ${precoBase} / ${divisor} = ${precoFinal}`);
          }
        } else {
          const perc = Number(dist.markup_global_percentual || 0);
          const fixo = Number(dist.markup_global_fixo || 0);
          if (perc > 0 || fixo > 0) {
            precoFinal = precoBase * (1 + perc / 100) + fixo;
            console.log(`[API/PRODUCTS/ID] Markup GLOBAL aplicado: ${precoBase} -> ${precoFinal} (${perc}% + R$${fixo})`);
          }
        }
      }

      // Atualizar preço no objeto de retorno
      data.price = Math.round(precoFinal * 100) / 100;
      data.cost_price = precoBase;
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
