const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarSchema() {
  console.log('\n📊 VERIFICANDO SCHEMA E DADOS - BRANCALEONE\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    // Buscar distribuidor
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('id')
      .ilike('nome', '%brancaleone%')
      .single();
    
    // Buscar 5 produtos para ver a estrutura
    const { data: produtos } = await supabase
      .from('products')
      .select('*')
      .eq('distribuidor_id', dist.id)
      .limit(5);
    
    if (!produtos || produtos.length === 0) {
      console.log('❌ Nenhum produto encontrado!\n');
      return;
    }
    
    console.log(`📦 ENCONTRADOS: ${produtos.length} produtos (amostra)\n`);
    console.log('📋 ESTRUTURA DO PRIMEIRO PRODUTO:\n');
    
    const primeiro = produtos[0];
    const campos = Object.keys(primeiro).sort();
    
    campos.forEach(campo => {
      const valor = primeiro[campo];
      let preview = String(valor);
      if (preview.length > 50) {
        preview = preview.substring(0, 50) + '...';
      }
      console.log(`   ${campo.padEnd(25)}: ${preview}`);
    });
    
    console.log('\n' + '='.repeat(80) + '\n');
    
    // Verificar todos os valores únicos de alguns campos importantes
    console.log('🔍 ANÁLISE DE CAMPOS:\n');
    
    const { data: todosP } = await supabase
      .from('products')
      .select('status, ativo, source')
      .eq('distribuidor_id', dist.id);
    
    if (todosP) {
      // Status
      const statusMap = new Map();
      todosP.forEach(p => {
        const val = p.status || 'null';
        statusMap.set(val, (statusMap.get(val) || 0) + 1);
      });
      
      console.log('   Campo "status":');
      Array.from(statusMap.entries()).forEach(([val, count]) => {
        console.log(`      ${String(val).padEnd(20)}: ${count}`);
      });
      
      // Ativo
      const ativoMap = new Map();
      todosP.forEach(p => {
        const val = String(p.ativo);
        ativoMap.set(val, (ativoMap.get(val) || 0) + 1);
      });
      
      console.log('\n   Campo "ativo":');
      Array.from(ativoMap.entries()).forEach(([val, count]) => {
        console.log(`      ${String(val).padEnd(20)}: ${count}`);
      });
      
      // Source
      const sourceMap = new Map();
      todosP.forEach(p => {
        const val = p.source || 'null';
        sourceMap.set(val, (sourceMap.get(val) || 0) + 1);
      });
      
      console.log('\n   Campo "source":');
      Array.from(sourceMap.entries()).forEach(([val, count]) => {
        console.log(`      ${String(val).padEnd(20)}: ${count}`);
      });
    }
    
    console.log('\n' + '='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarSchema().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
