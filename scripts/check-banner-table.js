// Script para verificar se a tabela vendor_banners existe no Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBannerTable() {
  console.log('🔍 Verificando tabela vendor_banners...');
  
  try {
    // Tentar buscar dados da tabela
    const { data, error } = await supabase
      .from('vendor_banners')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao acessar tabela:', error.message);
      console.log('💡 A tabela vendor_banners provavelmente não existe no Supabase');
      return false;
    }
    
    console.log('✅ Tabela vendor_banners existe!');
    console.log('📊 Dados encontrados:', data?.length || 0, 'registros');
    
    if (data && data.length > 0) {
      console.log('🎯 Primeiro registro:', JSON.stringify(data[0], null, 2));
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro geral:', error);
    return false;
  }
}

checkBannerTable();
