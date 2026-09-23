import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { AUTHORS, GENRES, STORIES } from '@/lib/data'

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    // 1. Ensure user is admin (optional, but good practice. Assuming route is protected or checked)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Insert Languages (Hardcoded for now based on requirements)
    const languages = [
      { code: 'en', name: 'English', native_name: 'English', status: 'active', display_order: 1 },
      { code: 'te', name: 'Telugu', native_name: 'తెలుగు', status: 'active', display_order: 2 }
    ]
    const { data: insertedLanguages, error: langError } = await supabase.from('languages').upsert(languages, { onConflict: 'code' }).select()
    if (langError) throw langError

    const enLang = insertedLanguages?.find(l => l.code === 'en')
    const teLang = insertedLanguages?.find(l => l.code === 'te')

    // 3. Insert Categories
    const categories = [
      { slug: 'novels', name: 'Novels', description: 'Full length novels' },
      { slug: 'long-stories', name: 'Long Stories', description: 'Long reads' },
      { slug: 'short-stories', name: 'Short Stories', description: 'Quick reads' },
      { slug: 'fun-stories', name: 'Fun Stories', description: 'Lighthearted stories' }
    ]
    const { data: insertedCategories, error: catError } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select()
    if (catError) throw catError

    // 4. Insert Genres
    const genresToInsert = GENRES.map(g => ({
      slug: g.slug,
      name: g.name,
      description: g.description,
      icon_name: g.iconName
    }))
    const { data: insertedGenres, error: genreError } = await supabase.from('genres').upsert(genresToInsert, { onConflict: 'slug' }).select()
    if (genreError) throw genreError

    // 5. Insert Authors
    const authorsToInsert = AUTHORS.map(a => ({
      slug: a.id,
      name: a.name,
      bio: a.bio,
      avatar_url: a.avatar
    }))
    const { data: insertedAuthors, error: authError } = await supabase.from('authors').upsert(authorsToInsert, { onConflict: 'slug' }).select()
    if (authError) throw authError

    // 6. Insert Stories & Episodes
    for (const story of STORIES) {
      // Find foreign keys
      const authorId = insertedAuthors?.find(a => a.slug === story.authorId)?.id
      const languageId = story.language.toLowerCase().includes('telugu') ? teLang?.id : enLang?.id
      const categoryId = insertedCategories?.find(c => c.slug === (story.genreId === 'short-stories' ? 'short-stories' : 'novels'))?.id

      // Upsert Story
      const { data: insertedStory, error: storyError } = await supabase.from('stories').upsert({
        slug: story.slug,
        title: story.title,
        short_synopsis: story.shortDescription,
        full_synopsis: story.fullDescription,
        author_id: authorId,
        language_id: languageId,
        category_id: categoryId,
        status: story.status.toLowerCase() === 'ongoing' || story.status.toLowerCase() === 'completed' ? 'published' : 'draft',
        access_type: story.isPremium ? 'premium' : 'free',
        cover_url: story.coverImage,
        featured: story.featured,
        popular: story.recommended,
        published_at: new Date().toISOString()
      }, { onConflict: 'slug' }).select().single()

      if (storyError) throw storyError

      // Link Story to Genre
      const genreId = insertedGenres?.find(g => g.slug === story.genreId)?.id
      if (genreId && insertedStory) {
        await supabase.from('story_genres').upsert({
          story_id: insertedStory.id,
          genre_id: genreId
        })
      }

      // Insert Episodes
      if (story.episodes && story.episodes.length > 0 && insertedStory) {
        const episodesToInsert = story.episodes.map(ep => ({
          story_id: insertedStory.id,
          slug: ep.id,
          title: ep.title,
          episode_number: ep.episodeNumber,
          content: ep.content,
          summary: ep.summary,
          status: 'published',
          published_at: new Date(ep.publishedAt).toISOString()
        }))
        
        const { error: epError } = await supabase.from('episodes').upsert(episodesToInsert, { onConflict: 'story_id, episode_number' })
        if (epError) throw epError
      }
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully!' })
  } catch (error: any) {
    console.error('Seeding error:', error)
    return NextResponse.json({ error: error.message || 'Failed to seed database' }, { status: 500 })
  }
}
