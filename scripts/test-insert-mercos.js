const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  const distribuidor_id = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
  
  const produtoData = {
    name: "Academia Do Estranho Vol. 2 (Teste Sync)",
    description: "Teste",
    price: 66.9,
    stock_qty: 101,
    images: [],
    banca_id: null,
    distribuidor_id: distribuidor_id,
    mercos_id: 180572578,
    codigo_mercos: "e2",
    category_id: null, // Let's try with null first, or a valid distribuidor category
    origem: 'mercos',
    track_stock: true,
    sob_encomenda: false,
    pre_venda: false,
    pronta_entrega: true,
    active: true,
    sincronizado_em: new Date().toISOString()
  };

  console.log("Tentando inserir...");
  const { data, error } = await supabase.from('products').insert([produtoData]).select();
  
  if (error) {
    console.error("Erro exato ao inserir:", error);
  } else {
    console.log("Sucesso ao inserir:", data);
    // Cleanup
    await supabase.from('products').delete().eq('id', data[0].id);
  }
}

test();
