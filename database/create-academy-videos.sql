-- Criar tabela de vídeos da Academy
CREATE TABLE IF NOT EXISTS academy_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL, -- ID do vídeo (extraído do URL)
  category TEXT, -- Ex: "Começando", "Pedidos", "Produtos", etc
  order_index INTEGER DEFAULT 0, -- Ordem de exibição
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_academy_videos_active ON academy_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_academy_videos_category ON academy_videos(category);
CREATE INDEX IF NOT EXISTS idx_academy_videos_order ON academy_videos(order_index);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_academy_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER academy_videos_updated_at
BEFORE UPDATE ON academy_videos
FOR EACH ROW
EXECUTE FUNCTION update_academy_videos_updated_at();

-- Inserir vídeos de exemplo
INSERT INTO academy_videos (title, description, youtube_url, youtube_id, category, order_index) VALUES
('Bem-vindo ao Guia das Bancas', 'Introdução à plataforma e suas funcionalidades principais', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Começando', 1),
('Como Cadastrar sua Banca', 'Passo a passo para cadastrar e configurar sua banca', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Começando', 2),
('Gerenciando Produtos', 'Aprenda a adicionar, editar e organizar seus produtos', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Produtos', 3),
('Processando Pedidos', 'Como receber, confirmar e entregar pedidos', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'Pedidos', 4);

COMMENT ON TABLE academy_videos IS 'Vídeos tutoriais da Academy para jornaleiros';
