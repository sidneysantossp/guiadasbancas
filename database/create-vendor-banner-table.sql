-- Tabela para gerenciar o banner promocional do jornaleiro
CREATE TABLE IF NOT EXISTS vendor_banner (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT 'É jornaleiro?',
  subtitle VARCHAR(255) NOT NULL DEFAULT 'Registre sua banca agora',
  description TEXT NOT NULL DEFAULT 'Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.',
  button_text VARCHAR(100) NOT NULL DEFAULT 'Quero me cadastrar',
  button_link VARCHAR(255) NOT NULL DEFAULT '/jornaleiro/registrar',
  image_url TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração padrão
INSERT INTO vendor_banner (
  title,
  subtitle,
  description,
  button_text,
  button_link,
  image_url,
  active
) VALUES (
  'É jornaleiro?',
  'Registre sua banca agora',
  'Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.',
  'Quero me cadastrar',
  '/jornaleiro/registrar',
  'https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop',
  true
) ON CONFLICT DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE vendor_banner IS 'Configurações do banner promocional do jornaleiro na home page';
COMMENT ON COLUMN vendor_banner.title IS 'Título principal do banner';
COMMENT ON COLUMN vendor_banner.subtitle IS 'Subtítulo do banner';
COMMENT ON COLUMN vendor_banner.description IS 'Descrição detalhada';
COMMENT ON COLUMN vendor_banner.button_text IS 'Texto do botão de call-to-action';
COMMENT ON COLUMN vendor_banner.button_link IS 'Link de destino do botão';
COMMENT ON COLUMN vendor_banner.image_url IS 'URL da imagem de fundo';
COMMENT ON COLUMN vendor_banner.active IS 'Se o banner está ativo ou não';
