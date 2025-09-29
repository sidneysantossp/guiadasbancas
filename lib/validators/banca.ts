import type { Banca } from "../../types/admin";

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function validateBancaCreate(input: Partial<Banca>): ValidationResult<Partial<Banca>> {
  if (!input.name || !String(input.name).trim()) return { ok: false, error: "Nome é obrigatório" };
  const slug = (input.slug || (input.name as string)).toLowerCase().trim();
  if (!slug) return { ok: false, error: "Slug é obrigatório" };
  const status = input.status || 'aprovacao';
  return { ok: true, data: { ...input, slug, status } };
}

export function validateBancaUpdate(input: Partial<Banca>): ValidationResult<Partial<Banca>> {
  if (input.name != null && !String(input.name).trim()) return { ok: false, error: "Nome inválido" };
  if (input.slug != null && !String(input.slug).trim()) return { ok: false, error: "Slug inválido" };
  if (input.status != null && !['ativo','pausado','aprovacao'].includes(input.status)) return { ok: false, error: "Status inválido" };
  return { ok: true, data: input };
}
