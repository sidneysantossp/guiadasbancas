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

-- Políticas de acesso
-- Usuários podem ver apenas seus próprios favoritos
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem adicionar seus próprios favoritos
CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios favoritos
CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Comentários
COMMENT ON TABLE user_favorites IS 'Produtos favoritos dos usuários';
COMMENT ON COLUMN user_favorites.user_id IS 'ID do usuário (referência para auth.users)';
COMMENT ON COLUMN user_favorites.product_id IS 'ID do produto favorito';
COMMENT ON COLUMN user_favorites.created_at IS 'Data e hora em que foi adicionado aos favoritos';
