export type BrazilianDocumentType = "cpf" | "cnpj";

export function normalizeBrazilianDocument(value: string): string {
  return (value || "").replace(/\D/g, "");
}

export function getBrazilianDocumentType(
  value: string
): BrazilianDocumentType | null {
  const digits = normalizeBrazilianDocument(value);

  if (digits.length === 11) return "cpf";
  if (digits.length === 14) return "cnpj";

  return null;
}

export function formatCPF(value: string): string {
  const digits = normalizeBrazilianDocument(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9
  )}-${digits.slice(9, 11)}`;
}

export function formatCNPJ(value: string): string {
  const digits = normalizeBrazilianDocument(value).slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  }
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
      5,
      8
    )}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(
    5,
    8
  )}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

export function formatBrazilianDocument(value: string): string {
  const type = getBrazilianDocumentType(value);

  if (type === "cpf") return formatCPF(value);
  if (type === "cnpj") return formatCNPJ(value);

  const digits = normalizeBrazilianDocument(value);
  return digits.length > 11 ? formatCNPJ(digits) : formatCPF(digits);
}

export function isValidCPF(value: string): boolean {
  const digits = normalizeBrazilianDocument(value);

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(digits[i]) * (10 - i);
  }

  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number(digits[i]) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;

  return remainder === Number(digits[10]);
}

export function isValidCNPJ(value: string): boolean {
  const digits = normalizeBrazilianDocument(value);

  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false;

  let size = digits.length - 2;
  let numbers = digits.substring(0, size);
  const verifierDigits = digits.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i -= 1) {
    sum += Number(numbers.charAt(size - i)) * pos;
    pos -= 1;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(verifierDigits.charAt(0))) return false;

  size += 1;
  numbers = digits.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i -= 1) {
    sum += Number(numbers.charAt(size - i)) * pos;
    pos -= 1;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === Number(verifierDigits.charAt(1));
}

export function isValidBrazilianDocument(value: string): boolean {
  const type = getBrazilianDocumentType(value);

  if (type === "cpf") return isValidCPF(value);
  if (type === "cnpj") return isValidCNPJ(value);

  return false;
}

export function validateBrazilianDocument(value: string): string | undefined {
  const digits = normalizeBrazilianDocument(value);
  const type = getBrazilianDocumentType(digits);

  if (!digits) return "Informe seu CPF ou CNPJ.";
  if (!type) {
    return "CPF deve ter 11 digitos ou CNPJ deve ter 14 digitos.";
  }
  if (type === "cpf" && !isValidCPF(digits)) {
    return "CPF invalido. Verifique os digitos.";
  }
  if (type === "cnpj" && !isValidCNPJ(digits)) {
    return "CNPJ invalido. Verifique os digitos.";
  }

  return undefined;
}

export function getBrazilianDocumentVariants(value: string): string[] {
  const digits = normalizeBrazilianDocument(value);
  const formatted = formatBrazilianDocument(digits);
  return Array.from(new Set([digits, formatted].filter(Boolean)));
}
