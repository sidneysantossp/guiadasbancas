/**
 * Sistema de Categorização Automática de Produtos
 * Baseado em palavras-chave e padrões no nome do produto
 */

export interface CategoryRule {
  id: string;
  name: string;
  keywords: string[];
  priority: number; // Maior prioridade = verificado primeiro
}

// Regras de categorização (ordenadas por prioridade)
export const CATEGORY_RULES: CategoryRule[] = [
  // Mangás e Quadrinhos
  {
    id: 'mangas',
    name: 'Mangás',
    keywords: [
      'SOLO LEVELING', 'TORIKO', 'NISEKOI', 'BLACK BUTLER', 'ATAQUE DOS TITÃS',
      'BEAST COMPLEX', 'BOKU NO HERO', 'MY HERO ACADEMIA', 'ONE PIECE', 'NARUTO',
      'BLEACH', 'DRAGON BALL', 'TOKYO GHOUL', 'DEATH NOTE', 'FULLMETAL',
      'GOLDEN KAMUY', 'BUNGO STRAY DOGS', 'RADIANT', 'FOOD WARS', 'MORIARTY',
      'POKEMON', 'AFTER GOD', 'MAGILUMIERE', 'CACANDO DRAGOES', 'CAÇANDO DRAGÕES',
      '[REB]', 'MANGA', 'MANGÁ'
    ],
    priority: 10
  },
  
  // Graphic Novels e Turma da Mônica
  {
    id: 'graphic-novels',
    name: 'Graphic Novels',
    keywords: [
      'GRAPHIC MSP', 'GRAPHIC NOVEL', 'ASTRONAUTA', 'BIDU', 'CHICO BENTO',
      'TURMA DA MÔNICA', 'TURMA DA MONICA', 'MÔNICA', 'MONICA', 'CEBOLINHA',
      'CASCÃO', 'CASCAO', 'MAGALI', 'ALMANAQUE'
    ],
    priority: 9
  },
  
  // Cards e Colecionáveis
  {
    id: 'cards',
    name: 'Cards e Colecionáveis',
    keywords: [
      'DECK', 'CARDS', 'ENVELOPE', 'BLISTER', 'STARTERPACK', 'FLOWPACK',
      'BRASILEIRÃO', 'LIBERTADORES', 'SELEÇÃO', 'FUTEBOL'
    ],
    priority: 8
  },
  
  // Álbuns de Figurinhas
  {
    id: 'albuns',
    name: 'Álbuns de Figurinhas',
    keywords: [
      'ALBUM', 'ÁLBUM', 'FIGURINHAS', 'STICKER', 'STK', 'SUPER MARIO',
      'PAW PATROL', 'SQUISHMALLOWS', 'HELLO KITTY'
    ],
    priority: 7
  },
  
  // Revistas e Magazines
  {
    id: 'revistas',
    name: 'Revistas',
    keywords: [
      'MAGAZINE', 'REVISTA', 'DETETIVES DO PRÉDIO AZUL MAGAZINE'
    ],
    priority: 6
  },
  
  // HQs e Comics
  {
    id: 'hqs',
    name: 'HQs e Comics',
    keywords: [
      'BATMAN', 'SUPERMAN', 'HOMEM-ARANHA', 'SPIDER-MAN', 'WOLVERINE',
      'X-MEN', 'VINGADORES', 'AVENGERS', 'CORPORAÇÃO BATMAN', 'DC', 'MARVEL',
      'ANIQUILACAO', 'ANIQUILAÇÃO', 'OMNIBUS', 'ALIEN'
    ],
    priority: 5
  },
  
  // Livros
  {
    id: 'livros',
    name: 'Livros',
    keywords: [
      'LIVRO', 'LIV.', 'ILUSTRADO', 'CAPA DURA', 'ROMANCE', 'FICÇÃO'
    ],
    priority: 4
  },
  
  // Acessórios e Outros
  {
    id: 'acessorios',
    name: 'Acessórios',
    keywords: [
      'CAMA PET', 'ACESSÓRIO', 'KIT', 'CONJUNTO'
    ],
    priority: 3
  }
];

/**
 * Categoriza um produto baseado em seu nome
 */
export function autoCategorizeProduto(productName: string): string | null {
  if (!productName) return null;
  
  const nameUpper = productName.toUpperCase();
  
  // Ordenar por prioridade (maior primeiro)
  const sortedRules = [...CATEGORY_RULES].sort((a, b) => b.priority - a.priority);
  
  // Encontrar primeira regra que corresponde
  for (const rule of sortedRules) {
    for (const keyword of rule.keywords) {
      if (nameUpper.includes(keyword.toUpperCase())) {
        return rule.name;
      }
    }
  }
  
  // Categoria padrão se nenhuma regra corresponder
  return 'Outros';
}

/**
 * Categoriza múltiplos produtos
 */
export function autoCategorizeProdutos(products: Array<{ id: string; name: string }>) {
  return products.map(product => ({
    ...product,
    suggested_category: autoCategorizeProduto(product.name),
    confidence: calculateConfidence(product.name)
  }));
}

/**
 * Calcula confiança da categorização (0-100)
 */
function calculateConfidence(productName: string): number {
  if (!productName) return 0;
  
  const nameUpper = productName.toUpperCase();
  let maxConfidence = 0;
  
  for (const rule of CATEGORY_RULES) {
    for (const keyword of rule.keywords) {
      if (nameUpper.includes(keyword.toUpperCase())) {
        // Confiança baseada no tamanho da keyword e prioridade da regra
        const keywordLength = keyword.length;
        const nameLength = productName.length;
        const matchRatio = keywordLength / nameLength;
        const confidence = Math.min(100, (matchRatio * 100) + (rule.priority * 5));
        
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
        }
      }
    }
  }
  
  return Math.round(maxConfidence);
}

/**
 * Obtém estatísticas de categorização
 */
export function getCategoriesStats(products: Array<{ name: string }>) {
  const stats: Record<string, number> = {};
  
  products.forEach(product => {
    const category = autoCategorizeProduto(product.name) || 'Outros';
    stats[category] = (stats[category] || 0) + 1;
  });
  
  return Object.entries(stats)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
