import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// DEBUG ENDPOINT - REMOVER DEPOIS
export async function GET(req: NextRequest) {
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Pegar product_id da query string
  const url = new URL(req.url);
  const productId = url.searchParams.get("product_id") || "9297f1ad-dd9f-4f06-8f69-0206940cc51a";

  // 1. Buscar produto
  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, name, banca_id, distribuidor_id")
    .eq("id", productId)
    .single();

  // 2. Se tem banca_id, buscar dados da banca
  let banca = null;
  if (product?.banca_id) {
    const { data } = await supabaseAdmin
      .from("bancas")
      .select("id, name, user_id, slug")
      .eq("id", product.banca_id)
      .single();
    banca = data;
  }

  // 3. Se tem distribuidor_id, buscar dados do distribuidor
  let distribuidor = null;
  if (product?.distribuidor_id) {
    const { data } = await supabaseAdmin
      .from("distribuidores")
      .select("id, nome")
      .eq("id", product.distribuidor_id)
      .single();
    distribuidor = data;
  }

  // 4. Buscar a banca PONTOCOM para comparar
  const { data: pontocom } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id, slug")
    .ilike("name", "%pontocom%")
    .limit(5);

  return NextResponse.json({
    product_id: productId,
    product: product,
    product_error: productError?.message,
    banca_do_produto: banca,
    distribuidor_do_produto: distribuidor,
    bancas_pontocom: pontocom,
    problema: product?.banca_id ? "Produto tem banca_id definido" : "Produto NÃO tem banca_id - pode estar pegando banca errada",
  });
}
