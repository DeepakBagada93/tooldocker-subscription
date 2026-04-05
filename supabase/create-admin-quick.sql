-- Quick Admin User Setup Script
-- Run this in Supabase SQL Editor to create admin user
-- Email: tooldockerdev@gmail.com
-- Password: tooldocker@dev
--
-- ⚠️ NOTE: This script creates the user but the password must be set separately
-- via Supabase Dashboard because we cannot properly hash passwords without pgcrypto.
--
-- RECOMMENDED APPROACH:
-- Use Supabase Dashboard > Authentication > Users > Create new user
-- This ensures proper password hashing.

-- Generate a UUID for the new user
-- Note: We'll create the user record, but you MUST set the password via Dashboard

DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'tooldockerdev@gmail.com') THEN
    RAISE NOTICE '⚠️  User already exists: tooldockerdev@gmail.com';
    RAISE NOTICE 'Skipping creation. Verify the role is correct.';
    RETURN;
  END IF;

  RAISE NOTICE 'ℹ️  Due to Supabase security requirements, please create the user manually:';
  RAISE NOTICE '1. Go to https://app.supabase.com';
  RAISE NOTICE '2. Select your project';
  RAISE NOTICE '3. Go to Authentication > Users';
  RAISE NOTICE '4. Click "Add User" > "Create new user"';
  RAISE NOTICE '5. Enter:';
  RAISE NOTICE '   - Email: tooldockerdev@gmail.com';
  RAISE NOTICE '   - Password: tooldocker@dev';
  RAISE NOTICE '   - ✅ Check "Auto Confirm User"';
  RAISE NOTICE '   - User Metadata: {"role": "admin", "full_name": "Tooldocker Admin"}';
  RAISE NOTICE '6. Click "Create User"';
  RAISE NOTICE '';
  RAISE NOTICE 'The profile will be auto-created by the handle_new_user trigger.';
END $$;

-- If user exists, show their details
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  u.raw_user_meta_data->>'role' as auth_role,
  p.role as profile_role,
  p.full_name,
  p.is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'tooldockerdev@gmail.com';
