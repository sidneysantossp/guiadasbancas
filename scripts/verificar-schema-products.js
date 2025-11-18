const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarSchema() {
  console.log('\n🔍 VERIFICANDO SCHEMA DA TABELA products\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    // Buscar um produto para ver todos os campos disponíveis
    const { data: produtos, error } = await supabase
      .from('products')
      .select('*')
      .eq('distribuidor_id', dist.id)
      .limit(1);
    
    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }
    
    if (!produtos || produtos.length === 0) {
      console.log('❌ Nenhum produto encontrado\n');
      return;
    }
    
    const produto = produtos[0];
    
    console.log('📋 CAMPOS DISPONÍVEIS NA TABELA products:\n');
    Object.keys(produto).sort().forEach((campo, i) => {
      const valor = produto[campo];
      const tipo = typeof valor;
      const valorStr = valor === null ? 'NULL' : 
                       tipo === 'string' ? valor.substring(0, 50) : 
                       tipo === 'number' ? valor :
                       tipo === 'boolean' ? valor :
                       Array.isArray(valor) ? `Array(${valor.length})` :
                       'Object';
      
      console.log(`   ${(i + 1).toString().padStart(2)}. ${campo.padEnd(25)} (${tipo.padEnd(9)}) = ${valorStr}`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    const camposRelacionados = ['ativo', 'excluido', 'active', 'status', 'origem'];
    console.log('📊 CAMPOS RELACIONADOS AO STATUS:\n');
    
    camposRelacionados.forEach(campo => {
      if (produto.hasOwnProperty(campo)) {
        console.log(`   ✅ ${campo.padEnd(15)}: ${produto[campo]}`);
      } else {
        console.log(`   ❌ ${campo.padEnd(15)}: NÃO EXISTE`);
      }
    });
    
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarSchema().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
