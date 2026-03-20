const ALLOWED_PLAN_TYPES = new Set(["free", "start", "premium"]);
const ALLOWED_BILLING_CYCLES = new Set(["monthly", "quarterly", "semiannual", "annual"]);

type NormalizePlanPayloadOptions = {
  partial?: boolean;
};

type NormalizePlanPayloadResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string };

function normalizeString(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function normalizeOptionalString(input: unknown) {
  return typeof input === "string" ? input.trim() : null;
}

function normalizeInteger(input: unknown) {
  const parsed = Number(input);
  return Number.isInteger(parsed) ? parsed : null;
}

function normalizePrice(input: unknown) {
  const parsed = Number(input);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeAdminPlanPayload(
  payload: unknown,
  options?: NormalizePlanPayloadOptions
): NormalizePlanPayloadResult {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Payload inválido" };
  }

  const partial = options?.partial === true;
  const body = payload as Record<string, unknown>;
  const data: Record<string, unknown> = {};

  if (!partial || Object.prototype.hasOwnProperty.call(body, "name")) {
    const name = normalizeString(body.name);
    if (!name) return { ok: false, error: "Nome é obrigatório" };
    data.name = name;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "slug")) {
    const slug = normalizeString(body.slug).toLowerCase();
    if (!slug) return { ok: false, error: "Slug é obrigatório" };
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return { ok: false, error: "Slug deve conter apenas letras minúsculas, números e hífen" };
    }
    data.slug = slug;
  }

  if (Object.prototype.hasOwnProperty.call(body, "description")) {
    data.description = normalizeOptionalString(body.description);
  } else if (!partial) {
    data.description = null;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "type")) {
    const type = normalizeString(body.type).toLowerCase();
    if (!ALLOWED_PLAN_TYPES.has(type)) {
      return { ok: false, error: "Tipo de plano inválido" };
    }
    data.type = type;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "price")) {
    const price = normalizePrice(body.price);
    if (price === null || price < 0) {
      return { ok: false, error: "Preço do plano inválido" };
    }
    data.price = price;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "billing_cycle")) {
    const billingCycle = normalizeString(body.billing_cycle).toLowerCase();
    if (!ALLOWED_BILLING_CYCLES.has(billingCycle)) {
      return { ok: false, error: "Ciclo de cobrança inválido" };
    }
    data.billing_cycle = billingCycle;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "features")) {
    if (!Array.isArray(body.features)) {
      return { ok: false, error: "Features devem ser uma lista" };
    }
    data.features = body.features
      .map((item) => normalizeString(item))
      .filter(Boolean);
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "limits")) {
    const rawLimits = body.limits;
    if (!rawLimits || typeof rawLimits !== "object" || Array.isArray(rawLimits)) {
      return { ok: false, error: "Limites do plano inválidos" };
    }

    const limits = rawLimits as Record<string, unknown>;
    const maxProducts = normalizeInteger(limits.max_products);
    const maxImagesPerProduct = normalizeInteger(limits.max_images_per_product);

    if (maxProducts === null || maxProducts < 0) {
      return { ok: false, error: "Limite de produtos inválido" };
    }

    if (maxImagesPerProduct === null || maxImagesPerProduct < 1) {
      return { ok: false, error: "Limite de imagens por produto inválido" };
    }

    data.limits = {
      max_products: maxProducts,
      max_images_per_product: maxImagesPerProduct,
      distributor_catalog: Boolean(limits.distributor_catalog),
      partner_directory: Boolean(limits.partner_directory),
    };
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "is_active")) {
    data.is_active = Boolean(body.is_active);
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "is_default")) {
    data.is_default = Boolean(body.is_default);
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "sort_order")) {
    const sortOrder = normalizeInteger(body.sort_order);
    if (sortOrder === null || sortOrder < 0) {
      return { ok: false, error: "Ordem de exibição inválida" };
    }
    data.sort_order = sortOrder;
  }

  return { ok: true, data };
}
