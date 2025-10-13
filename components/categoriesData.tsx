// Deprecated: categorias estáticas foram migradas para o painel admin.
// Mantemos apenas a interface e um fallback para desenvolvimento.

export interface Category {
  slug: string;
  name: string;
  count?: number;
  color?: string;
  icon?: JSX.Element;
  image?: string;
}

// Fallback: usado quando a API não está disponível
export const categories: Category[] = [
  {
    slug: "revistas",
    name: "Revistas",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop",
    count: 250
  },
  {
    slug: "jornais",
    name: "Jornais",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=400&fit=crop",
    count: 120
  },
  {
    slug: "quadrinhos",
    name: "Quadrinhos",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop",
    count: 180
  },
  {
    slug: "livros",
    name: "Livros",
    image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=400&fit=crop",
    count: 300
  },
  {
    slug: "papelaria",
    name: "Papelaria",
    image: "https://images.unsplash.com/photo-1517843418337-8c6f8a84d4c3?w=400&h=400&fit=crop",
    count: 150
  },
  {
    slug: "bebidas",
    name: "Bebidas",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop",
    count: 80
  },
  {
    slug: "snacks",
    name: "Snacks",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    count: 90
  },
  {
    slug: "cigarros",
    name: "Cigarros",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop",
    count: 40
  },
  {
    slug: "jogos",
    name: "Jogos & Cards",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
    count: 70
  },
  {
    slug: "brinquedos",
    name: "Brinquedos",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop",
    count: 100
  },
  {
    slug: "presentes",
    name: "Presentes",
    image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop",
    count: 60
  },
  {
    slug: "acessorios",
    name: "Acessórios",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    count: 110
  }
];
