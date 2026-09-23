-- Supabase Database Schema for StoryEpisodes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Authors Table
CREATE TABLE IF NOT EXISTS public.authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  avatar_public_id TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Genres Table
CREATE TABLE IF NOT EXISTS public.genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Languages Table
CREATE TABLE IF NOT EXISTS public.languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Stories Table
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_synopsis TEXT,
  full_synopsis TEXT,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  language_id UUID REFERENCES public.languages(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft',
  access_type TEXT DEFAULT 'free',
  cover_url TEXT,
  cover_public_id TEXT,
  featured BOOLEAN DEFAULT false,
  popular BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Story Genres (Many-to-Many) Table
CREATE TABLE IF NOT EXISTS public.story_genres (
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES public.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (story_id, genre_id)
);

-- 7. Episodes Table
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  content TEXT,
  summary TEXT,
  status TEXT DEFAULT 'draft',
  access_type TEXT DEFAULT 'free',
  cover_url TEXT,
  cover_public_id TEXT,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, episode_number),
  UNIQUE(story_id, slug)
);

-- Row Level Security (RLS) setup
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active/published content
CREATE POLICY "Public profiles are viewable by everyone" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public genres are viewable by everyone" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Public languages are viewable by everyone" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Public stories are viewable by everyone" ON public.stories FOR SELECT USING (true);
CREATE POLICY "Public story_genres are viewable by everyone" ON public.story_genres FOR SELECT USING (true);
CREATE POLICY "Public episodes are viewable by everyone" ON public.episodes FOR SELECT USING (true);

-- Allow admins to do everything (Assuming they are authenticated)
CREATE POLICY "Admins can insert authors" ON public.authors FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update authors" ON public.authors FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete authors" ON public.authors FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert genres" ON public.genres FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update genres" ON public.genres FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete genres" ON public.genres FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert languages" ON public.languages FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update languages" ON public.languages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete languages" ON public.languages FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert stories" ON public.stories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update stories" ON public.stories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete stories" ON public.stories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert story_genres" ON public.story_genres FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete story_genres" ON public.story_genres FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert episodes" ON public.episodes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update episodes" ON public.episodes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete episodes" ON public.episodes FOR DELETE USING (auth.role() = 'authenticated');
