// Script para desativar o banner da Turma da Mônica
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deactivateTurmaMonicaBanner() {
  try {
    // Buscar todos os banners ativos
    const { data: banners, error: fetchError } = await supabase
      .from('mini_banners')
      .select('*')
      .eq('active', true);

    if (fetchError) throw fetchError;

    console.log(`Encontrados ${banners?.length || 0} banners ativos`);

    // Desativar todos os banners que contêm "turma" ou "monica" na URL (case insensitive)
    // Ou simplesmente desativar o banner com display_order = 4 (o da Turma da Mônica)
    const { data, error } = await supabase
      .from('mini_banners')
      .update({ active: false })
      .eq('display_order', 4)
      .select();

    if (error) throw error;

    console.log('Banner desativado com sucesso:', data);
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

deactivateTurmaMonicaBanner();
