-- SECURE ADMIN USER SETUP
-- Run this script in Supabase SQL Editor after creating the auth user manually

-- First, manually create the user in Supabase Dashboard:
-- 1. Go to Authentication → Users
-- 2. Click "Add user"
-- 3. Email: support@vort.co.za
-- 4. Password: Junior@2003
-- 5. Check "Email confirmed"
-- 6. Then run this script

-- Create or update the admin profile
-- Replace 'USER_ID_HERE' with the actual UUID from the auth.users table
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  -- Get the user ID from auth.users where email = 'support@vort.co.za'
  (SELECT id FROM auth.users WHERE email = 'support@vort.co.za' LIMIT 1),
  'support@vort.co.za',
  'System Administrator',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'System Administrator',
  updated_at = NOW();

-- Verify the admin user was created correctly
SELECT 
  u.id,
  u.email,
  u.created_at as auth_created,
  u.email_confirmed_at,
  p.full_name,
  p.role,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'support@vort.co.za';
