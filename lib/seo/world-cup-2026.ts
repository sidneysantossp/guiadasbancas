import "server-only";

import type { Metadata } from "next";
import { buildBancaHref, getUf } from "@/lib/slug";
import { supabaseAdmin } from "@/lib/supabase";

export type WorldCupHubLink = {
  href: string;
  title: string;
  description: string;
};

export type WorldCupCityPage = {
  slug: string;
  city: string;
  state: string;
  label: string;
  aliases: string[];
};

export type WorldCupBancaLink = {
  id: string;
  name: string;
  address: string;
  href: string;
};

export type WorldCupProductLink = {
  id: string;
  name: string;
  href: string;
  image: string | null;
  price: number | null;
  context: string;
};

type CategoryRow = {
  id: string;
  name: string;
  link?: string | null;
};

type ProductRow = {
  id: string;
  name: string;
  description?: string | null;
  images?: string[] | null;
  price?: number | null;
  codigo_mercos?: string | null;
  category_id?: string | null;
  banca_id?: string | null;
  distribuidor_id?: string | null;
};

const SITE_URL = "https://www.guiadasbancas.com.br";
const WORLD_CUP_CATEGORY_TERMS = ["figur", "album", "card", "panini", "adesiv", "colecion"];
const WORLD_CUP_PRODUCT_OR_TERMS = [
  "fifa",
  "world class",
  "brasileir",
  "libertadores",
  "futsal",
  "corinthians",
  "palmeiras",
  "athletico",
  "album",
  "cromos",
  "figurinhas",
  "cards",
  "deck",
  "blister",
  "env",
];
const WORLD_CUP_PRODUCT_SPORT_TERMS = [
  "fifa",
  "world class",
  "brasileir",
  "libertadores",
  "futsal",
  "corinthians",
  "palmeiras",
  "athletico",
  "futebol",
  "conmebol",
  "torcedor",
  "campeao",
  "selecao",
  "copa do mundo",
];
const WORLD_CUP_PRODUCT_COLLECTIBLE_TERMS = [
  "album",
  "liv.ilust",
  "liv. ilust",
  "blister",
  "env",
  "cromos",
  "figurinh",
  "cards",
  "deck",
  "poster",
];
const WORLD_CUP_FALLBACK_CATEGORY_LINKS: WorldCupHubLink[] = [
  {
    href: "/categorias/panini",
    title: "Categoria Panini",
    description: "Coleções, livros ilustrados e linhas editoriais da Panini já publicadas no marketplace.",
  },
  {
    href: "/categorias/figurinhas",
    title: "Figurinhas",
    description: "Recorte para pacotes, cromos e buscas ligadas ao hábito de completar coleções.",
  },
  {
    href: "/categorias/albuns-de-figurinhas",
    title: "Álbuns de Figurinhas",
    description: "Entrada transacional para o usuário que procura o álbum e produtos centrais da coleção.",
  },
  {
    href: "/categorias/cards",
    title: "Cards",
    description: "Cobertura complementar para colecionáveis esportivos, sets e produtos próximos da intenção da Copa.",
  },
  {
    href: "/bancas-perto-de-mim",
    title: "Bancas perto de mim",
    description: "Entrada local para busca por bancas, distância, disponibilidade e contato direto.",
  },
];

export const WORLD_CUP_SUBHUBS: WorldCupHubLink[] = [
  {
    href: "/copa-2026/album-da-copa-2026",
    title: "Álbum da Copa 2026",
    description: "Página-mãe para intenção focada no álbum, formato, edição e jornada de compra.",
  },
  {
    href: "/copa-2026/figurinhas-da-copa-2026",
    title: "Figurinhas da Copa 2026",
    description: "Cluster para busca por pacotes, figurinhas avulsas, kits e disponibilidade nas bancas.",
  },
  {
    href: "/copa-2026/onde-comprar",
    title: "Onde comprar",
    description: "Entrada transacional com links por cidade, categorias relacionadas e bancas públicas.",
  },
  {
    href: "/copa-2026/precos",
    title: "Preços",
    description: "Página para intenção de comparação de valor, orçamento e monitoramento de oferta.",
  },
  {
    href: "/copa-2026/como-completar-album",
    title: "Como completar o álbum",
    description: "Conteúdo utilitário para recorrência, trocas e recompra de faltantes.",
  },
  {
    href: "/copa-2026/figurinhas-raras",
    title: "Figurinhas raras",
    description: "Página para capturar buscas por especiais, douradas, lendárias e cards valorizados.",
  },
  {
    href: "/copa-2026/troca-de-figurinhas",
    title: "Troca de figurinhas",
    description: "Hub para intenção comunitária, encontros presenciais e jornadas para reduzir repetidas.",
  },
];

export const WORLD_CUP_CITY_PAGES: WorldCupCityPage[] = [
  {
    slug: "sao-paulo-sp",
    city: "São Paulo",
    state: "SP",
    label: "São Paulo, SP",
    aliases: ["sao paulo", "são paulo"],
  },
  {
    slug: "rio-de-janeiro-rj",
    city: "Rio de Janeiro",
    state: "RJ",
    label: "Rio de Janeiro, RJ",
    aliases: ["rio de janeiro"],
  },
  {
    slug: "belo-horizonte-mg",
    city: "Belo Horizonte",
    state: "MG",
    label: "Belo Horizonte, MG",
    aliases: ["belo horizonte"],
  },
  {
    slug: "curitiba-pr",
    city: "Curitiba",
    state: "PR",
    label: "Curitiba, PR",
    aliases: ["curitiba"],
  },
  {
    slug: "porto-alegre-rs",
    city: "Porto Alegre",
    state: "RS",
    label: "Porto Alegre, RS",
    aliases: ["porto alegre"],
  },
  {
    slug: "brasilia-df",
    city: "Brasília",
    state: "DF",
    label: "Brasília, DF",
    aliases: ["brasilia", "brasília"],
  },
];

function normalizeText(value: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifySegment(value: string) {
  return normalizeText(value).replace(/\s+/g, "-");
}

function dedupeLinks(links: WorldCupHubLink[]) {
  const seen = new Set<string>();
  return links.filter((item) => {
    const key = item.href.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeCategoryHref(link?: string | null, name?: string | null) {
  const raw = String(link || "").trim();
  const fallback = `/categorias/${slugifySegment(String(name || "categoria"))}`;

  if (!raw) return fallback;

  const trimmed = raw.startsWith("http") ? new URL(raw).pathname : raw;
  return trimmed
    .replace(/^\/categoria\//, "/categorias/")
    .replace(/\s+/g, "-");
}

function describeWorldCupCategory(name: string) {
  const normalized = normalizeText(name);
  if (normalized.includes("album")) {
    return "Página comercial para intenção de compra do álbum e das linhas principais de cromos.";
  }
  if (normalized.includes("figur")) {
    return "Camada transacional para busca por figurinhas, cromos e reposição de pacotes.";
  }
  if (normalized.includes("card")) {
    return "Cobertura complementar para cards e colecionáveis ligados ao universo esportivo.";
  }
  if (normalized.includes("adesiv")) {
    return "Categoria útil para capturar buscas por itens de torcida e colecionáveis ligados ao futebol.";
  }
  return "Categoria real do marketplace ligada ao universo de colecionáveis e compra recorrente.";
}

function countMatches(haystack: string, terms: string[]) {
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
}

function scoreWorldCupProduct(product: ProductRow, categoryName: string) {
  const haystack = normalizeText(`${product.name} ${product.description || ""} ${categoryName}`);
  const sportsScore = countMatches(haystack, WORLD_CUP_PRODUCT_SPORT_TERMS);
  if (sportsScore === 0) return 0;

  const collectibleScore = countMatches(haystack, WORLD_CUP_PRODUCT_COLLECTIBLE_TERMS);
  const categoryBoost = countMatches(normalizeText(categoryName), WORLD_CUP_CATEGORY_TERMS);
  const imageBoost = Array.isArray(product.images) && product.images.length > 0 ? 1 : 0;
  return sportsScore * 4 + collectibleScore * 2 + categoryBoost + imageBoost;
}

function buildWorldCupProductContext(product: ProductRow, categoryName: string, bancaName?: string | null) {
  if (bancaName) return `${categoryName || "Colecionável"} em ${bancaName}`;
  if (categoryName) return `Categoria ${categoryName}`;
  if (product.distribuidor_id) return "Disponível no catálogo parceiro";
  return "Oferta publicada no marketplace";
}

function buildWorldCupProductOrClause() {
  return WORLD_CUP_PRODUCT_OR_TERMS.map((term) => `name.ilike.%${term}%`).concat(
    WORLD_CUP_PRODUCT_OR_TERMS.map((term) => `description.ilike.%${term}%`)
  ).join(",");
}

export function buildAbsoluteSiteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function buildWorldCupMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = buildAbsoluteSiteUrl(path);
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Guia das Bancas",
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getWorldCupCityBySlug(slug: string) {
  return WORLD_CUP_CITY_PAGES.find((city) => city.slug === slug) || null;
}

async function readPublicBancas(limit = 200): Promise<Array<{ id: string; name: string; address: string }>> {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("id,name,address,active")
    .eq("active", true)
    .order("name")
    .limit(limit);

  if (error || !Array.isArray(data)) return [];

  return data.map((item: any) => ({
    id: String(item.id),
    name: String(item.name || "Banca"),
    address: String(item.address || ""),
  }));
}

function toWorldCupBancaLink(
  banca: { id: string; name: string; address: string },
  forcedState?: string
): WorldCupBancaLink {
  const href = buildBancaHref(banca.name, banca.id, forcedState || getUf(banca.address));
  return {
    id: banca.id,
    name: banca.name,
    address: banca.address,
    href,
  };
}

export async function getFeaturedWorldCupBancas(limit = 6): Promise<WorldCupBancaLink[]> {
  const bancas = await readPublicBancas(limit);
  return bancas.slice(0, limit).map((item) => toWorldCupBancaLink(item));
}

export async function getWorldCupCityBancas(citySlug: string, limit = 8): Promise<WorldCupBancaLink[]> {
  const city = getWorldCupCityBySlug(citySlug);
  if (!city) return [];

  const bancas = await readPublicBancas(300);
  const matched = bancas.filter((banca) => {
    const address = normalizeText(banca.address);
    if (!address) return false;
    const cityMatch = city.aliases.some((alias) => address.includes(normalizeText(alias)));
    if (!cityMatch) return false;
    return address.includes(normalizeText(city.state));
  });

  return matched.slice(0, limit).map((item) => toWorldCupBancaLink(item, city.state));
}

export async function getWorldCupCategoryLinks(limit = 6): Promise<WorldCupHubLink[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id,name,link,active")
    .eq("active", true)
    .or(
      WORLD_CUP_CATEGORY_TERMS.map((term) => `name.ilike.%${term}%`).join(",")
    )
    .limit(Math.max(limit * 2, 12));

  if (error || !Array.isArray(data)) {
    return WORLD_CUP_FALLBACK_CATEGORY_LINKS.slice(0, limit);
  }

  const links = (data as CategoryRow[]).map((category) => ({
    href: normalizeCategoryHref(category.link, category.name),
    title: category.name,
    description: describeWorldCupCategory(category.name),
  }));

  return dedupeLinks([...links, ...WORLD_CUP_FALLBACK_CATEGORY_LINKS]).slice(0, limit);
}

export async function getWorldCupRelevantProducts(limit = 6): Promise<WorldCupProductLink[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("id,name,description,images,price,codigo_mercos,category_id,banca_id,distribuidor_id")
    .eq("active", true)
    .or(buildWorldCupProductOrClause())
    .limit(Math.max(limit * 10, 40));

  if (error || !Array.isArray(data) || data.length === 0) return [];

  const products = data as ProductRow[];
  const categoryIds = Array.from(new Set(products.map((item) => item.category_id).filter(Boolean)));
  const bancaIds = Array.from(new Set(products.map((item) => item.banca_id).filter(Boolean)));

  const [categoriesRes, bancas] = await Promise.all([
    categoryIds.length
      ? supabaseAdmin.from("categories").select("id,name,link").in("id", categoryIds)
      : Promise.resolve({ data: [] }),
    bancaIds.length ? readPublicBancas(400) : Promise.resolve([]),
  ]);

  const categoryMap = new Map(
    Array.isArray(categoriesRes.data)
      ? (categoriesRes.data as CategoryRow[]).map((category) => [category.id, category])
      : []
  );
  const bancaMap = new Map(bancas.map((banca) => [banca.id, banca]));

  return products
    .map((product) => {
      const category = product.category_id ? categoryMap.get(product.category_id) : null;
      const categoryName = String(category?.name || "");
      const score = scoreWorldCupProduct(product, categoryName);
      if (score <= 0) return null;

      const banca = product.banca_id ? bancaMap.get(product.banca_id) : null;
      const identifier = String(product.codigo_mercos || product.id);

      return {
        score,
        item: {
          id: product.id,
          name: product.name,
          href: `/produto/${identifier}`,
          image: product.images?.[0] || null,
          price: typeof product.price === "number" ? product.price : null,
          context: buildWorldCupProductContext(product, categoryName, banca?.name || null),
        } satisfies WorldCupProductLink,
      };
    })
    .filter((entry): entry is { score: number; item: WorldCupProductLink } => Boolean(entry))
    .sort((left, right) => right.score - left.score || left.item.name.localeCompare(right.item.name, "pt-BR"))
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function buildWorldCupProductsItemListSchema(name: string, products: WorldCupProductLink[]) {
  if (products.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: buildAbsoluteSiteUrl(product.href),
      name: product.name,
    })),
  };
}
