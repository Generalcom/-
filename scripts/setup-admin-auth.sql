-- This script provides the SQL commands to manually create the admin user
-- You'll need to run these in the Supabase SQL editor or use the Auth dashboard

-- 1. First create the auth user (run this in Supabase SQL editor)
-- Note: This creates a user in the auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'support@vort.co.za',
  crypt('Junior@2003', gen_salt('bf')), -- Encrypted password
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 2. Get the user ID that was just created
SELECT id, email FROM auth.users WHERE email = 'support@vort.co.za';

-- 3. Create the profile using the ID from step 2
-- Replace 'USER_ID_FROM_STEP_2' with the actual UUID
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'USER_ID_FROM_STEP_2', -- Replace with actual UUID
  'support@vort.co.za',
  'System Administrator',
  'admin',
  NOW(),
  NOW()
);
