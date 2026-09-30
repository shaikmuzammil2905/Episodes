import { getPublicStories, getPublicLanguages, getPublicCategories, getPublicGenres } from '@/lib/supabase/queries'
import HomePageClient from './HomePageClient'
import type { Metadata } from 'next'

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Read Engaging Stories, Novels & Short Stories Online | Discover New Stories.",
  description: "Discover engaging novels, short stories, long stories and fun stories. Read original stories, explore new genres and enjoy fresh storytelling online.",
  openGraph: {
    title: "Read Engaging Stories, Novels & Short Stories Online | Discover New Stories.",
    description: "Discover engaging novels, short stories, long stories and fun stories. Read original stories, explore new genres and enjoy fresh storytelling online.",
  },
}

export default async function HomePage() {
  let stories: import('@/lib/types').Story[] = []
  let languages: { id: string; name: string; code: string }[] = []
  let categories: { id: string; name: string; slug: string }[] = []
  let genres: import('@/lib/types').Genre[] = []
  
  try {
    const [dbStories, dbLanguages, dbCategories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicLanguages(),
      getPublicCategories(),
      getPublicGenres(),
    ])
    stories = dbStories || []
    languages = dbLanguages || []
    categories = dbCategories || []
    genres = dbGenres || []
  } catch (error) {
    console.error('Failed to fetch from Supabase database:', error)
  }

  // Build language list from real languages, ensuring Telugu and English are available
  const langSet = new Set<string>(['All Languages', 'English', 'Telugu'])
  languages.forEach(l => {
    if (l.name) langSet.add(l.name)
  })
  stories.forEach(s => {
    if (s.language) langSet.add(s.language)
  })
  const languageNames = Array.from(langSet)

  const catSet = new Set<string>(['Novels', 'Long Stories', 'Short Stories', 'Fun Stories', 'Comedy Stories'])
  categories.forEach(c => {
    if (c.name) catSet.add(c.name)
  })
  const categoryNames = Array.from(catSet)

  return (
    <HomePageClient
      stories={stories}
      genres={genres}
      languageNames={languageNames}
      categoryNames={categoryNames}
    />
  )
}
