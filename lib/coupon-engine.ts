export type CouponBenefitType = "percent" | "fixed" | "free_shipping" | "unknown";

export type ParsedCouponBenefit = {
  type: CouponBenefitType;
  value: number | null;
  label: string;
};

export type CouponDiscountResult = {
  type: CouponBenefitType;
  scope: "items" | "shipping";
  amount: number;
  label: string;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function isCouponActive(active: boolean, expiresAt?: string | null, now = Date.now()) {
  if (!active) return false;
  if (!expiresAt) return true;

  const timestamp = Date.parse(expiresAt);
  if (!Number.isFinite(timestamp)) return true;

  return timestamp >= now;
}

export function parseCouponBenefit(discountText: string): ParsedCouponBenefit {
  const raw = String(discountText || "").trim();
  const normalized = normalizeText(raw);

  if (normalized.includes("frete gratis") || normalized.includes("frete gratis")) {
    return {
      type: "free_shipping",
      value: null,
      label: raw || "Frete gratis",
    };
  }

  const percentMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*%/i);
  if (percentMatch) {
    return {
      type: "percent",
      value: Number(percentMatch[1].replace(",", ".")),
      label: raw,
    };
  }

  const fixedMatch = raw.match(/R\$\s*(\d+(?:[.,]\d+)?)/i);
  if (fixedMatch) {
    return {
      type: "fixed",
      value: Number(fixedMatch[1].replace(",", ".")),
      label: raw,
    };
  }

  return {
    type: "unknown",
    value: null,
    label: raw,
  };
}

export function computeCouponDiscount(params: {
  discountText: string;
  subtotal: number;
  shippingFee?: number;
}): CouponDiscountResult {
  const benefit = parseCouponBenefit(params.discountText);
  const subtotal = Math.max(0, Number(params.subtotal || 0));
  const shippingFee = Math.max(0, Number(params.shippingFee || 0));

  switch (benefit.type) {
    case "percent":
      return {
        type: benefit.type,
        scope: "items",
        amount: Math.max(0, subtotal * ((benefit.value || 0) / 100)),
        label: benefit.label,
      };
    case "fixed":
      return {
        type: benefit.type,
        scope: "items",
        amount: Math.min(subtotal, Math.max(0, Number(benefit.value || 0))),
        label: benefit.label,
      };
    case "free_shipping":
      return {
        type: benefit.type,
        scope: "shipping",
        amount: shippingFee,
        label: benefit.label || "Frete gratis",
      };
    default:
      return {
        type: "unknown",
        scope: "items",
        amount: 0,
        label: benefit.label,
      };
  }
}
