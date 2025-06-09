-- Add role column to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create admin user profile (you'll need to create the auth user first)
-- This will be updated once you create the auth user
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder ID, will be updated
  'support@vort.co.za',
  'System Administrator',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  full_name = 'System Administrator',
  updated_at = NOW();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
