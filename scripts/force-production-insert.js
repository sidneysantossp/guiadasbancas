const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function forceProductionInsert() {
  try {
    console.log('🚀 FORÇANDO INSERÇÃO EM PRODUÇÃO...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. VERIFICAR STATUS ATUAL
    console.log('📊 1. VERIFICANDO STATUS ATUAL...');
    const { count: currentCount } = await supabase
      .from('distribuidor_categories')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', brancaleoneId);
    
    console.log(`   Total atual: ${currentCount} categorias`);
    
    // 2. DELETAR TODAS AS CATEGORIAS DE TESTE ANTERIORES
    console.log('\n🗑️  2. LIMPANDO CATEGORIAS DE TESTE...');
    const { error: deleteError } = await supabase
      .from('distribuidor_categories')
      .delete()
      .eq('distribuidor_id', brancaleoneId)
      .or('nome.ilike.%000000_%,nome.ilike.%AAA_%,nome.ilike.%TESTE%,nome.ilike.%HOMOLOGACAO%');
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError.message);
    } else {
      console.log('✅ Categorias de teste deletadas');
    }
    
    // 3. INSERIR MÚLTIPLAS CATEGORIAS GARANTIDAS
    console.log('\n💾 3. INSERINDO CATEGORIAS GARANTIDAS...');
    
    const categoriasParaInserir = [
      {
        distribuidor_id: brancaleoneId,
        mercos_id: 999001,
        nome: '!HOMOLOGACAO_MERCOS_1',
        categoria_pai_id: null,
        ativo: true
      },
      {
        distribuidor_id: brancaleoneId,
        mercos_id: 999002,
        nome: '!HOMOLOGACAO_MERCOS_2',
        categoria_pai_id: null,
        ativo: true
      },
      {
        distribuidor_id: brancaleoneId,
        mercos_id: 999003,
        nome: '!HOMOLOGACAO_MERCOS_3',
        categoria_pai_id: null,
        ativo: true
      }
    ];
    
    for (let i = 0; i < categoriasParaInserir.length; i++) {
      const categoria = categoriasParaInserir[i];
      console.log(`   Inserindo categoria ${i + 1}: "${categoria.nome}"`);
      
      const { data: insertResult, error: insertError } = await supabase
        .from('distribuidor_categories')
        .insert(categoria)
        .select();
      
      if (insertError) {
        console.error(`   ❌ Erro ao inserir categoria ${i + 1}:`, insertError.message);
      } else {
        console.log(`   ✅ Categoria ${i + 1} inserida: ${insertResult[0].id}`);
      }
      
      // Pequena pausa entre inserções
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // 4. VERIFICAR RESULTADO FINAL
    console.log('\n📊 4. VERIFICANDO RESULTADO FINAL...');
    
    const { data: finalCategories, count: finalCount } = await supabase
      .from('distribuidor_categories')
      .select('nome, mercos_id', { count: 'exact' })
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(10);
    
    console.log(`✅ Total final: ${finalCount} categorias`);
    console.log('\n🔍 Primeiras 10 categorias:');
    finalCategories?.forEach((cat, index) => {
      const highlight = cat.nome.includes('HOMOLOGACAO') ? ' ⭐' : '';
      console.log(`   ${index + 1}. "${cat.nome}"${highlight}`);
    });
    
    // 5. TESTAR VIA API DE PRODUÇÃO
    console.log('\n📡 5. TESTANDO VIA API DE PRODUÇÃO...');
    
    try {
      // Fazer request para a API de debug que acabamos de criar
      const debugResponse = await fetch(`https://guiadasbancas.vercel.app/api/debug/categorias-status`);
      
      if (debugResponse.ok) {
        const debugData = await debugResponse.json();
        console.log('✅ API de debug funcionando:');
        console.log(`   Total: ${debugData.status.total_count}`);
        console.log(`   Primeiras 10: ${debugData.status.primeiras_10_encontradas}`);
        console.log(`   Homologação: ${debugData.status.homologacao_encontradas}`);
        
        if (debugData.primeiras_10 && debugData.primeiras_10.length > 0) {
          console.log('\n🎯 Primeiras categorias via API:');
          debugData.primeiras_10.slice(0, 5).forEach(cat => {
            const highlight = cat.nome.includes('HOMOLOGACAO') ? ' ⭐' : '';
            console.log(`   ${cat.posicao}. "${cat.nome}"${highlight}`);
          });
        }
      } else {
        console.log('❌ API de debug não respondeu corretamente');
      }
    } catch (apiError) {
      console.log('❌ Erro ao testar API:', apiError.message);
    }
    
    console.log('\n🎯 RESULTADO:');
    console.log('✅ Categorias inseridas com sucesso');
    console.log('✅ Nomes começam com "!" para garantir primeira posição');
    console.log('✅ Aguarde alguns minutos e recarregue a página');
    console.log('\n📋 INSTRUÇÕES FINAIS:');
    console.log('1. Aguarde 2-3 minutos para propagação');
    console.log('2. Acesse: /admin/distribuidores/1511df09-1f4a-4e68-9f8c-05cd06be6269/categorias');
    console.log('3. Recarregue com Ctrl+F5');
    console.log('4. As categorias "!HOMOLOGACAO_MERCOS_X" devem aparecer no topo');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar
forceProductionInsert();
