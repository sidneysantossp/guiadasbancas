require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 VERIFICANDO DADOS REAIS NO SUPABASE\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  try {
    // 1. Verificar bancas
    console.log('🏪 BANCAS:');
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, name, active, featured')
      .limit(10);
    
    if (bancasError) {
      console.error('❌ Erro:', bancasError);
    } else {
      console.log(`   Total: ${bancas?.length || 0}`);
      if (bancas && bancas.length > 0) {
        bancas.forEach(b => {
          console.log(`   - ${b.name} (${b.active ? 'ativa' : 'inativa'}, ${b.featured ? 'destaque' : 'normal'})`);
        });
      }
    }

    // 2. Verificar produtos
    console.log('\n📦 PRODUTOS:');
    const { data: produtos, error: produtosError } = await supabase
      .from('products')
      .select('id, name, price, active')
      .limit(10);
    
    if (produtosError) {
      console.error('❌ Erro:', produtosError);
    } else {
      console.log(`   Total: ${produtos?.length || 0}`);
      if (produtos && produtos.length > 0) {
        produtos.slice(0, 5).forEach(p => {
          console.log(`   - ${p.name} (R$ ${p.price}) ${p.active ? '✅' : '❌'}`);
        });
      }
    }

    // 3. Verificar categorias
    console.log('\n📂 CATEGORIAS:');
    const { data: categorias, error: categoriasError } = await supabase
      .from('categories')
      .select('id, name, active')
      .limit(10);
    
    if (categoriasError) {
      console.error('❌ Erro:', categoriasError);
    } else {
      console.log(`   Total: ${categorias?.length || 0}`);
      if (categorias && categorias.length > 0) {
        categorias.forEach(c => {
          console.log(`   - ${c.name} ${c.active ? '✅' : '❌'}`);
        });
      }
    }

    // 4. Verificar hero slides
    console.log('\n🎨 HERO SLIDES:');
    const { data: slides, error: slidesError } = await supabase
      .from('hero_slides')
      .select('id, title, active')
      .order('order', { ascending: true });
    
    if (slidesError) {
      console.error('❌ Erro:', slidesError);
    } else {
      console.log(`   Total: ${slides?.length || 0}`);
      if (slides && slides.length > 0) {
        slides.forEach(s => {
          console.log(`   - ${s.title.substring(0, 50)}... ${s.active ? '✅' : '❌'}`);
        });
      }
    }

    // 5. Verificar se há dados REAIS ou apenas DEFAULT
    console.log('\n\n🔍 ANÁLISE:');
    
    const temBancasReais = bancas && bancas.length > 0;
    const temProdutosReais = produtos && produtos.length > 0;
    const temCategoriasReais = categorias && categorias.length > 0;
    const temSlidesReais = slides && slides.length > 3; // Mais que os 3 default

    if (!temBancasReais && !temProdutosReais && !temCategoriasReais) {
      console.log('❌ PROBLEMA: Banco está VAZIO ou com apenas dados DEFAULT!');
      console.log('\n📋 POSSÍVEIS CAUSAS:');
      console.log('   1. Dados nunca foram migrados para o Supabase');
      console.log('   2. Tabelas foram limpas acidentalmente');
      console.log('   3. Conectando no projeto Supabase errado');
      console.log('   4. RLS bloqueando acesso aos dados');
    } else {
      console.log('✅ Há dados reais no banco!');
      console.log(`   Bancas: ${temBancasReais ? '✅' : '❌'}`);
      console.log(`   Produtos: ${temProdutosReais ? '✅' : '❌'}`);
      console.log(`   Categorias: ${temCategoriasReais ? '✅' : '❌'}`);
      console.log(`   Slides customizados: ${temSlidesReais ? '✅' : '❌'}`);
    }

    // 6. Verificar projeto Supabase
    console.log('\n\n🔗 PROJETO SUPABASE:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Projeto ID: ${supabaseUrl.split('.')[0].split('//')[1]}`);

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

checkData();
