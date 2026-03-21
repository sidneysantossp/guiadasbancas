export interface FallbackSubCategory {
  name: string;
  slug: string;
  icon?: string;
}

export interface FallbackMainCategory {
  name: string;
  slug: string;
  icon: string;
  subcategories: FallbackSubCategory[];
}

export function normalizeCategoryText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const FALLBACK_CATEGORY_GROUPS: Record<string, string[]> = {
  Panini: [
    "Colecionáveis",
    "Conan",
    "DC Comics",
    "Disney",
    "Disney Comics",
    "Mangás",
    "Marvel",
    "Marvel Comics",
    "Maurício de Sousa Produções",
    "Panini Books",
    "Panini Comics",
    "Panini Magazines",
    "Panini Partwork",
    "Planet Manga",
  ],
  Bebidas: [
    "Bebidas",
    "Cerveja",
    "Refrigerante",
    "Energéticos",
    "Água",
    "Suco",
    "Isotônicos",
  ],
  Bomboniere: [
    "Balas e Drops",
    "Balas a Granel",
    "Biscoitos",
    "Chicletes",
    "Chocolates",
    "Doces",
    "Pirulitos",
    "Salgadinhos",
    "Snacks",
  ],
  Brinquedos: [
    "Blocos de Montar",
    "Bonecos",
    "Brinquedos",
    "Carrinhos",
    "Educativos",
    "Esportivo",
    "Livros Infantis",
    "Massinha",
    "Pelúcias",
  ],
  Cartas: [
    "Baralhos",
    "Baralhos e Cards",
    "Cards Colecionáveis",
    "Cards Pokémon",
    "Jogos Copag",
    "Jogos de Cartas",
  ],
  Diversos: [
    "Acessórios",
    "Acessórios Celular",
    "Adesivos Times",
    "Chaveiros",
    "Diversos",
    "Guarda-Chuvas",
    "Mochilas",
    "Outros",
    "Papelaria",
    "Utilidades",
    "Figurinhas",
  ],
  Eletronicos: [
    "Acessórios para eletrônicos",
    "Adaptadores",
    "Cabo",
    "Caixa de som",
    "Carregador com tomada",
    "Carregador Portátil",
    "Carregador veicular",
    "Eletrônicos",
    "Fones de Ouvido",
    "Pilhas",
  ],
  "Informática": ["Informática"],
  Papelaria: ["Adesivos", "Canetas", "Cadernos", "Material Escolar", "Papelaria"],
  "Pokémon": ["Cards Pokémon", "Fichários Pokémon"],
  Tabacaria: [
    "Boladores",
    "Carvão Narguile",
    "Charutos e Cigarrilhas",
    "Cigarros",
    "Essências",
    "Filtros",
    "Incensos",
    "Isqueiros",
    "Palheiros",
    "Piteiras",
    "Porta Cigarros",
    "Seda OCB",
    "Tabaco e Seda",
    "Tabacos Importados",
    "Trituradores",
  ],
  Telefonia: ["Telefonia", "Chip Pré", "Capinha Para Celular", "Acessórios Celular"],
};

export const FALLBACK_CATEGORY_GROUPS_BY_SLUG: Record<string, string[]> = Object.fromEntries(
  Object.entries(FALLBACK_CATEGORY_GROUPS).map(([name, subcategories]) => [slugify(name), [...subcategories]])
);

export const BRANCALEONE_ROOT_CATEGORY_ORDER = [
  "Colecionável",
  "Panini",
  "Panini Collections",
] as const;

export const BRANCALEONE_GROUPED_ROOTS = new Set(
  ["Panini"].map((name) => normalizeCategoryText(name))
);

export const BAMBINO_ROOT_CATEGORY_ORDER = [
  "Bebidas",
  "Bomboniere",
  "Brinquedos",
  "Cartas",
  "Descartáveis",
  "Diversos",
  "Eletronicos",
  "Guarda-chuva / capa de chuva",
  "Informática",
  "Jogos",
  "Miniaturas",
  "Papelaria",
  "PET SHOP",
  "Pilhas e baterias",
  "Pokémon",
  "Tabacaria",
  "Telefonia",
] as const;

export const BAMBINO_GROUPED_ROOTS = new Set(
  [
    "Bebidas",
    "Bomboniere",
    "Brinquedos",
    "Cartas",
    "Eletronicos",
    "Miniaturas",
    "Pokémon",
    "Tabacaria",
  ].map((name) => normalizeCategoryText(name))
);

const TOP_MENU_META: Array<{ name: string; slug: string; icon: string }> = [
  { name: "Panini", slug: "panini", icon: "⚽" },
  { name: "Bebidas", slug: "bebidas", icon: "🍺" },
  { name: "Bomboniere", slug: "bomboniere", icon: "🍫" },
  { name: "Brinquedos", slug: "brinquedos", icon: "🧸" },
  { name: "Eletronicos", slug: "eletronicos", icon: "🔌" },
  { name: "Informática", slug: "informatica", icon: "🔌" },
  { name: "Papelaria", slug: "papelaria", icon: "✏️" },
  { name: "Tabacaria", slug: "tabacaria", icon: "🚬" },
  { name: "Telefonia", slug: "telefonia", icon: "🔌" },
];

export const FALLBACK_TOP_CATEGORY_MENU: FallbackMainCategory[] = TOP_MENU_META.map((category) => ({
  ...category,
  subcategories: (FALLBACK_CATEGORY_GROUPS[category.name] || []).map((subcategory) => ({
    name: subcategory,
    slug: slugify(subcategory),
  })),
}));
