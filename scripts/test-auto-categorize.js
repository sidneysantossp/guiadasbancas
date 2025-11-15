// Script para testar categorização automática
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Regras de categorização (copiadas do auto-categorize.ts)
const CATEGORY_RULES = [
  {
    id: 'mangas',
    name: 'Mangás',
    keywords: [
      'SOLO LEVELING', 'TORIKO', 'NISEKOI', 'BLACK BUTLER', 'ATAQUE DOS TITÃS',
      'BEAST COMPLEX', 'BOKU NO HERO', 'MY HERO ACADEMIA', 'ONE PIECE', 'NARUTO',
      'BLEACH', 'DRAGON BALL', 'TOKYO GHOUL', 'DEATH NOTE', 'FULLMETAL',
      '[REB]', 'MANGA', 'MANGÁ'
    ],
    priority: 10
  },
  {
    id: 'graphic-novels',
    name: 'Graphic Novels',
    keywords: [
      'GRAPHIC MSP', 'GRAPHIC NOVEL', 'ASTRONAUTA', 'BIDU', 'CHICO BENTO',
      'TURMA DA MÔNICA', 'MÔNICA', 'CEBOLINHA'
    ],
    priority: 9
  },
  {
    id: 'cards',
    name: 'Cards e Colecionáveis',
    keywords: [
      'DECK', 'CARDS', 'ENVELOPE', 'BLISTER', 'STARTERPACK', 'FLOWPACK',
      'BRASILEIRÃO', 'LIBERTADORES', 'SELEÇÃO', 'FUTEBOL'
    ],
    priority: 8
  },
  {
    id: 'albuns',
    name: 'Álbuns de Figurinhas',
    keywords: [
      'ALBUM', 'ÁLBUM', 'FIGURINHAS', 'STICKER', 'STK', 'SUPER MARIO',
      'PAW PATROL', 'SQUISHMALLOWS', 'HELLO KITTY'
    ],
    priority: 7
  },
  {
    id: 'revistas',
    name: 'Revistas',
    keywords: [
      'MAGAZINE', 'REVISTA', 'DETETIVES DO PRÉDIO AZUL MAGAZINE'
    ],
    priority: 6
  },
  {
    id: 'hqs',
    name: 'HQs e Comics',
    keywords: [
      'BATMAN', 'SUPERMAN', 'HOMEM-ARANHA', 'SPIDER-MAN', 'WOLVERINE',
      'X-MEN', 'VINGADORES', 'AVENGERS', 'CORPORAÇÃO BATMAN', 'DC', 'MARVEL'
    ],
    priority: 5
  },
  {
    id: 'livros',
    name: 'Livros',
    keywords: [
      'LIVRO', 'LIV.', 'ILUSTRADO', 'CAPA DURA', 'ROMANCE', 'FICÇÃO'
    ],
    priority: 4
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    keywords: [
      'CAMA PET', 'ACESSÓRIO', 'KIT', 'CONJUNTO'
    ],
    priority: 3
  }
];

function autoCategorizeProduto(productName) {
  if (!productName) return 'Outros';
  
  const nameUpper = productName.toUpperCase();
  const sortedRules = [...CATEGORY_RULES].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    for (const keyword of rule.keywords) {
      if (nameUpper.includes(keyword.toUpperCase())) {
        return rule.name;
      }
    }
  }
  
  return 'Outros';
}

async function testAutoCategorize() {
  console.log('🔍 Testando categorização automática...\n');
  
  // Buscar 50 produtos aleatórios
  const { data: products } = await supabase
    .from('products')
    .select('id, name, category_id, categories(name)')
    .not('distribuidor_id', 'is', null)
    .eq('active', true)
    .limit(50);

  if (!products || products.length === 0) {
    console.log('❌ Nenhum produto encontrado');
    return;
  }

  console.log(`✅ ${products.length} produtos encontrados\n`);
  console.log('📊 PREVIEW DA CATEGORIZAÇÃO:\n');

  const stats = {};
  let willChange = 0;

  products.forEach(p => {
    const suggested = autoCategorizeProduto(p.name);
    const current = p.categories?.name || 'Sem categoria';
    const change = suggested !== current;
    
    if (change) willChange++;
    
    stats[suggested] = (stats[suggested] || 0) + 1;
    
    console.log(`${change ? '🔄' : '✅'} ${p.name.substring(0, 50)}`);
    console.log(`   Atual: ${current}`);
    console.log(`   Sugerida: ${suggested}`);
    console.log('');
  });

  console.log('='.repeat(80));
  console.log('\n📈 ESTATÍSTICAS:\n');
  console.log(`   Total de produtos: ${products.length}`);
  console.log(`   Serão alterados: ${willChange} (${((willChange/products.length)*100).toFixed(1)}%)`);
  console.log(`   Permanecerão iguais: ${products.length - willChange}\n`);
  
  console.log('📊 DISTRIBUIÇÃO POR CATEGORIA:\n');
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const percent = ((count / products.length) * 100).toFixed(1);
      console.log(`   ${cat}: ${count} (${percent}%)`);
    });
}

testAutoCategorize().catch(console.error);
