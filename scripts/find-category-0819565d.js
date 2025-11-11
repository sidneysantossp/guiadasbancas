const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findCategory0819565d() {
  try {
    console.log('🔍 Procurando categoria "0819565d"...\n');
    
    // 1. BUSCAR EM TODOS OS DISTRIBUIDORES
    console.log('📊 1. VERIFICANDO EM TODOS OS DISTRIBUIDORES...');
    const { data: allCategories, error: allError } = await supabase
      .from('distribuidor_categories')
      .select('*, distribuidores(nome)')
      .ilike('nome', '%0819565d%');
    
    if (allError) {
      console.error('❌ Erro ao consultar banco:', allError.message);
    } else if (allCategories && allCategories.length > 0) {
      console.log('✅ ENCONTRADA(S) NO BANCO:');
      allCategories.forEach(cat => {
        console.log(`   ID: ${cat.id}`);
        console.log(`   Mercos ID: ${cat.mercos_id}`);
        console.log(`   Nome: "${cat.nome}"`);
        console.log(`   Distribuidor: ${cat.distribuidores?.nome || 'N/A'} (${cat.distribuidor_id})`);
        console.log(`   Ativo: ${cat.ativo}`);
        console.log('   ---');
      });
    } else {
      console.log('❌ NÃO encontrada no banco de dados');
    }
    
    // 2. BUSCAR NA API MERCOS COM PAGINAÇÃO COMPLETA
    console.log('\n📡 2. VERIFICANDO NA API MERCOS...');
    
    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    const companyToken = '4b866744-a086-11f0-ada6-5e65486a6283';
    
    let allCategorias = [];
    let dataInicial = '2000-01-01T00:00:00';
    let hasMore = true;
    let pageCount = 0;
    let found = false;
    
    while (hasMore && pageCount < 30 && !found) {
      pageCount++;
      
      const endpoint = `/categorias?alterado_apos=${encodeURIComponent(dataInicial)}&limit=100`;
      const url = `https://sandbox.mercos.com/api/v1${endpoint}`;
      
      console.log(`   📄 Página ${pageCount} (timestamp: ${dataInicial})`);
      
      const headers = {
        'ApplicationToken': SANDBOX_APP_TOKEN,
        'CompanyToken': companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetch(url, { headers });

      if (response.status === 429) {
        const throttleError = await response.json();
        const waitTime = throttleError.tempo_ate_permitir_novamente * 1000;
        console.log(`   ⏳ Throttling: aguardando ${throttleError.tempo_ate_permitir_novamente}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (!response.ok) {
        console.error(`   ❌ Erro na página ${pageCount}:`, response.status);
        break;
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      
      console.log(`   📦 Recebidas ${categoriasArray.length} categorias`);
      
      if (categoriasArray.length === 0) {
        console.log('   ✅ Fim da paginação');
        hasMore = false;
        break;
      }
      
      // Procurar pela categoria específica nesta página
      const targetCategory = categoriasArray.find(cat => cat.nome && cat.nome.includes('0819565d'));
      
      if (targetCategory) {
        console.log('\n🎯 CATEGORIA "0819565d" ENCONTRADA NA API MERCOS:');
        console.log('='.repeat(60));
        console.log(`   ID: ${targetCategory.id}`);
        console.log(`   Nome: "${targetCategory.nome}"`);
        console.log(`   Categoria Pai ID: ${targetCategory.categoria_pai_id}`);
        console.log(`   Última Alteração: ${targetCategory.ultima_alteracao}`);
        console.log(`   Excluído: ${targetCategory.excluido}`);
        console.log('='.repeat(60));
        found = true;
        
        // Tentar inserir no banco para cada distribuidor
        console.log('\n💾 INSERINDO NO BANCO DE DADOS...');
        const distribuidores = [
          { id: '1511df09-1f4a-4e68-9f8c-05cd06be6269', nome: 'Brancaleone Publicações' },
          { id: 'e22dceb8-9a30-452b-b25d-52fe3ea48880', nome: 'Categoria' }
        ];
        
        for (const distribuidor of distribuidores) {
          console.log(`\n📋 Verificando distribuidor: ${distribuidor.nome}`);
          
          const { data: existing } = await supabase
            .from('distribuidor_categories')
            .select('id')
            .eq('distribuidor_id', distribuidor.id)
            .eq('mercos_id', targetCategory.id)
            .single();

          if (existing) {
            console.log(`✅ Categoria já existe no ${distribuidor.nome}:`, existing.id);
          } else {
            const { data: insertResult, error: insertError } = await supabase
              .from('distribuidor_categories')
              .insert({
                distribuidor_id: distribuidor.id,
                mercos_id: targetCategory.id,
                nome: targetCategory.nome,
                categoria_pai_id: targetCategory.categoria_pai_id,
                ativo: !targetCategory.excluido
              })
              .select();
            
            if (insertError) {
              console.error(`❌ Erro ao inserir no ${distribuidor.nome}:`, insertError.message);
            } else {
              console.log(`✅ Categoria inserida no ${distribuidor.nome}!`);
              console.log(`   ID no banco: ${insertResult[0].id}`);
            }
          }
        }
        
        break;
      }
      
      allCategorias = [...allCategorias, ...categoriasArray];

      // Verificar se há mais páginas
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
      
      if (limitouRegistros === '1' && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        dataInicial = ultimaCategoria.ultima_alteracao;
      } else {
        hasMore = false;
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    if (!found) {
      console.log('\n❌ Categoria "0819565d" NÃO encontrada na API Mercos');
      console.log(`📊 Total de categorias verificadas: ${allCategorias.length}`);
      
      // Mostrar algumas categorias similares
      const similares = allCategorias.filter(cat => 
        cat.nome && (cat.nome.includes('081') || cat.nome.includes('565') || cat.nome.includes('19'))
      );
      
      if (similares.length > 0) {
        console.log('\n🔍 Categorias similares encontradas:');
        similares.slice(0, 10).forEach((cat, index) => {
          console.log(`   ${index + 1}. "${cat.nome}" (ID: ${cat.id})`);
        });
      }
    }
    
    // 3. RESUMO FINAL
    console.log('\n📋 RESUMO FINAL:');
    console.log(`   Páginas da API verificadas: ${pageCount}`);
    console.log(`   Total de categorias na API: ${allCategorias.length}`);
    console.log(`   Categoria "0819565d" encontrada: ${found ? 'SIM' : 'NÃO'}`);
    console.log(`   Categoria "0819565d" no banco: ${allCategories && allCategories.length > 0 ? 'SIM' : 'NÃO'}`);

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar a busca
findCategory0819565d();
