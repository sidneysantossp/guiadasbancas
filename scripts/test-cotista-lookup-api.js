const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLookupAPI() {
  const cpf = '87181290800';
  
  console.log('🧪 TESTANDO API DE LOOKUP DE COTISTAS');
  console.log('═══════════════════════════════════════');
  console.log('');
  console.log('📋 CPF a ser testado:', cpf);
  console.log('📏 Tamanho do CPF:', cpf.length, 'dígitos');
  console.log('');
  
  // Simular exatamente o que a API faz
  console.log('🔍 Simulando lógica da API /api/public/cotistas/lookup...');
  console.log('');
  
  const q = cpf.trim();
  const digits = q.replace(/[^0-9]/g, '');
  
  console.log('Valor recebido (q):', q);
  console.log('Dígitos extraídos:', digits);
  console.log('Tamanho dos dígitos:', digits.length);
  console.log('');
  
  if (digits.length === 11 || digits.length === 14) {
    console.log('✅ Tamanho válido! Executando busca...');
    console.log('');
    
    const { data, error } = await supabase
      .from('cotistas')
      .select('id,codigo,razao_social,cnpj_cpf')
      .eq('ativo', true)
      .eq('cnpj_cpf', digits)
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na busca:', error.message);
      return;
    }
    
    console.log('📊 Resultado da busca:');
    console.log('');
    
    if (data && data.length > 0) {
      console.log('✅ COTISTA ENCONTRADO:');
      console.log('');
      const cotista = data[0];
      console.log('ID:', cotista.id);
      console.log('Código:', cotista.codigo);
      console.log('Razão Social:', cotista.razao_social);
      console.log('CPF/CNPJ:', cotista.cnpj_cpf);
      console.log('');
      console.log('🎉 A API DEVERIA RETORNAR:');
      console.log(JSON.stringify({ success: true, data: cotista }, null, 2));
    } else {
      console.log('❌ NENHUM COTISTA ENCONTRADO');
      console.log('');
      console.log('🔍 Verificando possíveis problemas...');
      
      // Verificar se existe mas está inativo
      const { data: inactive } = await supabase
        .from('cotistas')
        .select('id,codigo,razao_social,cnpj_cpf,ativo')
        .eq('cnpj_cpf', digits)
        .limit(1);
      
      if (inactive && inactive.length > 0) {
        console.log('⚠️  Cotista existe mas está INATIVO:');
        console.log('   Ativo:', inactive[0].ativo);
        console.log('   Razão Social:', inactive[0].razao_social);
      } else {
        console.log('❌ Cotista não existe no banco de dados');
      }
    }
  } else {
    console.log('❌ Tamanho inválido! API não executará busca.');
    console.log('   Esperado: 11 ou 14 dígitos');
    console.log('   Recebido:', digits.length, 'dígitos');
  }
  
  console.log('');
  console.log('═══════════════════════════════════════');
  
  // Testar também com o código
  console.log('');
  console.log('🧪 TESTANDO BUSCA POR CÓDIGO');
  console.log('═══════════════════════════════════════');
  console.log('');
  
  const codigo = '2311';
  console.log('📋 Código a ser testado:', codigo);
  console.log('');
  
  const { data: byCode, error: codeError } = await supabase
    .from('cotistas')
    .select('id,codigo,razao_social,cnpj_cpf')
    .eq('ativo', true)
    .eq('codigo', codigo)
    .limit(1);
  
  if (codeError) {
    console.error('❌ Erro na busca por código:', codeError.message);
  } else if (byCode && byCode.length > 0) {
    console.log('✅ COTISTA ENCONTRADO POR CÓDIGO:');
    console.log('');
    console.log('ID:', byCode[0].id);
    console.log('Código:', byCode[0].codigo);
    console.log('Razão Social:', byCode[0].razao_social);
    console.log('CPF/CNPJ:', byCode[0].cnpj_cpf);
  } else {
    console.log('❌ Nenhum cotista encontrado com código:', codigo);
  }
}

testLookupAPI().catch(console.error);
