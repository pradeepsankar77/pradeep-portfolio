
CREATE TABLE IF NOT EXISTS public.portfolio (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    projects JSONB NOT NULL DEFAULT '[]'::jsonb,
    experience JSONB NOT NULL DEFAULT '[]'::jsonb,
    socials JSONB NOT NULL DEFAULT '{}'::jsonb,
    certificates JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Alter table to add certificates column if table existed previously without it
ALTER TABLE public.portfolio 
ADD COLUMN IF NOT EXISTS certificates JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public READ access (anyone can view your portfolio)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" ON public.portfolio
            FOR SELECT USING (true);
    END IF;
END
$$;

-- Create policy to allow public UPDATE access (so you can save changes using the anon key)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow public update access'
    ) THEN
        CREATE POLICY "Allow public update access" ON public.portfolio
            FOR UPDATE USING (true) WITH CHECK (true);
    END IF;
END
$$;

-- Create certificates storage bucket in Supabase (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies to allow public reads and anonymous uploads/deletes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Public Access for Certificates'
    ) THEN
        CREATE POLICY "Public Access for Certificates" ON storage.objects
            FOR SELECT USING (bucket_id = 'certificates');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow Public Uploads'
    ) THEN
        CREATE POLICY "Allow Public Uploads" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'certificates');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Allow Public Deletes'
    ) THEN
        CREATE POLICY "Allow Public Deletes" ON storage.objects
            FOR DELETE USING (bucket_id = 'certificates');
    END IF;
END
$$;

-- Insert default seed data (so your portfolio is not empty when first loading)
INSERT INTO public.portfolio (id, name, title, bio, avatar_url, skills, projects, experience, socials, certificates)
VALUES (
    1,
    'Pradeep Sankar',
    'Full Stack Developer & UI/UX Designer',
    'I build high-performance, visually stunning web applications with modern design systems and robust backend integrations.',
    'https://i.ibb.co/208gPZKB/IMG-20260528-204530-630.png',
    '["JavaScript", "HTML5 & CSS3", "React", "Node.js", "Supabase", "UI/UX Design"]'::jsonb,
    '[
        {
            "title": "Aesthetic E-Commerce",
            "description": "A glassmorphism-themed online store with real-time checkout.",
            "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop",
            "tags": ["React", "Supabase", "CSS Modules"],
            "link": "#"
        },
        {
            "title": "Crypto Dashboard",
            "description": "Real-time cryptocurrency analytics tool featuring high-end charts.",
            "image": "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=600&auto=format&fit=crop",
            "tags": ["Vanilla JS", "Chart.js", "API"],
            "link": "#"
        }
    ]'::jsonb,
    '[
        {
            "role": "Lead Frontend Developer",
            "company": "DesignSphere Studio",
            "period": "2024 - Present",
            "description": "Architected premium web applications using modern styling systems and oversaw frontend design QA."
        },
        {
            "role": "Full Stack Engineer",
            "company": "CloudSoft Solutions",
            "period": "2022 - 2024",
            "description": "Integrated database systems, implemented serverless functions, and crafted responsive user interfaces."
        }
    ]'::jsonb,
    '{
        "github": "https://github.com",
        "linkedin": "https://linkedin.com",
        "twitter": "https://twitter.com",
        "email": "pradeepsankar62@gmail.com",
        "phone": "7904203805"
    }'::jsonb,
    '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET 
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    bio = EXCLUDED.bio,
    avatar_url = EXCLUDED.avatar_url,
    skills = EXCLUDED.skills,
    projects = EXCLUDED.projects,
    experience = EXCLUDED.experience,
    socials = EXCLUDED.socials;
