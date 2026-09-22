-- Initial Schema Migration for Kaal Vastr

-- 1. Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT DEFAULT 'Kaal Vastr',
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    selling_price NUMERIC(10, 2) NOT NULL CHECK (selling_price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
    sizes TEXT[] DEFAULT ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    colors TEXT[] DEFAULT ARRAY['Charcoal', 'Black', 'Silver'],
    image_url TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    stock INT DEFAULT 10 CHECK (stock >= 0),
    is_available BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create business_settings table
CREATE TABLE IF NOT EXISTS public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'Kaal Vastr',
    description TEXT DEFAULT 'Premium bespoke clothing and dark minimalist couture.',
    whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
    mobile_number TEXT DEFAULT '+91 98765 43210',
    email TEXT DEFAULT 'support@kaalvastr.in',
    address TEXT DEFAULT '104, Obsidian Avenue, Khar West, Mumbai, Maharashtra 400052',
    store_timings TEXT DEFAULT 'Mon - Sat: 11:00 AM - 9:00 PM | Sun: 12:00 PM - 7:00 PM',
    instagram_url TEXT DEFAULT 'https://instagram.com/kaalvastr',
    facebook_url TEXT DEFAULT 'https://facebook.com/kaalvastr',
    logo_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies for products
-- Customers (anon & authenticated) can read non-archived products. Authenticated admins can see all.
CREATE POLICY "Public products read access" 
ON public.products 
FOR SELECT 
USING (is_archived = false OR (auth.role() = 'authenticated'));

CREATE POLICY "Admin insert products" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Admin update products" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admin delete products" 
ON public.products 
FOR DELETE 
TO authenticated 
USING (true);

-- 4. RLS Policies for business_settings
CREATE POLICY "Public business_settings read access" 
ON public.business_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admin update business_settings" 
ON public.business_settings 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admin insert business_settings" 
ON public.business_settings 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- 5. Supabase Storage Setup for Product Images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Product Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admin Upload Product Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Admin Update Product Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Admin Delete Product Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- 6. Insert Default Seed Data
INSERT INTO public.business_settings (
    business_name,
    description,
    whatsapp_number,
    mobile_number,
    email,
    address,
    store_timings,
    instagram_url,
    facebook_url
) VALUES (
    'Kaal Vastr',
    'Minimalist dark grey & silver aesthetic streetwear and luxury clothing.',
    '919876543210',
    '+91 98765 43210',
    'contact@kaalvastr.in',
    '104, Obsidian Avenue, Khar West, Mumbai, MH 400052',
    'Mon - Sat: 11:00 AM - 9:00 PM | Sun: 12:00 PM - 7:00 PM',
    'https://instagram.com/kaalvastr',
    'https://facebook.com/kaalvastr'
) ON CONFLICT DO NOTHING;

INSERT INTO public.products (name, category, brand, sku, description, selling_price, compare_at_price, sizes, colors, image_url, stock, is_available, is_archived) VALUES
('Shadow Oversized Hoodie', 'Hoodies', 'Kaal Vastr', 'KV-HD-001', 'Heavyweight 450 GSM French Terry cotton hoodie in deep obsidian black. Features dropped shoulders and clean silver logo print.', 4499.00, 5999.00, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Obsidian Black', 'Charcoal Grey'], 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80', 15, true, false),
('Obsidian Acid-Wash Tee', 'T-Shirts', 'Kaal Vastr', 'KV-TS-002', 'Custom vintage acid-washed heavy cotton t-shirt with subtle silver chest typography.', 2199.00, 2799.00, ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Acid Black', 'Silver Dust'], 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 25, true, false),
('Monolith Utility Cargo Pants', 'Pants', 'Kaal Vastr', 'KV-PT-003', 'Tapered cargo trousers constructed from weather-resistant ripstop canvas with 6 tactical pockets.', 4999.00, 6499.00, ARRAY['M', 'L', 'XL'], ARRAY['Charcoal Grey', 'Deep Black'], 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', 8, true, false),
('Nocturne Bomber Jacket', 'Outerwear', 'Kaal Vastr', 'KV-JK-004', 'Minimalist matte black nylon bomber jacket with brushed silver hardware and satin thermal lining.', 7999.00, 9999.00, ARRAY['S', 'M', 'L'], ARRAY['Matte Black'], 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80', 5, true, false),
('Vanguard Sweatshirt', 'Sweatshirts', 'Kaal Vastr', 'KV-SW-005', 'Structured French terry crewneck with tonal embroidered Kaal Vastr chest crest.', 3499.00, 4299.00, ARRAY['S', 'M', 'L', 'XL'], ARRAY['Steel Grey', 'Coal Black'], 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80', 12, true, false),
('Eclipse Structured Blazer', 'Outerwear', 'Kaal Vastr', 'KV-BL-006', 'Modern unconstructed tailored jacket crafted from premium wool-blend twill.', 8999.00, 11999.00, ARRAY['M', 'L', 'XL'], ARRAY['Charcoal Charcoal'], 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 4, true, false)
ON CONFLICT (sku) DO NOTHING;

-- 7. Create orders table for WhatsApp order logging & sales analytics
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address_notes TEXT,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'fulfilled', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated customer) can record an order upon checkout
CREATE POLICY "Public insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated admins can read and update orders
CREATE POLICY "Admin select orders" 
ON public.orders 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Admin update orders" 
ON public.orders 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Admin delete orders" 
ON public.orders 
FOR DELETE 
TO authenticated 
USING (true);

