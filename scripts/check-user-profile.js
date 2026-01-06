// Script para verificar dados do user_profiles e bancas
// Uso: node scripts/check-user-profile.js <email>

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUserProfile(email) {
  console.log('\n🔍 Buscando usuário:', email);
  
  // 1. Buscar usuário no auth
  const { data: usersData } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const user = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    console.log('❌ Usuário não encontrado no auth');
    return;
  }
  
  console.log('\n✅ Usuário encontrado no auth:');
  console.log('   ID:', user.id);
  console.log('   Email:', user.email);
  console.log('   Criado em:', user.created_at);
  
  // 2. Buscar perfil
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (profileError) {
    console.log('\n❌ Erro ao buscar perfil:', profileError.message);
  } else {
    console.log('\n📋 Perfil (user_profiles):');
    console.log('   Role:', profile.role);
    console.log('   Full Name:', profile.full_name || 'NÃO DEFINIDO');
    console.log('   Phone:', profile.phone || 'NÃO DEFINIDO');
    console.log('   CPF:', profile.cpf || 'NÃO DEFINIDO');
    console.log('   Banca ID:', profile.banca_id || 'NÃO DEFINIDO');
    console.log('   Active:', profile.active);
  }
  
  // 3. Buscar banca
  const { data: banca, error: bancaError } = await supabase
    .from('bancas')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (bancaError) {
    console.log('\n❌ Erro ao buscar banca:', bancaError.message);
  } else {
    console.log('\n🏪 Banca:');
    console.log('   ID:', banca.id);
    console.log('   Nome:', banca.name);
    console.log('   Phone:', banca.phone || 'NÃO DEFINIDO');
    console.log('   WhatsApp:', banca.whatsapp || 'NÃO DEFINIDO');
    console.log('   Hours:', banca.hours ? JSON.stringify(banca.hours).substring(0, 100) + '...' : 'NÃO DEFINIDO');
    console.log('   Opening Hours:', banca.opening_hours ? JSON.stringify(banca.opening_hours).substring(0, 100) + '...' : 'NÃO DEFINIDO');
    console.log('   Is Cotista:', banca.is_cotista);
    console.log('   Active:', banca.active);
    console.log('   Approved:', banca.approved);
  }
  
  // 4. Verificar dados pendentes
  const { data: pending } = await supabase
    .from('jornaleiro_pending_banca')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (pending) {
    console.log('\n⏳ Dados pendentes encontrados:');
    console.log('   Criado em:', pending.created_at);
    console.log('   Dados:', JSON.stringify(pending.banca_data).substring(0, 200) + '...');
  }
}

const email = process.argv[2] || 'ketlyn@guiadasbancas.com.br';
checkUserProfile(email).then(() => process.exit(0)).catch(e => {
  console.error('Erro:', e);
  process.exit(1);
});
