import { getPublicStories, getPublicLanguages, getPublicCategories, getPublicGenres } from '@/lib/supabase/queries'
import { STORIES as FALLBACK_STORIES, GENRES as FALLBACK_GENRES } from '@/lib/data'
import HomePageClient from './HomePageClient'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function HomePage() {
  let stories, languages, categories, genres
  
  try {
    [stories, languages, categories, genres] = await Promise.all([
      getPublicStories(),
      getPublicLanguages(),
      getPublicCategories(),
      getPublicGenres(),
    ])
  } catch (error) {
    console.error('Failed to fetch from database, using fallback data:', error)
    stories = FALLBACK_STORIES
    genres = FALLBACK_GENRES
    languages = [{ id: '1', name: 'English', code: 'en' }, { id: '2', name: 'Telugu', code: 'te' }]
    categories = [{ id: '1', name: 'Novels', slug: 'novels' }]
  }

  // If no stories from DB yet, use fallback
  if (!stories || stories.length === 0) {
    stories = FALLBACK_STORIES
  }

  if (!genres || genres.length === 0) {
    genres = FALLBACK_GENRES
  }

  const languageNames = ['All Languages', ...languages.map(l => l.name)]
  const categoryNames = categories.map(c => c.name)

  return (
    <HomePageClient
      stories={stories}
      genres={genres}
      languageNames={languageNames.length > 1 ? languageNames : ['All Languages', 'English', 'Telugu']}
      categoryNames={categoryNames.length > 0 ? categoryNames : ['Novels', 'Long Stories', 'Short Stories', 'Fun Stories']}
    />
  )
}
