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
  // Tabaco e Cigarros (prioridade máxima para evitar confusão)
  {
    id: 'tabaco',
    name: 'Tabaco e Cigarros',
    keywords: [
      'CIGARRO', 'CIGARROS', 'TABACO', 'MAÇO', 'MARLBORO', 'CAMEL', 'DUNHILL',
      'LUCKY STRIKE', 'PALL MALL', 'FREE', 'L&M', 'WINSTON', 'DERBY', 'EIGHT',
      'HOLLYWOOD', 'MINISTER', 'KENT', 'CHESTERFIELD', 'VICEROY', 'CHARUTARIA',
      'CHARUTO', 'FUMO', 'TABACARIA'
    ],
    priority: 15
  },
  
  // Bebidas Alcoólicas
  {
    id: 'bebidas-alcoolicas',
    name: 'Bebidas Alcoólicas',
    keywords: [
      'CERVEJA', 'BRAHMA', 'SKOL', 'HEINEKEN', 'BUDWEISER', 'CORONA', 'STELLA',
      'ANTARCTICA', 'ITAIPAVA', 'AMSTEL', 'ORIGINAL', 'BOHEMIA', 'EISENBAHN',
      'VINHO', 'VODKA', 'WHISKY', 'WHISKEY', 'GIN', 'RUM', 'CACHAÇA', 'CACHACA',
      'CATUABA', 'ENERGÉTICO ALCÓOLICO', 'ENERGETICO ALCOOLICO', 'SMIRNOFF ICE',
      'JACK DANIELS', 'JOHNNIE WALKER', 'RED LABEL', 'BLACK LABEL', 'ABSOLUT',
      'APEROL', 'CAMPARI', 'LICOR'
    ],
    priority: 14
  },
  
  // Bebidas Não Alcoólicas
  {
    id: 'bebidas',
    name: 'Bebidas',
    keywords: [
      // Água
      'ÁGUA', 'AGUA', 'MINERAL', 'CRYSTAL', 'BONAFONT', 'LINDOYA', 'PUREZA',
      'COM GÁS', 'COM GAS', 'SEM GÁS', 'SEM GAS', 'GASOSA', 'GASEIFICADA',
      // Refrigerantes
      'REFRIGERANTE', 'REFRI', 'COCA-COLA', 'COCA COLA', 'PEPSI', 'GUARANÁ', 'GUARANA',
      'FANTA', 'SPRITE', 'KUAT', 'DOLLY', 'SUKITA', 'SCHWEPPES', 'SODA',
      'ANTARCTICA', 'LIMONADA', 'LARANJA', 'UVA', 'SEM AÇUCAR', 'SEM ACUCAR', 'ZERO',
      // Sucos
      'SUCO', 'NÉCTAR', 'NECTAR', 'DEL VALLE', 'ADES', 'TANG', 'FRESH',
      // Chás
      'CHÁ', 'CHA', 'LIPTON', 'MATTE LEÃO', 'MATTE LEAO', 'LEÃO', 'LEAO',
      // Energéticos
      'ENERGÉTICO', 'ENERGETICO', 'RED BULL', 'MONSTER', 'TNT', 'FUSION',
      'GUARAVITON', 'ENERGY', 'MELANCIA', 'TROPICAL', 'SUGAR FREE', 'MANGO LOCO',
      'GREEN', 'GINSENG', 'AÇAI', 'ACAI',
      // Isotônicos
      'GATORADE', 'POWERADE', 'ISOTÔNICO', 'ISOTONICO', 'H2OH',
      // Água de coco
      'ÁGUA DE COCO', 'AGUA DE COCO', 'SOCOCO', 'KERO COCO',
      // Leite e derivados
      'LEITE', 'NINHO', 'PARMALAT', 'YAKULT', 'ACTIMEL', 'IOGURTE', 
      'ACHOCOLATADO', 'TODDYNHO', 'NESCAU'
    ],
    priority: 13
  },
  
  // Snacks Salgados
  {
    id: 'snacks',
    name: 'Snacks e Salgadinhos',
    keywords: [
      'SALGADINHO', 'CHIPS', 'RUFFLES', 'DORITOS', 'CHEETOS', 'FANDANGOS',
      'PRINGLES', 'ELMA CHIPS', 'TORCIDA', 'BACONZITOS', 'YOKITOS',
      'PIPOCA', 'AMENDOIM', 'CASTANHA', 'NOZES', 'MIX', 'PETISCO',
      'BISCOITO SALGADO', 'CREAM CRACKER', 'CLUB SOCIAL', 'TRAKINAS SALGADO',
      'SNACK', 'LANCHE', 'PAÇOCA', 'PACOCA', 'PACOQUITA', 'OVINHO'
    ],
    priority: 12
  },
  
  // Doces e Chocolates
  {
    id: 'doces',
    name: 'Doces e Chocolates',
    keywords: [
      'CHOCOLATE', 'BOMBOM', 'BARRA DE CHOCOLATE', 'LACTA', 'NESTLÉ', 'NESTLE',
      'GAROTO', 'HERSHEYS', 'FERRERO', 'KINDER', 'M&M', 'SNICKERS', 'TWIX',
      'KIT KAT', 'KITKAT', 'LOLLO', 'BIS', 'PRESTÍGIO', 'PRESTIGIO', 'OURO BRANCO',
      'SONHO DE VALSA', 'SERENATA', 'ALPINO', 'DIAMANTE NEGRO', 'LAKA',
      'BALA DURA', 'BALA MASTIGÁVEL', 'BALA GEL', 'BALA DE GOMA', 'BALA BUTTER',
      'DROPS', '7BELO', 'HALLS', 'MENTE', 'MENTOS', 'TRIDENT',
      'CHICLETE', 'HORTELÃ', 'HORTELA', 'GOMA DE MASCAR', 'BUZZY',
      'PIRULITO', 'CHUPA CHUPS', 'POP ROCKS', 'FINI', 'DORI', 'DOCILE', 'SKITTLES',
      'JUJUBA', 'GELATINA', 'PÉ DE MOLEQUE', 'PE DE MOLEQUE',
      'MARIA MOLE', 'MARSHMALLOW', 'BRIGADEIRO', 'BEIJINHO', 'FRUITTELLA',
      'BUTTER TOFFEES', 'ARCOR'
    ],
    priority: 11
  },
  
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
      '[REB]', 'MANGA', 'MANGÁ', 'CHAINSAW MAN', 'JUJUTSU KAISEN', 'DEMON SLAYER',
      'KIMETSU NO YAIBA', 'SPY X FAMILY', 'FRIEREN'
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
      'CASCÃO', 'CASCAO', 'MAGALI', 'ALMANAQUE', 'ALMANAQUE DO', 'ALMANAQUE DA',
      'PANINI KIDS', 'MAURICIO DE SOUSA', 'MSP', 'GIBI DA TURMA'
    ],
    priority: 9
  },
  
  // Cards e Colecionáveis
  {
    id: 'cards',
    name: 'Cards e Colecionáveis',
    keywords: [
      'DECK', 'CARDS', 'CARD', 'ENVELOPE', 'BLISTER', 'STARTERPACK', 'FLOWPACK',
      'BRASILEIRÃO', 'LIBERTADORES', 'SELEÇÃO', 'FUTEBOL', 'CONMEBOL',
      'TRADING CARD', 'TCG', 'CCG', 'POKEMON', 'YU-GI-OH', 'MAGIC',
      'ENV ', 'ENVELOPES', 'LUCCAS NETO', 'STITCH'
    ],
    priority: 8
  },
  
  // Álbuns de Figurinhas
  {
    id: 'albuns',
    name: 'Álbuns de Figurinhas',
    keywords: [
      'ALBUM', 'ÁLBUM', 'FIGURINHAS', 'STICKER', 'STK', 'SUPER MARIO',
      'PAW PATROL', 'SQUISHMALLOWS', 'HELLO KITTY', 'ALBUM DE FIGURINHAS',
      'CADERNETA', 'CADERNO DE FIGURINHAS', 'COLEÇÃO DE FIGURINHAS'
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
  
  // Brinquedos
  {
    id: 'brinquedos',
    name: 'Brinquedos',
    keywords: [
      'MINIATURA', 'MINIATURAS', 'BONECO', 'BONECA', 'CARRINHO', 'CARRO',
      'CAMINHÃO', 'ESCAVADEIRA', 'GUINDASTE', 'TRATOR', 'CAMINHAO',
      'BRINQUEDO', 'TOY', 'ACTION FIGURE', 'FUNKO', 'PELÚCIA', 'PELUCIA'
    ],
    priority: 4
  },
  
  // Acessórios (sem balão que deve ir para Outros)
  {
    id: 'acessorios',
    name: 'Acessórios',
    keywords: [
      'CAMA PET', 'ACESSÓRIO', 'MOCHILA', 'ESTOJO',
      'NECESSAIRE', 'CANECA', 'COPO', 'GARRAFA'
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
