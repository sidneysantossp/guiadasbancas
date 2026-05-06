import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Regex simples para validar UUID v4 (mesmo que o banco aceite outras formas,
// isso evita erros de sintaxe quando o frontend usa apelidos como "b1", "b2" etc.)
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function canShowMarketplaceCatalog(banca: { active?: boolean | null } | null | undefined) {
  return Boolean(banca?.active !== false);
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);

    // Se o ID não for um UUID válido (ex.: "b1", "b2"),
    // retornamos lista vazia para evitar 500 de sintaxe inválida no Postgres.
    if (!UUID_REGEX.test(bancaId)) {
      console.warn('[API/bancas/:id/products] ID da banca não é UUID válido, retornando lista vazia:', bancaId);
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: false,
        partner_linked: false,
        can_access_distributor_catalog: false,
        partner_catalog_access: false,
        items: [],
      });
    }

    const { data: banca, error: bancaError } = await supabaseAdmin
      .from('bancas')
      .select('id, active, approved, is_cotista, cotista_id')
      .eq('id', bancaId)
      .single();

    if (bancaError) {
      console.error('Erro ao buscar banca:', bancaError);
      return NextResponse.json({ success: false, error: bancaError.message }, { status: 500 });
    }

    const partnerLinked = banca?.is_cotista === true || Boolean(banca?.cotista_id);

    if (!canShowMarketplaceCatalog(banca)) {
      return NextResponse.json({
        success: true,
        banca_id: bancaId,
        is_cotista: partnerLinked,
        partner_linked: partnerLinked,
        can_access_distributor_catalog: false,
        partner_catalog_access: false,
        items: [],
      });
    }

    const [{ data: ownProducts, error: ownError }, { data: distributorProducts, error: distributorError }] = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('id, name, price, images, codigo_mercos, banca_id, distribuidor_id, stock_qty')
        .eq('banca_id', bancaId)
        .is('distribuidor_id', null)
        .eq('active', true)
        .limit(limit),
      supabaseAdmin
        .from('products')
        .select('id, name, price, images, codigo_mercos, banca_id, distribuidor_id, stock_qty')
        .not('distribuidor_id', 'is', null)
        .eq('active', true)
        .gt('stock_qty', 0)
        .order('name', { ascending: true })
        .limit(limit),
    ]);

    const error = ownError || distributorError;

    if (error) {
      console.error('Erro ao buscar produtos da banca:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const products = [...(ownProducts || []), ...(distributorProducts || [])].slice(0, limit);

    return NextResponse.json({
      success: true,
      banca_id: bancaId,
      is_cotista: partnerLinked,
      partner_linked: partnerLinked,
      can_access_distributor_catalog: true,
      partner_catalog_access: true,
      items: products,
    });
  } catch (e: any) {
    console.error('Erro ao buscar produtos da banca:', e);
    return NextResponse.json({ success: false, error: e?.message || "Erro ao buscar produtos da banca" }, { status: 500 });
  }
}
