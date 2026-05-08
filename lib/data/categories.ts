import "server-only";

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

const fetchPublicCategories = async (): Promise<PublicCategory[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("failed");
    const j = await res.json();
    const list = normalizeCategories(j?.data || []);
    return list;
  } catch {
    return [];
  }
};

export async function getPublicCategories(): Promise<PublicCategory[]> {
  return fetchPublicCategories();
}

export async function getAllCategories(): Promise<PublicCategory[]> {
  return fetchPublicCategories();
}

export async function getMergedCategories(): Promise<PublicCategory[]> {
  return fetchPublicCategories();
}
