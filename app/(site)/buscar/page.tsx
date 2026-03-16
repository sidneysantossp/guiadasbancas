import BuscarPageClient from "@/components/BuscarPageClient";
import type { Metadata } from "next";
import type { UICategory } from "@/lib/useCategories";
import { getPublicCategories } from "@/lib/data/categories";
import { getPublicBancas } from "@/lib/data/bancas";
import { getSearchProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Buscar produtos | Guia das Bancas",
  description: "Use a busca para encontrar produtos, bancas e categorias no Guia das Bancas.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.guiadasbancas.com.br/buscar",
  },
};

type SearchParams = {
  q?: string;
};

function mapCategories(items: Array<{ id?: string; name?: string; image?: string; link?: string }>): UICategory[] {
  return items
    .filter((item) => item && (item.id || item.name))
    .map((item, index) => ({
      key: String(item.id || item.name || index),
      name: item.name || "Categoria",
      image: item.image || "",
      link: item.link || "",
    }));
}

async function fetchCategories(): Promise<UICategory[]> {
  const data = await getPublicCategories();
  return mapCategories(data);
}

async function fetchBancas(): Promise<any[]> {
  return getPublicBancas();
}

async function fetchProducts(query: string): Promise<any[]> {
  return getSearchProducts(query, 96);
}

export default async function BuscarPage({ searchParams }: { searchParams: SearchParams }) {
  const query = (searchParams?.q || "").trim();
  const [initialCategories, initialBancas, initialProducts] = await Promise.all([
    fetchCategories(),
    fetchBancas(),
    fetchProducts(query),
  ]);

  return (
    <BuscarPageClient
      initialBancas={initialBancas}
      initialProducts={initialProducts}
      initialCategories={initialCategories}
      initialQuery={query}
    />
  );
}
