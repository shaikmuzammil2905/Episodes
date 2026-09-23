'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAuthors() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true })
    
  if (error) throw error
  return data
}

export async function createAuthor(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const bio = formData.get('bio') as string
  const image_url = formData.get('image_url') as string
  const image_public_id = formData.get('image_public_id') as string

  const { data, error } = await supabase
    .from('authors')
    .insert([{ name, slug, bio, image_url, image_public_id }])
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/authors')
  revalidatePath('/', 'layout')
  revalidatePath('/authors')
  
  return { data }
}

export async function updateAuthor(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const bio = formData.get('bio') as string
  const image_url = formData.get('image_url') as string
  const image_public_id = formData.get('image_public_id') as string

  const { data, error } = await supabase
    .from('authors')
    .update({ name, slug, bio, image_url, image_public_id })
    .eq('id', id)
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/authors')
  revalidatePath('/', 'layout')
  revalidatePath('/authors')
  
  return { data }
}

export async function deleteAuthor(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('authors')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/authors')
  revalidatePath('/', 'layout')
  revalidatePath('/authors')
  
  return { success: true }
}
