-- Tabela para armazenar configurações do banner de indicação (Supabase/PostgreSQL)
-- Permite apenas um banner ativo por vez

CREATE TABLE IF NOT EXISTS referral_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL DEFAULT 'Indique a Plataforma e ganhe benefícios',
    subtitle VARCHAR(255) NOT NULL DEFAULT 'Programa de Indicação',
    description TEXT NOT NULL DEFAULT 'Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.',
    button_text VARCHAR(100) NOT NULL DEFAULT 'Indicar agora',
    button_link VARCHAR(500) NOT NULL DEFAULT '/indicar',
    image_url VARCHAR(1000),
    
    -- Campos de customização avançada
    background_color VARCHAR(7) DEFAULT '#1f2937',
    text_color VARCHAR(7) DEFAULT '#FFFFFF',
    button_color VARCHAR(7) DEFAULT '#f97316',
    button_text_color VARCHAR(7) DEFAULT '#FFFFFF',
    overlay_opacity DECIMAL(3,2) DEFAULT 0.5,
    text_position VARCHAR(20) DEFAULT 'center-left', -- bottom-left, bottom-center, center, center-left, top-left, top-center
    
    -- Campos de controle
    active BOOLEAN NOT NULL DEFAULT true,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_referral_banners_updated_at ON referral_banners;
CREATE TRIGGER update_referral_banners_updated_at
    BEFORE UPDATE ON referral_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para garantir apenas um banner ativo
CREATE OR REPLACE FUNCTION ensure_single_active_referral_banner()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.active = true THEN
        UPDATE referral_banners SET active = false WHERE active = true AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para garantir apenas um banner ativo
DROP TRIGGER IF EXISTS ensure_single_active_referral_banner_insert ON referral_banners;
CREATE TRIGGER ensure_single_active_referral_banner_insert
    BEFORE INSERT ON referral_banners
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_referral_banner();

DROP TRIGGER IF EXISTS ensure_single_active_referral_banner_update ON referral_banners;
CREATE TRIGGER ensure_single_active_referral_banner_update
    BEFORE UPDATE ON referral_banners
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_active_referral_banner();

-- Inserir banner padrão se não existir
INSERT INTO referral_banners (title, subtitle, description, button_text, button_link, image_url, active)
SELECT 
    'Indique a Plataforma e ganhe benefícios',
    'Programa de Indicação',
    'Convide amigos e familiares para conhecer as melhores bancas. Você ajuda a comunidade e ainda pode ganhar recompensas.',
    'Indicar agora',
    '/indicar',
    'https://lh3.googleusercontent.com/gg/AAHar4ez4stpNWSyhtcKIAQdeA4bUIFfC_wbg06xK_bhJNwv7-6WCuWHfszyh8YU8B2YPf2h6mzp3OAvwWLIqfBU1PeEfl9jE8T_Gim7uvt8GCiKYXqiVIHK45aO9-NOC90ppaLjsJuWsj19ofzQNniCIW8tGUSgzVO_JX7GZsaNG40LamP77jTiT9B1Bbwbqq5eBqJUPmdWLp8h-gaDYYku0cUfsElkXiYmDoGIn8HV1AXZg1hgG-uhDJ8o4v9vTJ4d2E_yL0DUbct5q6Ka9dIaZyXjbSAa8N2x9OjnOIQO6QFICsKctq6-LxlzhEfdzymQrGE7TXpnjOpZsd6OpOfe_Lxb=s1024-rj?authuser=1',
    true
WHERE NOT EXISTS (SELECT 1 FROM referral_banners LIMIT 1);

-- DESABILITAR RLS para permitir acesso total (necessário para APIs serverless)
ALTER TABLE referral_banners DISABLE ROW LEVEL SECURITY;

-- Comentários para documentação
COMMENT ON TABLE referral_banners IS 'Configurações do banner de indicação na home page';
COMMENT ON COLUMN referral_banners.title IS 'Título principal do banner';
COMMENT ON COLUMN referral_banners.subtitle IS 'Subtítulo do banner';
COMMENT ON COLUMN referral_banners.description IS 'Descrição detalhada';
COMMENT ON COLUMN referral_banners.button_text IS 'Texto do botão de call-to-action';
COMMENT ON COLUMN referral_banners.button_link IS 'Link de destino do botão';
COMMENT ON COLUMN referral_banners.image_url IS 'URL da imagem de fundo';
COMMENT ON COLUMN referral_banners.active IS 'Se o banner está ativo ou não';
