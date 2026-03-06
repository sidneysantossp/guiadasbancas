import "server-only";

import { supabaseAdmin } from "@/lib/supabase";
import { buildFriendlyProductPath, parseProductParam, slugifyProductName } from "@/lib/product-url";
import { toBancaSlug } from "@/lib/slug";

type BancaRow = {
  id: string;
  name: string;
  is_cotista?: boolean | null;
  cotista_id?: string | null;
  active?: boolean | null;
};

type ProductRow = {
  id: string;
  name: string;
  description?: string | null;
  images?: string[] | null;
  codigo_mercos?: string | null;
  distribuidor_id?: string | null;
  banca_id?: string | null;
  bancas?: BancaRow | BancaRow[] | null;
};

export type PublicBanca = {
  id: string;
  name: string;
};

export type PublicProduct = ProductRow;

function extractBancaRow(input: ProductRow["bancas"]): BancaRow | null {
  if (!input) return null;
  if (Array.isArray(input)) return (input[0] as BancaRow) || null;
  return input as BancaRow;
}

function isActiveCotistaBanca(b: BancaRow | null | undefined): boolean {
  if (!b) return false;
  const isCotista = b.is_cotista === true || !!b.cotista_id;
  const isActive = b.active !== false;
  return isCotista && isActive;
}

function toPublicBanca(row: BancaRow): PublicBanca {
  return { id: row.id, name: row.name };
}

export function buildCanonicalProductPath(bancaName: string, productName: string): string {
  return buildFriendlyProductPath(bancaName, productName);
}

export async function getActiveCotistaBancas(): Promise<PublicBanca[]> {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("id,name,is_cotista,cotista_id,active")
    .eq("active", true)
    .or("is_cotista.eq.true,cotista_id.not.is.null");

  if (error || !Array.isArray(data)) return [];

  return data
    .filter((b) => isActiveCotistaBanca(b as BancaRow))
    .map((b) => toPublicBanca(b as BancaRow))
    .sort((a, b) => {
      const nameCmp = a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" });
      if (nameCmp !== 0) return nameCmp;
      return a.id.localeCompare(b.id);
    });
}

export async function resolveBancaById(id?: string | null): Promise<PublicBanca | null> {
  const bancaId = String(id || "").trim();
  if (!bancaId) return null;

  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("id,name,is_cotista,cotista_id,active")
    .eq("id", bancaId)
    .maybeSingle();

  if (error || !data) return null;
  if (!isActiveCotistaBanca(data as BancaRow)) return null;
  return toPublicBanca(data as BancaRow);
}

export async function resolveBancaBySlug(rawSlug: string): Promise<PublicBanca | null> {
  const bancaSlug = toBancaSlug(rawSlug || "");
  if (!bancaSlug) return null;

  const bancas = await getActiveCotistaBancas();
  const matches = bancas.filter((b) => toBancaSlug(b.name) === bancaSlug);
  if (matches.length === 0) return null;

  return matches.sort((a, b) => a.id.localeCompare(b.id))[0];
}

function isProductPublic(product: ProductRow): boolean {
  if (product.distribuidor_id) return true;
  return isActiveCotistaBanca(extractBancaRow(product.bancas));
}

async function getActiveProductsForPublicRoute(): Promise<ProductRow[]> {
  const pageSize = 1000;
  const results: ProductRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select(`
        id,
        name,
        description,
        images,
        codigo_mercos,
        banca_id,
        distribuidor_id,
        active,
        bancas(id,name,is_cotista,cotista_id,active)
      `)
      .eq("active", true)
      .range(from, from + pageSize - 1);

    if (error || !Array.isArray(data) || data.length === 0) break;

    results.push(...(data as ProductRow[]));

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return results;
}

export async function resolveProductByRawParam(rawParam: string): Promise<PublicProduct | null> {
  const parsed = parseProductParam(rawParam);

  let query = supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      description,
      images,
      codigo_mercos,
      banca_id,
      distribuidor_id,
      active,
      bancas(id,name,is_cotista,cotista_id,active)
    `)
    .eq("active", true);

  if (parsed.kind === "id") {
    query = query.eq("id", parsed.value);
  } else {
    query = query.eq("codigo_mercos", parsed.value);
  }

  const { data, error } = await query.limit(1).maybeSingle();
  if (error || !data) return null;

  const product = data as ProductRow;
  if (!isProductPublic(product)) return null;
  return product;
}

export async function resolveProductBySlug(
  productSlugRaw: string,
  bancaId?: string | null
): Promise<PublicProduct | null> {
  const productSlug = slugifyProductName(productSlugRaw || "");
  if (!productSlug) return null;

  const allProducts = await getActiveProductsForPublicRoute();
  const candidates = allProducts
    .filter((p) => slugifyProductName(p.name || "") === productSlug)
    .filter((p) => isProductPublic(p));

  if (candidates.length === 0) return null;

  const bancaIdNorm = String(bancaId || "").trim();
  const ranked = [...candidates].sort((a, b) => {
    const aBancaMatch = bancaIdNorm && a.banca_id === bancaIdNorm ? 0 : 1;
    const bBancaMatch = bancaIdNorm && b.banca_id === bancaIdNorm ? 0 : 1;
    if (aBancaMatch !== bBancaMatch) return aBancaMatch - bBancaMatch;

    const aDistrib = a.distribuidor_id ? 0 : 1;
    const bDistrib = b.distribuidor_id ? 0 : 1;
    if (aDistrib !== bDistrib) return aDistrib - bDistrib;

    const aCode = String(a.codigo_mercos || "");
    const bCode = String(b.codigo_mercos || "");
    const codeCmp = aCode.localeCompare(bCode, "pt-BR", { sensitivity: "base" });
    if (codeCmp !== 0) return codeCmp;

    return String(a.id).localeCompare(String(b.id));
  });

  return ranked[0] || null;
}

export async function isDistribuidorProductEnabledForBanca(
  productId: string,
  bancaId: string
): Promise<boolean> {
  if (!productId || !bancaId) return false;
  const { data, error } = await supabaseAdmin
    .from("banca_produtos_distribuidor")
    .select("enabled")
    .eq("product_id", productId)
    .eq("banca_id", bancaId)
    .maybeSingle();

  if (error) return true;
  if (!data) return true;
  return data.enabled !== false;
}

export async function resolveBancaForProduct(
  product: PublicProduct,
  bancaIdFromQuery?: string | null
): Promise<PublicBanca | null> {
  const fromQuery = await resolveBancaById(bancaIdFromQuery);
  if (fromQuery) return fromQuery;

  const fromProduct = await resolveBancaById(product.banca_id);
  if (fromProduct) return fromProduct;

  const cotistas = await getActiveCotistaBancas();
  return cotistas[0] || null;
}
