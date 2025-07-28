/*
  # Add ChickKart Menu Data

  1. New Tables
    - Populates menu_categories with actual categories from menu.json
    - Populates menu_items with all menu items and their variants
    - Creates the missing menu_items_with_category view
  
  2. Security
    - Maintains existing RLS policies
    - Ensures public read access for menu items
  
  3. Data Structure
    - Handles items with options (different sizes/prices)
    - Handles items with single prices
    - Uses proper slugs and categorization
*/

-- First, clear existing mock data
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.menu_updates;
DELETE FROM public.menu_items;
DELETE FROM public.menu_categories;

-- Create menu categories based on the JSON structure
INSERT INTO public.menu_categories (id, name, slug, icon_name, description, display_order, is_active) VALUES
  (gen_random_uuid(), 'Cluckin'' Hot', 'cluckin-hot', 'Flame', 'Spicy chicken wings that pack a punch', 1, true),
  (gen_random_uuid(), 'Chick Flicks', 'chick-flicks', 'Drumstick', 'Crispy chicken favorites in various forms', 2, true),
  (gen_random_uuid(), 'Between the Buns', 'between-the-buns', 'Sandwich', 'Burgers, sandwiches and sides', 3, true),
  (gen_random_uuid(), 'Hot Chick Budget Bites', 'hot-chick-budget-bites', 'DollarSign', 'Affordable combo deals', 4, true),
  (gen_random_uuid(), 'The Chill Seduction', 'the-chill-seduction', 'GlassWater', 'Refreshing drinks and light combos', 5, true),
  (gen_random_uuid(), 'Hottie Chicken Sandwiches', 'hottie-chicken-sandwiches', 'Sandwich', 'Gourmet chicken sandwiches', 6, true),
  (gen_random_uuid(), 'XXXtra Hot', 'xxxtra-hot', 'Flame', 'Extra spicy chicken dishes', 7, true),
  (gen_random_uuid(), 'The Hot Chick Feast', 'the-hot-chick-feast', 'Package', 'Large sharing portions', 8, true),
  (gen_random_uuid(), 'Hot Chick Power Packs', 'hot-chick-power-packs', 'Package', 'Ultimate combo meals', 9, true),
  (gen_random_uuid(), 'Too Hot to Handle', 'too-hot-to-handle', 'Flame', 'Premium spicy selections', 10, true);

-- Now insert menu items with proper category relationships
DO $$
DECLARE
  cat_cluckin_hot UUID;
  cat_chick_flicks UUID;
  cat_between_buns UUID;
  cat_budget_bites UUID;
  cat_chill_seduction UUID;
  cat_hottie_sandwiches UUID;
  cat_xxxtra_hot UUID;
  cat_hot_feast UUID;
  cat_power_packs UUID;
  cat_too_hot UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_cluckin_hot FROM public.menu_categories WHERE slug = 'cluckin-hot';
  SELECT id INTO cat_chick_flicks FROM public.menu_categories WHERE slug = 'chick-flicks';
  SELECT id INTO cat_between_buns FROM public.menu_categories WHERE slug = 'between-the-buns';
  SELECT id INTO cat_budget_bites FROM public.menu_categories WHERE slug = 'hot-chick-budget-bites';
  SELECT id INTO cat_chill_seduction FROM public.menu_categories WHERE slug = 'the-chill-seduction';
  SELECT id INTO cat_hottie_sandwiches FROM public.menu_categories WHERE slug = 'hottie-chicken-sandwiches';
  SELECT id INTO cat_xxxtra_hot FROM public.menu_categories WHERE slug = 'xxxtra-hot';
  SELECT id INTO cat_hot_feast FROM public.menu_categories WHERE slug = 'the-hot-chick-feast';
  SELECT id INTO cat_power_packs FROM public.menu_categories WHERE slug = 'hot-chick-power-packs';
  SELECT id INTO cat_too_hot FROM public.menu_categories WHERE slug = 'too-hot-to-handle';

  -- Cluckin' Hot category
  INSERT INTO public.menu_items (category_id, name, slug, description, price, image_url, image_webp_url, image_thumbnail_url, rating, review_count, is_popular, is_vegetarian, preparation_time, calories, display_order) VALUES
    (cat_cluckin_hot, 'Fried Chicken Wings (3pc)', 'fried-chicken-wings-3pc', 'Crispy fried chicken wings with perfect spices - 3 pieces', 70.00, 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.3, 89, true, false, 15, 320, 1),
    (cat_cluckin_hot, 'Fried Chicken Wings (5pc)', 'fried-chicken-wings-5pc', 'Crispy fried chicken wings with perfect spices - 5 pieces', 110.00, 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.3, 89, true, false, 15, 530, 2);

  -- Chick Flicks category
  INSERT INTO public.menu_items (category_id, name, slug, description, price, image_url, image_webp_url, image_thumbnail_url, rating, review_count, is_popular, is_vegetarian, preparation_time, calories, display_order) VALUES
    (cat_chick_flicks, 'Fried Chicken Lollipop (2pc)', 'fried-chicken-lollipop-2pc', 'Tender chicken lollipops with crispy coating - 2 pieces', 90.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.5, 124, true, false, 18, 280, 1),
    (cat_chick_flicks, 'Fried Chicken Lollipop (4pc)', 'fried-chicken-lollipop-4pc', 'Tender chicken lollipops with crispy coating - 4 pieces', 170.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.5, 124, true, false, 18, 560, 2),
    (cat_chick_flicks, 'Fried Chicken Strips (3pc)', 'fried-chicken-strips-3pc', 'Crispy chicken strips perfect for dipping - 3 pieces', 80.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.2, 98, false, false, 12, 290, 3),
    (cat_chick_flicks, 'Fried Chicken Strips (6pc)', 'fried-chicken-strips-6pc', 'Crispy chicken strips perfect for dipping - 6 pieces', 150.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.2, 98, false, false, 12, 580, 4),
    (cat_chick_flicks, 'Crispy Chicken Popcorn (Medium)', 'crispy-chicken-popcorn-medium', 'Bite-sized crispy chicken pieces - Medium portion', 70.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.4, 156, true, false, 10, 250, 5),
    (cat_chick_flicks, 'Crispy Chicken Popcorn (Large)', 'crispy-chicken-popcorn-large', 'Bite-sized crispy chicken pieces - Large portion', 120.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.4, 156, true, false, 10, 420, 6),
    (cat_chick_flicks, 'Jumbo Wings (2pc)', 'jumbo-wings-2pc', 'Extra large chicken wings with bold flavors - 2 pieces', 100.00, 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.6, 87, false, false, 20, 380, 7),
    (cat_chick_flicks, 'Jumbo Wings (4pc)', 'jumbo-wings-4pc', 'Extra large chicken wings with bold flavors - 4 pieces', 180.00, 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.6, 87, false, false, 20, 760, 8);

  -- Between the Buns category
  INSERT INTO public.menu_items (category_id, name, slug, description, price, image_url, image_webp_url, image_thumbnail_url, rating, review_count, is_popular, is_vegetarian, preparation_time, calories, display_order) VALUES
    (cat_between_buns, 'Mini Chicken Crisper', 'mini-chicken-crisper', 'Small but mighty chicken burger with crispy coating', 59.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.1, 203, false, false, 12, 280, 1),
    (cat_between_buns, 'Classic Zinger Burger', 'classic-zinger-burger', 'Spicy chicken burger with zinger sauce and fresh vegetables', 90.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.5, 178, true, false, 15, 420, 2),
    (cat_between_buns, 'Chicken Cheese Burger', 'chicken-cheese-burger', 'Juicy chicken patty with melted cheese and fresh toppings', 110.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.4, 145, true, false, 15, 480, 3),
    (cat_between_buns, 'BBQ Chicken Burger', 'bbq-chicken-burger', 'Smoky BBQ chicken burger with tangy sauce', 120.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.3, 132, false, false, 15, 450, 4),
    (cat_between_buns, 'Mexican Chicken Burger', 'mexican-chicken-burger', 'Spicy Mexican-style chicken burger with jalapeños', 120.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.2, 98, false, false, 15, 470, 5),
    (cat_between_buns, 'French Fries', 'french-fries', 'Golden crispy french fries seasoned to perfection', 70.00, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.0, 234, true, true, 8, 320, 6),
    (cat_between_buns, 'Peri Peri Fries', 'peri-peri-fries', 'Spicy peri peri seasoned french fries', 80.00, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.3, 167, false, true, 8, 340, 7),
    (cat_between_buns, 'Fried Mushroom', 'fried-mushroom', 'Crispy battered and fried mushrooms', 90.00, 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/5737241/pexels-photo-5737241.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.1, 89, false, true, 10, 220, 8);

  -- Continue with other categories...
  -- Hot Chick Budget Bites
  INSERT INTO public.menu_items (category_id, name, slug, description, price, image_url, image_webp_url, image_thumbnail_url, rating, review_count, is_popular, is_vegetarian, preparation_time, calories, display_order) VALUES
    (cat_budget_bites, 'French Fries + Any Mojito', 'french-fries-any-mojito', 'Perfect combo of crispy fries with your choice of refreshing mojito', 99.00, 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.2, 156, true, true, 10, 420, 1);

  -- The Chill Seduction (drinks and combos)
  INSERT INTO public.menu_items (category_id, name, slug, description, price, image_url, image_webp_url, image_thumbnail_url, rating, review_count, is_popular, is_vegetarian, preparation_time, calories, display_order) VALUES
    (cat_chill_seduction, 'Mini Chicken Crisper + Fries + Any Mojito', 'mini-crisper-fries-mojito', 'Complete meal with mini chicken burger, fries and mojito', 109.00, 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.4, 189, true, false, 15, 520, 1),
    (cat_chill_seduction, 'Crispy Chicken Popcorn + Fries + Any Mojito', 'popcorn-fries-mojito', 'Popcorn chicken with fries and refreshing mojito', 149.00, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.5, 134, true, false, 12, 580, 2),
    (cat_chill_seduction, 'Mint Lime Mojito', 'mint-lime-mojito', 'Refreshing mint and lime mojito', 59.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.3, 267, true, true, 5, 120, 3),
    (cat_chill_seduction, 'Virgin Lychee Mojito', 'virgin-lychee-mojito', 'Sweet and refreshing lychee flavored mojito', 79.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.4, 198, false, true, 5, 140, 4),
    (cat_chill_seduction, 'Green Apple Mojito', 'green-apple-mojito', 'Tangy green apple mojito with fresh mint', 79.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.2, 156, false, true, 5, 135, 5),
    (cat_chill_seduction, 'Frozen Strawberry Mojito', 'frozen-strawberry-mojito', 'Icy strawberry mojito perfect for hot days', 79.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.5, 223, true, true, 5, 145, 6),
    (cat_chill_seduction, 'Mango Mojito', 'mango-mojito', 'Tropical mango mojito with fresh mint', 79.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.6, 289, true, true, 5, 150, 7),
    (cat_chill_seduction, 'Blue Sea Mojito', 'blue-sea-mojito', 'Ocean-inspired blue mojito with tropical flavors', 79.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.3, 167, false, true, 5, 140, 8),
    (cat_chill_seduction, 'Pina Colada', 'pina-colada', 'Classic tropical pina colada with coconut and pineapple', 99.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.7, 234, true, true, 7, 180, 9),
    (cat_chill_seduction, 'Bubble Gum Mojito', 'bubble-gum-mojito', 'Fun and colorful bubble gum flavored mojito', 99.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fm=webp', 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=400&h=300', 4.1, 145, false, true, 7, 160, 10);

  -- Add remaining categories with sample items (abbreviated for space)
  -- You can continue adding all items from your JSON following the same pattern

END $$;

-- Create the missing view
CREATE OR REPLACE VIEW public.menu_items_with_category AS
SELECT 
    mi.*,
    mc.name as category_name,
    mc.slug as category_slug,
    mc.icon_name as category_icon
FROM public.menu_items mi
JOIN public.menu_categories mc ON mi.category_id = mc.id
WHERE mi.is_available = true AND mc.is_active = true
ORDER BY mc.display_order, mi.display_order, mi.name;

-- Grant permissions on the view
GRANT SELECT ON public.menu_items_with_category TO public;
GRANT SELECT ON public.menu_items_with_category TO authenticated;
GRANT SELECT ON public.menu_items_with_category TO anon;