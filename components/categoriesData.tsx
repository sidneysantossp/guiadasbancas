// Deprecated: categorias estáticas foram migradas para o painel admin.
// Mantemos apenas a interface e um fallback vazio para desenvolvimento.

export interface Category {
  slug: string;
  name: string;
  count?: number;
  color?: string;
  icon?: JSX.Element;
  image?: string;
}

// Fallback vazio: use a API `/api/categories`. Se precisar de dados locais temporários,
// você pode popular este array em ambiente de desenvolvimento.
export const categories: Category[] = [];
