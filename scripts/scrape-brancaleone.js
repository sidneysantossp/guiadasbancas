/**
 * Script para extrair produtos do catálogo Brancaleone via Web Scraping
 * 
 * INSTALAÇÃO:
 * npm install puppeteer
 * 
 * USO:
 * node scripts/scrape-brancaleone.js
 * 
 * SAÍDA:
 * - brancaleone-products.json (dados completos)
 * - brancaleone-products.csv (para importar no Excel/Google Sheets)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const CATALOG_URL = 'https://brancaleonepublicacoes.meuspedidos.com.br/';

async function scrapeProducts() {
  console.log('🚀 Iniciando extração de produtos...');
  
  const browser = await puppeteer.launch({
    headless: false, // Mostra o navegador (útil para debug)
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  
  console.log('📄 Acessando catálogo...');
  await page.goto(CATALOG_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Aguardar o carregamento dos produtos (ajuste o seletor conforme necessário)
  console.log('⏳ Aguardando carregamento dos produtos...');
  await page.waitForTimeout(5000); // Aguarda 5 segundos para o React carregar
  
  // Scroll para carregar lazy loading
  console.log('📜 Scrolling para carregar todos os produtos...');
  await autoScroll(page);
  
  console.log('🔍 Extraindo dados dos produtos...');
  
  // Extrair produtos (ajuste os seletores conforme a estrutura do site)
  const products = await page.evaluate(() => {
    const items = [];
    
    // Tente diferentes seletores comuns em sites Mercos
    const productCards = document.querySelectorAll('[class*="product"], [class*="Product"], [class*="item"], [class*="card"]');
    
    productCards.forEach((card, index) => {
      try {
        // Extrair dados (ajuste conforme a estrutura real)
        const title = card.querySelector('[class*="title"], [class*="name"], h2, h3, h4')?.textContent?.trim();
        const price = card.querySelector('[class*="price"], [class*="valor"]')?.textContent?.trim();
        const code = card.querySelector('[class*="code"], [class*="codigo"], [class*="sku"]')?.textContent?.trim();
        const description = card.querySelector('[class*="description"], [class*="descricao"], p')?.textContent?.trim();
        const image = card.querySelector('img')?.src;
        
        if (title || image) {
          items.push({
            id: index + 1,
            title: title || 'Sem título',
            price: price || 'Consulte',
            code: code || `PROD-${index + 1}`,
            description: description || '',
            image: image || '',
            source_url: window.location.href
          });
        }
      } catch (error) {
        console.error('Erro ao extrair produto:', error);
      }
    });
    
    return items;
  });
  
  console.log(`✅ ${products.length} produtos encontrados!`);
  
  // Salvar JSON
  const jsonPath = 'brancaleone-products.json';
  fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
  console.log(`💾 Arquivo JSON salvo: ${jsonPath}`);
  
  // Salvar CSV
  const csvPath = 'brancaleone-products.csv';
  const csv = convertToCSV(products);
  fs.writeFileSync(csvPath, csv);
  console.log(`💾 Arquivo CSV salvo: ${csvPath}`);
  
  // Mostrar preview
  console.log('\n📦 Preview dos primeiros 3 produtos:');
  products.slice(0, 3).forEach(p => {
    console.log(`\n- ${p.title}`);
    console.log(`  Código: ${p.code}`);
    console.log(`  Preço: ${p.price}`);
    console.log(`  Imagem: ${p.image?.substring(0, 60)}...`);
  });
  
  await browser.close();
  console.log('\n✅ Extração concluída!');
  
  return products;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

function convertToCSV(products) {
  const headers = ['id', 'code', 'title', 'description', 'price', 'image', 'source_url'];
  const rows = products.map(p => [
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

// Executar
scrapeProducts().catch(console.error);
