const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verificarDuplicatas() {
  console.log('\n🔍 VERIFICANDO DUPLICATAS DE codigo_mercos\n');
  console.log('='.repeat(80) + '\n');
  
  try {
    const { data: dist } = await supabase
      .from('distribuidores')
      .select('*')
      .ilike('nome', '%brancaleone%')
      .single();
    
    console.log(`🏢 Distribuidor: ${dist.nome}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Buscar todos os produtos
    let todosProdutos = [];
    let offset = 0;
    const pageSize = 1000;
    
    while (true) {
      const { data: batch } = await supabase
        .from('products')
        .select('id, mercos_id, name, codigo_mercos, active')
        .eq('distribuidor_id', dist.id)
        .not('codigo_mercos', 'is', null)
        .neq('codigo_mercos', '')
        .range(offset, offset + pageSize - 1);
      
      if (!batch || batch.length === 0) break;
      todosProdutos.push(...batch);
      
      if (batch.length < pageSize) break;
      offset += pageSize;
    }
    
    console.log(`📦 Produtos com código: ${todosProdutos.length.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    // Agrupar por codigo_mercos
    const porCodigo = new Map();
    
    todosProdutos.forEach(p => {
      const codigo = p.codigo_mercos;
      if (!porCodigo.has(codigo)) {
        porCodigo.set(codigo, []);
      }
      porCodigo.get(codigo).push(p);
    });
    
    // Encontrar duplicatas
    const duplicatas = [];
    
    porCodigo.forEach((produtos, codigo) => {
      if (produtos.length > 1) {
        duplicatas.push({ codigo, produtos });
      }
    });
    
    console.log(`📊 ANÁLISE:\n`);
    console.log(`   Códigos únicos: ${porCodigo.size.toLocaleString('pt-BR')}`);
    console.log(`   Códigos duplicados: ${duplicatas.length.toLocaleString('pt-BR')}\n`);
    console.log('='.repeat(80) + '\n');
    
    if (duplicatas.length > 0) {
      console.log(`⚠️  ENCONTRADAS ${duplicatas.length} DUPLICATAS:\n`);
      
      // Mostrar as primeiras 20
      duplicatas.slice(0, 20).forEach((dup, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. Código: ${dup.codigo} (${dup.produtos.length} produtos)`);
        dup.produtos.forEach(p => {
          console.log(`       - ID: ${p.id.substring(0, 8)}... | Mercos ID: ${p.mercos_id} | Active: ${p.active}`);
          console.log(`         ${p.name?.substring(0, 70)}`);
        });
        console.log('');
      });
      
      if (duplicatas.length > 20) {
        console.log(`   ... e mais ${duplicatas.length - 20} duplicatas\n`);
      }
      
      console.log('='.repeat(80) + '\n');
      console.log('💡 SOLUÇÕES POSSÍVEIS:\n');
      console.log('   1. REMOVER A CONSTRAINT: Permitir códigos duplicados');
      console.log('   2. MANTER O MAIS RECENTE: Deletar produtos mais antigos');
      console.log('   3. MANTER O ATIVO: Deletar produtos inativos\n');
      
      // Contar quantas duplicatas têm um ativo e outro inativo
      let duplicatasAtivoInativo = 0;
      duplicatas.forEach(dup => {
        const ativos = dup.produtos.filter(p => p.active);
        const inativos = dup.produtos.filter(p => !p.active);
        if (ativos.length > 0 && inativos.length > 0) {
          duplicatasAtivoInativo++;
        }
      });
      
      console.log(`   📊 ${duplicatasAtivoInativo} duplicatas têm produtos ativos E inativos\n`);
      console.log(`   ✅ Recomendação: Deletar produtos INATIVOS quando houver duplicata\n`);
    } else {
      console.log('✅ NENHUMA DUPLICATA ENCONTRADA!\n');
    }
    
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

verificarDuplicatas().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro fatal:', err);
  process.exit(1);
});
