const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!');
  console.log('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function loadJsonData(filename) {
  try {
    const filePath = path.join(process.cwd(), 'data', filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(`⚠️  Arquivo ${filename} não encontrado ou vazio`);
    return [];
  }
}

async function migrateBancas() {
  console.log('📦 Migrando bancas...');
  
  const bancasData = await loadJsonData('bancas.json');
  if (bancasData.length === 0) return;

  const bancasToInsert = bancasData.map(banca => ({
    id: banca.id,
    name: banca.name,
    cep: banca.cep || '00000-000',
    address: banca.address || 'Endereço não informado',
    lat: parseFloat(banca.lat) || -23.5505,
    lng: parseFloat(banca.lng) || -46.6333,
    rating: banca.rating ? parseFloat(banca.rating) : null,
    categories: banca.categories || null,
    cover_image: banca.coverImage || null
  }));

  const { data, error } = await supabase
    .from('bancas')
    .upsert(bancasToInsert, { onConflict: 'id' });

  if (error) {
    console.error('❌ Erro ao migrar bancas:', error);
  } else {
    console.log(`✅ ${bancasToInsert.length} bancas migradas com sucesso!`);
  }
}

async function migrateCategories() {
  console.log('📦 Migrando categorias...');
  
  const categoriesData = await loadJsonData('categories.json');
  if (categoriesData.length === 0) return;

  const categoriesToInsert = categoriesData.map(category => ({
    id: category.id,
    name: category.name,
    image: category.image || null,
    link: category.link,
    active: category.active !== false,
    order: category.order || 0
  }));

  const { data, error } = await supabase
    .from('categories')
    .upsert(categoriesToInsert, { onConflict: 'id' });

  if (error) {
    console.error('❌ Erro ao migrar categorias:', error);
  } else {
    console.log(`✅ ${categoriesToInsert.length} categorias migradas com sucesso!`);
  }
}

async function migrateProducts() {
  console.log('📦 Migrando produtos...');
  
  const productsData = await loadJsonData('products.json');
  if (productsData.length === 0) return;

  const productsToInsert = productsData.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description || null,
    description_full: product.description_full || null,
    price: parseFloat(product.price) || 0,
    price_original: product.price_original ? parseFloat(product.price_original) : null,
    discount_percent: product.discount_percent ? parseInt(product.discount_percent) : null,
    category_id: product.category_id || null,
    banca_id: product.banca_id,
    images: product.images || null,
    gallery_images: product.gallery_images || null,
    specifications: product.specifications || null,
    rating_avg: product.rating_avg ? parseFloat(product.rating_avg) : null,
    reviews_count: product.reviews_count ? parseInt(product.reviews_count) : 0,
    stock_qty: product.stock_qty ? parseInt(product.stock_qty) : null,
    track_stock: product.track_stock || false,
    sob_encomenda: product.sob_encomenda || false,
    pre_venda: product.pre_venda || false,
    pronta_entrega: product.pronta_entrega !== false
  }));

  const { data, error } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'id' });

  if (error) {
    console.error('❌ Erro ao migrar produtos:', error);
  } else {
    console.log(`✅ ${productsToInsert.length} produtos migrados com sucesso!`);
  }
}

async function migrateBranding() {
  console.log('📦 Migrando configurações de branding...');
  
  const brandingData = await loadJsonData('branding.json');
  if (!brandingData || Object.keys(brandingData).length === 0) return;

  const brandingToInsert = {
    logo_url: brandingData.logoUrl || null,
    logo_alt: brandingData.logoAlt || 'Guia das Bancas',
    site_name: brandingData.siteName || 'Guia das Bancas',
    primary_color: brandingData.primaryColor || '#ff5c00',
    secondary_color: brandingData.secondaryColor || '#ff7a33',
    favicon: brandingData.favicon || '/favicon.svg'
  };

  // Primeiro, verificar se já existe um registro
  const { data: existing } = await supabase
    .from('branding')
    .select('id')
    .limit(1);

  let result;
  if (existing && existing.length > 0) {
    // Atualizar registro existente
    result = await supabase
      .from('branding')
      .update(brandingToInsert)
      .eq('id', existing[0].id);
  } else {
    // Inserir novo registro
    result = await supabase
      .from('branding')
      .insert(brandingToInsert);
  }

  if (result.error) {
    console.error('❌ Erro ao migrar branding:', result.error);
  } else {
    console.log('✅ Configurações de branding migradas com sucesso!');
  }
}

async function main() {
  console.log('🚀 Iniciando migração para Supabase...\n');

  try {
    await migrateBancas();
    await migrateCategories();
    await migrateProducts();
    await migrateBranding();
    
    console.log('\n🎉 Migração concluída com sucesso!');
    console.log('📊 Verifique os dados no painel do Supabase');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

main();
