export function normalizeBrazilianWhatsAppDigits(value?: string | null): string {
  const rawDigits = String(value || "").replace(/\D/g, "");
  if (!rawDigits) return "";

  if (/^55\d{10,11}$/.test(rawDigits)) {
    return rawDigits;
  }

  const digits = rawDigits.replace(/^0+(?=\d{10,11}$)/, "");

  if (/^\d{10,11}$/.test(digits)) {
    return `55${digits}`;
  }

  return rawDigits;
}

export function buildWhatsAppUrl(phone?: string | null, message?: string): string {
  const digits = normalizeBrazilianWhatsAppDigits(phone);
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me";
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
