export type ShippingConfig = {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number; // em R$
  originCEP: string; // CEP de origem para estimativa
};

// Ajuste estes valores conforme a política da banca/jornaleiro
export const shippingConfig: ShippingConfig = {
  freeShippingEnabled: false,
  freeShippingThreshold: 120,
  originCEP: "01001-000", // Centro SP (exemplo)
};
