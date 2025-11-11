const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDistribuidorIds() {
  try {
    console.log('🔍 Verificando IDs dos distribuidores...\n');
    
    // 1. LISTAR TODOS OS DISTRIBUIDORES
    console.log('📊 1. TODOS OS DISTRIBUIDORES:');
    const { data: distribuidores } = await supabase
      .from('distribuidores')
      .select('id, nome, ativo')
      .order('nome');
    
    if (distribuidores && distribuidores.length > 0) {
      distribuidores.forEach((dist, index) => {
        console.log(`   ${index + 1}. "${dist.nome}" (${dist.ativo ? 'Ativo' : 'Inativo'})`);
        console.log(`      ID: ${dist.id}`);
        console.log(`      URL: /admin/distribuidores/${dist.id}/categorias`);
        console.log('');
      });
    }
    
    // 2. VERIFICAR CATEGORIAS POR DISTRIBUIDOR
    console.log('📊 2. CATEGORIAS POR DISTRIBUIDOR:');
    
    for (const dist of distribuidores || []) {
      const { count } = await supabase
        .from('distribuidor_categories')
        .select('*', { count: 'exact', head: true })
        .eq('distribuidor_id', dist.id);
      
      console.log(`   ${dist.nome}: ${count || 0} categorias`);
      
      if (count && count > 0) {
        // Mostrar algumas categorias de exemplo
        const { data: exemplos } = await supabase
          .from('distribuidor_categories')
          .select('nome, mercos_id')
          .eq('distribuidor_id', dist.id)
          .order('nome')
          .limit(3);
        
        console.log(`      Exemplos: ${exemplos?.map(cat => `"${cat.nome}"`).join(', ')}`);
      }
      console.log('');
    }
    
    // 3. PROCURAR ESPECIFICAMENTE PELAS CATEGORIAS DE HOMOLOGAÇÃO
    console.log('📊 3. PROCURANDO CATEGORIAS DE HOMOLOGAÇÃO:');
    
    const categoriasHomologacao = [
      '0855e8ebc9ae443f',
      '0819565d00cd42a5',
      '!HOMOLOGACAO_FINAL_MERCOS',
      '!HOMOLOGACAO_MERCOS_1',
      '!POSTMAN_0819565d00cd42a5'
    ];
    
    for (const nomeCategoria of categoriasHomologacao) {
      console.log(`\n🔍 Procurando "${nomeCategoria}":`)
      
      const { data: encontradas } = await supabase
        .from('distribuidor_categories')
        .select('distribuidor_id, nome, mercos_id, distribuidores(nome)')
        .ilike('nome', `%${nomeCategoria}%`);
      
      if (encontradas && encontradas.length > 0) {
        encontradas.forEach(cat => {
          console.log(`   ✅ Encontrada em: ${cat.distribuidores?.nome}`);
          console.log(`      ID Distribuidor: ${cat.distribuidor_id}`);
          console.log(`      Nome completo: "${cat.nome}"`);
          console.log(`      URL correta: /admin/distribuidores/${cat.distribuidor_id}/categorias`);
        });
      } else {
        console.log(`   ❌ Não encontrada`);
      }
    }
    
    console.log('\n🎯 RESUMO:');
    console.log('Use a URL do distribuidor que tem mais categorias');
    console.log('Procure pelo distribuidor "Brancaleone Publicações" que deve ter ~40 categorias');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar
checkDistribuidorIds();
