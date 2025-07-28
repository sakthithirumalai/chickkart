-- Location: supabase/migrations/20250128083733_menu_system_with_realtime.sql
-- Module: Menu Management System with Real-time Updates and Optimized Images
-- Integration Type: Complete new module
-- Dependencies: Fresh project setup

-- 1. Types and Core Tables
CREATE TYPE public.user_role AS ENUM ('admin', 'customer', 'manager');
CREATE TYPE public.menu_category_type AS ENUM ('chicken-wings', 'sandwiches', 'juices', 'combos', 'appetizers', 'desserts');
CREATE TYPE public.order_status AS ENUM ('pending', 'preparing', 'ready', 'delivered', 'cancelled');

-- Critical intermediary table for auth relationships
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'customer'::public.user_role,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Menu categories with optimized image handling
CREATE TABLE public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Menu items with optimized image storage
CREATE TABLE public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    -- Optimized image URLs with WebP support
    image_url TEXT,
    image_webp_url TEXT,
    image_thumbnail_url TEXT,
    -- Image optimization metadata
    image_file_size INTEGER, -- in bytes
    image_width INTEGER,
    image_height INTEGER,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_vegetarian BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    preparation_time INTEGER DEFAULT 15, -- in minutes
    calories INTEGER,
    allergens TEXT[],
    ingredients TEXT[],
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Real-time menu updates log
CREATE TABLE public.menu_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    update_type TEXT NOT NULL, -- 'price', 'availability', 'new_item', 'deleted'
    old_value JSONB,
    new_value JSONB,
    updated_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Customer orders for real-time tracking
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL UNIQUE,
    status public.order_status DEFAULT 'pending'::public.order_status,
    total_amount DECIMAL(10,2) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT,
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Essential Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_menu_categories_slug ON public.menu_categories(slug);
CREATE INDEX idx_menu_categories_active ON public.menu_categories(is_active);
CREATE INDEX idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX idx_menu_items_slug ON public.menu_items(slug);
CREATE INDEX idx_menu_items_available ON public.menu_items(is_available);
CREATE INDEX idx_menu_items_popularity ON public.menu_items(is_popular);
CREATE INDEX idx_menu_updates_item_id ON public.menu_updates(item_id);
CREATE INDEX idx_menu_updates_created_at ON public.menu_updates(created_at);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- 3. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 4. Helper Functions for RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
)
$$;

CREATE OR REPLACE FUNCTION public.is_customer_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role IN ('customer', 'admin')
)
$$;

CREATE OR REPLACE FUNCTION public.owns_order(order_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_uuid AND o.customer_id = auth.uid()
)
$$;

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::public.user_role);  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update menu items timestamp
CREATE OR REPLACE FUNCTION public.update_menu_item_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Trigger for menu items updates
CREATE TRIGGER menu_items_update_timestamp
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_menu_item_timestamp();

-- Function to log menu updates
CREATE OR REPLACE FUNCTION public.log_menu_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO public.menu_updates (item_id, update_type, old_value, new_value, updated_by)
        VALUES (
            NEW.id, 
            'updated',
            row_to_json(OLD),
            row_to_json(NEW),
            auth.uid()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.menu_updates (item_id, update_type, new_value, updated_by)
        VALUES (
            NEW.id,
            'new_item',
            row_to_json(NEW),
            auth.uid()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- Trigger for menu update logging
CREATE TRIGGER menu_items_update_log
    AFTER INSERT OR UPDATE ON public.menu_items
    FOR EACH ROW
    EXECUTE FUNCTION public.log_menu_update();

-- 5. RLS Policies
CREATE POLICY "users_own_profile" ON public.user_profiles FOR ALL
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Menu categories - public read, admin manage
CREATE POLICY "public_read_categories" ON public.menu_categories FOR SELECT
TO public USING (is_active = true);

CREATE POLICY "admin_manage_categories" ON public.menu_categories FOR ALL
TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Menu items - public read, admin manage
CREATE POLICY "public_read_menu_items" ON public.menu_items FOR SELECT
TO public USING (is_available = true);

CREATE POLICY "admin_manage_menu_items" ON public.menu_items FOR ALL
TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Menu updates - admin only
CREATE POLICY "admin_view_menu_updates" ON public.menu_updates FOR SELECT
TO authenticated USING (public.is_admin());

-- Orders - customers own, admin all
CREATE POLICY "customers_own_orders" ON public.orders FOR ALL
TO authenticated USING (
    customer_id = auth.uid() OR public.is_admin()
) WITH CHECK (
    customer_id = auth.uid() OR public.is_admin()
);

-- Order items - through order ownership
CREATE POLICY "order_items_access" ON public.order_items FOR ALL
TO authenticated USING (
    public.owns_order(order_id) OR public.is_admin()
) WITH CHECK (
    public.owns_order(order_id) OR public.is_admin()
);

-- 6. Complete Mock Data with Optimized Images
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    customer_uuid UUID := gen_random_uuid();
    wings_cat_id UUID := gen_random_uuid();
    sandwiches_cat_id UUID := gen_random_uuid();
    juices_cat_id UUID := gen_random_uuid();
    combos_cat_id UUID := gen_random_uuid();
    item1_id UUID := gen_random_uuid();
    item2_id UUID := gen_random_uuid();
    order1_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with complete field structure
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@chickkart.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (customer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'customer@example.com', crypt('customer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Customer", "role": "customer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create menu categories
    INSERT INTO public.menu_categories (id, name, slug, icon_name, description, display_order) VALUES
        (wings_cat_id, 'Chicken Wings', 'chicken-wings', 'Drumstick', 'Crispy and delicious chicken wings', 1),
        (sandwiches_cat_id, 'Sandwiches', 'sandwiches', 'Sandwich', 'Fresh and tasty sandwiches', 2),
        (juices_cat_id, 'Fresh Juices', 'juices', 'GlassWater', 'Healthy and refreshing beverages', 3),
        (combos_cat_id, 'Combo Meals', 'combos', 'Package', 'Great value combo meals', 4);

    -- Create menu items with optimized images
    INSERT INTO public.menu_items (
        id, category_id, name, slug, description, price, original_price,
        image_url, image_webp_url, image_thumbnail_url,
        image_file_size, image_width, image_height,
        rating, review_count, is_popular, is_vegetarian, preparation_time,
        calories, allergens, ingredients
    ) VALUES
        (item1_id, wings_cat_id, 'Spicy Buffalo Wings', 'spicy-buffalo-wings',
         'Crispy chicken wings tossed in our signature buffalo sauce with perfect spices',
         299.00, 349.00,
         'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
         'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp',
         'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
         85000, 800, 600, 4.5, 128, true, false, 20, 450,
         ARRAY['dairy', 'gluten'], ARRAY['chicken', 'buffalo sauce', 'spices']),
         
        (item2_id, sandwiches_cat_id, 'Grilled Chicken Sandwich', 'grilled-chicken-sandwich',
         'Juicy grilled chicken breast with fresh lettuce, tomatoes, and special mayo',
         199.00, null,
         'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
         'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp',
         'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
         92000, 800, 600, 4.3, 156, false, false, 15, 380,
         ARRAY['gluten', 'dairy'], ARRAY['chicken breast', 'lettuce', 'tomato', 'mayo', 'bread']),
         
        (gen_random_uuid(), juices_cat_id, 'Fresh Orange Juice', 'fresh-orange-juice',
         'Freshly squeezed orange juice packed with vitamin C and natural sweetness',
         89.00, null,
         'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
         'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp',
         'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
         65000, 800, 600, 4.4, 67, false, true, 5, 120,
         ARRAY[]::TEXT[], ARRAY['fresh oranges']),
         
        (gen_random_uuid(), combos_cat_id, 'Wings & Fries Combo', 'wings-fries-combo',
         'Six spicy wings with crispy fries, coleslaw, and a soft drink',
         399.00, 459.00,
         'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
         'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp',
         'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
         95000, 800, 600, 4.7, 178, true, false, 25, 750,
         ARRAY['dairy', 'gluten'], ARRAY['chicken wings', 'fries', 'coleslaw', 'soft drink']);

    -- Create sample order
    INSERT INTO public.orders (id, customer_id, order_number, status, total_amount, customer_name, customer_phone, estimated_delivery_time)
    VALUES (order1_id, customer_uuid, 'ORD-001', 'preparing'::public.order_status, 498.00, 'John Customer', '+1234567890', now() + interval '25 minutes');

    -- Create order items
    INSERT INTO public.order_items (order_id, menu_item_id, quantity, unit_price, total_price)
    VALUES
        (order1_id, item1_id, 1, 299.00, 299.00),
        (order1_id, item2_id, 1, 199.00, 199.00);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during data insertion: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during data insertion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during data insertion: %', SQLERRM;
END $$;

-- 7. Views for optimized queries
CREATE VIEW public.menu_items_with_category AS
SELECT 
    mi.*,
    mc.name as category_name,
    mc.slug as category_slug,
    mc.icon_name as category_icon
FROM public.menu_items mi
JOIN public.menu_categories mc ON mi.category_id = mc.id
WHERE mi.is_available = true AND mc.is_active = true
ORDER BY mc.display_order, mi.display_order, mi.name;

-- Enable realtime for menu updates
ALTER publication supabase_realtime ADD TABLE public.menu_items;
ALTER publication supabase_realtime ADD TABLE public.menu_updates;
ALTER publication supabase_realtime ADD TABLE public.orders;
ALTER publication supabase_realtime ADD TABLE public.order_items;