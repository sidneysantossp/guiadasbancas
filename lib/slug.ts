export function toBancaSlug(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const VALID_UFS = new Set([
  "ac", "al", "ap", "am", "ba", "ce", "df", "es", "go", "ma", "mt", "ms",
  "mg", "pa", "pb", "pr", "pe", "pi", "rj", "rn", "rs", "ro", "rr", "sc",
  "sp", "se", "to",
]);

const BRAZIL_UF_BY_NAME: Record<string, string> = {
  acre: "ac",
  alagoas: "al",
  amapa: "ap",
  amazonas: "am",
  bahia: "ba",
  ceara: "ce",
  "distrito federal": "df",
  "espirito santo": "es",
  goias: "go",
  maranhao: "ma",
  "mato grosso": "mt",
  "mato grosso do sul": "ms",
  "minas gerais": "mg",
  para: "pa",
  paraiba: "pb",
  parana: "pr",
  pernambuco: "pe",
  piaui: "pi",
  "rio de janeiro": "rj",
  "rio grande do norte": "rn",
  "rio grande do sul": "rs",
  rondonia: "ro",
  roraima: "rr",
  "santa catarina": "sc",
  "sao paulo": "sp",
  sergipe: "se",
  tocantins: "to",
};

function normalizeStateValue(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD").replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toUf(value?: string | null): string {
  const normalized = normalizeStateValue(value || "");
  if (!normalized) return "sp";

  if (VALID_UFS.has(normalized)) {
    return normalized;
  }

  const byName = BRAZIL_UF_BY_NAME[normalized];
  if (byName) {
    return byName;
  }

  const words = normalized.split(" ").filter(Boolean);
  for (const word of words) {
    if (VALID_UFS.has(word)) {
      return word;
    }
  }

  return "sp";
}

// Helper: extract UF from a variety of inputs
export function getUf(input?: { state?: string } | string | null): string {
  if (!input) return "sp";
  if (typeof input === "string") return toUf(input);
  return toUf(input.state);
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
