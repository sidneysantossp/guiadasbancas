const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAPIvsDirect() {
  try {
    console.log('🔍 Comparando consulta direta vs API...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. CONSULTA DIRETA (igual ao script anterior)
    console.log('📊 1. CONSULTA DIRETA NO BANCO:');
    const { data: directCategories, error: directError } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true });

    if (directError) {
      console.error('❌ Erro na consulta direta:', directError.message);
    } else {
      console.log(`✅ Total direto: ${directCategories?.length || 0}`);
      const directTarget = directCategories?.find(cat => cat.nome && cat.nome.includes('0855e8eb'));
      console.log(`🎯 Categoria "0855e8eb" encontrada diretamente: ${directTarget ? 'SIM' : 'NÃO'}`);
      if (directTarget) {
        console.log(`   Nome: "${directTarget.nome}"`);
        console.log(`   ID: ${directTarget.id}`);
        console.log(`   Mercos ID: ${directTarget.mercos_id}`);
      }
    }
    
    // 2. CONSULTA VIA API (simulando o que a página faz)
    console.log('\n📡 2. CONSULTA VIA API:');
    try {
      const apiResponse = await fetch(`http://localhost:3000/api/admin/distribuidores/${brancaleoneId}/categorias`);
      
      if (!apiResponse.ok) {
        console.error(`❌ Erro na API: ${apiResponse.status} ${apiResponse.statusText}`);
        return;
      }
      
      const apiData = await apiResponse.json();
      console.log(`✅ Total via API: ${apiData.data?.length || 0}`);
      console.log(`🔍 Debug info da API:`, apiData.debug);
      
      const apiTarget = apiData.data?.find(cat => cat.nome && cat.nome.includes('0855e8eb'));
      console.log(`🎯 Categoria "0855e8eb" encontrada via API: ${apiTarget ? 'SIM' : 'NÃO'}`);
      if (apiTarget) {
        console.log(`   Nome: "${apiTarget.nome}"`);
        console.log(`   ID: ${apiTarget.id}`);
        console.log(`   Mercos ID: ${apiTarget.mercos_id}`);
      }
      
    } catch (apiError) {
      console.error('❌ Erro ao chamar API:', apiError.message);
      console.log('ℹ️  Tentando com localhost alternativo...');
      
      // Tentar com 127.0.0.1
      try {
        const apiResponse2 = await fetch(`http://127.0.0.1:3000/api/admin/distribuidores/${brancaleoneId}/categorias`);
        if (apiResponse2.ok) {
          const apiData2 = await apiResponse2.json();
          console.log(`✅ Total via API (127.0.0.1): ${apiData2.data?.length || 0}`);
          console.log(`🔍 Debug info da API:`, apiData2.debug);
        }
      } catch (err2) {
        console.log('❌ Também falhou com 127.0.0.1');
      }
    }
    
    // 3. COMPARAÇÃO DETALHADA
    if (directCategories && directCategories.length > 0) {
      console.log('\n📋 3. ANÁLISE DETALHADA:');
      console.log('='.repeat(80));
      
      // Mostrar primeiras 10 categorias da consulta direta
      console.log('🔍 Primeiras 10 categorias (consulta direta):');
      directCategories.slice(0, 10).forEach((cat, index) => {
        const highlight = cat.nome.includes('0855e8eb') ? ' ⭐ ESTA É A QUE VOCÊ PROCURA!' : '';
        console.log(`   ${index + 1}. "${cat.nome}" (Mercos ID: ${cat.mercos_id})${highlight}`);
      });
      
      // Verificar se há categorias duplicadas ou com problemas
      const nomesDuplicados = {};
      directCategories.forEach(cat => {
        if (nomesDuplicados[cat.nome]) {
          nomesDuplicados[cat.nome]++;
        } else {
          nomesDuplicados[cat.nome] = 1;
        }
      });
      
      const duplicados = Object.entries(nomesDuplicados).filter(([nome, count]) => count > 1);
      if (duplicados.length > 0) {
        console.log('\n⚠️  CATEGORIAS DUPLICADAS ENCONTRADAS:');
        duplicados.forEach(([nome, count]) => {
          console.log(`   "${nome}": ${count} vezes`);
        });
      } else {
        console.log('\n✅ Nenhuma categoria duplicada encontrada');
      }
      
      // Verificar categorias com nomes vazios ou null
      const categoriasProblematicas = directCategories.filter(cat => !cat.nome || cat.nome.trim() === '');
      if (categoriasProblematicas.length > 0) {
        console.log(`\n⚠️  ${categoriasProblematicas.length} categorias com nomes vazios/null encontradas`);
      } else {
        console.log('\n✅ Todas as categorias têm nomes válidos');
      }
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o debug
debugAPIvsDirect();
