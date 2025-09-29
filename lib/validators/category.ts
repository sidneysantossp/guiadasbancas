import type { Categoria } from "../../types/admin";

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function validateCategoryCreate(input: Partial<Categoria>): ValidationResult<Partial<Categoria>> {
  if (!input.name || !String(input.name).trim()) return { ok: false, error: "Nome é obrigatório" };
  const slug = (input.slug || (input.name as string)).toLowerCase().trim();
  if (!slug) return { ok: false, error: "Slug é obrigatório" };
  if (input.order != null && (!Number.isFinite(Number(input.order)) || Number(input.order) < 0)) return { ok: false, error: "Ordem inválida" };
  return { ok: true, data: { ...input, slug } };
}

export function validateCategoryUpdate(input: Partial<Categoria>): ValidationResult<Partial<Categoria>> {
  if (input.name != null && !String(input.name).trim()) return { ok: false, error: "Nome inválido" };
  if (input.slug != null && !String(input.slug).trim()) return { ok: false, error: "Slug inválido" };
  if (input.order != null && (!Number.isFinite(Number(input.order)) || Number(input.order) < 0)) return { ok: false, error: "Ordem inválida" };
  return { ok: true, data: input };
}
