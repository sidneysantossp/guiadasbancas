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

const SITE_URL = "https://www.guiadasbancas.com.br";

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

export function getWorldCupCategoryLinks(): WorldCupHubLink[] {
  return [
    {
      href: "/categorias/panini",
      title: "Categoria Panini",
      description: "Veja lançamentos, coleções e produtos ligados ao universo Panini já publicados no marketplace.",
    },
    {
      href: "/categorias/panini?sub=figurinhas",
      title: "Figurinhas",
      description: "Recorte transacional para pacotes, kits e produtos ligados à busca por figurinhas.",
    },
    {
      href: "/categorias/panini?sub=albuns",
      title: "Álbuns",
      description: "Páginas para intenção de compra do álbum e complementos do colecionador.",
    },
    {
      href: "/bancas-perto-de-mim",
      title: "Bancas perto de mim",
      description: "Entrada local para busca por bancas, distância, disponibilidade e contato direto.",
    },
  ];
}
