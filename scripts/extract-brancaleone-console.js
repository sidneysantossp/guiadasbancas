/**
 * 🚀 EXTRATOR DE PRODUTOS BRANCALEONE - VERSÃO OTIMIZADA
 * 
 * INSTRUÇÕES:
 * 1. Abra: https://brancaleonepublicacoes.meuspedidos.com.br/
 * 2. Pressione F12 (DevTools)
 * 3. Vá na aba "Console"
 * 4. Cole TODO este código
 * 5. Pressione Enter
 * 6. Aguarde a extração
 * 7. Baixe os arquivos gerados
 */

console.clear();
console.log('%c🚀 EXTRATOR DE PRODUTOS BRANCALEONE', 'font-size: 20px; font-weight: bold; color: #ff5c00');
console.log('%c📋 Iniciando extração...', 'font-size: 14px; color: #666');

(async function() {
  
  // ========== CONFIGURAÇÕES ==========
  const SCROLL_DELAY = 100; // ms entre cada scroll
  const WAIT_AFTER_SCROLL = 3000; // ms para aguardar após scroll completo
  
  // ========== FUNÇÕES AUXILIARES ==========
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function autoScroll() {
    console.log('%c📜 Fazendo scroll para carregar todos os produtos...', 'color: #0066cc');
    
    let lastHeight = 0;
    let currentHeight = document.body.scrollHeight;
    let attempts = 0;
    const maxAttempts = 50;
    
    while (lastHeight !== currentHeight && attempts < maxAttempts) {
      lastHeight = currentHeight;
      window.scrollTo(0, document.body.scrollHeight);
      await sleep(SCROLL_DELAY);
      currentHeight = document.body.scrollHeight;
      attempts++;
      
      if (attempts % 10 === 0) {
        console.log(`   Scroll ${attempts}/${maxAttempts}...`);
      }
    }
    
    console.log(`%c✅ Scroll completo! Aguardando ${WAIT_AFTER_SCROLL}ms...`, 'color: #00cc00');
    await sleep(WAIT_AFTER_SCROLL);
  }
  
  function extractText(element, selectors) {
    if (!element) return '';
    for (const selector of selectors) {
      const el = element.querySelector(selector);
      if (el?.textContent?.trim()) {
        return el.textContent.trim();
      }
    }
    return '';
  }
  
  function extractImage(element) {
    if (!element) return '';
    const img = element.querySelector('img');
    if (!img) return '';
    
    // Tenta diferentes atributos de imagem
    return img.src || 
           img.getAttribute('data-src') || 
           img.getAttribute('data-lazy-src') ||
           img.getAttribute('srcset')?.split(' ')[0] || 
           '';
  }
  
  function cleanPrice(priceText) {
    if (!priceText) return '';
    // Remove tudo exceto números, vírgula e ponto
    return priceText.replace(/[^\d,\.]/g, '').trim();
  }
  
  // ========== EXTRAÇÃO ==========
  
  await autoScroll();
  
  console.log('%c🔍 Extraindo dados dos produtos...', 'color: #0066cc; font-weight: bold');
  
  const products = [];
  
  // Seletores comuns em sites Mercos/E-commerce
  const possibleSelectors = [
    'article',
    '[class*="product-card"]',
    '[class*="ProductCard"]',
    '[class*="product-item"]',
    '[class*="ProductItem"]',
    '[data-testid*="product"]',
    '[class*="card"]',
    '.product',
    '.item'
  ];
  
  let productElements = [];
  let usedSelector = '';
  
  // Tenta encontrar produtos com diferentes seletores
  for (const selector of possibleSelectors) {
    productElements = Array.from(document.querySelectorAll(selector));
    if (productElements.length > 5) { // Pelo menos 5 elementos
      usedSelector = selector;
      console.log(`%c✅ Encontrados ${productElements.length} elementos com: ${selector}`, 'color: #00cc00');
      break;
    }
  }
  
  if (productElements.length === 0) {
    console.error('%c❌ ERRO: Nenhum produto encontrado!', 'color: #cc0000; font-weight: bold');
    console.log('%c💡 DICA: Inspecione um produto na página e veja a estrutura HTML', 'color: #ff9900');
    console.log('%c   Depois ajuste os seletores no código', 'color: #ff9900');
    return;
  }
  
  // Seletores para extrair dados
  const titleSelectors = ['h1', 'h2', 'h3', 'h4', '[class*="title"]', '[class*="name"]', '[class*="produto"]'];
  const priceSelectors = ['[class*="price"]', '[class*="valor"]', '[class*="preco"]', 'strong', 'b'];
  const codeSelectors = ['[class*="code"]', '[class*="codigo"]', '[class*="sku"]', '[class*="ref"]', 'small', 'span'];
  const descSelectors = ['[class*="description"]', '[class*="descricao"]', 'p'];
  
  console.log(`%c📦 Processando ${productElements.length} produtos...`, 'color: #0066cc');
  
  productElements.forEach((element, index) => {
    try {
      const title = extractText(element, titleSelectors);
      const price = extractText(element, priceSelectors);
      const code = extractText(element, codeSelectors);
      const description = extractText(element, descSelectors);
      const image = extractImage(element);
      
      // Só adiciona se tiver pelo menos título ou imagem
      if (title || image) {
        products.push({
          id: index + 1,
          code: code || `PROD-${String(index + 1).padStart(5, '0')}`,
          title: title || 'Produto sem título',
          description: description || '',
          price: cleanPrice(price) || 'Consulte',
          price_raw: price,
          image: image,
          image_thumb: image ? image.replace(/\/\d+x\d+\//, '/300x300/') : '',
          source_url: window.location.href,
          extracted_at: new Date().toISOString(),
          selector_used: usedSelector
        });
      }
      
      // Log de progresso
      if ((index + 1) % 50 === 0) {
        console.log(`   Processados: ${index + 1}/${productElements.length}`);
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao processar produto ${index}:`, error.message);
    }
  });
  
  console.log(`%c✅ ${products.length} produtos extraídos com sucesso!`, 'color: #00cc00; font-weight: bold; font-size: 16px');
  
  // ========== PREVIEW ==========
  
  if (products.length > 0) {
    console.log('\n%c📦 PREVIEW DOS PRIMEIROS 3 PRODUTOS:', 'font-size: 14px; font-weight: bold; color: #0066cc');
    console.table(products.slice(0, 3).map(p => ({
      Código: p.code,
      Título: p.title.substring(0, 40) + '...',
      Preço: p.price,
      'Tem Imagem': p.image ? '✅' : '❌'
    })));
  }
  
  // ========== ESTATÍSTICAS ==========
  
  const stats = {
    total: products.length,
    com_imagem: products.filter(p => p.image).length,
    com_preco: products.filter(p => p.price && p.price !== 'Consulte').length,
    com_codigo: products.filter(p => p.code && !p.code.startsWith('PROD-')).length,
    com_descricao: products.filter(p => p.description).length
  };
  
  console.log('\n%c📊 ESTATÍSTICAS:', 'font-size: 14px; font-weight: bold; color: #0066cc');
  console.table(stats);
  
  // ========== DOWNLOAD JSON ==========
  
  const jsonData = JSON.stringify(products, null, 2);
  const jsonBlob = new Blob([jsonData], { type: 'application/json' });
  const jsonUrl = URL.createObjectURL(jsonBlob);
  const jsonLink = document.createElement('a');
  jsonLink.href = jsonUrl;
  jsonLink.download = `brancaleone-products-${Date.now()}.json`;
  document.body.appendChild(jsonLink);
  jsonLink.click();
  document.body.removeChild(jsonLink);
  URL.revokeObjectURL(jsonUrl);
  
  console.log('%c💾 Arquivo JSON baixado!', 'color: #00cc00; font-weight: bold');
  
  // ========== DOWNLOAD CSV ==========
  
  const csvHeaders = ['id', 'code', 'title', 'description', 'price', 'image', 'source_url'];
  const csvRows = products.map(p => [
    p.id,
    `"${(p.code || '').replace(/"/g, '""')}"`,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    `"${(p.price || '').replace(/"/g, '""')}"`,
    `"${(p.image || '').replace(/"/g, '""')}"`,
    `"${(p.source_url || '').replace(/"/g, '""')}"`
  ]);
  
  const csvContent = [csvHeaders.join(','), ...csvRows.map(r => r.join(','))].join('\n');
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvBlob);
  const csvLink = document.createElement('a');
  csvLink.href = csvUrl;
  csvLink.download = `brancaleone-products-${Date.now()}.csv`;
  document.body.appendChild(csvLink);
  csvLink.click();
  document.body.removeChild(csvLink);
  URL.revokeObjectURL(csvUrl);
  
  console.log('%c💾 Arquivo CSV baixado!', 'color: #00cc00; font-weight: bold');
  
  // ========== FINALIZAÇÃO ==========
  
  console.log('\n%c✅ EXTRAÇÃO CONCLUÍDA COM SUCESSO!', 'font-size: 18px; font-weight: bold; color: #00cc00; background: #f0f0f0; padding: 10px');
  console.log('%c📁 Verifique seus downloads:', 'font-size: 14px; color: #666');
  console.log(`   - brancaleone-products-${Date.now()}.json`);
  console.log(`   - brancaleone-products-${Date.now()}.csv`);
  console.log('\n%c🚀 Próximo passo: Importar os dados no banco!', 'font-size: 14px; font-weight: bold; color: #ff5c00');
  
  // Retornar produtos para inspeção
  window.brancaleoneProducts = products;
  console.log('\n%c💡 DICA: Os produtos estão salvos em window.brancaleoneProducts', 'color: #666');
  
  return products;
  
})().catch(error => {
  console.error('%c❌ ERRO NA EXTRAÇÃO:', 'color: #cc0000; font-weight: bold', error);
  console.log('%c💡 Tente recarregar a página e executar novamente', 'color: #ff9900');
});
