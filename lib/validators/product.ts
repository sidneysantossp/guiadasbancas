import type { Produto } from "../../types/admin";

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function validateProductCreate(input: Partial<Produto>): ValidationResult<Partial<Produto>> {
  if (!input.name || !String(input.name).trim()) return { ok: false, error: "Nome é obrigatório" };
  // Categoria é opcional para produtos da homologação Mercos (aceita null, undefined ou string vazia)
  const price = Number(input.price ?? NaN);
  if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Preço deve ser maior que zero" };
  if (input.price_original != null) {
    const po = Number(input.price_original);
    // Preço de venda (price_original) pode ser maior ou igual ao preço de custo (price)
    if (!Number.isFinite(po) || po < 0) return { ok: false, error: "Preço de venda deve ser um valor válido" };
  }
  if (input.discount_percent != null) {
    const d = Number(input.discount_percent);
    if (!Number.isFinite(d) || d < 0 || d > 100) return { ok: false, error: "Desconto deve estar entre 0 e 100%" };
  }
  if (input.stock_qty != null) {
    const s = Number(input.stock_qty);
    if (!Number.isFinite(s) || s < 0) return { ok: false, error: "Estoque não pode ser negativo" };
  }
  // Validar campos de disponibilidade (opcionais)
  if (input.sob_encomenda != null && typeof input.sob_encomenda !== 'boolean') {
    return { ok: false, error: "Campo 'sob_encomenda' deve ser booleano" };
  }
  if (input.pre_venda != null && typeof input.pre_venda !== 'boolean') {
    return { ok: false, error: "Campo 'pre_venda' deve ser booleano" };
  }
  if (input.pronta_entrega != null && typeof input.pronta_entrega !== 'boolean') {
    return { ok: false, error: "Campo 'pronta_entrega' deve ser booleano" };
  }
  return { ok: true, data: input };
}

export function validateProductUpdate(input: Partial<Produto>): ValidationResult<Partial<Produto>> {
  // mesmas regras do create, mas permitindo campos parciais desde que consistentes
  if (input.name != null && !String(input.name).trim()) return { ok: false, error: "Nome inválido" };
  if (input.category_id != null && !String(input.category_id).trim()) return { ok: false, error: "Categoria inválida" };
  if (input.price != null) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "Preço inválido" };
    if (input.price_original != null) {
      const po = Number(input.price_original);
      // Preço de venda pode ser maior ou igual ao preço de custo
      if (!Number.isFinite(po) || po < 0) return { ok: false, error: "Preço de venda deve ser um valor válido" };
    }
  }
  if (input.discount_percent != null) {
    const d = Number(input.discount_percent);
    if (!Number.isFinite(d) || d < 0 || d > 100) return { ok: false, error: "Desconto deve estar entre 0 e 100%" };
  }
  if (input.stock_qty != null) {
    const s = Number(input.stock_qty);
    if (!Number.isFinite(s) || s < 0) return { ok: false, error: "Estoque não pode ser negativo" };
  }
  // Validar campos de disponibilidade (opcionais)
  if (input.sob_encomenda != null && typeof input.sob_encomenda !== 'boolean') {
    return { ok: false, error: "Campo 'sob_encomenda' deve ser booleano" };
  }
  if (input.pre_venda != null && typeof input.pre_venda !== 'boolean') {
    return { ok: false, error: "Campo 'pre_venda' deve ser booleano" };
  }
  if (input.pronta_entrega != null && typeof input.pronta_entrega !== 'boolean') {
    return { ok: false, error: "Campo 'pronta_entrega' deve ser booleano" };
  }
  return { ok: true, data: input };
}
