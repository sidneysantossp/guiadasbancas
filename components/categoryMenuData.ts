export interface SubCategory {
  name: string;
  slug: string;
  icon?: string;
}

export interface MainCategory {
  name: string;
  slug: string;
  icon: string;
  subcategories: SubCategory[];
}

export const categoryMenu: MainCategory[] = [
  {
    name: "Bebidas",
    slug: "bebidas",
    icon: "🍺",
    subcategories: [
      { name: "Cerveja", slug: "cerveja" },
      { name: "Refrigerante", slug: "refrigerante" },
      { name: "Energético", slug: "energetico" },
      { name: "Água", slug: "agua" },
      { name: "Suco", slug: "suco" },
      { name: "Destilados", slug: "destilados" },
      { name: "Vinho", slug: "vinho" },
      { name: "Café", slug: "cafe" },
      { name: "Chá", slug: "cha" },
    ],
  },
  {
    name: "Tabacaria",
    slug: "cigarros",
    icon: "🚬",
    subcategories: [
      { name: "Cigarros", slug: "cigarros" },
      { name: "Charutos", slug: "charutos" },
      { name: "Tabaco", slug: "tabaco" },
      { name: "Essências", slug: "essencias" },
      { name: "Narguilé", slug: "narguile" },
      { name: "Seda e Papel", slug: "seda-papel" },
      { name: "Isqueiros", slug: "isqueiros" },
    ],
  },
  {
    name: "Panini",
    slug: "panini",
    icon: "⚽",
    subcategories: [
      { name: "Figurinhas", slug: "figurinhas" },
      { name: "Álbuns", slug: "albuns" },
      { name: "Cards Colecionáveis", slug: "cards-colecao" },
      { name: "Kits e Pacotes", slug: "kits-pacotes" },
    ],
  },
  {
    name: "HQs & Mangás",
    slug: "quadrinhos",
    icon: "💥",
    subcategories: [
      { name: "Quadrinhos", slug: "quadrinhos" },
      { name: "Mangás", slug: "mangas" },
      { name: "Graphic Novels", slug: "graphic-novels" },
      { name: "Marvel", slug: "marvel" },
      { name: "DC Comics", slug: "dc-comics" },
      { name: "Independentes", slug: "independentes" },
    ],
  },
  {
    name: "Revistas",
    slug: "revistas",
    icon: "📰",
    subcategories: [
      { name: "Atualidades", slug: "atualidades" },
      { name: "Moda e Beleza", slug: "moda-beleza" },
      { name: "Automóveis", slug: "automoveis" },
      { name: "Esportes", slug: "esportes" },
      { name: "Tecnologia", slug: "tecnologia" },
      { name: "Coleções", slug: "colecoes" },
      { name: "Especiais", slug: "especiais" },
    ],
  },
  {
    name: "Jornais",
    slug: "jornais",
    icon: "📄",
    subcategories: [
      { name: "Diários", slug: "diarios" },
      { name: "Esportivos", slug: "esportivos" },
      { name: "Econômicos", slug: "economicos" },
      { name: "Regionais", slug: "regionais" },
    ],
  },
  {
    name: "Livros",
    slug: "livros",
    icon: "📚",
    subcategories: [
      { name: "Romance", slug: "romance" },
      { name: "Ficção", slug: "ficcao" },
      { name: "Infantil", slug: "infantil" },
      { name: "Autoajuda", slug: "autoajuda" },
      { name: "Educação", slug: "educacao" },
      { name: "Religião", slug: "religiao" },
    ],
  },
  {
    name: "Snacks & Doces",
    slug: "snacks",
    icon: "🍫",
    subcategories: [
      { name: "Chocolates", slug: "chocolates" },
      { name: "Balas e Chicletes", slug: "balas-chicletes" },
      { name: "Salgadinhos", slug: "salgadinhos" },
      { name: "Biscoitos", slug: "biscoitos" },
      { name: "Amendoins e Castanhas", slug: "amendoins-castanhas" },
    ],
  },
  {
    name: "Papelaria",
    slug: "papelaria",
    icon: "✏️",
    subcategories: [
      { name: "Canetas", slug: "canetas" },
      { name: "Cadernos", slug: "cadernos" },
      { name: "Material Escolar", slug: "material-escolar" },
      { name: "Adesivos", slug: "adesivos" },
      { name: "Cartões", slug: "cartoes" },
    ],
  },
  {
    name: "Jogos & Cards",
    slug: "jogos",
    icon: "🎮",
    subcategories: [
      { name: "Pokémon TCG", slug: "pokemon-tcg" },
      { name: "Yu-Gi-Oh!", slug: "yugioh" },
      { name: "Magic", slug: "magic" },
      { name: "Board Games", slug: "board-games" },
      { name: "Quebra-Cabeças", slug: "quebra-cabecas" },
    ],
  },
  {
    name: "Brinquedos",
    slug: "brinquedos",
    icon: "🧸",
    subcategories: [
      { name: "Miniaturas", slug: "miniaturas" },
      { name: "Pelúcias", slug: "pelucias" },
      { name: "Colecionáveis", slug: "colecionaveis" },
      { name: "Educativos", slug: "educativos" },
    ],
  },
  {
    name: "Presentes",
    slug: "presentes",
    icon: "🎁",
    subcategories: [
      { name: "Utilidades", slug: "utilidades" },
      { name: "Decoração", slug: "decoracao" },
      { name: "Canecas e Copos", slug: "canecas-copos" },
      { name: "Chaveiros", slug: "chaveiros" },
    ],
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    icon: "🎒",
    subcategories: [
      { name: "Bolsas e Mochilas", slug: "bolsas-mochilas" },
      { name: "Óculos", slug: "oculos" },
      { name: "Relógios", slug: "relogios" },
      { name: "Capas de Celular", slug: "capas-celular" },
    ],
  },
];
