-- ==========================================
-- TOOLDOCKER - VENDOR SUBSCRIPTION MODEL
-- ==========================================

CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'past_due', 'cancelled', 'expired');
CREATE TYPE public.billing_interval AS ENUM ('monthly', 'yearly');

CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    billing_interval public.billing_interval NOT NULL,
    price_amount DECIMAL(10,2) NOT NULL CHECK (price_amount >= 0),
    product_limit INTEGER NOT NULL CHECK (product_limit >= 0),
    analytics_enabled BOOLEAN NOT NULL DEFAULT false,
    bulk_upload_enabled BOOLEAN NOT NULL DEFAULT false,
    custom_storefront_enabled BOOLEAN NOT NULL DEFAULT false,
    support_level TEXT,
    stripe_price_id TEXT UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.vendor_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE RESTRICT NOT NULL,
    status public.subscription_status NOT NULL DEFAULT 'trialing',
    billing_interval public.billing_interval NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_vendor_subscriptions_active_vendor
ON public.vendor_subscriptions(vendor_id)
WHERE status IN ('trialing', 'active', 'past_due');

CREATE INDEX idx_vendor_subscriptions_plan_id ON public.vendor_subscriptions(plan_id);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription plans are viewable by everyone"
ON public.subscription_plans FOR SELECT
USING (true);

CREATE POLICY "Admins manage subscription plans"
ON public.subscription_plans FOR ALL
USING (public.is_admin());

CREATE POLICY "Vendors view own subscriptions"
ON public.vendor_subscriptions FOR SELECT
USING (auth.uid() = vendor_id);

CREATE POLICY "Admins manage vendor subscriptions"
ON public.vendor_subscriptions FOR ALL
USING (public.is_admin());

CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_vendor_subscriptions_updated_at
BEFORE UPDATE ON public.vendor_subscriptions
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.vendor_has_active_subscription(target_vendor_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.vendor_subscriptions
    WHERE vendor_id = target_vendor_id
      AND status IN ('trialing', 'active')
      AND (current_period_end IS NULL OR current_period_end >= NOW())
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Vendors create products only with active subscriptions"
ON public.products
AS RESTRICTIVE
FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT vendor_id FROM public.stores WHERE id = store_id)
  AND public.is_vendor()
  AND public.vendor_has_active_subscription(auth.uid())
);
