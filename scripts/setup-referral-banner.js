const { createClient } = require('@supabase/supabase-js');

// Credenciais do Supabase (mesmo que lib/supabase.ts)
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupReferralBanner() {
  try {
    console.log('🔧 Configurando tabela referral_banners...\n');

    // Verificar se a tabela existe
    console.log('1️⃣ Verificando se a tabela existe...');
    const { data: existing, error: checkError } = await supabase
      .from('referral_banners')
      .select('*')
      .limit(1);

    if (checkError) {
      console.log('❌ Tabela não existe! Erro:', checkError.message);
      console.log('\n📋 AÇÃO NECESSÁRIA:');
      console.log('   Execute o SQL no Supabase SQL Editor:');
      console.log('   1. Acesse: https://supabase.com/dashboard/project/rgqlncxrzwgjreggrjcq/sql');
      console.log('   2. Cole o conteúdo do arquivo: database/create-referral-banner-table.sql');
      console.log('   3. Clique em "Run"\n');
      process.exit(1);
    }

    console.log('✅ Tabela existe!');
    
    if (existing && existing.length > 0) {
      console.log('\n📊 Dados existentes:');
      console.log('   - ID:', existing[0].id);
      console.log('   - Título:', existing[0].title);
      console.log('   - Ativo:', existing[0].active);
      console.log('   - Imagem:', existing[0].image_url ? 'SIM' : 'NÃO');
      console.log('\n✅ Banner já configurado!');
      return;
    }

    // Inserir dados padrão
    console.log('\n2️⃣ Inserindo dados padrão...');
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
      console.log('❌ Erro ao inserir dados:', error.message);
      process.exit(1);
    }

    console.log('✅ Dados inseridos com sucesso!');
    console.log('\n📊 Banner criado:');
    console.log('   - ID:', data[0].id);
    console.log('   - Título:', data[0].title);
    console.log('   - Link:', data[0].button_link);
    console.log('\n🎉 Configuração concluída! Teste em: http://localhost:3000/admin/cms/referral-banner');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setupReferralBanner();
