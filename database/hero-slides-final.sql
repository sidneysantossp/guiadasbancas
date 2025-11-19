-- VERSÃO FINAL SIMPLIFICADA - SNAKE_CASE

-- Criar tabela hero_slides
CREATE TABLE hero_slides (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  gradient_from TEXT NOT NULL DEFAULT '#ff7a33',
  gradient_to TEXT NOT NULL DEFAULT '#e64a00',
  cta1_text TEXT NOT NULL,
  cta1_link TEXT NOT NULL,
  cta1_style TEXT NOT NULL DEFAULT 'primary',
  cta2_text TEXT NOT NULL,
  cta2_link TEXT NOT NULL,
  cta2_style TEXT NOT NULL DEFAULT 'outline',
  active BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela slider_config
CREATE TABLE slider_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  auto_play_time INTEGER NOT NULL DEFAULT 6000,
  transition_speed INTEGER NOT NULL DEFAULT 600,
  show_arrows BOOLEAN NOT NULL DEFAULT true,
  show_dots BOOLEAN NOT NULL DEFAULT true,
  height_desktop INTEGER NOT NULL DEFAULT 520,
  height_mobile INTEGER NOT NULL DEFAULT 360,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir slides padrão
INSERT INTO hero_slides (id, title, description, image_url, image_alt, gradient_from, gradient_to, cta1_text, cta1_link, cta1_style, cta2_text, cta2_link, cta2_style, active, "order")
VALUES 
  (
    'slide-1',
    'Sua banca favorita
agora delivery',
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
    'Revistas, jornais
e colecionáveis',
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
    'Tudo de conveniência
em poucos cliques',
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
  );

-- Inserir configuração padrão
INSERT INTO slider_config (id, auto_play_time, transition_speed, show_arrows, show_dots, height_desktop, height_mobile)
VALUES (1, 6000, 600, true, true, 520, 360);

-- Criar índices
CREATE INDEX idx_hero_slides_active ON hero_slides(active);
CREATE INDEX idx_hero_slides_order ON hero_slides("order");
