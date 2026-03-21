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
    slug: "panini",
    name: "Panini",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop",
    count: 180
  },
  {
    slug: "bebidas",
    name: "Bebidas",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop",
    count: 80
  },
  {
    slug: "bomboniere",
    name: "Bomboniere",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    count: 90
  },
  {
    slug: "brinquedos",
    name: "Brinquedos",
    image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop",
    count: 100
  },
  {
    slug: "eletronicos",
    name: "Eletronicos",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=400&fit=crop",
    count: 60
  },
  {
    slug: "informatica",
    name: "Informática",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=400&fit=crop",
    count: 110
  },
  {
    slug: "papelaria",
    name: "Papelaria",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=400&fit=crop",
    count: 150
  },
  {
    slug: "tabacaria",
    name: "Tabacaria",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop",
    count: 40
  },
  {
    slug: "telefonia",
    name: "Telefonia",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    count: 110
  }
];
