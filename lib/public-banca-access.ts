import { getDistribuidorAccessibleBancas, type DistribuidorAccessibleBanca } from "@/lib/distribuidor-access";
import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";
import { supabaseAdmin } from "@/lib/supabase";

type PublicBancaVisibilityInput = {
  id?: string | null;
  user_id?: string | null;
  active?: boolean | null;
  approved?: boolean | null;
  is_cotista?: boolean | null;
  cotista_id?: string | null;
};

export function isLegacyCotistaLinked(input: PublicBancaVisibilityInput | null | undefined) {
  if (!input) return false;
  return input.is_cotista === true || Boolean(input.cotista_id);
}

export function isPartnerLinked(input: PublicBancaVisibilityInput | null | undefined) {
  return isLegacyCotistaLinked(input);
}

export function isPublishedMarketplaceBanca(input: PublicBancaVisibilityInput | null | undefined) {
  return resolveBancaLifecycle({
    active: input?.active,
    approved: input?.approved,
  }).isPublished;
}

type MarketplaceBancaPreviewInput = {
  bancaId?: string | null;
  bancaUserId?: string | null;
  viewerUserId?: string | null;
  viewerBancaId?: string | null;
  viewerRole?: string | null;
};

export function canPreviewMarketplaceBanca(input: MarketplaceBancaPreviewInput | null | undefined) {
  if (!input) return false;
  if (input.viewerRole === "admin") return true;
  if (input.viewerBancaId && input.bancaId && input.viewerBancaId === input.bancaId) return true;
  if (input.viewerUserId && input.bancaUserId && input.viewerUserId === input.bancaUserId) return true;
  return false;
}

export async function getPublishedDistributorCatalogBancas(): Promise<DistribuidorAccessibleBanca[]> {
  const bancas = await getDistribuidorAccessibleBancas();
  return bancas.filter((banca) => isPublishedMarketplaceBanca(banca));
}

export type PublishedMarketplaceBanca = PublicBancaVisibilityInput & {
  id: string;
  name: string;
  lat?: number | string | null;
  lng?: number | string | null;
  user_id?: string | null;
  address?: string | null;
  cover_image?: string | null;
  profile_image?: string | null;
  whatsapp?: string | null;
};

export async function getPublishedMarketplaceBancas(): Promise<PublishedMarketplaceBanca[]> {
  const pageSize = 1000;
  const results: PublishedMarketplaceBanca[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from("bancas")
      .select("id, name, user_id, address, cover_image, profile_image, whatsapp, lat, lng, active, approved, is_cotista, cotista_id")
      .eq("active", true)
      .eq("approved", true)
      .range(from, from + pageSize - 1);

    if (error || !Array.isArray(data) || data.length === 0) break;

    results.push(...(data as PublishedMarketplaceBanca[]));

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return results;
}
