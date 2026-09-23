'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getStories(filters?: {
  status?: string
  language_id?: string
  category_id?: string
  search?: string
  featured?: boolean
  popular?: boolean
  trending?: boolean
}) {
  const supabase = await createClient()
  let query = supabase
    .from('stories')
    .select('*, author:authors(*), language:languages(*), category:categories(*), story_genres(genre_id, genres(*))')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (filters?.status) query = query.eq('status', filters.status)
  if (filters?.language_id) query = query.eq('language_id', filters.language_id)
  if (filters?.category_id) query = query.eq('category_id', filters.category_id)
  if (filters?.featured) query = query.eq('featured', true)
  if (filters?.popular) query = query.eq('popular', true)
  if (filters?.trending) query = query.eq('trending', true)
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,short_synopsis.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getStoryById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stories')
    .select('*, author:authors(*), language:languages(*), category:categories(*), story_genres(genre_id, genres(*))')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function getStoryBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stories')
    .select('*, author:authors(*), language:languages(*), category:categories(*), story_genres(genre_id, genres(*))')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function createStory(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const short_synopsis = formData.get('short_synopsis') as string
  const full_synopsis = formData.get('full_synopsis') as string
  const author_id = formData.get('author_id') as string || null
  const language_id = formData.get('language_id') as string || null
  const category_id = formData.get('category_id') as string || null
  const status = formData.get('status') as string || 'draft'
  const access_type = formData.get('access_type') as string || 'free'
  const cover_url = formData.get('cover_url') as string
  const cover_public_id = formData.get('cover_public_id') as string
  const featured = formData.get('featured') === 'true'
  const popular = formData.get('popular') === 'true'
  const trending = formData.get('trending') === 'true'
  const seo_title = formData.get('seo_title') as string
  const seo_description = formData.get('seo_description') as string
  const genre_ids = formData.get('genre_ids') as string

  const published_at = status === 'published' ? new Date().toISOString() : null

  const { data, error } = await supabase
    .from('stories')
    .insert([{
      title, slug, short_synopsis, full_synopsis,
      author_id: author_id || null,
      language_id: language_id || null,
      category_id: category_id || null,
      status, access_type,
      cover_url: cover_url || null,
      cover_public_id: cover_public_id || null,
      featured, popular, trending,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      published_at
    }])
    .select()

  if (error) return { error: error.message }

  // Insert genre associations
  if (data && data[0] && genre_ids) {
    const gids = genre_ids.split(',').filter(Boolean)
    if (gids.length > 0) {
      await supabase.from('story_genres').insert(
        gids.map(gid => ({ story_id: data[0].id, genre_id: gid }))
      )
    }
  }

  revalidatePath('/admin/stories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')

  return { data }
}

export async function updateStory(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const short_synopsis = formData.get('short_synopsis') as string
  const full_synopsis = formData.get('full_synopsis') as string
  const author_id = formData.get('author_id') as string || null
  const language_id = formData.get('language_id') as string || null
  const category_id = formData.get('category_id') as string || null
  const status = formData.get('status') as string
  const access_type = formData.get('access_type') as string || 'free'
  const cover_url = formData.get('cover_url') as string
  const cover_public_id = formData.get('cover_public_id') as string
  const featured = formData.get('featured') === 'true'
  const popular = formData.get('popular') === 'true'
  const trending = formData.get('trending') === 'true'
  const seo_title = formData.get('seo_title') as string
  const seo_description = formData.get('seo_description') as string
  const genre_ids = formData.get('genre_ids') as string

  // Check if story was previously not published and is now being published
  const { data: existing } = await supabase.from('stories').select('status, published_at').eq('id', id).single()
  let published_at = existing?.published_at
  if (status === 'published' && existing?.status !== 'published') {
    published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('stories')
    .update({
      title, slug, short_synopsis, full_synopsis,
      author_id: author_id || null,
      language_id: language_id || null,
      category_id: category_id || null,
      status, access_type,
      cover_url: cover_url || null,
      cover_public_id: cover_public_id || null,
      featured, popular, trending,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      published_at
    })
    .eq('id', id)
    .select()

  if (error) return { error: error.message }

  // Update genre associations
  if (genre_ids !== null && genre_ids !== undefined) {
    await supabase.from('story_genres').delete().eq('story_id', id)
    const gids = genre_ids.split(',').filter(Boolean)
    if (gids.length > 0) {
      await supabase.from('story_genres').insert(
        gids.map(gid => ({ story_id: id, genre_id: gid }))
      )
    }
  }

  revalidatePath('/admin/stories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')

  return { data }
}

export async function deleteStory(id: string) {
  const supabase = await createClient()

  // Delete genre associations first
  await supabase.from('story_genres').delete().eq('story_id', id)
  // Delete episodes
  await supabase.from('episodes').delete().eq('story_id', id)
  // Delete story
  const { error } = await supabase.from('stories').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/stories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')

  return { success: true }
}
