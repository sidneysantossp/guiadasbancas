#!/usr/bin/env node

/**
 * Script para Garantir Categorias Essenciais
 * 
 * Verifica se as categorias essenciais para categorização automática
 * existem no banco. Se não existirem, as cria.
 * 
 * Uso:
 *   node scripts/garantir-categorias-essenciais.js [--aplicar]
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIAS_ESSENCIAIS = [
  {
    name: 'Tabaco e Cigarros',
    image: 'https://images.unsplash.com/photo-1572635148818-ef6fd45eb394?w=400',
    link: '/categoria/tabaco-e-cigarros',
    order: 1
  },
  {
    name: 'Bebidas Alcoólicas',
    image: 'https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=400',
    link: '/categoria/bebidas-alcoolicas',
    order: 2
  },
  {
    name: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400',
    link: '/categoria/bebidas',
    order: 3
  },
  {
    name: 'Snacks e Salgadinhos',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
    link: '/categoria/snacks-e-salgadinhos',
    order: 4
  },
  {
    name: 'Doces e Chocolates',
    image: 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=400',
    link: '/categoria/doces-e-chocolates',
    order: 5
  },
  {
    name: 'Mangás',
    image: 'https://images.unsplash.com/photo-1612178991541-b48cc8e92a4d?w=400',
    link: '/categoria/mangas',
    order: 6
  },
  {
    name: 'HQs e Comics',
    image: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400',
    link: '/categoria/hqs-e-comics',
    order: 7
  },
  {
    name: 'Graphic Novels',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    link: '/categoria/graphic-novels',
    order: 8
  },
  {
    name: 'Revistas',
    image: 'https://images.unsplash.com/photo-1587121677988-fafec9ae820a?w=400',
    link: '/categoria/revistas',
    order: 9
  },
  {
    name: 'Livros',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    link: '/categoria/livros',
    order: 10
  },
  {
    name: 'Cards e Colecionáveis',
    image: 'https://images.unsplash.com/photo-1626278664285-f796b9ee7806?w=400',
    link: '/categoria/cards-e-colec ionaveis',
    order: 11
  },
  {
    name: 'Álbuns de Figurinhas',
    image: 'https://images.unsplash.com/photo-1611250282059-f07d022e3c3f?w=400',
    link: '/categoria/albuns-de-figurinhas',
    order: 12
  },
  {
    name: 'Acessórios',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400',
    link: '/categoria/acessorios',
    order: 13
  },
  {
    name: 'Outros',
    image: 'https://images.unsplash.com/photo-1586864387634-51f8e303a5af?w=400',
    link: '/categoria/outros',
    order: 14
  }
];

async function main() {
  const args = process.argv.slice(2);
  const aplicar = args.includes('--aplicar');

  console.log('\n📂 GARANTIR CATEGORIAS ESSENCIAIS\n');
  console.log(`Modo: ${aplicar ? '✅ APLICAR' : '👁️  PREVIEW (use --aplicar para criar)'}\n`);

  // Buscar categorias existentes
  console.log('🔍 Verificando categorias existentes...\n');
  
  const { data: existingCategories, error } = await supabase
    .from('categories')
    .select('id, name');

  if (error) {
    console.error('❌ Erro ao buscar categorias:', error.message);
    return;
  }

  const existingNames = new Set(existingCategories.map(c => c.name.toLowerCase()));
  
  console.log(`✅ ${existingCategories.length} categorias existem no banco:\n`);
  existingCategories.forEach(c => console.log(`   ✓ ${c.name}`));

  // Verificar categorias faltantes
  const missing = CATEGORIAS_ESSENCIAIS.filter(
    cat => !existingNames.has(cat.name.toLowerCase())
  );

  if (missing.length === 0) {
    console.log('\n✅ Todas as categorias essenciais já existem!\n');
    return;
  }

  console.log(`\n⚠️  ${missing.length} categorias faltantes:\n`);
  missing.forEach(cat => console.log(`   ✗ ${cat.name}`));

  if (aplicar) {
    console.log('\n🚀 Criando categorias faltantes...\n');

    // Buscar a maior ordem atual
    const { data: maxOrderData } = await supabase
      .from('categories')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);

    let currentMaxOrder = maxOrderData?.[0]?.order || 0;

    let sucesso = 0;
    let erros = 0;

    for (const cat of missing) {
      const { error: createError } = await supabase
        .from('categories')
        .insert([{
          name: cat.name,
          image: cat.image,
          link: cat.link,
          active: true,
          order: ++currentMaxOrder,
          jornaleiro_status: 'all',
          jornaleiro_bancas: []
        }]);

      if (createError) {
        console.error(`   ❌ Erro ao criar "${cat.name}":`, createError.message);
        erros++;
      } else {
        console.log(`   ✅ Criada: ${cat.name}`);
        sucesso++;
      }
    }

    console.log(`\n✅ Concluído!`);
    console.log(`   Criadas: ${sucesso}`);
    console.log(`   Erros: ${erros}\n`);
  } else {
    console.log('\n💡 Para criar estas categorias, execute novamente com --aplicar\n');
  }
}

main().catch(console.error);
