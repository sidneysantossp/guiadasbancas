require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 CORRIGINDO IMAGENS DA BANCA MOEMA\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBancaMoema() {
  try {
    // Atualizar BANCA MOEMA para usar imagem placeholder
    const { data, error } = await supabase
      .from('bancas')
      .update({
        cover_image: null,
        profile_image: null
      })
      .ilike('name', '%MOEMA%')
      .select();
    
    if (error) {
      console.error('❌ Erro ao atualizar:', error);
      return;
    }

    console.log('✅ BANCA MOEMA atualizada com sucesso!');
    console.log('   Cover Image: removida (usará placeholder)');
    console.log('   Profile Image: removida (usará placeholder)');
    console.log('\n📋 Dados atualizados:', data);

  } catch (error) {
    console.error('�� Erro:', error);
  }
}

fixBancaMoema();
