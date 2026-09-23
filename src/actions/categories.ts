'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    
  if (error) throw error
  return data
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const status = formData.get('status') as string || 'active'
  const display_order = parseInt(formData.get('display_order') as string || '0')

  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug, description, image_url, status, display_order }])
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')
  
  return { data }
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const image_url = formData.get('image_url') as string
  const status = formData.get('status') as string
  const display_order = parseInt(formData.get('display_order') as string || '0')

  const { data, error } = await supabase
    .from('categories')
    .update({ name, slug, description, image_url, status, display_order })
    .eq('id', id)
    .select()

  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')
  
  return { data }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/categories')
  revalidatePath('/', 'layout')
  revalidatePath('/stories')
  
  return { success: true }
}
