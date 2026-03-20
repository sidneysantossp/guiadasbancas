import { syncDistribuidorProductCustomPriceMarkup } from "@/lib/modules/distribuidor/markup";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";
import { supabaseAdmin } from "@/lib/supabase";
import { validateProductCreate } from "@/lib/validators/product";

type DistribuidorProductsQueryParams = {
  distribuidorId: string;
  page: number;
  limit: number;
  sort: string;
  status: "all" | "active" | "inactive";
  search: string;
  category: string;
  productId?: string | null;
};

function buildSearchVariants(search: string) {
  const variants = new Set<string>();
  const normalized = search.trim();
  if (!normalized) return [];

  variants.add(normalized);

  const withoutAccents = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  variants.add(withoutAccents);

  const vowels = ["a", "e", "i", "o", "u"];
  const acuteMap: Record<string, string> = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };

  for (const vowel of vowels) {
    const index = withoutAccents.toLowerCase().indexOf(vowel);
    if (index !== -1) {
      const withAccent =
        withoutAccents.substring(0, index) + acuteMap[vowel] + withoutAccents.substring(index + 1);
      variants.add(withAccent);
      break;
    }
  }

  return [...variants].filter((variant) => variant.length >= 2).slice(0, 3);
}

async function loadDistribuidorCategoryNameMap(distribuidorId: string) {
  const [{ data: distribuidorCategories }, { data: globalCategories }] = await Promise.all([
    supabaseAdmin.from("distribuidor_categories").select("id, nome").eq("distribuidor_id", distribuidorId),
    supabaseAdmin.from("categories").select("id, name"),
  ]);

  const categoryNameMap = new Map<string, string>();
  for (const category of distribuidorCategories || []) {
    categoryNameMap.set(category.id, category.nome);
  }
  for (const category of globalCategories || []) {
    categoryNameMap.set(category.id, category.name);
  }

  return categoryNameMap;
}

function applyDistribuidorProductsFilters(query: any, params: DistribuidorProductsQueryParams) {
  query = query.eq("distribuidor_id", params.distribuidorId);

  if (params.productId) {
    query = query.eq("id", params.productId);
  }

  if (params.status === "active") {
    query = query.eq("active", true);
  } else if (params.status === "inactive") {
    query = query.eq("active", false);
  }

  if (params.category) {
    query = query.eq("category_id", params.category);
  }

  if (params.search) {
    const conditions = buildSearchVariants(params.search)
      .map((term) => `name.ilike.%${term}%,codigo_mercos.ilike.%${term}%`)
      .join(",");

    const fallbackSearch = params.search.trim();
    query = query.or(
      conditions || `name.ilike.%${fallbackSearch}%,codigo_mercos.ilike.%${fallbackSearch}%`
    );
  }

  return query;
}

async function loadDistribuidorProductsRaw(params: DistribuidorProductsQueryParams) {
  let query = supabaseAdmin.from("products").select("*", { count: "exact" });
  query = applyDistribuidorProductsFilters(query, params);

  if (params.productId) {
    query = query.limit(1);
  }

  if (params.sort === "vendas") {
    query = query.order("created_at", { ascending: false });
  } else if (params.sort === "price") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "stock") {
    query = query.order("stock_qty", { ascending: false });
  } else if (params.sort === "recent") {
    query = query.order("sincronizado_em", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  if (!params.productId) {
    const from = Math.max(0, (params.page - 1) * params.limit);
    const to = from + params.limit - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  return {
    products: data || [],
    filteredTotal: Number(count || 0),
  };
}

export async function getDistribuidorProductsOverview(params: DistribuidorProductsQueryParams) {
  const [{ products, filteredTotal }, categoryNameMap, { count: totalCatalog }, { count: totalActive }] = await Promise.all([
    loadDistribuidorProductsRaw(params),
    loadDistribuidorCategoryNameMap(params.distribuidorId),
    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("distribuidor_id", params.distribuidorId),
    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("distribuidor_id", params.distribuidorId)
      .eq("active", true),
  ]);

  const [{ calculateDistributorPrice }, { data: markupProdutos }] = await Promise.all([
    loadDistributorPricingContext({
      products: products as any[],
      customFields: null,
    }),
    products.length
      ? supabaseAdmin
          .from("distribuidor_markup_produtos")
          .select("product_id")
          .eq("distribuidor_id", params.distribuidorId)
          .in(
            "product_id",
            products.map((product: any) => product.id)
          )
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const productMarkupIds = new Set(
    (markupProdutos || []).map((markupProduto: any) => markupProduto.product_id)
  );

  let data = products.map((product: any) => {
    const imageUrl =
      product.images && Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : null;
    const price = product.price || 0;
    const categoryName = product.category_id
      ? categoryNameMap.get(product.category_id) || "Sem Categoria"
      : "Sem Categoria";

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price,
      base_price: price,
      distribuidor_price: calculateDistributorPrice(product),
      has_product_markup: productMarkupIds.has(product.id),
      custom_price: product.custom_price ?? null,
      custom_description: product.custom_description ?? "",
      custom_status: product.custom_status || "disponivel",
      custom_pronta_entrega: product.custom_pronta_entrega ?? product.pronta_entrega ?? false,
      custom_sob_encomenda: product.custom_sob_encomenda ?? product.sob_encomenda ?? false,
      custom_pre_venda: product.custom_pre_venda ?? product.pre_venda ?? false,
      custom_stock_enabled: product.custom_stock_enabled ?? false,
      custom_stock_qty: product.custom_stock_qty ?? null,
      custom_featured: product.custom_featured ?? false,
      image_url: imageUrl,
      images: product.images || [],
      category: categoryName,
      category_id: product.category_id,
      active: product.active ?? true,
      stock_qty: product.stock_qty || 0,
      track_stock: product.track_stock ?? true,
      mercos_id: product.mercos_id,
      codigo_mercos: product.codigo_mercos,
      origem: product.origem,
      pronta_entrega: product.pronta_entrega ?? false,
      sob_encomenda: product.sob_encomenda ?? false,
      pre_venda: product.pre_venda ?? false,
      sincronizado_em: product.sincronizado_em,
      created_at: product.created_at,
    };
  });

  return {
    data,
    total: filteredTotal,
    distribuidor_id: params.distribuidorId,
    product: params.productId ? data[0] || null : null,
    summary: {
      total: Number(totalCatalog || 0),
      active: Number(totalActive || 0),
      inactive: Math.max(Number(totalCatalog || 0) - Number(totalActive || 0), 0),
    },
  };
}

export async function createDistribuidorProduct(params: {
  distribuidorId: string;
  body: any;
}) {
  const normalizedImages = Array.isArray(params.body.images)
    ? params.body.images.map((image: unknown) => String(image).trim()).filter(Boolean)
    : [];

  const parsedPrice = Number(params.body.price);
  const parsedStock = Number(params.body.stock_qty ?? params.body.stockQty ?? 0);

  const payload = {
    name: String(params.body.name || "").trim(),
    description: String(params.body.description || "").trim(),
    category_id: params.body.category_id ? String(params.body.category_id).trim() : null,
    price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    stock_qty: Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : 0,
    track_stock: params.body.track_stock !== false,
    sob_encomenda: Boolean(params.body.sob_encomenda),
    pre_venda: Boolean(params.body.pre_venda),
    pronta_entrega: Boolean(params.body.pronta_entrega),
    images: normalizedImages,
    active: params.body.active !== false,
    codigo_mercos: params.body.codigo_mercos
      ? String(params.body.codigo_mercos).trim().toUpperCase()
      : undefined,
  };

  const validation = validateProductCreate(payload as any);
  if (!validation.ok) {
    return { ok: false as const, error: validation.error, status: 400 };
  }

  const finalPayload: Record<string, any> = {
    name: payload.name,
    description: payload.description || "",
    price: payload.price,
    stock_qty: payload.stock_qty,
    track_stock: payload.track_stock,
    sob_encomenda: payload.sob_encomenda,
    pre_venda: payload.pre_venda,
    pronta_entrega: payload.pronta_entrega,
    images: normalizedImages,
    active: payload.track_stock && payload.stock_qty <= 0 ? false : payload.active,
    category_id: payload.category_id,
    distribuidor_id: params.distribuidorId,
    origem: "manual",
    sincronizado_em: new Date().toISOString(),
    codigo_mercos: payload.codigo_mercos || null,
    banca_id: null,
  };

  const { data, error } = await supabaseAdmin.from("products").insert(finalPayload).select("*").single();
  if (error) {
    throw error;
  }

  return { ok: true as const, data };
}

export async function updateDistribuidorProduct(params: {
  productId: string;
  distribuidorId: string;
  updates: Record<string, any>;
}) {
  const { data: product, error: checkError } = await supabaseAdmin
    .from("products")
    .select("id")
    .eq("id", params.productId)
    .eq("distribuidor_id", params.distribuidorId)
    .single();

  if (checkError || !product) {
    return {
      ok: false as const,
      error: "Produto não encontrado ou não pertence a este distribuidor",
      status: 403,
    };
  }

  const hasCustomPriceKey =
    !!params.updates && Object.prototype.hasOwnProperty.call(params.updates, "custom_price");
  const customPrice = params.updates?.custom_price;

  const updatesForProduct: Record<string, any> = { ...(params.updates || {}) };
  delete updatesForProduct.custom_price;

  if (
    Object.prototype.hasOwnProperty.call(updatesForProduct, "stock_qty") &&
    Number(updatesForProduct.stock_qty) === 0
  ) {
    updatesForProduct.active = false;
  }

  let updatedProductRow: any = null;
  if (Object.keys(updatesForProduct).length > 0) {
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("products")
      .update(updatesForProduct)
      .eq("id", params.productId)
      .eq("distribuidor_id", params.distribuidorId)
      .select("*")
      .single();

    if (updateError) {
      throw updateError;
    }

    updatedProductRow = updated;
  }

  if (hasCustomPriceKey) {
    await syncDistribuidorProductCustomPriceMarkup({
      distribuidorId: params.distribuidorId,
      productId: params.productId,
      customPrice: typeof customPrice === "number" ? customPrice : null,
    });
  }

  return {
    ok: true as const,
    data: {
      productId: params.productId,
      distribuidorId: params.distribuidorId,
      updated: updatedProductRow,
      markup_updated: hasCustomPriceKey && typeof customPrice === "number",
    },
  };
}
