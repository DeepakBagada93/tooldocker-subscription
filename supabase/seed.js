const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// Use service role key to bypass RLS for seeding, or Anon key if RLS allows anon inserts (we have RLS enabled, so anon inserts might fail depending on policy)
// For local dev where we just want the data in, we can either temporarily disable RLS, use the service key, or rely on a logged-in user session.
// Here we'll generate SQL that can be copy-pasted into the Supabase SQL editor to ensure it runs with correct privileges, or we can use the anon key if we created a specific user.

// The easiest way to seed when RLS is locked down is to generate a SQL insert script:
console.log(`
-- ==========================================
-- SEED DATA FOR TOOLDOCKER
-- RUN THIS IN SUPABASE SQL EDITOR
-- ==========================================

-- 1. Create a mock Admin/Vendor user via Auth first if you want them linked, OR just use generic UUIDs for seeding structural data.
-- To avoid Auth constraints in pure seeding, let's insert a dummy profile directly (assuming we temporarily bypass auth.users constraint or we have an existing user).
-- For this seed to work flawlessly, REPLACE THE 'your-auth-user-id-here' WITH AN ACTUAL USER ID FROM auth.users!
-- Example: SELECT id FROM auth.users LIMIT 1;

DO $$ 
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- Replace with real auth UUID
  v_store_id UUID := gen_random_uuid();
  
  c_power UUID := gen_random_uuid();
  c_hand UUID := gen_random_uuid();
  c_safety UUID := gen_random_uuid();
  c_heavy UUID := gen_random_uuid();
  c_welding UUID := gen_random_uuid();
  c_measuring UUID := gen_random_uuid();
BEGIN

-- Insert Categories
INSERT INTO public.categories (id, name, slug) VALUES
  (c_power, 'Power Tools', 'power-tools'),
  (c_hand, 'Hand Tools', 'hand-tools'),
  (c_safety, 'Safety Gear', 'safety-gear'),
  (c_heavy, 'Heavy Equipment', 'heavy-equipment'),
  (c_welding, 'Welding', 'welding'),
  (c_measuring, 'Measuring', 'measuring')
ON CONFLICT (slug) DO NOTHING;

-- Note: To insert Stores and Products, you must have a valid user in auth.users and profiles.
-- We will stop the automated SQL generation here for stores/products to prevent foreign key errors with non-existent users.
-- To test the UI, go to your Supabase Dashboard, create a user, grant them 'vendor' role in profiles, create a store for them, and then add products via the UI or directly in the table data editor.

END $$;
`)
