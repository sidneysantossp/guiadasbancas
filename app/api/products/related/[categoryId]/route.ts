import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = params.categoryId;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 20);
    const excludeId = searchParams.get("exclude") || "";

    // Buscar produtos da mesma categoria
    let query = supabaseAdmin
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        codigo_mercos,
        category_id,
        active
      `)
      .eq('category_id', categoryId)
      .eq('active', true)
      .limit(limit);

    // Excluir produto atual se especificado
    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos relacionados:', error);
      return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
    }

    // Filtrar produtos com imagem
    const filteredProducts = (data || [])
      .filter(product => product.images && product.images.length > 0)
      .map(product => ({
        id: product.id,
        name: product.name || 'Produto',
        price: Number(product.price || 0),
        image: Array.isArray(product.images) ? product.images[0] : product.images,
        codigo_mercos: product.codigo_mercos,
      }));

    return NextResponse.json({
      success: true,
      data: filteredProducts
    });

  } catch (error: any) {
    console.error('Erro na API de produtos relacionados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
