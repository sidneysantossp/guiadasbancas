import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAuthSetup() {
  console.log('🧪 Testando configuração de autenticação...\n');

  try {
    // 1. Verificar tabela user_profiles
    console.log('1️⃣  Verificando tabela user_profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('   ❌ Erro:', profilesError.message);
      console.log('   ⚠️  Execute o arquivo auth-schema-safe.sql no Supabase SQL Editor\n');
      return;
    }
    console.log('   ✅ Tabela user_profiles existe');
    console.log(`   📊 Perfis cadastrados: ${profiles?.length || 0}\n`);

    // 2. Verificar campos adicionais na tabela bancas
    console.log('2️⃣  Verificando campos adicionais em bancas...');
    const { data: bancas, error: bancasError } = await supabase
      .from('bancas')
      .select('id, user_id, phone, whatsapp, email, logo_url, opening_hours')
      .limit(1);

    if (bancasError) {
      console.log('   ❌ Erro:', bancasError.message);
      console.log('   ⚠️  Alguns campos podem estar faltando. Execute auth-schema-safe.sql\n');
      return;
    }
    console.log('   ✅ Campos adicionais existem (user_id, phone, whatsapp, email, etc)\n');

    // 3. Testar criação de usuário (simulação)
    console.log('3️⃣  Testando criação de usuário de teste...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123!@#';
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Usuário Teste',
          role: 'jornaleiro',
        },
      },
    });

    if (authError) {
      console.log('   ❌ Erro ao criar usuário:', authError.message);
      return;
    }

    if (!authData.user) {
      console.log('   ❌ Usuário não foi criado');
      return;
    }

    console.log('   ✅ Usuário criado com sucesso');
    console.log(`   📧 Email: ${testEmail}`);
    console.log(`   🆔 ID: ${authData.user.id}\n`);

    // 4. Aguardar trigger criar perfil (pequeno delay)
    console.log('4️⃣  Aguardando trigger criar perfil...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Verificar se perfil foi criado automaticamente
    console.log('5️⃣  Verificando se perfil foi criado automaticamente...');
    const { data: newProfile, error: newProfileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (newProfileError) {
      console.log('   ❌ Perfil não foi criado automaticamente');
      console.log('   ⚠️  Verifique se o trigger on_auth_user_created está ativo\n');
      
      // Limpar usuário de teste
      await supabase.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log('   ✅ Perfil criado automaticamente pelo trigger!');
    console.log(`   👤 Nome: ${newProfile.full_name}`);
    console.log(`   🎭 Role: ${newProfile.role}`);
    console.log(`   📅 Criado em: ${newProfile.created_at}\n`);

    // 6. Limpar usuário de teste
    console.log('6️⃣  Limpando usuário de teste...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(authData.user.id);
    
    if (deleteError) {
      console.log('   ⚠️  Não foi possível deletar usuário de teste:', deleteError.message);
    } else {
      console.log('   ✅ Usuário de teste removido\n');
    }

    // 7. Resumo final
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ TODOS OS TESTES PASSARAM!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('🎉 O sistema de autenticação está configurado corretamente!');
    console.log('');
    console.log('Próximos passos:');
    console.log('1. Teste o registro de jornaleiro na interface');
    console.log('2. Verifique se o perfil é criado automaticamente');
    console.log('3. Confirme o redirecionamento para /jornaleiro/onboarding');
    console.log('');

  } catch (error: any) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

// Executar testes
testAuthSetup();
