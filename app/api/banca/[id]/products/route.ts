import { NextRequest, NextResponse } from "next/server";
import { readProducts } from "@/lib/server/productsStore";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    if (!bancaId) {
      return NextResponse.json({ error: "ID da banca é obrigatório" }, { status: 400 });
    }

    // Buscar todos os produtos
    let items = await readProducts();
    
    // Fallback para dados legados se arquivo vazio
    if (!items.length) {
      const legacy = (globalThis as any).__PRODUCTS_STORE__ as any[] | undefined;
      if (Array.isArray(legacy) && legacy.length) {
        items = legacy as any;
      }
    }

    // Filtrar produtos da banca (múltiplas estratégias de match)
    const produtos = items.filter((p: any) => {
      if (!p || typeof p.banca_id !== 'string') return false;
      
      // Estratégias de match:
      // 1. Igual exato
      if (p.banca_id === bancaId) return true;
      
      // 2. Produto termina com bancaId (ex: "banca-123" termina com "123")
      if (p.banca_id.endsWith(bancaId)) return true;
      
      // 3. bancaId termina com produto (ex: "banca-123" e produto "123")
      if (bancaId.endsWith(p.banca_id)) return true;
      
      // 4. Contém o ID (mais permissivo)
      if (p.banca_id.includes(bancaId) || bancaId.includes(p.banca_id)) return true;
      
      return false;
    }).filter((p: any) => p.active !== false); // Só produtos ativos

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      total: produtos.length,
      products: produtos
    });

  } catch (error: any) {
    console.error('Erro ao buscar produtos da banca:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
