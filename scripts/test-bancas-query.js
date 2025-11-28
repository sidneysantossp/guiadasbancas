require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Erro: Variáveis de ambiente não encontradas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testBancas() {
  console.log('Testando busca de bancas...');
  
  // 1. Buscar todas as bancas sem filtro
  const { data: todas, error: errorTodas } = await supabase
    .from('bancas')
    .select('id, name, active')
    .limit(10);
    
  if (errorTodas) {
    console.error('Erro ao buscar todas:', errorTodas);
  } else {
    console.log(`Encontradas ${todas.length} bancas (amostra):`);
    todas.forEach(b => console.log(`- ${b.name}: active=${b.active} (${typeof b.active})`));
  }

  // 2. Buscar apenas ativas (query antiga)
  const { data: ativas, error: errorAtivas } = await supabase
    .from('bancas')
    .select('id, name')
    .eq('active', true);
    
  if (errorAtivas) {
    console.error('Erro ao buscar ativas:', errorAtivas);
  } else {
    console.log(`\nEncontradas ${ativas.length} bancas ativas via .eq('active', true)`);
  }
}

testBancas();
