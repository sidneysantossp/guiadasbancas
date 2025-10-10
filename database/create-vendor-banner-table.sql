-- Tabela para armazenar configurações do banner do jornaleiro (Supabase/PostgreSQL)
-- Permite apenas um banner ativo por vez

CREATE TABLE IF NOT EXISTS vendor_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL DEFAULT 'É jornaleiro?',
    subtitle VARCHAR(255) NOT NULL DEFAULT 'Registre sua banca agora',
    description TEXT NOT NULL DEFAULT 'Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.',
    button_text VARCHAR(100) NOT NULL DEFAULT 'Quero me cadastrar',
    button_link VARCHAR(500) NOT NULL DEFAULT '/jornaleiro/registrar',
    image_url VARCHAR(1000),
    
    -- Campos de customização avançada
    background_color VARCHAR(7) DEFAULT '#000000',
    text_color VARCHAR(7) DEFAULT '#FFFFFF',
    button_color VARCHAR(7) DEFAULT '#FF5C00',
    button_text_color VARCHAR(7) DEFAULT '#FFFFFF',
    overlay_opacity DECIMAL(3,2) DEFAULT 0.45,
    text_position VARCHAR(20) DEFAULT 'bottom-left', -- bottom-left, bottom-center, center, top-left, top-center
    
    -- Campos de controle
    active BOOLEAN NOT NULL DEFAULT true,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_vendor_banners_updated_at ON vendor_banners;
CREATE TRIGGER update_vendor_banners_updated_at
    BEFORE UPDATE ON vendor_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para garantir apenas um banner ativo
CREATE OR REPLACE FUNCTION ensure_single_active_banner()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.active = true THEN
        UPDATE vendor_banners SET active = false WHERE active = true AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para garantir apenas um banner ativo
DROP TRIGGER IF EXISTS ensure_single_active_banner_insert ON vendor_banners;
CREATE TRIGGER ensure_single_active_banner_insert
    BEFORE INSERT ON vendor_banners
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_banner();

DROP TRIGGER IF EXISTS ensure_single_active_banner_update ON vendor_banners;
CREATE TRIGGER ensure_single_active_banner_update
    BEFORE UPDATE ON vendor_banners
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_banner();

-- Inserir banner padrão se não existir
INSERT INTO vendor_banners (title, subtitle, description, button_text, button_link, image_url, active)
SELECT 'É jornaleiro?', 'Registre sua banca agora', 'Anuncie seus produtos, receba pedidos pelo WhatsApp e alcance clientes perto de você com o Guia das Bancas.', 'Quero me cadastrar', '/jornaleiro/registrar', '', true
WHERE NOT EXISTS (SELECT 1 FROM vendor_banners LIMIT 1);

-- Habilitar RLS (Row Level Security) se necessário
-- ALTER TABLE vendor_banners ENABLE ROW LEVEL SECURITY;

-- Política para permitir acesso público de leitura
-- CREATE POLICY "Allow public read access" ON vendor_banners FOR SELECT USING (true);

-- Política para permitir acesso de admin
-- CREATE POLICY "Allow admin full access" ON vendor_banners FOR ALL USING (auth.role() = 'admin');

-- Comentários para documentação
COMMENT ON TABLE vendor_banner IS 'Configurações do banner promocional do jornaleiro na home page';
COMMENT ON COLUMN vendor_banner.title IS 'Título principal do banner';
COMMENT ON COLUMN vendor_banner.subtitle IS 'Subtítulo do banner';
COMMENT ON COLUMN vendor_banner.description IS 'Descrição detalhada';
COMMENT ON COLUMN vendor_banner.button_text IS 'Texto do botão de call-to-action';
COMMENT ON COLUMN vendor_banner.button_link IS 'Link de destino do botão';
COMMENT ON COLUMN vendor_banner.image_url IS 'URL da imagem de fundo';
COMMENT ON COLUMN vendor_banner.active IS 'Se o banner está ativo ou não';
