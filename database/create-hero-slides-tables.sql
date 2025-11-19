-- Tabela para os slides do hero/banner principal
CREATE TABLE IF NOT EXISTS hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "imageAlt" TEXT NOT NULL,
  "gradientFrom" TEXT NOT NULL DEFAULT '#ff7a33',
  "gradientTo" TEXT NOT NULL DEFAULT '#e64a00',
  "cta1Text" TEXT NOT NULL,
  "cta1Link" TEXT NOT NULL,
  "cta1Style" TEXT NOT NULL DEFAULT 'primary' CHECK ("cta1Style" IN ('primary', 'outline')),
  "cta2Text" TEXT NOT NULL,
  "cta2Link" TEXT NOT NULL,
  "cta2Style" TEXT NOT NULL DEFAULT 'outline' CHECK ("cta2Style" IN ('primary', 'outline')),
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para configurações globais do slider
CREATE TABLE IF NOT EXISTS slider_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  "autoPlayTime" INTEGER NOT NULL DEFAULT 6000,
  "transitionSpeed" INTEGER NOT NULL DEFAULT 600,
  "showArrows" BOOLEAN NOT NULL DEFAULT true,
  "showDots" BOOLEAN NOT NULL DEFAULT true,
  "heightDesktop" INTEGER NOT NULL DEFAULT 520,
  "heightMobile" INTEGER NOT NULL DEFAULT 360,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hero_slides_updated_at BEFORE UPDATE ON hero_slides
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_slider_config_updated_at BEFORE UPDATE ON slider_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir slides padrão
INSERT INTO hero_slides (id, title, description, "imageUrl", "imageAlt", "gradientFrom", "gradientTo", "cta1Text", "cta1Link", "cta1Style", "cta2Text", "cta2Link", "cta2Style", active, "order")
VALUES 
  (
    'slide-1',
    E'Sua banca favorita\nagora delivery',
    'Jornais, revistas, papelaria, snacks e muito mais direto da sua banca de confiança.',
    'https://images.unsplash.com/photo-1521334726092-b509a19597d6?q=80&w=1600&auto=format&fit=crop',
    'Banca de jornal com revistas e jornais ao fundo',
    '#ff7a33',
    '#e64a00',
    'Peça agora',
    '/bancas-perto-de-mim',
    'primary',
    'Sou jornaleiro',
    '/jornaleiro',
    'outline',
    true,
    1
  ),
  (
    'slide-2',
    E'Revistas, jornais\ne colecionáveis',
    'Encontre os lançamentos e clássicos nas bancas mais próximas de você.',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    'Pilha de revistas coloridas',
    '#ffa366',
    '#ff5c00',
    'Ver departamentos',
    '/departamentos',
    'primary',
    'Bancas próximas',
    '/bancas-perto-de-mim',
    'outline',
    true,
    2
  ),
  (
    'slide-3',
    E'Tudo de conveniência\nem poucos cliques',
    'Bebidas, snacks, pilhas, papelaria e recargas com entrega rápida.',
    'https://images.unsplash.com/photo-1601050690597-9b614fb3a3e7?q=80&w=1600&auto=format&fit=crop',
    'Loja de conveniência com prateleiras e bebidas',
    '#ffd6c2',
    '#ff5c00',
    'Explorar agora',
    '/bancas-perto-de-mim',
    'primary',
    'Como funciona',
    '/minha-conta',
    'outline',
    true,
    3
  )
ON CONFLICT (id) DO NOTHING;

-- Inserir configuração padrão do slider
INSERT INTO slider_config (id, "autoPlayTime", "transitionSpeed", "showArrows", "showDots", "heightDesktop", "heightMobile")
VALUES (1, 6000, 600, true, true, 520, 360)
ON CONFLICT (id) DO NOTHING;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(active);
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides("order");
