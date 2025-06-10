-- VERIFICATION SCRIPT
-- Run this to check if admin user is properly set up

-- Check if admin user exists in auth.users
SELECT 
  'AUTH USER CHECK' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin user exists in auth.users'
    ELSE '❌ Admin user NOT found in auth.users'
  END as status,
  COUNT(*) as count
FROM auth.users 
WHERE email = 'support@vort.co.za';

-- Check if admin profile exists
SELECT 
  'PROFILE CHECK' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin profile exists'
    ELSE '❌ Admin profile NOT found'
  END as status,
  COUNT(*) as count
FROM profiles 
WHERE email = 'support@vort.co.za' AND role = 'admin';

-- Check if email is confirmed
SELECT 
  'EMAIL CONFIRMATION' as check_type,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email is confirmed'
    ELSE '❌ Email is NOT confirmed'
  END as status,
  email_confirmed_at
FROM auth.users 
WHERE email = 'support@vort.co.za';

-- Full admin user details
SELECT 
  'FULL DETAILS' as check_type,
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  p.full_name,
  p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'support@vort.co.za';
