import type { Pedido } from "../../types/admin";

export type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

export function validateOrderUpdate(input: Partial<Pedido>): ValidationResult<Partial<Pedido>> {
  if (input.status != null && !['novo','confirmado','em_preparo','saiu_para_entrega','entregue','cancelado'].includes(input.status)) {
    return { ok: false, error: 'Status de pedido inválido' };
  }
  if (input.total != null) {
    const total = Number(input.total);
    if (!Number.isFinite(total) || total < 0) return { ok: false, error: 'Total inválido' };
  }
  if (input.items != null) {
    if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, error: 'Itens inválidos' };
    for (const it of input.items) {
      if (!it.product_id || !it.name_snapshot) return { ok: false, error: 'Item inválido' };
      const qty = Number(it.qty);
      const price = Number(it.price_snapshot);
      if (!Number.isFinite(qty) || qty <= 0) return { ok: false, error: 'Quantidade inválida' };
      if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Preço do item inválido' };
    }
  }
  return { ok: true, data: input };
}
