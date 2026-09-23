import { getStories } from '@/actions/stories'
import { getAuthors } from '@/actions/authors'
import { getLanguages } from '@/actions/languages'
import { getCategories } from '@/actions/categories'
import { getGenres } from '@/actions/genres'
import StoriesClient from './StoriesClient'

export default async function StoriesAdminPage() {
  const [stories, authors, languages, categories, genres] = await Promise.all([
    getStories(),
    getAuthors(),
    getLanguages(),
    getCategories(),
    getGenres()
  ])

  return (
    <StoriesClient
      initialStories={stories}
      refData={{ authors, languages, categories, genres }}
    />
  )
}
