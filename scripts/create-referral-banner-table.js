const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'FALTANDO');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'OK' : 'FALTANDO');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createReferralBannerTable() {
  try {
    console.log('🔧 Criando tabela referral_banners no Supabase...\n');

    // Verificar se a tabela já existe
    const { data: existingData, error: checkError } = await supabase
      .from('referral_banners')
      .select('id')
      .limit(1);

    if (!checkError) {
      console.log('✅ Tabela referral_banners já existe!');
      console.log('📊 Dados atuais:', existingData);
      return;
    }

    console.log('📝 Tabela não existe, criando...\n');

    // Criar tabela via SQL (executar no SQL Editor do Supabase)
    console.log('⚠️  IMPORTANTE: Execute o SQL abaixo no Supabase SQL Editor:');
    console.log('    https://supabase.com/dashboard/project/_/sql\n');
    
    console.log('--------------------------------------------------');
    console.log('-- SQL para criar tabela referral_banners');
    console.log('--------------------------------------------------\n');
    
    const sql = `
-- Tabela para armazenar configurações do banner de indicação
CREATE TABLE IF NOT EXISTS referral_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL DEFAULT 'Indique a Plataforma e ganhe benefícios',
    subtitle VARCHAR(255) NOT NULL DEFAULT 'Programa de Indicação',
    description TEXT NOT NULL DEFAULT 'Convide amigos e familiares para conhecer as melhores bancas.',
    button_text VARCHAR(100) NOT NULL DEFAULT 'Indicar agora',
    button_link VARCHAR(500) NOT NULL DEFAULT '/indicar',
    image_url VARCHAR(1000),
    background_color VARCHAR(7) DEFAULT '#1f2937',
    text_color VARCHAR(7) DEFAULT '#FFFFFF',
    button_color VARCHAR(7) DEFAULT '#f97316',
    button_text_color VARCHAR(7) DEFAULT '#FFFFFF',
    overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
    text_position VARCHAR(20) DEFAULT 'center-left',
    active BOOLEAN NOT NULL DEFAULT true,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Desabilitar RLS
ALTER TABLE referral_banners DISABLE ROW LEVEL SECURITY;

-- Inserir banner padrão
INSERT INTO referral_banners (title, subtitle, description, button_text, button_link, image_url, active)
SELECT 
    'Indique a Plataforma e ganhe benefícios',
    'Programa de Indicação',
    'Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.',
    'Indicar agora',
    '/indicar',
    'https://lh3.googleusercontent.com/gg/AAHar4ez4stpNWSyhtcKIAQdeA4bUIFfC_wbg06xK_bhJNwv7-6WCuWHfszyh8YU8B2YPf2h6mzp3OAvwWLIqfBU1PeEfl9jE8T_Gim7uvt8GCiKYXqiVIHK45aO9-NOC90ppaLjsJuWsj19ofzQNniCIW8tGUSgzVO_JX7GZsaNG40LamP77jTiT9B1Bbwbqq5eBqJUPmdWLp8h-gaDYYku0cUfsElkXiYmDoGIn8HV1AXZg1hgG-uhDJ8o4v9vTJ4d2E_yL0DUbct5q6Ka9dIaZyXjbSAa8N2x9OjnOIQO6QFICsKctq6-LxlzhEfdzymQrGE7TXpnjOpZsd6OpOfe_Lxb=s1024-rj?authuser=1',
    true
WHERE NOT EXISTS (SELECT 1 FROM referral_banners LIMIT 1);
`;

    console.log(sql);
    console.log('\n--------------------------------------------------\n');
    
    // Tentar inserir dados padrão (se a tabela já existe mas está vazia)
    console.log('🔄 Tentando inserir dados padrão...');
    
    const { data, error } = await supabase
      .from('referral_banners')
      .insert([{
        title: 'Indique a Plataforma e ganhe benefícios',
        subtitle: 'Programa de Indicação',
        description: 'Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.',
        button_text: 'Indicar agora',
        button_link: '/indicar',
        image_url: 'https://lh3.googleusercontent.com/gg/AAHar4ez4stpNWSyhtcKIAQdeA4bUIFfC_wbg06xK_bhJNwv7-6WCuWHfszyh8YU8B2YPf2h6mzp3OAvwWLIqfBU1PeEfl9jE8T_Gim7uvt8GCiKYXqiVIHK45aO9-NOC90ppaLjsJuWsj19ofzQNniCIW8tGUSgzVO_JX7GZsaNG40LamP77jTiT9B1Bbwbqq5eBqJUPmdWLp8h-gaDYYku0cUfsElkXiYmDoGIn8HV1AXZg1hgG-uhDJ8o4v9vTJ4d2E_yL0DUbct5q6Ka9dIaZyXjbSAa8N2x9OjnOIQO6QFICsKctq6-LxlzhEfdzymQrGE7TXpnjOpZsd6OpOfe_Lxb=s1024-rj?authuser=1',
        background_color: '#1f2937',
        text_color: '#ffffff',
        button_color: '#f97316',
        button_text_color: '#ffffff',
        overlay_opacity: 0.5,
        text_position: 'center-left',
        active: true
      }])
      .select();

    if (error) {
      console.log('⚠️  A tabela precisa ser criada primeiro no Supabase SQL Editor');
      console.log('   Erro:', error.message);
    } else {
      console.log('✅ Dados padrão inseridos com sucesso!');
      console.log('📊 Dados:', data);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

createReferralBannerTable();
