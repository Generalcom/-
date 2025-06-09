-- Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50), -- 'user', 'contact', 'payment', etc.
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
  ('site_name', 'Vort', 'The name of the website'),
  ('site_description', 'AI-powered solutions for your business', 'Site description for SEO'),
  ('contact_email', 'support@vort.co.za', 'Main contact email'),
  ('session_timeout', '60', 'Session timeout in minutes'),
  ('max_login_attempts', '5', 'Maximum login attempts before lockout'),
  ('require_email_verification', 'true', 'Whether email verification is required')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admin can view activity log" ON admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can insert activity log" ON admin_activity_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can manage settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
