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

  // 1. Buscar produto COM join de banca (como a API faz)
  const { data: productWithJoin, error: productError } = await supabaseAdmin
    .from("products")
    .select(`
      id, name, banca_id, distribuidor_id,
      bancas(id, name, user_id, slug)
    `)
    .eq("id", productId)
    .single();

  // 2. Se tem banca_id, buscar dados da banca separadamente
  let bancaSeparada = null;
  if (productWithJoin?.banca_id) {
    const { data, error } = await supabaseAdmin
      .from("bancas")
      .select("id, name, user_id, slug")
      .eq("id", productWithJoin.banca_id)
      .single();
    bancaSeparada = { data, error: error?.message };
  }

  // 3. Buscar a banca PONTOCOM
  const { data: pontocom } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id, slug")
    .ilike("name", "%pontocom%")
    .limit(5);

  // 4. Verificar se banca_id e160f10f existe
  const { data: bancaE160, error: bancaE160Error } = await supabaseAdmin
    .from("bancas")
    .select("id, name")
    .eq("id", "e160f10f-23bd-478b-b3fd-9d6991526e70")
    .single();

  return NextResponse.json({
    product_id: productId,
    product_com_join: productWithJoin,
    product_error: productError?.message,
    banca_do_join: productWithJoin?.bancas,
    banca_separada: bancaSeparada,
    banca_e160f10f_existe: bancaE160 ? true : false,
    banca_e160f10f: bancaE160,
    banca_e160f10f_error: bancaE160Error?.message,
    bancas_pontocom: pontocom,
    diagnostico: !productWithJoin?.bancas && productWithJoin?.banca_id 
      ? `PROBLEMA: banca_id ${productWithJoin.banca_id} não existe no banco!` 
      : "OK",
  });
}
