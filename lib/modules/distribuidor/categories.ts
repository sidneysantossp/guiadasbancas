import { supabaseAdmin } from "@/lib/supabase";

type CategoryRow = {
  id: string;
  name: string;
  image: string | null;
  link: string | null;
  order: number | null;
  active: boolean | null;
  visible: boolean | null;
  mercos_id: number | null;
  ultima_sincronizacao: string | null;
};

type DistribuidorCategoryRow = {
  id: string;
  nome: string;
  mercos_id: number | null;
  ativo: boolean | null;
  updated_at: string | null;
};

async function getDistribuidorProductsLite(distribuidorId: string) {
  const batchSize = 1000;
  let allProducts: Array<{ category_id: string | null; active: boolean | null }> = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data: batch, error } = await supabaseAdmin
      .from("products")
      .select("category_id, active")
      .eq("distribuidor_id", distribuidorId)
      .range(offset, offset + batchSize - 1);

    if (error) {
      throw error;
    }

    if (batch && batch.length > 0) {
      allProducts = allProducts.concat(batch);
      offset += batchSize;
      hasMore = batch.length === batchSize;
    } else {
      hasMore = false;
    }
  }

  return allProducts;
}

export async function getDistribuidorCategoriesOverview(distribuidorId: string) {
  const [{ data: categories, error: catError }, { data: distributorCategories, error: distCatError }, products] =
    await Promise.all([
      supabaseAdmin
        .from("categories")
        .select("id, name, image, link, order, active, visible, mercos_id, ultima_sincronizacao")
        .order("name", { ascending: true }),
      supabaseAdmin
        .from("distribuidor_categories")
        .select("id, nome, mercos_id, ativo, updated_at")
        .eq("distribuidor_id", distribuidorId)
        .order("nome", { ascending: true }),
      getDistribuidorProductsLite(distribuidorId),
    ]);

  if (catError || distCatError) {
    throw catError || distCatError;
  }

  const countMap = new Map<string, { total: number; active: number }>();
  for (const product of products) {
    if (!product.category_id) continue;

    const current = countMap.get(product.category_id) || { total: 0, active: 0 };
    current.total++;
    if (product.active) current.active++;
    countMap.set(product.category_id, current);
  }

  const combinedCategories = new Map<string, any>();

  for (const category of (categories || []) as CategoryRow[]) {
    combinedCategories.set(category.id, {
      id: category.id,
      name: category.name,
      image: category.image || null,
      link: category.link || null,
      order: category.order || 0,
      active: category.active !== false,
      visible: category.visible !== false,
      mercos_id: category.mercos_id || null,
      ultima_sincronizacao: category.ultima_sincronizacao || null,
      source: "global",
    });
  }

  for (const category of (distributorCategories || []) as DistribuidorCategoryRow[]) {
    combinedCategories.set(category.id, {
      id: category.id,
      name: category.nome,
      image: null,
      link: null,
      order: 999,
      active: category.ativo !== false,
      visible: true,
      mercos_id: category.mercos_id || null,
      ultima_sincronizacao: category.updated_at || null,
      source: "mercos",
    });
  }

  for (const categoryId of countMap.keys()) {
    if (!combinedCategories.has(categoryId)) {
      combinedCategories.set(categoryId, {
        id: categoryId,
        name: "Categoria vinculada",
        image: null,
        link: null,
        order: 999,
        active: true,
        visible: true,
        mercos_id: null,
        ultima_sincronizacao: null,
        source: "unknown",
      });
    }
  }

  const data = Array.from(combinedCategories.values()).map((category: any) => {
    const counts = countMap.get(category.id) || { total: 0, active: 0 };

    return {
      ...category,
      product_count: counts.total,
      active_product_count: counts.active,
      inactive_product_count: counts.total - counts.active,
    };
  });

  data.sort((a: any, b: any) => b.product_count - a.product_count);

  return {
    data,
    stats: {
      total_categories: data.length,
      categories_with_products: data.filter((category: any) => category.product_count > 0).length,
      total_products: products.length,
      active_products: products.filter((product) => product.active).length,
    },
  };
}
