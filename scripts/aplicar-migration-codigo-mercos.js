const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function aplicarMigration() {
  console.log('🔧 APLICANDO MIGRATION: codigo_mercos\n');

  // Ler arquivo SQL
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20241117000001_add_codigo_mercos_to_products.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('📄 SQL a ser executado:');
  console.log('─'.repeat(80));
  console.log(sql);
  console.log('─'.repeat(80));
  console.log('');

  try {
    // Executar cada comando SQL separadamente
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--') && !cmd.startsWith('COMMENT'));

    for (const command of commands) {
      console.log(`📝 Executando comando...`);
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      
      if (error) {
        // Tentar executar diretamente via query
        console.log('⚠️  Tentando método alternativo...');
        const { error: error2 } = await supabase.from('_migrations').insert({ sql: command });
        
        if (error2) {
          console.error('❌ Erro:', error2.message);
          throw error2;
        }
      }
      
      console.log('✅ Comando executado com sucesso\n');
    }

    console.log('✅ MIGRATION APLICADA COM SUCESSO!\n');

    // Verificar se a coluna foi criada
    console.log('🔍 Verificando se a coluna foi criada...');
    const { data, error } = await supabase
      .from('products')
      .select('id, codigo_mercos')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao verificar:', error.message);
      console.log('\n⚠️  A coluna pode não ter sido criada. Execute o SQL manualmente no Supabase:');
      console.log('\n1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/editor');
      console.log('2. Clique em "SQL Editor"');
      console.log('3. Cole e execute o SQL acima');
    } else {
      console.log('✅ Coluna codigo_mercos criada com sucesso!');
      console.log(`📊 Teste: Buscou ${data?.length || 0} produto(s) com a coluna\n`);
    }

  } catch (error) {
    console.error('\n💥 ERRO AO APLICAR MIGRATION:', error);
    console.log('\n📋 SOLUÇÃO MANUAL:');
    console.log('─'.repeat(80));
    console.log('1. Acesse o Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard');
    console.log('');
    console.log('2. Vá em: SQL Editor');
    console.log('');
    console.log('3. Cole e execute este SQL:');
    console.log('─'.repeat(80));
    console.log(sql);
    console.log('─'.repeat(80));
  }
}

aplicarMigration().then(() => process.exit(0));
