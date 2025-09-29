export function toBancaSlug(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Helper: extract UF from a variety of inputs
export function getUf(input?: { state?: string } | string | null): string {
  if (!input) return "sp";
  if (typeof input === "string") return (input || "sp").toLowerCase();
  const uf = input.state || "sp";
  return (uf || "sp").toLowerCase();
}

// Build banca profile href using UF + slug-name-id
export function buildBancaHref(name: string, id: string, locOrUf?: { state?: string } | string | null): string {
  const uf = getUf(locOrUf);
  return `/banca/${uf}/${toBancaSlug(name)}-${id}`;
}

// Build 'bancas perto de mim' href; we include uf as query for potential filtering
export function buildBancasNearMeHref(locOrUf?: { state?: string } | string | null): string {
  const uf = getUf(locOrUf);
  return `/bancas-perto-de-mim?uf=${uf}`;
}
