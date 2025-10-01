-- Script para criar tabela de campanhas publicitárias
-- Execute no SQL Editor do Supabase

-- Criar tabela de campanhas
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
    
    -- Informações da campanha
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Datas da campanha
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    duration_days INTEGER NOT NULL, -- 7, 15 ou 30 dias
    
    -- Status da campanha
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'expired', 'cancelled')),
    
    -- Tipo de plano (futuro)
    plan_type VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'premium', 'enterprise')),
    
    -- Mensagens e comunicação
    admin_message TEXT, -- Mensagem do admin para o jornaleiro
    rejection_reason TEXT, -- Motivo da rejeição
    
    -- Métricas (futuro)
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    
    -- Índices para performance
    CONSTRAINT valid_dates CHECK (end_date > start_date),
    CONSTRAINT valid_duration CHECK (duration_days IN (7, 15, 30))
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_banca_id ON campaigns(banca_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_product_id ON campaigns(product_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(status, start_date, end_date) WHERE status = 'active';

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_campaigns_updated_at ON campaigns;
CREATE TRIGGER trigger_update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_campaigns_updated_at();

-- Criar função para verificar campanhas expiradas
CREATE OR REPLACE FUNCTION check_expired_campaigns()
RETURNS void AS $$
BEGIN
    UPDATE campaigns 
    SET status = 'expired'
    WHERE status = 'active' 
    AND end_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- Desabilitar RLS para facilitar desenvolvimento inicial
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;

-- Inserir dados de exemplo (opcional)
-- Primeiro vamos verificar quais colunas existem na tabela products
DO $$
BEGIN
    -- Tentar inserir campanhas de exemplo se a tabela products existir
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        INSERT INTO campaigns (
            product_id, 
            banca_id, 
            title, 
            description, 
            start_date, 
            end_date, 
            duration_days, 
            status
        ) 
        SELECT 
            p.id as product_id,
            p.banca_id,
            'Promoção ' || p.name as title,
            'Campanha promocional para ' || p.name as description,
            NOW() as start_date,
            NOW() + INTERVAL '7 days' as end_date,
            7 as duration_days,
            'approved' as status
        FROM products p 
        WHERE p.price > 0
        LIMIT 3
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Verificar se a tabela foi criada
SELECT 
    'Tabela campaigns criada com sucesso!' as message,
    COUNT(*) as total_campaigns
FROM campaigns;
