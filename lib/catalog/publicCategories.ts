import { sanitizePublicImageUrl } from "@/lib/sanitizePublicImageUrl";
import { categories as fallbackCategories } from "@/components/categoriesData";
import {
  FALLBACK_TOP_CATEGORY_MENU,
  normalizeCategoryText,
} from "@/lib/catalog/fallbackCategories";

export const BRANCALEONE_DISTRIBUIDOR_ID = "1511df09-1f4a-4e68-9f8c-05cd06be6269";
export const BAMBINO_DISTRIBUIDOR_ID = "3a989c56-bbd3-4769-b076-a83483e39542";

export type PublicRootCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

export type PublicRootCategorySource = {
  name: string;
  slug: string;
  distribuidorId: string;
  alwaysInclude?: boolean;
};

type RawCategoryLike = {
  id?: string | null;
  name?: string | null;
  image?: string | null;
  link?: string | null;
  order?: number | null;
};

const ROOT_DISTRIBUTOR_BY_SLUG: Record<string, string> = {
  panini: BRANCALEONE_DISTRIBUIDOR_ID,
  bebidas: BAMBINO_DISTRIBUIDOR_ID,
  bomboniere: BAMBINO_DISTRIBUIDOR_ID,
  brinquedos: BAMBINO_DISTRIBUIDOR_ID,
  eletronicos: BAMBINO_DISTRIBUIDOR_ID,
  informatica: BAMBINO_DISTRIBUIDOR_ID,
  papelaria: BAMBINO_DISTRIBUIDOR_ID,
  tabacaria: BAMBINO_DISTRIBUIDOR_ID,
  telefonia: BAMBINO_DISTRIBUIDOR_ID,
};

export const PUBLIC_ROOT_CATEGORY_SOURCES: PublicRootCategorySource[] = FALLBACK_TOP_CATEGORY_MENU.map(
  (category) => ({
    name: category.name,
    slug: category.slug,
    distribuidorId: ROOT_DISTRIBUTOR_BY_SLUG[category.slug],
    alwaysInclude: category.slug === "bebidas",
  })
);

function fallbackVisualByName(name: string) {
  const normalizedName = normalizeCategoryText(name);
  return fallbackCategories.find((category) => normalizeCategoryText(category.name) === normalizedName);
}

export function buildFallbackPublicRootCategories(): PublicRootCategory[] {
  return PUBLIC_ROOT_CATEGORY_SOURCES.map((category, index) => {
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
    const key = normalizeCategoryText(name);
    const current = bestByName.get(key);
    const score = (category?.image ? 2 : 0) + (category?.link ? 1 : 0);
    const currentScore = current ? ((current.image ? 2 : 0) + (current.link ? 1 : 0)) : -1;
    if (!current || score >= currentScore) {
      bestByName.set(key, category);
    }
  }

  return fallback.map((category, index) => {
    const matched = bestByName.get(normalizeCategoryText(category.name));
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
