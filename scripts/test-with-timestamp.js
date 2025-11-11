const { createClient } = require('@supabase/supabase-js');

async function testWithTimestamp() {
  try {
    console.log('🔍 Testando API Mercos com timestamp (igual ao Postman)...\n');
    
    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    const companyToken = '4b866744-a086-11f0-ada6-5e65486a6283';
    
    // Usar o mesmo timestamp do seu Postman
    const timestamp = '2025-11-01 09:31:05';
    const url = `https://sandbox.mercos.com/api/v1/categorias?alterado_apos=${encodeURIComponent(timestamp)}`;
    
    console.log('📡 URL:', url);
    
    const headers = {
      'ApplicationToken': SANDBOX_APP_TOKEN,
      'CompanyToken': companyToken,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error('❌ Erro na API:', response.status);
      const errorText = await response.text();
      console.error('Erro:', errorText);
      return;
    }

    const categorias = await response.json();
    console.log(`✅ Recebidas ${categorias.length} categorias com timestamp\n`);
    
    // Mostrar todas as categorias
    console.log('📋 Categorias encontradas:');
    categorias.forEach((cat, index) => {
      console.log(`${index + 1}. ID: ${cat.id}, Nome: "${cat.nome}", Alterado: ${cat.ultima_alteracao}`);
    });
    
    // Procurar pela categoria específica
    const targetCategory = categorias.find(cat => cat.nome && cat.nome.includes('411856508e34f9d'));
    
    if (targetCategory) {
      console.log('\n🎯 CATEGORIA "411856508e34f9d" ENCONTRADA:');
      console.log('='.repeat(50));
      console.log(`ID: ${targetCategory.id}`);
      console.log(`Nome: "${targetCategory.nome}"`);
      console.log(`Categoria Pai ID: ${targetCategory.categoria_pai_id}`);
      console.log(`Última Alteração: ${targetCategory.ultima_alteracao}`);
      console.log('='.repeat(50));
      
      // Agora vou inserir no banco
      console.log('\n💾 Inserindo no banco de dados...');
      
      const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
      const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const distribuidorId = 'e22dceb8-9a30-452b-b25d-52fe3ea48880'; // Distribuidor "Categoria"
      
      // Verificar se já existe
      const { data: existing } = await supabase
        .from('distribuidor_categories')
        .select('id')
        .eq('distribuidor_id', distribuidorId)
        .eq('mercos_id', targetCategory.id)
        .single();

      if (existing) {
        console.log('✅ Categoria já existe no banco:', existing.id);
      } else {
        // Inserir
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
          console.log('✅ Categoria inserida com sucesso!');
          console.log('   ID no banco:', insertResult[0].id);
        }
      }
    } else {
      console.log('\n❌ Categoria "411856508e34f9d" não encontrada');
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar o teste
testWithTimestamp();
