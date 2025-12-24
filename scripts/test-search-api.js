const fetch = require('node-fetch');

async function testSearchAPI() {
  console.log('🔍 Testando API de busca de produtos...\n');

  try {
    const searchTerm = 'bebidas';
    const url = `http://localhost:3000/api/products/most-searched?search=${encodeURIComponent(searchTerm)}&limit=20`;
    
    console.log('URL:', url);
    console.log('Buscando por:', searchTerm);
    console.log('');

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro na API:', data);
      return;
    }

    console.log('✅ Resposta da API:');
    console.log('Total de produtos:', data.data?.length || 0);
    console.log('');

    if (data.data && data.data.length > 0) {
      console.log('📦 Primeiros 3 produtos:');
      data.data.slice(0, 3).forEach((p, i) => {
        console.log(`\n${i + 1}. ${p.name}`);
        console.log(`   category_id: ${p.category_id || 'null'}`);
        console.log(`   category: "${p.category || ''}"`);
        console.log(`   banca: ${p.banca?.name || 'N/A'}`);
      });

      console.log('\n📊 Categorias encontradas:');
      const categories = new Set(data.data.map(p => p.category).filter(Boolean));
      console.log(Array.from(categories));

      console.log('\n🔍 Produtos SEM categoria:');
      const semCategoria = data.data.filter(p => !p.category || p.category === '');
      console.log(`Total: ${semCategoria.length}`);
      if (semCategoria.length > 0) {
        semCategoria.slice(0, 3).forEach(p => {
          console.log(`   - ${p.name} (category_id: ${p.category_id})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testSearchAPI();
