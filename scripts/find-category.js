const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (substitua pelas suas credenciais)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eyhgqmcfqxpqvgmjgqpz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aGdxbWNmcXhwcXZnbWpncXB6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTcwMzE5NCwiZXhwIjoyMDQ1Mjc5MTk0fQ.Xh4Dn8JMYYkJJGVJCLGvCpJWnJXXnJXXnJXXnJXXnJX';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findCategoryStartingWith(searchTerm) {
  try {
    console.log(`🔍 Buscando categoria que começa com: "${searchTerm}"`);
    
    const { data, error } = await supabase
      .from('distribuidor_categories')
      .select('*')
      .ilike('nome', `${searchTerm}%`)
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ Erro na consulta:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('❌ Nenhuma categoria encontrada');
      return;
    }

    console.log(`✅ Encontradas ${data.length} categoria(s):`);
    data.forEach((categoria, index) => {
      console.log(`\n📋 Categoria ${index + 1}:`);
      console.log(`   ID: ${categoria.id}`);
      console.log(`   Mercos ID: ${categoria.mercos_id}`);
      console.log(`   Nome completo: "${categoria.nome}"`);
      console.log(`   Distribuidor ID: ${categoria.distribuidor_id}`);
      console.log(`   Ativo: ${categoria.ativo}`);
      console.log(`   Criado em: ${categoria.created_at}`);
    });

    // Retornar especificamente o nome completo da primeira categoria encontrada
    if (data.length > 0) {
      console.log(`\n🎯 RESPOSTA: O valor completo do campo nome é:`);
      console.log(`"${data[0].nome}"`);
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

// Executar a busca
findCategoryStartingWith('20057313');
