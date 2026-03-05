import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizePublicImageUrl } from "@/lib/sanitizePublicImageUrl";
import { categories as fallbackCategories } from "@/components/categoriesData";

export const revalidate = 300;

export type PublicCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
  parent_category_id?: string | null;
  mercos_id?: number | null;
};

type TreeSubcategory = {
  id: string;
  name: string;
  slug: string;
  link: string;
};

type TreeCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  link: string;
  order: number;
  subcategories: TreeSubcategory[];
};

type DistribuidorCategoryRow = {
  id: string;
  distribuidor_id: string;
  nome: string;
  mercos_id: number | null;
  categoria_pai_id: number | null;
};

const BRANCALEONE_DISTRIBUIDOR_ID = "1511df09-1f4a-4e68-9f8c-05cd06be6269";
const BAMBINO_DISTRIBUIDOR_ID = "3a989c56-bbd3-4769-b076-a83483e39542";
const FOCUSED_MEGA_MENU_ROOTS: ReadonlyArray<{ distribuidorId: string; name: string }> = [
  { distribuidorId: BRANCALEONE_DISTRIBUIDOR_ID, name: "Panini" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Bebidas" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Bomboniere" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Brinquedos" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Eletronicos" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Informática" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Papelaria" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Tabacaria" },
  { distribuidorId: BAMBINO_DISTRIBUIDOR_ID, name: "Telefonia" },
] as const;
const ALWAYS_INCLUDE_ROOTS = new Set<string>(["bebidas"]);

const ICON_RULES: Array<{ pattern: RegExp; icon: string }> = [
  { pattern: /(bebida|energet|suco|agua|refriger|cervej|vinho|cafe|cha)/i, icon: "🍺" },
  { pattern: /(tabac|cigar|charut|nargu|essenc|isqueir|palheiro|incenso|seda)/i, icon: "🚬" },
  { pattern: /(panini|figurinh|album|colecion|comics|manga|hq|marvel|dc|disney|conan)/i, icon: "⚽" },
  { pattern: /(revista|jornal)/i, icon: "📰" },
  { pattern: /(livro|book)/i, icon: "📚" },
  { pattern: /(snack|doce|chocol|bala|chiclete|bombon|salgad)/i, icon: "🍫" },
  { pattern: /(papelaria|caneta|caderno)/i, icon: "✏️" },
  { pattern: /(carta|card|jogo|pokemon|baralho)/i, icon: "🎮" },
  { pattern: /(brinquedo|pelucia|massinha|carrinho)/i, icon: "🧸" },
  { pattern: /(eletron|fone|caixa de som|informatic|pilha|celular|acessorio)/i, icon: "🔌" },
];

function slugify(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function resolveCategoryLink(name: string, link?: string | null): string {
  const expectedSlug = slugify(name) || "categoria";
  const pinnedRootSlugs = new Set(["colecionavel", "panini", "panini-collections"]);

  if (typeof link === "string") {
    const normalized = link.trim();
    if (normalized.startsWith("/categorias")) {
      const [pathname, query] = normalized.split("?");
      const segments = pathname.split("/").filter(Boolean);
      const currentSlug = segments[1] || "";

      if (!query && currentSlug && currentSlug !== expectedSlug && !pinnedRootSlugs.has(currentSlug)) {
        return `/categorias/${expectedSlug}`;
      }

      return normalized;
    }
    if (normalized.startsWith("/categoria/")) {
      return normalized.replace("/categoria/", "/categorias/");
    }
    if (normalized.startsWith("/")) return normalized;
  }
  return `/categorias/${expectedSlug}`;
}

function iconForCategory(name: string): string {
  for (const rule of ICON_RULES) {
    if (rule.pattern.test(name || "")) return rule.icon;
  }
  return "📦";
}

function sortByOrderThenName(a: { order?: number; name: string }, b: { order?: number; name: string }) {
  const orderA = typeof a.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
  const orderB = typeof b.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) return orderA - orderB;
  return (a.name || "").localeCompare(b.name || "", "pt-BR");
}

function buildFallbackPublicCategories(): PublicCategory[] {
  return fallbackCategories.map((cat, index) => ({
    id: cat.slug,
    name: cat.name,
    image: sanitizePublicImageUrl(cat.image),
    link: `/categorias/${cat.slug}`,
    order: index,
    parent_category_id: null,
    mercos_id: null,
  }));
}

function buildFallbackTree(fallbackData: PublicCategory[]): TreeCategory[] {
  return fallbackData.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: slugify(cat.name) || cat.id,
    icon: iconForCategory(cat.name),
    link: cat.link,
    order: cat.order,
    subcategories: [],
  }));
}

function inferParentByMercos(
  relations: Array<{ mercos_id: number | null; categoria_pai_id: number | null }>,
  availableMercosIds: Set<number>
): Map<number, number> {
  const votes = new Map<number, Map<number, number>>();

  for (const relation of relations) {
    const childMercosId = relation.mercos_id;
    const parentMercosId = relation.categoria_pai_id;
    if (childMercosId === null || parentMercosId === null) continue;
    if (!availableMercosIds.has(childMercosId) || !availableMercosIds.has(parentMercosId)) continue;
    if (childMercosId === parentMercosId) continue;

    if (!votes.has(childMercosId)) votes.set(childMercosId, new Map<number, number>());
    const childVotes = votes.get(childMercosId)!;
    childVotes.set(parentMercosId, (childVotes.get(parentMercosId) || 0) + 1);
  }

  const inferred = new Map<number, number>();
  for (const [childMercosId, parentVotes] of votes.entries()) {
    let selectedParent: number | null = null;
    let maxVotes = -1;

    for (const [parentMercosId, count] of parentVotes.entries()) {
      if (count > maxVotes) {
        maxVotes = count;
        selectedParent = parentMercosId;
      }
    }

    if (selectedParent !== null) inferred.set(childMercosId, selectedParent);
  }

  return inferred;
}

function buildTree(
  categories: PublicCategory[],
  inferredParentByMercos: Map<number, number>
): TreeCategory[] {
  const byId = new Map<string, PublicCategory>(categories.map((cat) => [cat.id, cat]));
  const byMercos = new Map<number, PublicCategory>();
  for (const category of categories) {
    if (typeof category.mercos_id === "number") {
      byMercos.set(category.mercos_id, category);
    }
  }

  const treeMap = new Map<string, TreeCategory>();
  for (const category of categories) {
    treeMap.set(category.id, {
      id: category.id,
      name: category.name,
      slug: slugify(category.name) || category.id,
      icon: iconForCategory(category.name),
      link: resolveCategoryLink(category.name, category.link),
      order: category.order,
      subcategories: [],
    });
  }

  const childrenByParentId = new Map<string, TreeCategory[]>();
  const roots: TreeCategory[] = [];

  for (const category of categories) {
    let parentCategoryId: string | null = null;

    if (category.parent_category_id && byId.has(category.parent_category_id)) {
      parentCategoryId = category.parent_category_id;
    } else if (typeof category.mercos_id === "number") {
      const inferredParentMercosId = inferredParentByMercos.get(category.mercos_id);
      if (typeof inferredParentMercosId === "number") {
        const parentCategory = byMercos.get(inferredParentMercosId);
        if (parentCategory && parentCategory.id !== category.id) {
          parentCategoryId = parentCategory.id;
        }
      }
    }

    const node = treeMap.get(category.id)!;

    if (parentCategoryId && parentCategoryId !== category.id) {
      if (!childrenByParentId.has(parentCategoryId)) childrenByParentId.set(parentCategoryId, []);
      childrenByParentId.get(parentCategoryId)!.push(node);
    } else {
      roots.push(node);
    }
  }

  const collectDescendants = (parentId: string, visited: Set<string>): TreeCategory[] => {
    const directChildren = [...(childrenByParentId.get(parentId) || [])].sort((a, b) =>
      sortByOrderThenName(a, b)
    );
    const collected: TreeCategory[] = [];

    for (const child of directChildren) {
      if (visited.has(child.id)) continue;
      visited.add(child.id);
      collected.push(child);
      collected.push(...collectDescendants(child.id, visited));
    }

    return collected;
  };

  for (const root of roots) {
    const descendants = collectDescendants(root.id, new Set<string>());
    root.subcategories = descendants.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      link: child.link,
    }));
  }

  roots.sort((a, b) => {
    const byChildren = b.subcategories.length - a.subcategories.length;
    if (byChildren !== 0) return byChildren;
    return sortByOrderThenName(a, b);
  });

  return roots;
}

function dedupeSubcategories(items: TreeSubcategory[]): TreeSubcategory[] {
  const map = new Map<string, TreeSubcategory>();
  for (const item of items) {
    const key = item.id || slugify(item.name);
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return Array.from(map.values());
}

function normalizeText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function buildFocusedMegaMenuTree(
  normalizedData: PublicCategory[]
): Promise<TreeCategory[] | null> {
  const distributores = Array.from(
    new Set(FOCUSED_MEGA_MENU_ROOTS.map((root) => root.distribuidorId))
  );

  const { data, error } = await supabaseAdmin
    .from("distribuidor_categories")
    .select("id, distribuidor_id, nome, mercos_id, categoria_pai_id")
    .in("distribuidor_id", distributores)
    .eq("ativo", true);

  if (error || !data || data.length === 0) return null;

  const rows = data as DistribuidorCategoryRow[];
  const rowsByDistribuidor = new Map<string, DistribuidorCategoryRow[]>();
  for (const row of rows) {
    if (!rowsByDistribuidor.has(row.distribuidor_id)) {
      rowsByDistribuidor.set(row.distribuidor_id, []);
    }
    rowsByDistribuidor.get(row.distribuidor_id)!.push(row);
  }

  const activeProductCategoryIds = new Set<string>();
  const pageSize = 1000;
  let from = 0;
  while (true) {
    const { data: productsChunk, error: productsError } = await supabaseAdmin
      .from("products")
      .select("category_id, distribuidor_id")
      .in("distribuidor_id", distributores)
      .eq("active", true)
      .not("category_id", "is", null)
      .range(from, from + pageSize - 1);

    if (productsError || !productsChunk || productsChunk.length === 0) break;
    for (const row of productsChunk) {
      if (typeof row.category_id === "string" && row.category_id) {
        activeProductCategoryIds.add(row.category_id);
      }
    }
    if (productsChunk.length < pageSize) break;
    from += pageSize;
  }

  type LinkRef = { link: string; score: number };
  const linkByNormalizedName = new Map<string, LinkRef>();
  for (const row of normalizedData) {
    const key = normalizeText(row.name);
    const score = typeof row.mercos_id === "number" ? 2 : 1;
    const existing = linkByNormalizedName.get(key);
    if (!existing || score >= existing.score) {
      linkByNormalizedName.set(key, {
        link: row.link,
        score,
      });
    }
  }

  const tree: TreeCategory[] = [];

  for (const [index, rootConfig] of FOCUSED_MEGA_MENU_ROOTS.entries()) {
    const distRows = rowsByDistribuidor.get(rootConfig.distribuidorId) || [];
    if (distRows.length === 0) continue;

    const byMercos = new Map<number, DistribuidorCategoryRow>();
    const rowByNormalizedName = new Map<string, DistribuidorCategoryRow>();
    for (const row of distRows) {
      if (typeof row.mercos_id === "number") byMercos.set(row.mercos_id, row);
      const key = normalizeText(row.nome);
      if (!rowByNormalizedName.has(key)) rowByNormalizedName.set(key, row);
    }

    const childrenByParent = new Map<number, DistribuidorCategoryRow[]>();
    for (const row of distRows) {
      if (typeof row.categoria_pai_id !== "number") continue;
      if (!byMercos.has(row.categoria_pai_id)) continue;
      if (!childrenByParent.has(row.categoria_pai_id)) {
        childrenByParent.set(row.categoria_pai_id, []);
      }
      childrenByParent.get(row.categoria_pai_id)!.push(row);
    }

    const rootRow = rowByNormalizedName.get(normalizeText(rootConfig.name));
    if (!rootRow || typeof rootRow.mercos_id !== "number") continue;

    const collectDescendantsWithRows = (
      parentMercosId: number,
      visited: Set<number>
    ): DistribuidorCategoryRow[] => {
      const children = [...(childrenByParent.get(parentMercosId) || [])].sort((a, b) => {
        const mercosA = typeof a.mercos_id === "number" ? a.mercos_id : Number.MAX_SAFE_INTEGER;
        const mercosB = typeof b.mercos_id === "number" ? b.mercos_id : Number.MAX_SAFE_INTEGER;
        if (mercosA !== mercosB) return mercosA - mercosB;
        return a.nome.localeCompare(b.nome, "pt-BR");
      });

      const out: DistribuidorCategoryRow[] = [];
      for (const child of children) {
        if (typeof child.mercos_id !== "number") continue;
        if (visited.has(child.mercos_id)) continue;
        visited.add(child.mercos_id);
        out.push(child);
        out.push(...collectDescendantsWithRows(child.mercos_id, visited));
      }
      return out;
    };

    const descendants = collectDescendantsWithRows(rootRow.mercos_id, new Set<number>());

    const shouldAlwaysIncludeRoot = ALWAYS_INCLUDE_ROOTS.has(normalizeText(rootConfig.name));

    const filteredSubs = descendants.filter((sub) => {
      const normalizedName = String(sub.nome || "").trim();
      if (!normalizedName) return false;
      if (/^\d+$/.test(normalizedName)) return false;
      if (shouldAlwaysIncludeRoot) return true;
      return activeProductCategoryIds.has(sub.id);
    });

    const rootHasProducts =
      shouldAlwaysIncludeRoot ||
      activeProductCategoryIds.has(rootRow.id) ||
      filteredSubs.length > 0;
    if (!rootHasProducts) continue;

    const rootLinkRef = linkByNormalizedName.get(normalizeText(rootConfig.name));
    const rootLink = rootLinkRef?.link || resolveCategoryLink(rootConfig.name);
    const subcategories = dedupeSubcategories(
      filteredSubs.map((sub, subIndex) => {
        const subSlug = slugify(sub.nome) || `sub-${subIndex}`;
        return {
          id: sub.id || `${rootRow.id}-sub-${subIndex}`,
          name: sub.nome,
          slug: subSlug,
          link: `${rootLink}?sub=${encodeURIComponent(subSlug)}`,
        };
      })
    );

    tree.push({
      id: rootRow.id || `menu-root-${index}-${slugify(rootConfig.name)}`,
      name: rootConfig.name,
      slug: slugify(rootConfig.name) || `root-${index}`,
      icon: iconForCategory(rootConfig.name),
      link: rootLink,
      order: index,
      subcategories,
    });
  }

  return tree.length > 0 ? tree : null;
}

function curateMegaMenuTree(tree: TreeCategory[]): TreeCategory[] {
  if (!Array.isArray(tree) || tree.length === 0) return tree;

  const prepared = tree
    .map((category, index) => ({
      ...category,
      order: typeof category.order === "number" ? category.order : index,
      subcategories: dedupeSubcategories(
        (category.subcategories || []).filter((sub) => {
          const normalized = (sub.name || "").trim();
          return normalized.length > 0 && !/^\d+$/.test(normalized);
        })
      ),
    }))
    .sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name, "pt-BR");
    });

  const bySlug = new Map(prepared.map((category) => [slugify(category.name), category]));
  const pinnedOrder = ["colecionavel", "panini", "panini-collections"];
  const hasPinnedSet = pinnedOrder.every((slug) => bySlug.has(slug));

  if (!hasPinnedSet) return prepared;

  return pinnedOrder.map((slug, index) => {
    const category = bySlug.get(slug)!;
    return {
      ...category,
      order: index,
    };
  });
}

export async function GET(_request: NextRequest) {
  const cacheHeaders = {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  };

  try {
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("id, name, image, link, order, visible, parent_category_id, mercos_id")
      .eq("active", true)
      .eq("visible", true)
      .order("order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      const fallbackData = buildFallbackPublicCategories();
      return NextResponse.json(
        { success: true, data: fallbackData, tree: buildFallbackTree(fallbackData), source: "fallback-error" },
        { headers: cacheHeaders }
      );
    }

    if (!data || data.length === 0) {
      const fallbackData = buildFallbackPublicCategories();
      return NextResponse.json(
        { success: true, data: fallbackData, tree: buildFallbackTree(fallbackData), source: "fallback-empty" },
        { headers: cacheHeaders }
      );
    }

    const normalizedData: PublicCategory[] = data.map((cat, index) => ({
      id: String(cat.id),
      name: cat.name || "Categoria",
      image: sanitizePublicImageUrl(cat.image),
      link: resolveCategoryLink(cat.name || "categoria", cat.link),
      order: typeof cat.order === "number" ? cat.order : index,
      parent_category_id: cat.parent_category_id || null,
      mercos_id: typeof cat.mercos_id === "number" ? cat.mercos_id : null,
    }));

    // Para o mega menu da home, priorizar categorias sincronizadas da Mercos
    // quando houver ao menos uma categoria com mercos_id.
    const menuCategories =
      normalizedData.some((cat) => typeof cat.mercos_id === "number")
        ? normalizedData.filter((cat) => typeof cat.mercos_id === "number")
        : normalizedData;

    const treeFromFocusedRoots = await buildFocusedMegaMenuTree(normalizedData);
    const tree =
      treeFromFocusedRoots && treeFromFocusedRoots.length > 0
        ? treeFromFocusedRoots
        : curateMegaMenuTree(buildTree(menuCategories, new Map<number, number>()));

    return NextResponse.json(
      {
        success: true,
        data: normalizedData,
        tree,
        source: "database",
      },
      { headers: cacheHeaders }
    );
  } catch {
    const fallbackData = buildFallbackPublicCategories();
    return NextResponse.json(
      { success: true, data: fallbackData, tree: buildFallbackTree(fallbackData), source: "fallback-exception" },
      { headers: cacheHeaders }
    );
  }
}
