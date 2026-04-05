-- Migration: Add admin user credentials
-- Date: 2026-04-05
-- Purpose: Create admin user for tooldocker-admin dashboard login
-- Email: tooldockerdev@gmail.com
-- Password: tooldocker@dev

-- Check if admin user exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'tooldockerdev@gmail.com') THEN
    RAISE NOTICE '✅ Admin user already exists: tooldockerdev@gmail.com';
  ELSE
    RAISE NOTICE '⚠️  Admin user needs to be created via Management API';
    RAISE NOTICE 'Run: npm run create-admin';
  END IF;
END $$;
