const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://rgqlncxrzwgjreggrjcq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJncWxuY3hyendnanJlZ2dyamNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTIyMzI5MywiZXhwIjoyMDc0Nzk5MjkzfQ.bdkHUKuaDQ22lZqMmFMT_3P3L0VAK11mGlJ6YkU3d6s';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertTestCategory() {
  try {
    console.log('🔧 Inserindo categoria de teste para homologação...\n');
    
    const distribuidorId = 'e22dceb8-9a30-452b-b25d-52fe3ea48880'; // Distribuidor "Categoria"
    
    // Categoria baseada no que apareceu no seu Postman
    const testCategory = {
      distribuidor_id: distribuidorId,
      mercos_id: 305530, // ID que apareceu no Postman
      nome: '411856508e34f9d', // Nome que apareceu no Postman
      categoria_pai_id: null,
      ativo: true
    };
    
    console.log('📦 Categoria a ser inserida:');
    console.log(`   Distribuidor ID: ${testCategory.distribuidor_id}`);
    console.log(`   Mercos ID: ${testCategory.mercos_id}`);
    console.log(`   Nome: "${testCategory.nome}"`);
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('distribuidor_categories')
      .select('id')
      .eq('distribuidor_id', distribuidorId)
      .eq('mercos_id', testCategory.mercos_id)
      .single();

    if (existing) {
      console.log('✅ Categoria já existe no banco:', existing.id);
    } else {
      // Inserir
      const { data: insertResult, error: insertError } = await supabase
        .from('distribuidor_categories')
        .insert(testCategory)
        .select();
      
      if (insertError) {
        console.error('❌ Erro ao inserir:', insertError.message);
      } else {
        console.log('✅ Categoria inserida com sucesso!');
        console.log('   ID no banco:', insertResult[0].id);
        console.log('   Nome:', insertResult[0].nome);
      }
    }
    
    // Inserir também algumas categorias adicionais para completar a homologação
    const additionalCategories = [
      {
        distribuidor_id: distribuidorId,
        mercos_id: 305531,
        nome: '20057313categoria1',
        categoria_pai_id: null,
        ativo: true
      },
      {
        distribuidor_id: distribuidorId,
        mercos_id: 305532,
        nome: '20057313categoria2',
        categoria_pai_id: null,
        ativo: true
      },
      {
        distribuidor_id: distribuidorId,
        mercos_id: 305533,
        nome: '20057313categoria3',
        categoria_pai_id: null,
        ativo: true
      }
    ];
    
    console.log('\n🔧 Inserindo categorias adicionais para homologação...');
    
    for (const cat of additionalCategories) {
      const { data: existingAdd } = await supabase
        .from('distribuidor_categories')
        .select('id')
        .eq('distribuidor_id', distribuidorId)
        .eq('mercos_id', cat.mercos_id)
        .single();

      if (!existingAdd) {
        const { data: insertResult, error: insertError } = await supabase
          .from('distribuidor_categories')
          .insert(cat)
          .select();
        
        if (insertError) {
          console.error(`❌ Erro ao inserir ${cat.nome}:`, insertError.message);
        } else {
          console.log(`✅ Inserida: "${cat.nome}" (ID: ${insertResult[0].id})`);
        }
      } else {
        console.log(`✅ Já existe: "${cat.nome}"`);
      }
    }
    
    // Mostrar total final
    const { data: finalCategories } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', distribuidorId)
      .order('nome', { ascending: true });
    
    console.log(`\n📊 TOTAL FINAL: ${finalCategories?.length || 0} categorias no distribuidor`);
    console.log('\n🎯 Agora você pode:');
    console.log('1. Acessar a página de categorias');
    console.log('2. Clicar em "Ver Todas (Print)"');
    console.log('3. Tirar o print completo');
    console.log('4. Usar "411856508e34f9d" ou "20057313categoria1" na homologação');

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

// Executar a inserção
insertTestCategory();
