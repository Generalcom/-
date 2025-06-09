-- First, let's check if the admin user exists in auth.users
-- This query will show us the actual user ID from Supabase Auth
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'support@vort.co.za';

-- Check if profile exists
SELECT id, email, full_name, role, created_at 
FROM profiles 
WHERE email = 'support@vort.co.za';

-- If the auth user exists but profile doesn't, we need to create/update the profile
-- Replace 'ACTUAL_USER_ID_HERE' with the ID from the first query above
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the actual user ID from auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'support@vort.co.za' 
    LIMIT 1;
    
    -- If user exists, create/update their profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO profiles (
            id,
            email,
            full_name,
            role,
            created_at,
            updated_at
        ) VALUES (
            admin_user_id,
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
            
        RAISE NOTICE 'Admin profile created/updated for user ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'No auth user found with email support@vort.co.za';
    END IF;
END $$;

-- Verify the setup
SELECT 
    u.id as auth_id,
    u.email as auth_email,
    u.email_confirmed_at,
    p.id as profile_id,
    p.email as profile_email,
    p.full_name,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'support@vort.co.za';
