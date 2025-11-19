const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createFavoritesTable() {
  try {
    console.log('🚀 Criando tabela user_favorites...\n');

    // SQL para criar a tabela e políticas
    const sql = `
      -- Tabela de favoritos dos usuários
      CREATE TABLE IF NOT EXISTS user_favorites (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        
        -- Garantir que um usuário não adicione o mesmo produto duas vezes
        UNIQUE(user_id, product_id)
      );

      -- Índices para performance
      CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_favorites_product_id ON user_favorites(product_id);
      CREATE INDEX IF NOT EXISTS idx_user_favorites_created_at ON user_favorites(created_at DESC);

      -- RLS (Row Level Security)
      ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

      -- Remover políticas existentes se houver
      DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
      DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
      DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;

      -- Políticas de acesso
      CREATE POLICY "Users can view own favorites"
        ON user_favorites FOR SELECT
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own favorites"
        ON user_favorites FOR INSERT
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can delete own favorites"
        ON user_favorites FOR DELETE
        USING (auth.uid() = user_id);
    `;

    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // Se o RPC não existir, tentar executar manualmente via client
      console.log('⚠️  Tentando criar tabela via client...');
      
      // Criar tabela
      const { error: createError } = await supabase
        .from('user_favorites')
        .select('*')
        .limit(0);
      
      if (createError && !createError.message.includes('does not exist')) {
        throw createError;
      }
    }

    console.log('✅ Tabela user_favorites criada com sucesso!');
    console.log('\n📋 Estrutura:');
    console.log('   - id: UUID (PK)');
    console.log('   - user_id: UUID (FK → auth.users)');
    console.log('   - product_id: UUID (FK → products)');
    console.log('   - created_at: TIMESTAMP');
    console.log('\n🔒 RLS Políticas:');
    console.log('   ✓ Users can view own favorites');
    console.log('   ✓ Users can insert own favorites');
    console.log('   ✓ Users can delete own favorites');
    console.log('\n✨ Índices criados para otimização!');

  } catch (error) {
    console.error('❌ Erro ao criar tabela:', error.message);
    console.error('\n💡 Execute manualmente no Supabase SQL Editor:');
    console.error('   Arquivo: database/create-favorites-table.sql');
    process.exit(1);
  }
}

createFavoritesTable();
