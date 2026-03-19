import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import {
  applyDistributorProductCustomization,
  buildDistributorProductCustomizationInput,
  calculateDistributorProductMarkup,
  listDistributorCatalogForBanca,
  listOwnedCatalogProducts,
  loadDistributorProductCustomization,
  saveDistributorProductCustomization,
} from "@/lib/modules/products/service";
import { getNextPlanType } from "@/lib/plan-messaging";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

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

  const banca = await getActiveBancaRowForUser(userId, select);
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
          error: `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto e os recursos avançados foram pausados após o período de carência.`,
          code: "PLAN_OVERDUE_SUSPENDED",
          limit: entitlements.productLimit,
          currentCount,
          plan: entitlements.plan,
          contracted_plan: entitlements.subscription.plan,
          overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
          upgrade_url: "/jornaleiro/meu-plano",
        }
      : entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
        ? {
            success: false,
            error: `Seu upgrade para ${entitlements.requestedPlan.name} já foi iniciado. Assim que a primeira cobrança for paga, o novo limite será liberado.`,
            code: "PLAN_PENDING_PAYMENT",
            limit: entitlements.productLimit,
            currentCount,
            plan: entitlements.plan,
            requested_plan: entitlements.requestedPlan,
            upgrade_url: "/jornaleiro/meu-plano",
          }
        : {
            success: false,
            error: `Seu plano ${entitlements.plan?.name || "atual"} permite até ${entitlements.productLimit} produtos. Faça upgrade para continuar cadastrando.`,
            code: "PLAN_PRODUCT_LIMIT_REACHED",
            limit: entitlements.productLimit,
            currentCount,
            plan: entitlements.plan,
            recommended_plan_type: getNextPlanType(entitlements.planType),
            upgrade_url: "/jornaleiro/meu-plano",
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
          error: `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto e os recursos avançados foram pausados após o período de carência.`,
          code: "PLAN_OVERDUE_SUSPENDED",
          limit: imageLimit,
          currentCount,
          plan: entitlements.plan,
          contracted_plan: entitlements.subscription.plan,
          overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
          upgrade_url: "/jornaleiro/meu-plano",
        }
      : entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
        ? {
            success: false,
            error: `Seu upgrade para ${entitlements.requestedPlan.name} já foi iniciado. Assim que a primeira cobrança for paga, o novo limite será liberado.`,
            code: "PLAN_PENDING_PAYMENT",
            limit: imageLimit,
            currentCount,
            plan: entitlements.plan,
            requested_plan: entitlements.requestedPlan,
            upgrade_url: "/jornaleiro/meu-plano",
          }
        : {
            success: false,
            error: `Seu plano ${entitlements.plan?.name || "atual"} permite até ${imageLimit} imagens por produto. Faça upgrade para continuar.`,
            code: "PLAN_IMAGE_LIMIT_REACHED",
            limit: imageLimit,
            currentCount,
            plan: entitlements.plan,
            recommended_plan_type: getNextPlanType(entitlements.planType),
            upgrade_url: "/jornaleiro/meu-plano",
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
      ? { success: false, error: "Seu plano atual não permite acessar produtos do catálogo de distribuidores." }
      : { success: false, error: "Seu plano atual não permite editar produtos do catálogo de distribuidores." };

  return Object.assign(new Error("PLAN_DISTRIBUTOR_CATALOG_LOCKED"), {
    status: 403,
    payload,
  });
}

function normalizeBooleanFilter(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
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

  const [produtosBanca, distributorCatalog] = await Promise.all([
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
  ]);

  let allItems = [...(produtosBanca || []), ...distributorCatalog.items];

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
      ? (produtosBanca?.length || 0) + distributorCatalog.totalAvailable
      : allItems.length;

  return {
    success: true,
    items: allItems,
    total: allItems.length,
    totalReal,
    is_cotista: entitlements.isLegacyCotistaLinked,
    has_catalog_access: entitlements.canAccessDistributorCatalog,
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
      proprios: produtosBanca?.length || 0,
      distribuidores: statsOnly
        ? distributorCatalog.totalAvailable
        : distributorCatalog.items.length,
      distribuidoresTotal: distributorCatalog.totalAvailable,
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
      throw new Error(error.message || "Não foi possível validar o limite do plano");
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
    data: product,
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

  const { data: existingProduct } = await supabaseAdmin
    .from("products")
    .select("id, banca_id, distribuidor_id")
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
