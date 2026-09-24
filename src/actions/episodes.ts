'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEpisodes(storyId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('episodes')
    .select('*, story:stories(id, title, slug)')
    .order('episode_number', { ascending: true })

  if (storyId) query = query.eq('story_id', storyId)

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function getEpisodeById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('episodes')
    .select('*, story:stories(id, title, slug, author:authors(name))')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export async function createEpisode(formData: FormData) {
  const supabase = await createClient()

  const story_id = formData.get('story_id') as string
  const episode_number = parseInt(formData.get('episode_number') as string || '1')
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const summary = formData.get('summary') as string
  const content = formData.get('content') as string
  const image_url = formData.get('image_url') as string
  const image_public_id = formData.get('image_public_id') as string
  const status = formData.get('status') as string || 'draft'
  const access_type = formData.get('access_type') as string || 'free'
  const seo_title = formData.get('seo_title') as string
  const seo_description = formData.get('seo_description') as string

  const published_at = status === 'published' ? new Date().toISOString() : null

  const { data, error } = await supabase
    .from('episodes')
    .insert([{
      story_id, episode_number, title, slug,
      summary: summary || null,
      content: content || null,
      image_url: image_url || null,
      image_public_id: image_public_id || null,
      status, access_type,
      display_order: episode_number,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      published_at
    }])
    .select()

  if (error) {
    if (error.code === '23505') {
      if (error.message.includes('episode_number')) {
        return { error: `Episode ${episode_number} already exists for this story. Please choose another episode number.` }
      }
      if (error.message.includes('slug')) {
        return { error: 'This episode URL (slug) already exists for this story. Please choose another slug.' }
      }
      return { error: 'A duplicate record already exists.' }
    }
    return { error: error.message }
  }

  revalidatePath('/admin/episodes')
  revalidatePath('/admin/stories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')

  return { data }
}

export async function updateEpisode(id: string, formData: FormData) {
  const supabase = await createClient()

  const episode_number = parseInt(formData.get('episode_number') as string || '1')
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const summary = formData.get('summary') as string
  const content = formData.get('content') as string
  const image_url = formData.get('image_url') as string
  const image_public_id = formData.get('image_public_id') as string
  const status = formData.get('status') as string
  const access_type = formData.get('access_type') as string || 'free'
  const seo_title = formData.get('seo_title') as string
  const seo_description = formData.get('seo_description') as string

  const { data: existing } = await supabase.from('episodes').select('status, published_at').eq('id', id).single()
  let published_at = existing?.published_at
  if (status === 'published' && existing?.status !== 'published') {
    published_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('episodes')
    .update({
      episode_number, title, slug,
      summary: summary || null,
      content: content || null,
      image_url: image_url || null,
      image_public_id: image_public_id || null,
      status, access_type,
      display_order: episode_number,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      published_at
    })
    .eq('id', id)
    .select()

  if (error) {
    if (error.code === '23505') {
      if (error.message.includes('episode_number')) {
        return { error: `Episode ${episode_number} already exists for this story. Please choose another episode number.` }
      }
      if (error.message.includes('slug')) {
        return { error: 'This episode URL (slug) already exists for this story. Please choose another slug.' }
      }
      return { error: 'A duplicate record already exists.' }
    }
    return { error: error.message }
  }

  revalidatePath('/admin/episodes')
  revalidatePath('/admin/stories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')

  return { data }
}

export async function deleteEpisode(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('episodes').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/episodes')
  revalidatePath('/admin/stories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')

  return { success: true }
}
