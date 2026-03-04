import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
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

type FlatTreeNode = {
  id: string;
  name: string;
  slug: string;
  link: string;
  icon?: string;
  order?: number;
};

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
    image: cat.image || "",
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

function curateMegaMenuTree(tree: TreeCategory[]): TreeCategory[] {
  if (!Array.isArray(tree) || tree.length === 0) return tree;

  const nodesById = new Map<string, FlatTreeNode>();

  for (const root of tree) {
    nodesById.set(root.id, {
      id: root.id,
      name: root.name,
      slug: root.slug || slugify(root.name),
      link: root.link,
      icon: root.icon,
      order: root.order,
    });

    for (const sub of root.subcategories || []) {
      nodesById.set(sub.id, {
        id: sub.id,
        name: sub.name,
        slug: sub.slug || slugify(sub.name),
        link: sub.link,
      });
    }
  }

  const allNodes = Array.from(nodesById.values());
  const bySlug = new Map<string, FlatTreeNode>();
  for (const node of allNodes) {
    bySlug.set(slugify(node.name), node);
  }

  const colecionavel = bySlug.get("colecionavel");
  const panini = bySlug.get("panini");
  const paniniCollections = bySlug.get("panini-collections");

  // Se o conjunto principal não existir completo, mantém a árvore original.
  if (!colecionavel || !panini || !paniniCollections) {
    return tree;
  }

  const principalIds = new Set<string>([
    colecionavel.id,
    panini.id,
    paniniCollections.id,
  ]);

  const others = allNodes.filter((node) => !principalIds.has(node.id));

  const toSub = (node: FlatTreeNode): TreeSubcategory => ({
    id: node.id,
    name: node.name,
    slug: node.slug || slugify(node.name),
    link: node.link || resolveCategoryLink(node.name),
  });

  const paniniUniverseSlugs = new Set<string>([
    "panini-comics",
    "panini-books",
    "panini-magazines",
    "panini-partwork",
    "planet-manga",
    "marvel-comics",
    "dc-comics",
    "disney-comics",
    "mauricio-de-sousa-producoes",
  ]);

  const collectionsSlugs = new Set<string>([
    "colecionaveis",
    "conan",
    "independentes",
  ]);

  const classification = {
    colecionavel: [] as TreeSubcategory[],
    panini: [] as TreeSubcategory[],
    paniniCollections: [] as TreeSubcategory[],
  };

  for (const node of others) {
    const slug = slugify(node.name);
    const sub = toSub(node);

    if (collectionsSlugs.has(slug) || slug.includes("colecion")) {
      classification.paniniCollections.push(sub);
      continue;
    }

    if (slug.startsWith("panini-") || paniniUniverseSlugs.has(slug)) {
      classification.panini.push(sub);
      continue;
    }

    classification.colecionavel.push(sub);
  }

  const colecionavelSubs = dedupeSubcategories(classification.colecionavel).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
  const paniniSubs = dedupeSubcategories(classification.panini).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );
  const paniniCollectionsSubs = dedupeSubcategories(classification.paniniCollections).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );

  const buildRoot = (node: FlatTreeNode, order: number, subs: TreeSubcategory[]): TreeCategory => ({
    id: node.id,
    name: node.name,
    slug: node.slug || slugify(node.name),
    icon: node.icon || iconForCategory(node.name),
    link: node.link || resolveCategoryLink(node.name),
    order,
    subcategories: subs,
  });

  return [
    buildRoot(colecionavel, 0, colecionavelSubs),
    buildRoot(panini, 1, paniniSubs.length > 0 ? paniniSubs : colecionavelSubs),
    buildRoot(
      paniniCollections,
      2,
      paniniCollectionsSubs.length > 0 ? paniniCollectionsSubs : colecionavelSubs
    ),
  ];
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
      image: cat.image || "",
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

    const availableMercosIds = new Set<number>(
      menuCategories
        .map((cat) => cat.mercos_id)
        .filter((mercosId): mercosId is number => typeof mercosId === "number")
    );

    let inferredParentByMercos = new Map<number, number>();

    if (availableMercosIds.size > 0) {
      const { data: relationsData, error: relationError } = await supabaseAdmin
        .from("distribuidor_categories")
        .select("mercos_id, categoria_pai_id")
        .eq("ativo", true)
        .in("mercos_id", Array.from(availableMercosIds));

      if (!relationError && relationsData) {
        inferredParentByMercos = inferParentByMercos(
          relationsData as Array<{ mercos_id: number | null; categoria_pai_id: number | null }>,
          availableMercosIds
        );
      }
    }

    const tree = curateMegaMenuTree(buildTree(menuCategories, inferredParentByMercos));

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
