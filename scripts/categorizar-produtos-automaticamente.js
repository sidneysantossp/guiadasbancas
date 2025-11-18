#!/usr/bin/env node

/**
 * Script de Categorização Automática de Produtos
 * 
 * Este script associa produtos às categorias corretas baseado em palavras-chave
 * nos nomes dos produtos. Útil para:
 * - Preparar o catálogo para homologação da Mercos
 * - Melhorar a experiência de busca nas páginas das bancas
 * - Organizar produtos de distribuidores
 * 
 * Uso:
 *   node scripts/categorizar-produtos-automaticamente.js [--distribuidor=ID] [--aplicar] [--limit=100]
 * 
 * Opções:
 *   --distribuidor=ID   Categorizar apenas produtos de um distribuidor específico
 *   --aplicar          Aplicar as mudanças (sem esta flag, apenas preview)
 *   --limit=N          Limitar a N produtos (padrão: todos)
 *   --categoria=NOME   Filtrar apenas produtos que devem ir para uma categoria específica
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Importar regras de categorização
const CATEGORY_RULES = [
  {
    name: 'Tabaco e Cigarros',
    keywords: [
      'CIGARRO', 'CIGARROS', 'TABACO', 'MAÇO', 'MARLBORO', 'CAMEL', 'DUNHILL',
      'LUCKY STRIKE', 'PALL MALL', 'FREE', 'L&M', 'WINSTON', 'DERBY', 'EIGHT',
      'HOLLYWOOD', 'MINISTER', 'KENT', 'CHESTERFIELD', 'VICEROY', 'CHARUTARIA',
      'CHARUTO', 'FUMO', 'TABACARIA'
    ],
    priority: 15
  },
  {
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
  {
    name: 'Bebidas',
    keywords: [
      'ÁGUA', 'AGUA', 'MINERAL', 'CRYSTAL', 'BONAFONT', 'LINDOYA', 'PUREZA',
      'REFRIGERANTE', 'COCA-COLA', 'COCA COLA', 'PEPSI', 'GUARANÁ', 'GUARANA',
      'FANTA', 'SPRITE', 'KUAT', 'DOLLY', 'SUKITA', 'SCHWEPPES', 'SODA',
      'SUCO', 'NÉCTAR', 'NECTAR', 'DEL VALLE', 'ADES', 'TANG', 'FRESH',
      'CHÁ', 'CHA', 'LIPTON', 'MATTE LEÃO', 'MATTE LEAO', 'LEÃO', 'LEAO',
      'ENERGÉTICO', 'ENERGETICO', 'RED BULL', 'MONSTER', 'TNT', 'FUSION',
      'GATORADE', 'POWERADE', 'ISOTÔNICO', 'ISOTONICO', 'H2OH', 'ÁGUA DE COCO',
      'AGUA DE COCO', 'SOCOCO', 'KERO COCO', 'LEITE', 'NINHO', 'PARMALAT',
      'YAKULT', 'ACTIMEL', 'IOGURTE', 'ACHOCOLATADO', 'TODDYNHO', 'NESCAU'
    ],
    priority: 13
  },
  {
    name: 'Snacks e Salgadinhos',
    keywords: [
      'SALGADINHO', 'CHIPS', 'RUFFLES', 'DORITOS', 'CHEETOS', 'FANDANGOS',
      'PRINGLES', 'ELMA CHIPS', 'TORCIDA', 'BACONZITOS', 'YOKITOS',
      'PIPOCA', 'AMENDOIM', 'CASTANHA', 'NOZES', 'MIX', 'PETISCO',
      'BISCOITO SALGADO', 'CREAM CRACKER', 'CLUB SOCIAL', 'TRAKINAS SALGADO',
      'SNACK', 'LANCHE'
    ],
    priority: 12
  },
  {
    name: 'Doces e Chocolates',
    keywords: [
      'CHOCOLATE', 'BOMBOM', 'BARRA DE CHOCOLATE', 'LACTA', 'NESTLÉ', 'NESTLE',
      'GAROTO', 'HERSHEYS', 'FERRERO', 'KINDER', 'M&M', 'SNICKERS', 'TWIX',
      'KIT KAT', 'KITKAT', 'LOLLO', 'BIS', 'PRESTÍGIO', 'PRESTIGIO', 'OURO BRANCO',
      'SONHO DE VALSA', 'SERENATA', 'ALPINO', 'DIAMANTE NEGRO', 'LAKA',
      'BALA', 'DROPS', '7BELO', 'HALLS', 'MENTE', 'MENTOS', 'TRIDENT',
      'CHICLETE', 'HORTELÃ', 'HORTELA', 'GOMA DE MASCAR',
      'PIRULITO', 'CHUPA CHUPS', 'POP ROCKS', 'FINI', 'DORI', 'DOCILE',
      'JUJUBA', 'GELATINA', 'PAÇOCA', 'PACOCA', 'PÉ DE MOLEQUE', 'PE DE MOLEQUE',
      'MARIA MOLE', 'MARSHMALLOW', 'BRIGADEIRO', 'BEIJINHO'
    ],
    priority: 11
  },
  {
    name: 'Mangás',
    keywords: [
      'SOLO LEVELING', 'TORIKO', 'NISEKOI', 'BLACK BUTLER', 'ATAQUE DOS TITÃS',
      'BOKU NO HERO', 'MY HERO ACADEMIA', 'ONE PIECE', 'NARUTO', 'BLEACH',
      'DRAGON BALL', 'TOKYO GHOUL', 'DEATH NOTE', 'CHAINSAW MAN', 'JUJUTSU KAISEN',
      'DEMON SLAYER', 'SPY X FAMILY', 'MANGA', 'MANGÁ'
    ],
    priority: 10
  },
  {
    name: 'Graphic Novels',
    keywords: [
      'GRAPHIC MSP', 'GRAPHIC NOVEL', 'ASTRONAUTA', 'BIDU', 'CHICO BENTO',
      'TURMA DA MÔNICA', 'TURMA DA MONICA', 'MÔNICA', 'MONICA', 'CEBOLINHA',
      'CASCÃO', 'CASCAO', 'MAGALI', 'ALMANAQUE', 'ALMANAQUE DO', 'ALMANAQUE DA',
      'PANINI KIDS', 'MAURICIO DE SOUSA', 'MSP', 'GIBI DA TURMA'
    ],
    priority: 10
  },
  {
    name: 'HQs e Comics',
    keywords: [
      'BATMAN', 'SUPERMAN', 'HOMEM-ARANHA', 'SPIDER-MAN', 'WOLVERINE',
      'X-MEN', 'VINGADORES', 'AVENGERS', 'DC', 'MARVEL', 'HQ', 'COMIC',
      'SPAWN', 'SURFISTA PRATEADO', 'SENTINELA', 'CORPORAÇÃO'
    ],
    priority: 9
  },
  {
    name: 'Cards e Colecionáveis',
    keywords: [
      'DECK', 'CARDS', 'CARD', 'ENVELOPE', 'BLISTER', 'STARTERPACK', 'FLOWPACK',
      'BRASILEIRÃO', 'LIBERTADORES', 'SELEÇÃO', 'FUTEBOL', 'CONMEBOL',
      'TRADING CARD', 'TCG', 'CCG', 'POKEMON', 'YU-GI-OH', 'MAGIC',
      'ENV ', 'ENVELOPES', 'LUCCAS NETO', 'STITCH'
    ],
    priority: 8
  },
  {
    name: 'Brinquedos',
    keywords: [
      'MINIATURA', 'MINIATURAS', 'BONECO', 'BONECA', 'CARRINHO', 'CARRO',
      'CAMINHÃO', 'ESCAVADEIRA', 'GUINDASTE', 'TRATOR', 'CAMINHAO',
      'BRINQUEDO', 'TOY', 'ACTION FIGURE', 'FUNKO', 'PELÚCIA', 'PELUCIA'
    ],
    priority: 7
  },
  {
    name: 'Revistas',
    keywords: ['REVISTA', 'MAGAZINE'],
    priority: 8
  },
  {
    name: 'Livros',
    keywords: ['LIVRO', 'LIV.', 'ROMANCE', 'FICÇÃO'],
    priority: 7
  }
];

function autoCategorizeProduto(productName) {
  if (!productName) return null;
  
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

async function main() {
  const args = process.argv.slice(2);
  const distribuidorId = args.find(a => a.startsWith('--distribuidor='))?.split('=')[1];
  const aplicar = args.includes('--aplicar');
  const limit = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1] || '0');
  const categoriaFiltro = args.find(a => a.startsWith('--categoria='))?.split('=')[1];

  console.log('\n🏷️  CATEGORIZAÇÃO AUTOMÁTICA DE PRODUTOS\n');
  console.log(`Modo: ${aplicar ? '✅ APLICAR MUDANÇAS' : '👁️  PREVIEW (use --aplicar para aplicar)'}`);
  if (distribuidorId) console.log(`Distribuidor: ${distribuidorId}`);
  if (limit > 0) console.log(`Limite: ${limit} produtos`);
  if (categoriaFiltro) console.log(`Filtro de categoria: ${categoriaFiltro}`);
  console.log('');

  // 1. Buscar categorias existentes
  console.log('📂 Buscando categorias...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name');

  if (catError) {
    console.error('❌ Erro ao buscar categorias:', catError.message);
    return;
  }

  console.log(`✅ ${categories.length} categorias encontradas`);
  
  const categoryMap = new Map(categories.map(c => [c.name.toLowerCase(), c.id]));
  
  // Mostrar categorias disponíveis
  console.log('\n📋 Categorias disponíveis:');
  categories.forEach(c => console.log(`   - ${c.name}`));

  // 2. Buscar produtos
  console.log('\n📦 Buscando produtos...');
  let query = supabase
    .from('products')
    .select('id, name, category_id, categories(name), distribuidor_id')
    .not('distribuidor_id', 'is', null)
    .eq('active', true);

  if (distribuidorId) {
    query = query.eq('distribuidor_id', distribuidorId);
  }

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data: products, error: prodError } = await query;

  if (prodError) {
    console.error('❌ Erro ao buscar produtos:', prodError.message);
    return;
  }

  console.log(`✅ ${products.length} produtos encontrados`);

  // 3. Categorizar produtos
  console.log('\n🔍 Analisando produtos...\n');
  
  const updates = [];
  const stats = {
    total: products.length,
    comMudanca: 0,
    semMudanca: 0,
    semCategoria: 0,
    porCategoria: {}
  };

  products.forEach(product => {
    const suggestedCategory = autoCategorizeProduto(product.name);
    const currentCategory = product.categories?.name || null;
    
    if (!suggestedCategory) {
      stats.semCategoria++;
      return;
    }

    // Filtrar por categoria se especificado
    if (categoriaFiltro && suggestedCategory.toLowerCase() !== categoriaFiltro.toLowerCase()) {
      return;
    }

    const categoryId = categoryMap.get(suggestedCategory.toLowerCase());
    
    if (!categoryId) {
      console.warn(`⚠️  Categoria "${suggestedCategory}" não encontrada no banco`);
      stats.semCategoria++;
      return;
    }

    if (product.category_id === categoryId) {
      stats.semMudanca++;
      return;
    }

    stats.comMudanca++;
    stats.porCategoria[suggestedCategory] = (stats.porCategoria[suggestedCategory] || 0) + 1;

    updates.push({
      id: product.id,
      name: product.name,
      currentCategory,
      suggestedCategory,
      categoryId
    });
  });

  // 4. Mostrar preview
  console.log('📊 ESTATÍSTICAS\n');
  console.log(`Total de produtos:        ${stats.total}`);
  console.log(`Com mudança:              ${stats.comMudanca} ✏️`);
  console.log(`Sem mudança necessária:   ${stats.semMudanca} ✓`);
  console.log(`Sem categoria sugerida:   ${stats.semCategoria} ⚠️`);
  
  if (Object.keys(stats.porCategoria).length > 0) {
    console.log('\n📊 Produtos por categoria:');
    Object.entries(stats.porCategoria)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count}`);
      });
  }

  if (updates.length > 0) {
    console.log(`\n📝 PREVIEW DAS MUDANÇAS (primeiros 20):\n`);
    updates.slice(0, 20).forEach(u => {
      console.log(`${u.name.slice(0, 50).padEnd(50)} | ${(u.currentCategory || 'SEM CATEGORIA').padEnd(20)} → ${u.suggestedCategory}`);
    });

    if (updates.length > 20) {
      console.log(`\n... e mais ${updates.length - 20} produtos\n`);
    }

    // 5. Aplicar mudanças
    if (aplicar) {
      console.log('\n🚀 Aplicando mudanças...\n');
      
      let sucesso = 0;
      let erros = 0;
      
      const BATCH_SIZE = 50;
      for (let i = 0; i < updates.length; i += BATCH_SIZE) {
        const batch = updates.slice(i, i + BATCH_SIZE);
        
        for (const update of batch) {
          const { error } = await supabase
            .from('products')
            .update({ category_id: update.categoryId, updated_at: new Date().toISOString() })
            .eq('id', update.id);

          if (error) {
            console.error(`❌ Erro ao atualizar ${update.name}:`, error.message);
            erros++;
          } else {
            sucesso++;
          }
        }
        
        console.log(`Progresso: ${Math.min(i + BATCH_SIZE, updates.length)}/${updates.length}`);
      }

      console.log(`\n✅ Concluído!`);
      console.log(`   Sucesso: ${sucesso}`);
      console.log(`   Erros: ${erros}`);
    } else {
      console.log('\n💡 Para aplicar estas mudanças, execute novamente com --aplicar');
    }
  } else {
    console.log('\n✅ Nenhuma mudança necessária!');
  }

  console.log('\n✨ Concluído!\n');
}

main().catch(console.error);
