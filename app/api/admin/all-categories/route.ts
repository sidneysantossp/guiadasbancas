import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

/**
 * GET - Retorna TODAS as categorias (bancas + distribuidores) para filtros
 */
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    // Buscar categorias de bancas
    const { data: categoriesBancas } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('active', true)
      .order('name');

    // Buscar categorias de distribuidores
    const { data: categoriesDistribuidores } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome')
      .eq('ativo', true)
      .order('nome');

    // Combinar e remover duplicatas por nome
    const allCategories: { id: string; name: string }[] = [];
    const uniqueNames = new Set<string>();

    // Adicionar categorias de bancas
    (categoriesBancas || []).forEach(cat => {
      if (!uniqueNames.has(cat.name)) {
        allCategories.push({ id: cat.id, name: cat.name });
        uniqueNames.add(cat.name);
      }
    });

    // Adicionar categorias de distribuidores
    (categoriesDistribuidores || []).forEach(cat => {
      if (!uniqueNames.has(cat.nome)) {
        allCategories.push({ id: cat.id, name: cat.nome });
        uniqueNames.add(cat.nome);
      }
    });

    // Ordenar por nome
    allCategories.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ success: true, data: allCategories });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return NextResponse.json({ success: false, error: "Erro ao buscar categorias" }, { status: 500 });
  }
}
