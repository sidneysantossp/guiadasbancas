#!/usr/bin/env node

/**
 * 🚀 EXTRATOR DE PRODUTOS BRANCALEONE - NODE.JS
 * 
 * INSTALAÇÃO:
 * npm install puppeteer
 * 
 * USO:
 * node scripts/extract-brancaleone-node.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CATALOG_URL = 'https://brancaleonepublicacoes.meuspedidos.com.br/';

console.log('🚀 Iniciando extração de produtos Brancaleone...\n');

async function extractProducts() {
  let browser;
  
  try {
    console.log('🌐 Abrindo navegador...');
    browser = await puppeteer.launch({
      headless: false, // Mostra o navegador
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    console.log('📄 Acessando catálogo...');
    await page.goto(CATALOG_URL, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    
    console.log('⏳ Aguardando carregamento inicial (5s)...');
    await page.waitForTimeout(5000);
    
    console.log('📜 Fazendo scroll para carregar todos os produtos...');
    await autoScroll(page);
    
    console.log('⏳ Aguardando produtos carregarem (3s)...');
    await page.waitForTimeout(3000);
    
    console.log('🔍 Extraindo dados dos produtos...\n');
    
    const products = await page.evaluate(() => {
      const items = [];
      
      // Seletores comuns em sites Mercos
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
      
      // Tenta encontrar produtos
      for (const selector of possibleSelectors) {
        productElements = Array.from(document.querySelectorAll(selector));
        if (productElements.length > 5) {
          usedSelector = selector;
          console.log(`Encontrados ${productElements.length} elementos com: ${selector}`);
          break;
        }
      }
      
      if (productElements.length === 0) {
        return { error: 'Nenhum produto encontrado', products: [] };
      }
      
      // Funções auxiliares
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
        return img.src || 
               img.getAttribute('data-src') || 
               img.getAttribute('data-lazy-src') ||
               img.getAttribute('srcset')?.split(' ')[0] || 
               '';
      }
      
      function cleanPrice(priceText) {
        if (!priceText) return '';
        return priceText.replace(/[^\d,\.]/g, '').trim();
      }
      
      // Seletores para dados
      const titleSelectors = ['h1', 'h2', 'h3', 'h4', '[class*="title"]', '[class*="name"]'];
      const priceSelectors = ['[class*="price"]', '[class*="valor"]', '[class*="preco"]', 'strong', 'b'];
      const codeSelectors = ['[class*="code"]', '[class*="codigo"]', '[class*="sku"]', '[class*="ref"]'];
      const descSelectors = ['[class*="description"]', '[class*="descricao"]', 'p'];
      
      // Extrair produtos
      productElements.forEach((element, index) => {
        try {
          const title = extractText(element, titleSelectors);
          const price = extractText(element, priceSelectors);
          const code = extractText(element, codeSelectors);
          const description = extractText(element, descSelectors);
          const image = extractImage(element);
          
          if (title || image) {
            items.push({
              id: index + 1,
              code: code || `PROD-${String(index + 1).padStart(5, '0')}`,
              title: title || 'Produto sem título',
              description: description || '',
              price: cleanPrice(price) || 'Consulte',
              price_raw: price,
              image: image,
              source_url: window.location.href,
              extracted_at: new Date().toISOString(),
              selector_used: usedSelector
            });
          }
        } catch (error) {
          console.warn(`Erro ao processar produto ${index}:`, error.message);
        }
      });
      
      return { products: items, selector: usedSelector };
    });
    
    if (products.error) {
      console.error('❌ ERRO:', products.error);
      await browser.close();
      return;
    }
    
    const { products: extractedProducts, selector } = products;
    
    console.log(`✅ ${extractedProducts.length} produtos extraídos com sucesso!`);
    console.log(`📌 Seletor usado: ${selector}\n`);
    
    // Estatísticas
    const stats = {
      total: extractedProducts.length,
      com_imagem: extractedProducts.filter(p => p.image).length,
      com_preco: extractedProducts.filter(p => p.price && p.price !== 'Consulte').length,
      com_codigo: extractedProducts.filter(p => p.code && !p.code.startsWith('PROD-')).length,
      com_descricao: extractedProducts.filter(p => p.description).length
    };
    
    console.log('📊 ESTATÍSTICAS:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Com imagem: ${stats.com_imagem}`);
    console.log(`   Com preço: ${stats.com_preco}`);
    console.log(`   Com código: ${stats.com_codigo}`);
    console.log(`   Com descrição: ${stats.com_descricao}\n`);
    
    // Preview
    console.log('📦 PREVIEW DOS PRIMEIROS 3 PRODUTOS:');
    extractedProducts.slice(0, 3).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.title.substring(0, 50)}...`);
      console.log(`   Código: ${p.code}`);
      console.log(`   Preço: ${p.price}`);
      console.log(`   Imagem: ${p.image ? '✅' : '❌'}`);
    });
    
    // Salvar JSON
    const timestamp = Date.now();
    const jsonPath = path.join(__dirname, `../brancaleone-products-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(extractedProducts, null, 2));
    console.log(`\n💾 JSON salvo: ${path.basename(jsonPath)}`);
    
    // Salvar CSV
    const csvPath = path.join(__dirname, `../brancaleone-products-${timestamp}.csv`);
    const csv = convertToCSV(extractedProducts);
    fs.writeFileSync(csvPath, csv);
    console.log(`💾 CSV salvo: ${path.basename(csvPath)}`);
    
    console.log('\n✅ EXTRAÇÃO CONCLUÍDA COM SUCESSO!\n');
    
    await browser.close();
    
  } catch (error) {
    console.error('\n❌ ERRO NA EXTRAÇÃO:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
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
extractProducts();
