-- Migration: Criar tabelas para clientes (usuários comuns)
-- Data: 2026-01-05
-- Objetivo: Migrar dados de localStorage para banco de dados

-- =====================================================
-- TABELA: customer_addresses (Endereços dos clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'Casa', -- Casa, Trabalho, Outro
    recipient_name VARCHAR(255),
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20),
    complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    phone VARCHAR(20),
    instructions TEXT, -- Instruções de entrega
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user_id ON customer_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default ON customer_addresses(is_default);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_customer_addresses_updated_at ON customer_addresses;
CREATE TRIGGER update_customer_addresses_updated_at 
BEFORE UPDATE ON customer_addresses 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own addresses" ON customer_addresses;
CREATE POLICY "Users can manage own addresses" 
ON customer_addresses FOR ALL 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all addresses" ON customer_addresses;
CREATE POLICY "Admins can view all addresses" 
ON customer_addresses FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- TABELA: customer_orders (Pedidos dos clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    banca_id UUID NOT NULL REFERENCES bancas(id) ON DELETE CASCADE,
    order_number VARCHAR(20) UNIQUE, -- Número legível do pedido (ex: GB-2026-0001)
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending',      -- Aguardando confirmação
        'confirmed',    -- Confirmado pela banca
        'preparing',    -- Em preparação
        'ready',        -- Pronto para retirada/entrega
        'delivering',   -- Em entrega
        'delivered',    -- Entregue
        'cancelled',    -- Cancelado
        'refunded'      -- Reembolsado
    )),
    items JSONB NOT NULL, -- Array de {product_id, name, price, qty, image}
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(30), -- pix, credit_card, debit_card, cash
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed', 'refunded'
    )),
    delivery_type VARCHAR(20) DEFAULT 'delivery' CHECK (delivery_type IN (
        'delivery', 'pickup'
    )),
    delivery_address_id UUID REFERENCES customer_addresses(id) ON DELETE SET NULL,
    delivery_address JSONB, -- Snapshot do endereço no momento do pedido
    customer_name VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    notes TEXT, -- Observações do cliente
    banca_notes TEXT, -- Notas internas da banca
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_customer_orders_user_id ON customer_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_banca_id ON customer_orders(banca_id);
CREATE INDEX IF NOT EXISTS idx_customer_orders_status ON customer_orders(status);
CREATE INDEX IF NOT EXISTS idx_customer_orders_created_at ON customer_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_orders_order_number ON customer_orders(order_number);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_customer_orders_updated_at ON customer_orders;
CREATE TRIGGER update_customer_orders_updated_at 
BEFORE UPDATE ON customer_orders 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número do pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_str TEXT;
    seq_num INTEGER;
BEGIN
    year_str := TO_CHAR(NOW(), 'YYYY');
    
    -- Buscar próximo número sequencial do ano
    SELECT COALESCE(MAX(
        CAST(SUBSTRING(order_number FROM 'GB-' || year_str || '-(\d+)') AS INTEGER)
    ), 0) + 1
    INTO seq_num
    FROM customer_orders
    WHERE order_number LIKE 'GB-' || year_str || '-%';
    
    NEW.order_number := 'GB-' || year_str || '-' || LPAD(seq_num::TEXT, 6, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar número do pedido
DROP TRIGGER IF EXISTS generate_order_number_trigger ON customer_orders;
CREATE TRIGGER generate_order_number_trigger
BEFORE INSERT ON customer_orders
FOR EACH ROW
WHEN (NEW.order_number IS NULL)
EXECUTE FUNCTION generate_order_number();

-- RLS
ALTER TABLE customer_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON customer_orders;
CREATE POLICY "Users can view own orders" 
ON customer_orders FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON customer_orders;
CREATE POLICY "Users can create own orders" 
ON customer_orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Bancas can view their orders" ON customer_orders;
CREATE POLICY "Bancas can view their orders" 
ON customer_orders FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND banca_id = customer_orders.banca_id
    )
);

DROP POLICY IF EXISTS "Bancas can update their orders" ON customer_orders;
CREATE POLICY "Bancas can update their orders" 
ON customer_orders FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND banca_id = customer_orders.banca_id
    )
);

DROP POLICY IF EXISTS "Admins can manage all orders" ON customer_orders;
CREATE POLICY "Admins can manage all orders" 
ON customer_orders FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- TABELA: customer_favorites (Favoritos dos clientes)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_customer_favorites_user_id ON customer_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_favorites_product_id ON customer_favorites(product_id);

-- RLS
ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own favorites" ON customer_favorites;
CREATE POLICY "Users can manage own favorites" 
ON customer_favorites FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================
-- TABELA: customer_cart (Carrinho persistente)
-- =====================================================
CREATE TABLE IF NOT EXISTS customer_cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]', -- Array de {product_id, name, price, qty, image, banca_id, banca_name}
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_customer_cart_user_id ON customer_cart(user_id);

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_customer_cart_updated_at ON customer_cart;
CREATE TRIGGER update_customer_cart_updated_at 
BEFORE UPDATE ON customer_cart 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE customer_cart ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own cart" ON customer_cart;
CREATE POLICY "Users can manage own cart" 
ON customer_cart FOR ALL 
USING (auth.uid() = user_id);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT ALL ON customer_addresses TO authenticated;
GRANT ALL ON customer_orders TO authenticated;
GRANT ALL ON customer_favorites TO authenticated;
GRANT ALL ON customer_cart TO authenticated;

-- Permitir service role acesso total
GRANT ALL ON customer_addresses TO service_role;
GRANT ALL ON customer_orders TO service_role;
GRANT ALL ON customer_favorites TO service_role;
GRANT ALL ON customer_cart TO service_role;
