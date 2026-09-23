import { createClient } from '@/lib/supabase/server'
import EpisodesClient from './EpisodesClient'

export default async function EpisodesAdminPage() {
  const supabase = await createClient()

  const [{ data: episodes }, { data: stories }] = await Promise.all([
    supabase.from('episodes').select('*, story:stories(id, title, slug)').order('episode_number', { ascending: true }),
    supabase.from('stories').select('id, title').order('title', { ascending: true })
  ])

  return (
    <EpisodesClient
      initialEpisodes={episodes || []}
      stories={stories || []}
    />
  )
}
