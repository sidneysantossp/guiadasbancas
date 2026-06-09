import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";
import {
  applyWholesaleProductCustomization,
  buildWholesaleProductCustomizationInput,
  formatWholesaleProduct,
  hasWholesaleAccessForBanca,
  listWholesaleProductCustomizationsForBanca,
  loadWholesaleProductCustomization,
  saveWholesaleProductCustomization,
} from "@/lib/modules/atacado/service";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";
import {
  applyDistributorProductCustomization,
  buildDistributorProductCustomizationInput,
  calculateDistributorProductMarkup,
  listDistributorCatalogForBanca,
  listDistributorPreviewFallbackForBanca,
  listOwnedCatalogProducts,
  loadDistributorProductCustomization,
  saveDistributorProductCustomization,
} from "@/lib/modules/products/service";
import {
  buildOwnedProductSpecifications,
  extractOwnedProductPricing,
  normalizeOwnedProductRecord,
} from "@/lib/owned-product-pricing";
import { getNextPlanType } from "@/lib/plan-messaging";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

const PRODUCT_LIMIT_UPGRADE_URL = "/jornaleiro/dashboard";
const DISTRIBUTOR_CATALOG_UPGRADE_URL = "/jornaleiro/dashboard";
const DISTRIBUTOR_CATALOG_MANAGE_UPGRADE_URL =
  "/jornaleiro/dashboard";

async function ensureJornaleiroProductContext(
  userId: string,
  select = "id, user_id, is_cotista, cotista_id"
) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const banca = await loadActiveJornaleiroBancaRow({
    userId,
    select,
  });
  const entitlements = banca ? await resolveBancaPlanEntitlements(banca) : null;

  return { banca, entitlements };
}

function buildPlanLimitError(params: {
  entitlements: NonNullable<Awaited<ReturnType<typeof ensureJornaleiroProductContext>>["entitlements"]>;
  currentCount: number;
}) {
  const { entitlements, currentCount } = params;
  const payload =
    entitlements.overdueFeaturesLocked && entitlements.subscription?.plan
      ? {
          success: false,
          error: "Este acesso precisa ser revisado pela equipe do Guia das Bancas.",
          code: "PLAN_OVERDUE_SUSPENDED",
          limit: entitlements.productLimit,
          currentCount,
          plan: entitlements.plan,
          contracted_plan: entitlements.subscription.plan,
          overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
          upgrade_url: PRODUCT_LIMIT_UPGRADE_URL,
        }
      : entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
        ? {
            success: false,
            error: "Este acesso precisa ser revisado pela equipe do Guia das Bancas.",
            code: "PLAN_PENDING_PAYMENT",
            limit: entitlements.productLimit,
            currentCount,
            plan: entitlements.plan,
            requested_plan: entitlements.requestedPlan,
            upgrade_url: PRODUCT_LIMIT_UPGRADE_URL,
          }
        : {
            success: false,
            error: `O catálogo desta banca permite até ${entitlements.productLimit} produtos próprios. Fale com a equipe do Guia das Bancas para ajustar a capacidade.`,
            code: "PLAN_PRODUCT_LIMIT_REACHED",
            limit: entitlements.productLimit,
            currentCount,
            plan: entitlements.plan,
            recommended_plan_type: getNextPlanType(entitlements.planType),
            upgrade_url: PRODUCT_LIMIT_UPGRADE_URL,
          };

  return Object.assign(new Error(String(payload.code)), {
    status: 403,
    payload,
  });
}

function buildPlanImageLimitError(params: {
  entitlements: NonNullable<Awaited<ReturnType<typeof ensureJornaleiroProductContext>>["entitlements"]>;
  imageLimit: number;
  currentCount: number;
}) {
  const { entitlements, imageLimit, currentCount } = params;
  const payload =
    entitlements.overdueFeaturesLocked && entitlements.subscription?.plan
      ? {
          success: false,
          error: "Este acesso precisa ser revisado pela equipe do Guia das Bancas.",
          code: "PLAN_OVERDUE_SUSPENDED",
          limit: imageLimit,
          currentCount,
          plan: entitlements.plan,
          contracted_plan: entitlements.subscription.plan,
          overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
          upgrade_url: PRODUCT_LIMIT_UPGRADE_URL,
        }
      : entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
        ? {
            success: false,
            error: "Este acesso precisa ser revisado pela equipe do Guia das Bancas.",
            code: "PLAN_PENDING_PAYMENT",
            limit: imageLimit,
            currentCount,
            plan: entitlements.plan,
            requested_plan: entitlements.requestedPlan,
            upgrade_url: PRODUCT_LIMIT_UPGRADE_URL,
          }
        : {
            success: false,
            error: `O cadastro desta banca permite até ${imageLimit} imagens por produto. Fale com a equipe do Guia das Bancas para ajustar essa capacidade.`,
            code: "PLAN_IMAGE_LIMIT_REACHED",
            limit: imageLimit,
            currentCount,
            plan: entitlements.plan,
            recommended_plan_type: getNextPlanType(entitlements.planType),
            upgrade_url: PRODUCT_LIMIT_UPGRADE_URL,
          };

  return Object.assign(new Error(String(payload.code)), {
    status: 403,
    payload,
  });
}

function buildDistributorCatalogProductsError(
  entitlements: NonNullable<Awaited<ReturnType<typeof ensureJornaleiroProductContext>>["entitlements"]>,
  mode: "read" | "edit"
) {
  const payload =
    mode === "read"
      ? {
          success: false,
          error: "O catálogo de distribuidores ainda não está liberado para esta banca.",
          code: "PLAN_DISTRIBUTOR_CATALOG_LOCKED",
          recommended_plan_type: "premium",
          upgrade_url: DISTRIBUTOR_CATALOG_UPGRADE_URL,
        }
      : {
          success: false,
          error: "A edição do catálogo de distribuidores ainda não está liberada para esta banca.",
          code: "PLAN_DISTRIBUTOR_CATALOG_LOCKED",
          recommended_plan_type: "premium",
          upgrade_url: DISTRIBUTOR_CATALOG_MANAGE_UPGRADE_URL,
        };

  return Object.assign(new Error("PLAN_DISTRIBUTOR_CATALOG_LOCKED"), {
    status: 403,
    payload,
  });
}

function buildFeaturedPlacementLockedError() {
  const payload = {
    success: false,
    error: "Destacar produtos na vitrine ainda não está liberado para esta banca.",
    code: "PLAN_FEATURED_PLACEMENT_LOCKED",
    upgrade_url: "/jornaleiro/dashboard",
  };

  return Object.assign(new Error(String(payload.code)), {
    status: 403,
    payload,
  });
}

function normalizeBooleanFilter(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

async function listFornecedorProductsForBanca(params: {
  bancaId: string;
  filters: {
    q?: string;
    category?: string;
    active?: boolean | null;
  };
}) {
  if (params.filters.active === false) return [];

  const allowed = await hasWholesaleAccessForBanca(params.bancaId);
  if (!allowed) return [];

  let query = supabaseAdmin
    .from("own_wholesale_products")
    .select("*, category:categories(id, name)")
    .eq("active", true)
    .eq("visible", true)
    .order("name", { ascending: true });

  const normalizedQuery = String(params.filters.q || "").trim();
  if (normalizedQuery) {
    query = query.or(`name.ilike.%${normalizedQuery}%,sku.ilike.%${normalizedQuery}%,supplier_reference.ilike.%${normalizedQuery}%`);
  }

  if (params.filters.category) {
    query = query.eq("category_id", params.filters.category);
  }

  const { data, error } = await query.limit(normalizedQuery ? 200 : 100);
  if (error) {
    throw new Error(error.message || "Erro ao buscar produtos do fornecedor");
  }

  const products = ((data || []) as any[]).map((row) => formatWholesaleProduct(row));
  const customizations = await listWholesaleProductCustomizationsForBanca({
    bancaId: params.bancaId,
    productIds: products.map((product) => product.id),
  });

  return products
    .map((product) => applyWholesaleProductCustomization(product, customizations.get(product.id)))
    .filter((product) => product.visible_jornaleiro !== false)
    .map((product) => {
      const imageList = product.images.length > 0
        ? product.images
        : product.image_url
          ? [product.image_url]
          : [];

      return {
        id: `fornecedor:${product.id}`,
        source_id: product.id,
        source: "fornecedor",
        is_fornecedor: true,
        is_distribuidor: false,
        name: product.name,
        description: product.description,
        category_id: product.category_id,
        category_name: product.category_name || "Fornecedor Guia",
        price: product.price,
        cost_price: product.cost_price,
        supplier_price: product.supplier_price,
        supplier_current_price: product.supplier_current_price,
        supplier_cost_price: product.supplier_cost_price,
        has_custom_price: product.has_custom_price,
        price_hidden: product.price_hidden,
        price_original: product.compare_at_price,
        stock_qty: product.available_quantity,
        track_stock: product.track_stock,
        active: product.active !== false,
        images: imageList,
        codigo_mercos: product.sku || product.supplier_reference || "",
        pronta_entrega: product.availability_status === "in_stock",
        sob_encomenda: product.availability_status === "on_demand",
        pre_venda: product.availability_status === "quote",
        updated_at: product.updated_at,
      };
    });
}

export async function listJornaleiroProducts(params: {
  userId: string;
  requestUrl: string;
}) {
  const { banca, entitlements } = await ensureJornaleiroProductContext(params.userId);
  const bancaLifecycle = resolveBancaLifecycle(banca);

  if (!banca || !entitlements) {
    return {
      success: true,
      items: [],
      total: 0,
      partner_linked: false,
      partner_catalog_access: false,
      is_cotista: false,
      has_catalog_access: false,
      banca_lifecycle: bancaLifecycle,
      message: "Cadastre sua banca para ver seus produtos",
    };
  }

  const searchParams = new URL(params.requestUrl).searchParams;
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = normalizeBooleanFilter(searchParams.get("active"));
  const featured = normalizeBooleanFilter(searchParams.get("featured"));
  const priceFilter = searchParams.get("priceFilter") || "";
  const statsOnly = searchParams.get("stats") === "true";

  const [produtosBanca, distributorCatalog, fornecedorProducts] = await Promise.all([
    listOwnedCatalogProducts({
      bancaId: banca.id,
      filters: {
        q,
        category,
        active,
        featured,
      },
    }),
    listDistributorCatalogForBanca({
      bancaId: banca.id,
      filters: {
        q,
        category,
        limit: q ? 200 : 100,
      },
      canAccessCatalog: entitlements.canAccessDistributorCatalog,
      includeTotalCount: statsOnly,
    }),
    listFornecedorProductsForBanca({
      bancaId: banca.id,
      filters: {
        q,
        category,
        active,
      },
    }),
  ]);

  const ownedProducts = (produtosBanca || []).map((product) => normalizeOwnedProductRecord(product));
  const fallbackDistributorCatalog =
    !entitlements.canAccessDistributorCatalog && ownedProducts.length === 0
      ? await listDistributorPreviewFallbackForBanca({
          bancaId: banca.id,
          limit: 10,
        })
      : { items: [], totalAvailable: 0 };
  let allItems = [...ownedProducts, ...distributorCatalog.items, ...fallbackDistributorCatalog.items, ...fornecedorProducts];

  if (priceFilter === "personalizado") {
    allItems = allItems.filter((product: any) => {
      if (product.is_distribuidor !== true) return true;
      return Math.abs(Number(product.price || 0) - Number(product.cost_price || 0)) > 0.01;
    });
  } else if (priceFilter === "distribuidor") {
    allItems = allItems.filter((product: any) => {
      if (product.is_distribuidor !== true) return false;
      return Math.abs(Number(product.price || 0) - Number(product.cost_price || 0)) <= 0.01;
    });
  }

  const totalReal =
    entitlements.canAccessDistributorCatalog && statsOnly
      ? ownedProducts.length + distributorCatalog.totalAvailable + fornecedorProducts.length
      : allItems.length;

  return {
    success: true,
    items: allItems,
    total: allItems.length,
    totalReal,
    is_cotista: entitlements.isLegacyCotistaLinked,
    partner_linked: entitlements.isLegacyCotistaLinked,
    has_catalog_access: entitlements.canAccessDistributorCatalog,
    partner_catalog_access: entitlements.canAccessDistributorCatalog,
    plan: entitlements.plan,
    requested_plan: entitlements.requestedPlan,
    subscription: entitlements.subscription,
    banca_lifecycle: bancaLifecycle,
    entitlements: {
      plan_type: entitlements.planType,
      product_limit: entitlements.productLimit,
      can_access_distributor_catalog: entitlements.canAccessDistributorCatalog,
      paid_features_locked_until_payment: entitlements.paidFeaturesLockedUntilPayment,
      overdue_features_locked: entitlements.overdueFeaturesLocked,
      overdue_in_grace_period: entitlements.overdueInGracePeriod,
      overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
    },
    stats: {
      proprios: ownedProducts.length,
      distribuidores: statsOnly
        ? distributorCatalog.totalAvailable
        : distributorCatalog.items.length,
      distribuidoresTotal: distributorCatalog.totalAvailable,
      distribuidoresPreview: fallbackDistributorCatalog.items.length,
      fornecedor: fornecedorProducts.length,
    },
    timestamp: new Date().toISOString(),
  };
}

export async function createJornaleiroProduct(params: {
  userId: string;
  input: Record<string, any>;
}) {
  const { banca, entitlements } = await ensureJornaleiroProductContext(params.userId, "id, user_id");

  if (!banca || !entitlements) {
    throw new Error("BANCA_NOT_FOUND");
  }

  if (entitlements.productLimit) {
    const { count, error } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .is("distribuidor_id", null);

    if (error) {
      throw new Error(error.message || "Não foi possível validar a capacidade do catálogo");
    }

    const currentCount = count || 0;
    if (currentCount >= entitlements.productLimit) {
      throw buildPlanLimitError({ entitlements, currentCount });
    }
  }

  const body = params.input;
  const incomingImages = Array.isArray(body.images) ? body.images : [];

  if (
    entitlements.maxImagesPerProduct &&
    incomingImages.length > entitlements.maxImagesPerProduct
  ) {
    throw buildPlanImageLimitError({
      entitlements,
      imageLimit: entitlements.maxImagesPerProduct,
      currentCount: incomingImages.length,
    });
  }

  if (body.featured === true && !entitlements.canAccessFeaturedPlacement) {
    throw buildFeaturedPlacementLockedError();
  }

  const novo: Record<string, any> = {
    banca_id: banca.id,
    category_id: body.category_id || null,
    name: body.name,
    description: body.description || "",
    images: incomingImages,
    price: Number(body.price || 0),
    price_original: body.price_original != null ? Number(body.price_original) : null,
    discount_percent: body.discount_percent != null ? Number(body.discount_percent) : null,
    stock_qty: body.stock_qty != null ? Number(body.stock_qty) : 0,
    active: body.active ?? true,
    description_full: body.description_full || "",
    specifications: buildOwnedProductSpecifications({
      specifications: body.specifications,
      costPrice: body.cost_price,
    }),
    track_stock: body.track_stock ?? false,
    featured: body.featured ?? false,
    sob_encomenda: body.sob_encomenda ?? false,
    pre_venda: body.pre_venda ?? false,
    pronta_entrega: body.pronta_entrega ?? false,
  };

  const { data: created, error } = await supabaseAdmin
    .from("products")
    .insert(novo)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar produto");
  }

  return {
    success: true,
    data: created,
  };
}

export async function loadJornaleiroProductDetail(params: {
  userId: string;
  productId: string;
}) {
  const { banca, entitlements } = await ensureJornaleiroProductContext(params.userId, "id, user_id");

  if (params.productId.startsWith("fornecedor:")) {
    if (!banca) throw new Error("PRODUCT_NOT_FOUND");
    const supplierProductId = params.productId.replace(/^fornecedor:/, "");
    const allowed = await hasWholesaleAccessForBanca(banca.id);
    if (!allowed) throw new Error("PRODUCT_NOT_FOUND");

    const { data: wholesaleProduct, error: wholesaleError } = await supabaseAdmin
      .from("own_wholesale_products")
      .select("*, category:categories(id, name)")
      .eq("id", supplierProductId)
      .eq("active", true)
      .eq("visible", true)
      .maybeSingle();

    if (wholesaleError || !wholesaleProduct) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    const customization = await loadWholesaleProductCustomization({
      bancaId: banca.id,
      productId: supplierProductId,
    });
    const product = applyWholesaleProductCustomization(
      formatWholesaleProduct(wholesaleProduct as any),
      customization
    );
    const images = product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [];

    return {
      success: true,
      data: {
        id: `fornecedor:${product.id}`,
        source_id: product.id,
        source: "fornecedor",
        is_fornecedor: true,
        is_distribuidor: false,
        banca_id: banca.id,
        name: product.name,
        description: product.description || "",
        description_full: product.description || "",
        category_id: product.category_id,
        category_name: product.category_name || "Fornecedor Guia",
        images,
        price: product.price,
        cost_price: product.cost_price,
        supplier_price: product.supplier_price,
        supplier_current_price: product.supplier_current_price,
        supplier_cost_price: product.supplier_cost_price,
        has_custom_price: product.has_custom_price,
        price_hidden: product.price_hidden,
        price_original: null,
        discount_percent: 0,
        stock_qty: product.available_quantity,
        track_stock: product.track_stock,
        active: product.active !== false,
        featured: product.featured === true,
        codigo_mercos: product.sku || product.supplier_reference || "",
        sob_encomenda: product.availability_status === "on_demand",
        pre_venda: product.availability_status === "quote",
        pronta_entrega: product.availability_status === "in_stock",
        delivery_lead_time: product.delivery_lead_time,
        min_order_quantity: product.min_order_quantity,
        pack_size: product.pack_size,
        updated_at: product.updated_at,
      },
    };
  }

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*, bancas(name)")
    .eq("id", params.productId)
    .single();

  if (error || !product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (product.distribuidor_id) {
    const markupPrice = await calculateDistributorProductMarkup({
      productId: params.productId,
      distribuidorId: product.distribuidor_id,
      categoryId: product.category_id,
      basePrice: Number(product.price || 0),
    });

    if (banca) {
      if (!entitlements?.canAccessDistributorCatalog) {
        throw buildDistributorCatalogProductsError(
          entitlements as NonNullable<typeof entitlements>,
          "read"
        );
      }

      const customization = await loadDistributorProductCustomization({
        bancaId: banca.id,
        productId: params.productId,
      });

      if (customization) {
        return {
          success: true,
          data: applyDistributorProductCustomization({
            product,
            markupPrice,
            customization,
          }),
        };
      }
    }

    return {
      success: true,
      data: {
        ...product,
        price: markupPrice,
        price_original: null,
        cost_price: product.price,
        discount_percent: 0,
      },
    };
  }

  if (!banca || product.banca_id !== banca.id) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return {
    success: true,
    data: normalizeOwnedProductRecord(product),
  };
}

export async function updateJornaleiroProduct(params: {
  userId: string;
  productId: string;
  input: Record<string, any>;
}) {
  const { banca, entitlements } = await ensureJornaleiroProductContext(params.userId, "id, user_id");

  if (!banca || !entitlements) {
    throw new Error("BANCA_NOT_FOUND");
  }

  if (params.productId.startsWith("fornecedor:")) {
    const supplierProductId = params.productId.replace(/^fornecedor:/, "");
    const allowed = await hasWholesaleAccessForBanca(banca.id);
    if (!allowed) throw new Error("FORBIDDEN_PRODUCT_EDIT");

    const { data: supplierProduct, error: supplierError } = await supabaseAdmin
      .from("own_wholesale_products")
      .select("id, active, visible")
      .eq("id", supplierProductId)
      .maybeSingle();

    if (supplierError || !supplierProduct) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    const customizationInput = buildWholesaleProductCustomizationInput(params.input, {
      defaultEnabled: params.input.active !== false,
      useProductEditorAliases: true,
    });

    await saveWholesaleProductCustomization({
      bancaId: banca.id,
      productId: supplierProductId,
      input: customizationInput,
    });

    return {
      success: true,
      message: "Customização do fornecedor salva com sucesso",
    };
  }

  const { data: existingProduct } = await supabaseAdmin
    .from("products")
    .select("id, banca_id, distribuidor_id, specifications")
    .eq("id", params.productId)
    .single();

  if (!existingProduct) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (existingProduct.distribuidor_id) {
    if (!entitlements.canAccessDistributorCatalog) {
      throw buildDistributorCatalogProductsError(entitlements, "edit");
    }

    const customizationInput = buildDistributorProductCustomizationInput(params.input, {
      defaultEnabled: params.input.active !== false,
      useProductEditorAliases: true,
    });

    await saveDistributorProductCustomization({
      bancaId: banca.id,
      productId: params.productId,
      input: customizationInput,
    });

    return {
      success: true,
      message: "Customização salva com sucesso",
    };
  }

  if (existingProduct.banca_id !== banca.id) {
    throw new Error("FORBIDDEN_PRODUCT_EDIT");
  }

  const validFields = [
    "name",
    "description",
    "description_full",
    "specifications",
    "price",
    "price_original",
    "discount_percent",
    "stock_qty",
    "track_stock",
    "images",
    "active",
    "featured",
    "sob_encomenda",
    "pre_venda",
    "pronta_entrega",
    "category_id",
  ];

  const updateData: Record<string, any> = {};
  for (const key of validFields) {
    if (params.input[key] !== undefined) {
      updateData[key] = params.input[key];
    }
  }

  if (params.input.cost_price !== undefined || params.input.specifications !== undefined) {
    const { costPrice: currentCostPrice } = extractOwnedProductPricing(existingProduct.specifications);
    updateData.specifications = buildOwnedProductSpecifications({
      specifications:
        params.input.specifications !== undefined
          ? params.input.specifications
          : existingProduct.specifications,
      costPrice:
        params.input.cost_price !== undefined ? params.input.cost_price : currentCostPrice,
    });
  }

  if (
    Array.isArray(updateData.images) &&
    entitlements.maxImagesPerProduct &&
    updateData.images.length > entitlements.maxImagesPerProduct
  ) {
    throw buildPlanImageLimitError({
      entitlements,
      imageLimit: entitlements.maxImagesPerProduct,
      currentCount: updateData.images.length,
    });
  }

  if (
    Object.prototype.hasOwnProperty.call(updateData, "stock_qty") &&
    Number(updateData.stock_qty) === 0
  ) {
    updateData.active = false;
  }

  updateData.updated_at = new Date().toISOString();

  const { data: updatedProduct, error } = await supabaseAdmin
    .from("products")
    .update(updateData)
    .eq("id", params.productId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao atualizar produto");
  }

  return {
    success: true,
    data: updatedProduct,
  };
}

export async function deleteJornaleiroProduct(params: {
  userId: string;
  productId: string;
}) {
  const { banca } = await ensureJornaleiroProductContext(params.userId, "id, user_id");

  if (!banca) {
    throw new Error("BANCA_NOT_FOUND");
  }

  const { data: existingProduct } = await supabaseAdmin
    .from("products")
    .select("id, banca_id, distribuidor_id")
    .eq("id", params.productId)
    .single();

  if (!existingProduct) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  if (existingProduct.banca_id !== banca.id || existingProduct.distribuidor_id) {
    throw new Error("FORBIDDEN_PRODUCT_DELETE");
  }

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", params.productId);

  if (error) {
    throw new Error(error.message || "Erro ao deletar produto");
  }

  return {
    success: true,
    message: "Produto deletado com sucesso",
  };
}
