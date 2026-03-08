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

const fetchAllCategories = async (): Promise<PublicCategory[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories?all=true`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("failed");
    const j = await res.json();
    return normalizeCategories(j?.data || []);
  } catch {
    return [];
  }
};

export async function getPublicCategories(): Promise<PublicCategory[]> {
  return fetchPublicCategories();
}

export async function getAllCategories(): Promise<PublicCategory[]> {
  return fetchAllCategories();
}

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
