const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function executarMigration() {
  console.log('\n🔧 ADICIONANDO CAMPO "excluido" À TABELA products\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'add-campo-excluido-products.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL a ser executado:\n');
    console.log(sql);
    console.log('\n' + '='.repeat(80) + '\n');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Tentar executar direto se a função RPC não existir
      console.log('⚠️  Função RPC não disponível, tentando método alternativo...\n');
      
      // Dividir em comandos individuais
      const comandos = sql
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
      
      for (const comando of comandos) {
        if (comando.includes('COMMENT ON')) continue; // Skip comments
        
        try {
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql: comando });
          if (cmdError) {
            console.log(`   ⚠️  ${comando.substring(0, 60)}... - ${cmdError.message}`);
          } else {
            console.log(`   ✅ ${comando.substring(0, 60)}...`);
          }
        } catch (e) {
          console.log(`   ❌ ${comando.substring(0, 60)}... - ${e.message}`);
        }
      }
      
      console.log('\n⚠️  Executando manualmente via Supabase SQL Editor:\n');
      console.log('1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/sql');
      console.log('2. Cole o SQL acima');
      console.log('3. Clique em "Run"\n');
      console.log('4. Depois execute: node scripts/resincronizar-brancaleone.js\n');
      
    } else {
      console.log('✅ Migration executada com sucesso!\n');
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
    console.log('\n📝 EXECUTE MANUALMENTE VIA SUPABASE SQL EDITOR:\n');
    console.log('1. Acesse o SQL Editor do Supabase');
    console.log('2. Execute o arquivo: database/add-campo-excluido-products.sql\n');
  }
}

executarMigration().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
