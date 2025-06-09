-- First, ensure the profiles table has the role column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create or update the admin profile
-- Note: You'll need to replace the UUID with the actual user ID from Supabase Auth after creating the user
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with actual auth user ID
  'support@vort.co.za',
  'System Administrator',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = 'admin',
  updated_at = NOW();

-- Alternative: Update by email if the profile already exists
UPDATE profiles 
SET role = 'admin', 
    full_name = 'System Administrator',
    updated_at = NOW()
WHERE email = 'support@vort.co.za';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Verify the admin user
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE email = 'support@vort.co.za';
