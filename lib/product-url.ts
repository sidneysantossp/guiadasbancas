import { toBancaSlug } from "@/lib/slug";

export type ProductParamParse =
  | { kind: "id"; value: string }
  | { kind: "codigo"; value: string };

const UUID_SUFFIX_REGEX = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
const OLD_PRODUCT_ID_REGEX = /(prod-\d+)$/i;

export function slugifyProductName(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function parseProductParam(param: string): ProductParamParse {
  const raw = String(param || "").trim();

  const uuidMatch = raw.match(UUID_SUFFIX_REGEX);
  if (uuidMatch?.[1]) {
    return { kind: "id", value: uuidMatch[1] };
  }

  const oldIdMatch = raw.match(OLD_PRODUCT_ID_REGEX);
  if (oldIdMatch?.[1]) {
    return { kind: "id", value: oldIdMatch[1] };
  }

  const pieces = raw.split("-").filter(Boolean);
  if (pieces.length > 1) {
    return { kind: "codigo", value: pieces[pieces.length - 1] };
  }

  return { kind: "codigo", value: raw };
}

export function buildProductSlug(
  name: string,
  codigoMercos?: string | number | null,
  fallbackId?: string | null
): string {
  const slug = slugifyProductName(name || "produto");
  const preferred = String(codigoMercos ?? "").trim();
  const fallback = String(fallbackId ?? "").trim();
  const identifier = preferred || fallback;

  if (!identifier) return slug;
  if (!slug) return identifier;
  return `${slug}-${identifier}`;
}

export function buildFriendlyProductPath(bancaName: string, productName: string): string {
  const bancaSlug = toBancaSlug(bancaName || "banca");
  const productSlug = slugifyProductName(productName || "produto");
  return `/${bancaSlug}/${productSlug}`;
}

export function buildPublicProductPath(
  productName: string,
  bancaName?: string | null,
  fallbackId?: string | null,
  codigoMercos?: string | number | null
): string {
  const safeProductName = String(productName || "").trim() || "produto";
  const safeBancaName = String(bancaName || "").trim();
  const normalizedBancaName = safeBancaName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const invalidBancaNames = new Set(["banca", "banca local", "banca nao informada"]);

  if (safeBancaName && !invalidBancaNames.has(normalizedBancaName)) {
    return buildFriendlyProductPath(safeBancaName, safeProductName);
  }

  void fallbackId;
  void codigoMercos;
  return buildFriendlyProductPath("banca", safeProductName);
}
