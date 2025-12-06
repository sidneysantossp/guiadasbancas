// Script para categorizar produtos de "Sem Categoria"
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIA_SEM_CATEGORIA = 'bbbbbbbb-0000-0000-0000-000000000001';

// IDs das categorias oficiais
const CATEGORIAS = {
  'Mangás & Gibis': '65ee5cc4-95ce-4ca2-90be-b4029c399c32',
  'HQs e Comics': '1e813114-e1bc-442d-96e4-2704910d157d',
  'Revistas': '2280aa3c-295f-4895-b435-b4aea18b6281',
  'Figurinhas': 'dc0d1fba-c640-46ac-aa90-9166c974e138',
  'Brinquedos': 'e86d119d-fb3f-440b-9b68-822537e0b1df',
  'Papelaria': 'ca52a693-33e7-4125-b8a8-ebb2bd83d9d8',
  'Informática': '9ede95c0-2c18-485b-8d66-91b54b77b1ab',
  'Acessórios': '8d9385bf-76d7-4d76-acd7-2c9c8908e89f',
  'Bebidas': 'c230ed83-b08a-4b7a-8f19-7c8230f36c86',
  'Bomboniere': '6337c11f-c5ab-4f4b-ab9c-73c754d6eaae',
  'Tabacaria': '94f06220-056d-4e90-8078-43d957ca430c',
  'Colecionáveis': 'db22edda-4ced-4325-b67f-7cf2099075b8',
  'Livros': '7e523ff1-5988-45ce-920d-a708da5d64c5',
  'Diversos': 'aaaaaaaa-0000-0000-0000-000000000001',
};

// Padrões de palavras-chave para cada categoria
const patterns = {
  'Mangás & Gibis': [
    // Títulos específicos de mangás
    'manga', 'naruto', 'one piece', 'dragon ball', 'boruto', 'jujutsu', 'demon slayer',
    'attack on titan', 'my hero', 'boku no', 'shingeki', 'bleach', 'death note',
    'fullmetal', 'hunter x', 'fairy tail', 'tokyo ghoul', 'sword art', 'chainsaw',
    'spy x', 'kaisen', 'kimetsu', 'akira', 'berserk', 'vagabond', 'vinland', 'jojo',
    'one punch', 'mob psycho', 'blue lock', 'haikyuu', 'slam dunk', 'kuroko',
    'captain tsubasa', 'saint seiya', 'cavaleiros', 'cdz', 'blue period', 'dandadan',
    'sono bisque', 'cosplayer', 'kemono jihen', 're: zero', 'cells at work',
    'oshi no ko', 'sakamoto days', 'dakaichi', 'toriko', 'yuuna', 'dark souls',
    'yomotsuhegui', 'planetes', 'night club', 'gancho', 'brigada', 'encapotados',
    // Padrões de formatação de mangás
    '[reb]', '[reb2]', 'ed. definitiva', '20th century', 'billy bat',
    // Editoras de mangá
    'jbc', 'newpop', 'panini manga',
  ],
  'HQs e Comics': [
    'marvel', 'dc comics', 'batman', 'superman', 'spider', 'homem-aranha',
    'vingadores', 'avengers', 'x-men', 'wolverine', 'deadpool', 'thor', 'hulk',
    'panini', 'hq', 'quadrinho', 'comic', 'graphic novel', 'conan', 'espada selvagem',
    'turma da monica', 'mauricio de sousa', 'cebolinha', 'cascao', 'magali',
    'chico bento', 'coringa', 'joker', 'star wars', 'rocky e groot', 'omnibus',
    'dc omnibus', 'dc vintage', 'spy vs spy', 'o coisa', 'msp', 'jovem diana',
    'azrael', 'deusa da vingança', 'casa estranha', 'ilha do terror', 'bd disney',
    'juventude de mickey', 'bela casa do lago', 'lança lendaria', 'escudo impenetravel',
    'essencia do medo', 'incontrolavel patrulha', 'destino',
  ],
  'Revistas': ['revista', 'edicao especial', 'edição especial', 'blister', 'env conmebol'],
  'Figurinhas': ['figurinha', 'album de figurinha', 'álbum de figurinha', 'sticker', 'copa do mundo', 'world cup', 'conmebol', 'libertadores', 'brasileirao', 'brasileirão'],
  'Brinquedos': ['brinquedo', 'toy', 'boneco', 'pelúcia', 'pelucia', 'lego', 'funko', 'action figure', 'miniatura', 'carro em metal', 'lança bolhas', 'bolhas de sabão', 'bloco de montar', 'guarda chuva'],
  'Papelaria': ['caderno', 'caneta', 'lápis', 'lapis', 'borracha', 'estojo', 'mochila', 'agenda', 'cola branca', 'pincel', 'marcador', 'carnê', 'carne', 'calculadora', 'régua', 'regua', 'tesoura', 'grampeador', 'clips', 'papel', 'bloco de notas'],
  'Informática': ['mouse', 'teclado', 'cabo', 'usb', 'pendrive', 'fone', 'headset', 'carregador', 'adaptador', 'hub', 'pilha', 'bateria', 'chip claro', 'chip vivo', 'chip tim', 'chip oi'],
  'Acessórios': ['capa', 'case', 'chaveiro', 'porta', 'suporte', 'organizador', 'bolsa', 'carteira', 'óculos', 'oculos'],
  'Bebidas': ['água', 'agua', 'suco', 'refrigerante', 'energético', 'energetico', 'café', 'cafe', 'chá', 'cha'],
  'Bomboniere': ['chocolate', 'bala', 'chiclete', 'pirulito', 'doce', 'bombom', 'goma', 'drops', 'pastilha', 'amendoim', 'paçoca', 'pacoca', 'biscoito', 'bolacha', 'wafer', 'cookie'],
  'Tabacaria': ['tabaco', 'cigarro', 'fumo', 'rapé', 'rape', 'isqueiro', 'seda', 'piteira', 'narguilé', 'narguile', 'essência de narguile', 'carvão', 'carvao'],
  'Colecionáveis': ['colecionavel', 'colecionável', 'card game', 'trading card', 'pokemon tcg', 'magic'],
};

async function categorizar() {
  console.log('🔍 Buscando produtos em Sem Categoria...\n');
  
  const { data: produtos, error } = await supabase
    .from('products')
    .select('id, name')
    .eq('category_id', CATEGORIA_SEM_CATEGORIA);
  
  if (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return;
  }
  
  console.log(`📦 Total de produtos em Sem Categoria: ${produtos?.length}\n`);
  
  const categorized = {};
  const uncategorized = [];
  
  produtos?.forEach(p => {
    const nameLower = p.name.toLowerCase();
    let found = false;
    
    // Ordem de prioridade: mais específico primeiro
    const orderedCategories = [
      'Figurinhas', 'Tabacaria', 'Bomboniere', 'Bebidas', 'Papelaria',
      'Informática', 'Brinquedos', 'Acessórios', 'Colecionáveis',
      'HQs e Comics', 'Mangás & Gibis', 'Revistas'
    ];
    
    for (const cat of orderedCategories) {
      const keywords = patterns[cat];
      if (!keywords) continue;
      
      for (const kw of keywords) {
        if (nameLower.includes(kw.toLowerCase())) {
          if (!categorized[cat]) categorized[cat] = [];
          categorized[cat].push({ id: p.id, name: p.name });
          found = true;
          break;
        }
      }
      if (found) break;
    }
    
    if (!found) uncategorized.push({ id: p.id, name: p.name });
  });
  
  // Mostrar resumo
  console.log('=== RESUMO DA CATEGORIZAÇÃO ===\n');
  let totalCategorizado = 0;
  for (const [cat, items] of Object.entries(categorized)) {
    console.log(`${cat}: ${items.length} produtos`);
    totalCategorizado += items.length;
  }
  console.log(`\n✅ Total categorizado: ${totalCategorizado}`);
  console.log(`❓ Não categorizados: ${uncategorized.length}`);
  
  if (uncategorized.length > 0) {
    console.log('\nExemplos não categorizados:');
    uncategorized.slice(0, 15).forEach(p => console.log(`  - ${p.name}`));
  }
  
  // Executar atualizações
  console.log('\n🔄 Atualizando categorias no banco...\n');
  
  for (const [catName, items] of Object.entries(categorized)) {
    const catId = CATEGORIAS[catName];
    if (!catId) {
      console.log(`⚠️  Categoria "${catName}" não tem ID definido, pulando...`);
      continue;
    }
    
    const ids = items.map(p => p.id);
    
    // Atualizar em lotes de 100
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100);
      const { error: updateError } = await supabase
        .from('products')
        .update({ category_id: catId })
        .in('id', batch);
      
      if (updateError) {
        console.error(`❌ Erro ao atualizar ${catName}:`, updateError.message);
      }
    }
    
    console.log(`✅ ${catName}: ${items.length} produtos atualizados`);
  }
  
  // Verificar resultado final
  const { count: remaining } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', CATEGORIA_SEM_CATEGORIA);
  
  console.log(`\n📊 Produtos restantes em Sem Categoria: ${remaining}`);
}

categorizar();
