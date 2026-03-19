import { getDistribuidorAccessibleBancas, type DistribuidorAccessibleBanca } from "@/lib/distribuidor-access";
import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";

type PublicBancaVisibilityInput = {
  active?: boolean | null;
  approved?: boolean | null;
  is_cotista?: boolean | null;
  cotista_id?: string | null;
};

export function isLegacyCotistaLinked(input: PublicBancaVisibilityInput | null | undefined) {
  if (!input) return false;
  return input.is_cotista === true || Boolean(input.cotista_id);
}

export function isPublishedMarketplaceBanca(input: PublicBancaVisibilityInput | null | undefined) {
  return resolveBancaLifecycle({
    active: input?.active,
    approved: input?.approved,
  }).isPublished;
}

export async function getPublishedDistributorCatalogBancas(): Promise<DistribuidorAccessibleBanca[]> {
  const bancas = await getDistribuidorAccessibleBancas();
  return bancas.filter((banca) => isPublishedMarketplaceBanca(banca));
}
