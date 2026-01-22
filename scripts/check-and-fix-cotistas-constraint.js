const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndFix() {
  console.log('🔍 DIAGNÓSTICO: Verificando constraint de unicidade do CPF');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
  // Tentar inserir uma cota duplicada para testar a constraint
  const cpfTeste = '87181290800';
  
  console.log('1️⃣ Verificando se já existe cota com CPF:', cpfTeste);
  const { data: existing, error: searchError } = await supabase
    .from('cotistas')
    .select('id, codigo, razao_social, cnpj_cpf')
    .eq('cnpj_cpf', cpfTeste);
  
  if (searchError) {
    console.error('❌ Erro ao buscar:', searchError.message);
    return;
  }
  
  console.log('   Cotas encontradas:', existing?.length || 0);
  if (existing && existing.length > 0) {
    existing.forEach(c => {
      console.log('   - Código:', c.codigo, '| Razão Social:', c.razao_social);
    });
  }
  console.log('');
  
  console.log('2️⃣ Testando inserção de nova cota com mesmo CPF...');
  const { data: inserted, error: insertError } = await supabase
    .from('cotistas')
    .insert({
      codigo: '2031',
      razao_social: '2031 - ANSELMO JUOCIUNAS (TESTE)',
      cnpj_cpf: cpfTeste,
      ativo: true,
      telefone: '(11) 96374-2817',
      cidade: 'São Paulo',
      estado: 'SP'
    })
    .select();
  
  if (insertError) {
    console.log('   ❌ ERRO ao inserir:', insertError.message);
    console.log('   Código do erro:', insertError.code);
    console.log('');
    
    if (insertError.message.includes('duplicate key') || insertError.message.includes('unique constraint')) {
      console.log('🚨 CONFIRMADO: Existe constraint de unicidade no CPF');
      console.log('');
      console.log('📋 SOLUÇÃO MANUAL NECESSÁRIA:');
      console.log('');
      console.log('Execute este SQL no Supabase Dashboard (SQL Editor):');
      console.log('─────────────────────────────────────────────────────');
      console.log('');
      console.log('-- Passo 1: Verificar o nome exato da constraint');
      console.log('SELECT constraint_name, constraint_type');
      console.log('FROM information_schema.table_constraints');
      console.log('WHERE table_name = \'cotistas\' AND constraint_type = \'UNIQUE\';');
      console.log('');
      console.log('-- Passo 2: Remover a constraint (substitua o nome se diferente)');
      console.log('ALTER TABLE public.cotistas DROP CONSTRAINT IF EXISTS cotista_cnpj_cpf_key;');
      console.log('ALTER TABLE public.cotistas DROP CONSTRAINT IF EXISTS cotistas_cnpj_cpf_key;');
      console.log('');
      console.log('-- Passo 3: Criar índice sem unicidade');
      console.log('CREATE INDEX IF NOT EXISTS idx_cotistas_cnpj_cpf ON public.cotistas(cnpj_cpf);');
      console.log('');
      console.log('─────────────────────────────────────────────────────');
      console.log('');
      console.log('🔗 Acesse: ' + supabaseUrl.replace('/rest/v1', '') + '/project/_/sql');
    }
  } else {
    console.log('   ✅ Inserção bem-sucedida!');
    console.log('   ID da nova cota:', inserted[0]?.id);
    console.log('');
    console.log('🎉 A constraint já foi removida ou não existe!');
    console.log('');
    console.log('⚠️  Removendo cota de teste...');
    
    // Remover a cota de teste
    await supabase
      .from('cotistas')
      .delete()
      .eq('id', inserted[0].id);
    
    console.log('   ✅ Cota de teste removida');
  }
}

checkAndFix().catch(console.error);
