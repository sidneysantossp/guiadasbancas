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
        bancas(id, name, address, whatsapp, is_cotista)
      `)
      .eq('id', productId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // IMPORTANTE: Produtos de distribuidor só podem ser acessados se:
    // 1. Não têm distribuidor_id (produto próprio da banca)
    // 2. OU temos bancaIdFromQuery e essa banca é cotista
    // 3. OU a banca vinculada ao produto é cotista
    if (data.distribuidor_id) {
      // É produto de distribuidor - verificar se banca é cotista
      let bancaParaValidar = null;
      
      // Se temos banca da query string, buscar dados dela
      if (bancaIdFromQuery) {
        const { data: bancaQuery } = await supabaseAdmin
          .from('bancas')
          .select('id, name, is_cotista')
          .eq('id', bancaIdFromQuery)
          .single();
        
        bancaParaValidar = bancaQuery;
      } else {
        // Usar banca do produto (join)
        bancaParaValidar = data.bancas as any;
      }
      
      if (!bancaParaValidar) {
        // Produto de distribuidor sem banca válida
        console.warn(`[API/PRODUCTS/ID] Produto ${productId} é de distribuidor mas não tem banca válida`);
        return NextResponse.json({ error: "Produto não disponível" }, { status: 404 });
      }
      
      if (!bancaParaValidar.is_cotista) {
        // Banca não é cotista - não deveria ter acesso a produtos de distribuidor
        console.warn(`[API/PRODUCTS/ID] Produto ${productId} é de distribuidor mas banca ${bancaParaValidar.id} não é cotista`);
        return NextResponse.json({ error: "Produto não disponível" }, { status: 404 });
      }
      
      console.log(`[API/PRODUCTS/ID] Produto ${productId} de distribuidor - banca ${bancaParaValidar.name} é cotista ✓`);
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
