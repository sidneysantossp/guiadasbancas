import {
  getBrazilianDocumentType,
  getBrazilianDocumentVariants,
  isValidBrazilianDocument,
  normalizeBrazilianDocument,
} from "@/lib/documents";
import { supabaseAdmin } from "@/lib/supabase";

type BancaLookupRow = {
  id: string;
  name?: string | null;
  address?: unknown;
};

function formatBancaAddress(address: unknown) {
  if (typeof address === "string") {
    return address;
  }

  if (address && typeof address === "object") {
    const addr = address as Record<string, unknown>;
    return [
      addr.street,
      addr.number,
      addr.neighborhood,
      addr.city,
      addr.uf,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

function dedupeBancas(rows: BancaLookupRow[]) {
  return Array.from(new Map(rows.map((item) => [item.id, item])).values());
}

export async function checkJornaleiroDocumentAvailability(document: string) {
  if (!document) {
    throw new Error("CPF_REQUIRED");
  }

  const normalizedDocument = normalizeBrazilianDocument(document);

  if (!isValidBrazilianDocument(normalizedDocument)) {
    throw new Error("INVALID_DOCUMENT");
  }

  const documentType = getBrazilianDocumentType(normalizedDocument);
  const documentVariants = getBrazilianDocumentVariants(normalizedDocument);

  const [{ data: cotistas, error: cotistasError }, { data: directBancas, error: directBancasError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      supabaseAdmin
        .from("cotistas")
        .select("id")
        .eq("cnpj_cpf", normalizedDocument),
      supabaseAdmin
        .from("bancas")
        .select("id, name, address")
        .eq("cotista_cnpj_cpf", normalizedDocument)
        .eq("active", true),
      supabaseAdmin
        .from("user_profiles")
        .select("id, banca_id")
        .in("cpf", documentVariants),
    ]);

  if (cotistasError) {
    console.error("[check-cpf] Erro ao buscar cotistas:", cotistasError);
  }

  if (directBancasError) {
    console.error("[check-cpf] Erro ao buscar bancas por cotista:", directBancasError);
  }

  if (profilesError) {
    console.error("[check-cpf] Erro ao buscar perfis:", profilesError);
  }

  const userIds = (profiles || []).map((profile) => profile.id).filter(Boolean);
  const bancaIds = (profiles || []).map((profile) => profile.banca_id).filter(Boolean);

  const [profileBancasByIdResult, profileBancasByUserResult] = await Promise.all([
    bancaIds.length > 0
      ? supabaseAdmin
          .from("bancas")
          .select("id, name, address")
          .in("id", bancaIds)
          .eq("active", true)
      : Promise.resolve({ data: [] as BancaLookupRow[], error: null }),
    userIds.length > 0
      ? supabaseAdmin
          .from("bancas")
          .select("id, name, address")
          .in("user_id", userIds)
          .eq("active", true)
      : Promise.resolve({ data: [] as BancaLookupRow[], error: null }),
  ]);

  if (profileBancasByIdResult.error) {
    console.error("[check-cpf] Erro ao buscar bancas por ids:", profileBancasByIdResult.error);
  }

  if (profileBancasByUserResult.error) {
    console.error("[check-cpf] Erro ao buscar bancas por user_id:", profileBancasByUserResult.error);
  }

  const activeBancas = dedupeBancas([
    ...((directBancas as BancaLookupRow[] | null) || []),
    ...((profileBancasByIdResult.data as BancaLookupRow[] | null) || []),
    ...((profileBancasByUserResult.data as BancaLookupRow[] | null) || []),
  ]);

  const bancas = activeBancas.map((banca) => ({
    id: banca.id,
    name: banca.name || "Banca sem nome",
    address: formatBancaAddress(banca.address) || "Endereço não informado",
  }));

  if (bancas.length === 0) {
    return {
      exists: false,
      bancas: [],
      isCotista: Boolean(cotistas && cotistas.length > 0),
      partnerLinked: Boolean(cotistas && cotistas.length > 0),
    };
  }

  return {
    exists: true,
    bancas,
    isCotista: Boolean(cotistas && cotistas.length > 0),
    partnerLinked: Boolean(cotistas && cotistas.length > 0),
    message:
      documentType === "cpf"
        ? "CPF já possui cadastro com banca ativa"
        : "CNPJ já possui cadastro com banca ativa",
  };
}
