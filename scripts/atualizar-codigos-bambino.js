const { createClient } = require('@supabase/supabase-js');
const { MercosAPI } = require('../lib/mercos-api.ts');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function atualizarCodigos() {
  console.log('🔄 ATUALIZAÇÃO DE CÓDIGOS - BAMBINO\n');
  
  // Buscar o distribuidor Bambino
  const { data: bambino } = await supabase
    .from('distribuidores')
    .select('*')
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

  console.log('🔍 Buscando produtos na API Mercos...\n');

  // Buscar TODOS os produtos da API Mercos
  let todosProdutos = [];
  let offset = null;
  const limit = 200;

  while (true) {
    const produtos = await mercosApi.getBatchProdutos({ 
      limit,
      afterId: offset
    });

    if (produtos.length === 0) break;

    todosProdutos.push(...produtos);
    console.log(`   Buscados ${todosProdutos.length} produtos...`);

    if (produtos.length < limit) break;
    offset = produtos[produtos.length - 1].id;
  }

  console.log(`\n✅ Total de produtos na API Mercos: ${todosProdutos.length}\n`);

  // Criar mapa de mercos_id -> codigo
  const codigosPorMercosId = new Map();
  let comCodigo = 0;
  let semCodigo = 0;

  for (const produto of todosProdutos) {
    if (produto.codigo && produto.codigo.trim() !== '') {
      codigosPorMercosId.set(produto.id, produto.codigo);
      comCodigo++;
    } else {
      semCodigo++;
    }
  }

  console.log('📊 ANÁLISE DOS PRODUTOS DA API MERCOS:');
  console.log(`   ✅ Com código: ${comCodigo}`);
  console.log(`   ❌ Sem código: ${semCodigo}`);
  console.log('');

  // Buscar produtos no nosso banco
  const { data: produtosNoBanco } = await supabase
    .from('products')
    .select('id, mercos_id, name, codigo_mercos')
    .eq('distribuidor_id', bambino.id);

  console.log(`📦 Produtos no nosso banco: ${produtosNoBanco.length}\n`);

  // Atualizar produtos que têm código na API Mercos
  let atualizados = 0;
  let semMudanca = 0;
  let naoEncontrados = 0;
  const batchSize = 100;

  console.log('🔄 Atualizando códigos...\n');

  for (let i = 0; i < produtosNoBanco.length; i += batchSize) {
    const batch = produtosNoBanco.slice(i, i + batchSize);
    
    for (const produto of batch) {
      const codigoNaMercos = codigosPorMercosId.get(produto.mercos_id);
      
      if (!codigoNaMercos) {
        naoEncontrados++;
        continue;
      }

      if (produto.codigo_mercos === codigoNaMercos) {
        semMudanca++;
        continue;
      }

      // Atualizar o código
      const { error } = await supabase
        .from('products')
        .update({ 
          codigo_mercos: codigoNaMercos,
          updated_at: new Date().toISOString()
        })
        .eq('id', produto.id);

      if (error) {
        console.error(`   ❌ Erro ao atualizar ${produto.name}:`, error);
      } else {
        atualizados++;
        if (atualizados % 50 === 0) {
          console.log(`   ✅ Atualizados ${atualizados} produtos...`);
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✨ ATUALIZAÇÃO CONCLUÍDA!\n');
  console.log('📊 RESULTADO:');
  console.log(`   ✅ Atualizados: ${atualizados}`);
  console.log(`   ➖ Sem mudança: ${semMudanca}`);
  console.log(`   ❌ Não encontrados na API: ${naoEncontrados}`);
  console.log('');

  // Verificar resultado
  const { count: totalComCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');

  const { count: totalAtivos } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true);

  const { count: ativosComCodigo } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('distribuidor_id', bambino.id)
    .eq('active', true)
    .not('codigo_mercos', 'is', null)
    .neq('codigo_mercos', '');

  console.log('📊 ESTATÍSTICAS FINAIS:');
  console.log(`   📦 Total com código: ${totalComCodigo}`);
  console.log(`   ✅ Ativos com código: ${ativosComCodigo} de ${totalAtivos}`);
  
  if (ativosComCodigo && totalAtivos) {
    const percentual = Math.round((ativosComCodigo / totalAtivos) * 100);
    console.log(`   📈 Percentual: ${percentual}%`);
  }
}

atualizarCodigos().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
