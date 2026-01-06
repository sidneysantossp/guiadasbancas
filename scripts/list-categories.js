const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Categorias da plataforma
  console.log('=== CATEGORIAS DA PLATAFORMA (tabela categories) ===\n');
  const { data: cats, error: catsErr } = await supabase
    .from('categories')
    .select('id, name, link, active')
    .order('name');
  
  if (catsErr) {
    console.log('Erro:', catsErr.message);
  } else {
    console.log(`Total: ${cats.length} categorias\n`);
    cats.forEach(c => {
      console.log(`- ${c.name} (active: ${c.active})`);
    });
  }

  // Categorias do distribuidor Brancaleone
  console.log('\n\n=== CATEGORIAS MERCOS - BRANCALEONE (tabela distribuidor_categories) ===\n');
  const { data: distCats, error: distErr } = await supabase
    .from('distribuidor_categories')
    .select('id, mercos_id, nome, ativo')
    .eq('distribuidor_id', '1511df09-1f4a-4e68-9f8c-05cd06be6269')
    .order('nome');
  
  if (distErr) {
    console.log('Erro:', distErr.message);
  } else {
    console.log(`Total: ${distCats.length} categorias\n`);
    distCats.forEach(c => {
      console.log(`- [${c.mercos_id}] ${c.nome} (ativo: ${c.ativo})`);
    });
  }
}

main().catch(console.error);
