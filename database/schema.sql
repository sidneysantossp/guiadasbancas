-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Bancas table
CREATE TABLE IF NOT EXISTS bancas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT NULL,
    categories TEXT[] DEFAULT NULL,
    cover_image TEXT DEFAULT NULL,
    address_obj JSONB DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image TEXT DEFAULT NULL,
    link VARCHAR(500) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    description TEXT DEFAULT NULL,
    description_full TEXT DEFAULT NULL,
    price DECIMAL(10, 2) NOT NULL,
    price_original DECIMAL(10, 2) DEFAULT NULL,
    discount_percent INTEGER DEFAULT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
    images TEXT[] DEFAULT NULL,
    gallery_images TEXT[] DEFAULT NULL,
    specifications JSONB DEFAULT NULL,
    rating_avg DECIMAL(3, 2) DEFAULT NULL,
    reviews_count INTEGER DEFAULT 0,
    stock_qty INTEGER DEFAULT NULL,
    track_stock BOOLEAN DEFAULT FALSE,
    sob_encomenda BOOLEAN DEFAULT FALSE,
    pre_venda BOOLEAN DEFAULT FALSE,
    pronta_entrega BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255) DEFAULT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'novo',
    notes TEXT DEFAULT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    banca_id UUID REFERENCES bancas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branding table (singleton)
CREATE TABLE IF NOT EXISTS branding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT DEFAULT NULL,
    logo_alt VARCHAR(255) DEFAULT 'Guia das Bancas',
    site_name VARCHAR(255) DEFAULT 'Guia das Bancas',
    primary_color VARCHAR(7) DEFAULT '#ff5c00',
    secondary_color VARCHAR(7) DEFAULT '#ff7a33',
    favicon TEXT DEFAULT '/favicon.svg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bancas_lat_lng ON bancas(lat, lng);
CREATE INDEX IF NOT EXISTS idx_products_banca_id ON products(banca_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_banca_id ON orders(banca_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories("order");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (drop if exists first)
DROP TRIGGER IF EXISTS update_bancas_updated_at ON bancas;
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_branding_updated_at ON branding;

CREATE TRIGGER update_bancas_updated_at BEFORE UPDATE ON bancas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branding_updated_at BEFORE UPDATE ON branding FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default branding record
INSERT INTO branding (logo_url, logo_alt, site_name, primary_color, secondary_color, favicon)
VALUES (NULL, 'Guia das Bancas', 'Guia das Bancas', '#ff5c00', '#ff7a33', '/favicon.svg')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE bancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access on bancas" ON bancas;
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on branding" ON branding;
DROP POLICY IF EXISTS "Allow service role all access on bancas" ON bancas;
DROP POLICY IF EXISTS "Allow service role all access on categories" ON categories;
DROP POLICY IF EXISTS "Allow service role all access on products" ON products;
DROP POLICY IF EXISTS "Allow service role all access on orders" ON orders;
DROP POLICY IF EXISTS "Allow service role all access on branding" ON branding;

-- Create policies for public access (adjust as needed)
CREATE POLICY "Allow public read access on bancas" ON bancas FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on branding" ON branding FOR SELECT USING (true);

-- Admin policies (service role can do everything)
CREATE POLICY "Allow service role all access on bancas" ON bancas USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all access on categories" ON categories USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all access on products" ON products USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all access on orders" ON orders USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role all access on branding" ON branding USING (auth.role() = 'service_role');
