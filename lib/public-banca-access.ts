import { getDistribuidorAccessibleBancas, type DistribuidorAccessibleBanca } from "@/lib/distribuidor-access";
import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";

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
