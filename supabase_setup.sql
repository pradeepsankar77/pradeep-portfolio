-- Setup SQL for Pradeep Portfolio Database
-- Run this in the SQL Editor of your Supabase Dashboard (https://supabase.com/dashboard)

-- Create the portfolio table if it doesn't exist
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public READ access (anyone can view your portfolio)
CREATE POLICY "Allow public read access" ON public.portfolio
    FOR SELECT USING (true);

-- Create policy to allow public UPDATE access (so you can save changes using the anon key)
CREATE POLICY "Allow public update access" ON public.portfolio
    FOR UPDATE USING (true) WITH CHECK (true);

-- Create policy to allow admin updates with authenticated key
-- Note: Using the Secret Key (service role key) naturally bypasses RLS,
-- so this table is fully writable via the Admin Drawer using the secret key even without write policies.

-- Insert default seed data (so your portfolio is not empty when first loading)
INSERT INTO public.portfolio (id, name, title, bio, avatar_url, skills, projects, experience, socials)
VALUES (
    1,
    'Pradeep Kumar',
    'Full Stack Developer & UI/UX Designer',
    'I build high-performance, visually stunning web applications with modern design systems and robust backend integrations.',
    'avatar.jpg',
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
    }'::jsonb
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
