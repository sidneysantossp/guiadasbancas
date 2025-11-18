/**
 * Script para atualizar codigo_mercos diretamente via Supabase
 * Executa localmente sem timeout
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function atualizarCodigos() {
  console.log('🔄 ATUALIZAÇÃO DE CÓDIGOS MERCOS - VERSÃO DIRETA\n');
  
  // 1. Buscar distribuidor Bambino
  const { data: bambino, error: bambinoError } = await supabase
    .from('distribuidores')
    .select('*')
    .ilike('nome', '%bambino%')
    .single();

  if (bambinoError || !bambino) {
    console.error('❌ Erro ao buscar Bambino:', bambinoError);
    return;
  }

  console.log(`📦 Distribuidor: ${bambino.nome}`);
  console.log(`🆔 ID: ${bambino.id}\n`);

  // 2. Buscar TODOS os produtos da Bambino no nosso banco
  console.log('📊 Buscando produtos no banco...');
  const { data: produtos, error: produtosError } = await supabase
    .from('products')
    .select('id, name, mercos_id, codigo_mercos')
    .eq('distribuidor_id', bambino.id);

  if (produtosError) {
    console.error('❌ Erro ao buscar produtos:', produtosError);
    return;
  }

  console.log(`📦 Total de produtos encontrados: ${produtos.length}\n`);

  // 3. Buscar códigos diretamente da API Mercos via HTTP
  console.log('🔍 Buscando produtos na API Mercos...\n');
  
  const apiUrl = bambino.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': bambino.application_token,
    'CompanyToken': bambino.company_token,
    'Content-Type': 'application/json'
  };

  let todosProdutosMercos = [];
  let afterId = null;
  let tentativa = 0;
  const maxTentativas = 20; // Máximo de 4000 produtos

  try {
    while (tentativa < maxTentativas) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      console.log(`   Lote ${tentativa + 1}: Buscando...`);
      
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        console.error(`❌ Erro na API: ${response.status} ${response.statusText}`);
        break;
      }

      const batch = await response.json();
      
      if (!batch || batch.length === 0) {
        console.log('   ✅ Fim dos produtos\n');
        break;
      }

      todosProdutosMercos.push(...batch);
      console.log(`   ✅ Buscados ${todosProdutosMercos.length} produtos total`);

      if (batch.length < 200) break;
      
      afterId = batch[batch.length - 1].id;
      tentativa++;

      // Pequeno delay para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  } catch (apiError) {
    console.error('\n❌ Erro ao buscar da API Mercos:', apiError.message);
    console.log('⚠️  Continuando com produtos já buscados...\n');
  }

  console.log(`\n✅ Total de produtos na Mercos: ${todosProdutosMercos.length}\n`);

  // 4. Criar mapa de mercos_id -> codigo
  const codigosPorMercosId = new Map();
  let comCodigo = 0;
  let semCodigo = 0;

  for (const produto of todosProdutosMercos) {
    if (produto.codigo && produto.codigo.trim() !== '') {
      codigosPorMercosId.set(produto.id, produto.codigo);
      comCodigo++;
    } else {
      semCodigo++;
    }
  }

  console.log('📊 ANÁLISE DOS PRODUTOS DA MERCOS:');
  console.log(`   ✅ Com código: ${comCodigo}`);
  console.log(`   ❌ Sem código: ${semCodigo}\n`);

  // 5. Atualizar produtos no banco
  console.log('🔄 Atualizando códigos no banco...\n');
  
  let atualizados = 0;
  let semMudanca = 0;
  let naoEncontrados = 0;
  let erros = 0;

  for (const produto of produtos) {
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
      console.error(`   ❌ Erro em ${produto.name}: ${error.message}`);
      erros++;
    } else {
      atualizados++;
      
      if (atualizados % 100 === 0) {
        console.log(`   ✅ ${atualizados} produtos atualizados...`);
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n✨ ATUALIZAÇÃO CONCLUÍDA!\n');
  console.log('📊 RESULTADO:');
  console.log(`   ✅ Atualizados: ${atualizados}`);
  console.log(`   ➖ Sem mudança: ${semMudanca}`);
  console.log(`   ⚠️  Não encontrados na API: ${naoEncontrados}`);
  console.log(`   ❌ Erros: ${erros}\n`);

  // 6. Verificar resultado final
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
  console.log(`   📦 Total com código: ${totalComCodigo || 0}`);
  console.log(`   ✅ Ativos com código: ${ativosComCodigo || 0} de ${totalAtivos || 0}`);
  
  if (ativosComCodigo && totalAtivos) {
    const percentual = Math.round((ativosComCodigo / totalAtivos) * 100);
    console.log(`   📈 Percentual: ${percentual}%`);
  }

  // 7. Verificar produto JP09 especificamente
  console.log('\n🔍 VERIFICANDO PRODUTO JP09:');
  const { data: jp09 } = await supabase
    .from('products')
    .select('id, name, codigo_mercos, mercos_id')
    .eq('distribuidor_id', bambino.id)
    .eq('codigo_mercos', 'JP09')
    .maybeSingle();

  if (jp09) {
    console.log(`   ✅ ENCONTRADO!`);
    console.log(`   📦 Nome: ${jp09.name}`);
    console.log(`   🔢 Mercos ID: ${jp09.mercos_id}`);
    console.log(`   📝 Código: ${jp09.codigo_mercos}`);
  } else {
    console.log(`   ❌ NÃO ENCONTRADO`);
    console.log(`   💡 O código JP09 pode não existir na API Mercos`);
  }

  console.log('\n' + '='.repeat(80));
  console.log('\n🎉 CONCLUÍDO! Agora você pode testar o upload de imagens.\n');
}

atualizarCodigos()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('\n💥 ERRO FATAL:', err);
    process.exit(1);
  });
