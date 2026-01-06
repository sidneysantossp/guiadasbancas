const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const DISTRIBUIDOR_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

// Mapeamento das categorias Mercos para nomes (baseado na imagem do usuário)
const MERCOS_CATEGORIES = {
  3584481: { nome: 'Planet Manga', plataforma: 'Mangás' },
  3584475: { nome: 'Marvel Comics', plataforma: 'HQs e Comics' },
  3584473: { nome: 'DC Comics', plataforma: 'HQs e Comics' },
  3584476: { nome: 'Maurício de Sousa Produções', plataforma: 'HQs e Comics' },
  3584478: { nome: 'Panini Comics', plataforma: 'HQs e Comics' },
  3599981: { nome: 'Colecionáveis', plataforma: 'Colecionáveis' },
  3584474: { nome: 'Disney Comics', plataforma: 'HQs e Comics' },
  3584480: { nome: 'Conan', plataforma: 'HQs e Comics' },
  3584477: { nome: 'Panini Books', plataforma: 'Livros' },
  3584479: { nome: 'Panini Magazines', plataforma: 'Revistas' },
  4362338: { nome: 'Panini Partwork', plataforma: 'Colecionáveis' },
};

async function main() {
  console.log('=== SINCRONIZAÇÃO DE CATEGORIAS ===\n');

  // PASSO 1: Buscar categorias da plataforma
  console.log('PASSO 1: Buscando categorias da plataforma...');
  const { data: platformCats, error: platErr } = await supabase
    .from('categories')
    .select('id, name')
    .eq('active', true);

  if (platErr) {
    console.error('Erro ao buscar categorias:', platErr.message);
    return;
  }

  const platformMap = new Map();
  platformCats.forEach(c => platformMap.set(c.name, c.id));
  console.log(`  ✓ ${platformCats.length} categorias encontradas\n`);

  // PASSO 2: Sincronizar categorias Mercos na tabela distribuidor_categories
  console.log('PASSO 2: Sincronizando categorias Mercos...');
  
  for (const [mercosId, info] of Object.entries(MERCOS_CATEGORIES)) {
    const { data: existing } = await supabase
      .from('distribuidor_categories')
      .select('id')
      .eq('distribuidor_id', DISTRIBUIDOR_ID)
      .eq('mercos_id', parseInt(mercosId))
      .single();

    if (!existing) {
      const { error } = await supabase
        .from('distribuidor_categories')
        .insert({
          distribuidor_id: DISTRIBUIDOR_ID,
          mercos_id: parseInt(mercosId),
          nome: info.nome,
          ativo: true,
        });
      
      if (error) {
        console.log(`  ✗ Erro ao inserir ${info.nome}: ${error.message}`);
      } else {
        console.log(`  ✓ Inserida: ${info.nome} (${mercosId})`);
      }
    } else {
      console.log(`  - Já existe: ${info.nome} (${mercosId})`);
    }
  }

  // PASSO 3: Criar mapeamento mercos_id -> category_id da plataforma
  console.log('\nPASSO 3: Criando mapeamento para atualização...');
  
  const mapping = {};
  for (const [mercosId, info] of Object.entries(MERCOS_CATEGORIES)) {
    const platformCatId = platformMap.get(info.plataforma);
    if (platformCatId) {
      mapping[mercosId] = platformCatId;
      console.log(`  ${info.nome} -> ${info.plataforma} (${platformCatId})`);
    } else {
      console.log(`  ✗ Categoria não encontrada: ${info.plataforma}`);
    }
  }

  // PASSO 4: Buscar todos os produtos do distribuidor
  console.log('\nPASSO 4: Buscando produtos para atualizar...');
  
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, mercos_id, name')
    .eq('distribuidor_id', DISTRIBUIDOR_ID);

  if (prodErr) {
    console.error('Erro ao buscar produtos:', prodErr.message);
    return;
  }
  console.log(`  ✓ ${products.length} produtos encontrados`);

  // Buscar categoria_id de cada produto da API Mercos
  console.log('\nPASSO 5: Buscando categoria_id dos produtos na API Mercos...');
  
  const { data: dist } = await supabase
    .from('distribuidores')
    .select('application_token, company_token')
    .eq('id', DISTRIBUIDOR_ID)
    .single();

  // Buscar todos os produtos da Mercos para pegar categoria_id
  let allMercosProducts = [];
  let alteradoApos = '2000-01-01T00:00:00';
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(
      `https://app.mercos.com/api/v1/produtos?limit=500&alterado_apos=${alteradoApos}&order_by=ultima_alteracao&order_direction=asc`,
      {
        headers: {
          'ApplicationToken': dist.application_token,
          'CompanyToken': dist.company_token,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const limitou = response.headers.get('meuspedidos_limitou_registros');
    const produtos = await response.json();
    
    if (!produtos.length) break;
    
    allMercosProducts.push(...produtos);
    alteradoApos = produtos[produtos.length - 1].ultima_alteracao;
    hasMore = limitou === '1';
    
    process.stdout.write(`\r  Buscados: ${allMercosProducts.length} produtos da Mercos`);
  }
  console.log('');

  // Criar mapa mercos_id -> categoria_id
  const mercosProductMap = new Map();
  allMercosProducts.forEach(p => {
    if (p.categoria_id) {
      mercosProductMap.set(p.id, p.categoria_id);
    }
  });
  console.log(`  ✓ ${mercosProductMap.size} produtos com categoria na Mercos`);

  // PASSO 6: Atualizar produtos em lotes
  console.log('\nPASSO 6: Atualizando produtos...');
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  // Agrupar por categoria para updates em batch
  const updatesByCategory = new Map();
  
  for (const product of products) {
    const mercosCatId = mercosProductMap.get(product.mercos_id);
    if (!mercosCatId) {
      skipped++;
      continue;
    }
    
    const platformCatId = mapping[mercosCatId];
    if (!platformCatId) {
      skipped++;
      continue;
    }
    
    if (!updatesByCategory.has(platformCatId)) {
      updatesByCategory.set(platformCatId, []);
    }
    updatesByCategory.get(platformCatId).push(product.id);
  }

  // Executar updates por categoria
  for (const [categoryId, productIds] of updatesByCategory) {
    // Update em lotes de 500
    for (let i = 0; i < productIds.length; i += 500) {
      const batch = productIds.slice(i, i + 500);
      const { error } = await supabase
        .from('products')
        .update({ category_id: categoryId })
        .in('id', batch);
      
      if (error) {
        console.log(`  ✗ Erro ao atualizar lote: ${error.message}`);
        errors += batch.length;
      } else {
        updated += batch.length;
      }
    }
    
    const catName = platformCats.find(c => c.id === categoryId)?.name || categoryId;
    console.log(`  ✓ ${updatesByCategory.get(categoryId).length} produtos -> ${catName}`);
  }

  console.log('\n=== RESULTADO ===');
  console.log(`Produtos atualizados: ${updated}`);
  console.log(`Produtos ignorados: ${skipped}`);
  console.log(`Erros: ${errors}`);

  // Verificar resultado
  console.log('\n=== VERIFICAÇÃO ===');
  const { data: stats } = await supabase
    .from('products')
    .select('category_id, categories(name)')
    .eq('distribuidor_id', DISTRIBUIDOR_ID)
    .not('category_id', 'is', null);

  const catStats = new Map();
  (stats || []).forEach(p => {
    const name = p.categories?.name || 'Sem nome';
    catStats.set(name, (catStats.get(name) || 0) + 1);
  });

  console.log('Produtos por categoria na plataforma:');
  catStats.forEach((count, name) => {
    console.log(`  ${name}: ${count} produtos`);
  });
}

main().catch(console.error);
