-- ==========================================================================
-- Supabase Schema for Pradeep Sankar's Portfolio
-- Project ID: mvslanzuxigqrzsycmfw (pradeepsankar77's Project)
-- Region: ap-northeast-2
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mvslanzuxigqrzsycmfw/sql/new
-- ==========================================================================

-- 1. Create portfolio_data Table
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Pradeep Sankar',
  title TEXT DEFAULT 'Full Stack & 3D Creative Engineer',
  bio TEXT DEFAULT 'I craft visually stunning, highly interactive, and responsive web applications with modern design languages like Glassmorphism and Glowmorphism.',
  avatar_url TEXT DEFAULT 'IMG_20260528_204530_630.png',
  skills JSONB DEFAULT '["React", "Node.js", "Supabase", "JavaScript ES6+", "HTML5 & CSS3", "Three.js", "Glassmorphism", "RESTful APIs"]'::jsonb,
  projects JSONB DEFAULT '[
    {
      "title": "Alpaca AI Trading Agent",
      "description": "Automated algorithmic trading system leveraging Alpaca API, real-time market data streaming via WebSockets, and risk-management execution models.",
      "image": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop",
      "tags": ["Node.js", "Express", "Alpaca API", "WebSockets"],
      "demo": "https://github.com/pradeepsankar77/alpaca-ai-trading-agent",
      "repo": "https://github.com/pradeepsankar77/alpaca-ai-trading-agent"
    },
    {
      "title": "AgriLink Smart Cloud Platform",
      "description": "Agricultural technology cloud platform featuring IoT sensor synchronization, market pricing analytics, and real-time farmer community exchange.",
      "image": "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop",
      "tags": ["React", "Supabase", "PostgreSQL", "Tailwind"],
      "demo": "https://github.com/pradeepsankar77/Agrilink",
      "repo": "https://github.com/pradeepsankar77/Agrilink"
    },
    {
      "title": "Cinematic 3D Developer Workstation",
      "description": "Interactive glassmorphic developer portfolio with real 3D perspective depth, WebGL shaders, Three.js viewports, and restrained micro-motion.",
      "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop",
      "tags": ["Three.js", "WebGL", "CSS 3D", "Vanilla JS"],
      "demo": "https://pradeepsankar77.github.io/pradeep-portfolio/",
      "repo": "https://github.com/pradeepsankar77/pradeep-portfolio"
    },
    {
      "title": "Enterprise Auth & Data Sync Gateway",
      "description": "Scalable backend microservice implementing Row-Level Security, JWT authentication, and bi-directional realtime PostgreSQL subscriptions.",
      "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
      "tags": ["Node.js", "PostgreSQL", "Supabase", "REST API"],
      "demo": "https://github.com/pradeepsankar77",
      "repo": "https://github.com/pradeepsankar77"
    }
  ]'::jsonb,
  experience JSONB DEFAULT '[
    {
      "role": "Full Stack Software Engineer",
      "company": "Independent Projects & Workstation",
      "period": "2024 — Present",
      "description": "Architected automated trading microservices with Alpaca API, agricultural IoT data pipelines with AgriLink, and 3D WebGL web applications with React, Supabase, and Node.js."
    },
    {
      "role": "Frontend & Web Systems Developer",
      "company": "Engineering Academia & Innovation Labs",
      "period": "2022 — 2024",
      "description": "Engineered responsive full stack applications, structured PostgreSQL schemas with Row-Level Security, and crafted accessible user interfaces with glassmorphic design systems."
    }
  ]'::jsonb,
  socials JSONB DEFAULT '{
    "github": "https://github.com/pradeepsankar77",
    "linkedin": "https://linkedin.com",
    "email": "pradeepsankar62@gmail.com",
    "phone": "+91 7904203805"
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert Default Row if empty
INSERT INTO public.portfolio_data (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Access Policies
DROP POLICY IF EXISTS "Public select policy" ON public.portfolio_data;
CREATE POLICY "Public select policy" ON public.portfolio_data
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert policy" ON public.portfolio_data;
CREATE POLICY "Public insert policy" ON public.portfolio_data
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update policy" ON public.portfolio_data;
CREATE POLICY "Public update policy" ON public.portfolio_data
  FOR UPDATE USING (true) WITH CHECK (true);
