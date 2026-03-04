-- ==========================================
-- TOOLDOCKER - MULTIVENDOR SUPABASE SCHEMA
-- ==========================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'vendor', 'buyer');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'disputed');
CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'resolved_buyer', 'resolved_vendor', 'closed');

-- 2. TABLES

-- Profiles (Extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'buyer',
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stores (Vendor Profiles & Settings)
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    store_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Global default commission is 10%, can be overridden per vendor 
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES public.categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    inventory_count INTEGER NOT NULL DEFAULT 0 CHECK (inventory_count >= 0),
    images TEXT[],
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent Orders (The Buyer's full order containing items from multiple vendors)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    shipping_address JSONB NOT NULL,
    payment_intent_id TEXT, -- Stripe / Payment gateway reference
    status order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendor Orders (The Multi-Vendor Split & Commission Logic)
-- One master order is split into multiple vendor orders based on the cart's store layout.
CREATE TABLE public.vendor_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES public.stores(id) NOT NULL,
    status order_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL, -- Calculated automatically before insertion
    net_amount DECIMAL(10,2) NOT NULL, -- Earnings for vendor: total_amount - commission_amount
    transfer_group TEXT, -- Stripe transfer group reference
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    vendor_order_id UUID REFERENCES public.vendor_orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time DECIMAL(10,2) NOT NULL, -- Price snapshotted at time of purchase
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes (For Vendor Orders)
CREATE TABLE public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_order_id UUID REFERENCES public.vendor_orders(id) NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
    reason TEXT NOT NULL,
    status dispute_status DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews (Products & Vendors)
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX idx_products_store_id ON public.products(store_id);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_vendor_orders_order_id ON public.vendor_orders(order_id);
CREATE INDEX idx_vendor_orders_store_id ON public.vendor_orders(store_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_vendor_order_id ON public.order_items(vendor_order_id);
CREATE INDEX idx_disputes_vendor_order_id ON public.disputes(vendor_order_id);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS across the board for production security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security Definer Functions for Role Checks
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_vendor() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'vendor'
  );
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_role() RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Public can view, only owner can update
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Stores: Public can view, Vendors manage their own store, Admins manage all
CREATE POLICY "Stores are viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Vendors can create. store" ON public.stores FOR INSERT WITH CHECK (auth.uid() = vendor_id AND is_vendor());
CREATE POLICY "Vendors can update own store" ON public.stores FOR UPDATE USING (auth.uid() = vendor_id);
CREATE POLICY "Admins bypass stores policy" ON public.stores FOR ALL USING (is_admin());

-- Categories: Public can view, Admins manage all
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL USING (is_admin());

-- Products: Public can view published, Vendors manage their own, Admins manage all
CREATE POLICY "Published/Vendors products viewable" ON public.products FOR SELECT USING (
  is_published = true OR 
  is_admin() OR 
  auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id)
);
CREATE POLICY "Vendors manage own products" ON public.products FOR INSERT WITH CHECK (auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id) AND is_vendor());
CREATE POLICY "Vendors update own products" ON public.products FOR UPDATE USING (auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Vendors delete own products" ON public.products FOR DELETE USING (auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Admins bypass products policy" ON public.products FOR ALL USING (is_admin());

-- Orders: Buyers see their own orders, Admins manage all
CREATE POLICY "Buyers view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Admins bypass orders policy" ON public.orders FOR ALL USING (is_admin());

-- Vendor Orders: Vendors view their own, Buyers view related to their orders
CREATE POLICY "Vendors view own vendor orders" ON public.vendor_orders FOR SELECT USING (auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Buyers view vendor orders linked to their parent order" ON public.vendor_orders FOR SELECT USING (auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id));
CREATE POLICY "Vendors update own vendor order status" ON public.vendor_orders FOR UPDATE USING (auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Admins bypass vendor_orders policy" ON public.vendor_orders FOR ALL USING (is_admin());

-- Order Items: Buyers view their items, Vendors view their items
CREATE POLICY "Buyers view own order items" ON public.order_items FOR SELECT USING (auth.uid() IN (SELECT buyer_id FROM public.orders WHERE id = order_id));
CREATE POLICY "Vendors view own order items" ON public.order_items FOR SELECT USING (auth.uid() IN (SELECT vendor_id FROM public.stores s JOIN public.vendor_orders vo ON s.id = vo.store_id WHERE vo.id = vendor_order_id));
CREATE POLICY "Admins bypass order_items policy" ON public.order_items FOR ALL USING (is_admin());

-- Disputes: Buyers create/view, Vendors view related, Admins update/manage
CREATE POLICY "Buyers view own disputes" ON public.disputes FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Vendors view disputes against them" ON public.disputes FOR SELECT USING (auth.uid() IN (SELECT vendor_id FROM public.stores s JOIN public.vendor_orders vo ON s.id = vo.store_id WHERE vo.id = vendor_order_id));
CREATE POLICY "Buyers create disputes" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Admins bypass disputes policy" ON public.disputes FOR ALL USING (is_admin());

-- Reviews: Public view, Buyers create/update/delete own
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Buyers create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = buyer_id);
CREATE POLICY "Buyers delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = buyer_id);

-- Notifications: Users manage their own
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- 5. AUTOMATED TRIGGER/FUNCTION LOGIC 

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_vendor_orders_updated_at BEFORE UPDATE ON public.vendor_orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- User creation trigger to generate profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'buyer'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: We generally apply this to Supabase's auth.users table in the Supabase Dashboard directly
-- CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger: Notify Vendor on New Dispute
CREATE OR REPLACE FUNCTION public.notify_vendor_on_dispute()
RETURNS TRIGGER AS $$
DECLARE
    v_vendor_id UUID;
BEGIN
    SELECT s.vendor_id INTO v_vendor_id 
    FROM public.vendor_orders vo
    JOIN public.stores s ON vo.store_id = s.id
    WHERE vo.id = NEW.vendor_order_id;

    INSERT INTO public.notifications (user_id, title, message, link)
    VALUES (v_vendor_id, 'New Dispute Raised', 'A buyer has raised a dispute on one of your orders.', '/vendor/disputes/' || NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_vendor_dispute
    AFTER INSERT ON public.disputes
    FOR EACH ROW EXECUTE PROCEDURE public.notify_vendor_on_dispute();
