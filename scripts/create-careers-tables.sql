-- First, ensure the profiles table has the role column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create job_positions table
CREATE TABLE IF NOT EXISTS job_positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id UUID REFERENCES job_positions(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  linkedin_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  cover_letter TEXT,
  resume_url VARCHAR(500),
  experience_years INTEGER,
  current_company VARCHAR(255),
  current_position VARCHAR(255),
  salary_expectation INTEGER,
  availability_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_positions_active ON job_positions(is_active);
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON job_applications(position_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications(created_at);

-- Insert sample job positions
INSERT INTO job_positions (title, department, location, type, description, requirements) VALUES
(
  'Senior AI Engineer',
  'Engineering',
  'Johannesburg, SA',
  'Full-time',
  'Lead the development of cutting-edge AI models and machine learning solutions for our clients. You will work on complex problems involving natural language processing, computer vision, and predictive analytics.',
  ARRAY[
    '5+ years experience in machine learning and AI',
    'Proficiency in Python, TensorFlow, PyTorch',
    'Experience with cloud platforms (AWS, GCP, Azure)',
    'Strong problem-solving and analytical skills',
    'Experience with MLOps and model deployment',
    'PhD or Masters in Computer Science, AI, or related field preferred'
  ]
),
(
  'Full-Stack Developer',
  'Engineering',
  'Johannesburg, SA / Remote',
  'Full-time',
  'Build and maintain web applications that integrate AI capabilities with modern user interfaces. You will work on both frontend and backend systems using cutting-edge technologies.',
  ARRAY[
    '3+ years full-stack development experience',
    'Proficiency in React, Next.js, Node.js',
    'Experience with TypeScript and modern JavaScript',
    'Database design and optimization skills',
    'API development and integration experience',
    'Knowledge of cloud services and deployment'
  ]
),
(
  'AI Solutions Consultant',
  'Sales & Consulting',
  'Johannesburg, SA',
  'Full-time',
  'Work directly with clients to understand their business needs and design AI solutions that drive measurable value. You will bridge the gap between technical capabilities and business requirements.',
  ARRAY[
    'Business or technical background with AI/ML knowledge',
    'Excellent communication and presentation skills',
    'Understanding of AI/ML concepts and applications',
    'Client-facing experience in consulting or sales',
    'Ability to translate technical concepts to business stakeholders',
    'Experience in project management preferred'
  ]
),
(
  'Marketing Specialist',
  'Marketing',
  'Johannesburg, SA / Remote',
  'Full-time',
  'Drive our marketing efforts and help establish Vort as the leading AI company in South Africa. You will create compelling content, manage campaigns, and build our brand presence.',
  ARRAY[
    '2+ years marketing experience, preferably in tech',
    'Digital marketing expertise (SEO, SEM, social media)',
    'Content creation and copywriting skills',
    'Analytics and data-driven approach to marketing',
    'Experience with marketing automation tools',
    'Understanding of B2B marketing strategies'
  ]
);

-- Enable Row Level Security
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job_positions (public read access)
CREATE POLICY "Anyone can view active job positions" ON job_positions
  FOR SELECT USING (is_active = true);

-- Create policies for job_applications (users can insert their own applications)
CREATE POLICY "Anyone can submit job applications" ON job_applications
  FOR INSERT WITH CHECK (true);

-- Admin policies (only create if role column exists and has admin users)
DO $$
BEGIN
  -- Check if there are any admin users before creating admin policies
  IF EXISTS (SELECT 1 FROM profiles WHERE role = 'admin' LIMIT 1) THEN
    -- Create admin policies for job positions
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'job_positions' 
      AND policyname = 'Admins can manage job positions'
    ) THEN
      EXECUTE 'CREATE POLICY "Admins can manage job positions" ON job_positions
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = ''admin''
          )
        )';
    END IF;

    -- Create admin policies for job applications
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'job_applications' 
      AND policyname = 'Admins can view all job applications'
    ) THEN
      EXECUTE 'CREATE POLICY "Admins can view all job applications" ON job_applications
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = ''admin''
          )
        )';
    END IF;
  END IF;
END $$;

-- Grant necessary permissions
GRANT SELECT ON job_positions TO anon, authenticated;
GRANT INSERT ON job_applications TO anon, authenticated;
GRANT ALL ON job_positions TO service_role;
GRANT ALL ON job_applications TO service_role;

-- Create indexes for profiles role column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
