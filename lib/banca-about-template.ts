export const BANCA_ABOUT_TEMPLATE_KEY = "banca_about_fallback_template";

export const DEFAULT_BANCA_ABOUT_TEMPLATE = [
  "A {banca_nome} é uma banca parceira do Guia das Bancas, com atendimento {regiao}.",
  "Aqui você encontra itens {categorias}, com atualização frequente de estoque e preços.",
  "Para comprar, escolha seus produtos nesta página e finalize o pedido pela plataforma, {entrega}.",
].join("\n\n");

type TemplateValues = Record<string, string>;

export function renderBancaAboutTemplate(template: string, values: TemplateValues): string {
  const source =
    typeof template === "string" && template.trim()
      ? template
      : DEFAULT_BANCA_ABOUT_TEMPLATE;

  return source.replace(/\{([a-z_]+)\}/gi, (_match, rawKey) => {
    const key = String(rawKey || "").toLowerCase();
    const value = values[key];
    return typeof value === "string" ? value : "";
  });
}

