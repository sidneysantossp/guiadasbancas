#!/usr/bin/env node

/**
 * 🚀 EXTRATOR COMPLETO DE PRODUTOS BRANCALEONE
 * 
 * Extrai TODOS os dados incluindo preços e códigos
 * clicando em cada produto individualmente
 * 
 * INSTALAÇÃO:
 * npm install puppeteer
 * 
 * USO:
 * node scripts/extract-brancaleone-full.js
 * 
 * OPÇÕES:
 * node scripts/extract-brancaleone-full.js --limit 10  (extrai apenas 10 produtos para teste)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CATALOG_URL = 'https://brancaleonepublicacoes.meuspedidos.com.br/';
const LIMIT = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1]) : null;

console.log('🚀 EXTRATOR COMPLETO - Brancaleone Publicações\n');
if (LIMIT) console.log(`⚠️  MODO TESTE: Extraindo apenas ${LIMIT} produtos\n`);

async function extractProducts() {
  let browser;
  
  try {
    console.log('🌐 Abrindo navegador...');
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    console.log('📄 Acessando catálogo...');
    await page.goto(CATALOG_URL, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    
    console.log('⏳ Aguardando carregamento (5s)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('📜 Fazendo scroll para carregar todos os produtos...');
    await autoScroll(page);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('🔍 Identificando produtos...\n');
    
    // Pegar URLs de todos os produtos
    const productLinks = await page.evaluate(() => {
      const links = [];
      const cards = document.querySelectorAll('[class*="card"] a, article a, [class*="product"] a');
      
      cards.forEach(link => {
        const href = link.href;
        if (href && href.includes('/produto/') && !links.includes(href)) {
          links.push(href);
        }
      });
      
      return links;
    });
    
    console.log(`✅ Encontrados ${productLinks.length} produtos únicos`);
    
    const productsToExtract = LIMIT ? productLinks.slice(0, LIMIT) : productLinks;
    console.log(`📦 Extraindo ${productsToExtract.length} produtos...\n`);
    
    const products = [];
    
    for (let i = 0; i < productsToExtract.length; i++) {
      const url = productsToExtract[i];
      
      try {
        console.log(`[${i + 1}/${productsToExtract.length}] Acessando produto...`);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const productData = await page.evaluate(() => {
          // Extrair dados da página do produto
          const data = {
            title: '',
            code: '',
            price: '',
            description: '',
            image: '',
            images: [],
            category: '',
            brand: ''
          };
          
          // Título
          const titleSelectors = ['h1', '[class*="title"]', '[class*="name"]'];
          for (const sel of titleSelectors) {
            const el = document.querySelector(sel);
            if (el?.textContent?.trim()) {
              data.title = el.textContent.trim();
              break;
            }
          }
          
          // Código/SKU
          const codeSelectors = [
            '[class*="code"]',
            '[class*="codigo"]',
            '[class*="sku"]',
            '[class*="ref"]',
            'small',
            'span'
          ];
          for (const sel of codeSelectors) {
            const el = document.querySelector(sel);
            const text = el?.textContent?.trim() || '';
            if (text && (text.includes('Código') || text.includes('SKU') || text.includes('Ref'))) {
              data.code = text.replace(/[^0-9A-Z-]/gi, '').trim();
              break;
            }
          }
          
          // Preço
          const priceSelectors = [
            '[class*="price"]',
            '[class*="valor"]',
            '[class*="preco"]',
            'strong',
            'b'
          ];
          for (const sel of priceSelectors) {
            const el = document.querySelector(sel);
            const text = el?.textContent?.trim() || '';
            if (text && (text.includes('R$') || text.includes(',') || /\d+/.test(text))) {
              data.price = text.trim();
              break;
            }
          }
          
          // Descrição
          const descSelectors = [
            '[class*="description"]',
            '[class*="descricao"]',
            '[class*="detail"]',
            'p'
          ];
          for (const sel of descSelectors) {
            const el = document.querySelector(sel);
            if (el?.textContent?.trim() && el.textContent.length > 20) {
              data.description = el.textContent.trim();
              break;
            }
          }
          
          // Imagens
          const images = document.querySelectorAll('img');
          images.forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (src && src.includes('arquivos.mercos.com')) {
              if (!data.image) data.image = src;
              if (!data.images.includes(src)) data.images.push(src);
            }
          });
          
          // Categoria
          const breadcrumb = document.querySelector('[class*="breadcrumb"]');
          if (breadcrumb) {
            data.category = breadcrumb.textContent.trim();
          }
          
          return data;
        });
        
        products.push({
          id: i + 1,
          code: productData.code || `PROD-${String(i + 1).padStart(5, '0')}`,
          title: productData.title || 'Sem título',
          description: productData.description || '',
          price: productData.price || 'Consulte',
          image: productData.image || '',
          images: productData.images || [],
          category: productData.category || '',
          brand: productData.brand || 'Brancaleone Publicações',
          url: url,
          extracted_at: new Date().toISOString()
        });
        
        console.log(`   ✅ ${productData.title?.substring(0, 50)}...`);
        
        // Pequeno delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ Erro: ${error.message}`);
      }
    }
    
    console.log(`\n✅ ${products.length} produtos extraídos com sucesso!\n`);
    
    // Estatísticas
    const stats = {
      total: products.length,
      com_imagem: products.filter(p => p.image).length,
      com_preco: products.filter(p => p.price && p.price !== 'Consulte').length,
      com_codigo: products.filter(p => p.code && !p.code.startsWith('PROD-')).length,
      com_descricao: products.filter(p => p.description && p.description.length > 20).length,
      com_multiplas_imagens: products.filter(p => p.images.length > 1).length
    };
    
    console.log('📊 ESTATÍSTICAS:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Com imagem: ${stats.com_imagem}`);
    console.log(`   Com preço: ${stats.com_preco}`);
    console.log(`   Com código: ${stats.com_codigo}`);
    console.log(`   Com descrição: ${stats.com_descricao}`);
    console.log(`   Com múltiplas imagens: ${stats.com_multiplas_imagens}\n`);
    
    // Preview
    console.log('📦 PREVIEW DOS PRIMEIROS 3 PRODUTOS:');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.title.substring(0, 60)}...`);
      console.log(`   Código: ${p.code}`);
      console.log(`   Preço: ${p.price}`);
      console.log(`   Imagens: ${p.images.length}`);
      console.log(`   Descrição: ${p.description ? '✅' : '❌'}`);
    });
    
    // Salvar arquivos
    const timestamp = Date.now();
    const jsonPath = path.join(__dirname, `../brancaleone-products-full-${timestamp}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
    console.log(`\n💾 JSON salvo: ${path.basename(jsonPath)}`);
    
    const csvPath = path.join(__dirname, `../brancaleone-products-full-${timestamp}.csv`);
    const csv = convertToCSV(products);
    fs.writeFileSync(csvPath, csv);
    console.log(`💾 CSV salvo: ${path.basename(csvPath)}`);
    
    // SQL para importar
    const sqlPath = path.join(__dirname, `../brancaleone-products-import-${timestamp}.sql`);
    const sql = generateSQL(products);
    fs.writeFileSync(sqlPath, sql);
    console.log(`💾 SQL salvo: ${path.basename(sqlPath)}`);
    
    console.log('\n✅ EXTRAÇÃO COMPLETA CONCLUÍDA!\n');
    
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
  const headers = ['id', 'code', 'title', 'description', 'price', 'image', 'category', 'url'];
  const rows = products.map(p => [
    p.id,
    `"${(p.code || '').replace(/"/g, '""')}"`,
    `"${(p.title || '').replace(/"/g, '""')}"`,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    `"${(p.price || '').replace(/"/g, '""')}"`,
    `"${(p.image || '').replace(/"/g, '""')}"`,
    `"${(p.category || '').replace(/"/g, '""')}"`,
    `"${(p.url || '').replace(/"/g, '""')}"`
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function generateSQL(products) {
  let sql = `-- SQL para importar produtos Brancaleone
-- Gerado em: ${new Date().toISOString()}
-- Total de produtos: ${products.length}

-- 1. Criar distribuidor (se não existir)
INSERT INTO distribuidores (name, active, created_at)
VALUES ('Brancaleone Publicações', true, NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. Inserir produtos
`;

  products.forEach(p => {
    const title = p.title.replace(/'/g, "''");
    const description = p.description.replace(/'/g, "''");
    const price = p.price.replace(/[^\d,\.]/g, '').replace(',', '.') || '0';
    const images = JSON.stringify(p.images).replace(/'/g, "''");
    
    sql += `
INSERT INTO products (
  code, name, description, price, images, 
  distribuidor_id, active, stock, created_at
)
VALUES (
  '${p.code}',
  '${title}',
  '${description}',
  ${parseFloat(price) || 0},
  '${images}'::jsonb,
  (SELECT id FROM distribuidores WHERE name = 'Brancaleone Publicações' LIMIT 1),
  true,
  999,
  NOW()
)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  images = EXCLUDED.images,
  updated_at = NOW();
`;
  });
  
  return sql;
}

// Executar
extractProducts();
