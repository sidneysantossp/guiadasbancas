// Script para corrigir produtos sem category_id
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIA_SEM_CATEGORIA_ID = 'bbbbbbbb-0000-0000-0000-000000000001';

async function fixSemCategoria() {
  console.log('🔧 Corrigindo produtos sem category_id...\n');

  // 1. Contar produtos sem category_id
  const { count: countSemCategoria } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .is('category_id', null);

  console.log(`📋 Produtos sem category_id: ${countSemCategoria || 0}`);

  if (!countSemCategoria || countSemCategoria === 0) {
    console.log('✅ Nenhum produto para corrigir');
    return;
  }

  // 2. Atualizar todos para usar o ID da categoria "Sem Categoria"
  const { error: updateError } = await supabase
    .from('products')
    .update({ category_id: CATEGORIA_SEM_CATEGORIA_ID })
    .is('category_id', null);

  if (updateError) {
    console.error('❌ Erro ao atualizar produtos:', updateError.message);
    return;
  }

  console.log(`✅ Produtos atualizados com sucesso!`);

  // 3. Verificar resultado
  const { count: remaining } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .is('category_id', null);

  console.log(`\n📊 Produtos ainda sem category_id: ${remaining || 0}`);
}

fixSemCategoria();
