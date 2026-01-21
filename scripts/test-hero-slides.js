require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? '✅ Presente' : '❌ Ausente');

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    // Testar hero_slides
    console.log('\n📊 Testando tabela hero_slides...');
    const { data: slides, error: slidesError } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order', { ascending: true });
    
    if (slidesError) {
      console.error('❌ Erro ao buscar hero_slides:', slidesError);
    } else {
      console.log('✅ Hero slides encontrados:', slides?.length || 0);
      if (slides && slides.length > 0) {
        console.log('Primeiro slide:', JSON.stringify(slides[0], null, 2));
      }
    }

    // Testar slider_config
    console.log('\n⚙️ Testando tabela slider_config...');
    const { data: config, error: configError } = await supabase
      .from('slider_config')
      .select('*')
      .single();
    
    if (configError) {
      console.error('❌ Erro ao buscar slider_config:', configError);
    } else {
      console.log('✅ Slider config encontrado:', JSON.stringify(config, null, 2));
    }

    // Testar bancas
    console.log('\n🏪 Testando tabela bancas...');
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, name, active')
      .limit(5);
    
    if (bancasError) {
      console.error('❌ Erro ao buscar bancas:', bancasError);
    } else {
      console.log('✅ Bancas encontradas:', bancas?.length || 0);
      if (bancas && bancas.length > 0) {
        console.log('Primeiras bancas:', bancas.map(b => `${b.name} (${b.active ? 'ativa' : 'inativa'})`).join(', '));
      }
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }
}

test();
