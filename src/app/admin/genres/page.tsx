import { getGenres } from '@/actions/genres'
import GenresClient from './GenresClient'

export default async function GenresPage() {
  const genres = await getGenres()
  return <GenresClient initialGenres={genres} />
}
