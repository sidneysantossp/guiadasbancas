import "server-only";

import { unstable_cache } from "next/cache";
import { categories as fallbackCategories } from "@/components/categoriesData";
import { CACHE_TTL } from "@/lib/data/cache";

export type PublicCategory = {
  id: string;
  name: string;
  image?: string;
  link?: string;
  order?: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";

function normalizeCategories(list: any[]): PublicCategory[] {
  return (Array.isArray(list) ? list : [])
    .map((cat: any, index: number) => {
      const id = cat?.id ?? cat?.slug ?? null;
      if (!id) return null;
      return {
        id: String(id),
        name: cat?.name || "Categoria",
        image: cat?.image || "",
        link: cat?.link || "",
        order: typeof cat?.order === "number" ? cat.order : index,
      } as PublicCategory;
    })
    .filter(Boolean) as PublicCategory[];
}

function fallbackPublicCategories(): PublicCategory[] {
  return fallbackCategories.map((cat, index) => ({
    id: cat.slug,
    name: cat.name,
    image: cat.image || "",
    link: `/categorias/${cat.slug}`,
    order: index,
  }));
}

const fetchPublicCategories = async (): Promise<PublicCategory[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      next: { revalidate: CACHE_TTL.categories },
    });
    if (!res.ok) throw new Error("failed");
    const j = await res.json();
    const list = normalizeCategories(j?.data || []);
    return list.length > 0 ? list : fallbackPublicCategories();
  } catch {
    return fallbackPublicCategories();
  }
};

const fetchAllCategories = async (): Promise<PublicCategory[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories?all=true`, {
      next: { revalidate: CACHE_TTL.categories },
    });
    if (!res.ok) throw new Error("failed");
    const j = await res.json();
    return normalizeCategories(j?.data || []);
  } catch {
    return [];
  }
};

export const getPublicCategories = unstable_cache(
  fetchPublicCategories,
  ["public-categories"],
  { revalidate: CACHE_TTL.categories }
);

export const getAllCategories = unstable_cache(
  fetchAllCategories,
  ["all-categories"],
  { revalidate: CACHE_TTL.categories }
);

export async function getMergedCategories(): Promise<PublicCategory[]> {
  const [publicCats, allCats] = await Promise.all([
    getPublicCategories(),
    getAllCategories(),
  ]);
  const map = new Map<string, PublicCategory>();
  for (const cat of publicCats) {
    if (cat?.id) map.set(cat.id, cat);
  }
  for (const cat of allCats) {
    if (!cat?.id) continue;
    const prev = map.get(cat.id);
    map.set(cat.id, { ...prev, ...cat });
  }
  return Array.from(map.values());
}
