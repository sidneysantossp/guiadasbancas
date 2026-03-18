import { supabaseAdmin } from "@/lib/supabase";

export const DISTRIBUIDOR_PRODUCTS_CATEGORY_ID = "aaaaaaaa-0000-0000-0000-000000000001";
export const DEFAULT_PRODUCT_IMAGE =
  "https://cdn1.staticpanvel.com.br/produtos/15/produto-sem-imagem.jpg";

export interface ProductCatalogFilters {
  q?: string;
  category?: string;
  active?: boolean | null;
  featured?: boolean | null;
  limit?: number;
}

export interface DistributorCatalogResult<TItem = any> {
  items: TItem[];
  totalAvailable: number;
}

export interface AdminProductsPageParams {
  page: number;
  pageSize: number;
  q?: string;
  distribuidor?: string;
  category?: string;
  status?: string;
}

export interface DistributorProductCustomization {
  enabled?: boolean | null;
  custom_price?: number | null;
  custom_description?: string | null;
  custom_status?: string | null;
  custom_pronta_entrega?: boolean | null;
  custom_sob_encomenda?: boolean | null;
  custom_pre_venda?: boolean | null;
  custom_stock_enabled?: boolean | null;
  custom_stock_qty?: number | null;
  custom_featured?: boolean | null;
}

export interface DistributorProductCustomizationInput extends DistributorProductCustomization {}

const DISTRIBUTOR_PRODUCT_CUSTOMIZATION_SELECT =
  "id, banca_id, product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty, custom_featured, modificado_em";

function hasOwnValue(input: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(input, key);
}

export function buildDistributorProductCustomizationInput(
  input: Record<string, unknown>,
  options?: {
    defaultEnabled?: boolean;
    useProductEditorAliases?: boolean;
  }
): DistributorProductCustomizationInput {
  const customization: DistributorProductCustomizationInput = {};

  if (typeof options?.defaultEnabled === "boolean") {
    customization.enabled = options.defaultEnabled;
  }

  if (hasOwnValue(input, "enabled")) customization.enabled = input.enabled as boolean | null;
  if (hasOwnValue(input, "custom_price")) customization.custom_price = input.custom_price as number | null;
  if (hasOwnValue(input, "custom_description")) customization.custom_description = input.custom_description as string | null;
  if (hasOwnValue(input, "custom_status")) customization.custom_status = input.custom_status as string | null;
  if (hasOwnValue(input, "custom_pronta_entrega")) customization.custom_pronta_entrega = input.custom_pronta_entrega as boolean | null;
  if (hasOwnValue(input, "custom_sob_encomenda")) customization.custom_sob_encomenda = input.custom_sob_encomenda as boolean | null;
  if (hasOwnValue(input, "custom_pre_venda")) customization.custom_pre_venda = input.custom_pre_venda as boolean | null;
  if (hasOwnValue(input, "custom_stock_enabled")) customization.custom_stock_enabled = input.custom_stock_enabled as boolean | null;
  if (hasOwnValue(input, "custom_stock_qty")) customization.custom_stock_qty = input.custom_stock_qty as number | null;
  if (hasOwnValue(input, "custom_featured")) customization.custom_featured = input.custom_featured as boolean | null;

  if (options?.useProductEditorAliases) {
    if (hasOwnValue(input, "price")) customization.custom_price = input.price as number | null;
    if (hasOwnValue(input, "description")) customization.custom_description = input.description as string | null;
    if (hasOwnValue(input, "pronta_entrega")) customization.custom_pronta_entrega = input.pronta_entrega as boolean | null;
    if (hasOwnValue(input, "sob_encomenda")) customization.custom_sob_encomenda = input.sob_encomenda as boolean | null;
    if (hasOwnValue(input, "pre_venda")) customization.custom_pre_venda = input.pre_venda as boolean | null;
    if (hasOwnValue(input, "featured")) customization.custom_featured = input.featured as boolean | null;
  }

  return customization;
}

function readOptionalCount(result: unknown): number {
  if (!result || typeof result !== "object" || !("count" in result)) {
    return 0;
  }

  const count = Number((result as { count?: number | null }).count || 0);
  return Number.isFinite(count) ? count : 0;
}

function ensureProductImages(images: unknown, fallbackImageUrl?: string | null): string[] {
  if (Array.isArray(images) && images.length > 0) {
    return images.filter((image): image is string => typeof image === "string" && image.trim().length > 0);
  }

  if (fallbackImageUrl) {
    return [fallbackImageUrl];
  }

  return [];
}

function applyProductFilters<TQuery>(query: any, filters: ProductCatalogFilters): TQuery {
  const normalizedQuery = String(filters.q || "").trim().toLowerCase();
  const normalizedCategory = String(filters.category || "").trim();

  if (normalizedQuery) {
    query = query.or(`name.ilike.%${normalizedQuery}%,codigo_mercos.ilike.%${normalizedQuery}%`);
  }

  if (normalizedCategory) {
    query = query.eq("category_id", normalizedCategory);
  }

  if (typeof filters.active === "boolean") {
    query = query.eq("active", filters.active);
  }

  if (typeof filters.featured === "boolean") {
    query = query.eq("featured", filters.featured);
  }

  return query as TQuery;
}

function buildDistributorPricingContext(params: {
  distribuidores: any[];
  markupCategorias: any[];
  markupProdutos: any[];
}) {
  const distribuidoresMap = new Map((params.distribuidores || []).map((distribuidor) => [distribuidor.id, distribuidor]));
  const markupCategoriaMap = new Map(
    (params.markupCategorias || []).map((item) => [`${item.distribuidor_id}:${item.category_id}`, item])
  );
  const markupProdutoMap = new Map((params.markupProdutos || []).map((item) => [item.product_id, item]));

  function calculate(basePrice: number, product: { id: string; distribuidor_id?: string | null; category_id?: string | null }) {
    const distribuidorId = product.distribuidor_id || null;
    const categoryId = product.category_id || null;

    if (!distribuidorId) {
      return basePrice;
    }

    const markupProduto = markupProdutoMap.get(product.id);
    if (markupProduto) {
      const percentual = Number(markupProduto.markup_percentual || 0);
      const fixo = Number(markupProduto.markup_fixo || 0);
      if (percentual > 0 || fixo > 0) {
        return basePrice * (1 + percentual / 100) + fixo;
      }
    }

    const markupCategoria = markupCategoriaMap.get(`${distribuidorId}:${categoryId}`);
    if (markupCategoria) {
      const percentual = Number(markupCategoria.markup_percentual || 0);
      const fixo = Number(markupCategoria.markup_fixo || 0);
      if (percentual > 0 || fixo > 0) {
        return basePrice * (1 + percentual / 100) + fixo;
      }
    }

    const distribuidor = distribuidoresMap.get(distribuidorId);
    if (!distribuidor) {
      return basePrice;
    }

    const tipoCalculo = distribuidor.tipo_calculo || "markup";
    const margemDivisor = Number(distribuidor.margem_divisor || 1);
    if (tipoCalculo === "margem" && margemDivisor > 0 && margemDivisor < 1) {
      return basePrice / margemDivisor;
    }

    const percentual = Number(distribuidor.markup_global_percentual || 0);
    const fixo = Number(distribuidor.markup_global_fixo || 0);
    if (percentual > 0 || fixo > 0) {
      return basePrice * (1 + percentual / 100) + fixo;
    }

    return basePrice;
  }

  return { calculate };
}

export function createDistributorPricingResolver(params: {
  distribuidores: any[];
  markupCategorias: any[];
  markupProdutos: any[];
}) {
  const pricingContext = buildDistributorPricingContext(params);

  return (product: { id: string; price?: number | null; distribuidor_id?: string | null; category_id?: string | null }) => {
    const price = pricingContext.calculate(Number(product.price || 0), product);
    return Math.round(price * 100) / 100;
  };
}

export interface DistributorPricingContextResult<TCustomization = any> {
  customMap: Map<string, TCustomization>;
  distribuidorMap: Map<string, any>;
  calculateDistributorPrice: (product: {
    id: string;
    price?: number | null;
    distribuidor_id?: string | null;
    category_id?: string | null;
  }) => number;
}

export async function loadDistributorPricingContext<TCustomization extends { product_id?: string | null } = any>(params: {
  products: Array<{
    id: string;
    price?: number | null;
    distribuidor_id?: string | null;
    category_id?: string | null;
  }>;
  customFields?: string | null;
  customBancaId?: string | null;
  customBancaIds?: string[];
  includeAllBancaCustomizationsWhenLarge?: boolean;
  buildCustomizationKey?: (customization: TCustomization) => string;
}): Promise<DistributorPricingContextResult<TCustomization>> {
  const productRows = params.products || [];
  const distribuidorIds = Array.from(
    new Set(productRows.map((product) => product.distribuidor_id).filter(Boolean))
  );

  if (distribuidorIds.length === 0) {
    return {
      customMap: new Map<string, TCustomization>(),
      distribuidorMap: new Map<string, any>(),
      calculateDistributorPrice: createDistributorPricingResolver({
        distribuidores: [],
        markupCategorias: [],
        markupProdutos: [],
      }),
    };
  }

  const productIds = Array.from(new Set(productRows.map((product) => product.id).filter(Boolean)));
  const categoryIds = Array.from(
    new Set(productRows.map((product) => product.category_id).filter(Boolean))
  );
  const buildCustomizationKey =
    params.buildCustomizationKey ||
    ((customization: TCustomization) => String(customization.product_id || ""));

  const customQuery = (() => {
    const normalizedCustomFields = String(params.customFields || "").trim();
    if (!normalizedCustomFields) {
      return Promise.resolve({ data: [] as TCustomization[], error: null });
    }

    const bancaIds = Array.from(new Set((params.customBancaIds || []).filter(Boolean)));
    const bancaId = params.customBancaId || null;
    const shouldSkipProductFilter =
      params.includeAllBancaCustomizationsWhenLarge === true &&
      !!bancaId &&
      productIds.length > 500;

    let query = supabaseAdmin
      .from("banca_produtos_distribuidor")
      .select(normalizedCustomFields);

    if (bancaId) {
      query = query.eq("banca_id", bancaId);
    } else if (bancaIds.length > 0) {
      query = query.in("banca_id", bancaIds);
    } else {
      return Promise.resolve({ data: [] as TCustomization[], error: null });
    }

    if (!shouldSkipProductFilter && productIds.length > 0) {
      query = query.in("product_id", productIds);
    }

    return query;
  })();

  const [{ data: distribuidores, error: distribuidoresError }, { data: markupProdutos, error: markupProdutosError }, { data: markupCategorias, error: markupCategoriasError }, { data: customizations, error: customizationsError }] = await Promise.all([
    supabaseAdmin
      .from("distribuidores")
      .select("id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo")
      .in("id", distribuidorIds),
    productIds.length > 0
      ? supabaseAdmin
          .from("distribuidor_markup_produtos")
          .select("distribuidor_id, product_id, markup_percentual, markup_fixo")
          .in("distribuidor_id", distribuidorIds)
          .in("product_id", productIds)
      : Promise.resolve({ data: [] as any[], error: null }),
    categoryIds.length > 0
      ? supabaseAdmin
          .from("distribuidor_markup_categorias")
          .select("distribuidor_id, category_id, markup_percentual, markup_fixo")
          .in("distribuidor_id", distribuidorIds)
          .in("category_id", categoryIds)
      : Promise.resolve({ data: [] as any[], error: null }),
    customQuery,
  ]);

  if (distribuidoresError || markupProdutosError || markupCategoriasError || customizationsError) {
    throw new Error(
      distribuidoresError?.message ||
      markupProdutosError?.message ||
      markupCategoriasError?.message ||
      customizationsError?.message ||
      "Erro ao carregar contexto de pricing dos distribuidores"
    );
  }

  const customMap = new Map<string, TCustomization>();
  for (const customization of (customizations || []) as TCustomization[]) {
    const key = buildCustomizationKey(customization);
    if (key) {
      customMap.set(key, customization);
    }
  }

  const distribuidorMap = new Map<string, any>();
  for (const distribuidor of distribuidores || []) {
    distribuidorMap.set(distribuidor.id, distribuidor);
  }

  return {
    customMap,
    distribuidorMap,
    calculateDistributorPrice: createDistributorPricingResolver({
      distribuidores: distribuidores || [],
      markupCategorias: markupCategorias || [],
      markupProdutos: markupProdutos || [],
    }),
  };
}

export async function calculateDistributorProductMarkup(params: {
  productId: string;
  distribuidorId: string;
  categoryId?: string | null;
  basePrice: number;
}): Promise<number> {
  const [{ data: distribuidor }, { data: markupProduto }, { data: markupCategoria }] = await Promise.all([
    supabaseAdmin
      .from("distribuidores")
      .select("markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo")
      .eq("id", params.distribuidorId)
      .maybeSingle(),
    supabaseAdmin
      .from("distribuidor_markup_produtos")
      .select("markup_percentual, markup_fixo")
      .eq("distribuidor_id", params.distribuidorId)
      .eq("product_id", params.productId)
      .maybeSingle(),
    params.categoryId
      ? supabaseAdmin
          .from("distribuidor_markup_categorias")
          .select("markup_percentual, markup_fixo")
          .eq("distribuidor_id", params.distribuidorId)
          .eq("category_id", params.categoryId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const pricingContext = buildDistributorPricingContext({
    distribuidores: distribuidor ? [{ id: params.distribuidorId, ...distribuidor }] : [],
    markupCategorias: markupCategoria ? [{ ...markupCategoria, distribuidor_id: params.distribuidorId, category_id: params.categoryId }] : [],
    markupProdutos: markupProduto ? [{ ...markupProduto, distribuidor_id: params.distribuidorId, product_id: params.productId }] : [],
  });

  return pricingContext.calculate(Number(params.basePrice || 0), {
    id: params.productId,
    distribuidor_id: params.distribuidorId,
    category_id: params.categoryId || null,
  });
}

export async function loadDistributorProductCustomization(params: {
  bancaId: string;
  productId: string;
}): Promise<DistributorProductCustomization | null> {
  const { data, error } = await supabaseAdmin
    .from("banca_produtos_distribuidor")
    .select(DISTRIBUTOR_PRODUCT_CUSTOMIZATION_SELECT)
    .eq("banca_id", params.bancaId)
    .eq("product_id", params.productId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar customização do produto");
  }

  return (data as DistributorProductCustomization | null) || null;
}

export async function saveDistributorProductCustomization(params: {
  bancaId: string;
  productId: string;
  input: DistributorProductCustomizationInput;
}): Promise<DistributorProductCustomization | null> {
  const payload = Object.fromEntries(
    Object.entries(params.input || {}).filter(([, value]) => value !== undefined)
  ) as DistributorProductCustomizationInput;

  if (Object.keys(payload).length === 0) {
    return loadDistributorProductCustomization({
      bancaId: params.bancaId,
      productId: params.productId,
    });
  }

  const { data, error } = await supabaseAdmin
    .from("banca_produtos_distribuidor")
    .upsert(
      {
        banca_id: params.bancaId,
        product_id: params.productId,
        ...payload,
      },
      {
        onConflict: "banca_id,product_id",
      }
    )
    .select(DISTRIBUTOR_PRODUCT_CUSTOMIZATION_SELECT)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao salvar customização do produto");
  }

  return (data as DistributorProductCustomization | null) || null;
}

export function applyDistributorProductCustomization(params: {
  product: any;
  markupPrice: number;
  customization?: DistributorProductCustomization | null;
}) {
  const customization = params.customization || null;
  const baseProduct = params.product;
  const markupPrice = Number(params.markupPrice || 0);
  const basePrice = Number(baseProduct.price || 0);
  const finalPrice =
    customization?.custom_price != null ? Number(customization.custom_price) : markupPrice;
  const descriptionBase =
    typeof baseProduct.description === "string" ? baseProduct.description : "";
  const customDescription =
    typeof customization?.custom_description === "string" ? customization.custom_description : "";

  let computedDiscount = 0;
  if (markupPrice > finalPrice && markupPrice > 0) {
    computedDiscount = Math.round(((markupPrice - finalPrice) / markupPrice) * 100);
  }

  return {
    ...baseProduct,
    price: finalPrice,
    price_original: customization?.custom_price != null ? markupPrice : null,
    cost_price: basePrice,
    discount_percent: computedDiscount,
    description: customDescription ? `${descriptionBase}\n\n${customDescription}` : descriptionBase,
    pronta_entrega: customization?.custom_pronta_entrega ?? baseProduct.pronta_entrega,
    sob_encomenda: customization?.custom_sob_encomenda ?? baseProduct.sob_encomenda,
    pre_venda: customization?.custom_pre_venda ?? baseProduct.pre_venda,
    active: customization?.enabled !== false ? (baseProduct.active ?? true) : false,
    featured: customization?.custom_featured ?? baseProduct.featured,
  };
}

export async function listOwnedCatalogProducts(params: {
  bancaId?: string | null;
  filters: ProductCatalogFilters;
}): Promise<any[]> {
  let query = supabaseAdmin
    .from("products")
    .select(`
      *,
      bancas(name)
    `);

  if (params.bancaId) {
    query = query.eq("banca_id", params.bancaId);
  }

  query = applyProductFilters(query, params.filters);

  const limit = params.filters.limit;
  if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
    query = query.limit(Math.min(Math.floor(limit), 200));
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao buscar produtos da banca");
  }

  return (data || []) as any[];
}

export async function bancaHasLegacyDistributorCatalogAccess(bancaId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("is_cotista")
    .eq("id", bancaId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso da banca");
  }

  return data?.is_cotista === true;
}

export async function listDistributorCatalogForBanca(params: {
  bancaId: string;
  filters: ProductCatalogFilters;
  canAccessCatalog: boolean;
  includeTotalCount?: boolean;
  fallbackImageUrl?: string | null;
  distributorCategoryId?: string | null;
}): Promise<DistributorCatalogResult> {
  if (!params.canAccessCatalog) {
    return { items: [], totalAvailable: 0 };
  }

  const filters = params.filters;
  const includeTotalCount = params.includeTotalCount === true;
  const totalCountPromise = includeTotalCount
    ? applyProductFilters(
        supabaseAdmin
          .from("products")
          .select("id", { count: "exact", head: true })
          .not("distribuidor_id", "is", null),
        { ...filters, active: true, featured: null }
      )
    : null;

  let query = supabaseAdmin
    .from("products")
    .select(`
      *,
      bancas(name)
    `)
    .not("distribuidor_id", "is", null)
    .eq("active", true);

  query = applyProductFilters(query, { ...filters, active: true });

  const limit = filters.limit;
  if (typeof limit === "number" && Number.isFinite(limit) && limit > 0) {
    query = query.limit(Math.min(Math.floor(limit), 200));
  }

  const [{ data: products, error: productsError }, totalCountResult] = await Promise.all([
    query.order("created_at", { ascending: false }),
    totalCountPromise,
  ]);

  if (productsError) {
    throw new Error(productsError.message || "Erro ao buscar produtos de distribuidores");
  }

  const productRows = (products || []) as any[];
  if (productRows.length === 0) {
    return {
      items: [],
      totalAvailable: readOptionalCount(totalCountResult),
    };
  }

  const productIds = productRows.map((product) => product.id);
  const distribuidorIds = Array.from(
    new Set(productRows.map((product) => product.distribuidor_id).filter(Boolean))
  );
  const categoryIds = Array.from(new Set(productRows.map((product) => product.category_id).filter(Boolean)));

  const [
    { data: customizacoes, error: customError },
    { data: distribuidores, error: distribuidoresError },
    { data: markupCategorias, error: markupCategoriasError },
    { data: markupProdutos, error: markupProdutosError },
  ] = await Promise.all([
    supabaseAdmin
      .from("banca_produtos_distribuidor")
      .select(
        "product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda"
      )
      .eq("banca_id", params.bancaId),
    distribuidorIds.length > 0
      ? supabaseAdmin
          .from("distribuidores")
          .select("id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo")
          .in("id", distribuidorIds)
      : Promise.resolve({ data: [], error: null }),
    distribuidorIds.length > 0
      ? supabaseAdmin
          .from("distribuidor_markup_categorias")
          .select("distribuidor_id, category_id, markup_percentual, markup_fixo")
          .in("distribuidor_id", distribuidorIds)
          .in("category_id", categoryIds.length ? categoryIds : ["__none__"])
      : Promise.resolve({ data: [], error: null }),
    productIds.length > 0
      ? supabaseAdmin
          .from("distribuidor_markup_produtos")
          .select("distribuidor_id, product_id, markup_percentual, markup_fixo")
          .in("product_id", productIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (customError || distribuidoresError || markupCategoriasError || markupProdutosError) {
    throw new Error(
      customError?.message ||
        distribuidoresError?.message ||
        markupCategoriasError?.message ||
        markupProdutosError?.message ||
        "Erro ao montar catálogo parceiro"
    );
  }

  const customMap = new Map((customizacoes || []).map((customizacao) => [customizacao.product_id, customizacao]));
  const pricingContext = buildDistributorPricingContext({
    distribuidores: distribuidores || [],
    markupCategorias: markupCategorias || [],
    markupProdutos: markupProdutos || [],
  });

  const items = productRows
    .filter((product) => {
      const customizacao = customMap.get(product.id);
      return !customizacao || customizacao.enabled !== false;
    })
    .map((product) => {
      const customizacao = customMap.get(product.id);
      const basePrice = Number(product.price || 0);
      const computedPrice = pricingContext.calculate(basePrice, product);
      const finalPrice = customizacao?.custom_price != null ? Number(customizacao.custom_price) : computedPrice;
      const descriptionBase = typeof product.description === "string" ? product.description : "";
      const customDescription =
        typeof customizacao?.custom_description === "string" ? customizacao.custom_description : "";

      return {
        ...product,
        images: ensureProductImages(product.images, params.fallbackImageUrl),
        price: finalPrice,
        cost_price: basePrice,
        description: customDescription ? `${descriptionBase}\n\n${customDescription}` : descriptionBase,
        pronta_entrega: customizacao?.custom_pronta_entrega ?? product.pronta_entrega,
        sob_encomenda: customizacao?.custom_sob_encomenda ?? product.sob_encomenda,
        pre_venda: customizacao?.custom_pre_venda ?? product.pre_venda,
        category_id: params.distributorCategoryId || product.category_id,
        is_distribuidor: true,
      };
    });

  return {
    items,
    totalAvailable: readOptionalCount(totalCountResult),
  };
}

export function formatLegacyProductListItems(products: any[]) {
  return (products || []).map((product) => ({
    id: product.id,
    banca_id: product.banca_id,
    category_id: product.category_id,
    name: product.name,
    slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    description: product.description,
    description_full: product.description_full,
    price: product.price,
    price_original: product.price_original,
    discount_percent: product.discount_percent,
    images: Array.isArray(product.images) ? product.images : [],
    gallery_images: Array.isArray(product.gallery_images) ? product.gallery_images : [],
    specifications: product.specifications,
    rating_avg: product.rating_avg,
    reviews_count: product.reviews_count || 0,
    stock_qty: product.stock_qty,
    track_stock: product.track_stock,
    sob_encomenda: product.sob_encomenda,
    pre_venda: product.pre_venda,
    pronta_entrega: product.pronta_entrega,
    active: product.active ?? (product.track_stock ? (product.stock_qty || 0) > 0 : true),
    created_at: product.created_at,
    updated_at: product.updated_at,
  }));
}

export async function listAdminProductsPage(params: AdminProductsPageParams) {
  const page = Math.max(1, Math.floor(params.page || 1));
  const pageSize = Math.max(1, Math.min(100, Math.floor(params.pageSize || 50)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabaseAdmin
    .from("products")
    .select("*", { count: "exact" })
    .order("name");

  const normalizedQuery = String(params.q || "").trim();
  const normalizedDistribuidor = String(params.distribuidor || "").trim();
  const normalizedCategory = String(params.category || "").trim();
  const normalizedStatus = String(params.status || "").trim();

  if (normalizedQuery) {
    query = query.or(`name.ilike.%${normalizedQuery}%,codigo_mercos.ilike.%${normalizedQuery}%`);
  }

  if (normalizedDistribuidor) {
    if (normalizedDistribuidor === "admin") {
      query = query.is("distribuidor_id", null);
    } else {
      query = query.eq("distribuidor_id", normalizedDistribuidor);
    }
  }

  if (normalizedCategory) {
    query = query.eq("category_id", normalizedCategory);
  }

  if (normalizedStatus) {
    query = query.eq("active", normalizedStatus === "ativo");
  }

  const { data: products, error, count } = await query.range(from, to);
  if (error) {
    throw new Error(error.message || "Erro ao buscar produtos do admin");
  }

  const productRows = (products || []) as any[];
  if (productRows.length === 0) {
    return {
      items: [],
      total: count || 0,
      page,
      pageSize,
    };
  }

  const bancaIds = Array.from(new Set(productRows.map((product) => product.banca_id).filter(Boolean)));
  const distribuidorIds = Array.from(
    new Set(productRows.map((product) => product.distribuidor_id).filter(Boolean))
  );
  const productIds = productRows.map((product) => product.id);

  const [
    { data: distribuidores, error: distribuidoresError },
    { data: categoriesBancas, error: categoriesBancasError },
    { data: categoriesDistribuidores, error: categoriesDistribuidoresError },
    bancasResponse,
    { data: markupProdutos, error: markupProdutosError },
    { data: markupCategorias, error: markupCategoriasError },
  ] = await Promise.all([
    supabaseAdmin
      .from("distribuidores")
      .select("id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo")
      .in("id", distribuidorIds.length ? distribuidorIds : ["__none__"]),
    supabaseAdmin.from("categories").select("id, name"),
    supabaseAdmin.from("distribuidor_categories").select("id, nome"),
    bancaIds.length > 0
      ? supabaseAdmin.from("bancas").select("id, name").in("id", bancaIds)
      : Promise.resolve({ data: [], error: null }),
    productIds.length > 0
      ? supabaseAdmin
          .from("distribuidor_markup_produtos")
          .select("distribuidor_id, product_id, markup_percentual, markup_fixo")
          .in("product_id", productIds)
      : Promise.resolve({ data: [], error: null }),
    distribuidorIds.length > 0
      ? supabaseAdmin
          .from("distribuidor_markup_categorias")
          .select("distribuidor_id, category_id, markup_percentual, markup_fixo")
          .in("distribuidor_id", distribuidorIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (
    distribuidoresError ||
    categoriesBancasError ||
    categoriesDistribuidoresError ||
    bancasResponse.error ||
    markupProdutosError ||
    markupCategoriasError
  ) {
    throw new Error(
      distribuidoresError?.message ||
        categoriesBancasError?.message ||
        categoriesDistribuidoresError?.message ||
        bancasResponse.error?.message ||
        markupProdutosError?.message ||
        markupCategoriasError?.message ||
        "Erro ao enriquecer produtos do admin"
    );
  }

  const pricingContext = buildDistributorPricingContext({
    distribuidores: distribuidores || [],
    markupCategorias: markupCategorias || [],
    markupProdutos: markupProdutos || [],
  });

  const distribuidoresMap = new Map((distribuidores || []).map((item) => [item.id, item]));
  const categoriasBancasMap = new Map((categoriesBancas || []).map((item) => [item.id, item.name]));
  const categoriasDistribuidoresMap = new Map(
    (categoriesDistribuidores || []).map((item) => [item.id, item.nome])
  );
  const bancasMap = new Map(((bancasResponse.data as any[]) || []).map((item) => [item.id, item.name]));

  const items = productRows.map((product) => {
    const categoriaNome =
      (product.category_id && categoriasBancasMap.get(product.category_id)) ||
      (product.category_id && categoriasDistribuidoresMap.get(product.category_id)) ||
      "Sem Categoria";

    return {
      ...product,
      price_final: pricingContext.calculate(Number(product.price || 0), product),
      distribuidor_nome: product.distribuidor_id
        ? (distribuidoresMap.get(product.distribuidor_id) as any)?.nome || null
        : null,
      banca_nome: product.banca_id ? bancasMap.get(product.banca_id) || null : null,
      categoria_nome: categoriaNome,
    };
  });

  return {
    items,
    total: count || 0,
    page,
    pageSize,
  };
}

export async function buildAdminProductCounts() {
  const [distribuidoresAtivos, proprios, totalGeral, distribuidoresInativos] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .not("distribuidor_id", "is", null)
      .eq("active", true),
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }).is("distribuidor_id", null),
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .not("distribuidor_id", "is", null)
      .eq("active", false),
  ]);

  return {
    distribuidores_ativos: readOptionalCount(distribuidoresAtivos),
    distribuidores_inativos: readOptionalCount(distribuidoresInativos),
    proprios: readOptionalCount(proprios),
    total_geral: readOptionalCount(totalGeral),
  };
}

export async function loadAdminProductDetail(productId: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar produto");
  }

  if (!data) {
    return null;
  }

  const [bancaResponse, distribuidorResponse, categoryResponse, distribuidorCategoryResponse] = await Promise.all([
    data.banca_id
      ? supabaseAdmin
          .from("bancas")
          .select("id, user_id, name, address, whatsapp, active, approved")
          .eq("id", data.banca_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    data.distribuidor_id
      ? supabaseAdmin
          .from("distribuidores")
          .select("id, nome, ativo, ultima_sincronizacao")
          .eq("id", data.distribuidor_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    data.category_id
      ? supabaseAdmin.from("categories").select("id, name").eq("id", data.category_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    data.category_id
      ? supabaseAdmin
          .from("distribuidor_categories")
          .select("id, nome")
          .eq("id", data.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  return {
    ...data,
    category_name: categoryResponse.data?.name || distribuidorCategoryResponse.data?.nome || null,
    banca: bancaResponse.data || null,
    distribuidor: distribuidorResponse.data || null,
  };
}
