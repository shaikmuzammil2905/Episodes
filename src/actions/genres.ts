'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getGenres() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('genres')
    .select('*')
    .order('name', { ascending: true })
    
  if (error) throw error
  return data
}

export async function createGenre(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string || 'active'

  const { data, error } = await supabase
    .from('genres')
    .insert([{ name, slug, description, status }])
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/genres')
  revalidatePath('/')
  revalidatePath('/stories')
  revalidatePath('/genres')
  
  return { data }
}

export async function updateGenre(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const status = formData.get('status') as string

  const { data, error } = await supabase
    .from('genres')
    .update({ name, slug, description, status })
    .eq('id', id)
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/genres')
  revalidatePath('/')
  revalidatePath('/stories')
  revalidatePath('/genres')
  
  return { data }
}

export async function deleteGenre(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('genres')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/genres')
  revalidatePath('/')
  revalidatePath('/stories')
  revalidatePath('/genres')
  
  return { success: true }
}
