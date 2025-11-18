const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function removerConstraint() {
  console.log('\n🔧 REMOVENDO CONSTRAINT DE CHAVE ÚNICA - codigo_mercos\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const sqlPath = path.join(__dirname, '..', 'database', 'remove-constraint-codigo-mercos.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.log('❌ Arquivo SQL não encontrado\n');
      console.log('📝 EXECUTE MANUALMENTE NO SUPABASE SQL EDITOR:\n');
      console.log('ALTER TABLE products DROP CONSTRAINT IF EXISTS products_codigo_mercos_key;\n');
      console.log('CREATE INDEX IF NOT EXISTS idx_products_codigo_mercos ON products(codigo_mercos) WHERE codigo_mercos IS NOT NULL;\n');
      return;
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 SQL a ser executado:\n');
    console.log(sql);
    console.log('\n' + '='.repeat(80) + '\n');
    
    console.log('⚠️  O Supabase não permite executar SQL via API JS.\n');
    console.log('📝 COPIE E EXECUTE NO SUPABASE SQL EDITOR:\n');
    console.log('1. Acesse: https://supabase.com/dashboard');
    console.log('2. Selecione seu projeto');
    console.log('3. Vá em "SQL Editor"');
    console.log('4. Cole o SQL acima');
    console.log('5. Clique em "Run"\n');
    console.log('='.repeat(80) + '\n');
    
    console.log('💡 O QUE ISSO FAZ:\n');
    console.log('   ✅ Remove a constraint que impede códigos duplicados');
    console.log('   ✅ Mantém índice para busca rápida');
    console.log('   ✅ Permite múltiplos produtos com mesmo código\n');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

removerConstraint().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
