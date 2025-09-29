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

    // Filtrar produtos em destaque da banca
    const featuredProducts = items.filter((p: any) => {
      if (!p || typeof p.banca_id !== 'string') return false;
      if (!p.active || !p.featured) return false;
      
      // Estratégias de match para banca_id
      return (
        p.banca_id === bancaId ||
        p.banca_id.endsWith(bancaId) ||
        bancaId.endsWith(p.banca_id) ||
        p.banca_id.includes(bancaId) ||
        bancaId.includes(p.banca_id)
      );
    }).slice(0, 8); // Máximo 8 produtos em destaque

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      total: featuredProducts.length,
      products: featuredProducts
    });

  } catch (error: any) {
    console.error('Erro ao buscar produtos em destaque:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      details: error?.message 
    }, { status: 500 });
  }
}
