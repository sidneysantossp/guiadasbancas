/**
 * Script para rodar no Console do Navegador (F12)
 * 
 * COMO USAR:
 * 1. Abra https://brancaleonepublicacoes.meuspedidos.com.br/
 * 2. Pressione F12 para abrir o DevTools
 * 3. Vá na aba "Console"
 * 4. Cole este código completo e pressione Enter
 * 5. Aguarde a extração
 * 6. Baixe o arquivo JSON gerado
 */

(async function extractProducts() {
  console.log('🚀 Iniciando extração de produtos...');
  
  // Scroll automático para carregar todos os produtos
  console.log('📜 Scrolling para carregar produtos...');
  await new Promise((resolve) => {
    let totalHeight = 0;
    const distance = 100;
    const timer = setInterval(() => {
      const scrollHeight = document.body.scrollHeight;
      window.scrollBy(0, distance);
      totalHeight += distance;

      if (totalHeight >= scrollHeight) {
        clearInterval(timer);
        setTimeout(resolve, 2000); // Aguarda 2s após scroll
      }
    }, 100);
  });
  
  console.log('🔍 Extraindo dados...');
  
  const products = [];
  
  // Tente diferentes seletores
  const selectors = [
    '[class*="product"]',
    '[class*="Product"]',
    '[class*="item"]',
    '[class*="card"]',
    '[data-testid*="product"]',
    'article',
    '.product-card',
    '.item-card'
  ];
  
  let productCards = [];
  for (const selector of selectors) {
    productCards = document.querySelectorAll(selector);
    if (productCards.length > 0) {
      console.log(`✅ Encontrado ${productCards.length} produtos com seletor: ${selector}`);
      break;
    }
  }
  
  if (productCards.length === 0) {
    console.error('❌ Nenhum produto encontrado. Inspecione a página e ajuste os seletores.');
    console.log('💡 Dica: Clique com botão direito em um produto → Inspecionar → Veja a estrutura HTML');
    return;
  }
  
  productCards.forEach((card, index) => {
    try {
      // Tente extrair título
      const titleSelectors = ['[class*="title"]', '[class*="name"]', 'h2', 'h3', 'h4', 'h5'];
      let title = '';
      for (const sel of titleSelectors) {
        const el = card.querySelector(sel);
        if (el?.textContent?.trim()) {
          title = el.textContent.trim();
          break;
        }
      }
      
      // Tente extrair preço
      const priceSelectors = ['[class*="price"]', '[class*="valor"]', '[class*="preco"]'];
      let price = '';
      for (const sel of priceSelectors) {
        const el = card.querySelector(sel);
        if (el?.textContent?.trim()) {
          price = el.textContent.trim();
          break;
        }
      }
      
      // Tente extrair código
      const codeSelectors = ['[class*="code"]', '[class*="codigo"]', '[class*="sku"]', '[class*="ref"]'];
      let code = '';
      for (const sel of codeSelectors) {
        const el = card.querySelector(sel);
        if (el?.textContent?.trim()) {
          code = el.textContent.trim();
          break;
        }
      }
      
      // Extrair imagem
      const img = card.querySelector('img');
      const image = img?.src || img?.getAttribute('data-src') || '';
      
      // Extrair descrição
      const descSelectors = ['[class*="description"]', '[class*="descricao"]', 'p'];
      let description = '';
      for (const sel of descSelectors) {
        const el = card.querySelector(sel);
        if (el?.textContent?.trim() && el.textContent.trim() !== title) {
          description = el.textContent.trim();
          break;
        }
      }
      
      if (title || image) {
        products.push({
          id: index + 1,
          code: code || `PROD-${String(index + 1).padStart(4, '0')}`,
          title: title || 'Produto sem título',
          description: description || '',
          price: price || 'Consulte',
          image: image,
          source_url: window.location.href,
          extracted_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Erro ao extrair produto ${index}:`, error);
    }
  });
  
  console.log(`✅ ${products.length} produtos extraídos!`);
  
  // Mostrar preview
  console.log('\n📦 Preview dos primeiros 3 produtos:');
  console.table(products.slice(0, 3));
  
  // Download JSON
  const dataStr = JSON.stringify(products, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `brancaleone-products-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('💾 Arquivo JSON baixado!');
  
  // Download CSV
  const csv = convertToCSV(products);
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(csvBlob);
  const csvLink = document.createElement('a');
  csvLink.href = csvUrl;
  csvLink.download = `brancaleone-products-${Date.now()}.csv`;
  document.body.appendChild(csvLink);
  csvLink.click();
  document.body.removeChild(csvLink);
  
  console.log('💾 Arquivo CSV baixado!');
  console.log('\n✅ Extração concluída! Verifique seus downloads.');
  
  return products;
  
  function convertToCSV(data) {
    const headers = ['id', 'code', 'title', 'description', 'price', 'image', 'source_url'];
    const rows = data.map(p => [
      p.id,
      `"${(p.code || '').replace(/"/g, '""')}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.description || '').replace(/"/g, '""')}"`,
      `"${(p.price || '').replace(/"/g, '""')}"`,
      `"${(p.image || '').replace(/"/g, '""')}"`,
      `"${(p.source_url || '').replace(/"/g, '""')}"`
    ]);
    
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
})();
