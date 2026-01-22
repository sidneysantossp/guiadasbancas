const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBancasByCpf() {
  console.log('🔍 TESTE: Buscar bancas pelo CPF do jornaleiro');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  // Exemplo: CPF 87181290800 (Anselmo com 2 cotas)
  const cpfTeste = '87181290800';
  
  console.log('1️⃣ Buscando bancas com cotista_cnpj_cpf:', cpfTeste);
  console.log('');
  
  const { data: bancas, error } = await supabase
    .from('bancas')
    .select('id, name, user_id, email, is_cotista, cotista_codigo, cotista_cnpj_cpf')
    .eq('cotista_cnpj_cpf', cpfTeste)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  console.log('📊 Total de bancas encontradas:', bancas?.length || 0);
  console.log('');
  
  if (bancas && bancas.length > 0) {
    bancas.forEach((banca, index) => {
      console.log('═══════════════════════════════════════');
      console.log(`BANCA ${index + 1} de ${bancas.length}`);
      console.log('═══════════════════════════════════════');
      console.log('ID:', banca.id);
      console.log('Nome:', banca.name);
      console.log('Email:', banca.email);
      console.log('User ID:', banca.user_id);
      console.log('É Cotista:', banca.is_cotista ? '✅ SIM' : '❌ NÃO');
      console.log('Código Cotista:', banca.cotista_codigo || 'N/A');
      console.log('CPF/CNPJ:', banca.cotista_cnpj_cpf || 'N/A');
      console.log('');
    });
    
    console.log('✅ SUCESSO: API agora retornará todas essas bancas!');
    console.log('');
    console.log('💡 Quando o jornaleiro fizer login, verá:');
    bancas.forEach((b, i) => {
      console.log(`   ${i + 1}. ${b.name} (Cota: ${b.cotista_codigo})`);
    });
  } else {
    console.log('⚠️  Nenhuma banca encontrada com este CPF');
    console.log('');
    console.log('💡 Certifique-se de que:');
    console.log('   1. As bancas têm o campo cotista_cnpj_cpf preenchido');
    console.log('   2. O CPF está sem formatação (apenas números)');
    console.log('   3. O campo is_cotista está marcado como true');
  }
}

testBancasByCpf().catch(console.error);
