import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { AUTHORS, GENRES, STORIES } from '@/lib/data'

export async function POST(request: Request) {
  const supabase = await createClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { step } = await request.json()

    switch (step) {
      case 'languages':
        const languages = [
          { code: 'en', name: 'English', native_name: 'English', status: 'active', display_order: 1 },
          { code: 'te', name: 'Telugu', native_name: 'తెలుగు', status: 'active', display_order: 2 }
        ]
        const { error: langError } = await supabase.from('languages').upsert(languages, { onConflict: 'code' })
        if (langError) throw new Error(`Languages: ${langError.message}`)
        return NextResponse.json({ success: true, message: 'Languages imported.' })

      case 'categories':
        const categories = [
          { slug: 'novels', name: 'Novels', description: 'Full length novels' },
          { slug: 'long-stories', name: 'Long Stories', description: 'Long reads' },
          { slug: 'short-stories', name: 'Short Stories', description: 'Quick reads' },
          { slug: 'fun-stories', name: 'Fun Stories', description: 'Lighthearted stories' },
          { slug: 'historical-stories', name: 'Historical Stories', description: 'Historical fiction' }
        ]
        const { error: catError } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' })
        if (catError) throw new Error(`Categories: ${catError.message}`)
        return NextResponse.json({ success: true, message: 'Categories imported.' })

      case 'genres':
        const genresToInsert = GENRES.map(g => ({
          slug: g.slug,
          name: g.name,
          description: g.description,
          icon_name: g.iconName
        }))
        const { error: genreError } = await supabase.from('genres').upsert(genresToInsert, { onConflict: 'slug' })
        if (genreError) throw new Error(`Genres: ${genreError.message}`)
        return NextResponse.json({ success: true, message: 'Genres imported.' })

      case 'authors':
        const authorsToInsert = AUTHORS.map(a => ({
          slug: a.id,
          name: a.name,
          bio: a.bio,
          image_url: a.avatar
        }))
        const { error: authError } = await supabase.from('authors').upsert(authorsToInsert, { onConflict: 'slug' })
        if (authError) throw new Error(`Authors: ${authError.message}`)
        return NextResponse.json({ success: true, message: 'Authors imported.' })

      case 'stories':
        // We need the languages, authors, and categories to link relations
        const { data: dbLangs } = await supabase.from('languages').select('id, code')
        const { data: dbAuths } = await supabase.from('authors').select('id, slug')
        const { data: dbCats } = await supabase.from('categories').select('id, slug')
        const { data: dbGenres } = await supabase.from('genres').select('id, slug')

        for (const story of STORIES) {
          const authorId = dbAuths?.find(a => a.slug === story.authorId)?.id
          const languageId = story.language.toLowerCase().includes('telugu') ? 
                             dbLangs?.find(l=>l.code==='te')?.id : dbLangs?.find(l=>l.code==='en')?.id
          const categoryId = dbCats?.find(c => c.slug === (story.genreId === 'short-stories' ? 'short-stories' : 'novels'))?.id

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

          if (storyError) throw new Error(`Story '${story.slug}': ${storyError.message}`)

          const genreId = dbGenres?.find(g => g.slug === story.genreId)?.id
          if (genreId && insertedStory) {
            const { error: sgError } = await supabase.from('story_genres').upsert({
              story_id: insertedStory.id,
              genre_id: genreId
            })
            if (sgError) console.error("Story Genre Error:", sgError)
          }

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
            if (epError) throw new Error(`Episodes for '${story.slug}': ${epError.message}`)
          }
        }
        return NextResponse.json({ success: true, message: 'Stories and Episodes imported.' })

      default:
        return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
    }

  } catch (error: any) {
    console.error(`Seeding error (${error.message}):`, error)
    return NextResponse.json({ error: error.message || 'Failed to seed database' }, { status: 500 })
  }
}
