-- Tabela para configurações gerais do footer
CREATE TABLE IF NOT EXISTS footer_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    title TEXT NOT NULL DEFAULT 'Guia das Bancas',
    description TEXT NOT NULL DEFAULT 'Conectamos você às melhores bancas da sua região.',
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Garantir que só existe um registro
    CONSTRAINT single_footer_config CHECK (id = 1)
);

-- Tabela para links do footer
CREATE TABLE IF NOT EXISTS footer_links (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    url TEXT NOT NULL,
    section TEXT NOT NULL CHECK (section IN ('institucional', 'para_voce', 'para_jornaleiro', 'atalhos')),
    "order" INTEGER NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_footer_links_section ON footer_links(section);
CREATE INDEX IF NOT EXISTS idx_footer_links_active ON footer_links(active);
CREATE INDEX IF NOT EXISTS idx_footer_links_order ON footer_links(section, "order");

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_footer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas
DROP TRIGGER IF EXISTS footer_config_updated_at ON footer_config;
CREATE TRIGGER footer_config_updated_at
    BEFORE UPDATE ON footer_config
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_updated_at();

DROP TRIGGER IF EXISTS footer_links_updated_at ON footer_links;
CREATE TRIGGER footer_links_updated_at
    BEFORE UPDATE ON footer_links
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_updated_at();

-- Inserir dados padrão
INSERT INTO footer_config (id, title, description, social_links) 
VALUES (
    1,
    'Guia das Bancas',
    'Conectamos você às melhores bancas da sua região. Descubra produtos, ofertas e o jornaleiro mais próximo.',
    '{
        "instagram": "https://instagram.com/guiadasbancas",
        "facebook": "https://facebook.com/guiadasbancas",
        "twitter": "https://twitter.com/guiadasbancas",
        "youtube": "https://youtube.com/@guiadasbancas"
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Inserir links padrão
INSERT INTO footer_links (id, text, url, section, "order", active) VALUES
-- Institucional
('1', 'Sobre nós', '/sobre-nos', 'institucional', 1, true),
('2', 'Como funciona', '/como-funciona', 'institucional', 2, true),
('3', 'Blog', '/blog', 'institucional', 3, true),
('4', 'Imprensa', '/imprensa', 'institucional', 4, true),

-- Para você
('5', 'Minha conta', '/minha-conta', 'para_voce', 1, true),
('6', 'Pedidos', '/minha-conta?tab=pedidos', 'para_voce', 2, true),
('7', 'Favoritos', '/minha-conta?tab=favoritos', 'para_voce', 3, true),
('8', 'Suporte', '/suporte', 'para_voce', 4, true),

-- Para o Jornaleiro
('9', 'Cadastre sua banca', '/jornaleiro/cadastro', 'para_jornaleiro', 1, true),
('10', 'Fazer login', '/jornaleiro/login', 'para_jornaleiro', 2, true),
('11', 'Central de ajuda', '/jornaleiro/ajuda', 'para_jornaleiro', 3, true),
('12', 'Termos para Parceiros', '/termos-parceiros', 'para_jornaleiro', 4, true),

-- Atalhos
('13', 'Bancas perto de você', '/bancas-perto-de-mim', 'atalhos', 1, true),
('14', 'Buscar produtos', '/buscar', 'atalhos', 2, true),
('15', 'Ofertas relâmpago', '/promocoes', 'atalhos', 3, true),
('16', 'Categorias', '/categorias', 'atalhos', 4, true)

ON CONFLICT (id) DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE footer_config IS 'Configurações gerais do footer (título, descrição, redes sociais)';
COMMENT ON TABLE footer_links IS 'Links organizados por seção no footer';
COMMENT ON COLUMN footer_links.section IS 'Seção do footer: institucional, para_voce, para_jornaleiro, atalhos';
COMMENT ON COLUMN footer_links."order" IS 'Ordem de exibição dentro da seção';
COMMENT ON COLUMN footer_config.social_links IS 'JSON com links das redes sociais {instagram, facebook, twitter, youtube}';
