import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";
import { supabaseAdmin } from "@/lib/supabase";

async function ensureJornaleiroWithBanca(userId: string) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const banca = await loadActiveJornaleiroBancaRow({
    userId,
    select: "id, user_id",
  });

  if (!banca) {
    throw new Error("BANCA_NOT_FOUND");
  }

  return banca;
}

export async function listJornaleiroCampaigns(params: {
  userId: string;
  status?: string | null;
}) {
  const banca = await ensureJornaleiroWithBanca(params.userId);

  let query = supabaseAdmin
    .from("campaigns")
    .select(`
      id,
      title,
      description,
      start_date,
      end_date,
      duration_days,
      status,
      admin_message,
      rejection_reason,
      impressions,
      clicks,
      created_at,
      updated_at,
      products (
        id,
        name,
        description,
        price,
        price_original,
        discount_percent,
        images,
        rating_avg,
        reviews_count,
        pronta_entrega,
        sob_encomenda,
        pre_venda
      )
    `)
    .eq("banca_id", banca.id)
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || "Erro ao buscar campanhas");
  }

  return {
    success: true,
    data: data || [],
    total: data?.length || 0,
  };
}

export async function createJornaleiroCampaign(params: {
  userId: string;
  input: Record<string, unknown>;
}) {
  const banca = await ensureJornaleiroWithBanca(params.userId);
  const productId = String(params.input.product_id || "").trim();
  const duration = Number(params.input.duration_days || 0);
  const title = typeof params.input.title === "string" ? params.input.title : "";
  const description =
    typeof params.input.description === "string" ? params.input.description : "";

  if (!productId) {
    throw new Error("INVALID_PRODUCT_REQUIRED");
  }

  if (![7, 15, 30].includes(duration)) {
    throw new Error("INVALID_CAMPAIGN_DURATION");
  }

  const { data: ownedProduct, error: productError } = await supabaseAdmin
    .from("products")
    .select("id, banca_id, name")
    .eq("id", productId)
    .eq("banca_id", banca.id)
    .maybeSingle();

  if (productError) {
    throw new Error(productError.message || "Erro ao validar produto da campanha");
  }

  if (!ownedProduct) {
    throw new Error("PRODUCT_NOT_FOUND_IN_BANCA");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration);

  const { data, error } = await supabaseAdmin
    .from("campaigns")
    .insert({
      product_id: ownedProduct.id,
      banca_id: banca.id,
      title: title || `Campanha - ${ownedProduct.name}`,
      description,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      duration_days: duration,
      status: "pending",
      plan_type: "free",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar campanha");
  }

  return {
    success: true,
    data,
  };
}
