-- Create admin user and set up admin role
-- First, we need to create the admin user manually in Supabase Auth
-- Then update their profile with admin role

-- Update profiles table to include role column if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create admin profile (this will be linked to the auth user)
-- The admin user must be created in Supabase Auth dashboard first with email: support@vort.co.za
INSERT INTO profiles (id, full_name, email, role, created_at, updated_at)
VALUES (
  -- You'll need to replace this UUID with the actual user ID from Supabase Auth
  '00000000-0000-0000-0000-000000000000', -- Placeholder - replace with actual admin user ID
  'Vort Admin',
  'support@vort.co.za',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Create RLS policies for admin access
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can view all contacts
CREATE POLICY "Admins can view all contacts" ON contacts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update contact status
CREATE POLICY "Admins can update contacts" ON contacts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can view all consultations
CREATE POLICY "Admins can view all consultations" ON consultations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update consultation status
CREATE POLICY "Admins can update consultations" ON consultations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
