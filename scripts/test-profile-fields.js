// Script para testar se os campos phone e cpf existem na tabela user_profiles
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfileFields() {
  console.log('🔍 Testando campos da tabela user_profiles...\n');

  try {
    // 1. Buscar todos os perfis
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id, full_name, phone, cpf, role')
      .eq('role', 'jornaleiro')
      .limit(5);

    if (error) {
      console.error('❌ Erro ao buscar perfis:', error);
      return;
    }

    console.log(`✅ Encontrados ${profiles.length} perfis de jornaleiros:\n`);
    
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.full_name || 'Sem nome'}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Phone: ${profile.phone || 'NULL'}`);
      console.log(`   CPF: ${profile.cpf || 'NULL'}`);
      console.log('');
    });

    // 2. Testar atualização
    if (profiles.length > 0) {
      const testProfile = profiles[0];
      console.log(`\n🧪 Testando atualização do perfil ${testProfile.full_name}...\n`);

      const testPhone = '11999887766';
      const testCpf = '123.456.789-00';

      const { data: updated, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          phone: testPhone,
          cpf: testCpf
        })
        .eq('id', testProfile.id)
        .select();

      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError);
        return;
      }

      console.log('✅ Atualização bem-sucedida!');
      console.log('Dados atualizados:', updated[0]);

      // 3. Verificar se foi salvo
      const { data: verified, error: verifyError } = await supabase
        .from('user_profiles')
        .select('phone, cpf')
        .eq('id', testProfile.id)
        .single();

      if (verifyError) {
        console.error('❌ Erro ao verificar:', verifyError);
        return;
      }

      console.log('\n🔍 Verificação após salvamento:');
      console.log(`   Phone: ${verified.phone}`);
      console.log(`   CPF: ${verified.cpf}`);

      if (verified.phone === testPhone && verified.cpf === testCpf) {
        console.log('\n✅ SUCESSO! Os campos estão funcionando corretamente!');
      } else {
        console.log('\n❌ FALHA! Os dados não foram salvos corretamente.');
      }
    }

  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

testProfileFields();
