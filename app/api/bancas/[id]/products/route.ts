import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Regex simples para validar UUID v4 (mesmo que o banco aceite outras formas,
// isso evita erros de sintaxe quando o frontend usa apelidos como "b1", "b2" etc.)
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);

    // Se o ID não for um UUID válido (ex.: "b1", "b2"),
    // retornamos lista vazia para evitar 500 de sintaxe inválida no Postgres.
    if (!UUID_REGEX.test(bancaId)) {
      console.warn('[API/bancas/:id/products] ID da banca não é UUID válido, retornando lista vazia:', bancaId);
      return NextResponse.json({ success: true, items: [] });
    }

    const { data: banca, error: bancaError } = await supabaseAdmin
      .from('bancas')
      .select('id, is_cotista, cotista_id, active')
      .eq('id', bancaId)
      .single();

    if (bancaError) {
      console.error('Erro ao buscar banca:', bancaError);
      return NextResponse.json({ success: false, error: bancaError.message }, { status: 500 });
    }

    const isActiveCotista = (banca?.is_cotista === true || !!banca?.cotista_id);
    if (!isActiveCotista) {
      return NextResponse.json({ success: true, items: [] });
    }

    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, price, images, codigo_mercos')
      .eq('banca_id', bancaId)
      .eq('active', true)
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar produtos da banca:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: products || [] });
  } catch (e: any) {
    console.error('Erro ao buscar produtos da banca:', e);
    return NextResponse.json({ success: false, error: e?.message || "Erro ao buscar produtos da banca" }, { status: 500 });
  }
}
