const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'FALTANDO');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'OK' : 'FALTANDO');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCotista() {
  const cpf = '87181290800';
  
  console.log('🔍 Buscando cotista com CPF:', cpf);
  console.log('');
  
  // Busca exata
  const { data, error, count } = await supabase
    .from('cotistas')
    .select('*', { count: 'exact' })
    .eq('cnpj_cpf', cpf);
  
  if (error) {
    console.error('❌ Erro ao buscar:', error.message);
    return;
  }
  
  console.log('📊 Total de registros encontrados:', count);
  console.log('');
  
  if (!data || data.length === 0) {
    console.log('❌ Cotista NÃO encontrado no banco de dados');
    console.log('');
    console.log('📋 Possíveis causas:');
    console.log('1. CPF não foi importado na planilha de cotistas');
    console.log('2. CPF foi digitado incorretamente na importação');
    console.log('3. Cotista ainda não foi cadastrado no sistema');
    console.log('');
    console.log('💡 Soluções:');
    console.log('1. Verificar se o CPF está na planilha original de cotistas');
    console.log('2. Importar novamente a planilha em /admin/cotistas/import');
    console.log('3. Cadastrar manualmente em /admin/cotistas');
    console.log('');
    
    // Buscar cotistas similares (parcial)
    console.log('🔍 Buscando CPFs similares...');
    const { data: similar } = await supabase
      .from('cotistas')
      .select('cnpj_cpf, razao_social, codigo')
      .ilike('cnpj_cpf', `%871812%`)
      .limit(5);
    
    if (similar && similar.length > 0) {
      console.log('📋 CPFs similares encontrados:');
      similar.forEach(c => {
        console.log(`  - ${c.cnpj_cpf} | ${c.razao_social} | Código: ${c.codigo}`);
      });
    } else {
      console.log('Nenhum CPF similar encontrado');
    }
    
    return;
  }
  
  console.log('✅ Cotista ENCONTRADO:');
  console.log('');
  data.forEach(cotista => {
    console.log('═══════════════════════════════════════');
    console.log('ID:', cotista.id);
    console.log('Código:', cotista.codigo || 'N/A');
    console.log('Razão Social:', cotista.razao_social);
    console.log('CPF/CNPJ:', cotista.cnpj_cpf);
    console.log('Ativo:', cotista.ativo ? '✅ SIM' : '❌ NÃO');
    console.log('Telefone:', cotista.telefone || 'N/A');
    console.log('Telefone 2:', cotista.telefone_2 || 'N/A');
    console.log('Endereço:', cotista.endereco_principal || 'N/A');
    console.log('Cidade:', cotista.cidade || 'N/A');
    console.log('Estado:', cotista.estado || 'N/A');
    console.log('Criado em:', cotista.created_at);
    console.log('═══════════════════════════════════════');
  });
  
  // Verificar se há bancas vinculadas
  console.log('');
  console.log('🔍 Verificando bancas vinculadas a este cotista...');
  const { data: bancas, error: bancasError } = await supabase
    .from('bancas')
    .select('id, name, email, is_cotista')
    .eq('cotista_cnpj_cpf', cpf);
  
  if (bancasError) {
    console.error('❌ Erro ao buscar bancas:', bancasError.message);
  } else if (bancas && bancas.length > 0) {
    console.log(`✅ ${bancas.length} banca(s) vinculada(s):`);
    bancas.forEach(b => {
      console.log(`  - ${b.name} (${b.email}) | is_cotista: ${b.is_cotista}`);
    });
  } else {
    console.log('ℹ️  Nenhuma banca vinculada ainda');
  }
}

checkCotista().catch(console.error);
