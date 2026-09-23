-- 1. Ensure all missing columns are explicitly added using ALTER TABLE
-- This avoids the issue where CREATE TABLE IF NOT EXISTS skips adding columns to existing tables.

-- LANGUAGES
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS native_name TEXT;
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- AUTHORS
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS avatar_public_id TEXT;
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.authors ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- CATEGORIES
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- GENRES
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS icon_name TEXT;
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.genres ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- STORIES
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS short_synopsis TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS full_synopsis TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS language_id UUID REFERENCES public.languages(id) ON DELETE SET NULL;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'free';
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS cover_public_id TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS popular BOOLEAN DEFAULT false;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS trending BOOLEAN DEFAULT false;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- EPISODES
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS episode_number INTEGER;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS access_type TEXT DEFAULT 'free';
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS cover_url TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS cover_public_id TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add Unique constraint on episodes if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'episodes_story_id_episode_number_key') THEN
        ALTER TABLE public.episodes ADD CONSTRAINT episodes_story_id_episode_number_key UNIQUE (story_id, episode_number);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'episodes_story_id_slug_key') THEN
        ALTER TABLE public.episodes ADD CONSTRAINT episodes_story_id_slug_key UNIQUE (story_id, slug);
    END IF;
END $$;


-- CRITICAL: Force PostgREST to reload its schema cache
-- This guarantees that the API immediately recognizes the newly added columns (like display_order).
NOTIFY pgrst, 'reload schema';
