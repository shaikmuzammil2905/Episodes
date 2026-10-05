import { createPublicClient } from '@/lib/supabase/server'
import type { Story, Episode, Author, Genre } from '@/lib/types'
import { matchesLanguage, isStoryType, matchesSearch } from '@/lib/normalization'

// Transforms DB story rows into the frontend Story type for backward compatibility
function transformStory(row: any): Story {
  const episodes: Episode[] = (row.episodes || []).map((ep: any) => ({
    id: ep.id,
    storyId: row.id,
    episodeNumber: ep.episode_number,
    title: ep.title,
    summary: ep.summary || '',
    content: ep.content || '',
    readingTime: `${Math.max(1, Math.ceil((ep.content?.length || 0) / 1000))} min`,
    publishedAt: ep.published_at || ep.created_at,
    image: ep.cover_url || ep.image_url || undefined,
  }))

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    author: row.author?.name || 'Unknown Author',
    authorId: row.author?.id || '',
    authorAvatar: row.author?.avatar_url || row.author?.image_url || undefined,
    genre: row.story_genres?.[0]?.genres?.name || row.category?.name || 'General',
    genreId: row.story_genres?.[0]?.genres?.slug || row.category?.slug || 'general',
    categoryName: row.category?.name,
    categorySlug: row.category?.slug,
    categoryId: row.category?.id || row.category_id,
    language: row.language?.name || 'English',
    languageCode: row.language?.code || 'en',
    languageId: row.language?.id || row.language_id,
    coverImage: row.cover_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    shortDescription: row.short_synopsis || '',
    fullDescription: row.full_synopsis || row.short_synopsis || '',
    status: 'Ongoing',
    isPremium: row.access_type === 'premium',
    tags: [],
    readingTime: episodes.length > 0 ? `${episodes.length * 5} min total` : undefined,
    whyRead: '',
    featured: row.featured || false,
    recommended: row.trending || false,
    latest: true,
    episodes,
  }
}

export async function getPublicStories(filters?: {
  language?: string
  category?: string
  search?: string
  featured?: boolean
  popular?: boolean
  trending?: boolean
}): Promise<Story[]> {
  const supabase = createPublicClient()
  
  let query = supabase
    .from('stories')
    .select(`
      *,
      author:authors(*),
      language:languages(*),
      category:categories(*),
      story_genres(genre_id, genres(*)),
      episodes:episodes(*)
    `)
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('published_at', { ascending: false })

  if (filters?.featured) query = query.eq('featured', true)
  if (filters?.popular) query = query.eq('popular', true)
  if (filters?.trending) query = query.eq('trending', true)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching stories from Supabase:', error)
    return []
  }

  let stories = (data || []).map(row => {
    if (row.episodes) {
      row.episodes = row.episodes
        .filter((ep: any) => ep.status === 'published')
        .sort((a: any, b: any) => Number(a.episode_number) - Number(b.episode_number))
    }
    return transformStory(row)
  })

  // Apply language filter (case-insensitive and code-aware)
  if (filters?.language && filters.language !== 'All Languages') {
    stories = stories.filter(s => matchesLanguage(s.language, filters.language) || (s.languageCode && matchesLanguage(s.languageCode, filters.language)))
  }

  // Apply category filter (normalized slug and name aware)
  if (filters?.category && filters.category !== 'All Categories') {
    stories = stories.filter(s => isStoryType(s, filters.category!))
  }

  // Apply search query (matches title, author, category, genre, language, synopsis)
  if (filters?.search && filters.search.trim()) {
    stories = stories.filter(s => matchesSearch(s, filters.search!))
  }

  return stories
}

export async function getPublicStoryBySlug(slug: string): Promise<Story | null> {
  const supabase = createPublicClient()

  const { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      author:authors(*),
      language:languages(*),
      category:categories(*),
      story_genres(genre_id, genres(*)),
      episodes:episodes(*)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  
  // Also filter episodes to only show published ones
  if (data.episodes) {
    data.episodes = data.episodes
      .filter((ep: any) => ep.status === 'published')
      .sort((a: any, b: any) => a.episode_number - b.episode_number)
  }

  return transformStory(data)
}

export async function getPublicStoryById(id: string): Promise<Story | null> {
  const supabase = createPublicClient()

  // Try by ID first, then by slug
  let { data, error } = await supabase
    .from('stories')
    .select(`
      *,
      author:authors(*),
      language:languages(*),
      category:categories(*),
      story_genres(genre_id, genres(*)),
      episodes:episodes(*)
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error || !data) {
    // Try by slug
    const result = await supabase
      .from('stories')
      .select(`
        *,
        author:authors(*),
        language:languages(*),
        category:categories(*),
        story_genres(genre_id, genres(*)),
        episodes:episodes(*)
      `)
      .eq('slug', id)
      .eq('status', 'published')
      .single()
    
    data = result.data
    error = result.error
  }

  if (error || !data) return null

  if (data.episodes) {
    data.episodes = data.episodes
      .filter((ep: any) => ep.status === 'published')
      .sort((a: any, b: any) => a.episode_number - b.episode_number)
  }

  return transformStory(data)
}

export async function getPublicLanguages(): Promise<{ id: string; name: string; code: string }[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('languages')
    .select('id, name, code')
    .eq('status', 'active')
    .order('display_order', { ascending: true })
  
  return data || []
}

export async function getPublicCategories(): Promise<{ id: string; name: string; slug: string; image_url?: string }[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, image_url')
    .eq('status', 'active')
    .order('display_order', { ascending: true })
  
  return data || []
}

export async function getPublicGenres(): Promise<Genre[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('genres')
    .select('*')
    .eq('status', 'active')
    .order('name', { ascending: true })

  if (!data) return []

  // Map the emoji icons to genre types
  const iconMap: Record<string, string> = {
    'fantasy': 'Sparkles', 'romance': 'Heart', 'mystery': 'Compass',
    'thriller': 'Zap', 'sci-fi': 'Cpu', 'horror': 'Ghost',
    'adventure': 'Map', 'drama': 'BookOpen', 'english': 'Globe',
    'telugu': 'Feather', 'short-stories': 'Clock',
  }

  return data.map(g => ({
    id: g.id,
    name: g.name,
    slug: g.slug,
    description: g.description || '',
    iconName: iconMap[g.slug] || 'BookOpen',
    count: 0,
  }))
}

export async function getPublicAuthors(): Promise<Author[]> {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('authors')
    .select('*, stories:stories(count)')
    .order('name', { ascending: true })

  if (!data) return []

  return data.map(a => ({
    id: a.id,
    name: a.name,
    avatar: a.image_url || '',
    bio: a.bio || '',
    storyCount: a.stories?.[0]?.count || 0,
  }))
}
