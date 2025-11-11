const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugSyncCategories() {
  try {
    console.log('🔍 Testando sincronização de categorias...\n');
    
    // Simular a chamada da API Mercos
    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    const companyToken = '4b866744-a086-11f0-ada6-5e65486a6283'; // Do seu Postman
    
    console.log('📡 Fazendo chamada para API Mercos...');
    const url = 'https://sandbox.mercos.com/api/v1/categorias?limit=100&order_by=id&order_direction=asc';
    const headers = {
      'ApplicationToken': SANDBOX_APP_TOKEN,
      'CompanyToken': companyToken,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      console.error('❌ Erro na API Mercos:', response.status);
      return;
    }

    const categorias = await response.json();
    console.log(`✅ Recebidas ${categorias.length} categorias da API Mercos`);
    
    // Procurar pela categoria específica
    const targetCategory = categorias.find(cat => cat.nome && cat.nome.includes('411856508e34f9d'));
    
    if (targetCategory) {
      console.log('\n🎯 CATEGORIA ENCONTRADA NA API MERCOS:');
      console.log('='.repeat(50));
      console.log(`ID: ${targetCategory.id}`);
      console.log(`Nome: "${targetCategory.nome}"`);
      console.log(`Categoria Pai ID: ${targetCategory.categoria_pai_id}`);
      console.log(`Última Alteração: ${targetCategory.ultima_alteracao}`);
      console.log('='.repeat(50));
      
      // Verificar se existe no banco
      console.log('\n🔍 Verificando se existe no banco de dados...');
      const { data: existingCategories, error } = await supabase
        .from('distribuidor_categories')
        .select('*')
        .ilike('nome', `%411856508e34f9d%`);
      
      if (error) {
        console.error('❌ Erro ao consultar banco:', error.message);
      } else if (existingCategories && existingCategories.length > 0) {
        console.log('✅ Categoria encontrada no banco:');
        existingCategories.forEach(cat => {
          console.log(`   - ID: ${cat.id}, Distribuidor: ${cat.distribuidor_id}, Nome: "${cat.nome}"`);
        });
      } else {
        console.log('❌ Categoria NÃO encontrada no banco de dados');
        
        // Tentar inserir manualmente para teste
        console.log('\n🔧 Tentando inserir manualmente...');
        const distribuidorId = 'e22dceb8-9a30-452b-b25d-52fe3ea48880'; // ID do distribuidor "Categoria"
        
        const { data: insertResult, error: insertError } = await supabase
          .from('distribuidor_categories')
          .insert({
            distribuidor_id: distribuidorId,
            mercos_id: targetCategory.id,
            nome: targetCategory.nome,
            categoria_pai_id: targetCategory.categoria_pai_id,
            ativo: true
          })
          .select();
        
        if (insertError) {
          console.error('❌ Erro ao inserir:', insertError.message);
        } else {
          console.log('✅ Categoria inserida com sucesso:', insertResult);
        }
      }
    } else {
      console.log('❌ Categoria "411856508e34f9d" não encontrada na API Mercos');
      
      // Mostrar as primeiras 10 categorias para debug
      console.log('\n📋 Primeiras 10 categorias da API:');
      categorias.slice(0, 10).forEach((cat, index) => {
        console.log(`${index + 1}. ID: ${cat.id}, Nome: "${cat.nome}"`);
      });
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o debug
debugSyncCategories();
