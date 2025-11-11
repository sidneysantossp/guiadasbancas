const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testFullPagination() {
  try {
    console.log('🔍 Testando paginação completa da API Mercos...\n');
    
    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    const companyToken = '4b866744-a086-11f0-ada6-5e65486a6283';
    
    let allCategorias = [];
    let afterId = null;
    let hasMore = true;
    let pageCount = 0;
    const LIMIT = 100;

    console.log('🔄 Iniciando paginação completa...\n');

    while (hasMore && pageCount < 10) {
      pageCount++;
      
      // Construir endpoint
      let endpoint = `/categorias?limit=${LIMIT}&order_by=id&order_direction=asc`;
      if (afterId) {
        endpoint += `&after_id=${afterId}`;
      }
      
      console.log(`📄 Página ${pageCount} (after_id: ${afterId || 'início'})`);
      
      const url = `https://sandbox.mercos.com/api/v1${endpoint}`;
      const headers = {
        'ApplicationToken': SANDBOX_APP_TOKEN,
        'CompanyToken': companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.error(`❌ Erro na página ${pageCount}:`, response.status);
        break;
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      
      console.log(`   📦 Recebidas ${categoriasArray.length} categorias`);
      
      if (categoriasArray.length === 0) {
        console.log('   ✅ Nenhuma categoria retornada - fim da paginação');
        hasMore = false;
        break;
      }
      
      allCategorias = [...allCategorias, ...categoriasArray];

      // Mostrar algumas categorias desta página
      console.log('   📋 Categorias desta página:');
      categoriasArray.slice(0, 3).forEach((cat, index) => {
        console.log(`      ${index + 1}. ID: ${cat.id}, Nome: "${cat.nome}"`);
      });
      if (categoriasArray.length > 3) {
        console.log(`      ... e mais ${categoriasArray.length - 3} categorias`);
      }

      // Verificar se há mais páginas
      if (categoriasArray.length < LIMIT) {
        console.log('   ✅ Última página alcançada (menos que o limite)');
        hasMore = false;
      } else {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        afterId = ultimaCategoria.id;
        console.log(`   ➡️ Próxima página: after_id=${afterId}`);
      }

      console.log(''); // Linha em branco
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`📊 RESUMO FINAL:`);
    console.log(`   Total de páginas processadas: ${pageCount}`);
    console.log(`   Total de categorias encontradas: ${allCategorias.length}`);
    
    // Procurar pela categoria específica
    const targetCategory = allCategorias.find(cat => cat.nome && cat.nome.includes('411856508e34f9d'));
    
    if (targetCategory) {
      console.log('\n🎯 CATEGORIA "411856508e34f9d" ENCONTRADA:');
      console.log('='.repeat(50));
      console.log(`ID: ${targetCategory.id}`);
      console.log(`Nome: "${targetCategory.nome}"`);
      console.log(`Categoria Pai ID: ${targetCategory.categoria_pai_id}`);
      console.log('='.repeat(50));
    } else {
      console.log('\n❌ Categoria "411856508e34f9d" NÃO encontrada em nenhuma página');
      
      // Mostrar todas as categorias para debug
      console.log('\n📋 TODAS as categorias encontradas:');
      allCategorias.forEach((cat, index) => {
        console.log(`${index + 1}. ID: ${cat.id}, Nome: "${cat.nome}"`);
      });
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o teste
testFullPagination();
