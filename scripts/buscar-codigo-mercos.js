const { createClient } = require('@supabase/supabase-js');
const { MercosAPI } = require('../lib/mercos-api.ts');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function buscarCodigo() {
  const codigoBusca = process.argv[2] || '1220';
  
  console.log(`🔍 BUSCANDO CÓDIGO "${codigoBusca}" NA API MERCOS DA BAMBINO\n`);
  
  // Buscar o distribuidor Bambino
  const { data: bambino } = await supabase
    .from('distribuidores')
    .select('id, nome, application_token, company_token, base_url')
    .ilike('nome', '%bambino%')
    .single();

  if (!bambino) {
    console.log('❌ Distribuidor Bambino não encontrado');
    return;
  }

  console.log(`📦 Distribuidor: ${bambino.nome}`);
  console.log(`🆔 ID: ${bambino.id}\n`);

  // Inicializar API Mercos
  const mercosApi = new MercosAPI({
    applicationToken: bambino.application_token,
    companyToken: bambino.company_token,
    baseUrl: bambino.base_url || 'https://app.mercos.com/api/v1',
  });

  console.log('🔄 Testando conexão com API Mercos...');
  const connectionTest = await mercosApi.testConnection();
  
  if (!connectionTest.success) {
    console.log(`❌ Falha na conexão: ${connectionTest.error}`);
    return;
  }
  
  console.log('✅ Conexão OK\n');
  console.log('🔍 Buscando produtos na API Mercos...\n');

  // Buscar TODOS os produtos da Mercos (em lotes)
  let encontrados = [];
  let offset = 0;
  const limit = 200;
  let hasMore = true;
  let totalBuscados = 0;

  while (hasMore) {
    try {
      const produtos = await mercosApi.getBatchProdutos({ 
        limit,
        afterId: offset > 0 ? offset : null
      });

      totalBuscados += produtos.length;
      console.log(`   Buscados ${totalBuscados} produtos...`);

      // Procurar pelo código
      for (const produto of produtos) {
        // Buscar em diferentes campos onde o código pode estar
        const codigo = produto.codigo || '';
        const nome = produto.nome || '';
        const observacoes = produto.observacoes || '';
        
        if (codigo.includes(codigoBusca) || 
            nome.includes(codigoBusca) ||
            observacoes.includes(codigoBusca)) {
          encontrados.push(produto);
        }
      }

      if (produtos.length < limit) {
        hasMore = false;
      } else {
        offset = produtos[produtos.length - 1].id;
      }

      // Limitar busca a 2000 produtos para não demorar muito
      if (totalBuscados >= 2000) {
        console.log('\n⚠️  Limite de 2000 produtos atingido. Parando busca...');
        break;
      }
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      break;
    }
  }

  console.log(`\n✅ Busca concluída! Total buscado: ${totalBuscados} produtos\n`);
  console.log('=' .repeat(80));

  if (encontrados.length === 0) {
    console.log(`\n❌ Nenhum produto encontrado com código "${codigoBusca}"\n`);
    console.log('💡 POSSIBILIDADES:');
    console.log('   1. O código não existe na conta Mercos da Bambino');
    console.log('   2. O código está em um campo diferente');
    console.log('   3. É necessário buscar mais produtos (mais de 2000)\n');
  } else {
    console.log(`\n✅ ENCONTRADOS ${encontrados.length} PRODUTO(S) COM CÓDIGO "${codigoBusca}":\n`);
    
    encontrados.forEach((p, i) => {
      console.log(`${i + 1}. NOME: ${p.nome}`);
      console.log(`   🔢 MERCOS ID: ${p.id}`);
      console.log(`   📦 CÓDIGO: ${p.codigo || '❌ VAZIO'}`);
      console.log(`   💰 PREÇO: R$ ${p.preco_tabela}`);
      console.log(`   📊 ESTOQUE: ${p.saldo_estoque}`);
      console.log(`   ✅ ATIVO: ${p.ativo ? 'Sim' : 'Não'}`);
      console.log(`   🗑️  EXCLUÍDO: ${p.excluido ? 'Sim' : 'Não'}`);
      console.log(`   📝 OBSERVAÇÕES: ${p.observacoes || 'Nenhuma'}`);
      console.log('');
      console.log('   📄 DADOS COMPLETOS (JSON):');
      console.log(JSON.stringify(p, null, 2));
      console.log('');
      console.log('-'.repeat(80));
      console.log('');
    });
  }

  // Verificar se existe no nosso banco
  console.log('🔍 VERIFICANDO NO NOSSO BANCO DE DADOS...\n');
  
  const { data: produtosNoBanco } = await supabase
    .from('products')
    .select('id, name, mercos_id, codigo_mercos, active')
    .eq('distribuidor_id', bambino.id)
    .or(`codigo_mercos.ilike.%${codigoBusca}%,name.ilike.%${codigoBusca}%`);

  if (produtosNoBanco && produtosNoBanco.length > 0) {
    console.log(`✅ ENCONTRADOS ${produtosNoBanco.length} NO NOSSO BANCO:\n`);
    produtosNoBanco.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Mercos ID: ${p.mercos_id}`);
      console.log(`   Código Mercos: ${p.codigo_mercos || '❌ VAZIO'}`);
      console.log(`   Ativo: ${p.active ? 'Sim' : 'Não'}`);
      console.log('');
    });
  } else {
    console.log(`❌ Nenhum produto com código "${codigoBusca}" no nosso banco\n`);
  }
}

buscarCodigo().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
