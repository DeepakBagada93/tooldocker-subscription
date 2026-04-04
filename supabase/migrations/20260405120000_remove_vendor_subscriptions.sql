-- Migration: Remove vendor and subscription functionality
-- Date: 2026-04-05
-- Purpose: Drop vendor-related tables and subscription tables as we're focusing on buyer and admin dashboards only

-- Drop subscription-related tables
DROP TABLE IF EXISTS vendor_subscriptions CASCADE;
DROP TABLE IF EXISTS subscription_plans CASCADE;

-- Drop vendor store table
DROP TABLE IF EXISTS stores CASCADE;

-- Update profiles table to remove vendor role from check constraint
-- First, drop the existing constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Convert existing vendor roles to buyer before adding new constraint
UPDATE profiles SET role = 'buyer' WHERE role = 'vendor';

-- Add new constraint with only admin and buyer roles
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'buyer'));

-- Clean up any vendor-specific RLS policies that may exist
-- (These will be automatically removed when tables are dropped)

COMMENT ON TABLE profiles IS 'User profiles with admin and buyer roles only';
COMMENT ON TABLE products IS 'Product catalog managed by admin';
COMMENT ON TABLE categories IS 'Product categories hierarchy';
COMMENT ON TABLE orders IS 'Buyer orders';
COMMENT ON TABLE order_items IS 'Individual line items in orders';
COMMENT ON TABLE reviews IS 'Product reviews by buyers';
COMMENT ON TABLE notifications IS 'User notifications';
