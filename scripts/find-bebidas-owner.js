const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBebidasOwner() {
  try {
    const BEBIDAS_ID = 'c230ed83-b08a-4b7a-8f19-7c8230f36c86';
    const BAMBINO_ID = '3a989c56-bbd3-4769-b076-a83483e39542';
    
    console.log('🔍 Buscando TODOS os produtos de Bebidas...\n');

    // Buscar todos os produtos com categoria Bebidas (ativos E inativos)
    const { data: bebidas, error } = await supabase
      .from('products')
      .select('id, name, category_id, distribuidor_id, active, banca_id')
      .eq('category_id', BEBIDAS_ID)
      .limit(50);

    if (error) {
      console.error('❌ Erro:', error.message);
      return;
    }

    if (!bebidas || bebidas.length === 0) {
      console.log('❌ Nenhum produto de Bebidas encontrado!');
      return;
    }

    console.log(`✅ Total de produtos com categoria Bebidas: ${bebidas.length}\n`);

    // Agrupar por distribuidor
    const porDistribuidor = {};
    const ativos = bebidas.filter(p => p.active);
    const inativos = bebidas.filter(p => !p.active);

    console.log(`📊 Ativos: ${ativos.length}`);
    console.log(`📊 Inativos: ${inativos.length}\n`);

    bebidas.forEach(p => {
      const dist = p.distribuidor_id || 'SEM_DISTRIBUIDOR';
      if (!porDistribuidor[dist]) {
        porDistribuidor[dist] = { ativos: [], inativos: [] };
      }
      if (p.active) {
        porDistribuidor[dist].ativos.push(p.name);
      } else {
        porDistribuidor[dist].inativos.push(p.name);
      }
    });

    console.log('🏢 POR DISTRIBUIDOR:\n');
    for (const [distId, produtos] of Object.entries(porDistribuidor)) {
      const isBambino = distId === BAMBINO_ID ? ' ⭐ (BAMBINO)' : '';
      console.log(`   ${distId}${isBambino}`);
      console.log(`      Ativos: ${produtos.ativos.length}`);
      console.log(`      Inativos: ${produtos.inativos.length}`);
      if (produtos.ativos.length > 0) {
        console.log(`      Exemplos ativos: ${produtos.ativos.slice(0, 3).join(', ')}`);
      }
      console.log('');
    }

    // Verificar especificamente Bambino
    const bambinoBebidas = bebidas.filter(p => p.distribuidor_id === BAMBINO_ID);
    console.log(`\n🎯 BAMBINO + BEBIDAS:\n`);
    if (bambinoBebidas.length > 0) {
      console.log(`   Total: ${bambinoBebidas.length} produtos`);
      console.log(`   Ativos: ${bambinoBebidas.filter(p => p.active).length}`);
      console.log(`   Inativos: ${bambinoBebidas.filter(p => !p.active).length}`);
      console.log('\n   Lista:');
      bambinoBebidas.forEach((p, i) => {
        const status = p.active ? '✅' : '❌';
        console.log(`      ${i + 1}. ${status} ${p.name}`);
      });
    } else {
      console.log(`   ❌ NENHUM produto de Bebidas da Bambino encontrado!`);
      console.log('\n   💡 SOLUÇÃO:');
      console.log('   1. Ativar os produtos de Bebidas da Bambino (se existirem inativos)');
      console.log('   2. OU atualizar category_id dos produtos da Bambino para Bebidas');
      console.log('   3. OU escolher outra categoria que os produtos da Bambino já têm');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

findBebidasOwner();
