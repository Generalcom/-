-- Update the admin user profile to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'support@vort.co.za';

-- If the profile doesn't exist, create it
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  auth.uid() as id,
  'support@vort.co.za' as email,
  'Administrator' as full_name,
  'admin' as role,
  NOW() as created_at,
  NOW() as updated_at
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'support@vort.co.za'
);

-- Also ensure the auth user exists (you'll need to create this manually in Supabase Auth)
-- Email: support@vort.co.za
-- Password: Junior@2003
