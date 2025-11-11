const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugOrderingIssue() {
  try {
    console.log('🔍 Debugando problema de ordenação...\n');
    
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    // 1. BUSCAR SEM ORDENAÇÃO
    console.log('📊 1. CONSULTA SEM ORDENAÇÃO:');
    const { data: unordered } = await supabase
      .from('distribuidor_categories')
      .select('id, nome, mercos_id')
      .eq('distribuidor_id', brancaleoneId)
      .limit(5);
    
    console.log('Primeiras 5 sem ordenação:');
    unordered?.forEach((cat, index) => {
      console.log(`   ${index + 1}. "${cat.nome}"`);
    });
    
    // 2. BUSCAR COM ORDENAÇÃO ASCENDENTE
    console.log('\n📊 2. CONSULTA COM ORDENAÇÃO ASCENDENTE:');
    const { data: ascending } = await supabase
      .from('distribuidor_categories')
      .select('id, nome, mercos_id')
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(5);
    
    console.log('Primeiras 5 com ordenação ascendente:');
    ascending?.forEach((cat, index) => {
      console.log(`   ${index + 1}. "${cat.nome}"`);
    });
    
    // 3. BUSCAR COM ORDENAÇÃO DESCENDENTE
    console.log('\n📊 3. CONSULTA COM ORDENAÇÃO DESCENDENTE:');
    const { data: descending } = await supabase
      .from('distribuidor_categories')
      .select('id, nome, mercos_id')
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: false })
      .limit(5);
    
    console.log('Primeiras 5 com ordenação descendente:');
    descending?.forEach((cat, index) => {
      console.log(`   ${index + 1}. "${cat.nome}"`);
    });
    
    // 4. BUSCAR ESPECIFICAMENTE A CATEGORIA AAA
    console.log('\n📊 4. BUSCA ESPECÍFICA DA CATEGORIA AAA:');
    const { data: aaaCategory } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .ilike('nome', '%AAA_HOMOLOGACAO%');
    
    if (aaaCategory && aaaCategory.length > 0) {
      console.log('✅ Categoria AAA encontrada:');
      aaaCategory.forEach(cat => {
        console.log(`   Nome: "${cat.nome}"`);
        console.log(`   ID: ${cat.id}`);
        console.log(`   Ativo: ${cat.ativo}`);
        console.log(`   Created: ${cat.created_at}`);
      });
    } else {
      console.log('❌ Categoria AAA NÃO encontrada');
    }
    
    // 5. BUSCAR TODAS E ORDENAR MANUALMENTE
    console.log('\n📊 5. BUSCAR TODAS E VERIFICAR ORDENAÇÃO:');
    const { data: allCategories } = await supabase
      .from('distribuidor_categories')
      .select('nome')
      .eq('distribuidor_id', brancaleoneId);
    
    if (allCategories) {
      // Ordenar manualmente no JavaScript
      const sorted = allCategories.sort((a, b) => a.nome.localeCompare(b.nome));
      
      console.log(`Total de categorias: ${sorted.length}`);
      console.log('Primeiras 10 após ordenação manual:');
      sorted.slice(0, 10).forEach((cat, index) => {
        const highlight = cat.nome.includes('AAA_HOMOLOGACAO') ? ' ⭐' : '';
        console.log(`   ${index + 1}. "${cat.nome}"${highlight}`);
      });
      
      // Encontrar posição da categoria AAA
      const aaaPosition = sorted.findIndex(cat => cat.nome.includes('AAA_HOMOLOGACAO'));
      if (aaaPosition >= 0) {
        console.log(`\n🎯 Categoria AAA encontrada na posição: ${aaaPosition + 1}`);
      } else {
        console.log('\n❌ Categoria AAA não encontrada na ordenação manual');
      }
    }
    
    // 6. TENTAR FORÇAR REFRESH DO CACHE
    console.log('\n💾 6. FORÇANDO REFRESH...');
    
    // Atualizar a categoria para forçar refresh
    const { error: updateError } = await supabase
      .from('distribuidor_categories')
      .update({ updated_at: new Date().toISOString() })
      .eq('distribuidor_id', brancaleoneId)
      .ilike('nome', '%AAA_HOMOLOGACAO%');
    
    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError.message);
    } else {
      console.log('✅ Categoria atualizada para forçar refresh');
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o debug
debugOrderingIssue();
