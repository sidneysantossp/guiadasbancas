const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function corrigirStatus() {
  const distribuidorId = process.argv[2]; // ID do distribuidor
  const dryRun = process.argv[3] !== '--execute'; // Modo dry-run por padrão
  
  if (!distribuidorId) {
    console.log('❌ Uso: node corrigir-status-produtos.js <distribuidor_id> [--execute]');
    console.log('   Exemplo: node corrigir-status-produtos.js 1511df09-1f4a-4e68-9f8c-05cd06be6269 --execute');
    return;
  }

  console.log('🔄 CORREÇÃO DE STATUS DE PRODUTOS\n');
  
  if (dryRun) {
    console.log('⚠️  MODO DRY-RUN (simulação)');
    console.log('   Para executar de verdade, adicione --execute no final\n');
  } else {
    console.log('⚠️  MODO EXECUÇÃO - VAI ATUALIZAR O BANCO!\n');
  }

  // Buscar distribuidor
  const { data: distribuidor } = await supabase
    .from('distribuidores')
    .select('*')
    .eq('id', distribuidorId)
    .single();

  if (!distribuidor) {
    console.log('❌ Distribuidor não encontrado');
    return;
  }

  console.log(`📦 Distribuidor: ${distribuidor.nome}\n`);

  // Buscar produtos da API Mercos
  console.log('🔍 Buscando produtos na API Mercos...\n');
  
  const apiUrl = distribuidor.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': distribuidor.application_token,
    'CompanyToken': distribuidor.company_token,
    'Content-Type': 'application/json'
  };

  let todosProdutosMercos = [];
  let afterId = null;
  let tentativa = 0;

  try {
    while (true) {
      const url = afterId 
        ? `${apiUrl}/produtos?limit=200&after_id=${afterId}`
        : `${apiUrl}/produtos?limit=200`;

      const response = await fetch(url, { headers });
      
      if (!response.ok) break;

      const batch = await response.json();
      if (!batch || batch.length === 0) break;

      todosProdutosMercos.push(...batch);
      tentativa++;
      
      if (tentativa % 10 === 0) {
        console.log(`   Buscados ${todosProdutosMercos.length} produtos...`);
      }

      if (batch.length < 200) break;
      afterId = batch[batch.length - 1].id;
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }

  console.log(`\n✅ Total na Mercos: ${todosProdutosMercos.length}\n`);

  // Criar mapa de status por mercos_id
  const statusPorMercosId = new Map();
  let ativosNaMercos = 0;
  let inativosNaMercos = 0;

  for (const p of todosProdutosMercos) {
    const ativo = p.ativo && !p.excluido;
    statusPorMercosId.set(p.id, ativo);
    if (ativo) ativosNaMercos++;
    else inativosNaMercos++;
  }

  console.log('📊 STATUS NA MERCOS:');
  console.log(`   ✅ Ativos: ${ativosNaMercos}`);
  console.log(`   ❌ Inativos: ${inativosNaMercos}\n`);

  // Buscar produtos no banco
  const { data: produtosNoBanco } = await supabase
    .from('products')
    .select('id, name, mercos_id, active')
    .eq('distribuidor_id', distribuidorId);

  console.log(`📦 Produtos no banco: ${produtosNoBanco.length}\n`);

  // Analisar divergências
  let paraAtivar = 0;
  let paraDesativar = 0;
  let jaCorretos = 0;
  let naoEncontrados = 0;
  const acoesDetalhadas = [];

  for (const p of produtosNoBanco) {
    const statusNaMercos = statusPorMercosId.get(p.mercos_id);
    
    if (statusNaMercos === undefined) {
      naoEncontrados++;
      continue;
    }

    if (p.active === statusNaMercos) {
      jaCorretos++;
    } else if (statusNaMercos && !p.active) {
      paraAtivar++;
      if (acoesDetalhadas.length < 5) {
        acoesDetalhadas.push({ acao: 'ATIVAR', ...p });
      }
    } else if (!statusNaMercos && p.active) {
      paraDesativar++;
      if (acoesDetalhadas.length < 10) {
        acoesDetalhadas.push({ acao: 'DESATIVAR', ...p });
      }
    }
  }

  console.log('📊 ANÁLISE:');
  console.log(`   ✅ Já corretos: ${jaCorretos}`);
  console.log(`   🔄 Para ativar: ${paraAtivar}`);
  console.log(`   🔄 Para desativar: ${paraDesativar}`);
  console.log(`   ⚠️  Não encontrados na Mercos: ${naoEncontrados}\n`);

  if (acoesDetalhadas.length > 0) {
    console.log('📋 EXEMPLOS DE AÇÕES:\n');
    acoesDetalhadas.forEach((a, i) => {
      console.log(`   ${i+1}. ${a.acao}: ${a.name}`);
      console.log(`      Status atual: ${a.active ? 'ATIVO' : 'INATIVO'}`);
      console.log('');
    });
  }

  if (!dryRun && (paraAtivar + paraDesativar) > 0) {
    console.log('🔄 EXECUTANDO ATUALIZAÇÕES...\n');
    
    let atualizados = 0;
    let erros = 0;

    for (const p of produtosNoBanco) {
      const statusNaMercos = statusPorMercosId.get(p.mercos_id);
      
      if (statusNaMercos === undefined || p.active === statusNaMercos) {
        continue;
      }

      const { error } = await supabase
        .from('products')
        .update({ 
          active: statusNaMercos,
          updated_at: new Date().toISOString()
        })
        .eq('id', p.id);

      if (error) {
        erros++;
      } else {
        atualizados++;
        if (atualizados % 100 === 0) {
          console.log(`   ✅ ${atualizados} produtos atualizados...`);
        }
      }
    }

    console.log(`\n✅ CONCLUÍDO!`);
    console.log(`   Atualizados: ${atualizados}`);
    console.log(`   Erros: ${erros}\n`);
  } else if (dryRun) {
    console.log('💡 Para executar as atualizações, rode com --execute\n');
  }

  console.log('=' .repeat(80));
}

corrigirStatus().then(() => process.exit(0)).catch(err => {
  console.error('💥 Erro:', err);
  process.exit(1);
});
