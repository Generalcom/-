-- Complete Admin User Setup Script
-- Run this in Supabase SQL Editor

-- Step 1: Check if admin user already exists
DO $$
DECLARE
    admin_user_id UUID;
    admin_exists BOOLEAN := FALSE;
BEGIN
    -- Check if user exists in auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'support@vort.co.za' 
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        admin_exists := TRUE;
        RAISE NOTICE 'Admin user already exists with ID: %', admin_user_id;
    END IF;
    
    -- If user doesn't exist, we'll need to create it manually
    IF NOT admin_exists THEN
        RAISE NOTICE 'Admin user does not exist. Please create it using the Supabase Auth dashboard or the setup page.';
    END IF;
    
    -- Ensure profile exists for the admin user
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
            
        RAISE NOTICE 'Admin profile created/updated successfully';
    END IF;
END $$;

-- Verify the setup
SELECT 
    u.id as auth_id,
    u.email as auth_email,
    u.email_confirmed_at,
    u.created_at as auth_created,
    p.id as profile_id,
    p.email as profile_email,
    p.full_name,
    p.role,
    p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'support@vort.co.za';
