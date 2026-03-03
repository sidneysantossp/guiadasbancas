const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const BRANCALEONE_ID = '1511df09-1f4a-4e68-9f8c-05cd06be6269';

async function main() {
  // 1. Buscar tokens do distribuidor
  console.log('🔍 Buscando tokens da Brancaleone no banco...\n');
  const { data: dist, error: distErr } = await supabase
    .from('distribuidores')
    .select('id, nome, application_token, company_token, base_url, ativo')
    .eq('id', BRANCALEONE_ID)
    .single();

  if (distErr || !dist) {
    console.error('❌ Distribuidor não encontrado:', distErr?.message);
    return;
  }

  console.log(`✅ Distribuidor: ${dist.nome}`);
  console.log(`   Ativo: ${dist.ativo}`);
  console.log(`   Base URL: ${dist.base_url || 'https://app.mercos.com/api/v1'}`);
  console.log(`   ApplicationToken: ${dist.application_token?.substring(0, 20)}...`);
  console.log(`   CompanyToken: ${dist.company_token?.substring(0, 20)}...\n`);

  const baseUrl = dist.base_url || 'https://app.mercos.com/api/v1';
  const headers = {
    'ApplicationToken': dist.application_token,
    'CompanyToken': dist.company_token,
    'Content-Type': 'application/json',
  };

  // 2. Chamar API Mercos produção - categorias
  console.log('📡 Chamando API Mercos PRODUÇÃO - /categorias...\n');
  let allCategorias = [];
  let dataInicial = '2020-01-01T00:00:00';
  let lastId = null;
  let hasMore = true;
  let page = 1;

  while (hasMore) {
    const qp = new URLSearchParams();
    qp.append('alterado_apos', dataInicial);
    qp.append('limit', '200');
    qp.append('order_by', 'ultima_alteracao');
    qp.append('order_direction', 'asc');
    if (lastId) qp.append('id_maior_que', String(lastId));

    const url = `${baseUrl}/categorias?${qp.toString()}`;
    console.log(`   Página ${page}: GET ${url}`);

    const res = await fetch(url, { headers });
    console.log(`   Status: ${res.status}`);

    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
      const wait = (body.tempo_ate_permitir_novamente || 5) * 1000;
      console.log(`   ⏳ Rate limit. Aguardando ${wait / 1000}s...`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }

    if (!res.ok) {
      const text = await res.text();
      console.error(`   ❌ Erro HTTP ${res.status}: ${text}`);
      break;
    }

    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    allCategorias = [...allCategorias, ...arr];

    const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
    console.log(`   Recebidas: ${arr.length} | Limitou: ${limitou} | Total acumulado: ${allCategorias.length}`);

    if (limitou && arr.length > 0) {
      const ultima = arr[arr.length - 1];
      dataInicial = ultima.ultima_alteracao;
      lastId = ultima.id;
      page++;
    } else {
      hasMore = false;
    }
  }

  console.log(`\n✅ Total de categorias recebidas da API Mercos PRODUÇÃO: ${allCategorias.length}\n`);

  if (allCategorias.length === 0) {
    console.log('⚠️  Nenhuma categoria retornada. A API de categorias pode não estar liberada para produção ainda.');
    return;
  }

  // 3. Filtrar ativas (não excluídas)
  const ativas = allCategorias.filter(c => !c.excluido);
  const excluidas = allCategorias.filter(c => c.excluido);
  console.log(`📊 Ativas: ${ativas.length} | Excluídas: ${excluidas.length}\n`);

  // 4. Montar hierarquia
  const byId = {};
  allCategorias.forEach(c => { byId[c.id] = c; });

  const getNomePai = (cat) => {
    if (!cat.categoria_pai_id) return null;
    return byId[cat.categoria_pai_id]?.nome || `ID:${cat.categoria_pai_id}`;
  };

  // 5. Listar todas
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CATEGORIAS MERCOS PRODUÇÃO - BRANCALEONE');
  console.log('═══════════════════════════════════════════════════════════');

  // Agrupar por pai
  const raiz = ativas.filter(c => !c.categoria_pai_id);
  const filhas = ativas.filter(c => c.categoria_pai_id);

  console.log(`\n📁 CATEGORIAS RAIZ (${raiz.length}):\n`);
  raiz.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(c => {
    const subs = filhas.filter(f => f.categoria_pai_id === c.id);
    console.log(`  [${String(c.id).padStart(5)}] ${c.nome}${subs.length > 0 ? ` (${subs.length} subcategorias)` : ''}`);
    subs.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(s => {
      console.log(`         └─ [${String(s.id).padStart(5)}] ${s.nome}`);
    });
  });

  // Filhas sem pai conhecido
  const semPai = filhas.filter(f => !byId[f.categoria_pai_id]);
  if (semPai.length > 0) {
    console.log(`\n⚠️  SUBCATEGORIAS COM PAI NÃO ENCONTRADO (${semPai.length}):`);
    semPai.forEach(c => {
      console.log(`  [${c.id}] ${c.nome} (pai_id: ${c.categoria_pai_id})`);
    });
  }

  // 6. Comparar com o que já está no banco
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  CATEGORIAS JÁ SINCRONIZADAS NO SUPABASE (distribuidor_categories)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const { data: dbCats, error: dbErr } = await supabase
    .from('distribuidor_categories')
    .select('id, mercos_id, nome, ativo')
    .eq('distribuidor_id', BRANCALEONE_ID)
    .order('nome');

  if (dbErr) {
    console.error('❌ Erro ao buscar categorias do banco:', dbErr.message);
  } else {
    console.log(`Total no banco: ${dbCats?.length || 0}\n`);
    if (dbCats && dbCats.length > 0) {
      dbCats.forEach(c => {
        console.log(`  [mercos_id:${String(c.mercos_id).padStart(5)}] ${c.nome} | ativo: ${c.ativo}`);
      });
    } else {
      console.log('  (nenhuma categoria sincronizada ainda)');
    }
  }

  // 7. Resumo final
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  RESUMO');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  API Mercos Produção: ${allCategorias.length} total (${ativas.length} ativas, ${excluidas.length} excluídas)`);
  console.log(`  Banco Supabase:      ${dbCats?.length || 0} categorias sincronizadas`);
  const faltam = ativas.length - (dbCats?.length || 0);
  if (faltam > 0) {
    console.log(`  ⚠️  Faltam sincronizar: ${faltam} categorias`);
  } else if (faltam === 0) {
    console.log(`  ✅ Banco está sincronizado com a API!`);
  } else {
    console.log(`  ℹ️  Banco tem ${Math.abs(faltam)} categorias a mais que a API (podem ser excluídas)`);
  }
}

main().catch(console.error);
