const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl);
console.log('Service Key:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : 'NÃO ENCONTRADA');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    console.log('📡 Testando conexão...');
    
    // Teste simples: listar tabelas
    const { data, error } = await supabase
      .from('branding')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro na conexão:', error);
      return;
    }

    console.log('✅ Conexão bem-sucedida!');
    console.log('📊 Dados encontrados:', data?.length || 0, 'registros');
    
    // Teste de inserção simples
    console.log('🧪 Testando inserção...');
    const { data: insertData, error: insertError } = await supabase
      .from('branding')
      .upsert({
        logo_url: null,
        logo_alt: 'Teste',
        site_name: 'Teste',
        primary_color: '#ff5c00',
        secondary_color: '#ff7a33',
        favicon: '/favicon.svg'
      })
      .select();

    if (insertError) {
      console.error('❌ Erro na inserção:', insertError);
    } else {
      console.log('✅ Inserção bem-sucedida!');
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testConnection();
