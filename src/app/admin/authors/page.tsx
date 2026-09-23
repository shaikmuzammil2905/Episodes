import { getAuthors } from '@/actions/authors'
import AuthorsClient from './AuthorsClient'

export default async function AuthorsAdminPage() {
  const authors = await getAuthors()
  return <AuthorsClient initialAuthors={authors} />
}
