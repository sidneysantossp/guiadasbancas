const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// ID fixo da Brancaleone (mesmo usado nas telas/admin)
const BRANCALEONE_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function getDistribuidorTokens() {
  const { data, error } = await supabase
    .from('distribuidores')
    .select('nome, application_token, company_token, base_url')
    .eq('id', BRANCALEONE_ID)
    .single();

  if (error) {
    throw new Error('Erro ao buscar distribuidor no Supabase: ' + error.message);
  }

  if (!data.application_token || !data.company_token) {
    throw new Error('Distribuidor não possui application_token/company_token configurados.');
  }

  const baseUrl = data.base_url || 'https://app.mercos.com/api/v1';

  return {
    nome: data.nome,
    applicationToken: data.application_token,
    companyToken: data.company_token,
    baseUrl,
  };
}

async function contarProdutosAtivosMercos() {
  console.log('\n🔍 Contando produtos ATIVOS na Mercos (Brancaleone)');
  console.log('='.repeat(70));

  const { nome, applicationToken, companyToken, baseUrl } = await getDistribuidorTokens();

  console.log(`Distribuidor: ${nome}`);
  console.log(`Base URL Mercos: ${baseUrl}`);

  // Fazemos uma requisição com limite 1 só para obter o total via headers
  const url = new URL('/produtos', baseUrl);
  url.searchParams.set('ativo', 'true');
  url.searchParams.set('limite', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Application-Token': applicationToken,
      'Company-Token': companyToken,
    },
  });

  console.log(`\nHTTP Status: ${response.status}`);

  if (!response.ok) {
    const bodyText = await response.text();
    console.error('❌ Erro ao chamar API Mercos:', bodyText.slice(0, 500));
    process.exit(1);
  }

  // Alguns ambientes usam letras diferentes (meus-pedidos-*, Meus-Pedidos-*)
  const headers = response.headers;
  const totalHeader =
    headers.get('Meus-Pedidos-Total-Registros') ||
    headers.get('meus-pedidos-total-registros') ||
    headers.get('X-Meus-Pedidos-Total-Registros') ||
    headers.get('x-meus-pedidos-total-registros');

  const limitou =
    headers.get('Meus-Pedidos-Limitou') ||
    headers.get('meus-pedidos-limitou');

  const extras =
    headers.get('Meus-Pedidos-Requisicoes-Extras') ||
    headers.get('meus-pedidos-requisicoes-extras');

  const json = await response.json().catch(() => null);

  console.log('\n📊 HEADERS RECEBIDOS (relevantes):');
  console.log('  Meus-Pedidos-Total-Registros:', totalHeader);
  console.log('  Meus-Pedidos-Limitou:', limitou);
  console.log('  Meus-Pedidos-Requisicoes-Extras:', extras);

  if (!totalHeader) {
    console.warn('\n⚠️ Header Meus-Pedidos-Total-Registros não encontrado.');
    console.warn('  JSON de exemplo (primeiro item):');
    console.dir(Array.isArray(json) ? json[0] : json, { depth: 3 });
    process.exit(1);
  }

  const totalAtivos = parseInt(totalHeader, 10) || 0;

  console.log('\n✅ RESULTADO FINAL:');
  console.log(`  Produtos ATIVOS na Mercos (Brancaleone): ${totalAtivos}`);
  console.log('='.repeat(70) + '\n');
}

contarProdutosAtivosMercos().catch((err) => {
  console.error('\n❌ Falha ao contar produtos ativos na Mercos:', err.message);
  process.exit(1);
});
