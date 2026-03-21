import { sanitizePublicImageUrl } from "@/lib/sanitizePublicImageUrl";
import { categories as fallbackCategories } from "@/components/categoriesData";
import { FALLBACK_TOP_CATEGORY_MENU } from "@/lib/catalog/fallbackCategories";

export type PublicRootCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

type RawCategoryLike = {
  id?: string | null;
  name?: string | null;
  image?: string | null;
  link?: string | null;
  order?: number | null;
};

function normalizeText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackVisualByName(name: string) {
  const normalizedName = normalizeText(name);
  return fallbackCategories.find((category) => normalizeText(category.name) === normalizedName);
}

export function buildFallbackPublicRootCategories(): PublicRootCategory[] {
  return FALLBACK_TOP_CATEGORY_MENU.map((category, index) => {
    const visual = fallbackVisualByName(category.name);
    return {
      id: category.slug,
      name: category.name,
      image: sanitizePublicImageUrl(visual?.image || ""),
      link: `/categorias/${category.slug}`,
      order: index,
    };
  });
}

export function curatePublicRootCategories(rawCategories: RawCategoryLike[]): PublicRootCategory[] {
  const fallback = buildFallbackPublicRootCategories();
  const bestByName = new Map<string, RawCategoryLike>();

  for (const category of rawCategories || []) {
    const name = String(category?.name || "").trim();
    if (!name) continue;
    const key = normalizeText(name);
    const current = bestByName.get(key);
    const score = (category?.image ? 2 : 0) + (category?.link ? 1 : 0);
    const currentScore = current ? ((current.image ? 2 : 0) + (current.link ? 1 : 0)) : -1;
    if (!current || score >= currentScore) {
      bestByName.set(key, category);
    }
  }

  return fallback.map((category, index) => {
    const matched = bestByName.get(normalizeText(category.name));
    if (!matched) {
      return category;
    }

    return {
      id: String(matched.id || category.id),
      name: String(matched.name || category.name),
      image: sanitizePublicImageUrl(matched.image || category.image),
      link: String(matched.link || category.link),
      order: typeof matched.order === "number" ? matched.order : index,
    };
  });
}
