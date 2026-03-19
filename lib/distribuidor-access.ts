import logger from "@/lib/logger";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

type ActiveBancaRow = {
  id: string;
  name: string;
  address: string | null;
  whatsapp: string | null;
  phone: string | null;
  cover_image: string | null;
  active: boolean | null;
  approved: boolean | null;
  created_at: string;
  lat: number | null;
  lng: number | null;
  is_cotista: boolean | null;
  cotista_id: string | null;
};

export type DistribuidorAccessibleBanca = ActiveBancaRow & {
  contact_phone: string | null;
  can_access_distributor_catalog: boolean;
  plan_type: string | null;
  is_legacy_cotista_linked: boolean;
};

export async function getDistribuidorAccessibleBancas(): Promise<DistribuidorAccessibleBanca[]> {
  const { data: bancas, error } = await supabaseAdmin
    .from("bancas")
    .select("id, name, address, whatsapp, phone, cover_image, active, approved, created_at, lat, lng, is_cotista, cotista_id")
    .neq("active", false)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const resolved = await Promise.all(
    ((bancas || []) as ActiveBancaRow[]).map(async (banca) => {
      try {
        const entitlements = await resolveBancaPlanEntitlements({
          id: banca.id,
          is_cotista: banca.is_cotista,
          cotista_id: banca.cotista_id,
        });

        return {
          ...banca,
          contact_phone: banca.whatsapp || banca.phone,
          can_access_distributor_catalog: entitlements.canAccessDistributorCatalog,
          plan_type: entitlements.planType || null,
          is_legacy_cotista_linked: entitlements.isLegacyCotistaLinked,
        };
      } catch (error) {
        logger.error("[distribuidor-access] Falha ao resolver entitlements da banca:", banca.id, error);
        return {
          ...banca,
          contact_phone: banca.whatsapp || banca.phone,
          can_access_distributor_catalog: false,
          plan_type: null,
          is_legacy_cotista_linked: banca.is_cotista === true || Boolean(banca.cotista_id),
        };
      }
    })
  );

  return resolved.filter((banca) => banca.can_access_distributor_catalog);
}
